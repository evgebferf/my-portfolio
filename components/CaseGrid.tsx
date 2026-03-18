'use client';

import { useState, useRef, FormEvent, KeyboardEvent, useMemo, useEffect } from 'react';
import Link from 'next/link';
import CaseCard from './CaseCard';
import TechCaseCard from './TechCaseCard'; // <-- ИМПОРТИРУЕМ НОВЫЙ КОМПОНЕНТ
import ReactMarkdown from 'react-markdown';

export interface Project {
  slug: string;
  title: string;
  tags: string;
  previewImage: string;
  size?: 'standard' | 'wide' | 'narrow';
  computedSize?: string;
  // Новые поля для скриптов (необязательные)
  type?: 'visual' | 'tech';
  codeSnippet?: string;
  description?: string;
}

interface CaseGridProps {
  initialProjects: Project[];
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

// Вопросы для Арт-диров, которые будут работать как главные заголовки
const SUGGESTED_QUESTIONS = [
  "What's your experience with large-scale multimedia projects?",
  "Can you handle complex Houdini simulations?",
  "What is your primary 3D pipeline and software stack?",
  "Do you have experience with photorealistic product CGI?",
  "Can you adapt to both stylized and realistic art direction?"
];

// УМНЫЙ АЛГОРИТМ СЕТКИ
function processSmartGrid(projects: Project[]) {
  const grid: Project[] = [];
  let currentRow: Project[] = [];
  let currentCols = 2;
  let prevPattern: string | null = null;
  let isFirstRow = true;

  const pool = projects.map(p => ({ ...p, computedSize: p.size || 'standard' }));

  const getCols = (size: string) => {
    if (size === 'wide' || size === 'span-4') return 4;
    if (size === 'span-3') return 3;
    if (size === 'narrow') return 1;
    return 2;
  };

  const setCols = (item: Project, targetCols: number) => {
    if (targetCols === 1) item.computedSize = 'narrow';
    else if (targetCols === 2) item.computedSize = 'standard';
    else if (targetCols === 3) item.computedSize = 'span-3';
    else if (targetCols >= 4) item.computedSize = 'span-4';
  };

  while (pool.length > 0) {
    const leftInRow = 4 - currentCols;

    if (leftInRow === 0) {
      const firstSize = getCols(currentRow[0]?.computedSize || 'standard');
      const pattern = firstSize === 2 ? 'standard-first' : (firstSize === 1 ? 'narrow-first' : 'other');
      
      if (!isFirstRow && pattern !== 'other' && prevPattern === pattern) {
        currentRow.reverse();
      }
      
      if (!isFirstRow) prevPattern = pattern;

      grid.push(...currentRow);
      currentRow = [];
      currentCols = 0;
      isFirstRow = false;
      continue;
    }

    let index = -1;

    if (isFirstRow && leftInRow === 2 && pool[0].computedSize === 'wide') {
      setCols(pool[0], 2);
      index = 0;
    } 
    else if (getCols(pool[0].computedSize!) <= leftInRow) {
      index = 0;
    } 
    else {
      index = pool.findIndex(p => getCols(p.computedSize!) === leftInRow);
      if (index === -1) {
        index = pool.findIndex(p => getCols(p.computedSize!) < leftInRow);
      }
    }

    if (index !== -1) {
      const item = pool.splice(index, 1)[0];
      currentRow.push(item);
      currentCols += getCols(item.computedSize!);
    } else {
      if (currentRow.length > 0) {
        let stretchIndex = currentRow.length - 1;
        while (stretchIndex >= 0) {
          const origSize = currentRow[stretchIndex].size || 'standard';
          if (origSize !== 'narrow') break;
          stretchIndex--;
        }

        if (stretchIndex >= 0) {
          const itemToStretch = currentRow[stretchIndex];
          setCols(itemToStretch, getCols(itemToStretch.computedSize!) + leftInRow);
          currentCols += leftInRow; 
        } else {
          currentCols = 4; 
        }
      } else {
        const item = pool.shift()!;
        const origSize = item.size || 'standard';
        if (origSize !== 'narrow') {
          setCols(item, leftInRow);
        }
        currentRow.push(item);
        currentCols += getCols(item.computedSize!);
      }
    }
  }

  if (currentRow.length > 0) {
    grid.push(...currentRow);
  }

  return grid;
}

export default function CaseGrid({ initialProjects }: CaseGridProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0); 
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const smartProjects = useMemo(() => processSmartGrid(projects), [projects]);

  useEffect(() => {
    if (messages.length > 0 || isTyping) return; 
    const interval = setInterval(() => {
      setQuestionIndex((prev) => (prev + 1) % SUGGESTED_QUESTIONS.length);
    }, 4000); 
    return () => clearInterval(interval);
  }, [messages.length, isTyping]);

  const handleSearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const currentQuery = query.trim();
    setMessages(prev => [{ sender: 'user', text: currentQuery }, ...prev]);
    setQuery('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentQuery, projects: initialProjects }),
      });
      if (!res.ok) throw new Error('Ошибка сервера');
      const data = await res.json();
      setMessages(prev => [{ sender: 'ai', text: data.answer }, ...prev]);
      
      const sorted = [...initialProjects].sort((a, b) => {
        const aRel = data.relevantSlugs.includes(a.slug);
        const bRel = data.relevantSlugs.includes(b.slug);
        return aRel === bRel ? 0 : aRel ? -1 : 1;
      });
      setProjects(sorted);
    } catch (error) {
      setMessages(prev => [{ sender: 'ai', text: "Connection error. Please try again." }, ...prev]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleQuestionClick = (q: string) => {
    setQuery(q);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <section className="case-grid">
      <div className="glow-container">
        <article className="chat-card">
          <div className="messages-list">
  {/* 1. ТОЧКИ (isTyping) — теперь они ПЕРВЫЕ в коде, значит будут САМЫМИ НИЖНИМИ на экране */}
  {isTyping && (
    <div className="message ai">
      <div className="typing-dots"><span></span><span></span><span></span></div>
    </div>
  )}

  {/* 2. СООБЩЕНИЯ */}
  {messages.map((m, i) => (
    <div key={i} className={`message ${m.sender}`}>
      {m.sender === 'ai' ? (
        <div className="markdown-content">
          <ReactMarkdown>{m.text}</ReactMarkdown>
        </div>
      ) : (
        m.text
      )}
    </div>
  ))}

  {/* 3. ТВОЙ ЗАГОЛОВОК (ЭФФЕКТ ПЕРЕМОТКИ) */}
  {/* Оставляем его в конце списка: при column-reverse он будет в самом верху над сообщениями */}
  {messages.length === 0 && (
    <div className="empty-state">
      <div className="empty-content">
        <div className="dynamic-headline-wrapper">
          {SUGGESTED_QUESTIONS.map((q, idx) => {
            const isActive = idx === questionIndex;
            const isPrev = idx === (questionIndex - 1 + SUGGESTED_QUESTIONS.length) % SUGGESTED_QUESTIONS.length;
            
            let className = "dynamic-headline";
            if (isActive) className += " active";
            else if (isPrev) className += " prev";
            else className += " next";

            return (
              <h3 
                key={idx}
                className={className} 
                onClick={() => handleQuestionClick(q)}
              >
                "{q}"
              </h3>
            );
          })}
        </div>
        <p className="empty-subtitle">
          Click the question above or ask my AI agent about your specific needs.
        </p>
      </div>
    </div>
  )}
</div>
          <form className="chat-input-wrapper" onSubmit={handleSearch}>
            <textarea 
              ref={textareaRef} 
              value={query} 
              onChange={handleTextareaChange} 
              onKeyDown={handleKeyDown} 
              placeholder="Ask about my pipeline, experience, or projects..." 
              rows={1} 
            />
            <button type="submit" className="send-btn" disabled={!query.trim() || isTyping}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </article>
      </div>

      {smartProjects.map((p) => {
        // МАГИЯ ЗДЕСЬ: Если проект wide или помечен как tech — выводим терминал
        const isTechProject = p.size === 'wide' || p.type === 'tech';

        return (
          <Link 
            key={p.slug} 
            href={`/portfolio/${p.slug}`}
            className={`case-link size-${p.computedSize}`}
          >
            {isTechProject ? (
              <TechCaseCard 
                title={p.title} 
                tags={p.tags} 
                description={p.description || "Pipeline automation & scripting. Custom tools to speed up workflow and solve complex technical challenges."} 
                codeSnippet={p.codeSnippet || "# Initializing automation script...\nimport c4d\nimport os\n\nprint('System Ready.')\n# Executing sequence..."} 
              />
            ) : (
              <CaseCard title={p.title} tags={p.tags} imageSrc={p.previewImage} />
            )}
          </Link>
        );
      })}
    </section>
  );
}
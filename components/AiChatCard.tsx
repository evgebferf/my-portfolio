'use client';

import { useState, useRef, FormEvent, KeyboardEvent, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Project } from './CaseGrid'; // Убедись, что путь правильный

interface AiChatCardProps {
  initialProjects: Project[];
  onSearchResults: (relevantSlugs: string[]) => void;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

const SUGGESTED_QUESTIONS = [
  "What's your experience with large-scale multimedia projects?",
  "Can you handle complex Houdini simulations?",
  "What is your primary 3D pipeline and software stack?",
  "Do you have experience with photorealistic product CGI?",
  "Can you adapt to both stylized and realistic art direction?"
];

export default function AiChatCard({ initialProjects, onSearchResults }: AiChatCardProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  
  // ДОБАВЛЕНО: Стейт для всплывающей кнопки скролла
  const [newResultsCount, setNewResultsCount] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Зацикливание вопросов
  useEffect(() => {
    if (messages.length > 0 || isTyping) return;
    const interval = setInterval(() => {
      setQuestionIndex((prev) => (prev + 1) % SUGGESTED_QUESTIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [messages.length, isTyping]);

  const handleSearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isTyping) return;

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
      
      const data = await res.json();
      setMessages(prev => [{ sender: 'ai', text: data.answer }, ...prev]);

      // Передаем релевантные слаги в родительский компонент для сортировки
      if (data.relevantSlugs) {
        onSearchResults(data.relevantSlugs);
        
        // ДОБАВЛЕНО: Показываем кнопку, если есть результаты
        if (data.relevantSlugs.length > 0) {
          setNewResultsCount(data.relevantSlugs.length);
        }
      }
    } catch (error) {
      setMessages(prev => [{ sender: 'ai', text: "**Error:** Connection lost. Please try again." }, ...prev]);
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
    // ДОБАВЛЕНО: Скрываем кнопку, как только юзер начинает печатать новый вопрос
    setNewResultsCount(0); 
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleQuestionClick = (q: string) => {
    setQuery(q);
    textareaRef.current?.focus();
  };

 // ДОБАВЛЕНО: Функция для скролла к проектам
  const scrollToGrid = () => {
    // Ищем ПЕРВУЮ карточку проекта, а не саму сетку
    const firstProject = document.querySelector('.case-link');
    
    if (firstProject) {
      // Подбираем отступ (чтобы карточка не прилипала к самому верху экрана)
      const yOffset = -20; 
      const y = firstProject.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      // Фолбэк на всякий случай: просто прокручиваем экран на 80% вниз
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    }
    
    // Прячем кнопку после клика
    setNewResultsCount(0); 
  };

  return (
    <div className="glow-container">
      <article className="chat-card">
        <div className="messages-list">
          {isTyping && (
            <div className="message ai">
              <div className="typing-dots"><span></span><span></span><span></span></div>
            </div>
          )}

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

          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-content">
                <div className="dynamic-headline-wrapper">
                  {SUGGESTED_QUESTIONS.map((q, idx) => {
                    const isActive = idx === questionIndex;
                    const isPrev = idx === (questionIndex - 1 + SUGGESTED_QUESTIONS.length) % SUGGESTED_QUESTIONS.length;
                    let className = `dynamic-headline ${isActive ? 'active' : isPrev ? 'prev' : 'next'}`;

                    return (
                      <h3 key={idx} className={className} onClick={() => handleQuestionClick(q)}>
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

        {/* --- ДОБАВЛЕНО: ВСПЛЫВАЮЩАЯ ТАБЛЕТКА ДЛЯ МОБИЛОК --- */}
        {newResultsCount > 0 && (
          <div className="scroll-toast-wrapper">
            <button className="scroll-toast-btn" onClick={scrollToGrid}>
              View {newResultsCount} relevant projects ↓
            </button>
          </div>
        )}

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
  );
}
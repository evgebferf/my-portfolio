'use client';

import { useEffect, useState, useRef } from 'react';

interface TechCaseCardProps {
  title: string;
  tags: string;
  description: string;
  codeSnippet: string;
}

export default function TechCaseCard({ title, tags, description, codeSnippet }: TechCaseCardProps) {
  const [displayedCode, setDisplayedCode] = useState('');
  const [phase, setPhase] = useState<'TYPING' | 'SUCCESS' | 'RESTART'>('TYPING');
  const scrollRef = useRef<HTMLPreElement>(null);

  // Логика печатания кода
  useEffect(() => {
    if (phase === 'TYPING') {
      let currentIndex = 0;
      const charsPerTick = 1; // Медленная, плавная печать
      const typingDelay = 15; 
      
      const interval = setInterval(() => {
        setDisplayedCode(codeSnippet.substring(0, currentIndex));
        currentIndex += charsPerTick;
        
        if (currentIndex > codeSnippet.length + charsPerTick) {
          clearInterval(interval);
          setPhase('SUCCESS');
        }
      }, typingDelay); 

      return () => clearInterval(interval);
    } 
    
    if (phase === 'SUCCESS') {
      const timeout = setTimeout(() => {
        setDisplayedCode(prev => prev + '\n\n>>> Execution successful.\n>>> Process finished with exit code 0.\n>>> Rebooting...');
        
        // Пауза перед тем, как стереть и начать заново (5 секунд)
        setTimeout(() => setPhase('RESTART'), 5000);
      }, 500);
      
      return () => clearTimeout(timeout);
    }

    if (phase === 'RESTART') {
      setDisplayedCode('');
      setPhase('TYPING');
    }
  }, [phase, codeSnippet]);

  // Автоскролл вниз
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedCode]);

  return (
    <article className="tech-card-container">
      
      {/* 1. ШАПКА ОКНА (ТЕПЕРЬ СВЕРХУ ВО ВСЮ ШИРИНУ) */}
      <div className="terminal-header">
        <span className="dot red"></span>
        <span className="dot yellow"></span>
        <span className="dot green"></span>
        <span className="terminal-title">automation_script.py</span>
      </div>

      {/* 2. НОВАЯ ОБЕРТКА ДЛЯ ВНУТРЕННЕГО КОНТЕНТА */}
      <div className="tech-content-wrapper">
        {/* ЛЕВАЯ ЧАСТЬ: Код */}
        <pre className="terminal-code" ref={scrollRef}>
          <code>{displayedCode}</code>
          <span className="cursor">█</span>
        </pre>

        {/* ПРАВАЯ ЧАСТЬ: Инфо */}
        <div className="tech-info">
          <h3 className="tech-title">{title}</h3>
          <p className="tech-tags">{tags}</p>
          <div className="tech-divider"></div>
          <p className="tech-description">{description}</p>
        </div>
      </div>

    </article>
  );
}
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
  // ДОБАВЛЕНО: Флаг для отслеживания паузы автоскролла
  const isAutoScrollPaused = useRef(false); 

  // Логика печатания кода (осталась без изменений)
  useEffect(() => {
    if (phase === 'TYPING') {
      let currentIndex = 0;
      const charsPerTick = 1; 
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
        
        setTimeout(() => setPhase('RESTART'), 5000);
      }, 500);
      
      return () => clearTimeout(timeout);
    }

    if (phase === 'RESTART') {
      setDisplayedCode('');
      setPhase('TYPING');
      // Сбрасываем паузу при перезапуске цикла
      isAutoScrollPaused.current = false; 
    }
  }, [phase, codeSnippet]);

  // ДОБАВЛЕНО: Функция, которая следит за ручным скроллом
  const handleUserScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    
    // Вычисляем, насколько далеко мы от низа. 
    // 50 пикселей — это буфер (tolerance), чтобы автоскролл не отключался от случайных микро-движений
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50;
    
    // Если мы НЕ внизу, ставим автоскролл на паузу
    isAutoScrollPaused.current = !isAtBottom;
  };

  // ОБНОВЛЕНО: Автоскролл вниз с проверкой
  useEffect(() => {
    if (scrollRef.current && !isAutoScrollPaused.current) {
      // Крутим вниз ТОЛЬКО если пользователь не читает верхний код
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedCode]);

  return (
    <article className="tech-card-container">
      
      <div className="terminal-header">
        <span className="dot red"></span>
        <span className="dot yellow"></span>
        <span className="dot green"></span>
        <span className="terminal-title">automation_script.py</span>
      </div>

      <div className="tech-content-wrapper">
        {/* ДОБАВЛЕНО: onScroll={handleUserScroll} */}
        <pre className="terminal-code" ref={scrollRef} onScroll={handleUserScroll}>
          <code>{displayedCode}</code>
          <span className="cursor">█</span>
        </pre>

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
'use client';
import { useEffect, useRef, useState } from 'react';
import Player from '@vimeo/player';

export default function ShowreelHero() {
  const videoRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      playerRef.current = new Player(videoRef.current);
      
      // Как только видео реально начало воспроизводиться — скрываем лоадер и постер
      playerRef.current.on('play', () => {
        setVideoLoaded(true);
      });
      
      // На случай, если автоплей сработал мгновенно до навешивания события
      playerRef.current.getPaused().then((paused) => {
        if (!paused) setVideoLoaded(true);
      });
    }
  }, []);

  const toggleSound = () => {
    if (playerRef.current) {
      const nextMuted = !isMuted;
      playerRef.current.setMuted(nextMuted);
      setIsMuted(nextMuted);
    }
  };

  return (
    <section className="showreel-hero">
      <div className="showreel-video-container">
        
        {/* ЛОАДЕР: Показывается пока videoLoaded === false */}
        <div 
          className="loader-container" 
          style={{ 
            opacity: videoLoaded ? 0 : 1,
            transition: 'opacity 0.5s ease',
            pointerEvents: 'none' // Чтобы не мешал кликам, если они будут
          }}
        >
          <div className="spinner"></div>
        </div>

        {/* ПОСТЕР: Перекрывает видео, пока оно грузится */}
        <div 
  className="video-poster" 
  style={{ 
    // Добавляем url() вокруг ссылки
    backgroundImage: `url('https://res.cloudinary.com/dpzh6zrh7/image/upload/v1773837639/Preloader_jakaix.png')`,
    opacity: videoLoaded ? 0 : 1,
    transition: 'opacity 0.8s ease'
  }} 
/>

        <iframe
          ref={videoRef}
          src="https://player.vimeo.com/video/1151613999?background=1&autoplay=1&loop=1&muted=1"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          title="Showreel"
          suppressHydrationWarning
        />
      </div>

      <div className="showreel-overlay">
        {/* --- ЭТО ДЛЯ ЯНДЕКСА И GOOGLE (Скрыто от глаз) --- */}
        <h1 className="visually-hidden">
          Evgeniy Prilepskiy - Motion Designer Portfolio
        </h1>

        {/* --- ЭТО ДЛЯ ЛЮДЕЙ (Визуальный заголовок) --- */}
        <h2 className="showreel-title">CG Generalist</h2>
        <p className="showreel-subtitle">3D &bull; CGI &bull; Motion Graphics</p>
      </div>

      <button className="sound-toggle" onClick={toggleSound}>
        {isMuted ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        )}
      </button>
    </section>
  );
}
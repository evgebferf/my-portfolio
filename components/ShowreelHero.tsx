'use client';
import { useEffect, useRef, useState } from 'react';
import Player from '@vimeo/player';

export default function ShowreelHero() {
  const videoRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      playerRef.current = new Player(videoRef.current);
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
        <iframe
          ref={videoRef}
          src="https://player.vimeo.com/video/1151613999?background=1&autoplay=1&loop=1&muted=1"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          title="Showreel"
        />
      </div>

      <div className="showreel-overlay">
        <h1 className="showreel-title">CG Generalist</h1>
        <p className="showreel-subtitle">3D &bull; CGI &bull; Motion Graphics</p>
      </div>

      <button className="sound-toggle" onClick={toggleSound}>
        {isMuted ? (
          /* Иконка выключенного звука */
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/>
          </svg>
        ) : (
          /* Иконка включенного звука */
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        )}
      </button>
    </section>
  );
}
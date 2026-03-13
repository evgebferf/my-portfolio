import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="about-container">
      <div className="about-hero">
        <Image
          src="https://picsum.photos/seed/portrait/800/1200"
          alt="Motion Designer Portrait"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="about-content">
        <section className="about-section">
          <h2>About the designer</h2>
          <p>
            I am a senior motion designer and 3D artist based in Europe. With over a decade of experience, I specialize in creating high-end cinematic visuals for global brands and creative agencies. My work bridges the gap between technical precision and artistic expression.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Experience</h2>
          <p>
            Currently working as a freelance motion director. Previously held senior positions at top-tier design studios in London and Berlin, leading teams on award-winning campaigns.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Skills</h2>
          <ul className="skills-list">
            <li>3D Motion Design</li>
            <li>Cinema 4D</li>
            <li>Redshift</li>
            <li>Blender</li>
            <li>After Effects</li>
            <li>Houdini</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Clients & Awards</h2>
          <p>
            Nike, Apple, Sony, Spotify, Audi, Red Bull. <br />
            Featured in Motionographer, Stash Magazine, and awarded at the D&AD and Cannes Lions.
          </p>
        </section>
      </div>
    </main>
  );
}

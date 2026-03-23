import Image from 'next/image';
import type { Metadata } from 'next';
import styles from './about.module.css'; // Импорт стилей

export const metadata: Metadata = {
  title: 'About | Evgeniy Prilepskiy',
  description: 'Motion Designer & 3D Artist specializing in typography-driven visuals.',
};

export default function AboutPage() {
  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.imageWrapper}>
          <Image
            src="/path-to-your-photo.jpg" 
            alt="Evgeniy Prilepskiy"
            fill
            priority
            className={styles.portrait}
          />
        </div>
        <div className={styles.availability}>
          <span className={styles.dot}></span> Open to international opportunities
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Profile</h2>
          <p className={styles.leadText}>
            I am a <strong>Motion Designer and 3D Artist</strong> with a foundation in graphic design and editorial layout. 
          </p>
          <p>
            Currently based in Moscow, I bridge the gap between technical 3D execution and strong typographic systems.
            Specializing in Cinema 4D, Redshift, and interactive 3D experiences.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Recognition</h2>
          <div className={styles.recognitionGrid}>
            <div className={styles.awardItem}>
              <span className={styles.year}>'25</span>
              <div className={styles.awardInfo}>
                <h3>1st Place Winner</h3>
                <p>National Motion Design Championship (ArtMasters)</p>
              </div>
            </div>
            <div className={styles.awardItem}>
              <span className={styles.year}>'24</span>
              <div className={styles.awardInfo}>
                <h3>Founder & Creative Lead</h3>
                <p>Awarded a federal grant for Creative Tech Startup development</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Technical Stack</h2>
          <div className={styles.skillsGrid}>
            <div className={styles.skillGroup}>
              <h3>3D & Motion</h3>
              <ul>
                <li>Cinema 4D / Redshift</li>
                <li>Houdini</li>
                <li>After Effects</li>
              </ul>
            </div>
            <div className={styles.skillGroup}>
              <h3>Design & Web</h3>
              <ul>
                <li>InDesign (Layout)</li>
                <li>Three.js / React</li>
                <li>Next.js</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Collaboration</h2>
          <p>
            Open to relocation and on-site roles in European design studios 
            as well as remote freelance contracts.
          </p>
          <div className={styles.contactLinks}>
            <a href="mailto:work@prilepskiy.com" className={styles.ctaLink}>Email</a>
            <a href="/cv-evgeniy.pdf" className={styles.cvButton}>Download CV</a>
          </div>
        </section>
      </div>
    </main>
  );
}
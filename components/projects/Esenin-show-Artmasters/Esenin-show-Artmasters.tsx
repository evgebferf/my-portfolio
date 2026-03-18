import styles from './Esenin-show-Artmasters.module.css';

export default function EseninShowArtmasters() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>ESENIN SHOW ARTMASTERS</h1>
      </div>
      <section>
        <h2>Project Details</h2>
        <p>Это автоматический рендер проекта из папки!</p>
        <p>Если ты видишь этот текст, значит динамический импорт работает как часы.</p>
      </section>
    </div>
  );
}

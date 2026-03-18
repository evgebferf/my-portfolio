import styles from './WB-Promotion.module.css';

export default function WBPromotion() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>WB PROMOTION</h1>
      </div>
      <section>
        <h2>Project Details</h2>
        <p>Это автоматический рендер проекта из папки!</p>
        <p>Если ты видишь этот текст, значит динамический импорт работает как часы.</p>
      </section>
    </div>
  );
}

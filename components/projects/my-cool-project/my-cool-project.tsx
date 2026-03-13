import styles from './my-cool-project.module.css';

export default function MyCoolProject() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>my cool project</h1>
      </div>
      <section>
        <h2>Project Details</h2>
        <p>Это автоматический рендер проекта из папки!</p>
        <p>Если ты видишь этот текст, значит динамический импорт и авто-сетка работают как часы.</p>
      </section>
    </div>
  );
}

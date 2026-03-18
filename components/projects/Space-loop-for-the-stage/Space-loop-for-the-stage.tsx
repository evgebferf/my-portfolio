import styles from './Space-loop-for-the-stage.module.css';

export default function SpaceLoopForTheStage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>SPACE LOOP FOR THE STAGE</h1>
      </div>
      <section>
        <h2>Project Details</h2>
        <p>Это автоматический рендер проекта из папки!</p>
        <p>Если ты видишь этот текст, значит динамический импорт работает как часы.</p>
      </section>
    </div>
  );
}

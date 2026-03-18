const fs = require('fs');
const path = require('path');
const projectName = process.argv[2];

if (!projectName) {
  console.error('❌ Укажи название проекта! Пример: node scripts/create-project.js audi');
  process.exit(1);
}

// Превращаем audi в Audi, nike-air в NikeAir для названия компонента
const componentName = projectName
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join('');

const dir = path.join(__dirname, '../components/projects', projectName);

// 1. Шаблон TSX (исправлен синтаксис React компонента)
const tsxContent = `import styles from './${projectName}.module.css';

export default function ${componentName}() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>${projectName.replace(/-/g, ' ').toUpperCase()}</h1>
      </div>
      <section>
        <h2>Project Details</h2>
        <p>Это автоматический рендер проекта из папки!</p>
        <p>Если ты видишь этот текст, значит динамический импорт работает как часы.</p>
      </section>
    </div>
  );
}
`;

// 2. Шаблон CSS (исправлены кавычки)
const cssContent = `.container { background: #0a0a0a; color: white; } 
.hero { height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(45deg, #222, #000); border-radius: 20px; margin-bottom: 40px; }`;

// 3. Шаблон Metadata (JSON) - генерируем правильный JSON формат
const metaContent = {
  title: `${projectName.charAt(0).toUpperCase() + projectName.slice(1)} Project`,
  tags: "CGI • Design • Motion",
  previewImage: "/preview/T1.jpg",
  slug: projectName // Добавил slug, он пригодится для роутинга!
};

// Создаем папку
if (!fs.existsSync(dir)){
  fs.mkdirSync(dir, { recursive: true });
}

// Записываем файлы
fs.writeFileSync(path.join(dir, `${projectName}.tsx`), tsxContent);
fs.writeFileSync(path.join(dir, `${projectName}.module.css`), cssContent);
fs.writeFileSync(path.join(dir, 'metadata.json'), JSON.stringify(metaContent, null, 2));

console.log(`✅ Проект "${projectName}" успешно создан в components/projects/`);
console.log(`   - Компонент: ${componentName}`);
console.log(`   - Файлы: .tsx, .module.css, metadata.json`);
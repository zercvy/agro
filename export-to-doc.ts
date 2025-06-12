import fs from 'fs';
import path from 'path';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// Папки, которые нужно сканировать
const includeDirs = ['client', 'server'];

// Исключения
const exclude = ['node_modules', '.git', 'dist', 'build', '.next', 'package-lock.json', '.env'];

// Рекурсивный обход файлов
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const relPath = path.relative(process.cwd(), fullPath);

    if (exclude.some(ex => relPath.includes(ex))) continue;

    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      arrayOfFiles.push(relPath);
    }
  }

  return arrayOfFiles;
}

// Генерация документа
async function exportToWord() {
  const doc = new Document();

  for (const baseDir of includeDirs) {
    if (!fs.existsSync(baseDir)) continue;

    const files = getAllFiles(baseDir);

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');

      doc.addSection({
        children: [
          new Paragraph({
            children: [new TextRun({ text: `// ${file}`, bold: true })],
            spacing: { after: 100 },
          }),
          ...content.split('\n').map(line => new Paragraph(line)),
          new Paragraph(''),
        ],
      });
    }
  }

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('project_code_export.docx', buffer);
  console.log('✅ Документ успешно создан: project_code_export.docx');
}

exportToWord();

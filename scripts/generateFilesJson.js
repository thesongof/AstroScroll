import fs from 'fs';
import path from 'path';

const documentsDir = path.join(process.cwd(), 'public', 'documents');

function generateFilesJson() {
  if (!fs.existsSync(documentsDir)) {
    fs.mkdirSync(documentsDir, { recursive: true });
  }

  const files = fs.readdirSync(documentsDir)
    .filter(file => file.toLowerCase().endsWith('.pdf'))
    .map(filename => ({
      filename,
      title: filename.replace(/\.pdf$/i, '')
    }));

  const filesJson = { files };
  fs.writeFileSync(
    path.join(documentsDir, 'files.json'),
    JSON.stringify(filesJson, null, 2)
  );
  console.log(`Generated files.json with ${files.length} PDF files`);
}

generateFilesJson();
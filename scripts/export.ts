import fs from 'fs';
import path from 'path';

const walkSync = (dir: string, filelist: string[] = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else {
      filelist.push(filepath);
    }
  }
  return filelist;
};

const files = walkSync('./src');
let md = '# Skincare Store Codebase Export\n\n';
md += 'This document contains the core source code for the Skincare Store application. It is formatted specifically to be easily read by LLMs like Claude.\n\n';

for (const file of files) {
  if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css')) {
    md += `## ${file}\n\`\`\`${file.endsWith('.css') ? 'css' : 'tsx'}\n`;
    md += fs.readFileSync(file, 'utf-8');
    md += '\n```\n\n';
  }
}

// Also include package.json
md += `## package.json\n\`\`\`json\n`;
md += fs.readFileSync('./package.json', 'utf-8');
md += '\n```\n\n';

fs.writeFileSync('./CODEBASE_EXPORT.md', md);
console.log('Export complete');

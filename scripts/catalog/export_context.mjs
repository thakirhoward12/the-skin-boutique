import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';
const OUTPUT_FILE = './AI_STUDIO_CONTEXT.txt';

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach(function(file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            // Only grab React components, styling, and logic
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css')) {
                arrayOfFiles.push(fullPath);
            }
        }
    });
    return arrayOfFiles;
}

console.log('Packaging your source code for AI Studio...');
const files = getAllFiles(SRC_DIR);
let output = '# PROJECT SOURCE CODE CONTEXT\n\nThe following is the complete source code for my frontend React application built with Tailwind v4.\n';

for (const file of files) {
    output += `\n\n// ==========================================\n`;
    output += `// FILE LOCATED AT: ${file.replace(/\\/g, '/')}\n`;
    output += `// ==========================================\n\n`;
    output += fs.readFileSync(file, 'utf8');
}

fs.writeFileSync(OUTPUT_FILE, output);
console.log(`\n✅ Success! Bundled ${files.length} files into ${OUTPUT_FILE}.`);
console.log('You can now upload this file directly to Google AI Studio.');

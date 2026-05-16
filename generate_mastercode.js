const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');

const markdown = `# Master Code\n\n## index.html\n\`\`\`html\n${html}\n\`\`\`\n\n## style.css\n\`\`\`css\n${css}\n\`\`\`\n\n## script.js\n\`\`\`javascript\n${js}\n\`\`\`\n`;

fs.writeFileSync('mastercode.md', markdown);
console.log('mastercode.md created');

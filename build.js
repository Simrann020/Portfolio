#!/usr/bin/env node
/**
 * Build script: Assembles index.html from src/partials/
 * Run: node build.js  or  npm run build
 */
const fs = require('fs');
const path = require('path');

const PARTIALS_DIR = path.join(__dirname, 'src', 'partials');
const OUTPUT = path.join(__dirname, 'index.html');

const PARTIALS = [
  ['head', 'HEAD'],
  ['header', 'HEADER'],
  ['hero', 'HERO'],
  ['experience', 'EXPERIENCE'],
  ['projects', 'PROJECTS'],
  ['skills', 'SKILLS'],
  ['education', 'EDUCATION'],
  ['publications', 'PUBLICATIONS'],
  ['contact', 'CONTACT'],
  ['back-to-top', 'BACK-TO-TOP'],
];

function build() {
  let html = fs.readFileSync(path.join(PARTIALS_DIR, 'layout.html'), 'utf8');

  for (const [name, placeholder] of PARTIALS) {
    const file = path.join(PARTIALS_DIR, `${name}.html`);
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      html = html.replace(new RegExp(`\\{\\{${placeholder}\\}\\}`, 'g'), content);
    }
  }

  // Remove any remaining placeholders
  html = html.replace(/\{\{[A-Z_-]+\}\}/g, '');

  fs.writeFileSync(OUTPUT, html, 'utf8');
  console.log('Built index.html');
}

const watch = process.argv.includes('--watch');
if (watch) {
  build();
  fs.watch(PARTIALS_DIR, { recursive: true }, () => {
    console.log('Change detected, rebuilding...');
    build();
  });
  console.log('Watching for changes...');
} else {
  build();
}

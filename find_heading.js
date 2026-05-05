// Find the "كيف يعمل التطبيق؟" section in the document XML
const fs = require('fs');
const xml = fs.readFileSync('document_extracted.xml', 'utf8');

// Find Arabic heading text
const target = 'كيف يعمل التطبيق';
const idx = xml.indexOf(target);
console.log('Target text found at index:', idx);
if (idx >= 0) {
    // Show surrounding context - 500 chars before and 500 after
    const start = Math.max(0, idx - 500);
    const end = Math.min(xml.length, idx + 1000);
    console.log('\nContext around the heading:');
    console.log(xml.substring(start, end));
}

// Also look for style definitions
const stylesXml = fs.readFileSync('word_styles.xml', 'utf8');
console.log('\nStyles XML:');
console.log(stylesXml);

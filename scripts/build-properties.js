const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'content', 'imoveis');
const outFile = path.join(__dirname, '..', 'properties.json');

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));

const imoveis = files.map((f) => {
  const raw = fs.readFileSync(path.join(dir, f), 'utf8');
  return JSON.parse(raw);
});

imoveis.sort((a, b) => Number(a.id) - Number(b.id));

fs.writeFileSync(outFile, JSON.stringify({ imoveis }, null, 2) + '\n');

console.log('properties.json gerado com ' + imoveis.length + ' imoveis.');

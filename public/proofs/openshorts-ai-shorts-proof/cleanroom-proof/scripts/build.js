import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, 'src'), { recursive: true });
fs.mkdirSync(path.join(dist, 'fixtures'), { recursive: true });
for (const file of ['index.html']) fs.copyFileSync(path.join(root, file), path.join(dist, file));
for (const file of ['app.js', 'pipeline.js', 'styles.css']) fs.copyFileSync(path.join(root, 'src', file), path.join(dist, 'src', file));
fs.copyFileSync(path.join(root, 'fixtures', 'products.json'), path.join(dist, 'fixtures', 'products.json'));
console.log('built dist/');

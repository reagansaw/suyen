// 抽检查图：node scripts/stills.mjs '[["compId","名字",秒], ...]'  → out/stills/<名字>.jpg
import path from 'node:path';
import { rmSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shots = JSON.parse(process.argv[2]);
mkdirSync(path.join(root, 'out/stills'), { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public') });
const comps = {};
try {
  for (const [id, name, t] of shots) {
    comps[id] ??= await selectComposition({ serveUrl, id, chromiumOptions: { gl: 'angle' } });
    await renderStill({ composition: comps[id], serveUrl, output: path.join(root, 'out/stills', name + '.jpg'), frame: Math.round(t * 30), imageFormat: 'jpeg', jpegQuality: 88, chromiumOptions: { gl: 'angle' } });
    console.log(name);
  }
} finally { rmSync(serveUrl, { recursive: true, force: true }); }

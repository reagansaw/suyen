// 渲整支：nice -n 19 node scripts/render.mjs <compId> <out.mp4>   （CONCURRENCY=2 省 CPU；FRAMES=起-止 只渲一段）
import path from 'node:path';
import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [id, out] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public') });
try {
  const composition = await selectComposition({ serveUrl, id, chromiumOptions: { gl: 'angle' } });
  let last = 0;
  await renderMedia({ composition, serveUrl, codec: 'h264', crf: 16, outputLocation: path.resolve(out), chromiumOptions: { gl: 'angle' },
    concurrency: Number(process.env.CONCURRENCY || 2), timeoutInMilliseconds: 120000, ...(process.env.FRAMES ? { frameRange: process.env.FRAMES.split('-').map(Number) } : {}),
    onProgress: ({ progress }) => { if (progress - last >= 0.1) { last = progress; console.log(`${Math.round(progress * 100)}%`); } } });
  console.log('done', out);
} finally { rmSync(serveUrl, { recursive: true, force: true }); }

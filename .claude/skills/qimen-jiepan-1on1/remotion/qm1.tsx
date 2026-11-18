// 奇门时事盘 1对1 解盘 · 主片（约 93 秒）。安排见 qimen-1on1/剪辑安排.md。
// 版式照 Ivy 访谈系列：上下两格、交界斜右上 blend、上格放 iPad / B-roll / 听的人、下格放讲话的人；颜色用 Suyen 玫红 + 米黄。
// 三支代理片在 public/qm1/（qimen-1on1/proxy.sh 产生）。秒数一律是老师那支（IMG_1787）的秒数。
import React from 'react';
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';

const FPS = 30;
const ROSE = '#D2405A', ROSE_HOT = '#FF7C95', ROSE_DEEP = '#7A1730', CREAM = '#F3E6C4', BG = '#1B0A12', WHITE = '#FFFDF7';
const SONG = '"Songti SC","Noto Serif SC",serif';
const SANS = '"Noto Sans SC","PingFang SC",sans-serif';
const OFF = { t: 0, c: -0.09, ipad: 2.61 };           // 那支片的秒数 = 老师秒数 + OFF
const PLACEHOLDER = true;                              // 客人还没换人：分镜上打一个「占位」小标
const QUESTION = '合作 20 年的伙伴，还能信吗？';
import { FACES } from './qm1_faces';
import { QmCta } from './cta';   // CTA 独立一块（Reagan 11-14），不带配乐
const STEPS = ['钱去哪里', '他有没有心', '几时开始', '拿得回吗'];

type Src = 't' | 'c' | 'ipad' | 'broll' | 'year' | 'cal' | 'pct';
type Shot = { s: [number, number]; sp: 't' | 'c'; lay: 'dual' | 'full' | 'card' | 'react'; top?: Src; sub?: string[]; pal?: [number, number]; term?: string; step?: number; big?: string; note?: string; name?: boolean;
  br?: 'ledger' | 'dusty'; // B-roll 影片（public/qm1/broll/，studio 画布 2cbf640d 跑出来的）
  view?: [number, number, number, number]; // iPad 原片要显示哪一块（默认只取九宫格）。她在四柱或格子外面写字时要用这个，不然看不到她在画
  focus?: [number, number][];              // 镜头跟着笔走：在 view 里的位置（0–1），从第一个点慢慢移到最后一个点
  dim?: boolean;                           // false = 不压暗其他宫（笔画跨几个宫时）
  rate?: number;                           // 慢动作：0.5 = 半速（镜头长度 = 原片长度 ÷ rate）
  rg?: [string, number];                   // react 镜头在换人版用哪一段换人片、从第几秒开始（他听着没讲话的那一段）
  fk?: [number, number, number, number][]; // 每一笔：[开始秒, 结束秒, x, y]（老师秒数 + 原片像素，量录屏得来）。镜头停在那一笔上等她画完，再移去下一笔
  tin?: number;                            // 这个镜头用「穿过去」的方式接进来，几格（不硬切）
  fx?: 'in' | 'slam';                      // 钩子特效：in = 冲进来；slam = 大字砸下来 + 闪白 + 震
  g?: string;            // 客人讲话的镜头：对应哪一段换人片（qimen-1on1/swap 的 A–J）
  gen?: string;          // 换人版里实际用的那一段（resolve 填）
  alt?: Partial<Shot> }; // 换人版里要换掉的写法（原版上格是客人在听 → 换人版不能出现原本的人）

// 字幕照盘改过 whisper 听错的术语（辛金、坎宫、庚金、天心、天蓬）；要老师再对一次。
export const SHOTS: Shot[] = [
  // 0 钩
  { fx: 'in', g: 'H', s: [145.40, 146.35], sp: 'c', lay: 'full', sub: ['他有真的要骗我吗？'] },
  { fx: 'slam', s: [152.16, 153.98], sp: 't', lay: 'full', big: '有心欺骗', sub: ['他是有心欺骗。'] },
  // 反应：老师拉到上面，下面出客人听到这句话的样子，半速（Reagan 11-14）
  { lay: 'react', s: [153.98, 154.68], rate: 0.5, sp: 't', rg: ['H', 2.2] },
  // 标题卡：先出「合作 20 年的伙伴」，1 秒后才出「还能信吗？」，再停 1.5 秒给人读完
  { tin: 10, s: [0, 2.7], sp: 't', lay: 'card' },
  // 声明卡（Reagan 11-14）：标题之后出 1 秒，再进主题
  { tin: 8, s: [0, 1.0], sp: 't', lay: 'card', note: 'DISC' },
  // 1 倒回开头
  { tin: 10, g: 'A', s: [1.04, 6.9], sp: 'c', lay: 'dual', top: 't', sub: ['我公司全部的账和钱，', '我是给一个伙伴管的。'], name: true },
  { g: 'B', s: [7.14, 11.15], sp: 'c', lay: 'dual', top: 'broll', br: 'ledger', note: 'B-roll：账本和对不上的数字', sub: ['最近我发现他讲的，', '跟我看到的不一样。'] },
  { g: 'C', s: [13.64, 15.65], sp: 'c', lay: 'dual', top: 't', sub: ['我们合作了十几二十年。'] },
  { g: 'D', s: [16.96, 18.5], sp: 'c', lay: 'dual', top: 't', sub: ['这个人，我还能相信吗？'] },
  // 2 盘先讲中他
  { s: [36.74, 41.05], sp: 't', lay: 'dual', top: 'ipad', view: [170, 108, 1000, 1200], fk: [[38.0, 38.6, 292, 1129], [39.4, 39.8, 601, 196]], term: '辛金 ＝ 问的人', sub: ['你可以看到辛金，', '辛金代表问测者。'] },
  { s: [41.18, 47.5], sp: 't', lay: 'dual', top: 'ipad', fk: [[42.4, 42.8, 420, 1120], [43.8, 44.2, 398, 1180]], sub: ['问测者本身呢，', '临着值符、生门，', '你本身就是一个', '大生意的大老板。'] },
  { g: 'E', s: [50.9, 51.75], sp: 'c', lay: 'dual', top: 't', sub: ['是。'] },
  // 3 钱去哪里
  { s: [68.82, 72.0], sp: 't', lay: 'dual', top: 'ipad', fk: [[69.2, 69.4, 569, 1399], [69.6, 69.7, 395, 1196], [70.4, 70.6, 764, 1405], [71.4, 71.8, 630, 1450]], step: 0, term: '坎宫 ＝ 水、险', sub: ['你看你的钱，落到了坎宫。'] },
  { s: [77.16, 83.72], sp: 't', lay: 'dual', top: 'ipad', pal: [1, 2], step: 0, term: '太阴 ＝ 暗', sub: ['加上太阴，太阴为暗。', '你不明不白的这些钱，', '暗地里不知道去到哪里。'] },
  { g: 'F', s: [83.86, 85.85], sp: 'c', lay: 'dual', top: 't', step: 0, sub: ['也是最近转不过来，', '我才发现到的。'] },
  { s: [94.9, 98.72], sp: 't', lay: 'dual', top: 'ipad', fk: [[95.4, 96.0, 577, 1535], [97.0, 97.4, 417, 1629], [97.6, 97.7, 462, 1254]], step: 0, term: '庚金 ＝ 阻碍', sub: ['里面你看有一个庚金，', '庚金是里面一个大坏人。'] },
  // 4 人味
  { alt: { top: 'ipad', pal: [1, 2] }, s: [108.02, 111.2], sp: 't', lay: 'dual', top: 'c', step: 0, sub: ['其实他都是很光明正大地', '做这件事情。'] },
  { g: 'G', s: [116.82, 118.5], sp: 'c', lay: 'dual', top: 'broll', br: 'dusty', note: 'B-roll：三年没翻的账本', step: 0, sub: ['我至少三年的账都没去看。'] },
  { alt: { lay: 'full' }, s: [122.2, 123.3], sp: 't', lay: 'dual', top: 'c', step: 0, sub: ['要怪你自己咯。'] },
  // 5 这个人
  { alt: { top: 'ipad', pal: [2, 0] }, s: [125.02, 127.45], sp: 't', lay: 'dual', top: 'c', step: 1, sub: ['他的年干是 1977 年的。'] },
  { s: [131.24, 136.52], sp: 't', lay: 'dual', top: 'ipad', view: [590, 430, 600, 660], fk: [[132.2, 132.6, 866, 831], [133.0, 133.4, 950, 536], [134.8, 135.2, 1005, 794], [136.0, 136.4, 1003, 813]], step: 1, term: '丁火 ＋ 玄武', sub: ['他的年干就是丁火，', '丁火本身有这个玄武。'] },
  { s: [139.54, 141.42], sp: 't', lay: 'dual', top: 'ipad', pal: [2, 0], step: 1, term: '玄武 ＝ 小偷', sub: ['天蓬为大盗，玄武为小偷。'] },
  // 6 答案
  { g: 'H', s: [145.40, 146.35], sp: 'c', lay: 'dual', top: 't', step: 1, sub: ['他有真的要骗我吗？'] },
  { s: [149.06, 152.14], sp: 't', lay: 'dual', top: 'ipad', view: [590, 430, 600, 660], fk: [[149.8, 150.8, 946, 812], [151.2, 151.6, 1005, 681]], step: 1, sub: ['你看旁边又来一个天心。'] },
  { fx: 'slam', s: [152.16, 153.98], sp: 't', lay: 'full', step: 1, big: '有心欺骗', sub: ['他是有心欺骗。'] },
  { alt: { lay: 'full' }, s: [156.78, 159.36], sp: 't', lay: 'dual', top: 'c', step: 1, sub: ['答案就是一目了然了。'] },
  // 7 几时开始
  { g: 'I', s: [159.7, 161.05], sp: 'c', lay: 'dual', top: 't', step: 2, sub: ['他几时开始要骗我了？'] },
  { s: [175.7, 178.8], sp: 't', lay: 'dual', top: 'year', step: 2, sub: ['2016 年的时候，', '就频密发生这件事情了。'] },
  { s: [184.52, 189.1], sp: 't', lay: 'dual', top: 'cal', step: 2, sub: ['在今年的话，', '是 8 月、9 月。'] },
  { s: [190.62, 193.4], sp: 't', lay: 'dual', top: 'cal', step: 2, sub: ['你的线索就在 8 月 9 月。'] },
  // 8 老实话
  { alt: { lay: 'full' }, s: [199.3, 203.65], sp: 't', lay: 'dual', top: 'c', step: 2, sub: ['当然我们不要怪错人，', '还是要找证据。'] },
  // 9 钱拿得回吗
  { g: 'J', s: [284.94, 286.9], sp: 'c', lay: 'dual', top: 't', step: 3, sub: ['那这个钱，吐不吐得出来？'] },
  { s: [294.34, 297.35], sp: 't', lay: 'dual', top: 'pct', step: 3, sub: ['可以拿到五成，50%。'] },
  // 10 CTA（老师真声，还没录）
  { s: [0, 9.3], sp: 't', lay: 'card', note: 'CTA' },
];
// 两个版本（Reagan 11-14）：orig = 客人用原片（声音压低）；gen = 客人换成 Seedance 2.5 生成的年长的人（用它自己生成的声音再压低）。
// GEN：每段换人片里他讲话的起止秒（量过声音）。10 段都生成好了（11-14）；没列在这里的段会出一张「待生成」卡。
export type Mode = 'orig' | 'gen';
const nf = (x: Shot) => Math.round((x.s[1] - x.s[0]) / (x.rate || 1) * FPS);
const GEN: Record<string, [number, number]> = { A: [0.38, 5.36], B: [0.62, 3.84], C: [0.4, 2.2], D: [0.62, 2.98], E: [0.1, 1.0], F: [0.14, 2.94], G: [0.46, 3.4], H: [0, 1.26], I: [0.46, 1.82], J: [0.92, 2.84] };
const resolve = (mode: Mode): Shot[] => mode === 'orig' ? SHOTS : SHOTS.flatMap((sh): Shot[] => {
  if (sh.alt) return [{ ...sh, ...sh.alt }];
  if (!sh.g) return [sh];
  const g = GEN[sh.g];
  if (!g) return sh.g === 'E' ? [] : [{ ...sh, gen: '?' }];
  return [{ ...sh, gen: sh.g, s: [Math.max(0, g[0] - 0.12), g[1] + 0.22] }];
});
const timeline = (mode: Mode) => { const shots = resolve(mode), dur = shots.map(nf);
  return { shots, dur, start: dur.map((_, i) => dur.slice(0, i).reduce((a, b) => a + b, 0)), total: dur.reduce((a, b) => a + b, 0) }; };
const TL = { orig: timeline('orig'), gen: timeline('gen') };
export const framesQm1 = TL.orig.total, framesQm1Gen = TL.gen.total;
export const QM1_STARTS = { orig: TL.orig.start.map((f) => f / FPS), gen: TL.gen.start.map((f) => f / FPS) };
const ModeCtx = React.createContext<Mode>('orig');

const cl = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (x: number) => 1 - Math.pow(1 - cl(x), 3);
const eio2 = (x: number) => { x = cl(x); return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };

// 马赛克版（Reagan 11-14：真人脸马赛克 + Seedance 版马赛克）：客人的脸上盖一块低像素的同一段片（40×72 放大，不做平滑 = 真马赛克）。
// 位置来自 qm1_faces.ts（每 3 格一组，中间直线补）。
const MzCtx = React.createContext(false);
const faceAt = (key: string, sec: number): [number, number, number, number] | null => { const a = FACES[key]; if (!a) return null;
  const n = a.length / 4, u = cl(sec * FPS / 3, 0, n - 1), i = Math.min(n - 2, Math.floor(u)), e = u - i;
  return [0, 1, 2, 3].map((j) => a[i * 4 + j] + (a[(i + 1) * 4 + j] - a[i * 4 + j]) * e) as [number, number, number, number]; };
const Vid: React.FC<{ who: 't' | 'c' | 'ipad'; at: number; style: React.CSSProperties; gen?: string; rate?: number }> = ({ who, at, style, gen, rate }) => {
  const mz = React.useContext(MzCtx), f = useCurrentFrame();
  const base = gen ? `qm1/gen/${gen}` : `qm1/${who === 't' ? 'teacher' : who === 'c' ? 'client' : 'ipad'}`, sec = at + (gen ? 0 : OFF[who]);
  const from = Math.max(0, Math.round(sec * FPS));
  const main = <OffthreadVideo muted src={staticFile(base + '.mp4')} startFrom={from} playbackRate={rate || 1} style={{ position: 'absolute', ...style }} />;
  const box = mz && who === 'c' ? faceAt(gen || 'client', from / FPS + Math.max(0, f) / FPS * (rate || 1)) : null;
  if (!box) return main;
  const L = style.left as number, T = style.top as number, W = style.width as number, H = style.height as number;
  return <>{main}
    <div style={{ position: 'absolute', left: L + box[0] * W, top: T + box[1] * H, width: box[2] * W, height: box[3] * H, overflow: 'hidden', borderRadius: 14 }}>
      <OffthreadVideo muted src={staticFile(base + '_px.mp4')} startFrom={from} playbackRate={rate || 1} style={{ position: 'absolute', left: -box[0] * W, top: -box[1] * H, width: W, height: H, imageRendering: 'pixelated', filter: style.filter }} />
    </div></>;
};
// 人在格子里的位置：sc 放大、y 往下移（让头落在那一格的中上）
const POSE = { t: { top: { sc: 1.1, x: -108, y: -250 }, bot: { sc: 1.08, x: -110, y: 700 }, botSmall: { sc: 1.0, x: -70, y: 800 }, full: { sc: 1.12, x: -150, y: -60 } },
  c: { top: { sc: 1.25, x: -90, y: -720 }, bot: { sc: 1.25, x: -90, y: 260 }, botSmall: { sc: 1.05, x: 0, y: 560 }, full: { sc: 1.45, x: -150, y: -560 } } };
const Person: React.FC<{ who: 't' | 'c'; at: number; slot: 'top' | 'bot' | 'botSmall' | 'full'; gen?: string }> = ({ who, at, slot, gen }) => {
  const p = POSE[who][slot];
  if (gen === '?') return <AbsoluteFill style={{ background: '#2a1018', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 420 }}><div style={{ fontFamily: SANS, fontSize: 44, color: CREAM, border: `3px dashed ${CREAM}`, borderRadius: 16, padding: '14px 30px' }}>这一段换人片还没生成</div></AbsoluteFill>;
  return <Vid who={who} at={at} gen={gen} style={{ left: p.x, top: p.y, width: 1080 * p.sc, height: 1920 * p.sc }} />;
};

// 整体背景：深酒红 + 很淡的如意花纹（慢慢飘）+ 一圈柔光。
// 花纹来自 Reagan 11-14 给的「六种如意花纹」图：1 平安 2 财富 3 健康 4 吉祥 5 繁荣 6 平衡（public/qm1/ruyi-N.png）。每一集换一个。
const RUYI = 2;   // 这一集讲钱 → 财富
const Ruyi: React.FC<{ w: number; style?: React.CSSProperties }> = ({ w, style }) => <Img src={staticFile(`qm1/ruyi-${RUYI}.png`)} style={{ width: w, ...style }} />;
const Bg: React.FC = () => {
  const f = useCurrentFrame(), d = (f * 0.25) % 360;
  return <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 30%, ${ROSE_DEEP} 0, #3A0E1C 45%, ${BG} 100%)` }}>
    <AbsoluteFill style={{ opacity: 0.09 }}>
      {Array.from({ length: 8 }).map((_, r) => [0, 1, 2, 3, 4].map((c) => <Ruyi key={r + '-' + c} w={170} style={{ position: 'absolute', left: -360 + c * 360 + (r % 2) * 180 + d, top: 40 + r * 250 }} />))}
    </AbsoluteFill>
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 28%, rgba(255,124,149,.16) 0, transparent 46%)' }} />
  </AbsoluteFill>;
};
// iPad mockup：黑边圆角机身 + 阴影。crop = 屏幕里显示原片哪一块 [x, y, w, h]（原片 1334×1920）
const Mock: React.FC<{ at: number; x: number; y: number; w: number; crop: [number, number, number, number]; pal?: [number, number]; k?: number; tilt?: boolean; focus?: [number, number][]; dim?: boolean; fk?: [number, number, number, number][]; now?: number }> = ({ at, x, y, w, crop, pal, k = 0, tilt, focus, dim = true, fk, now = 0 }) => {
  const sc = w / crop[2], h = crop[3] * sc, B = 16;
  let cx = pal ? w * (pal[0] + 0.5) / 3 : w / 2, cy = pal ? h * (pal[1] + 0.5) / 3 : h / 2;
  if (focus) { const u = cl(k) * (focus.length - 1), i = Math.min(focus.length - 2, Math.floor(u)), e = eio2(u - i); cx = w * (focus[i][0] + (focus[i + 1][0] - focus[i][0]) * e); cy = h * (focus[i][1] + (focus[i + 1][1] - focus[i][1]) * e); }
  if (fk) {   // 停在当前那一笔上；上一笔画完 0.2 秒后才移，下一笔开始前 0.2 秒到位
    let px = fk[0][2], py = fk[0][3];
    for (let i = 1; i < fk.length; i++) { const a = fk[i - 1][1] + 0.2, b = Math.max(a + 0.25, fk[i][0] - 0.2); if (now >= a) { const e = eio2((now - a) / (b - a)); px = fk[i - 1][2] + (fk[i][2] - fk[i - 1][2]) * e; py = fk[i - 1][3] + (fk[i][3] - fk[i - 1][3]) * e; } }
    cx = (px - crop[0]) * sc; cy = (py - crop[1]) * sc;
  }
  // Reagan 11-14：iPad 录屏要定格，不推近、不跟踪、不压暗——要的是她当场在 iPad 上画圈的真实感，不是后期动画感。只有标题卡那台（tilt）保留一点动。
  const zoom = 1; void focus; void fk; void now; void cx; void cy;
  return <div style={{ position: 'absolute', left: x - B, top: y - B, width: w + B * 2, height: h + B * 2, borderRadius: 44, background: 'linear-gradient(145deg, #2b2b30, #0c0c0e)', boxShadow: '0 40px 90px rgba(0,0,0,.6), 0 0 0 2px rgba(255,255,255,.14) inset, 0 0 70px rgba(210,64,90,.28)',
    transform: tilt ? `perspective(1800px) rotateX(${14 - 4 * eo(k)}deg) rotateZ(-4deg)` : undefined }}>
    <div style={{ position: 'absolute', left: B, top: B, width: w, height: h, borderRadius: 30, overflow: 'hidden', background: '#fff' }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${zoom})` }}>
        <Vid who="ipad" at={at} style={{ left: -crop[0] * sc, top: -crop[1] * sc, width: 1334 * sc, height: 1920 * sc }} />
      </div>
      {false && pal && dim && <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at ${cx}px ${cy}px, transparent 0, transparent ${w * 0.23}px, rgba(20,6,12,.6) ${w * 0.36}px)` }} />}
    </div>
  </div>;
};
const GRID: [number, number, number, number] = [196, 722, 953, 968];   // 九宫格在原片的位置
// 上格的盘：iPad mockup 放在云纹背景上，盘占上半、人占下半（Reagan 11-14）
const IPad: React.FC<{ at: number; pal?: [number, number]; k: number; view?: [number, number, number, number]; focus?: [number, number][]; dim?: boolean; fk?: [number, number, number, number][]; now?: number }> = ({ at, pal, k, view, focus, dim, fk, now }) => {
  const crop = view ?? GRID, w = Math.min(760, Math.round(735 * crop[2] / crop[3]));   // 上半格放得下：最高 735
  return <AbsoluteFill><Bg /><Mock at={at} x={(1080 - w) / 2} y={222} w={w} crop={crop} pal={pal} k={k} focus={focus} dim={dim} fk={fk} now={now} /></AbsoluteFill>;
};

const Panel: React.FC<{ children: React.ReactNode; label?: string }> = ({ children, label }) => (
  <AbsoluteFill style={{ alignItems: 'center' }}><Bg />
    <div style={{ position: 'absolute', top: 300, left: 0, right: 0, textAlign: 'center' }}>{children}</div>
    {label && <div style={{ position: 'absolute', top: 760, fontFamily: SANS, fontSize: 30, color: CREAM, opacity: 0.7, border: `2px dashed ${CREAM}`, borderRadius: 14, padding: '10px 26px' }}>{label}</div>}
  </AbsoluteFill>
);
const TopSrc: React.FC<{ sh: Shot; at: number; k: number; now: number }> = ({ sh, at, k, now }) => {
  switch (sh.top) {
    case 't': case 'c': return <Person who={sh.top} at={at} slot="top" />;
    case 'ipad': return <IPad at={at} pal={sh.pal} k={k} view={sh.view} focus={sh.focus} dim={sh.dim} fk={sh.fk} now={now} />;
    case 'broll': if (sh.br) return <AbsoluteFill style={{ background: BG }}><OffthreadVideo muted src={staticFile(`qm1/broll/${sh.br}.mp4`)} startFrom={sh.br === 'dusty' ? 36 : 12} style={{ position: 'absolute', left: -40, top: -30, width: 1160, height: 1160, transform: `scale(${1 + 0.05 * k})` }} /></AbsoluteFill>;
      return <Panel label="占位 · 画布建好给你看，不按 Run"><div style={{ fontFamily: SONG, fontWeight: 900, fontSize: 64, color: CREAM, marginTop: 120 }}>{sh.note}</div></Panel>;
    case 'year': return <Panel><div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 70, color: CREAM, opacity: 0.45, textDecoration: 'line-through' }}>2015</div>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 300, lineHeight: 1.1, color: WHITE, textShadow: `0 0 50px ${ROSE}` }}>{Math.round(2015 + cl(k * 2.5))}</div>
      <div style={{ fontFamily: SONG, fontWeight: 900, fontSize: 60, color: ROSE_HOT }}>从这一年开始</div></Panel>;
    case 'cal': return <Panel><div style={{ fontFamily: SONG, fontWeight: 900, fontSize: 56, color: CREAM, marginBottom: 30 }}>今年 · 线索在这里</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', padding: '0 70px' }}>{[5, 6, 7, 8, 9, 10, 11, 12].map((m) => { const hot = m === 8 || m === 9;
        return <div key={m} style={{ width: 205, height: 150, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 900, fontSize: hot ? 84 : 56, color: hot ? WHITE : 'rgba(243,230,196,.4)', background: hot ? ROSE : 'rgba(255,255,255,.06)', boxShadow: hot ? `0 0 40px ${ROSE}` : 'none', transform: `scale(${hot ? 1 + 0.06 * eo(k * 3) : 1})` }}>{m}月</div>; })}</div></Panel>;
    case 'pct': return <Panel><div style={{ fontFamily: SONG, fontWeight: 900, fontSize: 60, color: CREAM, marginTop: 40 }}>从盘上看，拿得回</div>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 360, lineHeight: 1.1, color: WHITE, textShadow: `0 0 60px ${ROSE}` }}>{Math.round(50 * eo(k * 2.5))}%</div></Panel>;
    default: return null;
  }
};

const Header: React.FC<{ step?: number }> = () => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 112, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
    <div style={{ fontFamily: SONG, fontWeight: 900, fontSize: 44, color: WHITE, background: ROSE, borderRadius: 999, padding: '12px 40px', letterSpacing: '0.04em', boxShadow: '0 8px 30px rgba(0,0,0,.45)' }}>{QUESTION}</div>
  </div>
);
// 最上面的进度条（Reagan 11-14：上面要 loading bar 时间轴）：整支片分 6 段，走到哪一段那一段亮，段内慢慢填满。
// 段名只在上下格的镜头出（钩子和标题卡只留条，不挡字）。
const Bar: React.FC<{ mode: Mode }> = ({ mode }) => { const f = useCurrentFrame(), { shots, start, total } = TL[mode];
  const titleI = shots.findIndex((x) => x.lay === 'card'), cardI = shots.findIndex((x) => x.note === 'DISC'), at = (fn: (x: Shot, i: number) => boolean) => start[shots.findIndex(fn)];
  const cuts = [0, start[cardI + 1], ...STEPS.map((_, n) => at((x) => x.step === n && true)), total].map((x, i, arr) => i > 1 && i < arr.length - 1 ? at((x2, j) => j > cardI && x2.step === i - 2) : x);
  const names = ['开场', '他的问题', ...STEPS], W = 1000, G = 6;
  let cur = 0; for (let i = 0; i < shots.length; i++) if (f >= start[i]) cur = i;
  const label = shots[cur].lay === 'dual';
  let x = 40;
  return <AbsoluteFill>
    {names.map((nm, i) => { const w = (cuts[i + 1] - cuts[i]) / total * W - G, k = cl((f - cuts[i]) / (cuts[i + 1] - cuts[i])), on = f >= cuts[i] && f < cuts[i + 1], left = x; x += w + G;
      return <div key={nm} style={{ position: 'absolute', left, top: 44, width: w }}>
        <div style={{ height: 10, borderRadius: 5, background: 'rgba(255,253,247,.28)', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.5)' }}><div style={{ width: `${k * 100}%`, height: '100%', borderRadius: 5, background: on ? ROSE_HOT : CREAM }} /></div>
        {label && <div style={{ marginTop: 8, textAlign: 'center', fontFamily: SANS, fontWeight: on ? 900 : 500, fontSize: 23, whiteSpace: 'nowrap', color: on ? WHITE : k >= 1 ? 'rgba(243,230,196,.85)' : 'rgba(243,230,196,.5)', textShadow: '0 2px 8px #000' }}>{nm}</div>}
      </div>; })}
  </AbsoluteFill>; };
const Subs: React.FC<{ sh: Shot; k: number; y: number }> = ({ sh, k, y }) => {
  if (!sh.sub) return null;
  const line = sh.sub[Math.min(sh.sub.length - 1, Math.floor(k * sh.sub.length))];
  const t = sh.sp === 't';
  return <div style={{ position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center' }}>
    <div style={{ fontFamily: SONG, fontWeight: 900, fontSize: 58, letterSpacing: '0.04em', padding: '12px 34px', borderRadius: 18, color: t ? WHITE : BG, background: t ? 'rgba(210,64,90,.94)' : 'rgba(243,230,196,.95)', boxShadow: '0 10px 30px rgba(0,0,0,.5)', whiteSpace: 'nowrap' }}>{line}</div>
  </div>;
};
// Reagan 11-14：「真实个案改编 / 示范个案」「AI 处理」这些小字都不需要放。
const Tag: React.FC = () => null;
const Ph: React.FC<{ y: number }> = ({ y }) => PLACEHOLDER ? <div style={{ position: 'absolute', right: 24, top: y, fontFamily: SANS, fontSize: 22, color: '#fff', background: 'rgba(0,0,0,.6)', padding: '4px 12px', borderRadius: 8 }}>客人画面占位 · 还没换人</div> : null;

// 接进来 / 接出去：不硬切。进来的镜头从放大 + 模糊收回来，出去的镜头继续放大 + 模糊，像镜头穿过去
const SceneT: React.FC<{ sh: Shot }> = ({ sh }) => {
  const f = useCurrentFrame(), n = nf(sh), tin = sh.tin || 0;
  const i = tin ? eo(f / tin) : 1, out = f > n ? cl((f - n) / 10) : 0;
  return <AbsoluteFill style={{ opacity: tin ? cl(f / (tin * 0.6)) : 1, transform: `scale(${(1.22 - 0.22 * i) * (1 + 0.3 * out * out)})`, filter: tin && f < tin ? `blur(${16 * (1 - i)}px)` : out ? `blur(${14 * out}px)` : undefined }}><Scene sh={sh} /></AbsoluteFill>;
};
const Scene: React.FC<{ sh: Shot }> = ({ sh }) => {
  const mode = React.useContext(ModeCtx);
  const f = useCurrentFrame(), n = nf(sh), k = cl(f / n), at = sh.s[0];
  if (sh.lay === 'card') return sh.note === 'CTA'
    ? <QmCta />   /* Reagan 11-14：CTA 用之前那个「留言正能量」（她的真声 9.3 秒，SuyenContent 的 CtaEnd） */
    : sh.note === 'DISC' ? <AbsoluteFill><Bg />
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 34 }}>
          <span style={{ width: 120, height: 3, background: CREAM, opacity: 0.6 }} />
          <div style={{ fontFamily: SONG, fontWeight: 900, fontSize: 68, color: WHITE, letterSpacing: '0.04em', textShadow: '0 6px 30px rgba(0,0,0,.7)' }}>奇门遁甲，东方千年智慧。</div>
          <div style={{ fontFamily: SONG, fontWeight: 700, fontSize: 56, color: CREAM, textShadow: '0 6px 30px rgba(0,0,0,.7)' }}>不是迷信，内容只供参考。</div>
          <div style={{ fontFamily: SONG, fontWeight: 700, fontSize: 56, color: CREAM, textShadow: '0 6px 30px rgba(0,0,0,.7)' }}>故事如有雷同，纯属巧合。</div>
          <span style={{ width: 120, height: 3, background: CREAM, opacity: 0.6 }} />
        </AbsoluteFill>
      </AbsoluteFill>
    : <AbsoluteFill><Bg />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Img src={staticFile('suyenc/suyenlogo-light.png')} style={{ width: 180, height: 180, marginTop: -14, marginBottom: 4 }} />   {/* Reagan 11-14：这里放 Suyen logo（如意花纹留在背景） */}
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 34, color: CREAM, letterSpacing: '0.34em', display: 'flex', alignItems: 'center', gap: 22 }}><span style={{ width: 70, height: 2, background: CREAM, opacity: 0.6 }} />奇门解盘<span style={{ width: 70, height: 2, background: CREAM, opacity: 0.6 }} /></div>
          <div style={{ fontFamily: SONG, fontWeight: 900, fontSize: 98, lineHeight: 1.2, color: WHITE, textAlign: 'center', marginTop: 40, whiteSpace: 'nowrap', textShadow: '0 8px 40px rgba(0,0,0,.7)', transform: `scale(${1.12 - 0.12 * eo(k * 4)})` }}>合作 <span style={{ color: ROSE_HOT, fontSize: 150, fontFamily: SANS }}>20</span> 年的伙伴</div>
          <div style={{ fontFamily: SONG, fontWeight: 900, fontSize: 92, color: BG, background: CREAM, borderRadius: 18, padding: '6px 44px', marginTop: 26, opacity: cl((f - 30) / 4), transform: `scale(${1.5 - 0.5 * eo((f - 30) / 6)})`, boxShadow: `0 0 0 5px ${ROSE}, 0 16px 40px rgba(0,0,0,.5)` }}>还能信吗？</div>
        </div>
        <Mock at={150} x={235} y={690} w={610} crop={[170, 108, 1000, 1604]} k={k} tilt />   {/* 只取那一页纸：不要上面的工具列和下面的笔盒 */}
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, transparent 72%, rgba(27,10,18,.9) 100%)' }} />
      </AbsoluteFill>;
  if (sh.lay === 'react') {
    const m = eio2(f / 14), seam = 2150 - (2150 - 1010) * m, a = (seam - 70) / 19.2, b = (seam + 70) / 19.2;
    const A = POSE.t.full, B = POSE.t.top, lp = (x: number, y: number) => x + (y - x) * m, sc = lp(A.sc * 1.13, B.sc), gen = mode === 'gen' && sh.rg;
    return <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ transform: `translateY(${(1 - m) * 260}px) scale(${1.06 + 0.05 * k})`, transformOrigin: '50% 70%', filter: 'contrast(1.1) saturate(0.85)' }}>
        {gen ? <Vid who="c" at={sh.rg![1]} gen={sh.rg![0]} rate={sh.rate} style={{ left: POSE.c.bot.x, top: POSE.c.bot.y, width: 1080 * POSE.c.bot.sc, height: 1920 * POSE.c.bot.sc }} />
          : <Vid who="c" at={at} rate={sh.rate} style={{ left: POSE.c.bot.x, top: POSE.c.bot.y, width: 1080 * POSE.c.bot.sc, height: 1920 * POSE.c.bot.sc }} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ WebkitMaskImage: `linear-gradient(172deg, #000 ${a}%, transparent ${b}%)`, maskImage: `linear-gradient(172deg, #000 ${a}%, transparent ${b}%)` }}>
        <AbsoluteFill style={{ background: '#000' }} />
        <Vid who="t" at={at} rate={sh.rate} style={{ left: lp(A.x - 70, B.x), top: lp(A.y - 120, B.y), width: 1080 * sc, height: 1920 * sc, filter: 'contrast(1.12) saturate(0.82) brightness(0.9)' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 50%, transparent 35%, rgba(70,6,22,.6) 100%)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: lp(1010, seam - 95), textAlign: 'center', fontFamily: SONG, fontWeight: 900, fontSize: lp(230, 150), color: WHITE, textShadow: `0 0 50px ${ROSE}, 0 0 16px ${ROSE}, 0 10px 26px #000`, transform: 'rotate(-3deg)' }}>有心欺骗</div>
      <Tag />
    </AbsoluteFill>;
  }
  if (sh.lay === 'full') {
    // 钩子特效：in = 从放大冲进来再慢慢推；slam = 讲到「有心欺骗」那一下闪白 + 镜头一顿 + 震 + 大字砸下来 + 画面压暗发红
    const SL = 13, d = f - SL, slam = sh.fx === 'slam' && d >= 0;
    const z = sh.fx === 'in' ? 1.22 - 0.2 * eo(f / 7) + 0.05 * k : sh.fx === 'slam' ? (slam ? 1.16 - 0.05 * eo(d / 10) + 0.03 * k : 1 + 0.04 * (f / SL)) : 1 + 0.03 * k;
    const shake = slam && d < 9 ? (9 - d) * 2.4 : 0, sx = Math.sin(f * 12.9898) * shake, sy = Math.cos(f * 78.233) * shake;
    const flash = sh.fx ? Math.max(slam ? 0.85 * (1 - cl(d / 5)) : 0, 0.9 * (1 - cl(f / 4))) : 0;
    const glitch = 0;
    return <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ transform: `translate(${sx + (glitch ? (glitch % 2 ? 26 : -22) : 0)}px, ${sy}px) scale(${z})`, transformOrigin: sh.sp === 't' ? '58% 36%' : '45% 45%', filter: slam ? `contrast(1.18) saturate(0.8) brightness(0.86)${glitch ? ' hue-rotate(40deg)' : ''}` : undefined }}>
        <Person who={sh.sp} at={at} slot="full" gen={sh.gen} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(27,10,18,.55) 0, transparent 26%, transparent 62%, rgba(27,10,18,.85) 100%)' }} />
      {slam && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, transparent 30%, rgba(70,6,22,${0.78 - 0.2 * cl(d / 20)}) 100%)` }} />}
      {sh.fx && <><div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 150 * eo(f / 6), background: '#000' }} /><div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 170 * eo(f / 6), background: '#000' }} /></>}
      {sh.big && (!sh.fx || slam) && <div style={{ position: 'absolute', left: 0, right: 0, top: 1070, textAlign: 'center', fontFamily: SONG, fontWeight: 900, fontSize: 230, color: WHITE, letterSpacing: '0.02em', textShadow: `0 0 70px ${ROSE}, 0 0 20px ${ROSE}, 0 12px 30px #000`, transform: `translate(${sx * 1.5}px, ${sy * 1.5}px) scale(${sh.fx ? 2.6 - 1.6 * eo(d / 5) : 2.1 - 1.1 * eo(k * 5)}) rotate(-3deg)`, opacity: sh.fx ? cl(d / 2) : cl(k * 8) }}>{sh.big}</div>}
      <Subs sh={sh} k={k} y={sh.big ? 1420 : 1330} />
      {flash > 0 && <AbsoluteFill style={{ background: '#fff', opacity: flash }} />}
      <Tag />
    </AbsoluteFill>;
  }
  // dual：上格 iPad 时交界放低一点，让九宫格看得完
  const ipad = sh.top === 'ipad', seam = ipad ? 985 : 1010;
  const a = (seam - 70) / 19.2, b = (seam + 70) / 19.2;
  return <AbsoluteFill style={{ background: BG }}>
    <Person who={sh.sp} at={at} slot="bot" gen={sh.gen} />
    <AbsoluteFill style={{ WebkitMaskImage: `linear-gradient(172deg, #000 ${a}%, transparent ${b}%)`, maskImage: `linear-gradient(172deg, #000 ${a}%, transparent ${b}%)` }}><TopSrc sh={sh} at={at} k={k} now={at + f / FPS} /></AbsoluteFill>
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(27,10,18,.6) 0, transparent 13%, transparent 80%, rgba(27,10,18,.8) 100%)' }} />
    <Header step={sh.step} />
    {sh.term && <div style={{ position: 'absolute', left: sh.pal && sh.pal[0] === 2 ? 60 : undefined, right: sh.pal && sh.pal[0] === 2 ? undefined : 60, top: sh.pal && sh.pal[1] === 2 ? 300 : 800, fontFamily: SONG, fontWeight: 900, fontSize: 54, color: BG, background: CREAM, borderRadius: 16, padding: '12px 28px', boxShadow: `0 0 0 4px ${ROSE}, 0 14px 40px rgba(0,0,0,.6)`, transform: `rotate(-3deg) scale(${1.4 - 0.4 * eo(k * 6)})` }}>{sh.term}</div>}
    {sh.name && <div style={{ position: 'absolute', left: 50, top: 760, fontFamily: SONG, fontWeight: 900, fontSize: 40, color: WHITE, borderLeft: `8px solid ${ROSE}`, paddingLeft: 18, textShadow: '0 2px 12px #000' }}>Master Suyen Lim <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 28, color: CREAM }}>林舒苑 · 奇门遁甲战略导师</span></div>}
    <Subs sh={sh} k={k} y={ipad ? seam + 12 : seam - 48} />   {/* 字幕放中下：压在上下格交界上，不盖脸（Reagan 11-14） */}
    <Tag />
  </AbsoluteFill>;
};

// 声音：老师用她那支的原声；客人用他那支压低音调的版本（Reagan 11-14：低沉可以），一段只放讲话那个人的那一轨
// 配乐（Reagan 11-14）：开头钩用「紧张Hook」，标题卡之后整支用「Void」垫在讲话下面。
// 第二次「他是有心欺骗」前后音乐收掉，让那一句干净地出来；最后 1 秒淡出。
const Cut: React.FC<{ mode: Mode; mz?: boolean }> = ({ mode, mz = false }) => { const { shots, dur, start, total } = TL[mode];
  const titleI = shots.findIndex((x) => x.lay === 'card'), cardI = shots.findIndex((x) => x.note === 'DISC'), hookEnd = start[cardI + 1], ans = start[shots.findIndex((x, i) => i > cardI && !!x.big)], cta = start[shots.findIndex((x) => x.note === 'CTA')];   // 配乐在 CTA 前收掉（Reagan 11-14：CTA 不要 BGM）
  const fade = (f: number, a: number, b: number) => cl((f - a) / (b - a));
  return <MzCtx.Provider value={mz}><ModeCtx.Provider value={mode}><AbsoluteFill style={{ background: BG }}>
    {/* 钩子音效：冲进来 → 闪白撞击 → 大字「咚」→ 故障 → 标题「咚」→ 盖章 → 倒回开头「刷」；第二次「有心欺骗」也有撞击 */}
    {([[0, '呼2', 0.8], [start[1] - 1, '撞击光1', 0.9], [start[1] + 13, '咚咚重音心头震', 1], [start[1] + 12, '猛然一惊', 0.9], [start[2], '呼2', 0.5], [start[titleI] - 6, '扫光', 0.7], [start[titleI] + 7, '开场音效咚', 0.7], [start[titleI] + 30, '综艺咚', 0.8], [hookEnd - 6, '回忆-刷一下', 0.7], [ans - 1, '撞击光1', 0.7], [ans + 12, '猛然一惊', 0.8], [ans + 13, '咚咚重音心头震', 0.9]] as [number, string, number][]).map(([at, name, v], i) =>
      <Sequence key={'sfx' + i} from={Math.max(0, at)}><Audio src={staticFile(`sfx22/${name}.mp3`)} volume={v} /></Sequence>)}
    <Sequence from={0} durationInFrames={hookEnd + 12}><Audio src={staticFile('qm1/bgm/hook.mp3')} volume={(f) => 0.36 * (1 - fade(f, start[1] + 3, start[1] + 9) * (1 - fade(f, start[1] + 16, start[1] + 30))) * (1 - fade(f, hookEnd - 6, hookEnd + 12))} /></Sequence>
    <Sequence from={hookEnd - 10}><Audio src={staticFile('qm1/bgm/void.mp3')} volume={(f) => { const g = f + hookEnd - 10;
      return 0.11 * fade(g, hookEnd - 10, hookEnd + 20) * (1 - fade(g, ans - 20, ans - 6) * (1 - fade(g, ans + 50, ans + 80))) * (1 - fade(g, cta - 24, cta - 2)); }} /></Sequence>
    {shots.map((sh, i) => <Sequence key={i} from={start[i]} durationInFrames={dur[i] + (shots[i + 1]?.tin ?? 1)}><SceneT sh={sh} /></Sequence>)}
    <Bar mode={mode} />
    {shots.map((sh, i) => sh.lay === 'card' || sh.lay === 'react' || sh.gen === '?' ? null : <Sequence key={'a' + i} from={start[i]} durationInFrames={dur[i]}>
      <Audio src={staticFile(sh.gen ? `qm1/gen/${sh.gen}.m4a` : sh.sp === 'c' ? 'qm1/client_low.m4a' : 'qm1/teacher.m4a')} startFrom={Math.round((sh.s[0] + (sh.gen ? 0 : OFF[sh.sp])) * FPS)} /></Sequence>)}
  </AbsoluteFill></ModeCtx.Provider></MzCtx.Provider>; };
export const SuyenQm1: React.FC = () => <Cut mode="orig" />;
export const SuyenQm1Gen: React.FC = () => <Cut mode="gen" />;
export const SuyenQm1Mz: React.FC = () => <Cut mode="orig" mz />;
export const SuyenQm1GenMz: React.FC = () => <Cut mode="gen" mz />;

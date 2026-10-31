// Master Suyen · 2027 奇门战略大会 · 钩子探针 v3「东方高级版」（16:9 1920×1080）
// Reagan 10-30：「motion graphic 太卡通……更高级版，适合商用和玄学，有东方美学的感觉」「Lantinghei SC Heavy 字体用这个」
// 做法：背景压暗去饱和、人保持亮（人像抠像叠回）→ 金字夹在人后；金线罗盘 / 洛书九宫 / 朱砂印 / 宣纸签 / 水墨转场 / 金尘薄雾
//       镜头只做缓推 + 轻冲（不弹、不晃）；音效换颂钵、锣、鼓、毛笔、水滴、拔剑
// 素材同 v2：public/suyenh/<id>.mp4 + pf/<id>.webm + src/suyenh-hooks.json；字体 public/ivyga/fonts/LantingheiSC-Heavy.ttf（从 macOS Lantinghei.ttc 导出）
import React from 'react';
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing, delayRender, continueRender } from 'remotion';
import META from './suyenh-hooks.json';
import { depth } from './JyText';
import FC_P1 from './suyenh-face-p1.json';
import FC_I2 from './suyenh-face-i2.json';
import FC_P6 from './suyenh-face-p6.json';
const DIR = 'suyenh';
import TK_P1 from './suyenh-track-p1.json';
import TK_I2 from './suyenh-track-i2.json';
import TK_P6 from './suyenh-track-p6.json';
import FC_EP1 from './suyenh-face-ep1.json';
import TK_EP1 from './suyenh-track-ep1.json';
import EP1 from './suyen-ep1.json';

const W = 1920, H = 1080, FPS = 30;
const f = (s: number) => Math.round(s * FPS);
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
type HookId = 's4' | 'p1' | 'i2' | 'p6' | 'ep1' | `ep${number}`;
const FACE: Partial<Record<HookId, { x: number[]; y: number[] }>> = { p1: FC_P1 as any, i2: FC_I2 as any, p6: FC_P6 as any };
const M = { ...(META as unknown as Record<HookId, { dur: number }>), ep1: { dur: (EP1 as any).dur } } as Record<HookId, { dur: number }>;
// 广告集数不加尾巴：多出来的 0.6 秒影片已经放完、会定格（Reagan 10-31：「0:55 有点 lagging」）→ 收尾用原片自己的画面
export const suyenEFrames = (id: HookId) => f(M[id].dur + (id.startsWith('ep') ? 0 : 0.6));
const END = (id: HookId) => M[id].dur + 0.6;

const LTH = '"LTH"';
const INK = '#120E0A', CREAM = '#F6EEDC', CINNABAR = '#B8312F', GOLD_LINE = '#B07E2A';
const GOLD_DEEP = 'linear-gradient(180deg, #F2D58E 0%, #C99A3E 50%, #8A5A16 100%)';
const GOLD_GRAD = 'linear-gradient(180deg, #FFF4D6 0%, #E8C77E 48%, #B8893E 100%)';
const useFonts = () => {
  const [h] = React.useState(() => delayRender('suyene-font'));
  React.useEffect(() => {
    new FontFace('LTH', `url(${staticFile('ivyga/fonts/LantingheiSC-Heavy.ttf')})`).load()
      .then((ff) => { (document as any).fonts.add(ff); continueRender(h); }).catch((e) => { console.error(e); continueRender(h); });
  }, [h]);
};
const useT = () => useCurrentFrame() / FPS;
const eo = Easing.out(Easing.cubic), eio = Easing.inOut(Easing.sin);
const ease = (t: number, a: number, d: number, e = eo) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: e });
const win = (t: number, a: number, b: number, fi = 0.3, fo = 0.3) => {
  const i = Math.min(fi, (b - a) / 3), o = Math.min(fo, (b - a) / 3);
  return interpolate(t, [a, a + i, b - o, b], [0, 1, 1, 0], clamp);
};
const rng = (seed: number) => { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };

/* ---------- 音效（量过响度，垫在人声 -16 底下） ---------- */
const VOL: Record<string, number> = {
  咚: 0.44, 综艺咚: 0.58, 开场音效咚: 0.83, 空灵的水滴声: 1, 一滴水滴声: 1, 水滴回响声音效: 1, 诡异的滴水声: 1, 咚咚重音心头震: 0.25,
  综艺咚咚两声鼓点转场音效: 0.28, 撞击光1: 1, 木鱼敲击回响音效: 1, 哐撞击轻响: 1, 扫光: 1, 扫光音效4: 0.62, 一声响铃: 0.49, 复古胶片滚动: 1,
  叮收银机提示音1: 0.93, 发条声: 1, 综艺悬疑沙锤长: 0.38, 综艺悬疑不对劲: 0.88, 综艺悬疑轻敲: 0.7, '回忆-刷一下': 1, 闪回: 1, 旋风: 0.45, 呼2: 1,
  纸张抖动声: 1, 叮提示音4: 1, 正确: 0.38, 亮一下: 0.65, 猛然一惊: 1, 综艺叮: 0.5,
};
// 音效只用 Reagan 指定的剪映包「2-2-音效分类」（复制到 public/sfx22/<中文名>.mp3）；音量量过响度，垫在人声底下
const Sfx: React.FC<{ at: number; s: string; vol?: number; len?: number }> = ({ at, s, vol, len = 4 }) => {
  const v = vol ?? VOL[s] ?? 0.5, n = f(len);
  return (
    <Sequence from={Math.max(0, f(at))} durationInFrames={n}>
      <Audio src={staticFile(`sfx22/${s}.mp3`)} volume={(fr) => v * Math.min(1, (n - fr) / f(0.4))} />
    </Sequence>
  );
};

/* ---------- 镜头：开场 1.18→1 缓收；冲击点轻推 1.05；段落慢推 ---------- */
type Cam = { hits: number[]; pushes: [number, number, number][]; origin: string; holds?: [number, number, number][]; shrink?: [number, number, number][]; shrinkCurve?: [number, number][] };
// shrink：只缩抠出来的人和护脸层（以画面底部中间为基准），背景不动；z=0 就是这段不要人
const shrinkK = (t: number, c: Cam) => {
  let k = 1;
  for (const [a, b, z] of c.shrink ?? []) if (t >= a && t < b) {
    k *= z;
    const cv = c.shrinkCurve;
    if (cv) k *= interpolate(t, cv.map((p) => p[0]), cv.map((p) => p[1]), clamp);
  }
  return k;
};
const camK = (t: number, c: Cam) => {
  let s = 1 + 0.18 * (1 - ease(t, 0, 1.1, Easing.out(Easing.quad)));
  for (const h of c.hits) if (t >= h && t < h + 0.6) s *= 1 + 0.05 * Math.sin(Math.PI * Math.min(1, (t - h) / 0.6)) * (1 - (t - h) / 0.6 * 0.3);
  for (const [a, b, z] of c.pushes) if (t >= a && t < b) s *= interpolate(t, [a, b], [1, z], { ...clamp, easing: eio });
  // holds：换背景那段整段推近（前后 0.15 秒推进推出），让人像下缘的断口出画
  for (const [a, b, z] of c.holds ?? []) s *= 1 + (z - 1) * win(t, a - 0.15, b + 0.05, 0.15, 0.15);
  return s;
};
// grade(t) → [背景亮度, 背景饱和, 全画面灰度]
type Grade = (t: number) => [number, number, number];
const Plate: React.FC<{ id: HookId; cam: Cam; grade: Grade; person?: boolean }> = ({ id, cam, grade, person }) => {
  const t = useT(), s = camK(t, cam), [b, sat, g] = grade(t);
  const flt = person ? `saturate(${1 - g})` : `brightness(${b}) saturate(${sat * (1 - g)})`;
  return (
    <AbsoluteFill style={{ transform: `scale(${person ? shrinkK(t, cam) : 1})`, transformOrigin: '50% 100%' }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: cam.origin, filter: flt }}>
        {person ? <OffthreadVideo src={staticFile(`suyenh/pf/${id}.webm`)} transparent muted /> : <OffthreadVideo src={staticFile(`suyenh/${id}.mp4`)} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 护脸层（Reagan：「字体绝对不能盖着人脸」「不能遮盖脸」）：抠像偶尔漏掉头部时，人后层的字会跑到脸上。
// 所以按 facetrack 逐帧的脸中心，把原片的脸（柔边椭圆，只盖脸和头发、几乎不带背景）再叠回人后层上面。
const FaceGuard: React.FC<{ id: HookId; cam: Cam; grade: Grade }> = ({ id, cam, grade }) => {
  const t = useT(), fc = FACE[id];
  if (!fc) return null;
  const s = camK(t, cam), [, , g] = grade(t), i = Math.max(0, Math.min(fc.x.length - 1, Math.round(t * FPS)));
  const m = `radial-gradient(ellipse 125px 165px at ${fc.x[i]}px ${fc.y[i] - 10}px, #000 72%, transparent 100%)`;
  return (
    <AbsoluteFill style={{ transform: `scale(${shrinkK(t, cam)})`, transformOrigin: '50% 100%' }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: cam.origin, filter: g ? `saturate(${1 - g})` : undefined }}>
        <AbsoluteFill style={{ WebkitMaskImage: m, maskImage: m }}><OffthreadVideo src={staticFile(`${DIR}/${id}.mp4`)} muted /></AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
/* ---------- 氛围：开场墨散、墨色暗角、金尘、薄雾、胶片颗粒、金色扫光 ---------- */
const InkOpen: React.FC<{ dur?: number }> = ({ dur = 0.6 }) => {
  const t = useT();
  if (t > dur) return null;
  const u = ease(t, 0, dur, Easing.in(Easing.quad));
  const holes = [[0.5, 0.42, 0], [0.22, 0.3, 0.12], [0.8, 0.28, 0.08], [0.3, 0.8, 0.2], [0.75, 0.78, 0.16]];
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={W} height={H}>
        <defs>
          <filter id="inko" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="4" seed={4} /><feDisplacementMap in="SourceGraphic" scale="190" xChannelSelector="R" yChannelSelector="G" /><feGaussianBlur stdDeviation="14" /></filter>
          <mask id="inkm"><rect width={W} height={H} fill="#fff" />
            <g filter="url(#inko)">{holes.map(([x, y, d], i) => <circle key={i} cx={x * W} cy={y * H} r={Math.max(0, (u - d) / (1 - d)) * 1400} fill="#000" />)}</g>
          </mask>
        </defs>
        <rect width={W} height={H} fill={INK} mask="url(#inkm)" />
      </svg>
    </AbsoluteFill>
  );
};
const InkVig: React.FC<{ from: number; to: number; k?: number }> = ({ from, to, k = 0.9 }) => {
  const t = useT();
  if (t < from || t > to) return null;
  const p = interpolate(t, [from, to - 0.25, to], [0, 1, 0], clamp);
  return <AbsoluteFill style={{ pointerEvents: 'none', background: `radial-gradient(ellipse 58% 66% at 50% 42%, rgba(18,14,10,0) ${62 - 26 * p}%, rgba(18,14,10,${k * p}) 100%)` }} />;
};
const BaseVig = () => <AbsoluteFill style={{ pointerEvents: 'none', background: 'radial-gradient(ellipse 75% 80% at 50% 45%, rgba(18,14,10,0) 45%, rgba(18,14,10,0.72) 100%)' }} />;
const GoldDust: React.FC<{ n?: number; seed?: number; burst?: number }> = ({ n = 60, seed = 3, burst }) => {
  const t = useT(), r = rng(seed);
  const ps = Array.from({ length: n }, () => ({ x: r(), y: r(), s: 0.4 + r(), ph: r() * 6.28, sp: 0.3 + r() * 0.9 }));
  const b = burst !== undefined && t >= burst ? 1 - ease(t, burst, 1.6) : 0;
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'screen' }}>
      <defs><radialGradient id="gd"><stop offset="0%" stopColor="#FFF6DA" /><stop offset="40%" stopColor="#E8C77E" stopOpacity={0.8} /><stop offset="100%" stopColor="#B8893E" stopOpacity={0} /></radialGradient></defs>
      {ps.map((p, i) => {
        const y = ((p.y * H - t * 30 * p.sp * (1 + 6 * b)) % H + H) % H, x = p.x * W + Math.sin(t * 0.6 + p.ph) * 24;
        const tw = 0.35 + 0.65 * Math.max(0, Math.sin(t * (0.9 + p.sp) + p.ph * 2));
        return <circle key={i} cx={x} cy={y} r={4.5 * p.s * (1 + b)} fill="url(#gd)" opacity={tw * (0.55 + 0.45 * b)} />;
      })}
    </svg>
  );
};
const Mist: React.FC<{ o?: number }> = ({ o = 0.16 }) => {
  const t = useT();
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: o }}>
      <defs><filter id="mst" x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="60" /></filter></defs>
      <g filter="url(#mst)" fill="#EDE4D2">
        <ellipse cx={300 + ((t * 22) % 500)} cy={900} rx={700} ry={130} />
        <ellipse cx={1500 - ((t * 18) % 500)} cy={980} rx={760} ry={150} />
      </g>
    </svg>
  );
};
const Grain = () => {
  const fr = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5, mixBlendMode: 'overlay' }}>
      <filter id="grn"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={fr % 7} /><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.16 0" /></filter>
      <rect width={W} height={H} filter="url(#grn)" />
    </svg>
  );
};
// 金色斜扫光（screen 叠，0.7 秒扫过整个画面）
const Flare: React.FC<{ at: number; dur?: number; k?: number }> = ({ at, dur = 0.8, k = 0.55 }) => {
  const t = useT();
  if (t < at || t > at + dur) return null;
  const u = ease(t, at, dur, eio), o = Math.sin(Math.PI * u) * k;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen', opacity: o,
      background: `linear-gradient(115deg, rgba(255,230,170,0) ${u * 140 - 40}%, rgba(255,232,180,0.9) ${u * 140 - 20}%, rgba(255,240,210,1) ${u * 140 - 16}%, rgba(255,230,170,0) ${u * 140 + 4}%)` }} />
  );
};
// 水墨横扫转场（前半盖上、后半揭开）
const InkBrush: React.FC<{ at: number; dur?: number }> = ({ at, dur = 0.6 }) => {
  const t = useT();
  if (t < at || t > at + dur) return null;
  const mid = at + dur / 2, inn = t <= mid;
  const u = inn ? ease(t, at, dur / 2, Easing.in(Easing.cubic)) : 1 - ease(t, mid, dur / 2);
  const xx = inn ? (u - 1) * W * 1.4 : (1 - u) * W * 1.4;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={W} height={H}>
        <filter id={`ib${Math.round(at * 100)}`} x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="4" seed={5} /><feDisplacementMap in="SourceGraphic" scale="240" xChannelSelector="R" yChannelSelector="G" /></filter>
        <g transform={`rotate(-6 ${W / 2} ${H / 2})`}><rect x={xx - 300} y={-500} width={W + 600} height={H + 1000} fill={INK} filter={`url(#ib${Math.round(at * 100)})`} /></g>
      </svg>
    </AbsoluteFill>
  );
};

// 讲到重点换背景（像绿幕）：studio 生的 B-roll 影片铺在原背景上面、人像抠像叠在最前；
// 背景放大一点慢推 + 轻微景深模糊（原片只有 752×416，放大后当虚化背景用）+ 四周压一点暗角
const Broll: React.FC<{ src: string; from: number; to: number; push?: number; blur?: number; bright?: number }> = ({ src, from, to, push = 0.08, blur = 1.6, bright = 1 }) => {
  const t = useT();
  if (t < from - 0.01 || t > to) return null;
  const o = win(t, from, to, 0.22, 0.25), k = 1.04 + push * ease(t, from, to - from, eio);
  const rate = Math.min(1, 4.9 / (to - from));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Sequence from={f(from)} durationInFrames={Math.max(1, f(to - from))} layout="none">
        <AbsoluteFill style={{ transform: `scale(${k})`, filter: `blur(${blur}px) brightness(${bright})` }}>
          <OffthreadVideo src={staticFile(`suyenbr/${src}.mp4`)} muted playbackRate={rate} />
        </AbsoluteFill>
      </Sequence>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 70% 75% at 50% 45%, rgba(0,0,0,0) 50%, rgba(10,8,6,0.5) 100%)' }} />
    </AbsoluteFill>
  );
};

// 整画面切到 B-roll（不抠人；Reagan：「B-roll 不常换，hook 每 15 秒换一次」「points 用半身圆框讲解」）
// Suyen 原片缩进右下角金框圆窗（半身）继续讲；圆窗里是原片同一时间，不带声音（声音来自底下的原片）
// 圆框跟着人（Reagan：「圈圈永远要跟着人」）：suyen-ads/tools/facetrack 逐帧找她的脸（只跟离上一格最近的脸，避开海报上的人脸），对准脸中心往下 150px，平滑 7 格
const TRACK: Partial<Record<HookId, { x: number[]; y: number[] }>> = { p1: TK_P1 as any, i2: TK_I2 as any, p6: TK_P6 as any, ep1: TK_EP1 as any };
const Cutaway: React.FC<{ id: HookId; src: string; from: number; to: number; focus: [number, number]; zoom?: number; bg?: React.ReactNode; cont?: boolean; last?: boolean; skip?: number }> = ({ id, src, from, to, focus: focus0, zoom = 0.62, bg, cont, last = true, skip = 0 }) => {
  const t = useT();
  const tk = TRACK[id], fi = tk ? Math.max(0, Math.min(tk.x.length - 1, Math.round(t * FPS))) : 0;
  const focus: [number, number] = tk ? [tk.x[fi], tk.y[fi]] : focus0;
  if (t < from - 0.01 || t > to) return null;
  // jump：B-roll 硬切进出 + 冲进来（Reagan 10-31：「要 jump jump jump」）
  const o = win(t, from, to, 0.001, 0.001), k = 1.02 + (cont ? 0 : 0.16 * (1 - ease(t, from, 0.18, Easing.out(Easing.cubic)))) + 0.06 * ease(t, from, to - from, eio);
  const rate = Math.min(1, 5.9 / (to - from));
  const D = 400, cx = 1640, cy = 690, pin = cont ? 1 : ease(t, from, 0.4, Easing.out(Easing.back(1.6)));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Sequence from={f(from)} durationInFrames={Math.max(1, f(to - from))} layout="none">
        <AbsoluteFill style={{ transform: `scale(${k})` }}>{bg ?? <OffthreadVideo src={staticFile(`suyenbr/${src}.mp4`)} muted playbackRate={rate} startFrom={f(skip)} />}</AbsoluteFill>
      </Sequence>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 75% 80% at 45% 45%, rgba(0,0,0,0) 55%, rgba(10,8,6,0.45) 100%)' }} />
      <div style={{ position: 'absolute', left: cx - D / 2, top: cy - D / 2, width: D, height: D, transform: `scale(${pin})` }}>
        <div style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: '2px solid rgba(232,199,126,0.7)' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', border: '5px solid #E8C77E', boxShadow: '0 18px 40px rgba(0,0,0,0.6)' }}>
          <OffthreadVideo src={staticFile(`suyenh/${id}.mp4`)} muted style={{ position: 'absolute', width: W * zoom, height: H * zoom, left: D / 2 - focus[0] * zoom, top: D / 2 - focus[1] * zoom }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 字 ---------- */
type Sub = [string, number, number];
const Subs: React.FC<{ subs: Sub[]; cx?: number }> = ({ subs, cx = 960 }) => {
  const t = useT(), s = subs.find(([, a, b]) => t >= a && t < b);
  if (!s) return null;
  return (
    <div style={{ position: 'absolute', left: cx - 800, width: 1600, top: 958, textAlign: 'center', fontFamily: LTH, fontSize: 50, letterSpacing: 3, color: CREAM,
      opacity: interpolate(t, [s[1], s[1] + 0.1], [0, 1], clamp), filter: depth('cream', 50) }}>{s[0]}</div>
  );
};
// 大字：兰亭黑特粗 + 金渐层，斜 3D 立体（照 UNO / craft/popglass：perspective 里 rotateY/rotateX + 往后叠厚度层）
// 入场 = 从更斜的角度转正一点 + 羽化遮罩由左往右扫 + 模糊收；之后一道扫光、角度慢慢飘
// 注意：filter / opacity / mask 加在 3D 父层会把立体压扁，所以只加在最里面的单层字上
type Tone = 'gold' | 'cream' | 'red';
const toneCss = (tone: Tone, sweep: number): React.CSSProperties => tone === 'gold'
  ? { backgroundImage: `linear-gradient(110deg, rgba(255,255,255,0) ${sweep - 10}%, rgba(255,250,235,0.95) ${sweep}%, rgba(255,255,255,0) ${sweep + 10}%), ${GOLD_GRAD}`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }
  : { color: tone === 'red' ? '#D8463A' : CREAM };
const mix = (a: string, b: string, k: number) => {
  const h = (c: string, i: number) => parseInt(c.slice(1 + i * 2, 3 + i * 2), 16);
  return '#' + [0, 1, 2].map((i) => Math.round(h(a, i) + (h(b, i) - h(a, i)) * k).toString(16).padStart(2, '0')).join('');
};
const SIDE: Record<Tone, [string, string]> = { gold: ['#7A4E16', '#1E1204'], cream: ['#6E6556', '#1C1812'], red: ['#6A160E', '#1E0604'] };
// 剪映文字入场（数字照 JyText.tsx 逐帧量的；Reagan 10-30：「多用剪映的 text animation，尤其是缩小II」）
type JyIn = '缩小II' | '呐喊声波' | '向左模糊' | '放大' | '扫入';
const c01 = (v: number) => Math.max(0, Math.min(1, v));
const jyIn = (a: JyIn, fr: number, size: number, wipe: number) => {
  const k = size / 140;
  switch (a) {
    case '缩小II': return { s: Math.exp(interpolate(fr, [1, 5, 9, 11, 13, 15], [Math.log(13), Math.log(9), Math.log(3.8), Math.log(1.92), Math.log(1.25), 0], clamp)), op: c01(fr / 5), dx: 0, blur: 0, p: c01(fr / 15), mask: false };
    case '呐喊声波': return { s: fr <= 4 ? 0.15 + 0.88 * (fr / 4) : fr <= 6 ? 1.03 - 0.015 * (fr - 4) : 1, op: 1, dx: 0, blur: 0, p: c01(fr / 6), mask: false };
    case '向左模糊': { const g = Math.max(0, fr - 2); return { s: 1, op: fr < 2 ? 0 : 1, dx: 664 * k * Math.pow(0.5, g), blur: 5 * Math.pow(0.5, g), p: c01(fr / 8), mask: false }; }
    case '放大': { const q = 1 - (1 - c01(fr / 21)) ** 2; return { s: 0.48 + 0.52 * q, op: q, dx: 0, blur: 0, p: q, mask: false }; }
    default: return { s: 1.06 - 0.06 * wipe, op: 1, dx: 0, blur: (1 - wipe) * 10, p: wipe, mask: true };
  }
};
const Hero: React.FC<{ text: string; at: number; until: number; x: number; y: number; size: number; tone?: Tone; ls?: number; rule?: boolean; vertical?: boolean; dur?: number; glow?: number; rotY?: number; rotX?: number; anim?: JyIn }> = ({ text, at, until, x, y, size, tone = 'gold', ls = 0.12, rule, vertical, dur = 0.55, glow = 0.35, rotY, rotX = 16, anim: jy = '缩小II' }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const e = jyIn(jy, (t - at) * FPS, size, ease(t, at, dur)), p = e.p, out = 1 - ease(t, until - 0.3, 0.3, Easing.in(Easing.quad));
  const sweep = interpolate(t, [at + dur * 0.7, at + dur * 0.7 + 0.9], [-20, 130], clamp);
  const m = p * 140 - 20;
  const mask = vertical ? `linear-gradient(180deg, #000 ${m - 20}%, transparent ${m + 8}%)` : `linear-gradient(90deg, #000 ${m - 20}%, transparent ${m + 8}%)`;
  const ry0 = rotY ?? (x < W * 0.4 ? 32 : x > W * 0.6 ? -32 : -16);
  const ry = ry0 * (1 + 0.6 * (1 - p)) + Math.sin((t - at) * 0.9) * 3, rx = rotX * (1 + 0.5 * (1 - p));
  const blur = e.blur + (1 - out) * 8, o = out * e.op;
  const n = Math.max(10, Math.round(size / 12)), step = size / 130;
  const [s1, s2] = SIDE[tone];
  // 只在入场/出场那一下加遮罩、模糊、透明（静止时一律不加，免得 3D 被压扁、字后面冒出方框）
  const moving = p < 0.999 || o < 0.999;
  const anim = (sh: string): React.CSSProperties => ({
    ...(moving ? { opacity: o, ...(e.mask ? { WebkitMaskImage: mask, maskImage: mask } : {}) } : {}),
    ...(sh || blur > 0.05 ? { filter: [sh, blur > 0.05 ? `blur(${blur}px)` : ''].filter(Boolean).join(' ') } : {}),
  });
  const font: React.CSSProperties = { fontFamily: LTH, fontSize: size, lineHeight: vertical ? 1.08 : 1.2, letterSpacing: `${ls + (e.mask ? (1 - p) * 0.25 : 0)}em`, marginRight: `-${ls}em`, writingMode: vertical ? 'vertical-rl' : undefined, whiteSpace: 'nowrap' };
  const leaf = (st: React.CSSProperties, extra: React.CSSProperties = {}) => ({ ...font, ...st, position: 'absolute' as const, left: 0, top: 0, ...extra });
  return (
    <div style={{ position: 'absolute', left: x - 1000, width: 2000, top: vertical ? y : y - size * 0.6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ perspective: 1400, transform: `translateX(${e.dx}px) scale(${e.s})` }}>
        <div style={{ position: 'relative', transformStyle: 'preserve-3d', transform: `rotateY(${ry}deg) rotateX(${rx}deg)` }}>
          <div style={{ ...font, visibility: 'hidden' }}>{text}</div>
          {Array.from({ length: n }, (_, k) => n - k).map((k) => (
            <div key={k} style={leaf({ color: mix(s1, s2, k / n) }, { transform: `translateZ(${-k * step}px)`, ...anim('') })}>{text}</div>
          ))}
          <div style={leaf(toneCss(tone, sweep), { transform: 'translateZ(1px)', ...anim('') })}>{text}</div>
        </div>
      </div>
      {rule && <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: size * 0.06, opacity: ease(t, at + 0.2, 0.4) * out }}>
        <div style={{ width: size * 1.1 * ease(t, at + 0.2, 0.6), height: 2, background: `linear-gradient(90deg, rgba(217,184,114,0), ${GOLD_LINE})` }} />
        <div style={{ width: 9, height: 9, transform: 'rotate(45deg)', background: GOLD_LINE }} />
        <div style={{ width: size * 1.1 * ease(t, at + 0.2, 0.6), height: 2, background: `linear-gradient(90deg, ${GOLD_LINE}, rgba(217,184,114,0))` }} />
      </div>}
    </div>
  );
};
// 朱砂印：方印、白字、边缘毛糙；压下去 1.35→1
const Seal: React.FC<{ text: string; at: number; until: number; x: number; y: number; size?: number; rot?: number }> = ({ text, at, until, x, y, size = 150, rot = -5 }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const k = interpolate(t, [at, at + 0.14], [1.35, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const ch = [...text], n = ch.length, cols = n <= 2 ? 1 : 2, rows = Math.ceil(n / cols), fs = size * (n <= 1 ? 0.62 : n <= 2 ? 0.4 : 0.36);
  const id = `seal${Math.round(at * 100)}`;
  // 印章字序：右列上→下，再左列
  const cell = (i: number) => { const c = cols === 1 ? 0 : i < rows ? 1 : 0, r = cols === 1 ? i : i % rows; return [size / 2 + (cols === 1 ? 0 : (c - 0.5) * size * 0.44), size / 2 + (r - (rows - 1) / 2) * size * (0.84 / rows)]; };
  return (
    <svg width={size * 1.4} height={size * 1.4} style={{ position: 'absolute', left: x - size * 0.7, top: y - size * 0.7, overflow: 'visible', opacity: win(t, at, until, 0.06, 0.3) }}>
      <defs><filter id={id} x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed={9} /><feDisplacementMap in="SourceGraphic" scale="4" xChannelSelector="R" yChannelSelector="G" /></filter></defs>
      <g transform={`translate(${size * 0.7},${size * 0.7}) scale(${k}) rotate(${rot}) translate(${-size / 2},${-size / 2})`} filter={`url(#${id})`} style={{ filter: `url(#${id}) drop-shadow(0 6px 14px rgba(0,0,0,0.5))` }}>
        <rect width={size} height={size} rx={size * 0.05} fill={CINNABAR} />
        <rect x={size * 0.06} y={size * 0.06} width={size * 0.88} height={size * 0.88} rx={size * 0.03} fill="none" stroke="#F6E9DA" strokeWidth={size * 0.025} />
        {ch.map((c, i) => { const [cx, cy] = cell(i); return <text key={i} x={cx} y={cy} fontFamily={LTH} fontSize={fs} fill="#F6E9DA" textAnchor="middle" dominantBaseline="central">{c}</text>; })}
      </g>
    </svg>
  );
};
// 朱砂毛笔一笔划过（一刀）
const BrushSlash: React.FC<{ at: number; until: number; x1: number; y1: number; x2: number; y2: number; w?: number; dur?: number }> = ({ at, until, x1, y1, x2, y2, w = 60, dur = 0.16 }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const p = ease(t, at, dur, Easing.out(Easing.quad)), id = `bs${Math.round(at * 100)}`;
  const nx = -(y2 - y1), ny = x2 - x1, L = Math.hypot(nx, ny), ux = nx / L, uy = ny / L;
  const xe = x1 + (x2 - x1) * p, ye = y1 + (y2 - y1) * p;
  // 起笔粗、收笔尖
  const d = `M ${x1 - ux * w * 0.3} ${y1 - uy * w * 0.3} Q ${(x1 + xe) / 2 - ux * w * 0.6} ${(y1 + ye) / 2 - uy * w * 0.6} ${xe} ${ye} Q ${(x1 + xe) / 2 + ux * w * 0.5} ${(y1 + ye) / 2 + uy * w * 0.5} ${x1 + ux * w * 0.3} ${y1 + uy * w * 0.3} Z`;
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: win(t, at, until, 0.02, 0.3) }}>
      <filter id={id} x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed={2} /><feDisplacementMap in="SourceGraphic" scale="22" xChannelSelector="R" yChannelSelector="G" /></filter>
      <path d={d} fill={CINNABAR} filter={`url(#${id})`} opacity={0.95} style={{ filter: `url(#${id}) drop-shadow(0 0 18px rgba(184,49,47,0.55))` }} />
    </svg>
  );
};

/* ---------- 金线罗盘 ---------- */
const SHAN = '壬子癸丑艮寅甲卯乙辰巽巳丙午丁未坤申庚酉辛戌乾亥';
const GUA = [[1, 1, 1], [0, 1, 0], [1, 0, 0], [0, 0, 1], [0, 1, 1], [1, 0, 1], [0, 0, 0], [1, 1, 0]]; // 1=阳爻
const Luopan: React.FC<{ at: number; until: number; x: number; y: number; r: number; spin?: (lt: number) => number; lock?: number; o?: number }> = ({ at, until, x, y, r, spin = (lt) => lt * 12, lock, o = 0.9 }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const lt = t - at, draw = (i: number) => ease(t, at + i * 0.08, 0.7, eio);
  const rot = spin(lt), lk = lock !== undefined ? ease(t, lock, 0.5) : 0;
  const needle = lock !== undefined && t >= lock ? 30 + Math.sin((t - lock) * 18) * 10 * (1 - lk) : 30 + lt * 260 + Math.sin(lt * 5) * 50;
  const R = [1, 0.86, 0.66, 0.5, 0.3];
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: win(t, at, until, 0.4, 0.4) * o, filter: `drop-shadow(0 0 ${6 + 14 * lk}px rgba(232,190,110,${0.5 + 0.4 * lk}))` }}>
      <g transform={`translate(${x},${y})`} fill="none" stroke={GOLD_LINE}>
        {R.map((k, i) => <circle key={i} r={r * k} strokeWidth={i === 0 ? 3 : 1.4} strokeDasharray={2 * Math.PI * r * k} strokeDashoffset={2 * Math.PI * r * k * (1 - draw(i))} transform="rotate(-90)" />)}
        <g transform={`rotate(${rot})`} opacity={draw(1)}>
          {Array.from({ length: 120 }).map((_, i) => { const a = (i / 120) * Math.PI * 2, k0 = i % 5 ? 0.955 : 0.93; return <line key={i} x1={Math.cos(a) * r * k0} y1={Math.sin(a) * r * k0} x2={Math.cos(a) * r * 0.995} y2={Math.sin(a) * r * 0.995} strokeWidth={i % 5 ? 1 : 2} />; })}
          {[...SHAN].map((c, i) => { const a = (i / 24) * 360; return <text key={i} transform={`rotate(${a}) translate(0,${-r * 0.76})`} fontFamily={LTH} fontSize={r * 0.085} fill={GOLD_LINE} stroke="none" textAnchor="middle" dominantBaseline="central">{c}</text>; })}
          {Array.from({ length: 24 }).map((_, i) => { const a = ((i + 0.5) / 24) * Math.PI * 2; return <line key={`d${i}`} x1={Math.cos(a) * r * 0.66} y1={Math.sin(a) * r * 0.66} x2={Math.cos(a) * r * 0.86} y2={Math.sin(a) * r * 0.86} strokeWidth={1} opacity={0.6} />; })}
        </g>
        <g transform={`rotate(${-rot * 1.6})`} opacity={draw(2)}>
          {GUA.map((g, i) => (
            <g key={i} transform={`rotate(${i * 45}) translate(0,${-r * 0.58})`}>
              {g.map((yang, k) => yang ? <line key={k} x1={-r * 0.06} x2={r * 0.06} y1={(k - 1) * r * 0.03} y2={(k - 1) * r * 0.03} strokeWidth={r * 0.013} />
                : <g key={k}><line x1={-r * 0.06} x2={-r * 0.012} y1={(k - 1) * r * 0.03} y2={(k - 1) * r * 0.03} strokeWidth={r * 0.013} /><line x1={r * 0.012} x2={r * 0.06} y1={(k - 1) * r * 0.03} y2={(k - 1) * r * 0.03} strokeWidth={r * 0.013} /></g>)}
            </g>
          ))}
        </g>
        <g transform={`rotate(${rot * 0.5})`} opacity={draw(3)}>
          {Array.from({ length: 8 }).map((_, i) => <line key={i} x1={0} y1={-r * 0.3} x2={0} y2={-r * 0.5} transform={`rotate(${i * 45})`} strokeWidth={1.2} />)}
        </g>
        <g transform={`rotate(${needle})`} opacity={draw(4)} stroke="none">
          <polygon points={`0,${-r * 0.44} ${r * 0.022},0 ${-r * 0.022},0`} fill="#D8463A" />
          <polygon points={`0,${r * 0.44} ${r * 0.022},0 ${-r * 0.022},0`} fill={CREAM} opacity={0.85} />
          <circle r={r * 0.035} fill={GOLD_LINE} />
        </g>
      </g>
    </svg>
  );
};
// 罗盘转速：开场快转，1.6 秒内收慢
const fastToSlow = (v0: number, v1: number, k = 1.6) => (lt: number) => v1 * lt + (v0 - v1) * k * (1 - Math.exp(-lt / k * 2)) / 2;

/* ---------- 洛书九宫（金线 + 数字依 1→9 亮起 + 连线；破局时九格散开） ---------- */
const LUOSHU = [4, 9, 2, 3, 5, 7, 8, 1, 6];
const Luoshu: React.FC<{ at: number; shatter: number; until: number; x: number; y: number; cell: number }> = ({ at, shatter, until, x, y, cell }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const sh = ease(t, shatter, 0.7, Easing.out(Easing.quad)), g = ease(t, at, 0.7, eio);
  const pos = (n: number) => { const i = LUOSHU.indexOf(n), r = Math.floor(i / 3), c = i % 3; return [x + (c - 1) * cell, y + (r - 1) * cell]; };
  const path = Array.from({ length: 9 }, (_, i) => pos(i + 1)), lp = ease(t, at + 0.3, 1.0, eio);
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: win(t, at, until, 0.2, 0.35), filter: 'drop-shadow(0 0 8px rgba(232,190,110,0.6))' }}>
      {LUOSHU.map((n, i) => {
        const r = Math.floor(i / 3) - 1, c = (i % 3) - 1, dx = c * 420 * sh + (c === 0 && r === 0 ? 0 : 0), dy = r * 300 * sh, rot = ((n * 37) % 50 - 25) * sh;
        const lit = ease(t, at + 0.12 + (n - 1) * 0.11, 0.25);
        return (
          <g key={i} transform={`translate(${x + c * cell + dx},${y + r * cell + dy}) rotate(${rot})`} opacity={1 - sh * 0.85}>
            <rect x={-cell / 2 + 6} y={-cell / 2 + 6} width={cell - 12} height={cell - 12} fill={`rgba(20,14,8,${0.25 * g})`} stroke={GOLD_LINE} strokeWidth={1.6}
              strokeDasharray={4 * (cell - 12)} strokeDashoffset={4 * (cell - 12) * (1 - g)} />
            <text fontFamily={LTH} fontSize={cell * 0.36} fill={n === 5 ? '#C0392B' : '#8A5A16'} textAnchor="middle" dominantBaseline="central" opacity={lit} transform={`scale(${0.8 + 0.2 * lit})`}>{n}</text>
          </g>
        );
      })}
      {sh < 0.2 && <polyline points={path.map((p) => p.join(',')).join(' ')} fill="none" stroke="#E8C77E" strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lp} opacity={0.75 * (1 - sh * 5)} />}
    </svg>
  );
};

/* ---------- P1：数字滚轮（宋体式优雅，非老虎机） ---------- */
// 开场数字：放大摆中间（Reagan：「一开始字体一定要大，可以放在中间」）；fall = 讲到「没达成」时整排变灰往下掉（代替斜划）
const Odometer: React.FC<{ value: string; spin: number; land: number; y: number; size: number; until: number; label?: string; fall?: number }> = ({ value, spin, land, y, size, until, label, fall }) => {
  const t = useT();
  if (t < spin || t > until) return null;
  const ch = value.split(''), digits = ch.filter((c) => /\d/.test(c)).length;
  let di = 0;
  const fl = fall !== undefined && t >= fall ? ease(t, fall, 0.55, Easing.in(Easing.quad)) : 0;
  return (
    <div style={{ position: 'absolute', left: 0, width: W, top: y - size * 0.75, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: win(t, spin, until, 0.15, 0.25) }}>
      {label && <div style={{ fontFamily: LTH, fontSize: size * 0.32, color: GOLD_LINE, letterSpacing: '0.4em', marginBottom: 8 }}>{label}</div>}
      <div style={{ width: size * 6, height: 2, background: `linear-gradient(90deg, rgba(176,126,42,0), ${GOLD_LINE}, rgba(176,126,42,0))`, marginBottom: 10 }} />
      <div style={{ display: 'flex', alignItems: 'baseline', transform: `translateY(${fl * 300}px) rotate(${-fl * 9}deg)`, filter: `grayscale(${fl}) brightness(${1 - 0.4 * fl})`, opacity: 1 - fl * 0.6 }}>
        {ch.map((c, i) => {
          if (!/\d/.test(c)) return <div key={i} style={{ fontFamily: LTH, fontSize: size * (c === ',' ? 0.6 : 0.62), backgroundImage: GOLD_DEEP, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', padding: '0 3px' }}>{c}</div>;
          const k = di++, stop = spin + (land - spin) * ((k + 1) / digits), rolling = t < stop;
          const off = rolling ? (t * 30 + k * 3.7) % 10 : 0, shown = rolling ? Math.floor(off) : Number(c);
          return (
            <div key={i} style={{ width: size * 0.6, height: size * 1.12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitMaskImage: 'linear-gradient(180deg, transparent, #000 25%, #000 75%, transparent)' }}>
              <div style={{ fontFamily: LTH, fontSize: size, lineHeight: 1, backgroundImage: GOLD_DEEP, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', transform: `translateY(${(rolling ? (off % 1) - 0.5 : 0) * size}px)`, filter: rolling ? 'blur(1.5px)' : undefined }}>{shown}</div>
            </div>
          );
        })}
      </div>
      <div style={{ width: size * 6, height: 2, background: `linear-gradient(90deg, rgba(176,126,42,0), ${GOLD_LINE}, rgba(176,126,42,0))`, marginTop: 10, opacity: 1 - fl }} />
    </div>
  );
};
// 一炷香：从 at 烧到 empty，香头红光、烟一缕缕往上
const Incense: React.FC<{ at: number; empty: number; until: number; x: number; y0: number; y1: number }> = ({ at, empty, until, x, y0, y1 }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const burn = interpolate(t, [at, empty], [0.04, 0.9], { ...clamp, easing: Easing.in(Easing.quad) });
  const top = y0 + (y1 - y0) * burn, glow = 0.7 + 0.3 * Math.sin(t * 9);
  const smoke = Array.from({ length: 4 }, (_, k) => {
    const pts: string[] = [];
    for (let j = 0; j <= 24; j++) { const yy = top - j * 22, xx = x + Math.sin(j * 0.35 - t * 1.6 + k * 1.7) * (6 + j * 2.4) + Math.sin(t * 0.7 + k) * j * 0.8; pts.push(`${xx},${yy}`); }
    return pts.join(' ');
  });
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: win(t, at, until, 0.4, 0.3) }}>
      <defs><filter id="smk" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" /></filter>
        <radialGradient id="ember"><stop offset="0%" stopColor="#FFE2A0" /><stop offset="45%" stopColor="#FF6A2A" stopOpacity={0.9} /><stop offset="100%" stopColor="#FF3A10" stopOpacity={0} /></radialGradient></defs>
      <g filter="url(#smk)" opacity={0.55}>{smoke.map((d, k) => <polyline key={k} points={d} fill="none" stroke="#E9E2D6" strokeWidth={4 - k * 0.6} opacity={1 - k * 0.2} />)}</g>
      <line x1={x} y1={top} x2={x} y2={y1} stroke="#7A2E1E" strokeWidth={9} strokeLinecap="round" />
      <line x1={x} y1={y1} x2={x} y2={y1 + 120} stroke="#C49A5A" strokeWidth={5} />
      <circle cx={x} cy={top} r={26 * glow} fill="url(#ember)" />
      <circle cx={x} cy={top} r={5} fill="#FFF0C8" />
      <rect x={x - 90} y={y1 + 110} width={180} height={18} rx={6} fill="#2A1E14" stroke={GOLD_LINE} strokeWidth={1.5} />
    </svg>
  );
};

/* ---------- I2：金线棋盘 + 棋子（几十→几百 → 冲） ---------- */
const GoBoard: React.FC<{ tens: number; hundreds: number; charge: number; until: number; x: number; w: number; side: -1 | 1; seed: number }> = ({ tens, hundreds, charge, until, x, w, side, seed }) => {
  const t = useT();
  if (t < tens - 0.4 || t > until) return null;
  const N = 9, ch = interpolate(t, [charge, until], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) }), g = ease(t, tens - 0.4, 0.6, eio);
  const r = rng(seed), cells: { i: number; j: number; a: number; white: boolean }[] = [];
  const all = Array.from({ length: N * N }, (_, k) => k).sort(() => r() - 0.5);
  all.slice(0, 54).forEach((k, n) => cells.push({ i: k % N, j: Math.floor(k / N), a: n < 9 ? tens + n * 0.09 : hundreds + (n - 9) * 0.018, white: r() > 0.45 }));
  const s = w / (N - 1);
  return (
    <div style={{ position: 'absolute', left: x, top: 470, width: w, height: w, perspective: 1100, opacity: win(t, tens - 0.4, until, 0.3, 0.15), filter: ch > 0 ? `blur(${ch * 8}px)` : undefined }}>
      <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transformOrigin: '50% 100%',
        transform: `translateZ(${ch * 700}px) rotateX(${62 - ch * 20}deg) rotateZ(${side * 8}deg)` }}>
        <svg width={w} height={w} style={{ overflow: 'visible' }}>
          {Array.from({ length: N }).map((_, k) => <g key={k} stroke={GOLD_LINE} strokeWidth={1.6} opacity={0.8}>
            <line x1={0} y1={k * s} x2={w * g} y2={k * s} /><line x1={k * s} y1={0} x2={k * s} y2={w * g} /></g>)}
          {cells.map((c, n) => {
            const p = ease(t, c.a, 0.18, Easing.out(Easing.back(2)));
            if (p <= 0) return null;
            return <g key={n} transform={`translate(${c.i * s},${c.j * s}) scale(${p})`}>
              <ellipse rx={s * 0.42} ry={s * 0.42} fill={c.white ? '#F2EADA' : '#16120E'} stroke={c.white ? '#C9B79A' : '#5A4A36'} strokeWidth={1.5} />
              <ellipse cx={-s * 0.12} cy={-s * 0.14} rx={s * 0.13} ry={s * 0.08} fill="#fff" opacity={c.white ? 0.7 : 0.18} />
            </g>;
          })}
        </svg>
      </div>
    </div>
  );
};
// 宣纸签（竖排字）：从上往下展开；可烧掉（底部往上烧、火边）或断绳掉落
const Slip: React.FC<{ text: string; at: number; until: number; x: number; y: number; w?: number; h?: number; size?: number; burn?: number; fall?: number; rot?: number }> = ({ text, at, until, x, y, w = 150, h = 520, size = 78, burn, fall, rot = 0 }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const un = ease(t, at, 0.45), b = burn !== undefined ? interpolate(t, [burn, burn + 0.8], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) }) : 0;
  const fl = fall !== undefined && t >= fall ? (t - fall) : 0, dy = 900 * fl * fl, fr = fl * (x < 960 ? -40 : 40);
  const sway = Math.sin(t * 1.4 + x) * 1.2;
  return (
    <div style={{ position: 'absolute', left: x - w / 2, top: y, width: w, height: h + 40, transform: `translateY(${dy}px) rotate(${rot + sway + fr}deg)`, transformOrigin: '50% 0', opacity: win(t, at, until, 0.1, 0.3) * Math.max(0, 1 - fl * 3.2) }}>
      <div style={{ position: 'absolute', left: w / 2 - 1, top: -y, width: 2, height: y + 6, background: `linear-gradient(${GOLD_LINE}00, ${GOLD_LINE})`, opacity: fl > 0 ? 0 : 0.8 }} />
      <div style={{ position: 'absolute', left: -10, top: 0, width: w + 20, height: 16, borderRadius: 8, background: 'linear-gradient(#6B4A2A, #3A2614)', boxShadow: '0 3px 8px rgba(0,0,0,0.5)' }} />
      <div style={{ position: 'absolute', left: 0, top: 10, width: w, height: h, clipPath: `inset(0 0 ${Math.max(1 - un, b) * 100}% 0)`, filter: 'drop-shadow(0 18px 30px rgba(0,0,0,0.55))' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #E6DAC2, #F3EADA 50%, #E2D5BB)', borderLeft: `3px solid ${GOLD_LINE}`, borderRight: `3px solid ${GOLD_LINE}` }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', paddingTop: 36 }}>
          <div style={{ writingMode: 'vertical-rl', fontFamily: LTH, fontSize: size, letterSpacing: '0.08em', color: '#1A1410' }}>{text}</div>
        </div>
        <div style={{ position: 'absolute', left: w / 2 - 20, bottom: 24, width: 40, height: 40, background: CINNABAR, borderRadius: 4, opacity: 0.85 }} />
        {b > 0 && <div style={{ position: 'absolute', left: -6, right: -6, top: `${(1 - b) * 100 - 6}%`, height: 70, background: 'linear-gradient(0deg, rgba(255,90,20,0), #FFB24A 30%, #FF5A1A 50%, #2A140A 75%, rgba(20,10,4,0))', filter: 'blur(4px)', boxShadow: '0 0 40px rgba(255,110,30,0.8)' }} />}
      </div>
    </div>
  );
};
// 火星（只在底部打暖光，不加整体黄滤镜）
const Embers: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const t = useT();
  if (t < from || t > to) return null;
  const k = ease(t, from, 0.6);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: `linear-gradient(0deg, rgba(255,90,20,${0.32 * k}) 0%, rgba(255,90,20,0) 38%)`, mixBlendMode: 'screen' }} />
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen' }}>
        {Array.from({ length: Math.round(70 * k) }).map((_, i) => {
          const sp = 160 + (i % 7) * 50, y = H - (((t - from) * sp + i * 137) % (H * 0.8)), x = ((i * 191) % W) + Math.sin(t * 2 + i) * 30;
          return <circle key={i} cx={x} cy={y} r={1.5 + (i % 4) * 1.2} fill={i % 3 ? '#FFB24A' : '#FF6A2A'} opacity={0.8 * (y / H)} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/* ---------- P6：金线宅院 + 退路 ---------- */
const House: React.FC<{ at: number; road: number; until: number; x: number; y: number }> = ({ at, road, until, x, y }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const d = ease(t, at, 1.0, eio), rd = ease(t, road, 1.0, eio), q = ease(t, road + 0.9, 0.35);
  const roof = `M ${x - 260} ${y + 10} Q ${x - 170} ${y - 20} ${x - 150} ${y - 90} L ${x + 150} ${y - 90} Q ${x + 170} ${y - 20} ${x + 260} ${y + 10}`;
  const ridge = `M ${x - 175} ${y - 90} Q ${x - 200} ${y - 120} ${x - 225} ${y - 118} M ${x + 175} ${y - 90} Q ${x + 200} ${y - 120} ${x + 225} ${y - 118} M ${x - 150} ${y - 90} L ${x + 150} ${y - 90}`;
  const body = `M ${x - 200} ${y + 10} L ${x - 200} ${y + 220} L ${x + 200} ${y + 220} L ${x + 200} ${y + 10} M ${x - 60} ${y + 220} L ${x - 60} ${y + 90} L ${x + 60} ${y + 90} L ${x + 60} ${y + 220}`;
  const roadD = `M ${x + 60} ${y + 225} C ${x + 160} ${y + 300}, ${x - 40} ${y + 380}, ${x - 220} ${y + 400} S ${x - 420} ${y + 470} ${x - 400} ${y + 520}`;
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: win(t, at, until, 0.3, 0.3), filter: 'drop-shadow(0 0 8px rgba(232,190,110,0.55))' }}>
      <defs><radialGradient id="hsbg"><stop offset="0%" stopColor="#120E0A" stopOpacity={0.75} /><stop offset="100%" stopColor="#120E0A" stopOpacity={0} /></radialGradient></defs>
      <ellipse cx={x - 80} cy={y + 200} rx={520} ry={420} fill="url(#hsbg)" opacity={d} />
      {[roof, ridge, body].map((p, i) => <path key={i} d={p} fill="none" stroke={GOLD_LINE} strokeWidth={i === 0 ? 4 : 2.2} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(t, at + i * 0.2, 0.9, eio)} />)}
      {Array.from({ length: 4 }).map((_, i) => <circle key={i} cx={x - 120 + i * 80} cy={y + 170} r={8} fill={GOLD_LINE} opacity={ease(t, at + 0.8 + i * 0.1, 0.3) * d} />)}
      <filter id="rdink"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed={3} /><feDisplacementMap in="SourceGraphic" scale="8" xChannelSelector="R" yChannelSelector="G" /></filter>
      {rd > 0 && <path d={roadD} fill="none" stroke="#D8463A" strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - rd} filter="url(#rdink)" />}
      {q > 0 && <text x={x - 400} y={y + 610} fontFamily={LTH} fontSize={120} fill="#D8463A" textAnchor="middle" dominantBaseline="central" opacity={q} transform={`translate(${x - 400},${y + 610}) scale(${0.7 + 0.3 * q}) translate(${-(x - 400)},${-(y + 610)})`}>？</text>}
    </svg>
  );
};
// 活动 logo（最后「马上报名」那段，Reagan 10-31）：透明底、不加底色卡片（「background no need color, just transparent」）；放人后层，在她左边
const EventLogo: React.FC<{ at: number; until: number; x?: number; y?: number; w?: number }> = ({ at, until, x = 380, y = 560, w = 620 }) => {
  const t = useT();
  if (t < at || t > until + 0.01) return null;
  const p = ease(t, at, 0.5, Easing.out(Easing.back(1.4))), o = win(t, at, until, 0.25, 0.001), h = (w * 1161) / 1280;
  return <Img src={staticFile('suyenph/event-logo.png')} style={{ position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: o, transform: `scale(${0.85 + 0.15 * p})`, filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.35))' }} />;
};
// light：浅色墙用（墨色名字 + 深金头衔），不然米白字在米白墙上看不见
const NameTag: React.FC<{ at: number; until: number; x: number; y: number; light?: boolean }> = ({ at, until, x, y, light }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const p = ease(t, at, 0.6);
  return (
    <div style={{ position: 'absolute', left: x, top: y, display: 'flex', gap: 22, alignItems: 'stretch', opacity: win(t, at, until, 0.3, 0.3) }}>
      <div style={{ width: 2, background: `linear-gradient(${GOLD_LINE}, rgba(217,184,114,0))`, transform: `scaleY(${p})`, transformOrigin: 'top' }} />
      <div style={{ WebkitMaskImage: `linear-gradient(90deg, #000 ${p * 130 - 20}%, transparent ${p * 130}%)` }}>
        <div style={{ fontFamily: LTH, fontSize: light ? 76 : 64, color: light ? '#22180F' : CREAM, letterSpacing: '0.2em', filter: light ? undefined : depth('cream', 64) }}>林舒苑</div>
        <div style={{ fontFamily: LTH, fontSize: light ? 34 : 28, letterSpacing: '0.35em', marginTop: 8, ...(light ? { backgroundImage: GOLD_DEEP, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' } : toneCss('gold', -50)) }}>奇门遁甲战略导师</div>
      </div>
    </div>
  );
};
// 金色细裂纹（像瓷器开片）
const Crackle: React.FC<{ at: number; until: number; cx: number; cy: number }> = ({ at, until, cx, cy }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const p = ease(t, at, 0.35);
  const rays = Array.from({ length: 11 }).map((_, i) => {
    const a = (i / 11) * Math.PI * 2 + (i % 3) * 0.3; let x = cx, y = cy; const pts = [`${x},${y}`];
    for (let k = 1; k <= 7; k++) { const r = 110 * k * (1 + (i % 4) * 0.15), j = Math.sin(i * 7 + k * 3) * 0.22; x = cx + Math.cos(a + j) * r; y = cy + Math.sin(a + j) * r; pts.push(`${x},${y}`); }
    return pts.join(' ');
  });
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: win(t, at, until, 0.05, 0.3) }}>
      <g stroke="rgba(246,238,220,0.85)" strokeWidth={1.6} fill="none" style={{ filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.9))' }}>
        {rays.map((d, i) => <polyline key={i} points={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />)}
      </g>
    </svg>
  );
};

/* ---------- 骨架：压暗底片 → 人后层 → 人像 → 前景 → 氛围 ---------- */
const Frame: React.FC<{ id: HookId; cam: Cam; grade: Grade; behind?: React.ReactNode; front?: React.ReactNode; sfx: React.ReactNode; subs: Sub[]; subX?: number; stage?: React.ReactNode; dust?: number }> = ({ id, cam, grade, behind, front, sfx, subs, subX, stage, dust }) => {
  useFonts();
  const total = suyenEFrames(id);
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Audio src={staticFile('audio/bgm-zhushen-loop.mp3')} loop volume={(fr) => 0.3 * Math.min(1, fr / f(0.4)) * Math.min(1, (total - fr) / f(0.6))} />
      {stage ?? <Plate id={id} cam={cam} grade={grade} />}
      {behind}
      {!stage && <Plate id={id} cam={cam} grade={grade} person />}
      {!stage && <FaceGuard id={id} cam={cam} grade={grade} />}
      {front}
      <GoldDust burst={dust} />
      <Subs subs={subs} cx={subX} />
      <Grain />
      <Flare at={0} dur={0.7} k={0.3} />
      {sfx}
    </AbsoluteFill>
  );
};
// 开场只用一个音效（Reagan：「不是 +，水滴声或咚」）：S4、I2 用水滴，P1、P6 用咚
const OPEN_DROP = <Sfx at={0} s="一滴水滴声" />;
const OPEN_DONG = <Sfx at={0} s="咚" />;

/* ================= S4 · 年度关键词（竖排四柱） ================= */
type Col = { year: string; head: number; chars: { c: string; at: number }[]; hot?: boolean };
const Columns: React.FC<{ cols: Col[]; x0: number; gap: number; dimAt: number }> = ({ cols, x0, gap, dimAt }) => {
  const t = useT(), dim = interpolate(t, [dimAt, dimAt + 0.5], [1, 0.22], clamp);
  return (
    <AbsoluteFill style={{ opacity: dim }}>
      {cols.map((c, i) => {
        const cx = x0 + i * gap, hp = ease(t, c.head, 0.5);
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: cx - 100, width: 200, top: 120, textAlign: 'center', fontFamily: LTH, fontSize: 46, letterSpacing: '0.12em', opacity: hp, filter: `blur(${(1 - hp) * 6}px)`, ...toneCss(c.hot ? 'red' : 'gold', -50) }}>{c.year}</div>
            <div style={{ position: 'absolute', left: cx - 1, top: 190, width: 2, height: 560 * ease(t, c.head, 0.9, eio), background: `linear-gradient(${GOLD_LINE}, rgba(217,184,114,0))`, opacity: 0.5 }} />
            {[0, 1, 2].map((k) => (
              <div key={k} style={{ position: 'absolute', left: cx - 82, top: 220 + k * 180, width: 164, height: 164, border: `1px solid rgba(217,184,114,${0.28 * hp})` }} />
            ))}
            {c.chars.map((ch, k) => {
              if (t < ch.at - 0.08) return null;
              const p = ease(t, ch.at - 0.08, 0.45), pulse = c.hot && t > ch.at ? 0.5 + 0.5 * Math.sin((t - ch.at) * 6) : 0;
              return (
                <div key={k} style={{ position: 'absolute', left: cx - 100, width: 200, top: 220 + k * 180, height: 164, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: LTH, fontSize: 138, lineHeight: 1, opacity: p, transform: `scale(${1.25 - 0.25 * p})`,
                  filter: `blur(${(1 - p) * 12}px) ${c.hot ? `drop-shadow(0 0 ${14 + 16 * pulse}px rgba(216,70,58,0.7))` : 'drop-shadow(0 4px 3px rgba(40,24,6,0.9)) drop-shadow(0 0 24px rgba(232,190,110,0.35))'}`,
                  ...toneCss(c.hot ? 'red' : 'gold', interpolate(t, [ch.at + 0.2, ch.at + 1.0], [-20, 130], clamp)) }}>{ch.c}</div>
              );
            })}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
const AskList: React.FC<{ rows: { t: number; text: string }[]; x: number; y: number }> = ({ rows, x, y }) => {
  const t = useT();
  return (
    <AbsoluteFill>
      {rows.map((r, i) => {
        if (t < r.t) return null;
        const p = ease(t, r.t, 0.4), last = i === rows.length - 1;
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y + i * 150, display: 'flex', alignItems: 'center', gap: 34, opacity: p, filter: `blur(${(1 - p) * 8}px)` }}>
            <div style={{ width: 70, height: 70, background: CINNABAR, color: '#F6E9DA', fontFamily: LTH, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(-4deg) scale(${1.3 - 0.3 * p})` }}>{['学', '听', '知'][i]}</div>
            <div style={{ fontFamily: LTH, fontSize: last ? 100 : 88, letterSpacing: '0.12em', WebkitMaskImage: `linear-gradient(90deg, #000 ${p * 130 - 20}%, transparent ${p * 130}%)`,
              ...toneCss(last ? 'gold' : 'cream', interpolate(t, [r.t + 0.3, r.t + 1.1], [-20, 130], clamp)), filter: last ? 'drop-shadow(0 4px 3px rgba(40,24,6,0.9))' : depth('cream', 88) }}>{r.text}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
// 竖拍口播放进右边的月洞拱门（金色双线框），底下是墨色宣纸 + 大罗盘
const S4Stage: React.FC<{ cam: Cam; grade: Grade }> = ({ cam, grade }) => {
  const t = useT(), s = camK(t, cam), inP = ease(t, 0, 0.8), [, , g] = grade(t);
  const X = 1250, Y = 40, Wd = 560, Hd = 996;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 35% 45%, #2A2016 0%, #120E0A 70%)' }} />
      <Luopan at={0} until={END('s4')} x={620} y={470} r={620} spin={fastToSlow(220, 4)} o={0.35} />
      <div style={{ position: 'absolute', left: X, top: Y, width: Wd, height: Hd, borderRadius: `${Wd / 2}px ${Wd / 2}px 12px 12px`, overflow: 'hidden',
        opacity: inP, transform: `translateX(${(1 - inP) * 160}px)`, boxShadow: '0 30px 80px rgba(0,0,0,0.75)' }}>
        <div style={{ width: Wd, height: Hd, transform: `scale(${s})`, transformOrigin: '50% 30%', filter: `contrast(1.04) saturate(${0.95 * (1 - g)})` }}>
          <OffthreadVideo src={staticFile('suyenh/s4.mp4')} style={{ width: Wd, height: Hd }} />
        </div>
      </div>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: inP }}>
        {[0, 14].map((o, i) => (
          <path key={i} d={`M ${X - o} ${Y + Hd + o} L ${X - o} ${Y + Wd / 2} A ${Wd / 2 + o} ${Wd / 2 + o} 0 0 1 ${X + Wd + o} ${Y + Wd / 2} L ${X + Wd + o} ${Y + Hd + o}`}
            fill="none" stroke={GOLD_LINE} strokeWidth={i ? 1.2 : 2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(t, 0.1 + i * 0.15, 1.0, eio)} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
export const SuyenES4: React.FC = () => {
  const cam: Cam = { hits: [4.16, 7.43, 9.78, 13.26], pushes: [[10.38, 13.2, 1.12]], origin: '50% 30%' };
  const grade: Grade = (t) => [1, 1, t >= 12.28 && t < 13.5 ? 0.6 : 0];
  const cols: Col[] = [
    { year: '2024', head: 0.3, chars: [{ c: '盲', at: 4.16 }] },
    { year: '2025', head: 0.5, chars: [{ c: '叛', at: 6.85 }, { c: '逆', at: 7.21 }, { c: '乱', at: 7.43 }] },
    { year: '2026', head: 0.7, chars: [{ c: '快', at: 8.88 }, { c: '狠', at: 9.34 }, { c: '暴', at: 9.78 }] },
    { year: '2027', head: 0.9, chars: [{ c: '真', at: 12.28 }, { c: '假', at: 12.7 }, { c: '混', at: 13.26 }], hot: true },
  ];
  return (
    <Frame id="s4" cam={cam} grade={grade} dust={13.26} subX={640}
      stage={<S4Stage cam={cam} grade={grade} />}
      front={<>
        <div style={{ position: 'absolute', left: 120, top: 40, fontFamily: LTH, fontSize: 34, letterSpacing: '0.5em', ...toneCss('gold', -50), opacity: ease(useT(), 0.2, 0.6) }}>林舒苑 · 年度关键词</div>
        <Columns cols={cols} x0={210} gap={290} dimAt={13.6} />
        <Hero text="盲盒爆了" at={5.29} until={6.0} x={210} y={830} size={44} tone="cream" ls={0.3} dur={0.3} />
        <Seal text="真假混" at={13.26} until={13.62} x={1090} y={830} size={130} />
        <Flare at={4.16} /><Flare at={13.26} k={0.7} />
        <AskList rows={[{ t: 15.78, text: '要不要学？' }, { t: 16.4, text: '要不要听？' }, { t: 17.14, text: '了解更多' }]} x={170} y={290} />
      </>}
      sfx={<>
        {OPEN_DROP}
        <Sfx at={4.14} s="综艺咚" />
        <Sfx at={5.27} s="哐撞击轻响" />
        <Sfx at={5.93} s="扫光音效4" />
        {[6.85, 7.21].map((x) => <Sfx key={x} at={x - 0.02} s="木鱼敲击回响音效" />)}<Sfx at={7.41} s="咚" />
        <Sfx at={7.65} s="扫光音效4" />
        {[8.88, 9.34].map((x) => <Sfx key={x} at={x - 0.02} s="木鱼敲击回响音效" />)}<Sfx at={9.76} s="综艺咚" />
        <Sfx at={10.36} s="回忆-刷一下" /><Sfx at={10.5} s="综艺悬疑沙锤长" />
        <Sfx at={11.4} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={12.26} s="咚" /><Sfx at={12.68} s="咚" />
        <Sfx at={13.22} s="咚咚重音心头震" /><Sfx at={13.24} s="撞击光1" />
        {[15.78, 16.4, 17.14].map((x) => <Sfx key={x} at={x - 0.02} s="叮提示音4" />)}
        <Sfx at={17.3} s="亮一下" />
      </>}
      subs={[['2024 年 我给大家的关键字', 0.17, 3.66], ['叫做「盲」', 3.68, 4.6], ['盲盒就爆了', 4.63, 5.85], ['2025 年 叛逆乱', 5.95, 7.62], ['2026 年 快狠暴', 7.67, 10.32],
        ['那么来到 2027 年', 10.38, 12.24], ['真 · 假 · 混', 12.28, 13.56], ['那么这三个关键字', 13.6, 15.76], ['你要不要学', 15.78, 16.38], ['你要不要听', 16.4, 17.12], ['你要不要去了解更多', 17.14, 18.68]]}
    />
  );
};

/* ================= P1 · 数字 → 一炷香烧尽 → 罗盘定向 → 翻倍 ================= */
export const SuyenEP1: React.FC = () => {
  const cam: Cam = { hits: [0.86, 1.72, 2.92, 7.94, 12.6, 13.08], pushes: [[3.64, 7.55, 1.06], [9.36, 12.58, 1.04]], origin: '46% 25%' };
  const grade: Grade = (t) => {
    if (t >= 7.62) return [1, 1, 0];
    return [interpolate(t, [3.6, 7.0], [1, 0.72], clamp), 1, interpolate(t, [3.8, 7.2], [0, 0.9], clamp)];
  };
  return (
    <Frame id="p1" cam={cam} grade={grade} dust={13.08}
      behind={<>
        <Hero text="没达成" at={2.92} until={3.62} x={1480} y={300} size={170} tone="red" rotY={-20} />
        <Hero text="往哪里打？" at={10.46} until={11.62} x={400} y={400} size={120} rule />
        <Luopan at={9.3} until={13.0} x={1560} y={430} r={330} spin={fastToSlow(160, 10)} lock={12.6} />
        <Hero text="20" at={7.94} until={9.36} x={540} y={220} size={340} ls={0.06} glow={0.5} />
        <Hero text="27" at={8.32} until={9.36} x={1240} y={220} size={340} ls={0.06} glow={0.5} />
        <Hero text="翻" at={13.08} until={END('p1')} x={560} y={230} size={360} dur={0.35} glow={0.6} />
        <Hero text="倍" at={13.34} until={END('p1')} x={1220} y={230} size={360} dur={0.35} glow={0.6} />
      </>}
      front={<>
        <Hero text="七位数" at={0.12} until={1.12} x={960} y={640} size={64} ls={0.3} rotY={0} rotX={18} anim="呐喊声波" />
        <Hero text="RM1,000,000" at={0.12} until={1.12} x={960} y={790} size={150} ls={0.02} rotY={0} rotX={18} anim="呐喊声波" />
        <Hero text="八位数" at={1.14} until={3.4} x={960} y={640} size={64} ls={0.3} rotY={0} rotX={18} anim="呐喊声波" />
        <Hero text="RM10,000,000" at={1.14} until={3.4} x={960} y={790} size={142} ls={0.02} rotY={0} rotX={18} anim="呐喊声波" />
        <Cutaway id="p1" src="p1_tired" from={3.64} to={7.62} focus={[990, 430]} />
        <InkVig from={3.64} to={7.62} />
        <Hero text="精力" at={5.56} until={7.6} x={330} y={320} size={210} tone="cream" anim="呐喊声波" />
        <Hero text="耗尽" at={6.66} until={7.6} x={330} y={590} size={220} tone="red" dur={0.4} anim="呐喊声波" />
        <InkBrush at={7.34} dur={0.56} />
        <Flare at={0.86} k={0.35} /><Flare at={1.72} k={0.4} /><Flare at={7.62} /><Flare at={12.6} k={0.45} /><Flare at={13.08} k={0.7} />
      </>}
      sfx={<>
        {OPEN_DONG}
        <Sfx at={0.08} s="复古胶片滚动" len={0.8} /><Sfx at={0.84} s="叮收银机提示音1" />
        <Sfx at={1.12} s="复古胶片滚动" len={0.6} /><Sfx at={1.7} s="综艺咚" />
        <Sfx at={2.88} s="撞击光1" /><Sfx at={2.9} s="猛然一惊" />
        <Sfx at={3.6} s="回忆-刷一下" /><Sfx at={3.7} s="诡异的滴水声" />
        <Sfx at={5.54} s="综艺咚" /><Sfx at={6.64} s="咚咚重音心头震" />
        <Sfx at={7.04} s="一滴水滴声" />
        <Sfx at={7.34} s="旋风" />
        <Sfx at={7.92} s="咚" /><Sfx at={8.3} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={9.34} s="闪回" />
        <Sfx at={10.44} s="综艺悬疑轻敲" />
        <Sfx at={12.58} s="扫光音效4" />
        <Sfx at={13.06} s="咚" /><Sfx at={13.32} s="综艺咚咚两声鼓点转场音效" /><Sfx at={13.5} s="亮一下" />
      </>}
      subs={[['七位数 八位数的目标', 0.12, 2.46], ['还没达成', 2.48, 3.62], ['人却已经拼到精力耗尽', 3.64, 7.56], ['那 2027 年', 7.62, 9.34],
        ['你的力气该往哪里打', 9.36, 11.62], ['才有机会冲翻倍呢？', 11.64, 14.05]]}
    />
  );
};

/* ================= I2 · 洛书九宫破局 → 棋盘 → 朱砂一刀 → 宣纸烧掉 ================= */
export const SuyenEI2: React.FC = () => {
  const cam: Cam = { hits: [1.54, 2.18, 3.12, 7.52, 14.14, 18.32], pushes: [[8.08, 9.5, 1.08], [15.02, 18.3, 1.1]], origin: '55% 40%' };
  const grade: Grade = (t) => [t >= 14.14 && t < 15.0 ? 0.75 : 1, 1, t >= 14.14 && t < 15.0 ? 1 : 0];
  return (
    <Frame id="i2" cam={cam} grade={grade} dust={2.18}
      behind={<>
        <Luoshu at={0.02} shatter={2.18} until={3.0} x={1065} y={420} cell={200} />
        <Hero text="奇门" at={0.12} until={1.5} x={1065} y={215} size={320} ls={0.3} glow={0.5} />
        <Hero text="布局" at={1.54} until={2.95} x={340} y={300} size={190} rule />
        <Seal text="破局" at={2.18} until={2.95} x={1620} y={330} size={170} rot={4} />
        <Hero text="整盘棋？" at={5.44} until={7.06} x={1570} y={560} size={130} rule />
        <Seal text="决定" at={8.54} until={9.5} x={1600} y={520} size={170} />
        <Hero text="领导" at={3.12} until={7.06} x={1065} y={215} size={320} ls={0.32} glow={0.5} />
        <Hero text="20" at={7.2} until={9.5} x={720} y={215} size={320} ls={0.06} glow={0.5} />
        <Hero text="27" at={7.52} until={9.5} x={1410} y={215} size={320} ls={0.06} glow={0.5} />
      </>}
      front={<>
        <Cutaway id="i2" src="i2_team" from={9.54} to={15.0} focus={[990, 560]} />
        <Flare at={2.18} k={0.65} />
        <Hero text="方向一错" at={14.14} until={15.0} x={700} y={820} size={150} tone="red" rotY={10} rotX={10} anim="呐喊声波" />
        <Embers from={17.32} to={END('i2')} />
        <Slip text="薪水" at={15.74} until={END('i2')} x={330} y={110} burn={18.32} size={92} h={460} rot={-2} />
        <Slip text="士气" at={16.9} until={END('i2')} x={1620} y={110} burn={18.5} size={92} h={460} rot={2} />
      </>}
      sfx={<>
        {OPEN_DROP}
        <Sfx at={0.15} s="发条声" len={1.3} />
        <Sfx at={1.52} s="综艺咚" />
        <Sfx at={2.16} s="撞击光1" /><Sfx at={2.18} s="木鱼敲击回响音效" />
        <Sfx at={3.1} s="咚" />
        <Sfx at={5.42} s="综艺悬疑轻敲" />
        <Sfx at={7.18} s="咚" /><Sfx at={7.5} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={8.52} s="木鱼敲击回响音效" /><Sfx at={8.54} s="哐撞击轻响" />
        <Sfx at={9.5} s="旋风" />
        <Sfx at={10.8} s="综艺悬疑沙锤长" />
        <Sfx at={12.22} s="呼2" />
        <Sfx at={14.1} s="撞击光1" /><Sfx at={14.12} s="猛然一惊" />
        <Sfx at={14.98} s="回忆-刷一下" /><Sfx at={15.1} s="诡异的滴水声" />
        <Sfx at={15.72} s="纸张抖动声" /><Sfx at={16.88} s="纸张抖动声" />
        <Sfx at={18.28} s="旋风" /><Sfx at={18.32} s="咚咚重音心头震" />
      </>}
      subs={[['奇门讲究布局、破局', 0.12, 2.96], ['做领导的你', 3.0, 4.28], ['想要看你的整盘棋吗？', 4.3, 7.06], ['那 2027 年', 7.1, 8.06], ['你的一个决定', 8.08, 9.52],
        ['几十个人 甚至几百个人', 9.54, 11.56], ['跟着你就是冲', 11.58, 13.34], ['方向一错', 13.36, 15.0], ['整年的薪水和士气', 15.02, 17.3], ['一起烧掉', 17.32, 19.55]]}
    />
  );
};

/* ================= P6 · 罗盘 → 宅院退路 → 一笔 → 三张宣纸签断绳 ================= */
export const SuyenEP6: React.FC = () => {
  const cam: Cam = { hits: [0.69, 5.31, 8.6, 10.73, 12.09, 14.87, 15.55], pushes: [[1.57, 4.1, 1.08], [13.6, 15.5, 1.12]], origin: '46% 45%' };
  const grade: Grade = (t) => {
    const k = interpolate(t, [15.55, 15.9], [0, 0.85], clamp);
    return [1 - 0.22 * k, 1, k];
  };
  return (
    <Frame id="p6" cam={cam} grade={grade}
      behind={<>
        <Hero text="20" at={0.13} until={1.57} x={630} y={220} size={340} ls={0.06} dur={0.4} glow={0.5} />
        <Hero text="27" at={0.69} until={1.57} x={1350} y={220} size={340} ls={0.06} dur={0.35} glow={0.5} />
        <Luopan at={1.5} until={4.12} x={1035} y={470} r={430} spin={fastToSlow(200, 8)} />
        <Hero text="全家的退路" at={5.31} until={7.92} x={1520} y={290} size={120} rule />
        <Hero text="一笔" at={7.95} until={10.7} x={1530} y={340} size={300} dur={0.4} glow={0.5} />
      </>}
      front={<>
        <House at={4.15} road={6.13} until={7.92} x={560} y={300} />
        <Cutaway id="p6" src="p6_points" from={10.73} to={END('p6')} focus={[1035, 520]} />
        <NameTag at={0.8} until={4.1} x={110} y={640} />
        <Slip text="孩子学费" at={10.73} until={END('p6')} x={1460} y={30} fall={15.55} w={130} h={420} size={68} />
        <Slip text="父母养老" at={12.09} until={END('p6')} x={1640} y={30} fall={15.62} w={130} h={420} size={68} />
        <Slip text="十年储蓄" at={14.87} until={END('p6')} x={1820} y={30} fall={15.58} w={130} h={420} size={68} />
        <InkVig from={9.67} to={10.75} k={0.7} />
        <InkVig from={15.55} to={END('p6') + 0.3} k={0.85} />
        <Flare at={0.13} k={0.5} /><Flare at={7.95} k={0.45} />
      </>}
      sfx={<>
        {OPEN_DONG}
        <Sfx at={0.67} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={1.55} s="闪回" /><Sfx at={1.7} s="发条声" len={1.6} />
        <Sfx at={4.13} s="回忆-刷一下" />
        <Sfx at={5.29} s="呼2" />
        <Sfx at={7.0} s="空灵的水滴声" />
        <Sfx at={7.93} s="咚" />
        <Sfx at={9.67} s="综艺悬疑沙锤长" />
        {[10.73, 12.09, 14.87].map((x) => <Sfx key={x} at={x - 0.02} s="纸张抖动声" />)}
        <Sfx at={13.56} s="旋风" />
        <Sfx at={15.52} s="咚咚重音心头震" /><Sfx at={15.56} s="水滴回响声音效" />
      </>}
      subs={[['2027 年', 0.13, 1.55], ['你的奇门战略布局', 1.57, 4.12], ['有没有把全家的退路算进去？', 4.15, 7.92], ['一笔的投入', 7.95, 9.64], ['动荡的可能是', 9.67, 10.7],
        ['孩子的学费', 10.73, 12.06], ['父母的养老', 12.09, 13.58], ['还有可能是你十年的储蓄', 13.61, 16.17]]}
    />
  );
};

/* ================= 广告第一集（16:9 · 60.7 秒 · 1.1 倍速）================= */
// 结构：钩子 P1 v9（时间 ÷1.1）→ 教方法（年盘 / 数字人）→ 我们是谁（真照片墙）→ 报名（火马火羊 → 彩虹吉祥羊）
// 原片剪段见 suyen-ads/ep1/prep_ep1.py；只用 C0001–C0048
// 真照片墙：landing page 的照片只有 600×400 → Real-ESRGAN 放大成 hd-*.jpg（1620 宽，Reagan 10-31：「照片很蒙」）；金框卡片 + 同一张大糊当底，不整张撑满
const PhotoWall: React.FC<{ shots: [string, number, number, string][]; base: number }> = ({ shots, base }) => {
  const t = useT() + base, cur = shots.find(([, a, b]) => t >= a && t < b) ?? shots[shots.length - 1];
  const [id, a] = cur, p = ease(t, a, 0.45), kb = 1 + 0.05 * ease(t, a, 3, eio);
  return (
    <AbsoluteFill style={{ background: INK }}>
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile(`suyenph/${id}.jpg`)})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(28px) brightness(0.45)', transform: 'scale(1.15)' }} />
      <div style={{ position: 'absolute', left: 150, top: 200, width: 1080, height: 720, transform: `translateY(${(1 - p) * 60}px) scale(${0.94 + 0.06 * p})`, opacity: p,
        border: '6px solid #E8C77E', boxShadow: '0 30px 70px rgba(0,0,0,0.65), 0 0 0 16px rgba(232,199,126,0.18)', overflow: 'hidden' }}>
        <div style={{ width: '100%', height: '100%', backgroundImage: `url(${staticFile(`suyenph/${id}.jpg`)})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: `scale(${kb})` }} />
      </div>
    </AbsoluteFill>
  );
};
// 照片整张当背景、她本人（抠像）站在照片前面，外圈撕纸边（Reagan 10-31：照片段要像「投资产品」那张；颜色要跟前面一样，不要压暗）
// PhotoBG 放人后层（behind），PaperEdge 放前景（只在画面边缘，离脸远）
const PhotoBG: React.FC<{ shots: [string, number, number, string][] }> = ({ shots }) => {
  // 照片之间可以空一段回到她本人（每段 B-roll ≤3 秒，Reagan 10-31）；接连的两张才交叉淡入
  const t = useT();
  return (
    <AbsoluteFill>
      {shots.map(([id, a, b], i) => {
                if (t < a - 0.01 || t >= b) return null;
        // jump：硬切 + 一下冲进来（1.22 → 1.04，0.18 秒）+ 白闪，不用淡入（Reagan 10-31：「要 jump jump jump」）
        const kb = 1.04 + 0.18 * (1 - ease(t, a, 0.18, Easing.out(Easing.cubic))) + 0.05 * ease(t, a + 0.18, b - a, eio), fl = 0.55 * (1 - ease(t, a, 0.14));
        return (
          <AbsoluteFill key={a}>
            <AbsoluteFill style={{ backgroundImage: `url(${staticFile(`suyenph/${id}.jpg`)})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: `scale(${kb})`, filter: 'saturate(1.05) brightness(1.04)' }} />
            <AbsoluteFill style={{ background: '#FFF6E0', opacity: fl }} />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
const PaperEdge: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const t = useT();
  if (t < from - 0.01 || t > to) return null;
  const o = 1;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="tear" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035 0.05" numOctaves={4} seed={7} /><feDisplacementMap in="SourceGraphic" scale={34} xChannelSelector="R" yChannelSelector="G" /></filter>
          <filter id="tearIn"><feGaussianBlur stdDeviation={6} /></filter>
          <mask id="paperHole"><rect width={W} height={H} fill="white" /><rect x={58} y={46} width={W - 116} height={H - 92} fill="black" filter="url(#tear)" /></mask>
        </defs>
        <rect width={W} height={H} fill="rgba(60,40,20,0.35)" mask="url(#paperHole)" filter="url(#tearIn)" transform="translate(0 4)" />
        <rect width={W} height={H} fill="#F1E8D8" mask="url(#paperHole)" />
      </svg>
    </AbsoluteFill>
  );
};
// 每段连续照片 ≤3 秒，中间回到她本人（Reagan 10-31：「照片太久了，每个 b-roll 不能超过 3 秒」）
const EP1_PH: [string, number, number, string][] = [['hd-hall_seated', 30.89, 32.32, '16 年'], ['hd-QiMen_Training1', 32.32, 33.7, '千多场课程'], ['hd-fengshui_training-Qimen1', 34.58, 36.18, '几万个学员'], ['hd-masterSuyenLim_qm1', 36.75, 38.24, '来自世界各地'], ['hd-family_group', 38.24, 39.6, '上市公司 大家族 小家庭']];
export const SuyenEp1: React.FC = () => {
  const cam: Cam = { hits: [0.78, 1.56, 2.65, 7.22, 11.45, 11.89, 12.69, 26.855, 42.52, 57.4], pushes: [[3.31, 6.86, 1.06], [8.51, 11.44, 1.04], [47.764, 50.083, 1.05]], origin: '46% 25%', shrink: [[30.89, 33.7, 0], [34.58, 36.18, 0], [36.75, 39.6, 0]] };  // 照片段：整张照片、不要人（Reagan 10-31：「不要人和 bg frame」）→ 抠像和护脸层缩成 0 = 藏起来
  const grade: Grade = (t) => {
    if (t >= 6.93) return [1, 1, 0];
    return [interpolate(t, [3.27, 6.36], [1, 0.72], clamp), 1, interpolate(t, [3.45, 6.55], [0, 0.9], clamp)];
  };
  const T = (a: number, b: number) => ({ at: a, until: b });
  return (
    <Frame id="ep1" cam={cam} grade={grade} dust={11.89}
      behind={<>
        <Hero text="没达成" at={2.65} until={3.29} x={1480} y={300} size={170} tone="red" rotY={-20} />
        <Hero text="往哪里打？" at={9.51} until={10.56} x={400} y={400} size={120} rule />
        <Luopan at={8.45} until={11.82} x={1560} y={430} r={330} spin={fastToSlow(160, 10)} lock={11.45} />
        <Hero text="20" at={7.22} until={8.51} x={540} y={220} size={340} ls={0.06} glow={0.5} />
        <Hero text="27" at={7.56} until={8.51} x={1240} y={220} size={340} ls={0.06} glow={0.5} />
        <Hero text="翻" at={11.89} until={12.66} x={560} y={230} size={360} dur={0.32} glow={0.6} />
        <Hero text="倍" at={12.13} until={12.66} x={1220} y={230} size={360} dur={0.32} glow={0.6} />
      
        <Hero text="奇门遁甲战略大会" {...T(12.69, 15.445)} x={960} y={150} size={120} ls={0.12} glow={0.5} />
        <PhotoBG shots={EP1_PH} />
        {EP1_PH.map(([, a, b, label]) => <Hero key={a} text={label} {...T(a + 0.15, b)} x={960} y={150} size={label.length > 6 ? 110 : 170} ls={0.12} anim="呐喊声波" />)}
        <Hero text="3 天完全免费" {...T(42.52, 47.764)} x={960} y={150} size={120} ls={0.1} glow={0.5} />
        <Hero text="2027 奇门战略大会" {...T(45.063, 47.764)} x={560} y={440} size={84} ls={0.08} rule />
        <Hero text="马上报名" {...T(57.4, 60.76)} x={960} y={160} size={150} ls={0.2} glow={0.6} />
        <EventLogo at={56.655} until={60.76} />
      </>}
      front={<>
        <Hero text="七位数" at={0.11} until={1.02} x={960} y={640} size={64} ls={0.3} rotY={0} rotX={18} anim="呐喊声波" />
        <Hero text="RM1,000,000" at={0.11} until={1.02} x={960} y={790} size={150} ls={0.02} rotY={0} rotX={18} anim="呐喊声波" />
        <Hero text="八位数" at={1.04} until={3.09} x={960} y={640} size={64} ls={0.3} rotY={0} rotX={18} anim="呐喊声波" />
        <Hero text="RM10,000,000" at={1.04} until={3.09} x={960} y={790} size={142} ls={0.02} rotY={0} rotX={18} anim="呐喊声波" />
        <Cutaway id="ep1" src="p1_tired" from={3.31} to={6.25} focus={[990, 430]} />
        <InkVig from={3.31} to={6.25} />
        <Hero text="精力" at={5.05} until={6.91} x={330} y={320} size={210} tone="cream" anim="呐喊声波" />
        <Hero text="耗尽" at={6.05} until={6.91} x={330} y={590} size={220} tone="red" dur={0.36} anim="呐喊声波" />
        <InkBrush at={6.67} dur={0.51} />
        <Flare at={0.78} k={0.35} /><Flare at={1.56} k={0.4} /><Flare at={6.93} /><Flare at={11.45} k={0.45} /><Flare at={11.89} k={0.7} />
      
        {/* 数字人 Suyen 不用了（Reagan 10-31：AI 生成的有点老，用原本的她）→ 年盘一路到介绍段，圆框里是她本人 */}
        <Cutaway id="ep1" src="ep1_yearchart" from={16.38} to={19.3} focus={[990, 430]} />
        <Cutaway id="ep1" src="ep1_yearchart" from={21.1} to={23.4} focus={[990, 430]} skip={3.0} />
        <Cutaway id="ep1" src="ep1_yearchart" from={24.1} to={26.855} focus={[990, 430]} skip={3.2} />
        <Hero text="趋势" {...T(18.48, 19.63)} x={380} y={560} size={130} anim="呐喊声波" />
        <Hero text="格局" {...T(19.63, 20.091)} x={380} y={560} size={130} anim="呐喊声波" />
        <Hero text="宫位 方向 时间点" {...T(21.18, 22.982)} x={1400} y={210} size={78} anim="呐喊声波" />
        <Hero text="投入" {...T(24.18, 25.38)} x={380} y={760} size={130} anim="呐喊声波" />
        <Hero text="防守" {...T(25.38, 26.855)} x={380} y={760} size={130} tone="red" anim="呐喊声波" />
        <NameTag at={27.85} until={30.79} x={1280} y={640} light />
        <Cutaway id="ep1" src="ep1_horse_goat_h" from={50.133} to={52.513} focus={[990, 430]} />
        <Cutaway id="ep1" src="goat_positive" from={53.3} to={56.2} focus={[990, 430]} />
        <Hero text="赤马红羊年" {...T(50.483, 52.513)} x={1400} y={230} size={110} tone="red" anim="呐喊声波" />
        <Hero text="抓准趋势" {...T(53.063, 56.655)} x={360} y={460} size={104} anim="呐喊声波" />
        <Hero text="落实结果" {...T(54.733, 56.655)} x={360} y={620} size={104} anim="呐喊声波" />
      </>}
      sfx={<>
        {OPEN_DONG}
        <Sfx at={0.07} s="复古胶片滚动" len={0.73} /><Sfx at={0.76} s="叮收银机提示音1" />
        <Sfx at={1.02} s="复古胶片滚动" len={0.55} /><Sfx at={1.55} s="综艺咚" />
        <Sfx at={2.62} s="撞击光1" /><Sfx at={2.64} s="猛然一惊" />
        <Sfx at={3.27} s="回忆-刷一下" /><Sfx at={3.36} s="诡异的滴水声" />
        <Sfx at={5.04} s="综艺咚" /><Sfx at={6.04} s="咚咚重音心头震" />
        <Sfx at={6.4} s="一滴水滴声" />
        <Sfx at={6.67} s="旋风" />
        <Sfx at={7.2} s="咚" /><Sfx at={7.55} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={8.49} s="闪回" />
        <Sfx at={9.49} s="综艺悬疑轻敲" />
        <Sfx at={11.44} s="扫光音效4" />
        <Sfx at={11.87} s="咚" /><Sfx at={12.11} s="综艺咚咚两声鼓点转场音效" /><Sfx at={12.27} s="亮一下" />
      
        <Sfx at={12.66} s="咚" />
        <Sfx at={16.33} s="回忆-刷一下" />
        {[18.48, 19.63, 21.18].map((x) => <Sfx key={x} at={x - 0.03} s="叮提示音4" />)}
        <Sfx at={20.041} s="扫光" />
        {[24.18, 25.38].map((x) => <Sfx key={x} at={x - 0.03} s="木鱼敲击回响音效" />)}
        <Sfx at={26.805} s="闪回" />
        <Sfx at={27.82} s="一声响铃" />
        <Sfx at={30.84} s="回忆-刷一下" />
        {EP1_PH.slice(1).map(([, a]) => <Sfx key={a} at={a - 0.03} s="扫光音效4" />)}
        <Sfx at={40.85} s="闪回" />
        <Sfx at={42.49} s="综艺咚" />
        <Sfx at={45.033} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={50.083} s="旋风" /><Sfx at={50.483} s="咚咚重音心头震" />
        <Sfx at={52.483} s="亮一下" />
        {[53.063, 54.733].map((x) => <Sfx key={x} at={x - 0.03} s="正确" />)}
        <Sfx at={56.605} s="闪回" />
        <Sfx at={57.37} s="综艺咚" /><Sfx at={58.7} s="亮一下" />
      </>}
      subs={[['七位数 八位数的目标', 0.11, 2.24], ['还没达成', 2.25, 3.29], ['人却已经拼到精力耗尽', 3.31, 6.87], ['那 2027 年', 6.93, 8.49], ['你的力气该往哪里打', 8.51, 10.56], ['才有机会冲翻倍呢？', 10.58, 12.64], ['奇门遁甲战略大会', 12.69, 15.04], ['我将会用年度的年盘', 15.04, 18.43], ['拆解趋势、格局', 18.43, 20.09], ['以及对的宫位、方向、时间点', 20.09, 22.98], ['带你找准投入以及防守的重点', 22.98, 26.86], ['大家好，我是林舒苑', 26.86, 28.45], ['您的人生战略导师', 28.45, 30.08], ['我在过去 16 年培训超过千多场课程', 30.08, 33.81], ['也帮助过几万个学员', 33.81, 35.9], ['来自于世界各地', 35.9, 38.08], ['从上市公司、大家族到小家庭', 38.08, 40.9], ['我为大家准备了三天完全免费的', 40.9, 44.993], ['2027 年奇门战略大会', 44.993, 47.763], ['你在 2027 年那么混乱的', 47.763, 50.383], ['赤马红羊年的年代', 50.383, 52.473], ['依然抓准趋势', 52.473, 54.613], ['落实你想要的结果', 54.613, 56.66], ['那么马上报名', 56.66, 58.75], ['我们到时见！', 58.75, 60.76]]}
    />
  );
};

/* ================= 第 2–14 集：合成在 SuyenEps.tsx（pipeline/gen_eps.py 产生），这里只登记时长 / 脸 / 圆框轨迹，并把元件借出去 ================= */
export const regEp = (id: HookId, dur: number, face: { x: number[]; y: number[] }, track: { x: number[]; y: number[] }) => { M[id] = { dur }; FACE[id] = face; TRACK[id] = track; };
export { Frame, Hero, Cutaway, NameTag, EventLogo, PhotoWall, PhotoBG, PaperEdge, Sfx, Seal, Luopan, Luoshu, Slip, Incense, House, InkVig, InkBrush, Flare, Embers, OPEN_DROP, OPEN_DONG, END, fastToSlow, useT, win, ease, eio, clamp, f, INK, LTH, CREAM, GOLD_GRAD };
export type { Cam, Grade, HookId };
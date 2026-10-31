// Master Suyen · 内容片模板（竖版 9:16 1080×1920 · C0049–C0060 竖拍访问）
// Reagan 10-31：「开头要有：①头 3 秒吸引（Script Hook / Visual Hook / Sound effect hook）②要有人想要好奇，这个讲什么，我要看完」
//   「1 分钟内容只需要传 1 个 B-roll」「5–10 秒就要转移眼球吸睛（参考 Lily 20 个特效 / violini 17 effects 的剪法）」
//   「用回同样的 Font（兰亭黑特粗），company brand 颜色就用她的简介海报（玫红 + 米黄 + 藏青），logo = suyenlogo」
// 模板骨架（每支照这个换内容）：
//   0–3s  钩子：先放结论那句（冷开场）+ 镜头冲进 + 3D 大字在人后 + 4 张问号牌 + 开场音效
//   3s 起 好奇条：顶部米黄斜角标题条（像她的海报）+ 右边「目录」把答案锁住，讲到才一格一格解锁（看到最后才知道全部）
//   之后每 5–8 秒换一个吸睛效果（遮罩大字 / 故障字 / B-roll 圆框 / 黑白手绘圈 / 打勾清单 / 形状放大 / 手机画面 / 震动强调 / 印章）
//   结尾：杂志封面式片尾卡 + 报名 CTA + logo
// 素材：public/suyenc/<id>.mp4（转正+1.1 倍速）· public/suyenc/pf/<id>.webm（抠像）· src/suyenc-face-<id>.json（facetrack）
import React from 'react';
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing, delayRender, continueRender } from 'remotion';
import FC_C55 from './suyenc-face-c55.json';
import FC_C57 from './suyenc-face-c57.json';
import C57_CUT from './suyenc-c57-subs.json';

const W = 1080, H = 1920, FPS = 30;
const f = (s: number) => Math.round(s * FPS);
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const useT = () => useCurrentFrame() / FPS;
const eo = Easing.out(Easing.cubic), eio = Easing.inOut(Easing.sin);
const ease = (t: number, a: number, d: number, e = eo) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: e });
const win = (t: number, a: number, b: number, fi = 0.25, fo = 0.25) => {
  const i = Math.min(fi, (b - a) / 3), o = Math.min(fo, (b - a) / 3);
  return interpolate(t, [a, a + i, b - o, b], [0, 1, 1, 0], clamp);
};
const pop = (t: number, a: number, d = 0.35) => ease(t, a, d, Easing.out(Easing.back(1.7)));

/* ---------- 品牌（照她的简介海报）---------- */
const LTH = '"LTH"';
// 两种风格（Reagan 10-31：内容② 出 style 1 / style 2 给他选）
//   style 2 = 品牌玫红（她简介海报）；style 1 = 之前竖版钩子 S4 的东方暗金（墨黑 + 金 + 朱砂、背景压暗、金罗盘、金尘）
// 每支片在最上层先 applyTheme(n)：同一次 render 里子元件读到的就是这套颜色
const THEMES = {
  2: { ROSE: '#D2405A', ROSE_DEEP: '#A82745', CREAM: '#F3E6C4', NAVY: '#1F2B45', BUTTERFLY: 'linear-gradient(135deg, #EE8A3C 0%, #D9506A 55%, #9B3F86 100%)', PANEL: 'rgba(31,43,69,0.72)' },
  1: { ROSE: '#B8312F', ROSE_DEEP: '#1A120C', CREAM: '#E8C77E', NAVY: '#120E0A', BUTTERFLY: 'linear-gradient(180deg, #F2D58E 0%, #C99A3E 50%, #8A5A16 100%)', PANEL: 'rgba(18,14,10,0.78)' },
};
let ROSE = THEMES[2].ROSE, ROSE_DEEP = THEMES[2].ROSE_DEEP, CREAM = THEMES[2].CREAM, NAVY = THEMES[2].NAVY, BUTTERFLY = THEMES[2].BUTTERFLY, PANEL = THEMES[2].PANEL, STYLE1 = false;
const WHITE = '#FFFFFF';
const applyTheme = (n: 1 | 2) => { const th = THEMES[n]; ({ ROSE, ROSE_DEEP, CREAM, NAVY, BUTTERFLY, PANEL } = th); STYLE1 = n === 1; };
// 海报底纹：青海波（seigaiha），用 SVG 圆弧铺满
const Seigaiha: React.FC<{ color?: string; o?: number; r?: number }> = ({ color = '#FFFFFF', o = 0.08, r = 46 }) => {
  const id = `sgh${r}`;
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: o, pointerEvents: 'none' }}>
      <defs>
        <pattern id={id} width={r * 2} height={r} patternUnits="userSpaceOnUse">
          {[0, r].map((x0) => [1, 0.72, 0.44].map((k) => (
            <circle key={`${x0}-${k}`} cx={x0} cy={r} r={r * k} fill="none" stroke={color} strokeWidth={2.2} />
          )))}
          {[1, 0.72, 0.44].map((k) => <circle key={`m${k}`} cx={r / 2 * 2} cy={r / 2 + r / 2} r={r * k} fill="none" stroke={color} strokeWidth={2.2} />)}
        </pattern>
      </defs>
      <rect width={W} height={H} fill={`url(#${id})`} />
    </svg>
  );
};

const useFonts = () => {
  const [h] = React.useState(() => delayRender('suyenc-font'));
  React.useEffect(() => {
    new FontFace('LTH', `url(${staticFile('ivyga/fonts/LantingheiSC-Heavy.ttf')})`).load()
      .then((ff) => { (document as any).fonts.add(ff); continueRender(h); }).catch((e) => { console.error(e); continueRender(h); });
  }, [h]);
};

/* ---------- 音效（只用剪映 2-2 包 public/sfx22）---------- */
const VOL: Record<string, number> = {
  咚: 0.44, 综艺咚: 0.58, 开场音效咚: 0.83, 一滴水滴声: 1, 空灵的水滴声: 1, 猛然一惊: 1, 扫光: 1, 扫光音效4: 0.62, 叮: 0.5, 综艺叮: 0.5,
  正确: 0.38, 故障音效: 0.5, 鼠标单击: 0.8, 纸张抖动声: 1, 拍照声2: 0.7, 气泡弹出: 0.6, 啵1: 0.6, 综艺悬疑不对劲: 0.88, 咚咚重音心头震: 0.25,
  '回忆-刷一下': 1, 撞击光1: 1, 亮一下: 0.65, 叮收银机提示音1: 0.9, 综艺咚咚两声鼓点转场音效: 0.28, 呼2: 1,
};
const Sfx: React.FC<{ at: number; s: string; vol?: number; len?: number }> = ({ at, s, vol, len = 3 }) => {
  const v = vol ?? VOL[s] ?? 0.5, n = f(len);
  return (
    <Sequence from={Math.max(0, f(at))} durationInFrames={n}>
      <Audio src={staticFile(`sfx22/${s}.mp3`)} volume={(fr) => v * Math.min(1, (n - fr) / f(0.4))} />
    </Sequence>
  );
};

/* ---------- 每支的设定 ---------- */
type Face = { x: number[]; y: number[] };
type Ep = { id: string; dur: number; face: Face; tail: number };   // tail = 讲完后接的 CTA 长度
const CTA_DUR = 9.3;
const CTA_CLONE = false; // Reagan 10-31：克隆声「不像」→ CTA 全用她自己的声音（cta_vo.wav）   // 克隆声「想参加的，马上在留言打上正能量」做好后改 true（public/suyenc/cta_clone.wav）
const EPS: Record<string, Ep> = {
  c55: { id: 'c55', dur: 45.95, face: FC_C55 as any, tail: CTA_DUR },
  c57: { id: 'c57', dur: (C57_CUT as any).dur, face: FC_C57 as any, tail: CTA_DUR },
};
export const suyenCFrames = (id: string) => f(EPS[id].dur + EPS[id].tail);
const faceAt = (ep: Ep, t: number) => {
  const i = Math.max(0, Math.min(ep.face.x.length - 1, Math.round(Math.min(t, ep.dur - 0.05) * FPS)));
  return [ep.face.x[i], ep.face.y[i]] as const;
};

/* ---------- 镜头：钩子冲进 + 冲击点轻推 ---------- */
type Cam = { hits: number[]; pushes: [number, number, number][] };
const camK = (t: number, c: Cam) => {
  let s = 1 + 0.22 * (1 - ease(t, 0, 0.5, Easing.out(Easing.quad)));      // 第 0 帧就冲进来（Visual hook）
  for (const h of c.hits) if (t >= h && t < h + 0.45) s *= 1 + 0.07 * Math.sin(Math.PI * Math.min(1, (t - h) / 0.45));
  for (const [a, b, z] of c.pushes) if (t >= a && t < b) s *= interpolate(t, [a, b], [1, z], { ...clamp, easing: eio });
  return s;
};
const shakeAt = (t: number, hits: number[]) => {
  let dx = 0, dy = 0;
  for (const h of hits) if (t >= h && t < h + 0.3) { const k = 1 - (t - h) / 0.3; dx += Math.sin(t * 90) * 14 * k; dy += Math.cos(t * 77) * 10 * k; }
  return [dx, dy] as const;
};
// grade(t)：灰度（黑白手绘段用）
const Plate: React.FC<{ ep: Ep; cam: Cam; shakes: number[]; gray?: (t: number) => number; layer: 'bg' | 'person' | 'face' }> = ({ ep, cam, shakes, gray, layer }) => {
  const t = useT(), s = camK(t, cam), [dx, dy] = shakeAt(t, shakes), g = gray ? gray(t) : 0;
  const [fx, fy] = faceAt(ep, t);
  const st: React.CSSProperties = { transform: `translate(${dx}px, ${dy}px) scale(${s})`, transformOrigin: `${fx}px ${fy}px`, filter: g ? `grayscale(${g}) contrast(${1 + 0.15 * g})` : undefined };
  if (layer === 'person') return <AbsoluteFill style={st}><OffthreadVideo src={staticFile(`suyenc/pf/${ep.id}.webm`)} transparent muted /></AbsoluteFill>;
  if (layer === 'face') {
    // 护脸层：抠像漏掉头部时，人后的字不会跑到脸上（Reagan：字绝对不能盖着人脸）
    const m = `radial-gradient(ellipse 120px 160px at ${fx}px ${fy - 10}px, #000 72%, transparent 100%)`;
    return <AbsoluteFill style={st}><AbsoluteFill style={{ WebkitMaskImage: m, maskImage: m }}><OffthreadVideo src={staticFile(`suyenc/${ep.id}.mp4`)} muted /></AbsoluteFill></AbsoluteFill>;
  }
  // style 1：背景压暗去饱和，人（抠像层）保持亮
  const bg: React.CSSProperties = STYLE1 ? { ...st, filter: `brightness(0.5) saturate(0.65)${g ? ` grayscale(${g})` : ''}` } : st;
  return <AbsoluteFill style={bg}><OffthreadVideo src={staticFile(`suyenc/${ep.id}.mp4`)} /></AbsoluteFill>;
};

/* ---------- 3D 大字（兰亭黑特粗 · 斜 3D · 靠厚度，没有阴影没有光晕）---------- */
type Tone = 'rose' | 'cream' | 'white' | 'navy';
const faceC = (tone: Tone) => ({ rose: ROSE, cream: CREAM, white: WHITE, navy: NAVY })[tone];
const sideC = (tone: Tone): [string, string] => (STYLE1
  ? { rose: ['#5A1410', '#1A0604'], cream: ['#7A4E16', '#1E1204'], white: ['#8A7A60', '#2A2010'], navy: ['#3A2A18', '#0A0806'] }
  : { rose: ['#7A1A2E', '#2A0810'], cream: ['#9A8556', '#3A2E14'], white: ['#B9A6A0', '#4A2F35'], navy: ['#0E1526', '#05080F'] })[tone] as [string, string];
const mix = (a: string, b: string, k: number) => {
  const h = (c: string, i: number) => parseInt(c.slice(1 + i * 2, 3 + i * 2), 16);
  return '#' + [0, 1, 2].map((i) => Math.round(h(a, i) + (h(b, i) - h(a, i)) * k).toString(16).padStart(2, '0')).join('');
};
type JyIn = '缩小II' | '呐喊声波' | '放大';
const c01 = (v: number) => Math.max(0, Math.min(1, v));
const jyIn = (a: JyIn, fr: number) => {
  switch (a) {
    case '缩小II': return { s: Math.exp(interpolate(fr, [1, 5, 9, 11, 13, 15], [Math.log(13), Math.log(9), Math.log(3.8), Math.log(1.92), Math.log(1.25), 0], clamp)), op: c01(fr / 5), p: c01(fr / 15) };
    case '呐喊声波': return { s: fr <= 4 ? 0.15 + 0.88 * (fr / 4) : fr <= 6 ? 1.03 - 0.015 * (fr - 4) : 1, op: 1, p: c01(fr / 6) };
    default: { const q = 1 - (1 - c01(fr / 18)) ** 2; return { s: 0.48 + 0.52 * q, op: q, p: q }; }
  }
};
const Hero: React.FC<{ text: string; at: number; until: number; x: number; y: number; size: number; tone?: Tone; rotY?: number; rotX?: number; anim?: JyIn; ls?: number; vertical?: boolean; shake?: number[] }> =
  ({ text, at, until, x, y, size, tone = 'rose', rotY = -16, rotX = 14, anim = '缩小II', ls = 0.04, vertical, shake = [] }) => {
    const t = useT();
    if (t < at || t > until) return null;
    const e = jyIn(anim, (t - at) * FPS), out = 1 - ease(t, until - 0.25, 0.25, Easing.in(Easing.quad));
    const ry = rotY * (1 + 0.5 * (1 - e.p)) + Math.sin((t - at) * 0.9) * 3, rx = rotX * (1 + 0.4 * (1 - e.p));
    const o = out * e.op, moving = e.p < 0.999 || o < 0.999;
    const n = Math.max(10, Math.round(size / 12)), step = size / 130, [s1, s2] = sideC(tone);
    const [dx, dy] = shakeAt(t, shake);
    const font: React.CSSProperties = { fontFamily: LTH, fontSize: size, lineHeight: 1.05, letterSpacing: `${ls}em`, whiteSpace: 'nowrap', writingMode: vertical ? 'vertical-rl' : undefined };
    const leaf = (st: React.CSSProperties, z: number) => ({ ...font, ...st, position: 'absolute' as const, left: 0, top: 0, transform: `translateZ(${z}px)`, ...(moving ? { opacity: o } : {}) });
    return (
      <div style={{ position: 'absolute', left: x - 1000 + dx, width: 2000, top: y - size * 0.55 + dy, display: 'flex', justifyContent: 'center' }}>
        <div style={{ perspective: 1400, transform: `scale(${e.s})` }}>
          <div style={{ position: 'relative', transformStyle: 'preserve-3d', transform: `rotateY(${ry}deg) rotateX(${rx}deg)` }}>
            <div style={{ ...font, visibility: 'hidden' }}>{text}</div>
            {Array.from({ length: n }, (_, k) => n - k).map((k) => <div key={k} style={leaf({ color: mix(s1, s2, k / n) }, -k * step)}>{text}</div>)}
            <div style={leaf({ color: faceC(tone) }, 1)}>{text}</div>
          </div>
        </div>
      </div>
    );
  };

/* ---------- 好奇条：顶部米黄斜角标题条（海报同款）---------- */
const TopBanner: React.FC<{ at: number; until: number; kicker: string; title: string }> = ({ at, until, kicker, title }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const u = ease(t, at, 0.45), o = win(t, at, until, 0.01, 0.3);
  return (
    <div style={{ position: 'absolute', left: 0, top: 120, opacity: o, transform: `translateX(${(u - 1) * 900}px)` }}>
      <div style={{ background: CREAM, clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)', padding: '22px 110px 22px 54px' }}>
        <div style={{ fontFamily: LTH, fontSize: 30, color: ROSE_DEEP, letterSpacing: '0.12em' }}>{kicker}</div>
        <div style={{ fontFamily: LTH, fontSize: 64, color: NAVY, letterSpacing: '0.04em', lineHeight: 1.15 }}>{title}</div>
      </div>
    </div>
  );
};
// 右边「目录」：答案先锁住（？？），讲到才解锁 → 一定要看到最后
type Slot = { label: string; at: number; tag?: string };
const IndexPanel: React.FC<{ at: number; until: number; slots: Slot[]; pulse?: [number, number]; title?: string; width?: number }> = ({ at, until, slots, pulse, title = '要认住的符号', width = 250 }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const o = win(t, at, until, 0.3, 0.3), u = ease(t, at, 0.5);
  const big = pulse && t >= pulse[0] && t < pulse[1] ? 1 + 0.08 * Math.sin((t - pulse[0]) * 9) : 1;
  return (
    <div style={{ position: 'absolute', right: 34, top: 330, width, opacity: o, transform: `translateX(${(1 - u) * 300}px) scale(${big})`, transformOrigin: 'right top' }}>
      <div style={{ fontFamily: LTH, fontSize: 26, color: CREAM, letterSpacing: '0.1em', marginBottom: 10, textAlign: 'right' }}>{title}</div>
      {slots.map((s, i) => {
        const open = t >= s.at, k = open ? pop(t, s.at, 0.3) : 1, flash = open ? 1 - ease(t, s.at, 0.5) : 0;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10, padding: '10px 16px', borderRadius: 12,
            background: open ? ROSE : PANEL, boxShadow: flash ? `0 0 0 ${6 * flash}px rgba(243,230,196,${flash})` : undefined, transform: `scale(${open ? k : 1})` }}>
            <div style={{ minWidth: 44, height: 44, padding: s.tag ? '0 10px' : 0, borderRadius: s.tag ? 10 : '50%', background: open ? CREAM : 'rgba(243,230,196,0.25)', color: open ? ROSE_DEEP : CREAM, fontFamily: LTH, fontSize: s.tag ? 26 : 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.tag ?? i + 1}</div>
            <div style={{ fontFamily: LTH, fontSize: 40, color: open ? WHITE : 'rgba(243,230,196,0.55)', letterSpacing: '0.08em' }}>{open ? s.label : '？？'}</div>
          </div>
        );
      })}
    </div>
  );
};
// 钩子：4 张问号牌（Lily 的 checklist 空格 / violini 的 polaroid 牌）
const MysteryTiles: React.FC<{ beats: number[]; until: number; y: number }> = ({ beats, until, y }) => {
  const t = useT();
  if (t < beats[0] || t > until) return null;
  const o = 1 - ease(t, until - 0.25, 0.25);
  return (
    <div style={{ position: 'absolute', left: 0, width: W, top: y, display: 'flex', justifyContent: 'center', gap: 22, opacity: o }}>
      {beats.map((b, i) => {
        const k = pop(t, b, 0.3), wob = Math.sin(t * 6 + i) * 3;
        return (
          <div key={i} style={{ width: 170, height: 210, borderRadius: 18, background: BUTTERFLY, transform: `scale(${k}) rotate(${(i - 1.5) * 4 + wob}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `5px solid ${CREAM}`, fontFamily: LTH, fontSize: 130, color: WHITE }}>？</div>
        );
      })}
    </div>
  );
};
// 名牌（第一次出现时）
const NameTag: React.FC<{ at: number; until: number }> = ({ at, until }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const o = win(t, at, until, 0.3, 0.3), u = ease(t, at, 0.5);
  return (
    <div style={{ position: 'absolute', left: 54, top: 1010, opacity: o, transform: `translateX(${(u - 1) * 120}px)` }}>
      <div style={{ fontFamily: LTH, fontSize: 64, color: WHITE, letterSpacing: '0.1em' }}>林舒苑老师</div>
      <div style={{ height: 6, width: 300 * u, background: BUTTERFLY, borderRadius: 3, margin: '8px 0' }} />
      <div style={{ fontFamily: LTH, fontSize: 32, color: CREAM, letterSpacing: '0.12em' }}>人生战略导师 ·《运势大破解》作者</div>
    </div>
  );
};

/* ---------- 吸睛效果库 ---------- */
// 故障字（Lily「故障」）：RGB 分离 + 抖动
const Glitch: React.FC<{ text: string; at: number; until: number; x: number; y: number; size: number }> = ({ text, at, until, x, y, size }) => {
  const t = useT(), fr = useCurrentFrame();
  if (t < at || t > until) return null;
  const hot = t - at < 0.5 || (fr % 23 < 2), j = hot ? ((fr * 37) % 13) - 6 : 0, o = win(t, at, until, 0.05, 0.2);
  const base: React.CSSProperties = { position: 'absolute', left: x - 500, width: 1000, top: y - size * 0.55, textAlign: 'center', fontFamily: LTH, fontSize: size, opacity: o };
  return (
    <>
      <div style={{ ...base, color: '#00E5FF', transform: `translate(${j * 1.6}px, ${-j * 0.4}px)`, mixBlendMode: 'screen' }}>{text}</div>
      <div style={{ ...base, color: '#FF2A55', transform: `translate(${-j * 1.6}px, ${j * 0.4}px)`, mixBlendMode: 'screen' }}>{text}</div>
      <div style={{ ...base, color: WHITE, transform: `translate(${j * 0.3}px, 0)`, clipPath: hot ? `inset(${(fr * 13) % 60}% 0 ${(fr * 7) % 30}% 0)` : undefined }}>{text}</div>
    </>
  );
};
// 关键字小标签（白底玫红字，弹出）
const Chip: React.FC<{ text: string; at: number; until: number; x: number; y: number; tone?: 'rose' | 'navy' | 'cream'; size?: number; rot?: number }> = ({ text, at, until, x, y, tone = 'rose', size = 54, rot = -3 }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const k = pop(t, at), o = 1 - ease(t, until - 0.2, 0.2);
  const bg = tone === 'rose' ? ROSE : tone === 'navy' ? NAVY : CREAM, fg = tone === 'cream' ? ROSE_DEEP : WHITE;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${k}) rotate(${rot}deg)`, opacity: o, background: bg, color: fg, fontFamily: LTH, fontSize: size,
      padding: `${size * 0.2}px ${size * 0.45}px`, borderRadius: size * 0.3, letterSpacing: '0.06em', whiteSpace: 'nowrap', border: `4px solid ${tone === 'cream' ? ROSE : CREAM}` }}>{text}</div>
  );
};
// 整画面切到 B-roll，她缩进圆框（圆框一路跟着脸）
// pipLeft：右上有目录牌时，小卡放左上（标题条下面）
const Cutaway: React.FC<{ ep: Ep; src: string; from: number; to: number; placeholder?: string; image?: string; full?: boolean; pipTopAt?: number; pipLeft?: boolean }> = ({ ep, src, from, to, placeholder, image, full, pipTopAt, pipLeft }) => {
  const t = useT();
  if (t < from - 0.01 || t > to) return null;
  const o = win(t, from, to, 0.2, 0.2), k = 1.03 + 0.06 * ease(t, from, to - from, eio), pin = pipTopAt !== undefined ? (t < pipTopAt ? 0 : ease(t, pipTopAt, 0.4, Easing.out(Easing.back(1.6)))) : ease(t, from, 0.4, Easing.out(Easing.back(1.6)));
  // full（整张羊图）：小卡放左上空位（Reagan 10-31 画箭头）
  // pipTopAt（内容②，Reagan 10-31「小卡不能在右下角，要放上面；牌亮相完了放右上」）：右上角，牌收掉才弹出
  const top = pipTopAt !== undefined;
  const [fx, fy] = faceAt(ep, t), CW = top ? 320 : full ? 290 : image ? 320 : 420, CH = top ? 430 : full ? 390 : image ? 440 : 580, cx = top ? (pipLeft ? 210 : 870) : full ? 210 : image ? 880 : 800, cy = top ? (pipLeft ? 600 : 560) : full ? 490 : image ? 1530 : 1500, zoom = top ? 0.75 : full ? 0.7 : image ? 0.75 : 0.9;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ transform: `scale(${k})` }}>
        {image && full ? (
          <AbsoluteFill style={{ background: '#FBF8F2' }}>
            <Img src={staticFile(image)} style={{ position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover' }} />
          </AbsoluteFill>
        ) : image ? (
          <AbsoluteFill style={{ background: '#F7F1E6' }}>
            <Img src={staticFile(image)} style={{ position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover', filter: 'blur(28px) brightness(1.05)', transform: 'scale(1.1)', opacity: 0.55 }} />
            {/* 海报只露上半（标题+羊），下面的海报字会撞字幕 */}
            <div style={{ position: 'absolute', left: 30, top: 340, width: 740, height: 740, borderRadius: 20, overflow: 'hidden', border: `6px solid ${WHITE}` }}>
              <Img src={staticFile(image)} style={{ position: 'absolute', left: 0, top: 0, width: 728, height: 910 }} />
            </div>
          </AbsoluteFill>
        ) : placeholder ? (
          <AbsoluteFill style={{ background: `linear-gradient(180deg, #2A1420, ${ROSE_DEEP})`, alignItems: 'center', justifyContent: 'center' }}>
            <Seigaiha o={0.1} />
            <div style={{ fontFamily: LTH, fontSize: 44, color: CREAM, textAlign: 'center', lineHeight: 1.5, whiteSpace: 'pre-line', padding: 80, border: `3px dashed ${CREAM}`, borderRadius: 24, margin: 80 }}>{placeholder}</div>
          </AbsoluteFill>
        ) : (
          <Sequence from={f(from)} durationInFrames={Math.max(1, f(to - from))} layout="none">
            <OffthreadVideo src={staticFile(`suyenbr/${src}.mp4`)} muted playbackRate={Math.min(1, 5.9 / (to - from))} style={{ width: W, height: H, objectFit: 'cover' }} />
          </Sequence>
        )}
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: cx - CW / 2, top: cy - CH / 2, width: CW, height: CH, transform: `scale(${pin}) rotate(-3deg)` }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 26, overflow: 'hidden', border: `8px solid ${CREAM}`, background: '#000' }}>
          <OffthreadVideo src={staticFile(`suyenc/${ep.id}.mp4`)} muted style={{ position: 'absolute', width: W * zoom, height: H * zoom, left: CW / 2 - fx * zoom, top: CH * 0.32 - fy * zoom }} />
        </div>
        <div style={{ position: 'absolute', left: -8, right: -8, bottom: -8, height: 14, background: ROSE, borderRadius: '0 0 26px 26px' }} />
      </div>
    </AbsoluteFill>
  );
};
// 黑白 + 聚光（Reagan 10-31：角框像瞄准镜「对 master 不致敬」→ 不画任何框/圈）：四周压暗、光打在她身上，关键字卡放头旁边，不碰脸
const HandCircle: React.FC<{ ep: Ep; at: number; until: number; label: string; labelAt: number }> = ({ ep, at, until, label, labelAt }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const [fx, fy] = faceAt(ep, t), u = ease(t, at, 0.5, Easing.inOut(Easing.quad)), o = 1 - ease(t, until - 0.2, 0.2);
  const lk = pop(t, labelAt), sweep = interpolate(t, [at + 0.2, at + 1.2], [-30, 130], clamp);
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse ${560 - 120 * u}px ${980 - 160 * u}px at ${fx}px ${fy + 330}px, rgba(0,0,0,0) 55%, rgba(8,6,10,${0.72 * u}) 100%)` }} />
      <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.35 * u,
        background: `linear-gradient(115deg, rgba(255,240,215,0) ${sweep - 18}%, rgba(255,240,215,0.85) ${sweep}%, rgba(255,240,215,0) ${sweep + 18}%)` }} />
      <div style={{ position: 'absolute', left: Math.max(40, fx - 560), top: Math.max(330, fy - 300), transform: `scale(${lk}) rotate(-4deg)`, transformOrigin: 'right bottom',
        fontFamily: LTH, fontSize: 92, color: WHITE, background: ROSE, padding: '6px 26px', borderRadius: 14, whiteSpace: 'nowrap', border: `4px solid ${CREAM}` }}>{label}</div>
    </AbsoluteFill>
  );
};
// 打勾清单（Lily「打勾清单」）+ 最后盖朱红印
const Checklist: React.FC<{ at: number; until: number; items: { text: string; at: number }[]; stamp?: string; stampAt?: number; title?: string }> = ({ at, until, items, stamp, stampAt = 1e9, title = '合作前你是不是这样？' }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const u = pop(t, at, 0.4), o = 1 - ease(t, until - 0.25, 0.25), sk = interpolate(t, [stampAt, stampAt + 0.14], [1.6, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const [dx, dy] = shakeAt(t, [stampAt]);
  return (
    <div style={{ position: 'absolute', left: 50, top: 850, width: 520, opacity: o, transform: `translate(${dx}px, ${dy}px) scale(${u}) rotate(-2deg)`, transformOrigin: 'left top' }}>
      <div style={{ background: CREAM, borderRadius: 18, padding: '26px 30px', border: `4px solid ${ROSE}` }}>
        <div style={{ fontFamily: LTH, fontSize: 34, color: ROSE_DEEP, marginBottom: 14, letterSpacing: '0.1em' }}>{title}</div>
        {items.map((it, i) => {
          const on = t >= it.at, ck = ease(t, it.at, 0.25);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, opacity: t >= it.at - 0.6 ? 1 : 0.35 }}>
              <div style={{ width: 46, height: 46, borderRadius: 8, border: `4px solid ${NAVY}`, position: 'relative', background: on ? WHITE : 'transparent' }}>
                {on && <svg width={46} height={46} style={{ position: 'absolute', left: -4, top: -4 }}><path d="M10 24 L20 34 L38 12" fill="none" stroke={ROSE} strokeWidth={7} strokeLinecap="round" strokeDasharray={44} strokeDashoffset={44 * (1 - ck)} /></svg>}
              </div>
              <div style={{ fontFamily: LTH, fontSize: 46, color: NAVY }}>{it.text}</div>
            </div>
          );
        })}
      </div>
      {stamp && t >= stampAt && (
        <div style={{ position: 'absolute', right: -60, bottom: -40, transform: `scale(${sk}) rotate(-12deg)`, border: `8px solid #C8202E`, color: '#C8202E', fontFamily: LTH, fontSize: 92,
          padding: '4px 26px', borderRadius: 12, background: 'rgba(255,255,255,0.88)', letterSpacing: '0.08em' }}>{stamp}</div>
      )}
    </div>
  );
};
// 形状放大（Lily「形状放大」）：海报玫红底 + 她在大圆角卡片里（卡片一路跟脸；Reagan 10-31：不要圆形）
const CircleStage: React.FC<{ ep: Ep; from: number; to: number; children?: React.ReactNode }> = ({ ep, from, to, children }) => {
  const t = useT();
  if (t < from - 0.01 || t > to) return null;
  const [fx, fy] = faceAt(ep, t), u = ease(t, from, 0.45, Easing.out(Easing.back(1.3))), o = win(t, from, to, 0.01, 0.2);
  const CW = 760 * u, CH = 900 * u, cx = W / 2, cy = 760, zoom = 1.05;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${ROSE} 0%, ${ROSE_DEEP} 100%)` }}><Seigaiha o={0.12} /></AbsoluteFill>
      <div style={{ position: 'absolute', left: cx - CW / 2, top: cy - CH / 2, width: CW, height: CH, borderRadius: 30, overflow: 'hidden', background: '#000', border: `10px solid ${CREAM}`, transform: 'rotate(-2deg)' }}>
        <OffthreadVideo src={staticFile(`suyenc/${ep.id}.mp4`)} muted style={{ position: 'absolute', width: W * zoom, height: H * zoom, left: CW / 2 - fx * zoom, top: CH * 0.3 - fy * zoom }} />
      </div>
      {children}
    </AbsoluteFill>
  );
};
// 手机画面（violini「phone mockup」）：九宫奇门盘 + 点一下 + 对方宫位亮
const PALACE = ['巽四', '离九', '坤二', '震三', '中五', '兑七', '艮八', '坎一', '乾六'];
const PhoneQimen: React.FC<{ at: number; until: number; tap: number; hi: number; hiIdx: number; hiLabel?: string }> = ({ at, until, tap, hi, hiIdx, hiLabel = '对方宫位' }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const u = ease(t, at, 0.45, Easing.out(Easing.back(1.4))), o = 1 - ease(t, until - 0.25, 0.25), shown = t >= tap + 0.15;
  const rip = t >= tap && t < tap + 0.6 ? ease(t, tap, 0.6) : -1, g = ease(t, hi, 0.3);
  return (
    <div style={{ position: 'absolute', left: 40, top: 320, width: 430, height: 820, opacity: o, transform: `translateY(${(1 - u) * 700}px) rotate(-5deg)` }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 56, background: '#111', border: '6px solid #2b2b2b' }} />
      <div style={{ position: 'absolute', left: 18, top: 18, right: 18, bottom: 18, borderRadius: 42, overflow: 'hidden', background: shown ? '#FBF6EA' : NAVY }}>
        <div style={{ fontFamily: LTH, fontSize: 30, color: shown ? NAVY : CREAM, textAlign: 'center', marginTop: 46 }}>{shown ? '奇门盘 · 当下' : '开一个奇门盘'}</div>
        {!shown && <div style={{ margin: '200px auto 0', width: 250, padding: '22px 0', borderRadius: 60, background: ROSE, color: WHITE, fontFamily: LTH, fontSize: 40, textAlign: 'center' }}>起盘</div>}
        {shown && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, margin: '40px 18px 0' }}>
            {PALACE.map((p, i) => (
              <div key={p} style={{ height: 150, borderRadius: 10, background: i === hiIdx ? `rgba(210,64,90,${0.15 + 0.85 * g})` : '#EFE4CB', border: i === hiIdx && g > 0 ? `4px solid ${ROSE_DEEP}` : '2px solid #D9C9A3',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: i === hiIdx ? `scale(${1 + 0.08 * g})` : undefined }}>
                <div style={{ fontFamily: LTH, fontSize: 30, color: i === hiIdx && g > 0.5 ? WHITE : NAVY }}>{p}</div>
                <div style={{ fontFamily: LTH, fontSize: 22, color: i === hiIdx && g > 0.5 ? CREAM : '#8A7A5A', marginTop: 6 }}>{i === hiIdx ? hiLabel : '·  ·  ·'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {rip >= 0 && <div style={{ position: 'absolute', left: 215 - 60 - rip * 80, top: 400 - 60 - rip * 80, width: 120 + rip * 160, height: 120 + rip * 160, borderRadius: '50%', border: `6px solid rgba(243,230,196,${1 - rip})` }} />}
    </div>
  );
};
// 朱砂方印（4 个符号逐个盖下）
const Seal: React.FC<{ text: string; at: number; until: number; x: number; y: number; size?: number; rot?: number }> = ({ text, at, until, x, y, size = 200, rot = -5 }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const k = interpolate(t, [at, at + 0.14], [1.5, 1], { ...clamp, easing: Easing.in(Easing.quad) }), o = Math.min(ease(t, at, 0.06), 1 - ease(t, until - 0.2, 0.2));
  const ch = [...text], fs = size * (ch.length === 1 ? 0.62 : 0.38);
  return (
    <div style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `scale(${k}) rotate(${rot}deg)`, opacity: o,
      background: '#C8202E', borderRadius: 10, border: `6px solid ${CREAM}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {ch.map((c, i) => <div key={i} style={{ fontFamily: LTH, fontSize: fs, color: CREAM, lineHeight: 1.05 }}>{c}</div>)}
    </div>
  );
};
// 白闪（冲击点）
const Flash: React.FC<{ at: number; k?: number; color?: string }> = ({ at, k = 0.7, color = '#FFFFFF' }) => {
  const t = useT();
  if (t < at || t > at + 0.25) return null;
  return <AbsoluteFill style={{ background: color, opacity: k * (1 - ease(t, at, 0.25)), pointerEvents: 'none' }} />;
};
// 慢⇄快 镜像翻转字
const FlipPair: React.FC<{ a: string; b: string; at: number; flip: number; until: number; y: number }> = ({ a, b, at, flip, until, y }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const r = 180 * ease(t, flip, 0.5, Easing.inOut(Easing.cubic)), o = win(t, at, until, 0.15, 0.25), k = pop(t, at);
  const card = (txt: string, back: boolean): React.CSSProperties => ({ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: back ? 'rotateY(180deg)' : undefined,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: LTH, fontSize: 150, color: back ? ROSE : WHITE, background: back ? CREAM : ROSE, borderRadius: 26, border: `6px solid ${back ? ROSE : CREAM}` });
  return (
    <div style={{ position: 'absolute', left: W / 2 - 420, top: y, width: 840, height: 220, opacity: o, perspective: 1600, transform: `scale(${k})` }}>
      <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${r}deg)` }}>
        <div style={card(a, false)}>{a}</div>
        <div style={card(b, true)}>{b}</div>
      </div>
    </div>
  );
};
// 片尾：杂志封面（Lily「LILY」封面 / violini「cover story」）+ 报名 CTA + logo
const EndCover: React.FC<{ ep: Ep; at: number; end: number }> = ({ ep, at, end }) => {
  const t = useT();
  if (t < at) return null;
  const u = ease(t, at, 0.5), freeze = Math.min(t, ep.dur - 0.05);
  const [fx, fy] = faceAt(ep, freeze), zoom = 1.0;
  return (
    <AbsoluteFill style={{ opacity: u }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${ROSE} 0%, ${ROSE_DEEP} 100%)` }}><Seigaiha o={0.12} /></AbsoluteFill>
      <div style={{ position: 'absolute', left: 60, top: 300, width: W - 120, height: 1180, borderRadius: 8, overflow: 'hidden', border: `8px solid ${CREAM}`, transform: `scale(${0.92 + 0.08 * u})` }}>
        <Sequence from={f(at)} layout="none"><OffthreadVideo src={staticFile(`suyenc/${ep.id}.mp4`)} muted startFrom={f(Math.min(at, ep.dur - 2))} style={{ position: 'absolute', width: W * zoom, height: H * zoom, left: Math.min(0, Math.max(W - 120 - W * zoom, (W - 120) / 2 - fx * zoom)), top: 420 - fy * zoom }} /></Sequence>
      </div>
      <div style={{ position: 'absolute', left: 60, top: 140, fontFamily: LTH, fontSize: 70, color: CREAM, letterSpacing: '0.04em', lineHeight: 1 }}>MASTER SUYEN</div>
      <div style={{ position: 'absolute', left: 90, top: 1250, fontFamily: LTH, color: WHITE, transform: `translateY(${(1 - u) * 60}px)` }}>
        <div style={{ fontSize: 76, letterSpacing: '0.08em' }}>林舒苑老师</div>
        <div style={{ fontSize: 34, color: CREAM, letterSpacing: '0.1em', marginTop: 8 }}>人生战略导师 ·《运势大破解》2021–2027 作者</div>
      </div>
      <div style={{ position: 'absolute', left: 70, right: 70, top: 1560, background: CREAM, borderRadius: 20, padding: '24px 30px', transform: `scale(${pop(t, at + 0.35)})`, textAlign: 'center' }}>
        <div style={{ fontFamily: LTH, fontSize: 40, color: ROSE_DEEP, letterSpacing: '0.06em' }}>3 天免费 · 2027 奇门战略大会</div>
        <div style={{ fontFamily: LTH, fontSize: 52, color: NAVY, marginTop: 6 }}>点主页链接 · 马上报名</div>
      </div>
      <Img src={staticFile('suyenc/suyenlogo.png')} style={{ position: 'absolute', right: 40, top: 50, width: 190, height: 190, opacity: ease(t, at + 0.4, 0.4) }} />
    </AbsoluteFill>
  );
};
// 常驻：左上小 logo
const Bug: React.FC<{ until: number }> = ({ until }) => {
  const t = useT();
  if (t > until) return null;
  return <Img src={staticFile('suyenc/suyenlogo.png')} style={{ position: 'absolute', right: 40, top: 50, width: 120, height: 120, opacity: 0.95 * ease(t, 0.2, 0.4) }} />;
};

/* ---------- 字幕：白色兰亭黑 + 柔阴影（Reagan 10-31：不要描边字，不专业；放画面中下 ≈ 腰部，不放最底） ---------- */
type Sub = [string, number, number, string?];
const Subs: React.FC<{ subs: Sub[]; hideFrom?: number; yAt?: (t: number) => number }> = ({ subs, hideFrom = 1e9, yAt = () => 1100 }) => {
  const t = useT(), s = subs.find(([, a, b]) => t >= a && t < b);
  if (!s || t >= hideFrom) return null;
  const [txt, a] = s, k = interpolate(t, [a, a + 0.08], [0.9, 1], clamp);
  return (
    <div style={{ position: 'absolute', left: 40, width: W - 80, top: yAt(t), textAlign: 'center', fontFamily: LTH, fontSize: 76, lineHeight: 1.2, color: WHITE, transform: `scale(${k})`,
      textShadow: '0 3px 6px rgba(0,0,0,0.55), 0 8px 26px rgba(0,0,0,0.45)', letterSpacing: '0.04em' }}>{txt}</div>
  );
};

/* =================================================================================
   内容片①（C0055）：2027 真假混 · 三只羊 · 认住 4 个符号 · 看到就退三步
   ================================================================================= */
const C55_SUBS: Sub[] = [
  ['只要看到这四个符号', 0.00, 1.60, '四个符号'], ['你马上退三步', 1.60, 2.94, '退三步'],
  ['2027 年', 2.94, 4.07], ['真假混', 4.07, 5.38, '真假混'], ['是代表一整年的关键词', 5.38, 8.47, '关键词'],
  ['我用三只羊来作为代表', 8.47, 11.54, '三只羊'], ['有好的羊', 11.54, 12.75, '好的羊'], ['有病的羊', 12.75, 13.90, '病的羊'], ['还有一只披着羊皮的狼', 13.90, 16.12, '狼'],
  ['真真假假', 16.12, 17.33], ['有时候我们很考验', 17.33, 19.20], ['一个人的判断能力', 19.20, 20.79, '判断能力'],
  ['如果你要来找你合作的人', 20.79, 23.15], ['感觉来了就合作', 23.15, 24.49, '感觉来了'], ['那我想劝你', 24.49, 25.65], ['要小心一点', 25.65, 26.66, '小心'],
  ['那有人来了', 26.66, 27.61], ['你不知道他是狼是羊', 27.61, 29.08, '狼'], ['对不对？', 29.08, 29.63], ['如果他是狼把你吃掉', 29.63, 31.51, '吃掉'],
  ['可以用奇门盘', 31.51, 32.43, '奇门盘'], ['click 一下看一看', 32.43, 33.59], ['对方的这个宫位里面', 33.59, 35.19, '宫位'], ['会不会看到', 35.19, 35.99],
  ['你就需要认住这四个符号', 35.99, 38.25, '四个符号'], ['天蓬', 38.25, 38.80, '天蓬'], ['玄武', 38.80, 39.52, '玄武'], ['朱雀', 39.52, 40.25, '朱雀'], ['还有腾蛇', 40.25, 41.30, '腾蛇'],
  ['你马上退三步', 41.30, 42.61, '退三步'], ['想三次', 42.61, 43.56, '想三次'], ['不要急', 43.56, 44.07, '不要急'], ['慢就是快', 44.07, 44.77, '慢'], ['快就是慢', 44.77, 45.95, '快'],
];
export const SuyenC55: React.FC = () => {
  useFonts(); applyTheme(2);
  const ep = EPS.c55, END = ep.dur + ep.tail, total = f(END), CUT = ep.dur;
  const shakes = [2.39, 5.07, 26.14, 31.18, 42.08];
  const cam: Cam = { hits: [1.00, 4.10, 4.58, 5.07, 19.87, 38.28, 38.83, 39.55, 40.75], pushes: [[35.99, 38.25, 1.08], [44.07, 45.95, 1.06]] };
  const gray = (t: number) => win(t, 16.12, 20.79, 0.12, 0.15);           // 黑白段
  const behind = (
    <>
      <Hero text="4个符号" at={0.33} until={2.90} x={540} y={380} size={230} tone="rose" anim="缩小II" shake={[2.39]} />
      <Hero text="2027" at={3.04} until={4.06} x={460} y={420} size={250} tone="cream" anim="缩小II" />
      <Hero text="真" at={4.10} until={8.47} x={190} y={400} size={230} tone="white" anim="呐喊声波" rotY={24} />
      <Hero text="混" at={5.07} until={8.47} x={190} y={840} size={230} tone="rose" anim="呐喊声波" rotY={24} shake={[5.07]} />
      <Hero text="认住这" at={36.87} until={38.25} x={540} y={360} size={170} tone="cream" anim="缩小II" />
      <Seal text="天蓬" at={38.28} until={41.28} x={210} y={720} />
      <Seal text="玄武" at={38.83} until={41.28} x={210} y={960} rot={4} />
      <Seal text="朱雀" at={39.55} until={41.28} x={210} y={1200} rot={-3} />
      <Seal text="腾蛇" at={40.75} until={41.28} x={210} y={1440} rot={5} />
    </>
  );
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Plate ep={ep} cam={cam} shakes={shakes} gray={gray} layer="bg" />
      {behind}
      <Plate ep={ep} cam={cam} shakes={shakes} gray={gray} layer="person" />
      <Plate ep={ep} cam={cam} shakes={shakes} gray={gray} layer="face" />
      {/* 前景：离脸远的东西 */}
      <Glitch text="假" at={4.58} until={8.47} x={190} y={620} size={230} />
      <MysteryTiles beats={[1.00, 1.16, 1.28, 1.46]} until={2.90} y={950} />
      <NameTag at={5.78} until={8.47} />
      {/* 三只羊：Reagan 10-31 给的 Downloads「Wolf in Sheep’s Clothing Trio」（去字、只留羊、竖版）*/}
      <Cutaway ep={ep} src="" image="suyenc/sheep_trio.png" full from={8.47} to={16.12} />
      <Chip text="好的羊" at={12.05} until={16.03} x={190} y={1260} tone="cream" />
      <Chip text="病的羊" at={13.22} until={16.03} x={880} y={1260} tone="navy" rot={3} />
      <Chip text="披着羊皮的狼" at={14.60} until={16.03} x={540} y={1300} tone="rose" size={56} rot={-2} />
      <HandCircle ep={ep} at={16.22} until={20.74} label="判断力" labelAt={19.87} />
      <Checklist at={20.84} until={26.63} items={[{ text: '有人找你合作', at: 22.39 }, { text: '感觉来了', at: 23.86 }, { text: '马上合作', at: 24.24 }]} stamp="小心！" stampAt={26.14} />
      <CircleStage ep={ep} from={26.66} to={31.51}>
        <Hero text="狼？" at={28.46} until={31.51} x={250} y={1290} size={200} tone="navy" anim="呐喊声波" rotY={20} />
        <Hero text="羊？" at={28.91} until={31.51} x={820} y={1290} size={200} tone="cream" anim="呐喊声波" rotY={-20} shake={[31.18]} />
      </CircleStage>
      <Flash at={31.18} color="#C8202E" k={0.45} />
      <PhoneQimen at={31.51} until={35.96} tap={32.47} hi={33.80} hiIdx={2} />
      <Chip text="退 3 步" at={42.08} until={44.03} x={290} y={870} tone="rose" size={70} rot={-4} />
      <Chip text="想 3 次" at={42.64} until={44.03} x={300} y={1000} tone="cream" size={70} rot={3} />
      <Chip text="不要急" at={43.59} until={44.03} x={290} y={1130} tone="navy" size={70} rot={-2} />
      <FlipPair a="慢" b="快" at={44.07} flip={44.32} until={45.24} y={930} />
      <TopBanner at={2.94} until={CUT} kicker="2027 真假混 · 林舒苑老师教你" title="防骗 4 符号" />
      <IndexPanel at={3.10} until={CUT} slots={[{ label: '天蓬', at: 38.28 }, { label: '玄武', at: 38.83 }, { label: '朱雀', at: 39.55 }, { label: '腾蛇', at: 40.75 }]} pulse={[35.99, 38.25]} />
      <Bug until={CUT} />
      <Flash at={0} k={0.85} />
      <Flash at={4.10} k={0.35} /><Flash at={38.28} k={0.3} /><Flash at={40.75} k={0.3} />
      <Subs subs={C55_SUBS} hideFrom={CUT} yAt={(t) => {
        // Reagan 10-31：图卡放字幕上面；有图卡时字幕往下一点
        if (t >= 8.47 && t < 16.12) return 1420;                       // 三只羊 B-roll（字幕在羊脚下面）
        if (t >= 26.66 && t < 31.51) return 1430;                     // 狼？羊？
        const card = [[0, 2.94], [5.78, 8.47], [20.84, 26.66], [31.51, 35.99], [42.05, 45.24]];
        return card.some(([a, b]) => t >= a && t < b) ? 1250 : 1100;
      }} />
      <CtaEnd at={CUT} />
      {/* 音效：0 秒就有（Sound hook）*/}
      <Sfx at={0} s="一滴水滴声" /><Sfx at={0.05} s="开场音效咚" />
      {[1.00, 1.16, 1.28, 1.46].map((a, i) => <Sfx key={i} at={a} s="啵1" />)}
      <Sfx at={2.39} s="猛然一惊" /><Sfx at={2.94} s="扫光" /><Sfx at={3.04} s="咚" />
      <Sfx at={4.10} s="综艺咚" /><Sfx at={4.58} s="故障音效" /><Sfx at={5.07} s="综艺咚" />
      <Sfx at={8.47} s="回忆-刷一下" /><Sfx at={12.05} s="气泡弹出" /><Sfx at={13.22} s="气泡弹出" /><Sfx at={14.60} s="综艺悬疑不对劲" />
      <Sfx at={16.12} s="拍照声2" /><Sfx at={16.60} s="纸张抖动声" /><Sfx at={19.87} s="叮" />
      <Sfx at={20.84} s="纸张抖动声" />{[22.39, 23.86, 26.24].map((a, i) => <Sfx key={`c${i}`} at={a} s="正确" />)}<Sfx at={26.14} s="猛然一惊" />
      <Sfx at={26.66} s="扫光音效4" /><Sfx at={28.46} s="咚" /><Sfx at={28.91} s="咚" /><Sfx at={31.18} s="咚咚重音心头震" vol={0.4} />
      <Sfx at={31.51} s="呼2" /><Sfx at={32.47} s="鼠标单击" /><Sfx at={33.80} s="亮一下" />
      <Sfx at={36.87} s="咚" />{[38.28, 38.83, 39.55, 40.75].map((a, i) => <Sfx key={`s${i}`} at={a} s="综艺咚" />)}
      <Sfx at={42.08} s="咚" /><Sfx at={42.64} s="咚" /><Sfx at={43.59} s="咚" /><Sfx at={44.80} s="回忆-刷一下" />
      
      <Audio src={staticFile('audio/bgm-zhushen-loop.mp3')} loop volume={(fr) => 0.15 * Math.min(1, fr / f(0.19)) * Math.min(1, (total - fr) / f(0.57))} />
    </AbsoluteFill>
  );
};

/* ---------- 内容片②新增效果 ---------- */
// 盲盒：盒盖弹开冒出问号（讲到「盲盒就爆了」）
const BlindBox: React.FC<{ at: number; open: number; until: number; x: number; y: number; size?: number }> = ({ at, open, until, x, y, size = 240 }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const k = pop(t, at), o = 1 - ease(t, until - 0.2, 0.2), lid = ease(t, open, 0.3, Easing.out(Easing.back(2))), q = pop(t, open + 0.08);
  const wob = t < open ? Math.sin(t * 40) * 4 : 0;
  return (
    <div style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, opacity: o, transform: `scale(${k}) rotate(${wob}deg)` }}>
      <div style={{ position: 'absolute', left: size * 0.5 - 60, top: -size * 0.55 - 40 * q, fontFamily: LTH, fontSize: 150 * q, color: CREAM, textShadow: '0 6px 18px rgba(0,0,0,0.35)', lineHeight: 1 }}>？</div>
      <div style={{ position: 'absolute', left: 0, top: size * 0.3, width: size, height: size * 0.7, background: ROSE, borderRadius: 14, border: `5px solid ${CREAM}` }}>
        <div style={{ position: 'absolute', left: size / 2 - 18, top: 0, width: 36, height: '100%', background: CREAM }} />
      </div>
      <div style={{ position: 'absolute', left: -12, top: size * 0.12, width: size + 24, height: size * 0.22, background: ROSE_DEEP, borderRadius: 12, border: `5px solid ${CREAM}`,
        transform: `translateY(${-90 * lid}px) rotate(${-22 * lid}deg)`, transformOrigin: 'left bottom' }}>
        <div style={{ position: 'absolute', left: size / 2 - 6, top: 0, width: 36, height: '100%', background: CREAM }} />
      </div>
    </div>
  );
};
// 速度线（「什么都快」）：从脸往外射
const SpeedLines: React.FC<{ ep: Ep; from: number; to: number }> = ({ ep, from, to }) => {
  const t = useT();
  if (t < from || t > to) return null;
  const [fx, fy] = faceAt(ep, t), o = win(t, from, to, 0.2, 0.3) * 0.55, r = rng(7);
  const lines = Array.from({ length: 46 }, () => ({ a: r() * Math.PI * 2, s: 0.6 + r() * 0.8, ph: r() }));
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: o, pointerEvents: 'none' }}>
      {lines.map((l, i) => {
        const u = ((t * 2.2 * l.s + l.ph) % 1), r0 = 380 + u * 900, r1 = r0 + 120 + 160 * l.s;
        return <line key={i} x1={fx + Math.cos(l.a) * r0} y1={fy + Math.sin(l.a) * r0} x2={fx + Math.cos(l.a) * r1} y2={fy + Math.sin(l.a) * r1} stroke={WHITE} strokeWidth={5 * l.s} strokeLinecap="round" opacity={1 - u} />;
      })}
    </svg>
  );
};
const rng = (seed: number) => { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
// 罗盘（「大局给予我们的指示」）：放人后面，指针最后定住
const SHAN = '壬子癸丑艮寅甲卯乙辰巽巳丙午丁未坤申庚酉辛戌乾亥';
const LuopanRing: React.FC<{ from: number; to: number; lock: number; cx: number; cy: number; r: number; dim?: boolean; k0?: number }> = ({ from, to, lock, cx, cy, r, dim = true, k0 = 1 }) => {
  const t = useT();
  if (t < from || t > to) return null;
  const o = win(t, from, to, 0.3, 0.3) * k0, k = 0.85 + 0.15 * ease(t, from, 0.6), spin = (t - from) * 14;
  const needle = t < lock ? Math.sin((t - from) * 7) * 50 * (1 - ease(t, from, lock - from)) + 20 : 20 + Math.sin((t - lock) * 18) * 6 * Math.exp(-(t - lock) * 5);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {dim && <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 60% at 50% 35%, rgba(42,12,24,0.35), rgba(42,12,24,0.78))` }} />}
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <g transform={`translate(${cx} ${cy}) scale(${k})`}>
          {[1, 0.86, 0.66, 0.42].map((q, i) => <rect key={i} x={-r * q} y={-r * q} width={2 * r * q} height={2 * r * q} rx={r * q} fill="none" stroke={CREAM} strokeOpacity={0.75} strokeWidth={i === 0 ? 5 : 2.5} />)}
          <g transform={`rotate(${spin})`}>
            {Array.from({ length: 24 }, (_, i) => (
              <g key={i} transform={`rotate(${i * 15})`}>
                <line x1={0} y1={-r * 0.86} x2={0} y2={-r} stroke={CREAM} strokeOpacity={0.6} strokeWidth={2} />
                <text x={0} y={-r * 0.9} textAnchor="middle" fontFamily="LTH" fontSize={r * 0.085} fill={CREAM} transform={`rotate(7.5)`}>{SHAN[i]}</text>
              </g>
            ))}
          </g>
          <g transform={`rotate(${needle})`}>
            <polygon points={`0,${-r * 0.62} ${r * 0.035},0 0,${r * 0.62} ${-r * 0.035},0`} fill={CREAM} />
            <polygon points={`0,${-r * 0.62} ${r * 0.035},0 ${-r * 0.035},0`} fill={ROSE} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
// 慢慢走到目的地：虚线路径一路画过去，终点插旗
const Road: React.FC<{ from: number; walk: [number, number]; until: number; y: number; startLabel: string; endLabel: string; endAt: number }> = ({ from, walk, until, y, startLabel, endLabel, endAt }) => {
  const t = useT();
  if (t < from || t > until) return null;
  const o = win(t, from, until, 0.25, 0.25), p = ease(t, walk[0], walk[1] - walk[0], Easing.inOut(Easing.sin));
  const d = `M 110 ${y + 60} C 330 ${y - 70}, 560 ${y + 150}, 760 ${y + 10} S 930 ${y - 60}, 960 ${y - 40}`, L = 1050;
  const fk = pop(t, endAt);
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: 'none' }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <path d={d} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={14} strokeLinecap="round" strokeDasharray="2 26" />
        <path d={d} fill="none" stroke={CREAM} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${L * p} ${L}`} />
        <g transform={`translate(960 ${y - 40}) scale(${fk})`}>
          <line x1={0} y1={0} x2={0} y2={-150} stroke={NAVY} strokeWidth={8} />
          <path d="M 0 -150 L 110 -120 L 0 -90 Z" fill={ROSE} />
        </g>
      </svg>
      <Chip text={startLabel} at={from} until={until} x={230} y={y - 60} tone="cream" size={50} rot={-3} />
      <Chip text={endLabel} at={endAt} until={until} x={830} y={y + 90} tone="rose" size={56} rot={2} />
    </AbsoluteFill>
  );
};

/* =================================================================================
   内容片②（C0057）v2：Reagan 10-31「用有男生访问的那里开始」
   访问员问（了解了是不是就保证生意 / 不会被人骗）→ 她答（最起码保本、不会踩坑）→ 举例 2024 盲 / 2025 叛逆乱 / 2026 快狠暴 / 2027 真假混
   → 要不要学听了解 → 不了解=固执 → 明年最重要：不可以踩坑 → 慢慢走到目的地 → CTA
   时间都写原片秒数 R(原片秒) → 自动换到剪好的时间轴（suyenc-c57-subs.json = ct/c57_pieces.json 的 subs）
   style 1（东方暗金）/ style 2（品牌玫红）同一套内容，给 Reagan 选
   ================================================================================= */
type SubSeg = { a: number; b: number; start: number; end: number };
const mkR = (subs: SubSeg[]) => (r: number) => {
  const s = subs.find((x) => x.a - 1e-3 <= r && r <= x.b + 1e-3);
  if (s) return s.start + (r - s.a) * (s.end - s.start) / (s.b - s.a);
  let best = 0, d = 1e9;   // 落在删掉的停顿里：贴最近的边
  for (const x of subs) for (const [rr, tt] of [[x.a, x.start], [x.b, x.end]]) if (Math.abs(r - rr) < d) { d = Math.abs(r - rr); best = tt; }
  return best;
};
const R57 = mkR((C57_CUT as any).subs);
// 访问员不在镜头里：用「问题卡」把他的问题打出来（他讲第二句时第二行才出）
const QuestionCard: React.FC<{ at: number; line2At: number; until: number; l1: string; l2: string }> = ({ at, line2At, until, l1, l2 }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const k = pop(t, at, 0.4), o = 1 - ease(t, until - 0.25, 0.25), k2 = pop(t, line2At, 0.35);
  return (
    <div style={{ position: 'absolute', left: 50, right: 50, top: 820, opacity: o, transform: `scale(${k})`, transformOrigin: 'left top' }}>
      <div style={{ display: 'inline-block', background: CREAM, color: NAVY, fontFamily: LTH, fontSize: 34, padding: '6px 18px', borderRadius: '12px 12px 0 0', letterSpacing: '0.1em' }}>访问员问 ❓</div>
      <div style={{ background: NAVY, borderRadius: '0 20px 20px 20px', padding: '22px 30px', border: `4px solid ${CREAM}` }}>
        <div style={{ fontFamily: LTH, fontSize: 56, color: WHITE, lineHeight: 1.3 }}>{l1}</div>
        {t >= line2At && <div style={{ fontFamily: LTH, fontSize: 56, color: CREAM, lineHeight: 1.3, marginTop: 8, transform: `scale(${k2})`, transformOrigin: 'left center' }}>{l2}</div>}
      </div>
    </div>
  );
};
// style 1 金尘
const GoldDust: React.FC<{ n?: number }> = ({ n = 46 }) => {
  const t = useT(), r = rng(3);
  const ps = Array.from({ length: n }, () => ({ x: r(), y: r(), s: 0.4 + r(), ph: r() * 6.28, sp: 0.3 + r() * 0.9 }));
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'screen' }}>
      <defs><radialGradient id="gd57"><stop offset="0%" stopColor="#FFF6DA" /><stop offset="40%" stopColor="#E8C77E" stopOpacity={0.8} /><stop offset="100%" stopColor="#B8893E" stopOpacity={0} /></radialGradient></defs>
      {ps.map((p, i) => {
        const y = ((p.y * H - t * 30 * p.sp) % H + H) % H, x = p.x * W + Math.sin(t * 0.6 + p.ph) * 24, tw = 0.35 + 0.65 * Math.max(0, Math.sin(t * (0.9 + p.sp) + p.ph * 2));
        return <circle key={i} cx={x} cy={y} r={5 * p.s} fill="url(#gd57)" opacity={tw * 0.6} />;
      })}
    </svg>
  );
};
const C57_SUBS_RAW: [string, number, number][] = [
  ['你了解了', 504.2, 505.95], ['最起码你保本', 505.95, 508.3], ['保本就算你安全', 508.3, 510.6], ['你不会踩坑', 510.6, 512.05],
  ['举例我给你了解一下', 391.5, 393.6], ['2024 年', 394.35, 395.95], ['我给大家的关键字', 396.45, 398.8], ['叫做盲', 398.8, 399.75], ['盲盒就爆了', 401.55, 403.2],
  ['2025 年 叛逆乱', 437.62, 439.42], ['2026 年 快狠暴', 439.42, 442.1], ['所以你看今年的趋势', 442.1, 444.45], ['哇，真的什么都快', 444.45, 446.25],
  ['所以你看', 477.45, 478.4], ['这个就是大局', 478.4, 479.65], ['给予我们的指示', 479.65, 481.45], ['那么来到 2027 年', 481.45, 483.38], ['真假混', 483.86, 485.15],
  ['那么这三个关键字', 485.15, 487.4], ['你要不要学', 487.4, 488.0], ['你要不要听', 488.0, 488.74], ['你要不要去了解更多', 488.74, 490.3],
  ['如果你不了解更多', 490.75, 492.6], ['你固执', 492.6, 493.65], ['你做你自己的战略', 493.65, 495.6], ['你怎样跟天动', 495.6, 496.9], ['你怎样跟这个磁场动', 496.9, 498.2],
  ['所以明年最重要的', 513.15, 515.1], ['就是不可以踩坑', 515.1, 516.05], ['你只要踩坑', 516.05, 517.6], ['你爬不起来', 517.6, 518.5],
  ['你不踩坑', 519.1, 520.2], ['你顺顺慢慢走', 520.2, 522.6], ['你都会走到你的目的地', 522.6, 525.75],
];
const C57: React.FC<{ styleN: 1 | 2 }> = ({ styleN }) => {
  useFonts(); applyTheme(styleN);
  const R = R57, ep = EPS.c57, END = ep.dur + ep.tail, total = f(END), CUT = ep.dur;
  const subs: Sub[] = C57_SUBS_RAW.map(([x, a, b]) => [x, R(a), R(b)]);
  const KEY27 = R(483.9), IDX_OFF = KEY27 + 1.0;          // 2027 亮相后约 1 秒，右上的牌收掉，小卡接上去
  const shakes = [R(399.38), R(438.62), R(440.92), R(441.36), R(441.8), R(515.5), R(517.9)];
  const cam: Cam = { hits: [0.05, R(504.3), R(507.88), R(394.42), R(399.38), R(438.62), R(440.92), R(441.36), R(441.8), R(483.9), R(484.32), R(484.86), R(515.5)],
    pushes: [[R(442.1), R(446.25), 1.1], [R(477.45), R(481.45), 1.05], [R(519.1), R(525.75), 1.06]] };
  const gray = (t: number) => win(t, R(490.75), R(495.6), 0.12, 0.15) + win(t, R(517.5), R(518.5), 0.05, 0.15);
  const behind = (
    <>
      {STYLE1 && <LuopanRing from={0} to={CUT} lock={1e9} cx={540} cy={600} r={520} dim={false} k0={0.32} />}
      <LuopanRing from={R(477.45)} to={R(481.45)} lock={R(480.86)} cx={540} cy={640} r={470} dim={!STYLE1} />
      <Hero text="保证？" at={0.08} until={R(503.4)} x={430} y={480} size={220} tone="cream" anim="缩小II" />
      <Hero text="保本" at={R(507.88)} until={R(512.0)} x={420} y={480} size={220} tone="cream" anim="缩小II" />
      <Hero text="2024" at={R(394.42)} until={R(399.3)} x={460} y={420} size={250} tone="cream" anim="缩小II" />
      <Hero text="盲" at={R(399.38)} until={R(403.2)} x={430} y={490} size={240} tone="rose" anim="呐喊声波" shake={[R(399.38)]} />
      <Hero text="快狠暴" at={R(440.92)} until={R(442.1)} x={420} y={480} size={190} tone="rose" anim="呐喊声波" shake={[R(440.92), R(441.36), R(441.8)]} />
      <Hero text="不可以踩坑" at={R(515.5)} until={R(518.5)} x={410} y={480} size={128} tone="rose" anim="呐喊声波" shake={[R(515.78), R(517.24)]} />
    </>
  );
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Plate ep={ep} cam={cam} shakes={shakes} gray={gray} layer="bg" />
      {behind}
      <Plate ep={ep} cam={cam} shakes={shakes} gray={gray} layer="person" />
      <Plate ep={ep} cam={cam} shakes={shakes} gray={gray} layer="face" />
      {STYLE1 && <GoldDust />}
      {/* 前景：都放字幕上面、离脸远 */}
      <QuestionCard at={0.05} line2At={R(501.6)} until={R(504.2)} l1="了解了，是不是就保证生意一定上？" l2="是不是就保证不会被人骗？" />
      <Chip text="✓ 安全" at={R(509.98)} until={R(512.05)} x={260} y={900} tone="cream" size={64} rot={-3} />
      <Chip text="✓ 不会踩坑" at={R(511.62)} until={R(512.05)} x={300} y={1030} tone="rose" size={64} rot={2} />
      <BlindBox at={R(401.55)} open={R(402.12)} until={R(403.2)} x={800} y={930} />
      <Glitch text="叛逆乱" at={R(437.62)} until={R(439.42)} x={540} y={930} size={170} />
      <SpeedLines ep={ep} from={R(442.1)} to={R(446.25)} />
      <Chip text="什么都快" at={R(445.3)} until={R(446.25)} x={540} y={960} tone="rose" size={70} rot={-3} />
      <Cutaway ep={ep} src="horse_goat_v" from={R(481.45)} to={R(487.3)} pipTopAt={IDX_OFF} />
      <Seal text="真" at={R(483.9)} until={R(487.2)} x={300} y={1260} size={170} />
      <Seal text="假" at={R(484.32)} until={R(487.2)} x={540} y={1260} size={170} rot={4} />
      <Seal text="混" at={R(484.86)} until={R(487.2)} x={780} y={1260} size={170} rot={-3} />
      <Checklist at={R(487.3)} until={R(490.3)} title="这三个关键字，你要不要……" items={[{ text: '学', at: R(487.76) }, { text: '听', at: R(488.52) }, { text: '了解更多', at: R(489.46) }]} />
      <HandCircle ep={ep} at={R(490.75)} until={R(495.6)} label="固执" labelAt={R(493.18)} />
      <CircleStage ep={ep} from={R(495.6)} to={R(498.2)}>
        <Hero text="跟天动" at={R(496.54)} until={R(498.2)} x={300} y={1290} size={150} tone="cream" anim="呐喊声波" rotY={20} />
        <Hero text="跟磁场动" at={R(497.72)} until={R(498.2)} x={780} y={1290} size={130} tone="navy" anim="呐喊声波" rotY={-20} />
      </CircleStage>
      <Flash at={R(517.9)} color="#C8202E" k={0.4} />
      <Road from={R(519.1)} walk={[R(520.3), R(525.4)]} until={CUT} y={980} startLabel="顺顺慢慢走" endLabel="目的地" endAt={R(525.24)} />
      <TopBanner at={R(391.5)} until={IDX_OFF + 0.3} kicker="林舒苑老师 · 年度关键字" title="2027 关键字是？" />
      <TopBanner at={IDX_OFF + 0.3} until={CUT} kicker="林舒苑老师 · 2027 关键字" title="真 · 假 · 混" />
      <IndexPanel at={R(391.6)} until={IDX_OFF} title="年度关键字" width={300} slots={[{ tag: '2024', label: '盲', at: R(399.38) }, { tag: '2025', label: '叛逆乱', at: R(438.62) }, { tag: '2026', label: '快狠暴', at: R(440.92) }, { tag: '2027', label: '真假混', at: KEY27 }]} pulse={[R(481.45), KEY27]} />
      <Bug until={CUT} />
      <Flash at={0} k={0.85} /><Flash at={R(504.2)} k={0.3} /><Flash at={KEY27} k={0.3} />
      <Subs subs={subs} hideFrom={CUT} yAt={(t) => {
        // 图卡放字幕上面；有图卡时字幕往下一点
        if (t >= R(481.45) && t < R(487.3)) return 1420;
        if (t >= R(495.6) && t < R(498.2)) return 1430;
        const card = [[R(509.9), R(512.05)], [R(401.55), R(439.42)], [R(445.3), R(446.25)], [R(487.3), R(490.3)], [R(519.1), CUT]];
        return card.some(([a, b]) => t >= a && t < b) ? 1250 : 1100;
      }} />
      <CtaEnd at={CUT} />
      <Sfx at={0} s="一滴水滴声" /><Sfx at={0.05} s="开场音效咚" /><Sfx at={R(501.6)} s="综艺悬疑不对劲" />
      <Sfx at={R(504.2)} s="扫光" /><Sfx at={R(507.88)} s="综艺咚" /><Sfx at={R(509.98)} s="正确" /><Sfx at={R(511.62)} s="正确" />
      <Sfx at={R(391.5)} s="扫光音效4" /><Sfx at={R(394.42)} s="咚" /><Sfx at={R(399.38)} s="综艺咚" /><Sfx at={R(402.12)} s="气泡弹出" /><Sfx at={R(402.2)} s="叮" />
      <Sfx at={R(437.62)} s="故障音效" /><Sfx at={R(438.62)} s="综艺咚" /><Sfx at={R(440.92)} s="咚" /><Sfx at={R(441.36)} s="咚" /><Sfx at={R(441.8)} s="综艺咚" />
      <Sfx at={R(442.1)} s="呼2" /><Sfx at={R(445.3)} s="啵1" /><Sfx at={R(477.45)} s="扫光" /><Sfx at={R(480.86)} s="叮" />
      <Sfx at={R(481.45)} s="回忆-刷一下" /><Sfx at={R(483.9)} s="综艺咚" /><Sfx at={R(484.32)} s="综艺咚" /><Sfx at={R(484.86)} s="综艺咚" /><Sfx at={IDX_OFF} s="啵1" />
      <Sfx at={R(487.3)} s="纸张抖动声" />{[487.76, 488.52, 489.46].map((a, i) => <Sfx key={`c${i}`} at={R(a)} s="正确" />)}
      <Sfx at={R(490.75)} s="拍照声2" /><Sfx at={R(493.18)} s="叮" /><Sfx at={R(495.6)} s="扫光音效4" /><Sfx at={R(496.54)} s="咚" /><Sfx at={R(497.72)} s="咚" />
      <Sfx at={R(515.5)} s="猛然一惊" /><Sfx at={R(517.9)} s="咚咚重音心头震" vol={0.4} /><Sfx at={R(519.1)} s="呼2" /><Sfx at={R(525.24)} s="叮" />
      <Audio src={staticFile('audio/bgm-zhushen-loop.mp3')} loop volume={(fr) => 0.22 * Math.min(1, fr / f(0.4)) * Math.min(1, (total - fr) / f(0.8))} />
    </AbsoluteFill>
  );
};
export const SuyenC57: React.FC = () => <C57 styleN={2} />;
export const SuyenC57S1: React.FC = () => <C57 styleN={1} />;

/* ---------- CTA（Reagan 10-31：CTA 用 B-roll + 留言打上「正能量」· 免费 2027 奇门战略大会 · 7–10 秒）----------
   声音：全是她自己讲的（1.1 倍）→ public/suyenc/cta_vo.wav（8.76s）：C0048「三天完全免费的 2027 年奇门战略大会」+ C0048 27.62–29.45「那么马上报名」+ C0006 35.85–37.57「正能量」
         （GPT-SoVITS 零样本克隆试过 4 个参考都「不像」，留着 suyen-ads/vo/gen_suyen.py 备查）
   画面：品牌玫红底 + 中间一张现场卡（课室 / 千人会场轮播）+ 上面大字跟着讲 + 下面留言框打出「正能量」 */
const CtaEnd: React.FC<{ at: number }> = ({ at }) => {
  // Reagan 10-31：只要一张卡放中间；不提 Allianz（卡上没标签，也不用有 Allianz 字样的镜头）
  const t = useT();
  if (t < at) return null;
  const lt = t - at, u = ease(t, at, 0.35);
  const line = lt < 2.15 ? ['3 天完全免费', 0] : lt < 5.15 ? ['2027 奇门战略大会', 2.15] : lt < 7.1 ? ['马上报名', 5.15] : ['留言打上「正能量」', 7.1];
  const lk = pop(t, at + (line[1] as number), 0.3);
  const word = '正能量', typeA = 7.2, typeB = 8.25, sent = 8.5;
  const typed = word.slice(0, Math.max(0, Math.min(3, Math.floor(((lt - typeA) / (typeB - typeA)) * 3 + 0.001))));
  const caret = lt < sent && Math.floor(lt * 3) % 2 === 0;
  const bub = lt >= sent ? pop(t, at + sent, 0.35) : 0;
  const clips = ['s_teach', 'a_phones', 's_class'], seg = 3.1;
  return (
    <AbsoluteFill style={{ opacity: u }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${ROSE} 0%, ${ROSE_DEEP} 100%)` }}><Seigaiha o={0.12} /></AbsoluteFill>
      <div style={{ position: 'absolute', left: 60, top: 110, fontFamily: LTH, fontSize: 70, color: CREAM, letterSpacing: '0.04em', lineHeight: 1 }}>MASTER SUYEN</div>
      <Img src={staticFile('suyenc/suyenlogo.png')} style={{ position: 'absolute', right: 40, top: 40, width: 170, height: 170 }} />
      <div style={{ position: 'absolute', left: 0, width: W, top: 330, textAlign: 'center', fontFamily: LTH, fontSize: (line[1] as number) === 2.15 ? 100 : 90, color: WHITE,
        textShadow: '0 4px 14px rgba(0,0,0,0.35)', transform: `scale(${lk})`, letterSpacing: '0.04em' }}>{line[0]}</div>
      {/* 中间一张现场卡（B-roll）*/}
      <div style={{ position: 'absolute', left: 40, top: 520, width: 1000, height: 560, transform: `scale(${pop(t, at, 0.45)}) rotate(-1.2deg)`, borderRadius: 24, overflow: 'hidden', border: `8px solid ${CREAM}`, background: '#000' }}>
        {clips.map((c, i) => (
          <Sequence key={c} from={f(at + i * seg)} durationInFrames={f(i === clips.length - 1 ? 30 : seg)} layout="none">
            <OffthreadVideo src={staticFile(`suyenc/ev/${c}.mp4`)} muted style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              opacity: interpolate(lt - i * seg, [0, 0.18], [i ? 0 : 1, 1], clamp) }} />
          </Sequence>
        ))}
      </div>
      {/* 留言框（Lily「留言 CTA」）*/}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 1260, transform: `translateY(${(1 - ease(t, at + 4.9, 0.4)) * 760}px)` }}>
        <div style={{ background: WHITE, borderRadius: 26, padding: '22px 26px', boxShadow: '0 14px 40px rgba(0,0,0,0.3)' }}>
          <div style={{ fontFamily: LTH, fontSize: 36, color: ROSE_DEEP, letterSpacing: '0.06em' }}>在留言打上 ↓ 免费参加 2027 奇门战略大会</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 }}>
            <div style={{ flex: 1, height: 100, borderRadius: 18, background: '#F4EEE4', border: `3px solid ${ROSE}`, display: 'flex', alignItems: 'center', padding: '0 26px', fontFamily: LTH, fontSize: 64, color: NAVY }}>
              {typed}{caret && <span style={{ display: 'inline-block', width: 5, height: 60, background: ROSE, marginLeft: 6 }} />}
              {!typed && <span style={{ color: '#B9AE9A', fontSize: 40 }}>留言……</span>}
            </div>
            <div style={{ width: 150, height: 100, borderRadius: 18, background: lt >= sent - 0.15 ? ROSE : NAVY, color: WHITE, fontFamily: LTH, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: `scale(${lt >= sent - 0.15 && lt < sent + 0.15 ? 0.92 : 1})` }}>发送</div>
          </div>
        </div>
        {bub > 0 && (
          <div style={{ position: 'absolute', right: 10, bottom: -150, transform: `scale(${bub})`, transformOrigin: 'right top', background: ROSE, color: WHITE, fontFamily: LTH, fontSize: 70,
            padding: '14px 36px', borderRadius: '28px 6px 28px 28px', border: `5px solid ${CREAM}` }}>正能量 ✦</div>
        )}
      </div>
      <Sequence from={f(at)} layout="none"><Audio src={staticFile('suyenc/cta_vo.wav')} /></Sequence>
      {CTA_CLONE && <Sequence from={f(at + 5.2)} layout="none"><Audio src={staticFile('suyenc/cta_clone.wav')} /></Sequence>}
      <Sfx at={at} s="撞击光1" /><Sfx at={at + 2.19} s="综艺咚" /><Sfx at={at + 4.9} s="呼2" />
      {[0, 1, 2].map((i) => <Sfx key={i} at={at + typeA + (i * (typeB - typeA)) / 3} s="键盘空格声" vol={0.5} len={0.6} />)}
      <Sfx at={at + sent} s="叮收银机提示音1" />
    </AbsoluteFill>
  );
};

/* ---------- 给内容③起的每一集用（src/suyenc/*.tsx）---------- */
export {
  W, H, FPS, f, clamp, useT, eo, eio, ease, win, pop, LTH, WHITE, Seigaiha, useFonts, Sfx, CTA_DUR, faceAt, Plate, Hero, TopBanner, IndexPanel, MysteryTiles, NameTag,
  Glitch, Chip, Cutaway, HandCircle, Checklist, CircleStage, PhoneQimen, Seal, Flash, FlipPair, Bug, Subs, BlindBox, SpeedLines, rng, LuopanRing, Road, mkR, QuestionCard, CtaEnd,
  applyTheme, shakeAt,
};
export { ROSE, ROSE_DEEP, CREAM, NAVY, BUTTERFLY, PANEL };
export type { Ep, Cam, Sub, SubSeg, Face };

// 剪映文字动画 + 配套音效（照 Z691「2-1 文字动画和音效常用搭配」逐帧量出来的数字重做；工程 template.json.bak 给的预设名/时长/音效名）
// 用法：<JyText text="同行" at={3.2} dur={1.5} preset="呐喊声波" x={540} y={330} size={280} tone="gold" font={XING} />
//   - 音效默认跟预设走（剪映的搭配），在 at 那一帧响 = 比字早 1–3 帧；sfx={null} 关掉、sfx="咚重磅" 换
//   - 位置 (x,y) = 文字中心；size = 字号 px；dur 到了硬切（剪映模板也是硬切）
//   - 音效档在 public/<sfxDir>/<中文名>.mp3（ivy-ga 从剪映工程 materials/audio 复制、改成中文名）
import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const c01 = (v: number) => Math.max(0, Math.min(1, v));
const qOut = (t: number) => 1 - (1 - t) * (1 - t);
// 逐帧表插值：tab[i] = 第 i 帧的值（超出用两端）
const tab = (f: number, vals: number[], f0 = 0) => {
  const x = f - f0;
  if (x <= 0) return vals[0];
  if (x >= vals.length - 1) return vals[vals.length - 1];
  const i = Math.floor(x), u = x - i;
  return vals[i] + (vals[i + 1] - vals[i]) * u;
};

export type JyPreset =
  | '向上露出' | '向下露出' | '向上滑动' | '随机上升' | '向右缓入' | '模糊发光' | '向左模糊' | '放大' | '轻微放大' | '呐喊声波'
  | '生长' | '缩小' | '缩小II' | '辉光' | '激光雕刻' | '发光模糊' | '逐字显影' | '收拢' | '折叠' | '波浪弹入' | '打字光标'
  | '跃进' | '开幕' | '流光扩散';

// 剪映工程里每个预设配的音效（取第一个/最常用的）
export const JY_SFX: Record<JyPreset, string> = {
  向上露出: '呼1', 向下露出: '嗖转场音效', 向上滑动: '综艺悬疑不对劲', 随机上升: '纸张抖动声', 向右缓入: '拔刀游戏音效宝剑出鞘',
  模糊发光: '一滴水滴声', 向左模糊: '旋风', 放大: '卡通弹簧拉伸', 轻微放大: '叮提示音4', 呐喊声波: '综艺嘭字幕音效震撼出场',
  生长: '敲击碗叮的一声', 缩小: '撞击光1', 缩小II: '悬疑咚声', 辉光: '高音闪光转场', 激光雕刻: '光效转场', 发光模糊: '一声响铃',
  逐字显影: '沙锤的声音', 收拢: '哐撞击轻响', 折叠: '纸张抖动声', 波浪弹入: '综艺当当当当', 打字光标: '打字声', 跃进: '综艺紧张噔噔',
  开幕: '纸张抖动声', 流光扩散: '叮铃魔法音效',
};
// 音量：量过响度（ebur128 前 2 秒），拉到约 -24 LUFS 垫在人声（-16）底下；重击类 -21
export const JY_VOL: Record<string, number> = {
  呼1: 1, 嗖转场音效: 1, 综艺悬疑不对劲: 0.7, 纸张抖动声: 1, 一滴水滴声: 0.87, 旋风: 0.35, 卡通弹簧拉伸: 0.24, 叮提示音4: 1,
  综艺嘭字幕音效震撼出场: 0.28, 敲击碗叮的一声: 1, 撞击光1: 0.74, 悬疑咚声: 0.35, 高音闪光转场: 0.78, 光效转场: 0.49, 一声响铃: 0.39,
  沙锤的声音: 0.51, 哐撞击轻响: 0.98, 综艺当当当当: 0.19, 打字声: 1, 综艺紧张噔噔: 0.62, 拔刀游戏音效宝剑出鞘: 0.58, 叮铃魔法音效: 0.23,
  咚重磅: 0.45, 时间冻结: 0.14, 钱money: 0.86, '收银机-钱到账了': 0.36, 嗖咻: 0.66, 空灵的水滴声: 1, 扫光音效4: 0.49, 心碎声: 0.44,
};
const SFX_LEN: Record<string, number> = { 打字声: 1.2 };

export const JySfx: React.FC<{ at: number; name: string; vol?: number; dir?: string; len?: number }> = ({ at, name, vol, dir = 'ivyga/jy21', len }) => {
  const { fps } = useVideoConfig();
  const L = len ?? SFX_LEN[name];
  return (
    <Sequence from={Math.round(at * fps)} durationInFrames={L ? Math.round(L * fps) : undefined}>
      <Audio src={staticFile(`${dir}/${name}.mp3`)} volume={vol ?? JY_VOL[name] ?? 0.5} />
    </Sequence>
  );
};

/* ---------- 每个字在第 f 帧的状态（k = 字号/140：剪映样片 1080p 一个字约 140px 高，位移按比例缩放） ---------- */
type St = { x?: number; y?: number; s?: number; sx?: number; sy?: number; op?: number; blur?: number; rot?: number; skew?: number; glow?: number; origin?: string; hide?: boolean };
type Line = { clip?: string; ls?: number; sx?: number; sy?: number; op?: number; echo?: { s: number; op: number }; streak?: number; flare?: { x: number; op: number }; cursor?: { after: number; op: number }; dot?: number };
const RND = [0.62, 0.21, 0.0, 0.94, 0.4, 0.77, 0.13, 0.55, 0.33, 0.86];

const charState = (p: JyPreset, f: number, i: number, n: number, k: number): St => {
  switch (p) {
    case '向上露出': { const t = c01(f / 12); return { y: 313 * k * (1 - t) ** 2 }; }
    case '向下露出': { const t = c01(f / 12); return { y: -313 * k * (1 - t) ** 2 }; }
    case '向上滑动': { const t = c01(f / 12); return { y: 314 * k * (1 - t) ** 2, op: qOut(t) }; }
    case '随机上升': { const d = RND[i % RND.length] * 2.6, tc = c01((f - d) / 6); return { y: 110 * k * Math.pow(2, -6 * tc), op: c01(tc * 1.6), hide: f < d }; }
    case '向右缓入': return { x: tab(f, [-700, -420, -270, -201, -158, -128, -104, -83, -65, -48, -32, -15, 0]) * k, op: f < 2 ? 0.54 : 1 };
    case '模糊发光': return { op: tab(f, [0.2, 0.3, 0.4, 0.5, 0.8, 1]), blur: tab(f, [18, 16, 14, 12, 8, 3, 0]), y: tab(f, [90, 90, 90, 90, 70, 20, 0]) * k,
      glow: interpolate(f, [4, 7, 10, 12], [0, 25, 12, 0], clamp) * k, s: interpolate(f, [4, 7, 11], [1.04, 1.04, 1], clamp) };
    case '向左模糊': { const g = Math.max(0, f - 2); return { x: 664 * k * Math.pow(0.5, g), skew: -12 * c01(1 - g / 4), blur: 5 * Math.pow(0.5, g), op: f < 2 ? 0 : 1 }; }
    case '放大': { const t = qOut(c01(f / 21)); return { s: 0.48 + 0.52 * t, op: t }; }
    case '轻微放大': return { s: 0.9 + 0.1 * qOut(c01(f / 15)), op: c01(f / 3) };
    case '呐喊声波': return { s: f <= 4 ? 0.15 + (1.03 - 0.15) * (f / 4) : f <= 6 ? 1.03 - 0.015 * (f - 4) : 1 };
    case '生长': return { s: tab(f, [0.3, 0.48, 0.64, 0.735, 0.81, 0.86, 0.9, 0.93, 0.97, 1]), origin: '50% 100%' };
    case '缩小': { const t = qOut(c01(f / 15)); return { s: 1 + 0.5 * (1 - t), op: t }; }
    case '缩小II': return { s: Math.exp(interpolate(f, [1, 5, 9, 11, 13, 15], [Math.log(13), Math.log(9), Math.log(3.8), Math.log(1.92), Math.log(1.25), 0], clamp)), op: c01(f / 5) };
    case '辉光': return { op: tab(f, [0, 0, 0.6, 1]), glow: interpolate(f, [2, 4, 14], [20, 25, 0], clamp) * k };
    case '激光雕刻': return {};
    case '发光模糊': return { blur: interpolate(f, [0, 7, 10, 13, 16, 22], [20, 14, 10, 4, 2, 0], clamp) * k, op: interpolate(f, [0, 7, 14], [0, 0.55, 1], clamp), s: interpolate(f, [0, 14], [1.05, 1], clamp) };
    case '逐字显影': { const d = n > 1 ? i * (11 / (n - 1)) : 0, tc = c01((f - d) / 8), e = qOut(tc); return { s: 1.8 - 0.8 * e, blur: 10 * k * (1 - tc), op: f < d ? 0 : 0.3 + 0.7 * tc }; }
    case '收拢': return { op: 0.7 + 0.3 * c01(f / 2) };
    case '折叠': return {};
    case '波浪弹入': { const kk = f - 1.5 * i; return { y: tab(kk, [-76, -90, -64, -19, 4, 0]) * k, op: kk < 1 ? 0.55 : 1, hide: kk < 0 }; }
    case '打字光标': { const ap = 1 + (n > 1 ? i * (9 / (n - 1)) : 0); return { hide: f < ap }; }
    case '跃进': { const t = c01(f / 12); return { x: 140 * k * (1 - t) ** 3, y: interpolate(f, [0, 4, 6, 8, 10, 12], [60, 48, 4, -14, -4, 0], clamp) * k, s: 1 + 0.11 * (1 - t) ** 2, op: interpolate(f, [0, 7], [0.25, 1], clamp) }; }
    case '开幕': return { op: interpolate(f, [3, 10], [0.55, 1], clamp) };
    case '流光扩散': { const d = 4 + Math.abs(i - (n - 1) / 2) * 2.5, tc = c01((f - d) / 5); return { op: tc, glow: 22 * k * (1 - c01((f - 12) / 5)), hide: f < d }; }
  }
};
const lineState = (p: JyPreset, f: number, n: number, k: number): Line => {
  switch (p) {
    case '呐喊声波': return f >= 5 && f <= 14 ? { echo: { s: 1 + (f - 5) / 9, op: 0.6 * (1 - (f - 5) / 9) } } : {};
    case '辉光': return { streak: interpolate(f, [3, 5, 6, 12], [0, 1, 1, 0], clamp) };
    case '激光雕刻': { const pr = tab(f, [0, 0, 0.1, 0.33, 0.47, 0.63, 0.74, 0.88, 0.92, 0.99, 1]); return { clip: `inset(-30% ${(1 - pr) * 100}% -30% -5%)`, flare: { x: pr, op: f <= 11 ? 1 - c01((f - 9) / 2) : 0 } }; }
    case '收拢': { const t = c01(f / 16); return { ls: 64 * k * (1 - t) ** 2 }; }
    case '折叠': return { sx: f < 4 ? 0.3 + 0.035 * f : tab(f, [0.44, 0.645, 0.8, 0.89, 0.946, 0.98, 1], 4), sy: interpolate(f, [0, 7], [0.81, 1], clamp), op: interpolate(f, [0, 7], [0.6, 1], clamp) };
    case '跃进': { const t = c01(f / 12); return { ls: 40 * k * (1 - t) ** 2 }; }
    case '开幕': { const pr = c01((f - 2) / 13); return { clip: `inset(-30% ${(1 - pr) * 50}% -30% ${(1 - pr) * 50}%)` }; }
    case '打字光标': { const shown = Math.min(n, Math.floor(f >= 1 ? 1 + (f - 1) / (n > 1 ? 9 / (n - 1) : 1) : 0)); return { cursor: { after: shown, op: f >= 12 ? 0 : f >= 8 ? 0.6 : 1 } }; }
    case '流光扩散': return { dot: interpolate(f, [0, 2, 4, 6], [0, 1, 1, 0], clamp) };
    case '向上露出': return { clip: `inset(-40% -10% ${-44 * k}px -10%)` };
    case '向下露出': return { clip: `inset(${-41 * k}px -10% -40% -10%)` };
    default: return {};
  }
};

export type Tone = 'gold' | 'cream' | 'cinnabar' | 'pale' | 'ink' | 'white';
// 3D 厚度（Reagan 10-24：不要黑描边，要阴影的立体感）：同色系深色一层层往下叠（连环 drop-shadow 会累加成侧面），最后一层软投影
const SIDE: Record<Tone, [string, string]> = {
  gold: ['#B8801F', '#6E4709'], cream: ['#A8987C', '#4A3E2E'], white: ['#A9A9A9', '#3C3C3C'],
  cinnabar: ['#8E1E14', '#4A0C07'], pale: ['#B49A52', '#5E4B1C'], ink: ['#6B5A44', '#2A2118'],
};
export const depth = (tone: Tone, size: number) => {
  const o = Math.max(1, size / 70), [c1, c2] = SIDE[tone];
  return `drop-shadow(0 ${o}px 0 ${c1}) drop-shadow(0 ${o}px 0 ${c1}) drop-shadow(0 ${o}px 0 ${c2}) drop-shadow(0 ${o}px 0 ${c2}) drop-shadow(0 ${size * 0.07}px ${size * 0.1}px rgba(0,0,0,0.6))`;
};
const GOLD_GRAD = 'linear-gradient(180deg, #FFFBE6 0%, #FFD76A 55%, #E3A22C 100%)';
const TONE: Record<Tone, React.CSSProperties> = {
  gold: { backgroundImage: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' },
  cream: { color: '#FFF6E4' }, white: { color: '#FFFFFF' }, cinnabar: { color: '#D23A2A' }, pale: { color: '#FFE9A0' }, ink: { color: '#16110C' },
};

export const SAFE_L = 90, SAFE_R = 990, SAFE_W = SAFE_R - SAFE_L;
export type JyTextProps = {
  text: string; at: number; dur: number; preset: JyPreset; x?: number; y: number; size: number; font: string; tone?: Tone;
  sfx?: string | null; sfxVol?: number; sfxDir?: string; ls?: number; skew?: number; opacity?: number; dimAt?: number; dimTo?: number;
  stroke?: number; align?: 'center' | 'left'; vertical?: boolean;
};
// 一行字（逐字 span，方便逐字预设）；dimAt：剪映「新句压旧句」——旧句降到 dimTo 透明度留在原位
export const JyText: React.FC<JyTextProps> = (pr) => {
  const { text, at, dur, preset, y, font, tone = 'cream', sfx, sfxVol, sfxDir, ls = 0, skew = 0, opacity = 1, dimAt, dimTo = 0.4, stroke = 0, align = 'center', vertical } = pr;
  // 安全区（Reagan 10-24「避免太长，要在安全区」）：估字宽，超过 900 就缩字，中心推回 x 90–990 里面
  const estW = (sz: number) => [...text].reduce((w, c) => w + (/[\u2E80-\u9FFF\uFF00-\uFFEF]/.test(c) ? 1.02 : c === ' ' ? 0.3 : 0.6) * sz + ls, 0);
  const size = vertical ? pr.size : pr.size * Math.min(1, SAFE_W / Math.max(1, estW(pr.size)));
  const half = vertical ? 0 : estW(size) / 2;
  const x = vertical || align === 'left' ? (pr.x ?? 540) : Math.min(SAFE_R - half, Math.max(SAFE_L + half, pr.x ?? 540));
  const frame = useCurrentFrame(), { fps } = useVideoConfig();
  const f = frame - Math.round(at * fps);
  const sfxName = sfx === undefined ? JY_SFX[preset] : sfx;
  const audio = sfxName ? <JySfx at={at} name={sfxName} vol={sfxVol} dir={sfxDir} /> : null;
  if (f < 0 || frame >= Math.round((at + dur) * fps)) return audio;
  const k = size / 140, chars = [...text], n = chars.length;
  const L = lineState(preset, f, n, k);
  const dim = dimAt !== undefined ? interpolate(frame / fps, [dimAt, dimAt + 0.15], [1, dimTo], clamp) : 1;
  const base: React.CSSProperties = { fontFamily: font, fontSize: size, lineHeight: 1, ...TONE[tone],
    WebkitTextStroke: undefined };
  // 金渐层字不能加描边（描边画在渐层上面，细的行楷笔画会被吃掉变黑）→ 改用墨色外晕撑住边缘
  const gold = tone === 'gold';
  const shadow = depth(tone, size);
  const span = (ch: string, i: number, extra?: React.CSSProperties) => {
    const s = charState(preset, f, i, n, k);
    if (s.hide) return <span key={i} style={{ display: 'inline-block', opacity: 0 }}>{ch === ' ' ? ' ' : ch}</span>;
    const sc = s.s ?? 1;
    const tf = `translate(${s.x ?? 0}px,${s.y ?? 0}px) scale(${(s.sx ?? 1) * sc},${(s.sy ?? 1) * sc}) rotate(${s.rot ?? 0}deg) skewX(${s.skew ?? 0}deg)`;
    const fl = [s.blur ? `blur(${s.blur}px)` : '', s.glow ? `drop-shadow(0 0 ${s.glow}px rgba(255,236,190,0.95)) drop-shadow(0 0 ${s.glow * 0.5}px rgba(255,255,255,0.9))` : '', shadow].join(' ');
    return (
      // 外层管动作/阴影/模糊，内层管金渐层字（同一层同时有 filter 和 background-clip:text 时 Chrome 画不出渐层）
      <span key={i} style={{ display: 'inline-block', transform: tf, transformOrigin: s.origin ?? '50% 50%', opacity: s.op ?? 1, filter: fl, marginRight: L.ls ?? 0 }}>
        <span style={{ display: 'inline-block', ...extra }}>{ch === ' ' ? '\u00A0' : ch}</span>
      </span>
    );
  };
  const lineTf = `translate(-50%,-50%) scale(${L.sx ?? 1},${L.sy ?? 1}) skewX(${-skew}deg)`;
  const left = align === 'left' ? x : x;
  return (
    <>
      {audio}
      <AbsoluteFill style={{ pointerEvents: 'none', opacity: opacity * dim * (L.op ?? 1) }}>
        {L.streak ? <div style={{ position: 'absolute', left: x - size * n * 0.8, width: size * n * 1.6, top: y - size * 0.09, height: size * 0.18, borderRadius: size,
          background: 'linear-gradient(90deg, rgba(255,150,40,0), rgba(255,190,90,0.9) 50%, rgba(255,150,40,0))', filter: `blur(${size * 0.06}px)`, opacity: L.streak, mixBlendMode: 'screen' }} /> : null}
        {L.dot ? <div style={{ position: 'absolute', left: x - size * 0.6, top: y - size * 0.6, width: size * 1.2, height: size * 1.2, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,240,200,0.95) 0%, rgba(255,200,90,0.5) 30%, rgba(255,180,60,0) 70%)', opacity: L.dot }} /> : null}
        {L.echo ? <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${L.echo.s})`, opacity: L.echo.op, filter: `blur(${4 + 6 * (L.echo.s - 1)}px)`, whiteSpace: 'nowrap', ...base, letterSpacing: ls }}>{text}</div> : null}
        <div style={{ position: 'absolute', left, top: y, transform: align === 'left' ? `translate(0,-50%) skewX(${-skew}deg)` : lineTf, transformOrigin: align === 'left' ? '0% 50%' : '50% 50%', whiteSpace: 'nowrap',
          clipPath: L.clip, letterSpacing: ls, writingMode: vertical ? 'vertical-rl' : undefined, ...base, WebkitTextStroke: undefined }}>
          {/* 描边另画一层在下面（逐字 transform 时 span 内的渐变字描边才不会怪） */}
          {chars.map((ch, i) => span(ch, i, { ...TONE[tone], WebkitTextStroke: stroke && !gold ? `${size * stroke}px #16110C` : undefined, paintOrder: 'stroke fill' }))}
          {L.cursor ? <span style={{ display: 'inline-block', width: size * 0.2, height: size * 1.25, marginLeft: size * 0.08, verticalAlign: 'middle', background: '#FFF6E4', opacity: L.cursor.op,
            position: 'relative', left: -(n - L.cursor.after) * (size + (ls || 0)) }} /> : null}
          {L.flare ? <span style={{ position: 'absolute', left: `${L.flare.x * 100}%`, top: '50%', width: size * 1.1, height: size * 1.1, transform: 'translate(-50%,-50%)', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(235,245,255,1) 0%, rgba(200,225,255,0.6) 25%, rgba(180,210,255,0) 70%)', opacity: L.flare.op, mixBlendMode: 'screen' }} /> : null}
        </div>
      </AbsoluteFill>
    </>
  );
};

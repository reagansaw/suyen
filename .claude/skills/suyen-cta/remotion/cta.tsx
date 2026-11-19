// Master Suyen · CTA（片尾 9.3 秒，独立一块）—— 奇门解盘和别的竖版片都可以直接接在最后。
// Reagan 11-14：「把 CTA 部分分出来」「不要 BGM」→ 这一块自己不带配乐，只有她的真声 + 5 个音效；接进整支片时，配乐要在 CTA 开始前收掉。
// 声音：public/suyenc/cta_vo.wav —— 全是她自己讲的（不用 AI 克隆）：「三天完全免费的 2027 年奇门战略大会」「那么马上报名」「正能量」
// 画面：玫红渐层 + 青海波底纹 + 左上「MASTER SUYEN LIM」+ 右上 logo + 大字跟着讲 + 中间一张现场卡（4 段轮播）+ 下面留言框打出「正能量」
// 现场卡 4 段（每段 2.325 秒）：① 课室 + 讲台上的她 ② 领奖（华耀奖台上，大屏幕有她的名字）③ 观众举手机 ④ 颁证书
//   ① 原片在 2.83 秒会切到一个男生 → 2.325 秒就切走，他不会出现。不提 Allianz，不用有 Allianz 字样的镜头。
//   ② 剪法：ffmpeg -ss 28.3 -t 2.6 -i ~/Downloads/IMG_1685.MOV -an -vf "crop=1080:605:0:'1000-232*clip((t-0.7)/0.5,0,1)',scale=1000:560,fps=30,format=yuv420p,eq=contrast=1.06:saturation=1.2" -c:v libx264 -crf 18 -g 15 public/qm1/cta_award.mp4
//      （原片是竖拍 iPhone HDR；镜头从近拉到远，所以裁切框跟着往上移）
// 单独出片：node scripts/render.mjs SuyenQmCta out/cta.mp4
import React from 'react';
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from 'remotion';

const W = 1080, H = 1920, FPS = 30;
export const CTA_SEC = 9.3, framesQmCta = Math.round(CTA_SEC * FPS);
const f = (s: number) => Math.round(s * FPS);
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const useT = () => useCurrentFrame() / FPS;
const ease = (t: number, a: number, d: number, e = Easing.out(Easing.cubic)) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: e });
const pop = (t: number, a: number, d = 0.35) => ease(t, a, d, Easing.out(Easing.back(1.7)));
const ROSE = '#D2405A', ROSE_DEEP = '#A82745', CREAM = '#F3E6C4', NAVY = '#1F2B45', WHITE = '#FFFFFF';
const LTH = '"LTH"';   // 兰亭黑特粗。奇门解盘那支没有载这个字体，所以出来是系统默认的宋体（Reagan 看过的就是这样）；要用兰亭黑就先载 ivyga/fonts/LantingheiSC-Heavy.ttf
const Seigaiha: React.FC<{ o?: number; r?: number }> = ({ o = 0.08, r = 46 }) => (
  <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: o, pointerEvents: 'none' }}>
    <defs>
      <pattern id="ctasgh" width={r * 2} height={r} patternUnits="userSpaceOnUse">
        {[0, r].map((x0) => [1, 0.72, 0.44].map((k) => <circle key={`${x0}-${k}`} cx={x0} cy={r} r={r * k} fill="none" stroke="#FFFFFF" strokeWidth={2.2} />))}
        {[1, 0.72, 0.44].map((k) => <circle key={`m${k}`} cx={r} cy={r} r={r * k} fill="none" stroke="#FFFFFF" strokeWidth={2.2} />)}
      </pattern>
    </defs>
    <rect width={W} height={H} fill="url(#ctasgh)" />
  </svg>
);
// 音效（public/sfx22）：音量照内容片模板
const VOL: Record<string, number> = { 撞击光1: 1, 综艺咚: 0.58, 呼2: 1, 叮收银机提示音1: 0.9 };
const Sfx: React.FC<{ at: number; s: string; vol?: number; len?: number }> = ({ at, s, vol, len = 3 }) => {
  const v = vol ?? VOL[s] ?? 0.5, n = f(len);
  return <Sequence from={Math.max(0, f(at))} durationInFrames={n}><Audio src={staticFile(`sfx22/${s}.mp3`)} volume={(fr) => v * Math.min(1, (n - fr) / f(0.4))} /></Sequence>;
};

export type CtaClip = { src: string; from?: number; rate?: number; pos?: string };   // from = 从第几格开始；rate = 速度；pos = 竖片放进横卡时看哪里（objectPosition）
export const CTA_CLIPS: CtaClip[] = [{ src: 'suyenc/ev/s_teach.mp4' }, { src: 'qm1/cta_award.mp4' }, { src: 'suyenc/ev/a_phones.mp4' }, { src: 'suyenc/ev/s_class.mp4' }];
export const CTA_SEG = 2.325;   // 每段几秒 = 9.3 ÷ 段数

export const QmCta: React.FC<{ at?: number; clips?: CtaClip[]; seg?: number; cardH?: number }> = ({ at = 0, clips = CTA_CLIPS, seg = CTA_SEG, cardH = 560 }) => {
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
  return (
    <AbsoluteFill style={{ background: ROSE }}><AbsoluteFill style={{ top: 30, opacity: u }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${ROSE} 0%, ${ROSE_DEEP} 100%)` }}><Seigaiha o={0.12} /></AbsoluteFill>
      <div style={{ position: 'absolute', left: 60, top: 110, fontFamily: LTH, fontSize: 58, color: CREAM, letterSpacing: '0.04em', lineHeight: 1 }}>MASTER SUYEN LIM</div>
      <Img src={staticFile('suyenc/suyenlogo-light.png')} style={{ position: 'absolute', right: 40, top: 40, width: 170, height: 170 }} />
      <div style={{ position: 'absolute', left: 0, width: W, top: 330, textAlign: 'center', fontFamily: LTH, fontSize: (line[1] as number) === 2.15 ? 100 : 90, color: WHITE,
        textShadow: '0 4px 14px rgba(0,0,0,0.35)', transform: `scale(${lk})`, letterSpacing: '0.04em' }}>{line[0]}</div>
      {/* 中间一张现场卡（B-roll）*/}
      <div style={{ position: 'absolute', left: 40, top: 520, width: 1000, height: cardH, transform: `scale(${pop(t, at, 0.45)}) rotate(-1.2deg)`, borderRadius: 24, overflow: 'hidden', border: `8px solid ${CREAM}`, background: '#000' }}>
        {clips.map((c, i) => (
          <Sequence key={c.src} from={f(at + i * seg)} durationInFrames={f(i === clips.length - 1 ? 30 : seg)} layout="none">
            <OffthreadVideo src={staticFile(c.src)} muted startFrom={c.from ?? 0} playbackRate={c.rate ?? 1} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: c.pos,
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
      <Sfx at={at} s="撞击光1" /><Sfx at={at + 2.19} s="综艺咚" /><Sfx at={at + 4.9} s="呼2" />
      {[0, 1, 2].map((i) => <Sfx key={i} at={at + typeA + (i * (typeB - typeA)) / 3} s="键盘空格声" vol={0.5} len={0.6} />)}
      <Sfx at={at + sent} s="叮收银机提示音1" />
    </AbsoluteFill></AbsoluteFill>
  );
};

// 单独一支（9.3 秒，没有配乐）
export const SuyenQmCta: React.FC = () => <QmCta />;

// 内容③起每一集共用：EpShell（层次 + 字幕 + CTA + BGM + 开场音效）+ 新增吸睛效果
// 规则照 skills/suyen-content-rose/SKILL.md：字不盖脸、2027/大字放人后、不要圆框/瞄准框、字幕白色 76px 柔阴影 y≈1100、图卡在字幕上面
import React from 'react';
import { AbsoluteFill, Audio, Easing, interpolate, staticFile } from 'remotion';
import {
  W, H, f, clamp, useT, ease, win, pop, LTH, WHITE, Seigaiha, useFonts, Sfx, CTA_DUR, Plate, Flash, Bug, Subs, CtaEnd, applyTheme, mkR, shakeAt,
  ROSE, ROSE_DEEP, CREAM, NAVY, BUTTERFLY,
} from '../SuyenContent';
import type { Ep, Cam, Sub, SubSeg } from '../SuyenContent';

/* ---------- 每一集的设定：face JSON（matte.sh 产生）+ subs JSON（export_subs.py 产生）---------- */
export type Cut = { dur: number; subs: (SubSeg & { piece?: number })[] };
// R(原片秒, n)：原片秒 → 成片秒。同一句用了两次（冷开场钩子 + 正文）时，n=0 是第一次出现的那段、n=1 是第二次
export type RFn = (r: number, n?: number) => number;
const mkRn = (subs: Cut['subs']): RFn => {
  const one = mkR(subs);
  if (subs.some((s) => s.piece === undefined)) return (r) => one(r);
  const ids = [...new Set(subs.map((s) => s.piece as number))];
  return (r, n = 0) => {
    const span = (p: number, tol: number) => { const g = subs.filter((s) => s.piece === p); return g[0].a - tol <= r && r <= g[g.length - 1].b + tol; };
    const strict = ids.filter((p) => span(p, 0)), hit = strict.length ? strict : ids.filter((p) => span(p, 0.02));   // 刚好落在两段交界：先认真的在里面的那段
    if (!hit.length) return one(r);
    return mkR(subs.filter((s) => s.piece === hit[Math.min(n, hit.length - 1)]))(r);
  };
};
export const mkEp = (id: string, cut: Cut, face: unknown): { ep: Ep; R: RFn } =>
  ({ ep: { id, dur: cut.dur, face: face as any, tail: CTA_DUR }, R: mkRn(cut.subs) });
export const epFrames = (cut: Cut) => f(cut.dur + CTA_DUR);

/* ---------- 外壳：bg → behind（人后大字）→ 抠像人 → 护脸 → 前景 → 字幕 → CTA ---------- */
export const EpShell: React.FC<{
  ep: Ep; subs: Sub[]; cam: Cam; shakes: number[]; gray?: (t: number) => number;
  behind?: React.ReactNode; children?: React.ReactNode; sfx?: React.ReactNode; yAt?: (t: number) => number; bgm?: number; styleN?: 1 | 2;
}> = ({ ep, subs, cam, shakes, gray, behind, children, sfx, yAt, bgm = 0.18, styleN = 2 }) => {
  useFonts(); applyTheme(styleN);
  const CUT = ep.dur, total = f(ep.dur + ep.tail);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Plate ep={ep} cam={cam} shakes={shakes} gray={gray} layer="bg" />
      {behind}
      <Plate ep={ep} cam={cam} shakes={shakes} gray={gray} layer="person" />
      <Plate ep={ep} cam={cam} shakes={shakes} gray={gray} layer="face" />
      {children}
      <Bug until={CUT} />
      <Flash at={0} k={0.85} />
      <Subs subs={subs} hideFrom={CUT} yAt={yAt} />
      <CtaEnd at={CUT} />
      <Sfx at={0} s="一滴水滴声" /><Sfx at={0.05} s="开场音效咚" />
      {sfx}
      <Audio src={staticFile('audio/bgm-zhushen-loop.mp3')} loop volume={(fr) => bgm * Math.min(1, fr / f(0.4)) * Math.min(1, (total - fr) / f(0.8))} />
    </AbsoluteFill>
  );
};
// 字幕位置：一般 1100；有图卡 1250；占满下半（B-roll / 舞台）1420
export const mkYAt = (cards: [number, number][], low: [number, number][] = []) => (t: number) =>
  low.some(([a, b]) => t >= a && t < b) ? 1420 : cards.some(([a, b]) => t >= a && t < b) ? 1250 : 1100;
// 字幕：原片秒 → 成片秒
// 第 4 个数 = n（这句第几次出现，冷开场重复用的句子正文那次写 1）
export const subsR = (R: RFn, raw: ([string, number, number] | [string, number, number, number])[]): Sub[] => raw.map(([x, a, b, n]) => [x, R(a, n ?? 0), R(b, n ?? 0)]);

/* =========================== 新增效果 =========================== */

// 假单据（骗局故事）：一张 invoice 滑进来 → 盖「假」
export const DocCard: React.FC<{ at: number; until: number; stampAt: number; head: string; title: string; rows: [string, string][]; stamp?: string; x?: number; y?: number }> =
  ({ at, until, stampAt, head, title, rows, stamp = '假', x = 60, y = 640 }) => {
    const t = useT();
    if (t < at || t > until) return null;
    const u = ease(t, at, 0.45, Easing.out(Easing.back(1.3))), o = 1 - ease(t, until - 0.25, 0.25);
    const sk = interpolate(t, [stampAt, stampAt + 0.14], [1.7, 1], { ...clamp, easing: Easing.in(Easing.quad) });
    const [dx, dy] = shakeAt(t, [stampAt]);
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: 470, opacity: o, transform: `translate(${(1 - u) * -600 + dx}px, ${dy}px) rotate(-4deg)` }}>
        <div style={{ background: '#FFFDF8', borderRadius: 10, padding: '26px 28px 30px', boxShadow: '0 18px 50px rgba(0,0,0,0.4)', borderTop: `14px solid ${NAVY}` }}>
          <div style={{ fontFamily: LTH, fontSize: 26, color: NAVY, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{head}</div>
          <div style={{ fontFamily: LTH, fontSize: 40, color: ROSE_DEEP, margin: '12px 0 16px', letterSpacing: '0.06em' }}>{title}</div>
          {rows.map(([k, v], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px dashed #D8CDB8', padding: '8px 0', fontFamily: LTH, fontSize: 28 }}>
              <span style={{ color: '#8A7A5A' }}>{k}</span><span style={{ color: NAVY }}>{v}</span>
            </div>
          ))}
        </div>
        {t >= stampAt && (
          <div style={{ position: 'absolute', right: -30, top: 120, transform: `scale(${sk}) rotate(-14deg)`, border: '10px solid #C8202E', color: '#C8202E', fontFamily: LTH, fontSize: [...stamp].length > 1 ? 84 : 150,
            width: 210, height: 210, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.85)', lineHeight: 1 }}>{stamp}</div>
        )}
      </div>
    );
  };

// 生肖牌：一排大字牌（鼠 / 牛 / 羊 / 狗），讲到才翻出来；tag = 冲 / 害 / 刑
export type Zod = { ch: string; at: number; zhi?: string; tag?: string; tagAt?: number };
export const ZodiacTiles: React.FC<{ at: number; until: number; items: Zod[]; y: number; size?: number; title?: string }> = ({ at, until, items, y, size = 210, title }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const o = win(t, at, until, 0.2, 0.25);
  return (
    <div style={{ position: 'absolute', left: 0, width: W, top: y, opacity: o }}>
      {title && <div style={{ textAlign: 'center', fontFamily: LTH, fontSize: 40, color: CREAM, letterSpacing: '0.12em', marginBottom: 14, textShadow: '0 3px 10px rgba(0,0,0,0.5)' }}>{title}</div>}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 26 }}>
        {items.map((z, i) => {
          const on = t >= z.at, r = 180 * (1 - ease(t, z.at, 0.4, Easing.out(Easing.back(1.4)))), tk = z.tag && t >= (z.tagAt ?? z.at) ? pop(t, z.tagAt ?? z.at) : 0;
          return (
            <div key={i} style={{ position: 'relative', width: size, height: size * 1.2, perspective: 900 }}>
              <div style={{ position: 'absolute', inset: 0, transform: `rotateY(${on ? r : 180}deg)`, borderRadius: 22, background: on ? CREAM : BUTTERFLY, border: `6px solid ${on ? ROSE : CREAM}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontFamily: LTH, fontSize: size * 0.56, color: on ? ROSE_DEEP : WHITE, lineHeight: 1 }}>{on ? z.ch : '？'}</div>
                {on && z.zhi && <div style={{ fontFamily: LTH, fontSize: size * 0.15, color: NAVY, marginTop: 10, letterSpacing: '0.2em' }}>{z.zhi}</div>}
              </div>
              {tk > 0 && (
                <div style={{ position: 'absolute', left: '50%', bottom: -36, transform: `translateX(-50%) scale(${tk}) rotate(-4deg)`, background: '#C8202E', color: CREAM, fontFamily: LTH, fontSize: 40,
                  padding: '4px 18px', borderRadius: 10, whiteSpace: 'nowrap', border: `3px solid ${CREAM}` }}>{z.tag}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 年份路线（2026 → 2029 / 2021 → 2026）：线一路画过去，每年一个点 + 关键字；up=false 往下掉
export type YearPt = { year: string; word: string; at: number; up?: number };
export const YearStrip: React.FC<{ at: number; until: number; items: YearPt[]; y: number; title?: string }> = ({ at, until, items, y, title }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const o = win(t, at, until, 0.2, 0.25), n = items.length, x0 = 130, x1 = W - 130;
  const px = (i: number) => (n === 1 ? W / 2 : x0 + ((x1 - x0) * i) / (n - 1)), py = (i: number) => y + 150 - (items[i].up ?? 0) * 110;
  let shown = 0; items.forEach((p, i) => { if (t >= p.at) shown = i + ease(t, p.at, 0.4); });
  const pts = items.map((_, i) => `${px(i)},${py(i)}`);
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 60, right: 60, top: y - 40, height: 380, borderRadius: 26, background: 'rgba(31,43,69,0.78)', border: `4px solid ${CREAM}` }} />
      {title && <div style={{ position: 'absolute', left: 90, top: y - 20, fontFamily: LTH, fontSize: 34, color: CREAM, letterSpacing: '0.1em' }}>{title}</div>}
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <polyline points={pts.join(' ')} fill="none" stroke="rgba(243,230,196,0.25)" strokeWidth={8} strokeLinecap="round" />
        {items.slice(1).map((_, i) => {
          const k = Math.max(0, Math.min(1, shown - i));
          return k > 0 ? <line key={i} x1={px(i)} y1={py(i)} x2={px(i) + (px(i + 1) - px(i)) * k} y2={py(i) + (py(i + 1) - py(i)) * k} stroke={ROSE} strokeWidth={10} strokeLinecap="round" /> : null;
        })}
      </svg>
      {items.map((p, i) => {
        const k = t >= p.at ? pop(t, p.at) : 0;
        return (
          <div key={i} style={{ position: 'absolute', left: px(i) - 110, width: 220, top: py(i) - 30, textAlign: 'center', opacity: t >= p.at - 0.01 ? 1 : 0.35 }}>
            <div style={{ width: 44, height: 44, margin: '0 auto', borderRadius: 12, background: t >= p.at ? ROSE : 'rgba(243,230,196,0.3)', border: `5px solid ${CREAM}`, transform: `scale(${0.6 + 0.4 * (k || 0)}) rotate(45deg)` }} />
            <div style={{ fontFamily: LTH, fontSize: 34, color: CREAM, marginTop: 10 }}>{p.year}</div>
            {k > 0 && <div style={{ fontFamily: LTH, fontSize: 46, color: WHITE, transform: `scale(${k})`, whiteSpace: 'nowrap' }}>{p.word}</div>}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 步骤卡（第一 / 第二 / 第三）：左边一张张叠上来
export const Steps: React.FC<{ at: number; until: number; title: string; items: { text: string; at: number }[]; x?: number; y?: number; w?: number }> = ({ at, until, title, items, x = 50, y = 820, w = 560 }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const u = pop(t, at, 0.4), o = 1 - ease(t, until - 0.25, 0.25);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, opacity: o, transform: `scale(${u}) rotate(-2deg)`, transformOrigin: 'left top' }}>
      <div style={{ display: 'inline-block', background: ROSE, color: WHITE, fontFamily: LTH, fontSize: 36, padding: '8px 22px', borderRadius: '14px 14px 0 0', letterSpacing: '0.08em' }}>{title}</div>
      <div style={{ background: CREAM, borderRadius: '0 18px 18px 18px', padding: '18px 22px', border: `4px solid ${ROSE}` }}>
        {items.map((it, i) => {
          const on = t >= it.at, k = on ? pop(t, it.at, 0.3) : 0;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '8px 0', opacity: on ? 1 : 0.28 }}>
              <div style={{ width: 60, height: 60, borderRadius: 14, background: on ? NAVY : 'transparent', border: `4px solid ${NAVY}`, color: CREAM, fontFamily: LTH, fontSize: 38,
                display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${on ? k : 1})` }}>{on ? i + 1 : ''}</div>
              <div style={{ fontFamily: LTH, fontSize: 46, color: NAVY, whiteSpace: 'nowrap' }}>{on ? it.text : '……'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 名言卡（「你的成功就是我的荣耀」「Slow is fast」）：米黄卡 + 玫红大引号，字一个个出
export const QuoteCard: React.FC<{ at: number; until: number; text: string; by?: string; y?: number; size?: number; typeDur?: number }> = ({ at, until, text, by, y = 820, size = 70, typeDur = 0.8 }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const u = pop(t, at, 0.4), o = 1 - ease(t, until - 0.25, 0.25), chars = [...text], n = Math.ceil(chars.length * Math.min(1, (t - at) / typeDur));
  return (
    <div style={{ position: 'absolute', left: 70, right: 70, top: y, opacity: o, transform: `scale(${u}) rotate(-1.5deg)` }}>
      <div style={{ position: 'relative', background: CREAM, borderRadius: 24, padding: '50px 46px 34px', border: `5px solid ${ROSE}`, overflow: 'hidden' }}>
        <Seigaiha color={ROSE} o={0.08} r={36} />
        <div style={{ position: 'absolute', left: 22, top: -30, fontFamily: 'Georgia, serif', fontSize: 190, color: ROSE, lineHeight: 1 }}>“</div>
        <div style={{ position: 'relative', fontFamily: LTH, fontSize: size, color: NAVY, lineHeight: 1.3, textAlign: 'center' }}>{chars.slice(0, n).join('')}<span style={{ opacity: 0 }}>{chars.slice(n).join('')}</span></div>
        {by && <div style={{ position: 'relative', fontFamily: LTH, fontSize: 32, color: ROSE_DEEP, textAlign: 'right', marginTop: 14, letterSpacing: '0.1em', opacity: ease(t, at + typeDur, 0.3) }}>— {by}</div>}
      </div>
    </div>
  );
};

// 两条成长曲线（「第二道成长曲线」）：第一条到顶往下，第二条从中间冲上去
export const GrowthCurves: React.FC<{ at: number; second: number; until: number; y: number; l1?: string; l2?: string }> = ({ at, second, until, y, l1 = '第一曲线', l2 = '第二曲线' }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const o = win(t, at, until, 0.2, 0.25), p1 = ease(t, at, 0.9, Easing.inOut(Easing.sin)), p2 = ease(t, second, 1.0, Easing.inOut(Easing.sin)), L = 1400;
  const c1 = `M 120 ${y + 300} C 300 ${y + 280}, 380 ${y + 40}, 520 ${y + 60} S 700 ${y + 260}, 820 ${y + 330}`;
  const c2 = `M 470 ${y + 230} C 600 ${y + 220}, 700 ${y - 40}, 960 ${y - 130}`;
  return (
    <AbsoluteFill style={{ opacity: o, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 60, right: 60, top: y - 200, height: 600, borderRadius: 26, background: 'rgba(31,43,69,0.8)', border: `4px solid ${CREAM}` }} />
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <line x1={110} y1={y + 340} x2={980} y2={y + 340} stroke="rgba(243,230,196,0.5)" strokeWidth={4} />
        <path d={c1} fill="none" stroke={CREAM} strokeWidth={12} strokeLinecap="round" strokeDasharray={`${L * p1} ${L}`} />
        <path d={c2} fill="none" stroke={ROSE} strokeWidth={16} strokeLinecap="round" strokeDasharray={`${L * p2} ${L}`} />
        {p2 > 0.95 && <polygon points={`960,${y - 130} 918,${y - 128} 944,${y - 96}`} fill={ROSE} transform={`rotate(-8 960 ${y - 130})`} />}
      </svg>
      <div style={{ position: 'absolute', left: 140, top: y - 170, fontFamily: LTH, fontSize: 40, color: CREAM, opacity: p1 }}>{l1}</div>
      {p2 > 0 && <div style={{ position: 'absolute', right: 110, top: y - 90, fontFamily: LTH, fontSize: 54, color: WHITE, background: ROSE, padding: '4px 18px', borderRadius: 12, transform: `scale(${pop(t, second + 0.7)})` }}>{l2}</div>}
    </AbsoluteFill>
  );
};

// 玫红满版大字卡（转场 / 金句）：整个画面玫红底 + 一行大字（短，0.8–1.5 秒）
export const SlamCard: React.FC<{ at: number; until: number; text: string; sub?: string }> = ({ at, until, text, sub }) => {
  const t = useT();
  if (t < at || t > until) return null;
  const o = win(t, at, until, 0.08, 0.2), k = pop(t, at, 0.3);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${ROSE} 0%, ${ROSE_DEEP} 100%)` }}><Seigaiha o={0.12} /></AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, width: W, top: 640, textAlign: 'center', transform: `scale(${k})` }}>
        <div style={{ fontFamily: LTH, fontSize: 150, color: WHITE, lineHeight: 1.15, whiteSpace: 'pre-line' }}>{text}</div>
        {sub && <div style={{ fontFamily: LTH, fontSize: 48, color: CREAM, marginTop: 24, letterSpacing: '0.1em' }}>{sub}</div>}
      </div>
    </AbsoluteFill>
  );
};
export { H };

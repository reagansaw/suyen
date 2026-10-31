// 内容⑭ 3 天战略大会 4 大收获（C0059 215–383s，访问员先问）
// 钩子「马上 500K 的 check 就进户口」→ 访问员问 → 目录「4 大收获」：①年度战略方向（真假混 · 专属战略主题）②充电日子（奇门格局 · 学生 500K 故事 B-roll）③流年风水布局（罗盘 · 财位）④奇门 Q&A（定局 布局 破局 印章）→ CTA
import React from 'react';
import { Hero, Chip, Cutaway, HandCircle, Seal, Flash, Glitch, TopBanner, IndexPanel, LuopanRing, QuestionCard, Sfx } from '../SuyenContent';
import type { Cam } from '../SuyenContent';
import { EpShell, mkEp, epFrames, subsR, mkYAt } from './kit';
import FACE from '../suyenc-face-c59c.json';
import CUT from '../suyenc-c59c-subs.json';

const { ep, R } = mkEp('c59c', CUT as any, FACE);
export const framesC59c = epFrames(CUT as any);

const SUBS: [string, number, number, number?][] = [
  ['拿到的好处很多', 280.04, 281.10], ['马上 500K 的 check', 281.22, 283.45], ['就进户口', 283.48, 284.25],
  ['第一', 226.92, 228.00], ['你可以获得', 228.88, 230.10], ['年度战略方向', 230.18, 232.40],
  ['明年的三大关键字', 235.56, 237.80], ['叫 真 · 假 · 混', 237.84, 239.05],
  ['然后给你自己', 247.20, 248.70], ['专属的战略主题', 248.74, 251.45],
  ['那第二', 257.52, 258.90], ['在这个战略大会', 258.96, 260.40], ['我也跟你们分享', 260.44, 261.30], ['充电的日子', 261.36, 262.85], ['充电呢 就会给你选出', 262.98, 265.40], ['非常棒的奇门格局', 265.44, 267.75],
  ['他们呢 摆了的这些阵', 277.74, 279.95], ['拿到的好处很多', 280.04, 281.10, 1], ['马上 500K 的 check', 281.22, 283.45, 1], ['就进户口', 283.48, 284.25, 1],
  ['第三', 298.72, 299.90], ['我也会分享', 300.20, 301.20], ['流年的风水布局', 301.30, 303.10], ['招财的流年财位', 309.24, 310.80], ['你要去取动它', 310.84, 312.20], ['让你获得更多的财气', 312.28, 313.95],
  ['第四', 359.96, 361.10], ['我也会开放奇门 Q&A', 362.14, 365.95], ['很幸运的 我选中你', 376.38, 377.75], ['我直接帮你开盘', 377.82, 379.90], ['跟你定局 布局 破局', 379.96, 383.00],
];

export const SuyenC59c: React.FC = () => {
  const CUTT = ep.dur, subs = subsR(R, SUBS as any);
  const shakes = [R(282.34), R(237.84)];
  const cam: Cam = { hits: [0.05, R(282.34), R(226.92), R(230.78), R(237.84), R(261.36), R(282.34, 1), R(298.72), R(310.36), R(359.96), R(364.36), R(380.60), R(381.42), R(382.24)],
    pushes: [[R(247.20), R(251.45), 1.06], [R(376.38), R(379.90), 1.05]] };
  return (
    <EpShell ep={ep} subs={subs} cam={cam} shakes={shakes}
      behind={<>
        <Hero text="500K" at={R(281.22)} until={R(284.25)} x={460} y={420} size={260} tone="cream" anim="呐喊声波" shake={[R(282.34)]} />
        <Hero text="方向" at={R(230.78)} until={R(232.40)} x={540} y={420} size={250} tone="cream" />
        <Hero text="500K" at={R(281.22, 1)} until={R(284.25, 1)} x={460} y={420} size={260} tone="cream" anim="呐喊声波" />
        <LuopanRing from={R(298.72)} to={R(313.95)} lock={R(310.36)} cx={540} cy={640} r={470} />
        <Hero text="Q&A" at={R(364.36)} until={R(365.95)} x={540} y={420} size={250} tone="rose" anim="呐喊声波" />
      </>}
      yAt={mkYAt([[0, R(284.25)], [R(235.56), R(239.05)], [R(258.96), R(267.75)], [R(379.96), CUTT]], [[R(277.74), R(284.25, 1)]])}
      sfx={<>
        <Sfx at={R(282.34)} s="叮收银机提示音1" /><Sfx at={R(214.98)} s="综艺悬疑轻敲" />
        <Sfx at={R(226.92)} s="扫光" /><Sfx at={R(230.78)} s="综艺咚" /><Sfx at={R(237.84)} s="故障音效" /><Sfx at={R(247.20)} s="拍照声2" /><Sfx at={R(249.48)} s="叮" />
        <Sfx at={R(257.52)} s="扫光" /><Sfx at={R(261.36)} s="综艺咚" /><Sfx at={R(265.44)} s="亮一下" /><Sfx at={R(277.74)} s="回忆-刷一下" /><Sfx at={R(282.34, 1)} s="超市电子钱柜结账" />
        <Sfx at={R(298.72)} s="扫光" /><Sfx at={R(301.30)} s="综艺咚" /><Sfx at={R(310.36)} s="叮" />
        <Sfx at={R(359.96)} s="扫光" /><Sfx at={R(364.36)} s="综艺咚" /><Sfx at={R(376.38)} s="鼠标单击" />{[380.60, 381.42, 382.24].map((a, i) => <Sfx key={i} at={R(a)} s="综艺咚" />)}
      </>}>
      <Flash at={R(282.34)} k={0.4} />
      <QuestionCard at={R(214.98)} line2At={R(217.80)} until={R(219.10)} l1="企业家来 3 天战略大会" l2="最大的收获是什么？" />
      <TopBanner at={R(226.92)} until={CUTT} kicker="林舒苑老师 · 2027 奇门战略大会" title="3 天 · 4 大收获" />
      <IndexPanel at={R(226.92)} until={CUTT} title="4 大收获" width={290} slots={[{ label: '战略方向', at: R(230.78) }, { label: '充电日子', at: R(261.36) }, { label: '风水布局', at: R(301.30) }, { label: '奇门 Q&A', at: R(364.36) }]} pulse={[R(359.96), R(364.36)]} />
      <Glitch text="真假混" at={R(237.84)} until={R(239.05)} x={540} y={930} size={190} />
      <HandCircle ep={ep} at={R(247.20)} until={R(251.45)} label="专属战略主题" labelAt={R(249.48)} />
      <Seal text="充电" at={R(261.36)} until={R(267.75)} x={190} y={900} size={200} />
      <Chip text="奇门格局" at={R(265.44)} until={R(267.75)} x={300} y={1120} tone="rose" size={62} />
      {/* 右上有目录 → B-roll 小卡放左上 */}
      <Cutaway ep={ep} src="intro_v2" from={R(277.74)} to={R(284.25, 1)} pipTopAt={R(278.1)} pipLeft />
      <Chip text="500K check 进户口" at={R(282.34, 1)} until={R(284.20, 1)} x={400} y={1250} tone="cream" size={58} />
      <Chip text="流年财位" at={R(309.24)} until={R(313.95)} x={290} y={940} tone="cream" size={66} />
      <Seal text="定局" at={R(380.60)} until={CUTT} x={190} y={760} size={180} />
      <Seal text="布局" at={R(381.42)} until={CUTT} x={190} y={970} size={180} rot={4} />
      <Seal text="破局" at={R(382.24)} until={CUTT} x={190} y={1180} size={180} rot={-3} />
    </EpShell>
  );
};

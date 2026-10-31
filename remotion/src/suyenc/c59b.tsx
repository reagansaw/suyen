// 内容⑬ 3 种人一定要来 2027 奇门战略大会（C0059 116–184s + 414–433s）
// 钩子「如果你不想一开年就做错决策，走错路」→ 访问员问 → 目录「3 种人」：①人生十字路口（创业 ⇄ 打工 · 换工？）②已经很好想更好（一步都不走错 · 路）③对奇门好奇 → 都是干货（印章）→ 一定要来（B-roll）→ 3 天你会拿到（步骤卡）→ CTA
import React from 'react';
import { Hero, Chip, Cutaway, Seal, Flash, FlipPair, TopBanner, IndexPanel, Road, QuestionCard, Sfx } from '../SuyenContent';
import type { Cam } from '../SuyenContent';
import { EpShell, mkEp, epFrames, subsR, mkYAt, Steps } from './kit';
import FACE from '../suyenc-face-c59b.json';
import CUT from '../suyenc-c59b-subs.json';

const { ep, R } = mkEp('c59b', CUT as any, FACE);
export const framesC59b = epFrames(CUT as any);

const SUBS: [string, number, number, number?][] = [
  ['如果你不想在一开年', 414.14, 417.20], ['就做错决策', 417.26, 419.05], ['走错路', 419.06, 419.75],
  ['三种人', 141.36, 142.15], ['一定要来战略大会', 142.18, 143.40],
  ['第一种人', 146.72, 147.55], ['站在人生十字路口的人', 147.58, 149.50],
  ['就是说你不知道', 150.32, 151.60], ['到底你要继续去创业', 151.64, 153.55], ['还是继续打工', 153.82, 155.80], ['还是你要换工', 155.82, 157.45], ['这种人一定要来', 157.52, 159.05],
  ['第二种', 160.16, 161.00], ['你的人生已经过得很好了', 162.04, 164.25], ['你想要越来越好', 165.30, 167.05], ['你一步都不要走错的', 167.76, 170.10], ['一定要来', 170.88, 171.65],
  ['第三种', 172.72, 173.45], ['就是对玄学 奇门遁甲', 173.48, 176.85], ['有非常深厚的感情', 176.90, 179.95], ['或者好奇心的', 180.14, 181.10], ['一定要来', 181.14, 181.70],
  ['因为我分享的都是干货', 182.38, 184.60],
  ['那你一定要来', 419.86, 420.80], ['奇门遁甲战略大会', 420.84, 422.20], ['因为这一个大会', 422.68, 423.80], ['我会直接给你', 423.84, 425.15], ['一整年的大纲和方向', 425.18, 427.85],
  ['趋势 一整年发生什么事', 428.00, 430.40], ['个人的布局', 430.42, 432.70],
];

export const SuyenC59b: React.FC = () => {
  const CUTT = ep.dur, subs = subsR(R, SUBS as any);
  const IDX_OFF = R(181.70) + 0.6;
  const shakes = [R(419.06), R(184.26)];
  const cam: Cam = { hits: [0.05, R(419.06), R(141.36), R(148.56), R(158.54), R(166.06), R(170.88), R(176.06), R(181.14), R(184.26)],
    pushes: [[R(150.32), R(157.45), 1.05], [R(422.68), R(427.85), 1.05]] };
  return (
    <EpShell ep={ep} subs={subs} cam={cam} shakes={shakes}
      behind={<>
        <Hero text="走错路" at={R(419.06)} until={R(419.75)} x={540} y={430} size={240} tone="rose" anim="呐喊声波" shake={[R(419.06)]} />
        <Hero text="3 种人" at={R(141.36)} until={R(143.40)} x={460} y={420} size={230} tone="cream" />
        <Hero text="奇门遁甲" at={R(175.30)} until={R(179.95)} x={540} y={420} size={190} tone="cream" />
      </>}
      yAt={mkYAt([[R(150.32), R(159.05)], [R(180.14), R(184.60)]], [[R(165.30), R(171.65)], [R(419.86), R(425.0)], [R(425.0), CUTT]])}
      sfx={<>
        <Sfx at={R(417.26)} s="猛然一惊" /><Sfx at={R(419.06)} s="综艺咚" /><Sfx at={R(116.0)} s="综艺悬疑轻敲" />
        <Sfx at={R(141.36)} s="扫光" /><Sfx at={R(142.18)} s="咚" /><Sfx at={R(148.56)} s="综艺咚" /><Sfx at={R(153.0)} s="回忆-刷一下" /><Sfx at={R(155.82)} s="疑惑" />
        <Sfx at={R(160.16)} s="扫光音效4" /><Sfx at={R(166.06)} s="综艺咚" /><Sfx at={R(170.88)} s="叮" />
        <Sfx at={R(172.72)} s="扫光" /><Sfx at={R(180.42)} s="综艺咚" /><Sfx at={R(184.26)} s="综艺咚" />
        <Sfx at={R(419.86)} s="回忆-刷一下" /><Sfx at={R(425.0)} s="纸张抖动声" />{[426.06, 428.96, 431.54].map((a, i) => <Sfx key={i} at={R(a)} s="正确" />)}
      </>}>
      <Flash at={R(419.06)} color="#C8202E" k={0.35} />
      <QuestionCard at={R(115.96)} line2At={R(116.90)} until={R(118.20)} l1="什么样的人" l2="一定要来战略大会？" />
      <TopBanner at={R(141.36)} until={CUTT} kicker="林舒苑老师 · 2027 奇门战略大会" title="3 种人一定要来" />
      <IndexPanel at={R(141.50)} until={IDX_OFF} title="一定要来的人" width={300} slots={[{ label: '十字路口', at: R(148.56) }, { label: '想更好', at: R(166.06) }, { label: '好奇奇门', at: R(180.42) }]} pulse={[R(141.36), R(143.40)]} />
      <FlipPair a="创业" b="打工" at={R(152.38)} flip={R(155.28)} until={R(157.45)} y={930} />
      <Chip text="换工？" at={R(156.46)} until={R(157.45)} x={800} y={1150} tone="navy" size={66} rot={4} />
      <Chip text="✓ 一定要来" at={R(158.54)} until={R(159.05)} x={300} y={930} tone="cream" size={66} />
      <Road from={R(165.30)} walk={[R(166.06), R(170.60)]} until={R(171.65)} y={980} startLabel="已经很好" endLabel="更好" endAt={R(170.60)} />
      <Chip text="好奇心" at={R(180.42)} until={R(181.70)} x={300} y={930} tone="rose" size={70} />
      <Seal text="干货" at={R(184.26)} until={R(184.60)} x={200} y={900} size={200} />
      <Cutaway ep={ep} src="ep1_yearchart" from={R(419.86)} to={R(425.0)} pipTopAt={R(420.1)} />
      <Steps at={R(425.0)} until={CUTT} title="3 天你会拿到" items={[{ text: '一整年大纲', at: R(426.06) }, { text: '一整年趋势', at: R(428.96) }, { text: '个人布局', at: R(431.54) }]} />
    </EpShell>
  );
};

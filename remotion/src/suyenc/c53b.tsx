// 内容⑥ 生肖鼠（八字有鼠 / 牛 / 羊）：2026–2029 连续四年（C0053 74–218s）
// 钩子「你快…你会不会很崩溃」→ 访问员问 → 鼠 / 牛 / 羊（生肖牌）→ 目录「生肖鼠 4 年」：2026 冲太岁 → 2027 六害（旧事被挖、背刺霸凌）→ 2028 半合水局（过山车）→ 2029 子酉破 → 连续四年（年份路线）→ 了解八字抓准方向（B-roll）→ 波动上 → 稳住就好 → CTA
import React from 'react';
import { Hero, Chip, Cutaway, Seal, Flash, TopBanner, IndexPanel, QuestionCard, Sfx } from '../SuyenContent';
import type { Cam } from '../SuyenContent';
import { EpShell, mkEp, epFrames, subsR, mkYAt, ZodiacTiles, YearStrip } from './kit';
import FACE from '../suyenc-face-c53b.json';
import CUT from '../suyenc-c53b-subs.json';

const { ep, R } = mkEp('c53b', CUT as any, FACE);
export const framesC53b = epFrames(CUT as any);

const SUBS: [string, number, number, number?][] = [
  ['如果你快', 153.40, 154.10], ['你没有认清你的方向', 154.16, 155.55], ['再加上你内心不平衡', 155.58, 157.20], ['你会不会很崩溃？', 157.24, 158.35],
  ['生肖老鼠', 85.70, 87.40], ['或者他的八字中有老鼠', 87.92, 90.60], ['有牛 有羊的人', 90.74, 93.00],
  ['生肖老鼠的人', 109.60, 111.00], ['来到了 2026 年', 111.10, 112.60], ['马年 冲太岁', 112.72, 114.00],
  ['那么来到了 2027 年', 129.56, 131.30], ['老鼠跟羊 叫做六害', 131.44, 134.00],
  ['害太岁', 134.42, 135.38], ['就是以前曾经做过的事情', 135.40, 137.20], ['被人家挖出来', 137.38, 139.00], ['重新讨论 重新讲', 139.10, 140.60],
  ['那个故事还没完哦', 162.08, 163.40], ['2028 年呢 是猴子年', 163.48, 166.10], ['老鼠跟猴子呢', 166.18, 168.05], ['叫做半合水局', 168.10, 169.40],
  ['你的人生呢', 171.10, 171.70], ['就好像过山车这样', 171.78, 173.05], ['所以连续三年出问题', 173.66, 175.50],
  ['来到了 2029 年', 175.54, 177.20], ['这个鸡的年份', 178.12, 179.40], ['子酉又破', 179.42, 180.60], ['所以生肖老鼠的', 180.68, 182.20], ['连续四年', 182.22, 183.45],
  ['如果你当下了解你的八字', 187.78, 191.20], ['在 2027 年 抓准方向的话', 191.84, 194.40],
  ['不急', 214.90, 215.70], ['稳住就好', 216.80, 217.80],
];

export const SuyenC53b: React.FC = () => {
  const CUTT = ep.dur, subs = subsR(R, SUBS as any);
  const IDX_OFF = R(183.45) + 0.6;
  const shakes = [R(157.82), R(179.92)];
  const cam: Cam = { hits: [0.05, R(157.82), R(86.60), R(91.22), R(92.50), R(113.28), R(133.34), R(168.40), R(179.92), R(182.94)],
    pushes: [[R(134.42), R(140.60), 1.07], [R(214.90), R(217.80), 1.05]] };
  return (
    <EpShell ep={ep} subs={subs} cam={cam} shakes={shakes}
      behind={<>
        <Hero text="崩溃" at={R(157.60)} until={R(158.35)} x={540} y={420} size={260} tone="rose" anim="呐喊声波" shake={[R(157.82)]} />
        <Hero text="2026" at={R(111.10)} until={R(114.00)} x={360} y={420} size={215} tone="cream" />
        <Hero text="2027" at={R(129.56)} until={R(131.30)} x={360} y={420} size={215} tone="cream" />
        <Hero text="六害" at={R(133.34)} until={R(134.00)} x={540} y={430} size={240} tone="rose" anim="呐喊声波" />
        <Hero text="2028" at={R(163.48)} until={R(169.40)} x={360} y={420} size={215} tone="cream" />
        <Hero text="2029" at={R(175.54)} until={R(180.60)} x={360} y={420} size={215} tone="cream" />
        <Hero text="稳" at={R(216.80)} until={CUTT} x={540} y={430} size={280} tone="rose" anim="呐喊声波" />
      </>}
      yAt={mkYAt([[0, R(158.35)], [R(85.70), R(93.00)], [R(131.44), R(134.0)]], [[R(171.10), R(183.45)], [R(187.78), R(194.40)]])}
      sfx={<>
        <Sfx at={R(157.24)} s="猛然一惊" /><Sfx at={R(74.24)} s="综艺悬疑不对劲" />
        {[86.60, 91.22, 92.50].map((a, i) => <Sfx key={i} at={R(a)} s="啵1" />)}
        <Sfx at={R(109.60)} s="扫光" /><Sfx at={R(113.28)} s="综艺咚" /><Sfx at={R(129.56)} s="咚" /><Sfx at={R(133.34)} s="综艺咚" />
        <Sfx at={R(137.38)} s="纸张抖动声" />
        <Sfx at={R(162.08)} s="综艺悬疑轻敲" /><Sfx at={R(168.40)} s="综艺咚" /><Sfx at={R(171.10)} s="旋风" /><Sfx at={R(179.92)} s="故障音效" />
        <Sfx at={R(182.94)} s="猛然一惊" /><Sfx at={R(187.78)} s="回忆-刷一下" /><Sfx at={R(216.80)} s="木鱼敲击回响音效" />
      </>}>
      <Flash at={R(157.60)} color="#C8202E" k={0.4} />
      <QuestionCard at={R(74.24)} line2At={R(80.85)} until={R(82.10)} l1="什么样的八字、什么样的盘" l2="明年只要一快，一定出事情？" />
      <TopBanner at={R(85.70)} until={CUTT} kicker="林舒苑老师 · 2027 生肖提醒" title="鼠 · 牛 · 羊 要稳住" />
      <ZodiacTiles at={R(85.70)} until={R(93.00)} y={830} size={190} items={[{ ch: '鼠', zhi: '子', at: R(86.60) }, { ch: '牛', zhi: '丑', at: R(91.22) }, { ch: '羊', zhi: '未', at: R(92.50) }]} />
      <IndexPanel at={R(109.60)} until={IDX_OFF} title="生肖鼠 · 4 年" width={300} slots={[{ tag: '2026', label: '冲太岁', at: R(113.28) }, { tag: '2027', label: '六害', at: R(133.34) }, { tag: '2028', label: '水局', at: R(168.40) }, { tag: '2029', label: '破', at: R(179.92) }]} pulse={[R(162.08), R(163.40)]} />
      <ZodiacTiles at={R(131.44)} until={R(134.00)} y={850} size={190} items={[{ ch: '鼠', zhi: '子', at: R(131.44) }, { ch: '羊', zhi: '未', at: R(132.60), tag: '六害', tagAt: R(133.34) }]} />
      <Chip text="旧事被挖出来" at={R(137.38)} until={R(140.60)} x={300} y={930} tone="navy" size={62} />
      <Seal text="水局" at={R(168.40)} until={R(169.40)} x={200} y={900} size={200} />
      <YearStrip at={R(171.10)} until={R(183.45)} y={1000} title="生肖鼠 · 连续四年" items={[
        { year: '2026', word: '冲', at: R(171.20), up: 0.4 }, { year: '2027', word: '害', at: R(171.80), up: -0.6 },
        { year: '2028', word: '水局', at: R(172.40), up: 0.8 }, { year: '2029', word: '破', at: R(179.92), up: -0.9 }]} />
      <Cutaway ep={ep} src="ep1_yearchart" from={R(187.78)} to={R(194.40)} pipTopAt={R(188.2)} />
      <Chip text="抓准方向" at={R(193.08)} until={R(194.35)} x={320} y={1250} tone="rose" size={64} />
    </EpShell>
  );
};

// 内容⑤ 2027 要慢？慢在哪一步（C0053 0–74s）
// 钩子「你快就等你跌坑，不如慢下来」→ 访问员问（人家都快、AI 最高峰）→ 慢就是快 → 不是慢慢摸 → AI 时代慢不行（速度线）→ 精准判断力（聚光灯）→ 方向清晰 + 判断准确 = 可以快（目录）→ 连去哪里都不懂（B-roll 岔路）→ 怎么快 → 跌坑 → 慢下来 → CTA
import React from 'react';
import { Hero, Chip, Cutaway, HandCircle, Flash, FlipPair, TopBanner, IndexPanel, SpeedLines, QuestionCard, Sfx } from '../SuyenContent';
import type { Cam } from '../SuyenContent';
import { EpShell, mkEp, epFrames, subsR, mkYAt } from './kit';
import FACE from '../suyenc-face-c53a.json';
import CUT from '../suyenc-c53a-subs.json';

const { ep, R } = mkEp('c53a', CUT as any, FACE);
export const framesC53a = epFrames(CUT as any);

const SUBS: [string, number, number, number?][] = [
  ['你快 就等你跌坑', 70.16, 72.10], ['所以 不如慢下来吧', 72.22, 74.10],
  ['有一句话说', 24.20, 25.10], ['慢就是快', 25.16, 26.50], ['快就是慢', 26.60, 27.60],
  ['所以这里我讲的慢', 28.20, 30.00], ['不是叫你慢慢来 慢慢摸', 30.06, 32.10],
  ['因为现在在 AI 的时代', 32.18, 34.40], ['你慢一点都不行', 34.42, 35.48], ['你有什么问题', 35.48, 36.70], ['AI 一问 马上出答案', 36.76, 38.60],
  ['所以在这里我指的慢', 39.72, 41.95], ['是说你要有', 41.98, 43.20], ['精准的判断能力', 43.22, 45.10],
  ['如果你的方向是清晰的', 45.18, 48.00], ['你的判断能力是准确的', 48.50, 51.10], ['那你就可以快', 51.14, 52.40],
  ['但是如果你连要去哪里', 52.50, 55.60], ['你都不懂', 55.66, 56.25], ['你连最基本的判断能力', 56.88, 59.30],
  ['你怎么快呢？', 69.04, 70.10], ['你快 就等你跌坑', 70.16, 72.10, 1], ['所以 不如慢下来吧', 72.22, 74.10, 1],
];

export const SuyenC53a: React.FC = () => {
  const CUTT = ep.dur, subs = subsR(R, SUBS as any);
  const IDX_OFF = R(52.14) + 0.8;
  const shakes = [R(71.78), R(71.78, 1)];
  const cam: Cam = { hits: [0.05, R(71.78), R(25.16), R(26.60), R(33.68), R(43.50), R(52.14), R(71.78, 1), R(73.32, 1)],
    pushes: [[R(28.20), R(32.10), 1.05], [R(69.04), R(70.10), 1.08]] };
  return (
    <EpShell ep={ep} subs={subs} cam={cam} shakes={shakes}
      behind={<>
        <Hero text="跌坑" at={R(71.78)} until={R(72.20)} x={540} y={420} size={260} tone="rose" anim="呐喊声波" shake={[R(71.78)]} />
        <Hero text="慢下来" at={R(73.00)} until={R(74.10)} x={540} y={430} size={210} tone="cream" />
        <Hero text="AI" at={R(33.68)} until={R(38.60)} x={540} y={420} size={300} tone="cream" anim="呐喊声波" />
        <Hero text="跌坑" at={R(71.78, 1)} until={R(72.20, 1)} x={540} y={420} size={260} tone="rose" anim="呐喊声波" shake={[R(71.78, 1)]} />
        <Hero text="慢下来" at={R(73.00, 1)} until={R(74.10, 1)} x={540} y={430} size={210} tone="cream" />
      </>}
      yAt={mkYAt([[0, R(74.10)], [R(24.20), R(27.60)], [R(45.18), R(52.40)], [R(69.04), CUTT]], [[R(52.50), R(59.30)]])}
      sfx={<>
        <Sfx at={R(71.78)} s="猛然一惊" /><Sfx at={R(73.00)} s="综艺咚" /><Sfx at={R(1.02)} s="综艺悬疑不对劲" />
        <Sfx at={R(24.20)} s="扫光" /><Sfx at={R(25.16)} s="咚" /><Sfx at={R(26.60)} s="回忆-刷一下" /><Sfx at={R(30.78)} s="无奈" />
        <Sfx at={R(32.18)} s="旋风" /><Sfx at={R(37.62)} s="叮" /><Sfx at={R(39.72)} s="拍照声2" /><Sfx at={R(43.50)} s="叮" />
        <Sfx at={R(47.26)} s="正确" /><Sfx at={R(50.38)} s="正确" /><Sfx at={R(52.50)} s="回忆-刷一下" />
        <Sfx at={R(69.04)} s="疑惑" /><Sfx at={R(71.78, 1)} s="咚咚重音心头震" vol={0.4} /><Sfx at={R(73.00, 1)} s="综艺咚" />
      </>}>
      <Flash at={R(71.78)} color="#C8202E" k={0.4} />
      <QuestionCard at={R(1.02)} line2At={R(7.54)} until={R(11.95)} l1="你讲 2027 要慢，慢在哪一步？" l2="人家都这么快，AI 正在最高峰……" />
      <TopBanner at={R(24.20)} until={CUTT} kicker="林舒苑老师 · 2027 要慢？" title="慢在哪一步" />
      <FlipPair a="慢" b="快" at={R(25.16)} flip={R(26.60)} until={R(27.60)} y={930} />
      <Chip text="✗ 慢慢摸" at={R(31.38)} until={R(32.10)} x={300} y={940} tone="navy" size={66} />
      <SpeedLines ep={ep} from={R(32.18)} to={R(38.60)} />
      <Chip text="AI 一问就有答案" at={R(36.96)} until={R(38.60)} x={540} y={960} tone="rose" size={60} />
      <HandCircle ep={ep} at={R(39.72)} until={R(45.10)} label="精准判断力" labelAt={R(43.22)} />
      <IndexPanel at={R(45.18)} until={IDX_OFF} title="可以快的条件" width={300} slots={[{ label: '方向清晰', at: R(47.26) }, { label: '判断准确', at: R(50.38) }]} pulse={[R(45.18), R(47.26)]} />
      <Chip text="✓ 可以快" at={R(52.14)} until={R(52.40)} x={300} y={930} tone="cream" size={70} />
      <Cutaway ep={ep} src="p2_fork" from={R(52.50)} to={R(59.30)} pipTopAt={IDX_OFF + 0.1} />
      <Chip text="要去哪里？" at={R(54.82)} until={R(59.25)} x={330} y={1250} tone="rose" size={64} />
      <Flash at={R(71.78, 1)} color="#C8202E" k={0.4} />
    </EpShell>
  );
};

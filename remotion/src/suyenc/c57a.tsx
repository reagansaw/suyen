// 内容⑨ 35 岁以上：空亡符号，冲还是守（C0057 3–96s）
// 钩子「你的财产会被洗劫掉，那你就不要冲，你冲干嘛」→ 访问员问 → 35 岁走第三个大运 → 很容易出现空亡 → 目录「空亡两种」：变笨→别乱冲 / 蠢才变天才→一飞冲天 → 拿到条件才冲（清单）→ 怎么知道：奇门命理盘 → 转宫：死门 + 空亡（手机盘）→ 财产洗劫（B-roll）→ 提前知道（聚光灯）→ CTA
import React from 'react';
import { Hero, Chip, Cutaway, HandCircle, Checklist, Flash, FlipPair, TopBanner, IndexPanel, SpeedLines, PhoneQimen, QuestionCard, Sfx } from '../SuyenContent';
import type { Cam } from '../SuyenContent';
import { EpShell, mkEp, epFrames, subsR, mkYAt } from './kit';
import FACE from '../suyenc-face-c57a.json';
import CUT from '../suyenc-c57a-subs.json';

const { ep, R } = mkEp('c57a', CUT as any, FACE);
export const framesC57a = epFrames(CUT as any);

const SUBS: [string, number, number, number?][] = [
  ['你的财产会被洗劫掉', 84.92, 87.10], ['那你就不要冲', 87.20, 88.30], ['你冲干嘛？', 89.06, 90.25],
  ['35 岁的人啊', 23.36, 24.80], ['通常在八字命理上呢', 24.92, 27.20], ['你的大运应该是走到', 27.42, 29.40], ['你的第三个大运', 29.44, 30.75],
  ['那第三个大运呢', 33.50, 34.65], ['很容易出现', 34.72, 35.66], ['空亡的这个符号', 35.68, 37.20],
  ['如果这个空亡符号', 48.12, 49.55], ['是会让你变笨的', 49.60, 51.05], ['那你最好不要乱乱冲', 51.10, 52.70],
  ['但是有些空亡符号会让你', 52.74, 55.00], ['蠢才变天才的', 55.64, 57.15], ['冲着去', 59.06, 59.80], ['一飞冲天', 59.88, 61.55],
  ['所以如果你拿到', 61.62, 63.95], ['这个一飞冲天的条件就可以', 64.00, 65.65], ['拿不到就不要', 65.68, 66.95],
  ['那我们怎么知道', 67.00, 68.25], ['你拿到拿不到？', 68.30, 69.20], ['你可以参考看一看', 69.24, 71.40], ['奇门遁甲的命理盘', 71.46, 73.15],
  ['有一招叫做转宫', 76.72, 78.75], ['当你的死门', 78.80, 80.30], ['死门来到了', 81.56, 82.70], ['空亡重叠的这个位置', 82.72, 84.80],
  ['你的财产会被洗劫掉', 84.92, 87.10, 1], ['那你就不要冲', 87.20, 88.30, 1], ['你冲干嘛？', 89.06, 90.25, 1],
  ['所以你看', 91.58, 92.30], ['我们学习这些系统', 92.36, 93.95], ['就是提前知道会发生什么事', 93.96, 96.05],
];

export const SuyenC57a: React.FC = () => {
  const CUTT = ep.dur, subs = subsR(R, SUBS as any);
  const IDX_OFF = R(59.88) + 0.8;
  const shakes = [R(86.50), R(51.10), R(86.50, 1)];
  const cam: Cam = { hits: [0.05, R(86.50), R(87.82), R(29.70), R(35.68), R(50.26), R(56.48), R(59.88), R(65.40), R(82.72), R(86.50, 1)],
    pushes: [[R(33.50), R(37.20), 1.06], [R(67.00), R(69.20), 1.05]] };
  const gray = (t: number) => (t >= R(84.92) && t < R(90.25) ? 0.7 : 0);
  return (
    <EpShell ep={ep} subs={subs} cam={cam} shakes={shakes} gray={gray}
      behind={<>
        <Hero text="别冲" at={R(87.60)} until={R(90.25)} x={540} y={420} size={270} tone="rose" anim="呐喊声波" shake={[R(87.82)]} />
        <Hero text="第三个大运" at={R(29.70)} until={R(30.75)} x={540} y={430} size={150} tone="cream" />
        <Hero text="空亡" at={R(35.68)} until={R(37.20)} x={540} y={420} size={260} tone="cream" />
        <Hero text="一飞冲天" at={R(59.88)} until={R(61.55)} x={540} y={430} size={180} tone="rose" anim="呐喊声波" />
      </>}
      yAt={mkYAt([[0, R(90.25)], [R(55.64), R(57.15)], [R(61.62), R(66.95)], [R(76.72), R(84.80)]], [[R(84.92, 1), R(90.25, 1)]])}
      sfx={<>
        <Sfx at={R(85.56)} s="超市电子钱柜结账" /><Sfx at={R(87.82)} s="猛然一惊" /><Sfx at={R(6.32)} s="综艺悬疑不对劲" />
        <Sfx at={R(23.36)} s="扫光" /><Sfx at={R(29.70)} s="咚" /><Sfx at={R(35.68)} s="综艺咚" /><Sfx at={R(48.12)} s="纸张抖动声" />
        <Sfx at={R(50.26)} s="无奈" /><Sfx at={R(55.64)} s="回忆-刷一下" /><Sfx at={R(59.88)} s="旋风" /><Sfx at={R(65.40)} s="正确" /><Sfx at={R(66.68)} s="正确" />
        <Sfx at={R(67.00)} s="疑惑" /><Sfx at={R(76.72)} s="呼2" /><Sfx at={R(78.80)} s="鼠标单击" /><Sfx at={R(82.72)} s="亮一下" />
        <Sfx at={R(84.92, 1)} s="回忆-刷一下" /><Sfx at={R(87.82, 1)} s="咚咚重音心头震" vol={0.4} /><Sfx at={R(91.58)} s="拍照声2" /><Sfx at={R(94.56)} s="叮" />
      </>}>
      <Flash at={R(87.60)} color="#C8202E" k={0.4} />
      <QuestionCard at={R(6.32)} line2At={R(7.0)} until={R(8.55)} l1="35、40 岁的人，2027 年" l2="什么盘最好不要冲，要守？" />
      <TopBanner at={R(23.36)} until={CUTT} kicker="林舒苑老师 · 35 岁以上" title="空亡：冲还是守？" />
      <IndexPanel at={R(48.12)} until={IDX_OFF} title="空亡有两种" width={300} slots={[{ label: '变笨 → 别冲', at: R(50.62) }, { label: '天才 → 冲', at: R(56.48) }]} pulse={[R(52.74), R(55.00)]} />
      <FlipPair a="蠢才" b="天才" at={R(55.64)} flip={R(56.28)} until={R(57.15)} y={930} />
      <SpeedLines ep={ep} from={R(59.06)} to={R(61.55)} />
      <Checklist at={R(61.62)} until={R(66.95)} title="一飞冲天的条件" items={[{ text: '拿到 → 冲', at: R(65.40) }, { text: '拿不到 → 不要', at: R(66.68) }]} />
      <Chip text="奇门命理盘" at={R(71.46)} until={R(73.15)} x={300} y={940} tone="rose" size={66} />
      <PhoneQimen at={R(76.72)} until={R(84.80)} tap={R(78.80)} hi={R(82.72)} hiIdx={6} hiLabel="死门 + 空亡" />
      <Cutaway ep={ep} src="p2_loss" from={R(84.92, 1)} to={R(90.25, 1)} pipTopAt={R(85.30, 1)} />
      <Chip text="财产被洗劫" at={R(86.50, 1)} until={R(90.20, 1)} x={320} y={1250} tone="rose" size={64} />
      <HandCircle ep={ep} at={R(91.58)} until={CUTT} label="提前知道" labelAt={R(94.20)} />
    </EpShell>
  );
};

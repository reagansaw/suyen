// 内容④ 破解真假混：3 个方法（C0051 90–255s）
// 钩子「凡是遇到什么问题，呼吸三次」→ 为什么分辨不了真假（假在真里面）→ 3 个方法（目录锁住）：①呼吸三次 ②想三次 / 核对三次 ③看八字 → 因为聪明而迷茫 → 古人大数据（B-roll）→ CTA
import React from 'react';
import { Hero, Chip, Cutaway, HandCircle, Checklist, CircleStage, Flash, Glitch, FlipPair, TopBanner, IndexPanel, Sfx } from '../SuyenContent';
import type { Cam } from '../SuyenContent';
import { EpShell, mkEp, epFrames, subsR, mkYAt } from './kit';
import FACE from '../suyenc-face-c51b.json';
import CUT from '../suyenc-c51b-subs.json';

const { ep, R } = mkEp('c51b', CUT as any, FACE);
export const framesC51b = epFrames(CUT as any);

const SUBS: [string, number, number, number?][] = [
  ['凡是遇到什么问题', 199.14, 201.90], ['呼吸三次', 202.94, 204.20],
  ['为什么现在的人', 90.18, 91.40], ['会无法去分辨这些真和假', 91.46, 96.80], ['因为假在真里面', 100.76, 103.35],
  ['你看 要怎么解决这个问题', 190.36, 192.80], ['说实在的很简单', 192.86, 194.58], ['我现在教你三个方法', 194.64, 197.30],
  ['第一', 197.38, 198.90], ['凡是遇到什么问题', 199.14, 201.90, 1], ['呼吸三次', 202.94, 204.20, 1], ['那你的头脑就会冷静', 205.48, 207.50],
  ['第二', 209.28, 210.20], ['当你遇到重要的决策的时候', 210.28, 214.00], ['你要想三次', 214.00, 216.20],
  ['或者当你看到', 216.26, 217.60], ['任何一个很奇怪的文件', 217.60, 220.05], ['多一个心', 220.10, 221.10], ['verify 三次', 221.16, 222.80], ['对 核对三次', 222.86, 224.50],
  ['来 第三个重点', 227.58, 229.30], ['就是看一看你自身的八字', 229.40, 233.50],
  ['你有没有放下', 237.58, 238.90], ['刚才我说的', 238.92, 239.80], ['因为聪明而迷茫', 239.82, 241.95], ['这是古人留给我们的大数据', 252.66, 255.00],
];

export const SuyenC51b: React.FC = () => {
  const CUTT = ep.dur, subs = subsR(R, SUBS as any);
  const IDX_OFF = R(241.95) + 0.6;
  const shakes = [R(202.94), R(101.60), R(202.94, 1)];
  const cam: Cam = { hits: [0.05, R(202.94), R(95.68), R(101.60), R(197.38), R(202.94, 1), R(209.28), R(227.58), R(232.42)],
    pushes: [[R(205.48), R(207.50), 1.06], [R(190.36), R(194.58), 1.05]] };
  const gray = (t: number) => (t >= R(237.58) && t < R(239.80) ? 0.9 : 0);
  return (
    <EpShell ep={ep} subs={subs} cam={cam} shakes={shakes} gray={gray}
      behind={<>
        <Hero text="3 次" at={R(202.94)} until={R(204.20)} x={540} y={420} size={260} tone="rose" anim="呐喊声波" shake={[R(202.94)]} />
        <Hero text="假在真里" at={R(100.76)} until={R(103.35)} x={540} y={430} size={170} tone="rose" anim="呐喊声波" shake={[R(101.60)]} />
        <Hero text="3 个方法" at={R(194.64)} until={R(197.30)} x={480} y={430} size={180} tone="cream" />
        <Hero text="呼吸 3 次" at={R(202.94, 1)} until={R(204.20, 1)} x={480} y={430} size={160} tone="cream" anim="呐喊声波" />
      </>}
      yAt={mkYAt([[0, R(204.20)], [R(91.46), R(96.80)], [R(209.28), R(224.50)], [R(237.58), R(241.95)]], [[R(227.58), R(233.50)], [R(252.66), CUTT]])}
      sfx={<>
        <Sfx at={R(202.94)} s="综艺咚" /><Sfx at={R(90.18)} s="疑惑" /><Sfx at={R(95.68)} s="故障音效" /><Sfx at={R(101.60)} s="猛然一惊" />
        <Sfx at={R(190.36)} s="扫光" /><Sfx at={R(194.64)} s="咚" /><Sfx at={R(202.94, 1)} s="综艺咚" /><Sfx at={R(205.48)} s="空灵的水滴声" />
        <Sfx at={R(209.28)} s="纸张抖动声" />{[215.02, 221.16, 223.18].map((a, i) => <Sfx key={i} at={R(a)} s="正确" />)}
        <Sfx at={R(227.58)} s="扫光音效4" /><Sfx at={R(232.42)} s="咚" /><Sfx at={R(237.58)} s="拍照声2" /><Sfx at={R(240.54)} s="回忆-刷一下" />
        <Sfx at={R(252.66)} s="回忆-刷一下" />
      </>}>
      <Flash at={R(202.94)} k={0.35} />
      <Glitch text="真 ？ 假" at={R(95.20)} until={R(96.80)} x={540} y={930} size={170} />
      <TopBanner at={R(190.36)} until={CUTT} kicker="林舒苑老师 · 2027 真假混" title="破解的 3 个方法" />
      <IndexPanel at={R(194.64)} until={IDX_OFF} title="3 个方法" width={290} slots={[{ label: '呼吸 3 次', at: R(202.94, 1) }, { label: '想 3 次', at: R(215.02) }, { label: '看八字', at: R(232.42) }]} pulse={[R(194.64), R(197.30)]} />
      <HandCircle ep={ep} at={R(205.48)} until={R(207.50)} label="冷静" labelAt={R(207.14)} />
      <Checklist at={R(209.28)} until={R(224.50)} title="重要决策 / 奇怪文件" items={[{ text: '想 3 次', at: R(215.02) }, { text: 'verify 3 次', at: R(221.16) }, { text: '核对 3 次', at: R(223.18) }]} />
      <CircleStage ep={ep} from={R(227.58)} to={R(233.50)}>
        <Hero text="第三" at={R(228.18)} until={R(233.50)} x={300} y={1290} size={140} tone="cream" anim="呐喊声波" rotY={20} />
        <Hero text="八字" at={R(232.42)} until={R(233.50)} x={780} y={1290} size={170} tone="navy" anim="呐喊声波" rotY={-20} />
      </CircleStage>
      <FlipPair a="聪明" b="迷茫" at={R(239.82)} flip={R(241.18)} until={R(241.95)} y={930} />
      <Cutaway ep={ep} src="ep1_yearchart" from={R(252.66)} to={CUTT} pipTopAt={R(253.0)} />
      <Chip text="古人的大数据" at={R(254.10)} until={CUTT} x={330} y={1250} tone="cream" size={60} />
    </EpShell>
  );
};

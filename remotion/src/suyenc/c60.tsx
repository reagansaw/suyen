// 内容⑮ 学生真实故事：美容院老板每年跟战略（C0060 10–247s）
// 钩子「那个 machine 年头买 100K，年尾卖剩 50K」→ 美容产品学生 → 目录「每年战略」：2021 遍地黄金（小单小单 · 原来那么多）→ 2022 老虎年 三国鼎立（找靠山 · 微整诊所 · 同行追不上 曲线）→ 2026 快狠暴（速度线 · 别买 machine 单据盖「不买」）→ 幸亏听了（聚光灯）→ 100K→50K（B-roll）→ 这就是战略 → CTA
import React from 'react';
import { Hero, Chip, Cutaway, HandCircle, CircleStage, Seal, Flash, Glitch, TopBanner, IndexPanel, SpeedLines, Sfx } from '../SuyenContent';
import type { Cam } from '../SuyenContent';
import { EpShell, mkEp, epFrames, subsR, mkYAt, DocCard, GrowthCurves } from './kit';
import FACE from '../suyenc-face-c60.json';
import CUT from '../suyenc-c60-subs.json';

const { ep, R } = mkEp('c60', CUT as any, FACE);
export const framesC60 = epFrames(CUT as any);

const SUBS: [string, number, number, number?][] = [
  ['分分钟那个 machine', 238.32, 239.40], ['年头买 100K', 239.44, 240.95], ['年尾卖', 241.32, 242.30], ['剩下 50K', 242.32, 243.70],
  ['我有一位学生', 9.92, 10.85], ['他是做美容产品的', 10.88, 12.45],
  ['到我在 2021 年做战略大会', 22.96, 25.10], ['那一整年的大纲趋势', 27.76, 29.60], ['就是遍地黄金', 29.68, 31.30],
  ['那时候他听了我的战略大会呢', 39.48, 41.50], ['他就卖的配套', 41.54, 42.45],
  ['哇 原来是那么的多', 50.86, 52.45], ['他非常的开心', 52.50, 53.90],
  ['那到了第二年', 62.84, 64.40], ['2022 年的时候', 64.44, 65.65], ['我说这一年老虎年', 65.70, 68.30],
  ['我就讲 三国鼎立', 98.44, 99.60], ['你要去找一个很大的靠山', 99.64, 101.95], ['来靠住', 102.04, 102.55],
  ['所以那一年', 102.62, 103.55], ['他找了一间诊所', 103.60, 105.30], ['就是做微整的', 105.80, 106.90], ['来跟他配合', 106.98, 107.70],
  ['所以微整那边就给他顾客', 107.76, 110.05], ['所以他的竞争者追不上他', 110.08, 112.00],
  ['来到了今年 快狠暴', 198.10, 200.55], ['你不要去投资在那种', 201.72, 203.70], ['有的没的科技的', 203.78, 205.95], ['那种 machine', 206.00, 206.95],
  ['他听我说', 218.16, 218.78], ['他没有做这一个', 218.80, 220.50], ['100K 的投资', 220.56, 221.75], ['那个 machine 100K', 222.08, 223.40],
  ['老师 幸亏我听你讲', 234.20, 236.40], ['没有投资在那个 machine', 236.44, 237.70],
  ['分分钟那个 machine', 238.32, 239.40, 1], ['年头买 100K', 239.44, 240.95, 1], ['年尾卖', 241.32, 242.30, 1], ['剩下 50K', 242.32, 243.70, 1],
  ['这个战略就是这样啊', 245.70, 247.45],
];

export const SuyenC60: React.FC = () => {
  const CUTT = ep.dur, subs = subsR(R, SUBS as any);
  const IDX_OFF = R(200.55) + 0.8;
  const shakes = [R(243.30), R(219.54)];
  const cam: Cam = { hits: [0.05, R(240.26), R(243.30), R(23.60), R(30.02), R(51.86), R(67.22), R(98.88), R(104.58), R(199.70), R(219.54), R(243.30, 1)],
    pushes: [[R(107.76), R(112.00), 1.06], [R(245.70), R(247.45), 1.05]] };
  return (
    <EpShell ep={ep} subs={subs} cam={cam} shakes={shakes}
      behind={<>
        <Hero text="100K" at={R(240.26)} until={R(242.30)} x={460} y={420} size={260} tone="cream" />
        <Hero text="2021" at={R(23.60)} until={R(25.10)} x={460} y={420} size={250} tone="cream" />
        <Hero text="遍地黄金" at={R(30.02)} until={R(31.30)} x={540} y={430} size={170} tone="cream" anim="呐喊声波" />
        <Hero text="那么多！" at={R(51.86)} until={R(53.90)} x={540} y={430} size={200} tone="rose" anim="呐喊声波" />
        <Hero text="老虎年" at={R(67.22)} until={R(68.30)} x={540} y={430} size={220} tone="cream" />
        <Hero text="快狠暴" at={R(199.70)} until={R(200.55)} x={540} y={430} size={220} tone="rose" anim="呐喊声波" shake={[R(199.70)]} />
      </>}
      yAt={mkYAt([[0, R(243.70)], [R(103.60), R(107.70)], [R(203.78), R(223.40)]], [[R(98.44), R(102.55)], [R(107.76), R(112.00)], [R(238.32, 1), R(243.70, 1)]])}
      sfx={<>
        <Sfx at={R(240.26)} s="叮收银机提示音1" /><Sfx at={R(243.30)} s="猛然一惊" />
        <Sfx at={R(9.92)} s="扫光" /><Sfx at={R(23.60)} s="咚" /><Sfx at={R(30.02)} s="亮一下" />
        <Sfx at={R(50.86)} s="女声哇哦" vol={0.5} /><Sfx at={R(62.84)} s="扫光" /><Sfx at={R(67.22)} s="综艺咚" />
        <Sfx at={R(98.44)} s="扫光音效4" /><Sfx at={R(98.88)} s="综艺咚" /><Sfx at={R(104.58)} s="气泡弹出" /><Sfx at={R(107.76)} s="呼2" /><Sfx at={R(110.08)} s="叮" />
        <Sfx at={R(198.10)} s="旋风" /><Sfx at={R(199.70)} s="综艺咚" /><Sfx at={R(203.78)} s="纸张抖动声" /><Sfx at={R(219.54)} s="综艺咚" />
        <Sfx at={R(234.20)} s="拍照声2" /><Sfx at={R(235.42)} s="叮" /><Sfx at={R(238.32, 1)} s="回忆-刷一下" /><Sfx at={R(243.30, 1)} s="咚咚重音心头震" vol={0.4} /><Sfx at={R(246.44)} s="综艺咚" />
      </>}>
      <Glitch text="50K" at={R(242.32)} until={R(243.70)} x={540} y={930} size={220} />
      <Flash at={R(243.30)} color="#C8202E" k={0.4} />
      <TopBanner at={R(9.92)} until={CUTT} kicker="林舒苑老师 · 学生真实故事" title="美容院老板跟对年度战略" />
      <IndexPanel at={R(9.92)} until={IDX_OFF} title="每年的战略" width={300} slots={[{ tag: '2021', label: '遍地黄金', at: R(30.02) }, { tag: '2022', label: '三国鼎立', at: R(98.88) }, { tag: '2026', label: '快狠暴', at: R(199.70) }]} pulse={[R(9.92), R(12.45)]} />
      <Chip text="配套 · 小单" at={R(41.54)} until={R(42.45)} x={300} y={930} tone="cream" size={70} />
      <CircleStage ep={ep} from={R(98.44)} to={R(102.55)}>
        <Hero text="三国鼎立" at={R(98.88)} until={R(102.55)} x={350} y={1290} size={105} tone="cream" anim="呐喊声波" rotY={20} />
        <Hero text="找靠山" at={R(101.60)} until={R(102.55)} x={790} y={1290} size={130} tone="navy" anim="呐喊声波" rotY={-20} />
      </CircleStage>
      <Chip text="+ 微整诊所" at={R(104.58)} until={R(107.70)} x={300} y={930} tone="rose" size={66} />
      <GrowthCurves at={R(107.76)} second={R(108.80)} until={R(112.00)} y={980} l1="同行" l2="他" />
      <SpeedLines ep={ep} from={R(198.10)} to={R(200.55)} />
      <DocCard at={R(203.78)} until={R(223.40)} stampAt={R(219.54)} stamp="不买" head="FACIAL MACHINE · 报价" title="年头 RM 100K" rows={[['科技', '很快被淘汰'], ['年尾转卖', 'RM 50K'], ['老师说', '不要投资']]} />
      <HandCircle ep={ep} at={R(234.20)} until={R(237.70)} label="幸亏听了" labelAt={R(235.42)} />
      <Cutaway ep={ep} src="p2_loss" from={R(238.32, 1)} to={R(243.70, 1)} pipTopAt={R(238.7, 1)} />
      <Chip text="100K → 50K" at={R(242.32, 1)} until={R(243.65, 1)} x={330} y={1250} tone="rose" size={70} />
      <Seal text="战略" at={R(246.44)} until={CUTT} x={190} y={900} size={200} />
    </EpShell>
  );
};

// 内容⑧ 35 岁以上：第二道成长曲线 · 定局断局布局破局（C0056 22–133s）
// 钩子「千万不要放弃你的人生…第二道成长曲线」（两条曲线）→ 访问员问 → 大运来到生门 / 开门 / 值符：冲（印章）→ 十年大运没有空亡：冲（舞台）→ AI 一大把人没工作（B-roll）→ 看你怎么布局（罗盘）→ 四大步骤目录：定局 断局 布局 破局 → 有空亡补空亡 有坑补坑 → 只怕你不懂（聚光灯）→ CTA
import React from 'react';
import { Hero, Cutaway, HandCircle, Checklist, CircleStage, Seal, Flash, TopBanner, IndexPanel, LuopanRing, QuestionCard, Sfx } from '../SuyenContent';
import type { Cam } from '../SuyenContent';
import { EpShell, mkEp, epFrames, subsR, mkYAt, GrowthCurves } from './kit';
import FACE from '../suyenc-face-c56.json';
import CUT from '../suyenc-c56-subs.json';

const { ep, R } = mkEp('c56', CUT as any, FACE);
export const framesC56 = epFrames(CUT as any);

const SUBS: [string, number, number, number?][] = [
  ['你们千万不要放弃你的人生', 33.30, 35.90], ['你还可以找到', 35.94, 36.85], ['第二道成长曲线', 36.86, 39.60],
  ['那奇门盘', 40.48, 42.05], ['当你看到你的大运', 42.10, 44.70], ['来到生门、开门', 44.78, 47.40], ['或者是值符的位置', 47.54, 49.10], ['冲！', 49.18, 49.70],
  ['八字来到了你的十年大运', 50.66, 53.80], ['没有空亡', 53.84, 54.88], ['冲！', 54.90, 55.40],
  ['AI 来到了', 89.14, 90.28], ['一大把人没有工作 对不对', 90.30, 92.36], ['但是难道生存不了吗？', 92.38, 95.00],
  ['看你个人怎么战略', 95.54, 97.20], ['看看你个人的奇门盘', 97.24, 99.20], ['你的命理盘要如何去布局', 99.22, 101.85],
  ['我教书这么多年', 102.66, 104.80], ['我都教人家这四大步骤', 104.88, 107.30], ['第一 定局', 107.38, 109.00], ['断局', 112.74, 113.60], ['布局', 114.08, 114.80], ['还有最后一个 破局', 114.86, 117.10],
  ['我相信各位你想要的', 117.34, 119.70], ['其实就是布局跟破局', 119.74, 123.40], ['你的局能破', 123.48, 125.35], ['你怕什么？', 125.42, 126.05],
  ['有空亡补空亡', 126.08, 128.40], ['有坑补坑', 129.82, 131.35], ['只是怕你不懂', 131.54, 133.40],
];

export const SuyenC56: React.FC = () => {
  const CUTT = ep.dur, subs = subsR(R, SUBS as any);
  const shakes = [R(49.18), R(54.90), R(122.64)];
  const cam: Cam = { hits: [0.05, R(36.86), R(45.72), R(46.76), R(48.28), R(49.18), R(54.90), R(108.06), R(112.74), R(114.08), R(116.12), R(122.64)],
    pushes: [[R(117.34), R(123.40), 1.06], [R(123.48), R(126.05), 1.05]] };
  return (
    <EpShell ep={ep} subs={subs} cam={cam} shakes={shakes}
      behind={<>
        <Hero text="35+" at={0.08} until={R(36.80)} x={460} y={420} size={260} tone="cream" />
        <Hero text="冲" at={R(49.18)} until={R(49.70)} x={540} y={420} size={300} tone="rose" anim="呐喊声波" shake={[R(49.18)]} />
        <LuopanRing from={R(95.54)} to={R(101.85)} lock={R(101.50)} cx={540} cy={640} r={470} />
        <Hero text="布局" at={R(101.50)} until={R(101.85)} x={540} y={430} size={240} tone="cream" anim="呐喊声波" />
        <Hero text="破局" at={R(122.64)} until={R(123.40)} x={540} y={430} size={250} tone="rose" anim="呐喊声波" shake={[R(122.64)]} />
      </>}
      yAt={mkYAt([[R(40.48), R(49.70)], [R(126.08), R(131.35)]], [[0, R(39.60)], [R(50.66), R(55.40)], [R(89.14), R(95.00)]])}
      sfx={<>
        <Sfx at={R(35.94)} s="扫光" /><Sfx at={R(36.86)} s="叮" /><Sfx at={R(22.14)} s="综艺悬疑不对劲" />
        <Sfx at={R(40.48)} s="扫光音效4" />{[45.72, 46.76, 48.28].map((a, i) => <Sfx key={i} at={R(a)} s="综艺咚" />)}<Sfx at={R(49.18)} s="猛然一惊" />
        <Sfx at={R(50.66)} s="扫光" /><Sfx at={R(53.84)} s="叮" /><Sfx at={R(54.90)} s="综艺咚" />
        <Sfx at={R(89.14)} s="回忆-刷一下" /><Sfx at={R(92.38)} s="疑惑" /><Sfx at={R(95.54)} s="扫光" /><Sfx at={R(101.50)} s="叮" />
        <Sfx at={R(104.88)} s="纸张抖动声" />{[108.06, 112.74, 114.08, 116.12].map((a, i) => <Sfx key={`k${i}`} at={R(a)} s="综艺咚" />)}
        <Sfx at={R(122.64)} s="猛然一惊" /><Sfx at={R(127.52)} s="正确" /><Sfx at={R(130.84)} s="正确" /><Sfx at={R(131.54)} s="拍照声2" />
      </>}>
      <GrowthCurves at={R(33.30)} second={R(36.86)} until={R(39.60)} y={980} l1="现在的你" l2="第二曲线" />
      <QuestionCard at={R(25.96)} line2At={R(26.9)} until={R(28.70)} l1="中年人来到 40 岁" l2="盘和八字出现什么，明年可以冲？" />
      <TopBanner at={R(40.48)} until={CUTT} kicker="林舒苑老师 · 35 岁以上" title="第二道成长曲线" />
      <Seal text="生门" at={R(45.72)} until={R(49.70)} x={190} y={760} size={190} />
      <Seal text="开门" at={R(46.76)} until={R(49.70)} x={190} y={980} size={190} rot={4} />
      <Seal text="值符" at={R(48.28)} until={R(49.70)} x={190} y={1200} size={190} rot={-3} />
      <Flash at={R(49.18)} k={0.35} />
      <CircleStage ep={ep} from={R(50.66)} to={R(55.40)}>
        <Hero text="十年大运" at={R(51.24)} until={R(55.40)} x={300} y={1290} size={120} tone="cream" anim="呐喊声波" rotY={20} />
        <Hero text="冲！" at={R(54.90)} until={R(55.40)} x={790} y={1290} size={190} tone="navy" anim="呐喊声波" rotY={-20} />
      </CircleStage>
      <Cutaway ep={ep} src="i2_team" from={R(89.14)} to={R(95.00)} pipTopAt={R(89.5)} />
      <IndexPanel at={R(102.66)} until={CUTT} title="四大步骤" width={260} slots={[{ label: '定局', at: R(108.06) }, { label: '断局', at: R(112.74) }, { label: '布局', at: R(114.08) }, { label: '破局', at: R(116.12) }]} pulse={[R(104.88), R(107.30)]} />
      <Checklist at={R(126.08)} until={R(131.35)} title="局能破，你怕什么？" items={[{ text: '空亡 → 补空亡', at: R(127.52) }, { text: '有坑 → 补坑', at: R(130.84) }]} />
      <HandCircle ep={ep} at={R(131.54)} until={CUTT} label="怕你不懂" labelAt={R(133.08)} />
    </EpShell>
  );
};

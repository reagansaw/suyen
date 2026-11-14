// 内容⑫ 我做战略大会的初心：你的成功就是我的荣耀（C0059 3–97s）
// 钩子「你的成功就是我的荣耀」→ 访问员问初衷 → 2021 年开始做 → 名言卡 → 跟学生说的 3 句（清单）→ 掌握自己的命运（聚光灯）→ 我命由我不由天 → 先知道你那条命（不懂 = 乱来 故障字）→ 年尾给铁粉大纲（单据卡）→ 不迷茫 越走越宽（B-roll）→ 这就是我的初心（名言卡）→ CTA
import React from 'react';
import { Hero, Cutaway, HandCircle, Checklist, Glitch, TopBanner, QuestionCard, Sfx } from '../SuyenContent';
import type { Cam } from '../SuyenContent';
import { EpShell, mkEp, epFrames, subsR, mkYAt, QuoteCard, DocCard } from './kit';
import FACE from '../suyenc-face-c59a.json';
import CUT from '../suyenc-c59a-subs.json';

const { ep, R } = mkEp('c59a', CUT as any, FACE);
export const framesC59a = epFrames(CUT as any);

const SUBS: [string, number, number, number?][] = [
  ['你的成功', 18.16, 19.30], ['就是我的荣耀', 19.30, 20.45],
  ['我自从 2021 年', 6.74, 7.95], ['就开始做战略大会了', 7.98, 9.30],
  ['我有一句名言', 16.44, 17.45], ['你的成功', 18.16, 19.30, 1], ['就是我的荣耀', 19.30, 20.45, 1],
  ['然后另一句话', 22.32, 23.45], ['我一直跟我的学生说的', 23.84, 25.10], ['知命改运转好运', 25.32, 28.80], ['世界就在你脚下', 28.88, 30.45], ['做自己的主人吧', 30.52, 32.20],
  ['那最主要的 我希望可以', 36.66, 38.70], ['帮助人们掌握自己的命运', 38.78, 40.85], ['我命由我不由天', 41.92, 43.30],
  ['我命由我不由天的意思', 53.12, 55.10], ['就是说', 55.20, 55.65], ['知道你那条命是什么', 58.54, 60.55],
  ['如果你连你那条命是什么', 60.62, 62.65], ['你都不懂', 62.74, 63.35], ['你怎样去我命由我不由天', 63.38, 65.40], ['你简直就是乱来', 66.08, 67.20],
  ['因为每一年来到了年尾', 72.40, 75.05], ['我要给我的粉丝们', 75.10, 77.30], ['我的铁粉们', 77.44, 78.75],
  ['下一年的战略方向', 81.06, 83.95], ['我要给他们一个大纲', 84.06, 85.95],
  ['他们抓紧了我这个大纲', 86.76, 88.62], ['他们就不会迷茫', 88.64, 90.30], ['人生路越走越顺', 90.88, 92.45], ['越走越宽', 92.60, 94.00],
  ['这个就是我的初心', 94.22, 95.40], ['因为你的成功就是我的荣耀', 95.40, 97.45],
];

export const SuyenC59a: React.FC = () => {
  const CUTT = ep.dur, subs = subsR(R, SUBS as any);
  const shakes = [R(66.88)];
  const cam: Cam = { hits: [0.05, R(19.98), R(7.28), R(19.98, 1), R(28.22), R(30.06), R(31.94), R(42.36), R(66.88)],
    pushes: [[R(53.12), R(60.55), 1.06], [R(94.22), R(97.45), 1.06]] };
  return (
    <EpShell ep={ep} subs={subs} cam={cam} shakes={shakes}
      behind={<>
        <Hero text="荣耀" at={R(19.30)} until={R(20.45)} x={540} y={420} size={260} tone="rose" anim="呐喊声波" />
        <Hero text="2021" at={R(7.28)} until={R(9.30)} x={460} y={420} size={250} tone="cream" />
        <Hero text="由我" at={R(42.36)} until={R(43.30)} x={540} y={430} size={250} tone="cream" anim="呐喊声波" />
        <Hero text="知命" at={R(58.54)} until={R(60.55)} x={540} y={430} size={250} tone="rose" />
      </>}
      yAt={mkYAt([[R(25.32), R(32.20)], [R(81.06), R(85.95)]], [[0, R(20.45)], [R(16.44), R(20.45, 1)], [R(86.76), R(94.00)], [R(95.40), CUTT]])}
      sfx={<>
        <Sfx at={R(19.30)} s="综艺咚" /><Sfx at={R(3.14)} s="综艺悬疑轻敲" /><Sfx at={R(7.28)} s="咚" />
        <Sfx at={R(16.44)} s="扫光" /><Sfx at={R(19.30, 1)} s="叮" /><Sfx at={R(22.32)} s="纸张抖动声" />{[28.22, 30.06, 31.94].map((a, i) => <Sfx key={i} at={R(a)} s="正确" />)}
        <Sfx at={R(36.66)} s="拍照声2" /><Sfx at={R(39.58)} s="叮" /><Sfx at={R(42.36)} s="综艺咚" /><Sfx at={R(58.54)} s="咚" /><Sfx at={R(66.08)} s="故障音效" />
        <Sfx at={R(72.40)} s="扫光音效4" /><Sfx at={R(81.06)} s="纸张抖动声" /><Sfx at={R(86.76)} s="回忆-刷一下" /><Sfx at={R(94.22)} s="扫光" /><Sfx at={R(96.14)} s="叮" />
      </>}>
      <QuoteCard at={0.05} until={R(20.45)} text="你的成功，就是我的荣耀" y={980} size={68} typeDur={0.9} />
      <QuestionCard at={R(3.14)} line2At={R(4.66)} until={R(5.60)} l1="你做 2027 战略大会的" l2="初衷是什么？" />
      <TopBanner at={R(6.74)} until={CUTT} kicker="林舒苑老师 · 奇门战略大会" title="我的初心" />
      <QuoteCard at={R(16.44)} until={R(20.45, 1)} text="你的成功，就是我的荣耀" by="林舒苑" y={980} size={68} typeDur={0.9} />
      <Checklist at={R(22.32)} until={R(32.20)} title="我一直跟学生说" items={[{ text: '知命改运转好运', at: R(28.22) }, { text: '世界就在你脚下', at: R(30.06) }, { text: '做自己的主人', at: R(31.94) }]} />
      <HandCircle ep={ep} at={R(36.66)} until={R(40.85)} label="掌握命运" labelAt={R(39.58)} />
      <Glitch text="乱来" at={R(66.08)} until={R(67.20)} x={540} y={930} size={200} />
      <DocCard at={R(81.06)} until={R(85.95)} stampAt={1e9} head="林舒苑老师 · 给铁粉" title="下一年 · 战略大纲" rows={[['趋势', '一整年'], ['方向', '战略主题'], ['布局', '风水 · 充电']]} />
      <Cutaway ep={ep} src="intro_v2" from={R(86.76)} to={R(94.00)} pipTopAt={R(87.2)} />
      <QuoteCard at={R(95.40)} until={CUTT} text="你的成功，就是我的荣耀" by="林舒苑" y={980} size={68} typeDur={0.9} />
    </EpShell>
  );
};

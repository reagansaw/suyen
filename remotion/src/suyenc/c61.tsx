// 内容⑯ 2027 择日指南：好日子不会自动变成功（Promote Divination Guide 2027 两支合并 D2027：.2 = 0–167.77s，「2027」= +167.77s）
// 钩子「一个好的日子，不会自动把没准备好的事情变成成功」→ 新的一年挑好日子还是随便选？→ 学生问：选哪天开工/出行 → 需要判断能力（B-roll 岔路）→ 吉日不是只看日历（聚光灯 + 目录）→ 分清楚做什么事（开市/开工/签约/启动）→ 开年吉日皆好运 → 好彩头 + 行动计划 → CTA「正能量」
import React from 'react';
import { Hero, Cutaway, HandCircle, Checklist, Seal, Flash, TopBanner, IndexPanel, QuestionCard, Sfx } from '../SuyenContent';
import type { Cam } from '../SuyenContent';
import { EpShell, mkEp, epFrames, subsR, mkYAt } from './kit';
import FACE from '../suyenc-face-c61.json';
import CUT from '../suyenc-c61-subs.json';

const { ep, R } = mkEp('c61', CUT as any, FACE);
export const framesC61 = epFrames(CUT as any);

const V1 = 167.77;   // 第二支「2027」在 D2027 里的起点
const SUBS: [string, number, number, number?][] = [
  ['一个好的日子', 110.52, 112.06], ['不会自动把没准备好的事情', 112.12, 116.76], ['变成成功', 116.76, 117.60],
  ['新的一年 你会挑好日子', 1.24, 3.82], ['开工、开市', 3.94, 5.04], ['还是随便选一天呢？', 5.36, 7.82],
  ['每次到新年', 18.70, 19.98], ['很多人就会问我', 20.16, 21.22], ['老师 要选哪一天开工？', 21.48, 23.34], ['哪一天可以出行？', 25.40, 27.34],
  ['我们需要更多的判断能力', V1 + 31.34, V1 + 33.78], ['让我们想要获得的事情', V1 + 33.90, V1 + 36.02], ['落成现实', V1 + 36.02, V1 + 38.16],
  ['所谓的吉日', 72.68, 74.18], ['不是单纯看日历上', 74.56, 76.96], ['有没有一个「宜」字', 76.96, 78.46],
  ['而是我们还要分清楚', 79.96, 82.10], ['你准备做什么事情', 82.66, 84.64], ['举例：开市', 85.28, 86.82], ['开工 签约', 87.16, 88.24], ['还是启动重要项目', 88.24, 90.76],
  ['这些开年吉日皆好运', 141.56, 144.44],
  ['希望大家迎接新年的时候', 148.60, 151.56], ['既有好彩头', 151.56, 153.30], ['也有实际的行动计划', 153.30, 155.98],
];

export const SuyenC61: React.FC = () => {
  const CUTT = ep.dur, subs = subsR(R, SUBS as any);
  const IDX_OFF = R(88.24) + 1.0;
  const shakes = [R(112.12), R(116.76), R(141.56)];
  const cam: Cam = { hits: [0.05, R(112.12), R(116.76), R(1.24), R(21.48), R(V1 + 33.90), R(74.56), R(82.66), R(141.56), R(151.56)],
    pushes: [[R(112.12), R(117.60), 1.06], [R(148.60), R(155.98), 1.05]] };
  return (
    <EpShell ep={ep} subs={subs} cam={cam} shakes={shakes}
      behind={<>
        <Hero text="好日子" at={R(110.52)} until={R(112.06)} x={540} y={420} size={250} tone="cream" />
        <Hero text="不会" at={R(112.12)} until={R(114.60)} x={540} y={420} size={270} tone="rose" anim="呐喊声波" shake={[R(112.12)]} />
        <Hero text="成功？" at={R(116.76)} until={R(117.60)} x={540} y={430} size={260} tone="cream" anim="呐喊声波" shake={[R(116.76)]} />
        <Hero text="选哪天" at={R(21.48)} until={R(23.34)} x={540} y={420} size={240} tone="rose" />
        <Hero text="判断力" at={R(V1 + 33.90)} until={R(V1 + 38.16)} x={540} y={420} size={250} tone="cream" />
        <Hero text="开年吉日" at={R(141.56)} until={R(144.44)} x={540} y={420} size={210} tone="rose" anim="呐喊声波" shake={[R(141.56)]} />
      </>}
      yAt={mkYAt([[R(18.70), R(23.50)], [R(85.28), R(90.80)], [R(141.56), R(144.50)]], [[R(V1 + 31.34), R(V1 + 38.20)]])}
      sfx={<>
        <Sfx at={R(112.12)} s="猛然一惊" /><Sfx at={R(116.76)} s="咚" />
        <Sfx at={R(1.24)} s="扫光" /><Sfx at={R(18.70)} s="综艺悬疑不对劲" /><Sfx at={R(21.48)} s="综艺咚" />
        <Sfx at={R(V1 + 31.34)} s="回忆-刷一下" /><Sfx at={R(V1 + 33.90)} s="叮" />
        <Sfx at={R(72.68)} s="扫光" /><Sfx at={R(74.56)} s="疑惑" /><Sfx at={R(82.66)} s="拍照声2" />
        {[85.28, 87.16, 88.0, 88.9].map((a, i) => <Sfx key={i} at={R(a)} s="正确" />)}
        <Sfx at={R(141.56)} s="综艺咚" /><Sfx at={R(151.56)} s="啵1" /><Sfx at={R(153.30)} s="正确" />
      </>}>
      <Flash at={R(112.12)} color="#C8202E" k={0.35} />
      <TopBanner at={R(1.24)} until={R(72.50)} kicker="林舒苑老师 · 2027 择日指南" title="好日子怎么挑" />
      <QuestionCard at={R(18.70)} line2At={R(25.40)} until={R(27.60)} l1="老师，要选哪一天开工？" l2="哪一天可以出行？" />
      <Cutaway ep={ep} src="p2_fork" from={R(V1 + 31.34)} to={R(V1 + 38.20)} pipTopAt={R(V1 + 38.20)} />
      <TopBanner at={R(72.68)} until={R(90.85)} kicker="林舒苑老师 · 2027 择日指南" title="吉日不只看日历" />
      <IndexPanel at={R(72.68)} until={IDX_OFF} title="挑日子要看" width={350} slots={[{ label: '不只看日历', at: R(74.56) }, { label: '分清做什么事', at: R(82.66) }, { label: '时间 · 事情配合', at: R(88.24) }]} pulse={[R(72.68), R(74.56)]} />
      <HandCircle ep={ep} at={R(74.56)} until={R(78.46)} label="只看日历？" labelAt={R(76.96)} />
      <Checklist at={R(85.28)} until={R(90.80)} title="你准备做的是" items={[{ text: '开市', at: R(85.28) }, { text: '开工', at: R(87.16) }, { text: '签约', at: R(88.0) }, { text: '启动重要项目', at: R(88.9) }]} />
      <Seal text="吉日" at={R(141.56)} until={R(144.50)} x={190} y={900} size={190} />
    </EpShell>
  );
};

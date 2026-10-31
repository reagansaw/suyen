// 内容⑩ 真假混：我最担心小孩子和老一辈（C0057 542–679s）
// 钩子「真假混真的不是玩玩」（故障字）→ 真假混的年代 → 目录「我最担心」：小孩子 / 老一辈 → 不懂分辨（清单：霸凌 欺负 不对的人 不该看的）→ 老师乱讲 他们乱信 → 怎么办 → 35 岁的你夹在事业和孩子中间（舞台）→ 60 岁以上刚接触 AI · 刷短剧 · subscribe 给钱 → 遇到骗局（三只羊 B-roll）→ 包括你的家人 → CTA
import React from 'react';
import { Hero, Chip, Cutaway, HandCircle, Checklist, CircleStage, Glitch, TopBanner, IndexPanel, Sfx } from '../SuyenContent';
import type { Cam } from '../SuyenContent';
import { EpShell, mkEp, epFrames, subsR, mkYAt } from './kit';
import FACE from '../suyenc-face-c57c.json';
import CUT from '../suyenc-c57c-subs.json';

const { ep, R } = mkEp('c57c', CUT as any, FACE);
export const framesC57c = epFrames(CUT as any);

const SUBS: [string, number, number, number?][] = [
  ['所以真假混', 669.58, 670.90], ['真的不是玩玩', 670.92, 672.00],
  ['你看 来到了这样的年代', 542.30, 544.40], ['真假混的年代', 544.52, 545.50], ['我最担心的是小孩子', 547.16, 549.10],
  ['你想想他们活在这个年代', 570.02, 572.20], ['如果他们不懂得分辨', 572.24, 574.40],
  ['在学校遇到霸凌', 574.60, 576.00], ['在学校遇到欺负', 576.04, 577.50], ['上网遇到不对的人', 577.56, 579.60], ['上网看到一些不应该看的', 579.66, 582.30],
  ['或者去到学校', 582.88, 584.40], ['有些老师可能乱乱讲话', 584.44, 586.95], ['他们也乱乱的相信', 587.00, 588.40],
  ['这些弱小心灵的小孩子', 590.48, 592.30], ['怎么办？', 592.38, 592.85],
  ['而 35 岁的你', 592.94, 594.40], ['可能正在拼搏你的事业', 594.50, 596.20], ['你还去担心你的孩子', 598.02, 599.65],
  ['你知道现在老一辈的群组', 643.28, 645.00], ['我也很担心哦', 645.04, 646.20], ['60 岁以上的人', 646.24, 648.20],
  ['他们刚刚接触 AI', 648.42, 650.20], ['刚刚接触社交媒体', 650.30, 652.00], ['他们现在刷短剧 刷到傻掉', 652.66, 655.85],
  ['一直不断的 subscribe 给钱', 657.20, 659.40], ['然后在当中遇到骗局', 659.60, 662.30], ['人家莫名拿钱 他也给', 662.36, 665.50],
  ['今天我讲的', 672.06, 673.20], ['不仅仅是为了你自己', 673.24, 674.70], ['要拼搏事业', 674.74, 675.50], ['而是包括你的家人', 676.02, 678.60],
];

export const SuyenC57c: React.FC = () => {
  const CUTT = ep.dur, subs = subsR(R, SUBS as any);
  const IDX_OFF = R(646.24) + 1.0;
  const shakes = [R(670.10), R(592.38)];
  const cam: Cam = { hits: [0.05, R(670.10), R(544.52), R(548.70), R(575.60), R(587.72), R(592.38), R(646.24), R(661.86)],
    pushes: [[R(570.02), R(574.40), 1.06], [R(672.06), R(678.60), 1.06]] };
  const gray = (t: number) => (t >= R(590.48) && t < R(592.85) ? 0.85 : 0);
  return (
    <EpShell ep={ep} subs={subs} cam={cam} shakes={shakes} gray={gray}
      behind={<>
        <Hero text="不是玩玩" at={R(670.92)} until={R(672.00)} x={540} y={430} size={190} tone="rose" anim="呐喊声波" shake={[R(670.92)]} />
        <Hero text="小孩子" at={R(548.46)} until={R(549.10)} x={540} y={430} size={220} tone="cream" anim="呐喊声波" />
        <Hero text="怎么办？" at={R(592.38)} until={R(592.85)} x={540} y={430} size={210} tone="rose" anim="呐喊声波" />
        <Hero text="60+" at={R(646.24)} until={R(648.20)} x={460} y={420} size={270} tone="cream" />
      </>}
      yAt={mkYAt([[0, R(672.00)], [R(574.60), R(588.40)], [R(653.56), R(659.40)]], [[R(592.94), R(599.65)], [R(659.60), R(665.50)]])}
      sfx={<>
        <Sfx at={R(669.58)} s="故障音效" /><Sfx at={R(670.92)} s="猛然一惊" />
        <Sfx at={R(542.30)} s="扫光" /><Sfx at={R(544.52)} s="故障音效" /><Sfx at={R(548.46)} s="综艺咚" />
        <Sfx at={R(574.60)} s="纸张抖动声" />{[575.60, 577.10, 579.02, 581.50].map((a, i) => <Sfx key={i} at={R(a)} s="正确" />)}
        <Sfx at={R(587.72)} s="疑惑" /><Sfx at={R(590.48)} s="小孩哭泣声" vol={0.25} /><Sfx at={R(592.94)} s="扫光音效4" /><Sfx at={R(595.24)} s="咚" /><Sfx at={R(599.42)} s="咚" />
        <Sfx at={R(643.28)} s="回忆-刷一下" /><Sfx at={R(646.24)} s="综艺咚" /><Sfx at={R(653.56)} s="游戏点击音效" /><Sfx at={R(658.36)} s="超市电子钱柜结账" />
        <Sfx at={R(659.60)} s="回忆-刷一下" /><Sfx at={R(661.86)} s="综艺悬疑不对劲" /><Sfx at={R(672.06)} s="拍照声2" /><Sfx at={R(677.80)} s="叮" />
      </>}>
      <Glitch text="真假混" at={R(669.58)} until={R(672.00)} x={540} y={930} size={190} />
      <TopBanner at={R(542.30)} until={CUTT} kicker="林舒苑老师 · 2027 真假混" title="我最担心的两种人" />
      <IndexPanel at={R(542.30)} until={IDX_OFF} title="我最担心" width={270} slots={[{ label: '小孩子', at: R(548.70) }, { label: '老一辈', at: R(643.98) }]} pulse={[R(547.16), R(548.70)]} />
      <Checklist at={R(574.60)} until={R(582.30)} title="孩子会遇到……" items={[{ text: '霸凌', at: R(575.60) }, { text: '欺负', at: R(577.10) }, { text: '不对的人', at: R(579.02) }, { text: '不该看的', at: R(581.50) }]} />
      <Chip text="乱乱讲" at={R(585.50)} until={R(588.40)} x={260} y={900} tone="navy" size={66} rot={-4} />
      <Chip text="→ 乱乱信" at={R(587.72)} until={R(588.40)} x={320} y={1030} tone="rose" size={66} rot={3} />
      <CircleStage ep={ep} from={R(592.94)} to={R(599.65)}>
        <Hero text="事业" at={R(595.24)} until={R(599.65)} x={290} y={1290} size={180} tone="cream" anim="呐喊声波" rotY={20} />
        <Hero text="孩子" at={R(599.42)} until={R(599.65)} x={790} y={1290} size={180} tone="navy" anim="呐喊声波" rotY={-20} />
      </CircleStage>
      <Chip text="刷短剧" at={R(653.56)} until={R(655.85)} x={260} y={900} tone="navy" size={66} rot={-4} />
      <Chip text="subscribe 给钱" at={R(658.36)} until={R(659.40)} x={330} y={1020} tone="rose" size={58} rot={3} />
      <Cutaway ep={ep} src="" image="suyenc/sheep_trio.png" full from={R(659.60)} to={R(665.50)} />
      <Chip text="披着羊皮的狼" at={R(661.86)} until={R(665.45)} x={540} y={1300} tone="rose" size={56} rot={-2} />
      <HandCircle ep={ep} at={R(672.06)} until={CUTT} label="你的家人" labelAt={R(676.74)} />
    </EpShell>
  );
};

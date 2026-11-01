// 内容⑪ 2027 裁人还是请人？要不要扩充？（C0057 681–854s，访问员问两题）
// 钩子「明年千万不要淘汰人」→ 访问员问 → 上市公司雇佣战略家（名牌）→ 不要淘汰人 → 不要炒（印章）→ 不要因为 AI（B-roll）→ 时间点还没到 → 更需要人工监督 → 判断力（聚光灯）→ 最后谁指示？AI ⇄ 人 → 访问员第二题：扩充？→ yes and no → 天地人条件（清单盖「冲」）→ 没达成为什么冲 → 有危必有机 → CTA
import React from 'react';
import { Hero, Chip, Cutaway, HandCircle, Checklist, Seal, Flash, FlipPair, TopBanner, NameTag, QuestionCard, Sfx } from '../SuyenContent';
import type { Cam } from '../SuyenContent';
import { EpShell, mkEp, epFrames, subsR, mkYAt } from './kit';
import FACE from '../suyenc-face-c57d.json';
import CUT from '../suyenc-c57d-subs.json';

const { ep, R } = mkEp('c57d', CUT as any, FACE);
export const framesC57d = epFrames(CUT as any);

const SUBS: [string, number, number, number?][] = [
  ['明年', 711.64, 712.60], ['千万不要淘汰人', 712.66, 714.75],
  ['有好几家上市公司的', 699.98, 702.30], ['雇佣战略家', 702.34, 704.45],
  ['那我就告诉他们 我说', 709.28, 711.60], ['明年', 711.64, 712.60, 1], ['千万不要淘汰人', 712.66, 714.75, 1],
  ['不要炒', 715.08, 716.10], ['除非他真的没有用', 716.86, 718.25],
  ['不要因为 AI', 721.70, 723.20], ['不要因为科技', 723.28, 724.50], ['不可以', 729.40, 730.15], ['时间点还没到', 730.20, 731.45],
  ['他还更需要', 738.32, 739.95], ['人工的监督和监管', 740.18, 742.65], ['判断能力是最重要的', 743.80, 746.00],
  ['但是到最后', 798.28, 799.50], ['谁去指示？', 799.54, 800.50], ['还是人', 801.82, 802.50],
  ['这个问题是 yes and no', 813.64, 815.40],
  ['如果你天地人的条件', 821.98, 824.95], ['都已经达成了', 825.16, 826.30], ['Why not 冲着去', 826.38, 828.00],
  ['如果你天地人的条件', 829.32, 831.55], ['并没有达成 没有符合', 831.62, 833.85], ['那为什么你要冲？', 833.92, 835.55],
  ['危机嘛', 852.00, 852.95], ['有危必有机', 853.02, 854.30],
];

export const SuyenC57d: React.FC = () => {
  const CUTT = ep.dur, subs = subsR(R, SUBS as any);
  const shakes = [R(713.64), R(713.64, 1), R(827.58)];
  const cam: Cam = { hits: [0.05, R(713.64), R(701.14), R(713.64, 1), R(715.08), R(730.20), R(744.36), R(801.82), R(814.72), R(827.58), R(853.38)],
    pushes: [[R(738.32), R(742.65), 1.06], [R(829.32), R(835.55), 1.05]] };
  return (
    <EpShell ep={ep} subs={subs} cam={cam} shakes={shakes}
      behind={<>
        <Hero text="不要淘汰人" at={R(712.66)} until={R(714.75)} x={540} y={430} size={150} tone="rose" anim="呐喊声波" shake={[R(713.64)]} />
        <Hero text="上市公司" at={R(701.14)} until={R(704.45)} x={540} y={420} size={180} tone="cream" />
        <Hero text="不要淘汰人" at={R(712.66, 1)} until={R(714.75, 1)} x={540} y={430} size={150} tone="rose" anim="呐喊声波" shake={[R(713.64, 1)]} />
        <Hero text="还没到" at={R(730.82)} until={R(731.45)} x={540} y={430} size={220} tone="cream" anim="呐喊声波" />
        <Hero text="为什么要冲？" at={R(834.62)} until={R(835.55)} x={540} y={430} size={140} tone="rose" anim="呐喊声波" />
      </>}
      yAt={mkYAt([[0, R(714.75)], [R(699.98), R(704.45)], [R(715.08), R(718.25)], [R(798.28), R(802.50)], [R(813.64), R(815.40)], [R(821.98), R(828.00)], [R(852.00), CUTT]], [[R(721.70), R(724.50)]])}
      sfx={<>
        <Sfx at={R(712.66)} s="猛然一惊" /><Sfx at={R(681.08)} s="综艺悬疑不对劲" /><Sfx at={R(699.98)} s="扫光" /><Sfx at={R(701.14)} s="咚" />
        <Sfx at={R(713.64, 1)} s="综艺咚" /><Sfx at={R(715.08)} s="综艺咚" /><Sfx at={R(721.70)} s="回忆-刷一下" /><Sfx at={R(730.82)} s="咚" />
        <Sfx at={R(738.32)} s="扫光音效4" /><Sfx at={R(743.80)} s="拍照声2" /><Sfx at={R(744.36)} s="叮" />
        <Sfx at={R(798.28)} s="疑惑" /><Sfx at={R(801.82)} s="回忆-刷一下" /><Sfx at={R(805.44)} s="综艺悬疑不对劲" />
        <Sfx at={R(814.72)} s="啵1" /><Sfx at={R(815.28)} s="啵1" /><Sfx at={R(821.98)} s="纸张抖动声" />{[822.50, 822.88, 823.36].map((a, i) => <Sfx key={i} at={R(a)} s="正确" />)}
        <Sfx at={R(827.58)} s="猛然一惊" /><Sfx at={R(834.62)} s="综艺咚" /><Sfx at={R(853.38)} s="综艺咚" /><Sfx at={R(854.04)} s="综艺咚" />
      </>}>
      <Flash at={R(713.64)} k={0.35} />
      <QuestionCard at={R(681.08)} line2At={R(686.60)} until={R(689.30)} l1="2027 年，应该请更多人才" l2="还是淘汰人的时候？" />
      <TopBanner at={R(699.98)} until={R(805.40)} kicker="林舒苑老师 · 企业家问" title="2027 裁人还是请人？" />
      <NameTag at={R(699.98)} until={R(704.45)} />
      <Seal text="不要炒" at={R(715.08)} until={R(718.25)} x={190} y={920} size={210} />
      <Cutaway ep={ep} src="i2_team" from={R(721.70)} to={R(724.50)} pipTopAt={R(722.0)} />
      <Chip text="不要因为 AI 就炒人" at={R(722.68)} until={R(724.45)} x={360} y={1250} tone="rose" size={58} />
      <Chip text="人工监督 · 监管" at={R(740.18)} until={R(742.65)} x={330} y={940} tone="navy" size={62} />
      <HandCircle ep={ep} at={R(743.80)} until={R(746.00)} label="判断力" labelAt={R(744.36)} />
      <FlipPair a="AI" b="人" at={R(798.28)} flip={R(801.82)} until={R(802.50)} y={930} />
      <QuestionCard at={R(805.44)} line2At={R(809.24)} until={R(812.45)} l1="今年赚到钱的老板" l2="2027 应不应该扩充？" />
      <TopBanner at={R(805.44)} until={CUTT} kicker="林舒苑老师 · 企业家问" title="2027 要不要扩充？" />
      <Chip text="YES" at={R(814.72)} until={R(815.40)} x={300} y={920} tone="cream" size={90} rot={-5} />
      <Chip text="NO" at={R(815.28)} until={R(815.40)} x={560} y={960} tone="navy" size={90} rot={4} />
      <Checklist at={R(821.98)} until={R(828.00)} title="天 · 地 · 人 条件" items={[{ text: '天', at: R(822.50) }, { text: '地', at: R(822.88) }, { text: '人', at: R(823.36) }]} stamp="冲！" stampAt={R(827.58)} />
      <Flash at={R(827.58)} k={0.3} />
      <Seal text="危" at={R(853.38)} until={CUTT} x={200} y={900} size={190} />
      <Seal text="机" at={R(854.04)} until={CUTT} x={200} y={1120} size={190} rot={5} />
    </EpShell>
  );
};

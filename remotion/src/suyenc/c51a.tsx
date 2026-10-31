// 内容③ 真假混到底混在哪里？（C0051 0–74s）：香港汇款骗局故事
// 钩子「汇错人了」→ 2027 真假混混在哪里 → 48 国顾客 → 假 invoice → 汇去香港（B-roll）→ 汇错人 → 偷 letterhead 盖「假」→ 要提防 → scammer → 混水摸鱼 → CTA
import React from 'react';
import { Hero, Chip, Cutaway, HandCircle, Seal, Flash, Glitch, TopBanner, MysteryTiles, Sfx } from '../SuyenContent';
import type { Cam } from '../SuyenContent';
import { EpShell, mkEp, epFrames, subsR, mkYAt, DocCard } from './kit';
import FACE from '../suyenc-face-c51a.json';
import CUT from '../suyenc-c51a-subs.json';

const { ep, R } = mkEp('c51a', CUT as any, FACE);
export const framesC51a = epFrames(CUT as any);

const SUBS: [string, number, number, number?][] = [
  ['他汇了过去', 38.72, 39.54], ['发现到原来汇错银行', 39.54, 41.50], ['汇错人了', 41.50, 42.90],
  ['2027 年 真假混', 2.52, 4.40], ['其实到底是混在哪里？', 4.48, 6.25],
  ['上一个星期 我的这位顾客', 8.42, 11.30], ['他的生意做到全世界各国', 11.42, 14.40], ['差不多有 48 个国家', 14.42, 16.50],
  ['他其中一个顾客在菲律宾', 17.12, 21.00], ['他收到一张 payment invoice', 21.50, 23.70],
  ['那这时这个顾客呢', 26.30, 28.88], ['他就直接汇钱', 28.88, 30.40], ['去到一间银行', 30.54, 32.36], ['是在香港的', 32.36, 33.45],
  ['他汇了过去', 38.72, 39.54, 1], ['发现到原来汇错银行', 39.54, 41.50, 1], ['汇错人了', 41.50, 42.90, 1],
  ['就对方', 44.14, 45.40], ['就是偷了他的这个 letterhead', 46.04, 49.10], ['发过去', 49.12, 50.20],
  ['你看这种事件', 50.76, 52.24], ['是提醒了我们', 52.24, 53.48], ['在明年真假混的年代', 53.48, 55.40], ['要提防这一些', 55.44, 57.95],
  ['可能不是真实的', 59.22, 61.30], ['简称 scammer', 62.08, 63.88],
  ['所以他混在哪里？', 63.92, 65.86], ['混在明年', 65.86, 67.30], ['更多的有心人', 67.32, 69.70], ['会做这样的', 69.76, 71.05], ['混水摸鱼的事情', 71.10, 73.70],
];

export const SuyenC51a: React.FC = () => {
  const CUTT = ep.dur, subs = subsR(R, SUBS as any);
  const shakes = [R(41.50), R(41.50, 1), R(46.48), R(63.04)];
  const cam: Cam = { hits: [0.05, R(41.50), R(3.46), R(15.06), R(41.50, 1), R(46.92), R(63.04), R(71.10)],
    pushes: [[R(50.76), R(57.95), 1.07], [R(63.92), R(73.70), 1.06]] };
  const gray = (t: number) => (t >= R(38.72, 1) && t < R(42.90, 1) ? 0.9 : 0);
  return (
    <EpShell ep={ep} subs={subs} cam={cam} shakes={shakes} gray={gray}
      behind={<>
        <Hero text="汇错人" at={R(41.50)} until={R(42.90)} x={540} y={420} size={230} tone="rose" anim="呐喊声波" shake={[R(41.50)]} />
        <Hero text="2027" at={R(2.52)} until={R(3.40)} x={460} y={420} size={250} tone="cream" />
        <Hero text="混在哪？" at={R(4.48)} until={R(6.25)} x={540} y={430} size={190} tone="rose" anim="呐喊声波" />
        <Hero text="48 国" at={R(15.06)} until={R(16.50)} x={540} y={420} size={230} tone="cream" />
        <Hero text="汇错人" at={R(41.50, 1)} until={R(42.90, 1)} x={540} y={420} size={230} tone="rose" anim="呐喊声波" shake={[R(41.50, 1)]} />
        <Hero text="有心人" at={R(67.32)} until={R(69.70)} x={540} y={430} size={200} tone="cream" />
      </>}
      yAt={mkYAt([[0, R(42.90)], [R(21.50), R(23.70)], [R(44.14), R(50.20)], [R(62.08), R(63.88)], [R(71.10), CUTT]], [[R(26.30), R(33.45)], [R(50.76), R(57.95)]])}
      sfx={<>
        <Sfx at={R(41.50)} s="猛然一惊" /><Sfx at={R(2.52)} s="扫光" /><Sfx at={R(3.46)} s="综艺咚" /><Sfx at={R(4.48)} s="疑惑" />
        <Sfx at={R(15.06)} s="咚" /><Sfx at={R(21.50)} s="纸张抖动声" /><Sfx at={R(26.30)} s="回忆-刷一下" /><Sfx at={R(29.68)} s="超市电子钱柜结账" />
        <Sfx at={R(38.72, 1)} s="综艺悬疑不对劲" /><Sfx at={R(41.50, 1)} s="咚咚重音心头震" vol={0.4} />
        <Sfx at={R(44.14)} s="纸张抖动声" /><Sfx at={R(46.92)} s="综艺咚" /><Sfx at={R(50.76)} s="拍照声2" /><Sfx at={R(55.96)} s="叮" />
        <Sfx at={R(62.08)} s="故障音效" /><Sfx at={R(63.92)} s="扫光音效4" /><Sfx at={R(67.32)} s="咚" /><Sfx at={R(71.10)} s="综艺咚" />
      </>}>
      {/* 钩子：4 张问号牌 + 红闪 */}
      <MysteryTiles beats={[0.4, 0.55, 0.7, 0.85]} until={R(41.45)} y={980} />
      <Flash at={R(41.50)} color="#C8202E" k={0.45} />
      <TopBanner at={R(2.52)} until={CUTT} kicker="林舒苑老师 · 2027 真假混" title="到底混在哪里？" />
      {/* 假 invoice（先出现，还没盖章）*/}
      <DocCard at={R(21.50)} until={R(23.70)} stampAt={1e9} head="XX TRADING SDN BHD" title="PAYMENT INVOICE" rows={[['收款银行', '香港 ×××'], ['金额', 'USD ****'], ['寄件', '菲律宾顾客']]} />
      <Chip text="菲律宾" at={R(19.84)} until={R(21.45)} x={300} y={900} tone="navy" size={60} />
      {/* 汇钱去香港：B-roll，小卡右上 */}
      <Cutaway ep={ep} src="p2_loss" from={R(26.30)} to={R(33.45)} pipTopAt={R(26.70)} />
      <Chip text="香港银行？" at={R(32.36)} until={R(33.40)} x={330} y={1250} tone="rose" size={64} />
      {/* 偷 letterhead → 盖「假」*/}
      <DocCard at={R(44.14)} until={R(50.20)} stampAt={R(46.92)} head="XX TRADING SDN BHD" title="PAYMENT INVOICE" rows={[['Letterhead', '偷来的'], ['收款人', '不是你'], ['结果', '汇错人']]} />
      <HandCircle ep={ep} at={R(50.76)} until={R(57.95)} label="要提防" labelAt={R(55.96)} />
      <Glitch text="SCAMMER" at={R(62.08)} until={R(63.88)} x={540} y={930} size={150} />
      <Seal text="混水摸鱼" at={R(71.10)} until={CUTT} x={190} y={900} size={230} />
    </EpShell>
  );
};

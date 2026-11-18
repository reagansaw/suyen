// 内容⑦ 热锅上的蚂蚁：明年要注意的生肖 牛 · 狗 · 鼠（C0054 14–102s）
// 钩子「好比热锅上的蚂蚁，心很急」→ 访问员问 → 丁未年 天干火 地支土（舞台）→ 热锅蚂蚁（速度线）→ 目录「要注意的生肖」：①牛（牛羊冲 · 凶星大耗 · 破财）②狗（狗羊三刑 · 赔了夫人又折兵）③鼠 → 年月日时都算（B-roll）→ CTA
import React from 'react';
import { Hero, Chip, Cutaway, HandCircle, Checklist, CircleStage, Seal, Flash, TopBanner, IndexPanel, SpeedLines, QuestionCard, Sfx } from '../SuyenContent';
import type { Cam } from '../SuyenContent';
import { EpShell, mkEp, epFrames, subsR, mkYAt, ZodiacTiles } from './kit';
import FACE from '../suyenc-face-c54.json';
import CUT from '../suyenc-c54-subs.json';

const { ep, R } = mkEp('c54', CUT as any, FACE);
export const framesC54 = epFrames(CUT as any);

const SUBS: [string, number, number, number?][] = [
  ['就好比热锅上的蚂蚁', 40.70, 43.20], ['心很急', 43.28, 44.50], ['行动也很急', 44.54, 46.45],
  ['明年 丁未年', 28.62, 31.00], ['天干为火', 32.60, 33.95], ['地支为土', 34.10, 35.30], ['火照着土', 35.42, 37.04], ['地下起火', 37.04, 38.70], ['在土上面', 38.80, 40.55],
  ['第一', 51.54, 52.10], ['生肖牛的人要注意', 52.18, 54.95], ['因为牛跟羊', 54.96, 57.10],
  ['再加上明年又遇到', 57.64, 59.85], ['凶星大耗', 59.90, 61.55], ['就是一直花钱', 61.60, 62.70], ['破财破得不清不楚', 62.72, 64.75],
  ['第二', 65.76, 66.20], ['生肖狗的人', 66.28, 68.10], ['狗跟羊 遇到三刑', 68.38, 72.25],
  ['三刑就是说', 72.50, 73.05], ['赔了夫人又折兵', 73.06, 74.85], ['做的事情没人欣赏', 74.86, 76.50], ['还要被骂', 76.52, 77.65],
  ['第三', 88.06, 88.50], ['生肖老鼠的人', 88.52, 90.75],
  ['我讲的生肖', 94.64, 96.10], ['不仅仅是出现在你的年', 96.16, 99.00], ['可能出现在你的月、日、时', 99.02, 102.35],
];

export const SuyenC54: React.FC = () => {
  const CUTT = ep.dur, subs = subsR(R, SUBS as any);
  const IDX_OFF = R(90.75) + 0.6;
  const shakes = [R(44.00), R(62.72), R(77.22)];
  const cam: Cam = { hits: [0.05, R(42.90), R(44.00), R(29.64), R(33.78), R(35.20), R(53.60), R(62.72), R(67.58), R(71.20), R(89.76)],
    pushes: [[R(43.28), R(46.45), 1.08], [R(51.54), R(54.95), 1.05]] };
  return (
    <EpShell ep={ep} subs={subs} cam={cam} shakes={shakes}
      behind={<>
        <Hero text="蚂蚁" at={R(42.90)} until={R(43.80)} x={540} y={420} size={250} tone="cream" />
        <Hero text="急！" at={R(44.00)} until={R(46.45)} x={540} y={420} size={280} tone="rose" anim="呐喊声波" shake={[R(44.00), R(46.00)]} />
        <Hero text="丁未" at={R(29.64)} until={R(31.00)} x={460} y={420} size={250} tone="cream" />
        <Hero text="破财" at={R(62.72)} until={R(64.75)} x={540} y={430} size={250} tone="rose" anim="呐喊声波" shake={[R(62.72)]} />
      </>}
      yAt={mkYAt([[0, R(46.45)], [R(52.18), R(64.75)], [R(66.28), R(77.65)]], [[R(35.42), R(40.55)], [R(94.64), CUTT]])}
      sfx={<>
        <Sfx at={R(42.90)} s="咚" /><Sfx at={R(44.00)} s="猛然一惊" /><Sfx at={R(14.76)} s="综艺悬疑不对劲" />
        <Sfx at={R(28.62)} s="扫光" /><Sfx at={R(29.64)} s="咚" /><Sfx at={R(33.78)} s="综艺咚" /><Sfx at={R(35.20)} s="综艺咚" />
        <Sfx at={R(35.42)} s="扫光音效4" /><Sfx at={R(51.54)} s="综艺悬疑轻敲" />
        <Sfx at={R(53.60)} s="综艺咚" /><Sfx at={R(56.36)} s="啵1" /><Sfx at={R(59.90)} s="故障音效" /><Sfx at={R(62.72)} s="超市电子钱柜结账" />
        <Sfx at={R(67.58)} s="综艺咚" /><Sfx at={R(71.20)} s="咚" /><Sfx at={R(72.50)} s="纸张抖动声" />{[73.06, 75.60, 77.22].map((a, i) => <Sfx key={i} at={R(a)} s="正确" />)}
        <Sfx at={R(88.06)} s="拍照声2" /><Sfx at={R(89.76)} s="综艺咚" /><Sfx at={R(94.64)} s="回忆-刷一下" />
      </>}>
      <Flash at={R(44.00)} color="#C8202E" k={0.35} />
      <SpeedLines ep={ep} from={R(43.28)} to={R(46.45)} />
      <QuestionCard at={R(18.86)} line2At={R(19.9)} until={R(21.20)} l1="什么样的八字、什么盘的人" l2="明年很容易错失机会？" />
      <TopBanner at={R(28.62)} until={R(51.40)} kicker="林舒苑老师 · 2027 丁未年" title="热锅上的蚂蚁" />
      <Seal text="火" at={R(33.78)} until={R(35.30)} x={190} y={900} size={190} />
      <Seal text="土" at={R(35.20)} until={R(35.40)} x={190} y={1130} size={190} rot={4} />
      <CircleStage ep={ep} from={R(35.42)} to={R(40.55)}>
        <Hero text="火" at={R(35.42)} until={R(40.55)} x={300} y={1290} size={200} tone="cream" anim="呐喊声波" rotY={20} />
        <Hero text="土" at={R(36.82)} until={R(40.55)} x={780} y={1290} size={200} tone="navy" anim="呐喊声波" rotY={-20} />
      </CircleStage>
      <TopBanner at={R(51.54)} until={CUTT} kicker="林舒苑老师 · 2027 丁未年" title="这 3 个生肖要注意" />
      <IndexPanel at={R(51.54)} until={IDX_OFF} title="要注意的生肖" width={260} slots={[{ label: '牛', at: R(53.60) }, { label: '狗', at: R(67.58) }, { label: '鼠', at: R(89.76) }]} pulse={[R(51.54), R(53.60)]} />
      <ZodiacTiles at={R(54.96)} until={R(59.85)} y={830} size={190} items={[{ ch: '牛', zhi: '丑', at: R(55.40) }, { ch: '羊', zhi: '未', at: R(56.36), tag: '冲', tagAt: R(56.36) }]} />
      <Chip text="凶星大耗" at={R(59.90)} until={R(62.70)} x={290} y={900} tone="navy" size={66} />
      <Chip text="一直花钱" at={R(61.60)} until={R(62.70)} x={300} y={1020} tone="rose" size={60} rot={3} />
      <ZodiacTiles at={R(68.38)} until={R(72.25)} y={830} size={190} items={[{ ch: '狗', zhi: '戌', at: R(68.38) }, { ch: '羊', zhi: '未', at: R(69.52), tag: '三刑', tagAt: R(71.20) }]} />
      <Checklist at={R(72.50)} until={R(77.65)} title="三刑 = " items={[{ text: '赔了夫人又折兵', at: R(73.06) }, { text: '没人欣赏', at: R(75.60) }, { text: '还要被骂', at: R(77.22) }]} />
      <HandCircle ep={ep} at={R(88.06)} until={R(90.75)} label="生肖鼠" labelAt={R(89.76)} />
      <Cutaway ep={ep} src="ep1_yearchart" from={R(94.64)} to={CUTT} pipTopAt={IDX_OFF + 0.2} />
      <Chip text="年 · 月 · 日 · 时" at={R(99.02)} until={CUTT} x={340} y={1250} tone="cream" size={62} />
    </EpShell>
  );
};

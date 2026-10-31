// 广告第 2–14 集（16:9 · 每集 ≤60 秒 · 1.1 倍速）。⚠ 这个档案是 pipeline/gen_eps.py 产生的，不要手改，改产生器再重跑
// 结构照第 1 集：钩子 + 教方法 → 我们是谁（C0037 + 照片墙）→ CTA；只用 C0001–C0048；名字一律「林舒苑」
import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from 'remotion';
import { Frame, Hero, Cutaway, NameTag, PhotoWall, Sfx, Seal, Luopan, Luoshu, Slip, Incense, House, InkVig, InkBrush, Flare, Embers, OPEN_DROP, OPEN_DONG, fastToSlow, useT, win, ease, eio, f, clamp, regEp, LTH, CREAM } from './SuyenHooksE';
import { interpolate } from 'remotion';
import type { Cam, Grade } from './SuyenHooksE';
import FC_EP2 from './suyenh-face-ep2.json';
import TK_EP2 from './suyenh-track-ep2.json';
import FC_EP3 from './suyenh-face-ep3.json';
import TK_EP3 from './suyenh-track-ep3.json';
import FC_EP4 from './suyenh-face-ep4.json';
import TK_EP4 from './suyenh-track-ep4.json';
import FC_EP5 from './suyenh-face-ep5.json';
import TK_EP5 from './suyenh-track-ep5.json';
import FC_EP6 from './suyenh-face-ep6.json';
import TK_EP6 from './suyenh-track-ep6.json';
// B-roll 还没生成（studio 还没 Run）时的占位卡：分镜检查图上看得到这段要放什么
const Ph: React.FC<{ label: string }> = ({ label }) => (
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, #3A2A18 0%, #120E0A 75%)', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ border: '3px dashed rgba(232,199,126,0.7)', padding: '36px 56px', maxWidth: 1200, textAlign: 'center', fontFamily: LTH, color: CREAM, fontSize: 46, lineHeight: 1.5 }}>
      <div style={{ fontSize: 30, letterSpacing: '0.3em', color: '#E8C77E', marginBottom: 14 }}>B-ROLL 待生成</div>{label}
    </div>
  </AbsoluteFill>
);
// 全画面 B-roll，没有圆框：CTA-2（C0039）那段原片只有 logo 墙、没有人，圆框里没人可跟
const Shot: React.FC<{ src: string; from: number; to: number; bg?: React.ReactNode; cont?: boolean; last?: boolean }> = ({ src, from, to, bg, cont, last = true }) => {
  const t = useT();
  if (t < from - 0.01 || t > to) return null;
  const o = win(t, from, to, cont ? 0.001 : 0.2, last ? 0.2 : 0.001), k = 1.02 + 0.06 * ease(t, from, to - from, eio);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Sequence from={f(from)} durationInFrames={Math.max(1, f(to - from))} layout="none">
        <AbsoluteFill style={{ transform: `scale(${k})` }}>{bg ?? <OffthreadVideo src={staticFile(`suyenbr/${src}.mp4`)} muted playbackRate={Math.min(1, 5.9 / (to - from))} />}</AbsoluteFill>
      </Sequence>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 75% 80% at 50% 45%, rgba(0,0,0,0) 55%, rgba(10,8,6,0.45) 100%)' }} />
    </AbsoluteFill>
  );
};

/* ================= 第 2 集（52.44 秒）================= */
regEp('ep2', 52.44, FC_EP2, TK_EP2);
const PH2: [string, number, number, string][] = [['suyen-1', 31.87, 33.3, '16 年'], ['G_fengshui_training-Qimen1', 33.3, 35.56, '千多场课程'], ['G_qimendunjia_training1', 35.56, 37.72, '几万个学员'], ['G_masterSuyenLim_qm1', 37.72, 39.21, '来自世界各地'], ['G_masterSuyenLim_CNY_Program-1', 39.21, 41.88, '上市公司 · 大家族 · 小家庭']];
export const SuyenEp2: React.FC = () => {
  const cam: Cam = { hits: [1.07, 1.27, 2.85, 8.09, 8.36, 16.44, 27.83, 41.88, 43.02, 50.81], pushes: [[7.98, 9.45, 1.05]], origin: '48% 30%' };
  const grade: Grade = () => [1, 1, 0];
  return (
    <Frame id="ep2" cam={cam} grade={grade} dust={16.44}
      behind={<>
        <Hero text="翻" at={1.07} until={2.8} x={560} y={240} size={340} dur={0.32} glow={0.6} />
        <Hero text="身？" at={1.27} until={2.8} x={1400} y={240} size={340} dur={0.32} glow={0.6} />
        <Hero text="20" at={8.09} until={9.4} x={520} y={220} size={340} ls={0.06} glow={0.5} />
        <Hero text="27" at={8.36} until={9.4} x={1260} y={220} size={340} ls={0.06} glow={0.5} />
        <Hero text="奇门遁甲战略大会" at={16.44} until={18.81} x={960} y={150} size={120} ls={0.12} glow={0.5} />
      </>}
      front={<>
        <Hero text="赔掉" at={2.85} until={5.15} x={960} y={640} size={64} ls={0.3} rotY={0} rotX={18} anim="呐喊声波" />
        <Hero text="6 位数" at={3.69} until={4.29} x={960} y={790} size={150} ls={0.04} rotY={0} rotX={18} anim="呐喊声波" />
        <Hero text="7 位数" at={4.31} until={5.15} x={960} y={790} size={150} ls={0.04} rotY={0} rotX={18} tone="red" anim="呐喊声波" />
        <Cutaway id="ep2" src="p2_loss" from={5.15} to={7.88} focus={[990, 430]} bg={<Ph label="p2_loss：老板深夜看着一片红的跌势屏幕，抱头（演员）" />} />
        <InkVig from={5.15} to={7.88} />
        <Hero text="浪费" at={5.42} until={7.86} x={330} y={320} size={200} tone="cream" anim="呐喊声波" />
        <Hero text="一整年" at={6.29} until={7.86} x={360} y={590} size={200} tone="red" dur={0.36} anim="呐喊声波" />
        <Seal text="真" at={9.45} until={10.65} x={1420} y={560} size={130} rot={-6} />
        <Seal text="假" at={9.69} until={10.65} x={1580} y={600} size={130} rot={4} />
        <Seal text="混" at={10.11} until={10.65} x={1740} y={560} size={130} rot={-3} />
        <Cutaway id="ep2" src="p2_fork" from={10.65} to={16.39} focus={[990, 430]} bg={<Ph label="p2_fork：山路分岔：左边金色日出的路、右边断崖暗雾（没有人）" />} />
        <Hero text="翻倍转机？" at={12.24} until={16.37} x={400} y={400} size={120} anim="呐喊声波" />
        <Hero text="血本无归？" at={14.96} until={16.37} x={400} y={620} size={120} tone="red" anim="呐喊声波" />
        <Cutaway id="ep2" src="ep1_yearchart" from={18.81} to={25.2} focus={[990, 430]} last={false} />
        <Cutaway id="ep2" src="ep1_dh_point" from={25.2} to={27.83} focus={[990, 430]} cont />
        <Hero text="机会" at={20.51} until={22.97} x={380} y={460} size={130} anim="呐喊声波" />
        <Hero text="风险" at={21.56} until={22.97} x={380} y={660} size={130} tone="red" anim="呐喊声波" />
        <Hero text="看全局" at={23.02} until={25.2} x={400} y={460} size={130} anim="呐喊声波" />
        <Hero text="定进退" at={24.3} until={25.2} x={400} y={660} size={130} anim="呐喊声波" />
        <Hero text="先布局" at={25.3} until={27.83} x={400} y={460} size={130} anim="呐喊声波" />
        <Hero text="再投入" at={26.54} until={27.83} x={400} y={660} size={130} anim="呐喊声波" />
        <Flare at={1.07} k={0.6} /><Flare at={7.88} /><Flare at={16.44} k={0.5} />
        <NameTag at={28.82} until={31.77} x={1280} y={640} light />
        <Cutaway id="ep2" src="" from={31.87} to={41.88} focus={[990, 430]} bg={<PhotoWall shots={PH2} base={31.87} />} />
        {PH2.map(([, a, b, label]) => <Hero key={a} text={label} at={a + 0.15} until={b} x={690} y={110} size={label.length > 6 ? 70 : 96} ls={0.12} anim="呐喊声波" />)}
        <Shot src="ep1_yearchart" from={41.88} to={43.95} last={false} />
        <Shot src="ep1_horse_goat_h" from={43.95} to={46.62} cont last={false} />
        <Shot src="goat_positive" from={46.62} to={50.31} cont last={false} />
        <Shot src="ep1_dh_point" from={50.31} to={53.04} cont />
        <Hero text="3 天 · 完全免费" at={41.93} until={43.95} x={960} y={330} size={150} ls={0.1} glow={0.5} />
        <Hero text="奇门战略大会" at={43.02} until={43.95} x={960} y={600} size={110} ls={0.14} rule />
        <Hero text="看清 2027 趋势" at={45.2} until={46.62} x={1380} y={230} size={104} anim="呐喊声波" />
        <Hero text="企业家" at={47.07} until={50.31} x={380} y={430} size={120} anim="呐喊声波" />
        <Hero text="更精准的方向" at={49.41} until={50.31} x={470} y={620} size={100} anim="呐喊声波" />
        <Hero text="马上报名" at={50.81} until={53.04} x={1380} y={800} size={150} ls={0.2} glow={0.6} />
        <Flare at={41.88} k={0.5} /><Flare at={50.81} k={0.55} />
      </>}
      sfx={<>
        {OPEN_DROP}
        <Sfx at={1.04} s="咚" />
        <Sfx at={1.24} s="综艺咚" />
        <Sfx at={2.82} s="咚咚重音心头震" />
        <Sfx at={3.64} s="复古胶片滚动" len={0.6} />
        <Sfx at={4.28} s="叮收银机提示音1" />
        <Sfx at={5.1} s="回忆-刷一下" />
        <Sfx at={5.25} s="诡异的滴水声" />
        <Sfx at={6.26} s="咚咚重音心头震" />
        <Sfx at={7.86} s="闪回" />
        <Sfx at={8.06} s="咚" />
        <Sfx at={8.33} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={9.42} s="木鱼敲击回响音效" />
        <Sfx at={9.66} s="木鱼敲击回响音效" />
        <Sfx at={10.08} s="木鱼敲击回响音效" />
        <Sfx at={10.6} s="旋风" />
        <Sfx at={12.21} s="综艺咚" />
        <Sfx at={14.93} s="咚咚重音心头震" />
        <Sfx at={16.39} s="咚" />
        <Sfx at={18.76} s="回忆-刷一下" />
        <Sfx at={20.48} s="叮提示音4" />
        <Sfx at={21.53} s="叮提示音4" />
        <Sfx at={22.99} s="叮提示音4" />
        <Sfx at={24.27} s="叮提示音4" />
        <Sfx at={25.15} s="扫光" />
        <Sfx at={25.27} s="木鱼敲击回响音效" />
        <Sfx at={26.51} s="木鱼敲击回响音效" />
        <Sfx at={27.78} s="闪回" />
        <Sfx at={28.79} s="一声响铃" />
        <Sfx at={31.82} s="回忆-刷一下" />
        {PH2.slice(1).map(([, a]) => <Sfx key={a} at={a - 0.03} s="扫光音效4" />)}
        <Sfx at={41.83} s="闪回" />
        <Sfx at={41.9} s="综艺咚" />
        <Sfx at={42.99} s="咚" />
        <Sfx at={43.9} s="旋风" />
        <Sfx at={45.17} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={46.57} s="亮一下" />
        <Sfx at={47.04} s="正确" />
        <Sfx at={49.38} s="正确" />
        <Sfx at={50.26} s="闪回" />
        <Sfx at={50.78} s="叮收银机提示音1" />
        <Sfx at={52.01} s="亮一下" />
      </>}
      subs={[['以为抓到翻身的机会', 0.05, 2.25], ['结果赔掉 6 位数、7 位数', 2.25, 5.15], ['还浪费一整年的时间', 5.15, 7.93], ['那 2027 年', 7.93, 9.4], ['真假混', 9.4, 10.7], ['眼前到底是翻倍的转机', 10.7, 13.66], ['还是会让你血本无归的危机？', 13.66, 16.39], ['奇门遁甲战略大会', 16.39, 18.62], ['我会从年盘拆解机会和风险', 18.62, 22.25], ['带你看全局，定进退', 22.25, 25.25], ['先布局，再投入', 25.25, 27.83], ['大家好，我是林舒苑', 27.83, 29.42], ['您的人生战略导师', 29.42, 31.06], ['我在过去 16 年培训超过千多场课程', 31.06, 34.79], ['也帮助过几万个学员', 34.79, 36.88], ['来自于世界各地', 36.88, 39.06], ['从上市公司、大家族到小家庭', 39.06, 41.88], ['三天完全免费的战略大会', 41.88, 44.05], ['如果你想要看清 2027 年趋势', 44.05, 46.27], ['你是一个企业家', 46.27, 47.81], ['你是一个要更精准的方向的人', 47.81, 50.41], ['你一定要马上报名', 50.41, 51.63], ['我们到时见！', 51.63, 53.04]]}
    />
  );
};

/* ================= 第 3 集（56.58 秒）================= */
regEp('ep3', 56.58, FC_EP3, TK_EP3);
const PH3: [string, number, number, string][] = [['suyen-1', 36.01, 37.44, '16 年'], ['G_fengshui_training-Qimen1', 37.44, 39.7, '千多场课程'], ['G_qimendunjia_training1', 39.7, 41.86, '几万个学员'], ['G_masterSuyenLim_qm1', 41.86, 43.35, '来自世界各地'], ['G_masterSuyenLim_CNY_Program-1', 43.35, 46.02, '上市公司 · 大家族 · 小家庭']];
export const SuyenEp3: React.FC = () => {
  const cam: Cam = { hits: [0.07, 3.87, 5.25, 6.62, 9.38, 14.25, 14.56, 15.63, 27.85, 31.97, 46.02, 47.16, 54.95], pushes: [[8.02, 14.25, 1.04]], origin: '48% 30%' };
  const grade: Grade = () => [1, 1, 0];
  return (
    <Frame id="ep3" cam={cam} grade={grade} dust={15.63}
      behind={<>
        <Hero text="企业家们" at={0.07} until={3.77} x={960} y={170} size={220} ls={0.1} glow={0.6} />
        <Hero text="扩张？" at={3.87} until={7.9} x={400} y={240} size={170} />
        <Hero text="产品？" at={5.25} until={7.9} x={1500} y={240} size={170} />
        <Hero text="人才？" at={6.62} until={7.9} x={1500} y={520} size={170} />
        <Hero text="20" at={14.25} until={15.58} x={500} y={220} size={340} ls={0.06} glow={0.5} />
        <Hero text="27" at={14.56} until={15.58} x={1340} y={220} size={340} ls={0.06} glow={0.5} />
        <Hero text="奇门遁甲战略大会" at={15.63} until={17.18} x={960} y={150} size={120} ls={0.12} glow={0.5} />
      </>}
      front={<>
        <Cutaway id="ep3" src="p3_bet" from={7.92} to={13.77} focus={[990, 430]} bg={<Ph label="p3_bet：老板把一整叠金币推上赌桌的一格，金币塔垮掉（演员）" />} />
        <InkVig from={7.92} to={13.77} />
        <Seal text="押错" at={9.38} until={13.75} x={420} y={330} size={190} rot={-6} />
        <Hero text="赔回去" at={12.24} until={13.75} x={400} y={680} size={150} tone="red" anim="呐喊声波" />
        <Cutaway id="ep3" src="p3_scale" from={17.18} to={27.7} focus={[990, 430]} bg={<Ph label="p3_scale：数字人 Suyen 在天平一边放金砝码、一边放玉盾（正能量）" />} />
        <Hero text="机会" at={19.47} until={20.94} x={380} y={460} size={130} anim="呐喊声波" />
        <Hero text="风险" at={20.48} until={20.94} x={380} y={660} size={130} tone="red" anim="呐喊声波" />
        <Hero text="高回酬" at={22.38} until={24.64} x={400} y={460} size={130} anim="呐喊声波" />
        <Hero text="背后的代价" at={23.39} until={24.64} x={470} y={660} size={110} tone="red" anim="呐喊声波" />
        <Hero text="进攻" at={25.86} until={27.7} x={380} y={460} size={130} anim="呐喊声波" />
        <Hero text="防守" at={26.79} until={27.7} x={380} y={660} size={130} anim="呐喊声波" />
        <Hero text="守住成绩" at={27.85} until={31.97} x={960} y={680} size={110} ls={0.2} rotY={0} rotX={18} anim="呐喊声波" />
        <Hero text="再争高峰" at={29.43} until={31.97} x={960} y={830} size={130} ls={0.2} rotY={0} rotX={18} anim="呐喊声波" />
        <Flare at={0.07} k={0.5} /><Flare at={13.77} /><Flare at={15.63} k={0.5} /><Flare at={29.43} k={0.4} />
        <NameTag at={32.96} until={35.91} x={1280} y={640} light />
        <Cutaway id="ep3" src="" from={36.01} to={46.02} focus={[990, 430]} bg={<PhotoWall shots={PH3} base={36.01} />} />
        {PH3.map(([, a, b, label]) => <Hero key={a} text={label} at={a + 0.15} until={b} x={690} y={110} size={label.length > 6 ? 70 : 96} ls={0.12} anim="呐喊声波" />)}
        <Shot src="ep1_yearchart" from={46.02} to={48.09} last={false} />
        <Shot src="ep1_horse_goat_h" from={48.09} to={50.76} cont last={false} />
        <Shot src="goat_positive" from={50.76} to={54.45} cont last={false} />
        <Shot src="ep1_dh_point" from={54.45} to={57.18} cont />
        <Hero text="3 天 · 完全免费" at={46.07} until={48.09} x={960} y={330} size={150} ls={0.1} glow={0.5} />
        <Hero text="奇门战略大会" at={47.16} until={48.09} x={960} y={600} size={110} ls={0.14} rule />
        <Hero text="看清 2027 趋势" at={49.33} until={50.76} x={1380} y={230} size={104} anim="呐喊声波" />
        <Hero text="企业家" at={51.21} until={54.45} x={380} y={430} size={120} anim="呐喊声波" />
        <Hero text="更精准的方向" at={53.55} until={54.45} x={470} y={620} size={100} anim="呐喊声波" />
        <Hero text="马上报名" at={54.95} until={57.18} x={1380} y={800} size={150} ls={0.2} glow={0.6} />
        <Flare at={46.02} k={0.5} /><Flare at={54.95} k={0.55} />
      </>}
      sfx={<>
        {OPEN_DONG}
        <Sfx at={3.84} s="综艺咚" />
        <Sfx at={5.22} s="综艺咚" />
        <Sfx at={6.59} s="综艺咚" />
        <Sfx at={7.87} s="回忆-刷一下" />
        <Sfx at={9.35} s="木鱼敲击回响音效" />
        <Sfx at={12.21} s="咚咚重音心头震" />
        <Sfx at={13.75} s="闪回" />
        <Sfx at={14.22} s="咚" />
        <Sfx at={14.53} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={15.58} s="咚" />
        <Sfx at={17.13} s="回忆-刷一下" />
        <Sfx at={19.44} s="叮提示音4" />
        <Sfx at={20.45} s="叮提示音4" />
        <Sfx at={22.35} s="叮提示音4" />
        <Sfx at={25.83} s="木鱼敲击回响音效" />
        <Sfx at={26.76} s="木鱼敲击回响音效" />
        <Sfx at={27.65} s="闪回" />
        <Sfx at={27.82} s="正确" />
        <Sfx at={29.4} s="亮一下" />
        <Sfx at={31.92} s="闪回" />
        <Sfx at={32.93} s="一声响铃" />
        <Sfx at={35.96} s="回忆-刷一下" />
        {PH3.slice(1).map(([, a]) => <Sfx key={a} at={a - 0.03} s="扫光音效4" />)}
        <Sfx at={45.97} s="闪回" />
        <Sfx at={46.04} s="综艺咚" />
        <Sfx at={47.13} s="咚" />
        <Sfx at={48.04} s="旋风" />
        <Sfx at={49.3} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={50.71} s="亮一下" />
        <Sfx at={51.18} s="正确" />
        <Sfx at={53.52} s="正确" />
        <Sfx at={54.4} s="闪回" />
        <Sfx at={54.92} s="叮收银机提示音1" />
        <Sfx at={56.15} s="亮一下" />
      </>}
      subs={[['企业家们', 0.05, 1.17], ['你今年赚到的钱', 1.17, 2.73], ['明年要拿去扩张、投资产品', 2.73, 5.64], ['还是扎人才呢？', 5.64, 7.92], ['那最怕一次的押错', 7.92, 10.11], ['把今年所赚的利润赔回去', 10.11, 13.77], ['那 2027 年', 13.77, 15.58], ['奇门遁甲战略大会', 15.58, 17.43], ['我会用年盘来拆解机会与风险', 17.43, 20.94], ['带你审视高回酬背后的代价', 20.94, 24.64], ['提前规划进攻与防守', 24.64, 27.75], ['守住你的成绩', 27.75, 29.38], ['再争下一个高峰', 29.38, 31.97], ['大家好，我是林舒苑', 31.97, 33.56], ['您的人生战略导师', 33.56, 35.2], ['我在过去 16 年培训超过千多场课程', 35.2, 38.93], ['也帮助过几万个学员', 38.93, 41.02], ['来自于世界各地', 41.02, 43.2], ['从上市公司、大家族到小家庭', 43.2, 46.02], ['三天完全免费的战略大会', 46.02, 48.19], ['如果你想要看清 2027 年趋势', 48.19, 50.41], ['你是一个企业家', 50.41, 51.95], ['你是一个要更精准的方向的人', 51.95, 54.55], ['你一定要马上报名', 54.55, 55.77], ['我们到时见！', 55.77, 57.18]]}
    />
  );
};

/* ================= 第 4 集（51.08 秒）================= */
regEp('ep4', 51.08, FC_EP4, TK_EP4);
const PH4: [string, number, number, string][] = [['suyen-1', 30.51, 31.94, '16 年'], ['G_fengshui_training-Qimen1', 31.94, 34.2, '千多场课程'], ['G_qimendunjia_training1', 34.2, 36.36, '几万个学员'], ['G_masterSuyenLim_qm1', 36.36, 37.85, '来自世界各地'], ['G_masterSuyenLim_CNY_Program-1', 37.85, 40.52, '上市公司 · 大家族 · 小家庭']];
export const SuyenEp4: React.FC = () => {
  const cam: Cam = { hits: [0.07, 0.51, 3.69, 9.63, 13.92, 26.47, 40.52, 41.66, 49.45], pushes: [[9.63, 13.92, 1.05]], origin: '48% 30%' };
  const grade: Grade = () => [1, 1, 0];
  return (
    <Frame id="ep4" cam={cam} grade={grade} dust={13.92}
      behind={<>
        <Hero text="20" at={0.07} until={1.22} x={470} y={220} size={340} ls={0.06} glow={0.5} />
        <Hero text="27" at={0.51} until={1.22} x={1310} y={220} size={340} ls={0.06} glow={0.5} />
        <Hero text="攻？" at={3.69} until={5.15} x={430} y={260} size={220} glow={0.5} />
        <Hero text="还是守？" at={4.56} until={5.15} x={1480} y={280} size={150} tone="cream" />
        <Hero text="下一笔钱" at={9.63} until={13.87} x={1480} y={250} size={140} />
        <Hero text="扎哪里？" at={12.48} until={13.87} x={1480} y={480} size={150} tone="red" />
        <Hero text="奇门遁甲战略大会" at={13.92} until={15.27} x={960} y={150} size={120} ls={0.12} glow={0.5} />
      </>}
      front={<>
        <Cutaway id="ep4" src="p4_bills" from={5.15} to={9.53} focus={[990, 430]} bg={<Ph label="p4_bills：小老板一个人坐在空办公室，桌上一叠催缴信封，手机一直亮（演员）" />} />
        <InkVig from={5.15} to={9.53} />
        <Hero text="薪水" at={7.18} until={9.51} x={380} y={400} size={130} tone="cream" anim="呐喊声波" />
        <Hero text="租金" at={7.65} until={9.51} x={380} y={580} size={130} tone="cream" anim="呐喊声波" />
        <Hero text="追到门口" at={8.4} until={9.51} x={440} y={770} size={120} tone="red" anim="呐喊声波" />
        <Cutaway id="ep4" src="ep1_yearchart" from={15.27} to={21.51} focus={[990, 430]} last={false} />
        <Cutaway id="ep4" src="p4_burn" from={21.51} to={26.47} focus={[990, 430]} bg={<Ph label="p4_burn：金属盘里的钞票烧成灰，最后火被一只金色罗盘盖住熄掉（没有人）" />} cont />
        <Hero text="年度趋势" at={17.41} until={18.58} x={420} y={430} size={130} anim="呐喊声波" />
        <Luoshu at={18.63} shatter={999} until={21.51} x={420} y={470} cell={110} />
        <Hero text="投入的次序" at={20.3} until={21.51} x={440} y={770} size={104} anim="呐喊声波" />
        <Embers from={24.05} to={26.47} />
        <Hero text="现金" at={24.35} until={26.47} x={380} y={460} size={150} tone="cream" anim="呐喊声波" />
        <Hero text="被烧光" at={25.61} until={26.47} x={420} y={680} size={150} tone="red" anim="呐喊声波" />
        <Flare at={0.07} k={0.5} /><Flare at={9.53} /><Flare at={13.92} k={0.5} />
        <NameTag at={27.46} until={30.41} x={1280} y={640} light />
        <Cutaway id="ep4" src="" from={30.51} to={40.52} focus={[990, 430]} bg={<PhotoWall shots={PH4} base={30.51} />} />
        {PH4.map(([, a, b, label]) => <Hero key={a} text={label} at={a + 0.15} until={b} x={690} y={110} size={label.length > 6 ? 70 : 96} ls={0.12} anim="呐喊声波" />)}
        <Shot src="ep1_yearchart" from={40.52} to={42.59} last={false} />
        <Shot src="ep1_horse_goat_h" from={42.59} to={45.26} cont last={false} />
        <Shot src="goat_positive" from={45.26} to={48.95} cont last={false} />
        <Shot src="ep1_dh_point" from={48.95} to={51.68} cont />
        <Hero text="3 天 · 完全免费" at={40.57} until={42.59} x={960} y={330} size={150} ls={0.1} glow={0.5} />
        <Hero text="奇门战略大会" at={41.66} until={42.59} x={960} y={600} size={110} ls={0.14} rule />
        <Hero text="看清 2027 趋势" at={43.83} until={45.26} x={1380} y={230} size={104} anim="呐喊声波" />
        <Hero text="企业家" at={45.71} until={48.95} x={380} y={430} size={120} anim="呐喊声波" />
        <Hero text="更精准的方向" at={48.05} until={48.95} x={470} y={620} size={100} anim="呐喊声波" />
        <Hero text="马上报名" at={49.45} until={51.68} x={1380} y={800} size={150} ls={0.2} glow={0.6} />
        <Flare at={40.52} k={0.5} /><Flare at={49.45} k={0.55} />
      </>}
      sfx={<>
        {OPEN_DROP}
        <Sfx at={0.04} s="咚" />
        <Sfx at={0.48} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={3.66} s="咚" />
        <Sfx at={4.53} s="综艺咚" />
        <Sfx at={5.1} s="回忆-刷一下" />
        <Sfx at={5.25} s="诡异的滴水声" />
        <Sfx at={7.15} s="咚咚重音心头震" />
        <Sfx at={7.62} s="咚咚重音心头震" />
        <Sfx at={8.37} s="猛然一惊" />
        <Sfx at={9.48} s="闪回" />
        <Sfx at={9.6} s="综艺咚" />
        <Sfx at={12.45} s="疑惑" />
        <Sfx at={13.87} s="咚" />
        <Sfx at={15.22} s="回忆-刷一下" />
        <Sfx at={17.38} s="叮提示音4" />
        <Sfx at={18.63} s="叮叮" />
        <Sfx at={20.27} s="木鱼敲击回响音效" />
        <Sfx at={21.46} s="旋风" />
        <Sfx at={24.32} s="咚" />
        <Sfx at={25.58} s="咚咚重音心头震" />
        <Sfx at={26.42} s="闪回" />
        <Sfx at={27.43} s="一声响铃" />
        <Sfx at={30.46} s="回忆-刷一下" />
        {PH4.slice(1).map(([, a]) => <Sfx key={a} at={a - 0.03} s="扫光音效4" />)}
        <Sfx at={40.47} s="闪回" />
        <Sfx at={40.54} s="综艺咚" />
        <Sfx at={41.63} s="咚" />
        <Sfx at={42.54} s="旋风" />
        <Sfx at={43.8} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={45.21} s="亮一下" />
        <Sfx at={45.68} s="正确" />
        <Sfx at={48.02} s="正确" />
        <Sfx at={48.9} s="闪回" />
        <Sfx at={49.42} s="叮收银机提示音1" />
        <Sfx at={50.65} s="亮一下" />
      </>}
      subs={[['2027 年', 0.05, 1.22], ['从奇门角度', 1.22, 2.45], ['你的生意应该攻还是守？', 2.45, 5.15], ['订单还没收到钱', 5.15, 7.13], ['薪水租金已经追到门口', 7.13, 9.53], ['下一笔钱还能不能扎？', 9.53, 11.94], ['应该扎在哪里？', 11.94, 13.75], ['那奇门遁甲战略大会', 13.75, 15.52], ['我会用年盘来拆解年度的趋势', 15.52, 18.58], ['带你重新审视投入的次序', 18.58, 21.61], ['别让生意还没等到突破', 21.61, 24.3], ['现金已经被烧光', 24.3, 26.47], ['大家好，我是林舒苑', 26.47, 28.06], ['您的人生战略导师', 28.06, 29.7], ['我在过去 16 年培训超过千多场课程', 29.7, 33.43], ['也帮助过几万个学员', 33.43, 35.52], ['来自于世界各地', 35.52, 37.7], ['从上市公司、大家族到小家庭', 37.7, 40.52], ['三天完全免费的战略大会', 40.52, 42.69], ['如果你想要看清 2027 年趋势', 42.69, 44.91], ['你是一个企业家', 44.91, 46.45], ['你是一个要更精准的方向的人', 46.45, 49.05], ['你一定要马上报名', 49.05, 50.27], ['我们到时见！', 50.27, 51.68]]}
    />
  );
};

/* ================= 第 5 集（54.73 秒）================= */
regEp('ep5', 54.73, FC_EP5, TK_EP5);
const PH5: [string, number, number, string][] = [['suyen-1', 34.15, 35.58, '16 年'], ['G_fengshui_training-Qimen1', 35.58, 37.84, '千多场课程'], ['G_qimendunjia_training1', 37.84, 40.01, '几万个学员'], ['G_masterSuyenLim_qm1', 40.01, 41.5, '来自世界各地'], ['G_masterSuyenLim_CNY_Program-1', 41.5, 44.16, '上市公司 · 大家族 · 小家庭']];
export const SuyenEp5: React.FC = () => {
  const cam: Cam = { hits: [0.07, 0.56, 2.45, 3.02, 3.53, 19.87, 30.11, 44.16, 45.31, 53.1], pushes: [[4.42, 7.77, 1.05]], origin: '48% 30%' };
  const grade: Grade = () => [1, 1, 0];
  return (
    <Frame id="ep5" cam={cam} grade={grade} dust={19.87}
      behind={<>
        <Hero text="20" at={0.07} until={2.4} x={520} y={220} size={340} ls={0.06} glow={0.5} />
        <Hero text="27" at={0.56} until={2.4} x={1400} y={220} size={340} ls={0.06} glow={0.5} />
        <Seal text="真" at={2.45} until={4.37} x={1420} y={330} size={140} rot={-6} />
        <Seal text="假" at={3.02} until={4.37} x={1590} y={380} size={140} rot={4} />
        <Seal text="混" at={3.53} until={4.37} x={1760} y={330} size={140} rot={-3} />
        <Luopan at={5.08} until={7.77} x={1500} y={430} r={300} spin={fastToSlow(160, 10)} />
        <Hero text="奇门战略大会" at={19.87} until={20.99} x={960} y={150} size={130} ls={0.14} glow={0.5} />
      </>}
      front={<>
        <Cutaway id="ep5" src="p5_plea" from={7.77} to={15.49} focus={[990, 430]} bg={<Ph label="p5_plea：昏暗走廊，一个男人抓住老板的手臂求救，老板手里握着公司支票簿犹豫（演员）" />} />
        <InkVig from={7.77} to={15.49} />
        <Hero text="别人求救" at={7.87} until={12.6} x={400} y={420} size={130} tone="cream" anim="呐喊声波" />
        <Hero text="拿公司的钱？" at={9.98} until={12.6} x={470} y={620} size={120} tone="red" anim="呐喊声波" />
        <Slip text="只有你能帮我" at={13.15} until={15.49} x={300} y={120} w={150} h={640} size={78} />
        <Hero text="赔上" at={16.55} until={19.82} x={960} y={640} size={64} ls={0.3} rotY={0} rotX={18} anim="呐喊声波" />
        <Hero text="整个团队的薪水" at={17.56} until={19.82} x={960} y={790} size={120} ls={0.06} rotY={0} rotX={18} tone="red" anim="呐喊声波" />
        <Cutaway id="ep5" src="p5_line" from={20.99} to={30.11} focus={[990, 430]} bg={<Ph label="p5_line：数字人 Suyen 用金笔在桌上划一道金线，把棋子分成两边（正能量）" />} />
        <Hero text="先看代价" at={24.72} until={30.11} x={430} y={420} size={120} anim="呐喊声波" />
        <Hero text="划清界限" at={26.58} until={30.11} x={430} y={600} size={120} anim="呐喊声波" />
        <Hero text="再决定出手" at={28.12} until={30.11} x={470} y={780} size={110} anim="呐喊声波" />
        <Flare at={0.07} k={0.5} /><Flare at={15.49} /><Flare at={19.87} k={0.5} />
        <NameTag at={31.11} until={34.05} x={1280} y={640} light />
        <Cutaway id="ep5" src="" from={34.15} to={44.16} focus={[990, 430]} bg={<PhotoWall shots={PH5} base={34.15} />} />
        {PH5.map(([, a, b, label]) => <Hero key={a} text={label} at={a + 0.15} until={b} x={690} y={110} size={label.length > 6 ? 70 : 96} ls={0.12} anim="呐喊声波" />)}
        <Shot src="ep1_yearchart" from={44.16} to={46.23} last={false} />
        <Shot src="ep1_horse_goat_h" from={46.23} to={48.9} cont last={false} />
        <Shot src="goat_positive" from={48.9} to={52.6} cont last={false} />
        <Shot src="ep1_dh_point" from={52.6} to={55.33} cont />
        <Hero text="3 天 · 完全免费" at={44.21} until={46.23} x={960} y={330} size={150} ls={0.1} glow={0.5} />
        <Hero text="奇门战略大会" at={45.31} until={46.23} x={960} y={600} size={110} ls={0.14} rule />
        <Hero text="看清 2027 趋势" at={47.48} until={48.9} x={1380} y={230} size={104} anim="呐喊声波" />
        <Hero text="企业家" at={49.35} until={52.6} x={380} y={430} size={120} anim="呐喊声波" />
        <Hero text="更精准的方向" at={51.7} until={52.6} x={470} y={620} size={100} anim="呐喊声波" />
        <Hero text="马上报名" at={53.1} until={55.33} x={1380} y={800} size={150} ls={0.2} glow={0.6} />
        <Flare at={44.16} k={0.5} /><Flare at={53.1} k={0.55} />
      </>}
      sfx={<>
        {OPEN_DONG}
        <Sfx at={0.53} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={2.42} s="木鱼敲击回响音效" />
        <Sfx at={2.99} s="木鱼敲击回响音效" />
        <Sfx at={3.5} s="木鱼敲击回响音效" />
        <Sfx at={5.06} s="发条声" len={1.6} />
        <Sfx at={7.72} s="回忆-刷一下" />
        <Sfx at={7.84} s="猛然一惊" />
        <Sfx at={9.95} s="咚咚重音心头震" />
        <Sfx at={13.12} s="纸张抖动声" />
        <Sfx at={15.44} s="闪回" />
        <Sfx at={16.52} s="咚" />
        <Sfx at={17.53} s="咚咚重音心头震" />
        <Sfx at={19.82} s="咚" />
        <Sfx at={20.94} s="回忆-刷一下" />
        <Sfx at={24.69} s="正确" />
        <Sfx at={26.55} s="正确" />
        <Sfx at={28.09} s="木鱼敲击回响音效" />
        <Sfx at={30.06} s="闪回" />
        <Sfx at={31.08} s="一声响铃" />
        <Sfx at={34.1} s="回忆-刷一下" />
        {PH5.slice(1).map(([, a]) => <Sfx key={a} at={a - 0.03} s="扫光音效4" />)}
        <Sfx at={44.11} s="闪回" />
        <Sfx at={44.18} s="综艺咚" />
        <Sfx at={45.28} s="咚" />
        <Sfx at={46.18} s="旋风" />
        <Sfx at={47.45} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={48.85} s="亮一下" />
        <Sfx at={49.32} s="正确" />
        <Sfx at={51.67} s="正确" />
        <Sfx at={52.55} s="闪回" />
        <Sfx at={53.07} s="叮收银机提示音1" />
        <Sfx at={54.3} s="亮一下" />
      </>}
      subs={[['2027 年年度局势', 0.05, 2.4], ['真假混', 2.4, 4.37], ['有一种局你尤其要想清楚', 4.37, 7.77], ['别人求救', 7.77, 9.31], ['你要不要拿公司的钱去救呢？', 9.31, 12.6], ['一句「只有你能够帮到我」', 12.6, 15.4], ['可能会让你赔上整个团队的薪水', 15.4, 19.35], ['这一次的奇门战略大会', 19.35, 21.24], ['我会从年度格局来谈风险', 21.24, 24.67], ['带你先看代价', 24.67, 26.53], ['划清界限，再决定出手', 26.53, 30.11], ['大家好，我是林舒苑', 30.11, 31.71], ['您的人生战略导师', 31.71, 33.34], ['我在过去 16 年培训超过千多场课程', 33.34, 37.07], ['也帮助过几万个学员', 37.07, 39.16], ['来自于世界各地', 39.16, 41.34], ['从上市公司、大家族到小家庭', 41.34, 44.16], ['三天完全免费的战略大会', 44.16, 46.33], ['如果你想要看清 2027 年趋势', 46.33, 48.55], ['你是一个企业家', 48.55, 50.1], ['你是一个要更精准的方向的人', 50.1, 52.7], ['你一定要马上报名', 52.7, 53.92], ['我们到时见！', 53.92, 55.33]]}
    />
  );
};

/* ================= 第 6 集（58.21 秒）================= */
regEp('ep6', 58.21, FC_EP6, TK_EP6);
const PH6: [string, number, number, string][] = [['suyen-1', 29.45, 30.88, '16 年'], ['G_fengshui_training-Qimen1', 30.88, 33.14, '千多场课程'], ['G_qimendunjia_training1', 33.14, 35.3, '几万个学员'], ['G_masterSuyenLim_qm1', 35.3, 36.79, '来自世界各地'], ['G_masterSuyenLim_CNY_Program-1', 36.79, 39.45, '上市公司 · 大家族 · 小家庭']];
export const SuyenEp6: React.FC = () => {
  const cam: Cam = { hits: [0.58, 4.8, 7.78, 9.73, 10.96, 13.49, 14.11, 15.8, 25.41, 41.07, 55.45], pushes: [[1.45, 3.71, 1.08], [12.35, 14.06, 1.12]], origin: '48% 30%' };
  const grade: Grade = (t) => { const k = t < 14.67 ? interpolate(t, [14.11, 14.42], [0, 0.85], clamp) : interpolate(t, [14.67, 14.97], [0.85, 0], clamp); return [1 - 0.22 * k, 1, k]; };
  return (
    <Frame id="ep6" cam={cam} grade={grade} dust={15.8}
      behind={<>
        <Hero text="20" at={0.07} until={1.45} x={630} y={220} size={340} ls={0.06} dur={0.4} glow={0.5} />
        <Hero text="27" at={0.58} until={1.45} x={1350} y={220} size={340} ls={0.06} dur={0.35} glow={0.5} />
        <Luopan at={1.38} until={3.73} x={1035} y={470} r={430} spin={fastToSlow(200, 8)} />
        <Hero text="全家的退路" at={4.8} until={7.12} x={1520} y={290} size={120} rule />
        <Hero text="一笔" at={7.15} until={9.7} x={1530} y={340} size={300} dur={0.4} glow={0.5} />
        <Hero text="奇门战略大会" at={15.8} until={16.95} x={960} y={150} size={130} ls={0.14} glow={0.5} />
        <Hero text="3 天 · 完全免费" at={41.07} until={46.05} x={960} y={150} size={120} ls={0.1} glow={0.5} />
        <Hero text="2027 奇门战略大会" at={43.35} until={46.05} x={420} y={440} size={84} ls={0.08} rule />
        <Hero text="马上报名" at={55.45} until={58.81} x={960} y={160} size={150} ls={0.2} glow={0.6} />
      </>}
      front={<>
        <House at={3.76} road={5.55} until={7.12} x={560} y={300} />
        <Cutaway id="ep6" src="p6_points" from={9.73} to={14.67} focus={[1035, 520]} />
        <NameTag at={0.68} until={3.71} x={110} y={640} />
        <Slip text="孩子学费" at={9.73} until={14.67} x={1460} y={30} fall={14.11} w={130} h={420} size={68} />
        <Slip text="父母养老" at={10.96} until={14.67} x={1640} y={30} fall={14.17} w={130} h={420} size={68} />
        <Slip text="十年储蓄" at={13.49} until={14.67} x={1820} y={30} fall={14.14} w={130} h={420} size={68} />
        <InkVig from={8.76} to={9.75} k={0.7} />
        <InkVig from={14.11} to={14.97} k={0.85} />
        <Flare at={0.07} k={0.5} /><Flare at={7.15} k={0.45} />
        <Cutaway id="ep6" src="p6_family" from={16.95} to={25.41} focus={[990, 430]} bg={<Ph label="p6_family：三代同堂在温暖的家里吃饭，窗外是金色灯光（演员，正能量）" />} />
        <Hero text="真假混的" at={19.07} until={22.98} x={420} y={430} size={110} anim="呐喊声波" />
        <Hero text="年度趋势" at={20.55} until={22.98} x={420} y={610} size={120} anim="呐喊声波" />
        <Hero text="提前思考" at={23.03} until={25.41} x={420} y={430} size={120} anim="呐喊声波" />
        <Hero text="进退" at={24.4} until={25.41} x={380} y={620} size={150} anim="呐喊声波" />
        <NameTag at={26.4} until={29.35} x={1280} y={640} light />
        <Cutaway id="ep6" src="" from={29.45} to={39.45} focus={[990, 430]} bg={<PhotoWall shots={PH6} base={29.45} />} />
        {PH6.map(([, a, b, label]) => <Hero key={a} text={label} at={a + 0.15} until={b} x={690} y={110} size={label.length > 6 ? 70 : 96} ls={0.12} anim="呐喊声波" />)}
        <Cutaway id="ep6" src="ep1_horse_goat_h" from={48.41} to={50.79} focus={[990, 430]} last={false} />
        <Cutaway id="ep6" src="goat_positive" from={50.79} to={54.71} focus={[990, 430]} cont />
        <Hero text="赤马红羊年" at={48.76} until={50.79} x={1400} y={230} size={110} tone="red" anim="呐喊声波" />
        <Hero text="抓准趋势" at={51.34} until={54.71} x={360} y={460} size={104} anim="呐喊声波" />
        <Hero text="落实结果" at={53.02} until={54.71} x={360} y={620} size={104} anim="呐喊声波" />
      </>}
      sfx={<>
        {OPEN_DONG}
        <Sfx at={0.56} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={1.43} s="闪回" /><Sfx at={1.55} s="发条声" len={1.6} />
        <Sfx at={3.74} s="回忆-刷一下" />
        <Sfx at={4.78} s="呼2" />
        <Sfx at={6.33} s="空灵的水滴声" />
        <Sfx at={7.13} s="咚" />
        <Sfx at={8.76} s="综艺悬疑沙锤长" />
        {[9.73, 10.96, 13.49].map((x) => <Sfx key={x} at={x - 0.02} s="纸张抖动声" />)}
        <Sfx at={12.31} s="旋风" />
        <Sfx at={14.08} s="咚咚重音心头震" /><Sfx at={14.12} s="水滴回响声音效" />
        <Sfx at={14.62} s="闪回" />
        <Sfx at={15.75} s="咚" />
        <Sfx at={16.9} s="亮一下" />
        <Sfx at={19.04} s="叮提示音4" />
        <Sfx at={20.52} s="叮提示音4" />
        <Sfx at={23.0} s="正确" />
        <Sfx at={24.37} s="木鱼敲击回响音效" />
        <Sfx at={25.36} s="闪回" />
        <Sfx at={26.37} s="一声响铃" />
        <Sfx at={29.4} s="回忆-刷一下" />
        {PH6.slice(1).map(([, a]) => <Sfx key={a} at={a - 0.03} s="扫光音效4" />)}
        <Sfx at={39.41} s="闪回" />
        <Sfx at={41.04} s="综艺咚" />
        <Sfx at={43.32} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={48.36} s="旋风" />
        <Sfx at={48.76} s="咚咚重音心头震" />
        <Sfx at={50.76} s="亮一下" />
        <Sfx at={51.31} s="正确" />
        <Sfx at={52.99} s="正确" />
        <Sfx at={54.66} s="闪回" />
        <Sfx at={55.42} s="综艺咚" />
        <Sfx at={56.75} s="亮一下" />
      </>}
      subs={[['2027 年', 0.05, 1.38], ['你的奇门战略布局', 1.38, 3.7], ['有没有把全家的退路算进去？', 3.7, 7.06], ['一笔的投入', 7.06, 8.7], ['动的可能是', 8.7, 9.7], ['孩子的学费', 9.7, 10.88], ['父母的养老', 10.88, 12.29], ['还有可能是你十年的储蓄', 12.29, 14.67], ['这一次的奇门战略大会', 14.67, 17.2], ['我会从年盘来解读真假混的年度趋势', 17.2, 21.47], ['带你提前思考进退', 21.47, 25.41], ['大家好，我是林舒苑', 25.41, 27.0], ['您的人生战略导师', 27.0, 28.64], ['我在过去 16 年培训超过千多场课程', 28.64, 32.36], ['也帮助过几万个学员', 32.36, 34.45], ['来自于世界各地', 34.45, 36.64], ['从上市公司、大家族到小家庭', 36.64, 39.45], ['我为大家准备了三天完全免费的', 39.45, 43.27], ['2027 年奇门战略大会', 43.27, 46.05], ['你在 2027 年那么混乱的', 46.05, 48.66], ['赤马红羊年的年代', 48.66, 50.75], ['依然抓准趋势', 50.75, 52.89], ['落实你想要的结果', 52.89, 54.71], ['那么马上报名', 54.71, 56.8], ['我们到时见！', 56.8, 58.81]]}
    />
  );
};

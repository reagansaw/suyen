// 广告第 2–14 集（16:9 · 每集 ≤60 秒 · 1.1 倍速）。⚠ 这个档案是 pipeline/gen_eps.py 产生的，不要手改，改产生器再重跑
// 结构照第 1 集：钩子 + 教方法 → 我们是谁（C0037 + 照片墙）→ CTA；只用 C0001–C0048；名字一律「林舒苑」
import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from 'remotion';
import { Frame, Hero, Cutaway, NameTag, EventLogo, PhotoBG, PhotoWall, Sfx, Seal, Luopan, Luoshu, Slip, Incense, House, InkVig, InkBrush, Flare, Embers, OPEN_DROP, OPEN_DONG, fastToSlow, useT, win, ease, eio, f, clamp, regEp, LTH, CREAM } from './SuyenHooksE';
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
import FC_EP9 from './suyenh-face-ep9.json';
import TK_EP9 from './suyenh-track-ep9.json';
import FC_EP10 from './suyenh-face-ep10.json';
import TK_EP10 from './suyenh-track-ep10.json';
import FC_EP11 from './suyenh-face-ep11.json';
import TK_EP11 from './suyenh-track-ep11.json';
import FC_EP12 from './suyenh-face-ep12.json';
import TK_EP12 from './suyenh-track-ep12.json';
import FC_EP13 from './suyenh-face-ep13.json';
import TK_EP13 from './suyenh-track-ep13.json';
import FC_EP14 from './suyenh-face-ep14.json';
import TK_EP14 from './suyenh-track-ep14.json';
import FC_EP15 from './suyenh-face-ep15.json';
import TK_EP15 from './suyenh-track-ep15.json';
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

/* ================= 第 2 集（54.88 秒）================= */
regEp('ep2', 54.88, FC_EP2, TK_EP2);
const PH2: [string, number, number, string][] = [['hd-hall_seated', 31.87, 33.3, '16 年'], ['hd-QiMen_Training1', 33.3, 34.68, '千多场课程'], ['hd-fengshui_training-Qimen1', 35.56, 37.16, '几万个学员'], ['hd-masterSuyenLim_qm1', 37.72, 39.21, '来自世界各地'], ['hd-family_group', 39.21, 40.57, '上市公司 大家族 小家庭']];
export const SuyenEp2: React.FC = () => {
  const cam: Cam = { hits: [1.07, 1.27, 2.85, 8.09, 8.36, 16.44, 27.83, 43.5, 49.49], pushes: [[7.98, 9.45, 1.05]], origin: '48% 30%', shrink: [[31.87, 34.68, 0], [35.56, 37.16, 0], [37.72, 40.57, 0]] };
  const grade: Grade = () => [1, 1, 0];
  return (
    <Frame id="ep2" cam={cam} grade={grade} dust={16.44}
      behind={<>
        <Hero text="翻" at={1.07} until={2.8} x={560} y={240} size={340} dur={0.32} glow={0.6} />
        <Hero text="身？" at={1.27} until={2.8} x={1400} y={240} size={340} dur={0.32} glow={0.6} />
        <Hero text="20" at={8.09} until={9.4} x={520} y={220} size={340} ls={0.06} glow={0.5} />
        <Hero text="27" at={8.36} until={9.4} x={1260} y={220} size={340} ls={0.06} glow={0.5} />
        <Hero text="奇门遁甲战略大会" at={16.44} until={18.81} x={960} y={150} size={120} ls={0.12} glow={0.5} />
        <PhotoBG shots={PH2} />
        {PH2.map(([, a, b, label]) => <Hero key={a} text={label} at={a + 0.15} until={b} x={960} y={150} size={label.length > 6 ? 110 : 170} ls={0.12} anim="呐喊声波" />)}
        <Hero text="3 天完全免费" at={43.5} until={48.74} x={960} y={150} size={120} ls={0.1} glow={0.5} />
        <Hero text="2027 奇门战略大会" at={46.04} until={48.74} x={420} y={440} size={84} ls={0.08} rule />
        <Hero text="马上报名" at={49.49} until={55.48} x={960} y={160} size={150} ls={0.2} glow={0.6} />
        <EventLogo at={48.74} until={55.48} />
      </>}
      front={<>
        <Hero text="赔掉" at={2.85} until={5.15} x={960} y={640} size={64} ls={0.3} rotY={0} rotX={18} anim="呐喊声波" />
        <Hero text="6 位数" at={3.69} until={4.29} x={960} y={790} size={150} ls={0.04} rotY={0} rotX={18} anim="呐喊声波" />
        <Hero text="7 位数" at={4.31} until={5.15} x={960} y={790} size={150} ls={0.04} rotY={0} rotX={18} tone="red" anim="呐喊声波" />
        <Cutaway id="ep2" src="p2_loss" from={5.15} to={7.88} focus={[990, 430]} />
        <InkVig from={5.15} to={7.88} />
        <Hero text="浪费" at={5.42} until={7.86} x={330} y={320} size={200} tone="cream" anim="呐喊声波" />
        <Hero text="一整年" at={6.29} until={7.86} x={360} y={590} size={200} tone="red" dur={0.36} anim="呐喊声波" />
        <Seal text="真" at={9.45} until={10.65} x={1420} y={560} size={130} rot={-6} />
        <Seal text="假" at={9.69} until={10.65} x={1580} y={600} size={130} rot={4} />
        <Seal text="混" at={10.11} until={10.65} x={1740} y={560} size={130} rot={-3} />
        <Cutaway id="ep2" src="p2_fork" from={10.65} to={13.12} focus={[990, 430]} />
        <Cutaway id="ep2" src="p2_fork" from={13.92} to={16.39} focus={[990, 430]} skip={2.57} />
        <Hero text="翻倍转机？" at={12.24} until={16.37} x={400} y={400} size={120} anim="呐喊声波" />
        <Hero text="血本无归？" at={14.96} until={16.37} x={400} y={620} size={120} tone="red" anim="呐喊声波" />
        <Cutaway id="ep2" src="ep1_yearchart" from={18.81} to={21.28} focus={[990, 430]} />
        <Cutaway id="ep2" src="ep1_yearchart" from={22.08} to={24.56} focus={[990, 430]} skip={2.57} />
        <Cutaway id="ep2" src="ep1_yearchart" from={25.36} to={27.83} focus={[990, 430]} skip={1.64} />
        <Hero text="机会" at={20.51} until={22.97} x={380} y={460} size={130} anim="呐喊声波" />
        <Hero text="风险" at={21.56} until={22.97} x={380} y={660} size={130} tone="red" anim="呐喊声波" />
        <Hero text="看全局" at={23.02} until={25.2} x={400} y={460} size={130} anim="呐喊声波" />
        <Hero text="定进退" at={24.3} until={25.2} x={400} y={660} size={130} anim="呐喊声波" />
        <Hero text="先布局" at={25.3} until={27.83} x={400} y={460} size={130} anim="呐喊声波" />
        <Hero text="再投入" at={26.54} until={27.83} x={400} y={660} size={130} anim="呐喊声波" />
        <Flare at={1.07} k={0.6} /><Flare at={7.88} /><Flare at={16.44} k={0.5} />
        <NameTag at={28.82} until={31.77} x={1280} y={640} light />
        <Flare at={43.5} k={0.45} /><Flare at={49.49} k={0.55} />
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
        <Sfx at={25.27} s="木鱼敲击回响音效" />
        <Sfx at={26.51} s="木鱼敲击回响音效" />
        <Sfx at={27.78} s="闪回" />
        <Sfx at={28.79} s="一声响铃" />
        <Sfx at={31.82} s="回忆-刷一下" />
        {PH2.slice(1).map(([, a]) => <Sfx key={a} at={a - 0.03} s="扫光音效4" />)}
        <Sfx at={41.83} s="闪回" />
        <Sfx at={43.47} s="综艺咚" />
        <Sfx at={46.01} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={49.46} s="叮收银机提示音1" />
        <Sfx at={52.1} s="亮一下" />
      </>}
      subs={[['以为抓到翻身的机会', 0.05, 2.25], ['结果赔掉 6 位数、7 位数', 2.25, 5.15], ['还浪费一整年的时间', 5.15, 7.93], ['那 2027 年', 7.93, 9.4], ['真假混', 9.4, 10.7], ['眼前到底是翻倍的转机', 10.7, 13.66], ['还是会让你血本无归的危机？', 13.66, 16.39], ['奇门遁甲战略大会', 16.39, 18.62], ['我会从年盘拆解机会和风险', 18.62, 22.25], ['带你看全局，定进退', 22.25, 25.25], ['先布局，再投入', 25.25, 27.83], ['大家好，我是林舒苑', 27.83, 29.42], ['您的人生战略导师', 29.42, 31.06], ['我在过去 16 年培训超过千多场课程', 31.06, 34.79], ['也帮助过几万个学员', 34.79, 36.88], ['来自于世界各地', 36.88, 39.06], ['从上市公司、大家族到小家庭', 39.06, 41.88], ['我为大家准备了三天完全免费的', 41.88, 45.97], ['2027 年奇门战略大会', 45.97, 48.74], ['那么马上报名', 48.74, 50.83], ['我们到时见！', 50.83, 52.7]]}
    />
  );
};

/* ================= 第 3 集（56.58 秒）================= */
regEp('ep3', 56.58, FC_EP3, TK_EP3);
const PH3: [string, number, number, string][] = [['hd-hall_seated', 36.01, 37.44, '16 年'], ['hd-QiMen_Training1', 37.44, 38.82, '千多场课程'], ['hd-fengshui_training-Qimen1', 39.7, 41.3, '几万个学员'], ['hd-masterSuyenLim_qm1', 41.86, 43.35, '来自世界各地'], ['hd-family_group', 43.35, 44.71, '上市公司 大家族 小家庭']];
export const SuyenEp3: React.FC = () => {
  const cam: Cam = { hits: [0.07, 3.87, 5.25, 6.62, 9.38, 14.25, 14.56, 15.63, 27.85, 31.97, 46.02, 47.16, 54.95], pushes: [[8.02, 14.25, 1.04]], origin: '48% 30%', shrink: [[36.01, 38.82, 0], [39.7, 41.3, 0], [41.86, 44.71, 0]] };
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
        <PhotoBG shots={PH3} />
        {PH3.map(([, a, b, label]) => <Hero key={a} text={label} at={a + 0.15} until={b} x={960} y={150} size={label.length > 6 ? 110 : 170} ls={0.12} anim="呐喊声波" />)}
      </>}
      front={<>
        <Cutaway id="ep3" src="p3_bet" from={7.92} to={10.45} focus={[990, 430]} bg={<Ph label="p3_bet：老板把一整叠金币推上赌桌的一格，金币塔垮掉（演员）" />} />
        <Cutaway id="ep3" src="p3_bet" from={11.25} to={13.77} focus={[990, 430]} bg={<Ph label="p3_bet：老板把一整叠金币推上赌桌的一格，金币塔垮掉（演员）" />} />
        <InkVig from={7.92} to={13.77} />
        <Seal text="押错" at={9.38} until={13.75} x={420} y={330} size={190} rot={-6} />
        <Hero text="赔回去" at={12.24} until={13.75} x={400} y={680} size={150} tone="red" anim="呐喊声波" />
        <Cutaway id="ep3" src="p3_scale" from={17.18} to={19.21} focus={[990, 430]} bg={<Ph label="p3_scale：数字人 Suyen 在天平一边放金砝码、一边放玉盾（正能量）" />} />
        <Cutaway id="ep3" src="p3_scale" from={20.01} to={22.04} focus={[990, 430]} bg={<Ph label="p3_scale：数字人 Suyen 在天平一边放金砝码、一边放玉盾（正能量）" />} />
        <Cutaway id="ep3" src="p3_scale" from={22.84} to={24.87} focus={[990, 430]} bg={<Ph label="p3_scale：数字人 Suyen 在天平一边放金砝码、一边放玉盾（正能量）" />} />
        <Cutaway id="ep3" src="p3_scale" from={25.67} to={27.7} focus={[990, 430]} bg={<Ph label="p3_scale：数字人 Suyen 在天平一边放金砝码、一边放玉盾（正能量）" />} />
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
        <Shot src="ep1_yearchart" from={46.02} to={48.09} last={false} />
        <Shot src="ep1_horse_goat_h" from={48.09} to={50.76} cont last={false} />
        <Shot src="goat_positive" from={50.76} to={54.45} cont last={false} />
        <Shot src="ep1_dh_point" from={54.45} to={57.18} cont />
        <Hero text="3 天完全免费" at={46.07} until={48.09} x={960} y={330} size={150} ls={0.1} glow={0.5} />
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

/* ================= 第 4 集（59.02 秒）================= */
regEp('ep4', 59.02, FC_EP4, TK_EP4);

export const SuyenEp4: React.FC = () => {
  const cam: Cam = { hits: [4.07, 5.27, 6.21], pushes: [[1.83, 3.97, 1.05]], origin: '48% 30%', shrink: [] };
  const grade: Grade = () => [1, 1, 0];
  return (
    <Frame id="ep4" cam={cam} grade={grade} dust={6.21} asisFrom={14.79} rose={{ kicker: '林舒苑老师 · 2027 奇门战略大会', title: '下一笔钱，该扎在哪里？' }}
      behind={<>
        <Hero text="订单还没收到钱" at={0.07} until={1.68} x={960} y={170} size={140} ls={0.06} glow={0.5} />
        <Hero text="下一笔钱" at={4.07} until={6.16} x={520} y={240} size={150} glow={0.4} />
        <Hero text="还能不能扎？" at={5.27} until={6.16} x={1420} y={240} size={130} tone="red" glow={0.4} />
        <Hero text="奇门遁甲战略大会" at={6.21} until={7.67} x={960} y={150} size={120} ls={0.12} glow={0.5} />
        <Luoshu at={7.72} shatter={999} until={10.23} x={1480} y={430} cell={120} />
        <Hero text="投入的次序" at={9.13} until={10.23} x={960} y={150} size={140} ls={0.12} glow={0.5} />
      </>}
      front={<>
        <Cutaway id="ep4" src="p4_bills" from={1.73} to={3.97} focus={[990, 430]} />
        <InkVig from={1.73} to={3.97} />
        <Hero text="薪水" at={1.83} until={3.95} x={380} y={400} size={130} tone="cream" anim="呐喊声波" />
        <Hero text="租金" at={2.27} until={3.95} x={380} y={580} size={130} tone="cream" anim="呐喊声波" />
        <Hero text="追到门口" at={2.95} until={3.95} x={440} y={770} size={120} tone="red" anim="呐喊声波" />
        <Cutaway id="ep4" src="p4_burn" from={10.23} to={12.11} focus={[990, 430]} />
        <Cutaway id="ep4" src="p4_burn" from={12.91} to={14.79} focus={[990, 430]} skip={1.98} />
        <Embers from={12.55} to={14.79} />
        <Hero text="现金" at={12.85} until={14.79} x={380} y={460} size={150} tone="cream" anim="呐喊声波" />
        <Hero text="被烧光" at={14.0} until={14.79} x={420} y={680} size={150} tone="red" anim="呐喊声波" />
        <Flare at={1.73} k={0.4} /><Flare at={3.97} /><Flare at={6.21} k={0.5} />
      </>}
      sfx={<>
        {OPEN_DROP}
        <Sfx at={1.68} s="回忆-刷一下" />
        <Sfx at={1.83} s="诡异的滴水声" />
        <Sfx at={1.8} s="咚咚重音心头震" />
        <Sfx at={2.24} s="咚咚重音心头震" />
        <Sfx at={2.92} s="猛然一惊" />
        <Sfx at={3.92} s="闪回" />
        <Sfx at={4.04} s="综艺咚" />
        <Sfx at={5.24} s="疑惑" />
        <Sfx at={6.16} s="咚" />
        <Sfx at={7.72} s="叮叮" />
        <Sfx at={9.1} s="木鱼敲击回响音效" />
        <Sfx at={10.18} s="旋风" />
        <Sfx at={12.82} s="咚" />
        <Sfx at={13.97} s="咚咚重音心头震" />
      </>}
      subs={[]}
    />
  );
};

/* ================= 第 5 集（58.9 秒）================= */
regEp('ep5', 58.9, FC_EP5, TK_EP5);

export const SuyenEp5: React.FC = () => {
  const cam: Cam = { hits: [0.18, 8.27], pushes: [[5.22, 7.72, 1.05]], origin: '48% 30%', shrink: [] };
  const grade: Grade = () => [1, 1, 0];
  return (
    <Frame id="ep5" cam={cam} grade={grade} dust={8.27} asisFrom={14.67} rose={{ kicker: '林舒苑老师 · 2027 奇门战略大会', title: '别人求救，你救不救？' }}
      behind={<>
        <Hero text="别人求救" at={0.18} until={1.48} x={960} y={170} size={190} ls={0.1} glow={0.5} />
        <Hero text="奇门战略大会" at={8.27} until={9.47} x={960} y={150} size={130} ls={0.14} glow={0.5} />
      </>}
      front={<>
        <Cutaway id="ep5" src="p5_plea" from={1.53} to={4.24} focus={[990, 430]} />
        <InkVig from={1.53} to={4.24} />
        <Hero text="拿公司的钱？" at={2.11} until={4.24} x={470} y={520} size={120} tone="red" anim="呐喊声波" />
        <Hero text="赔上" at={5.22} until={7.67} x={960} y={640} size={64} ls={0.3} rotY={0} rotX={18} anim="呐喊声波" />
        <Hero text="整个团队的薪水" at={6.16} until={7.67} x={960} y={790} size={120} ls={0.06} rotY={0} rotX={18} tone="red" anim="呐喊声波" />
        <Cutaway id="ep5" src="p5_line" from={9.52} to={11.7} focus={[990, 430]} />
        <Cutaway id="ep5" src="p5_line" from={12.5} to={14.67} focus={[990, 430]} skip={2.28} />
        <Hero text="先看代价" at={10.58} until={14.67} x={430} y={420} size={120} anim="呐喊声波" />
        <Hero text="划清界限" at={11.43} until={14.67} x={430} y={600} size={120} anim="呐喊声波" />
        <Hero text="再决定出手" at={12.85} until={14.67} x={470} y={780} size={110} anim="呐喊声波" />
        <Flare at={1.53} k={0.4} /><Flare at={4.24} /><Flare at={8.27} k={0.5} />
      </>}
      sfx={<>
        {OPEN_DONG}
        <Sfx at={1.48} s="回忆-刷一下" />
        <Sfx at={2.08} s="猛然一惊" />
        <Sfx at={4.19} s="闪回" />
        <Sfx at={5.19} s="咚" />
        <Sfx at={6.13} s="咚咚重音心头震" />
        <Sfx at={8.22} s="咚" />
        <Sfx at={9.47} s="回忆-刷一下" />
        <Sfx at={10.55} s="正确" />
        <Sfx at={11.4} s="正确" />
        <Sfx at={12.82} s="木鱼敲击回响音效" />
      </>}
      subs={[['别人求救', 0.05, 1.53], ['你要不要拿公司的钱去救呢？', 1.53, 4.28], ['可能会让你赔上整个团队的薪水', 4.28, 7.67], ['这一次的奇门战略大会', 7.67, 9.52], ['带你先看代价', 9.52, 11.33], ['划清界限，再决定出手', 11.33, 14.67]]}
    />
  );
};

/* ================= 第 6 集（59.05 秒）================= */
regEp('ep6', 59.05, FC_EP6, TK_EP6);

export const SuyenEp6: React.FC = () => {
  const cam: Cam = { hits: [8.09, 9.98], pushes: [[2.45, 7.04, 1.05]], origin: '48% 30%', shrink: [] };
  const grade: Grade = () => [1, 1, 0];
  return (
    <Frame id="ep6" cam={cam} grade={grade} dust={9.98} asisFrom={14.82} rose={{ kicker: '林舒苑老师 · 2027 奇门战略大会', title: '你的布局，算进全家退路了吗？' }}
      behind={<>
        <Hero text="一笔的投入" at={0.07} until={1.43} x={960} y={170} size={170} ls={0.1} glow={0.5} />
        <Hero text="全家的退路" at={8.09} until={9.93} x={960} y={170} size={160} ls={0.1} glow={0.5} />
        <Hero text="算进去了吗？" at={9.01} until={9.93} x={1420} y={420} size={110} tone="red" glow={0.4} />
        <Hero text="奇门战略大会" at={9.98} until={11.16} x={960} y={150} size={130} ls={0.14} glow={0.5} />
      </>}
      front={<>
        <Cutaway id="ep6" src="p6_points" from={1.48} to={3.86} focus={[990, 430]} />
        <Cutaway id="ep6" src="p6_points" from={4.66} to={7.04} focus={[990, 430]} skip={2.48} />
        <InkVig from={1.48} to={7.04} />
        <Hero text="孩子的学费" at={2.45} until={7.04} x={430} y={400} size={110} tone="cream" anim="呐喊声波" />
        <Hero text="父母的养老" at={3.53} until={7.04} x={430} y={580} size={110} tone="cream" anim="呐喊声波" />
        <Hero text="十年的储蓄" at={5.87} until={7.04} x={450} y={760} size={120} tone="red" anim="呐喊声波" />
        <Cutaway id="ep6" src="p6_family" from={11.21} to={12.61} focus={[990, 430]} />
        <Cutaway id="ep6" src="p6_family" from={13.41} to={14.82} focus={[990, 430]} skip={1.5} />
        <Hero text="提前思考" at={12.04} until={14.82} x={420} y={430} size={120} anim="呐喊声波" />
        <Hero text="进退" at={13.92} until={14.82} x={380} y={620} size={150} anim="呐喊声波" />
        <Flare at={1.48} k={0.4} /><Flare at={7.04} /><Flare at={9.98} k={0.5} />
      </>}
      sfx={<>
        {OPEN_DONG}
        <Sfx at={1.43} s="回忆-刷一下" />
        <Sfx at={2.42} s="咚咚重音心头震" />
        <Sfx at={3.5} s="咚咚重音心头震" />
        <Sfx at={5.84} s="猛然一惊" />
        <Sfx at={6.99} s="闪回" />
        <Sfx at={8.06} s="综艺咚" />
        <Sfx at={8.98} s="疑惑" />
        <Sfx at={9.93} s="咚" />
        <Sfx at={11.16} s="亮一下" />
        <Sfx at={12.01} s="正确" />
        <Sfx at={13.89} s="木鱼敲击回响音效" />
      </>}
      subs={[]}
    />
  );
};

/* ================= 第 9 集（58.34 秒）================= */
regEp('ep9', 58.34, FC_EP9, TK_EP9);

export const SuyenEp9: React.FC = () => {
  const cam: Cam = { hits: [1.92, 3.43, 8.58], pushes: [[6.05, 8.03, 1.05]], origin: '48% 30%', shrink: [] };
  const grade: Grade = () => [1, 1, 0];
  return (
    <Frame id="ep9" cam={cam} grade={grade} dust={8.58} asisFrom={14.11} rose={{ kicker: '林舒苑老师 · 2027 奇门战略大会', title: 'AI 帮你赚钱还是花钱？' }}
      behind={<>
        <Hero text="AI" at={0.07} until={1.87} x={960} y={170} size={220} ls={0.1} glow={0.5} />
        <Hero text="赚钱？" at={1.92} until={4.13} x={520} y={230} size={220} glow={0.5} />
        <Hero text="花钱？" at={3.43} until={4.13} x={1400} y={230} size={220} tone="red" glow={0.5} />
        <Hero text="奇门战略大会" at={8.58} until={9.65} x={960} y={150} size={130} ls={0.14} glow={0.5} />
      </>}
      front={<>
        <Cutaway id="ep9" src="p9_spend" from={4.18} to={6.05} focus={[990, 430]} />
        <Hero text="系统买了" at={4.23} until={6.05} x={430} y={420} size={120} anim="呐喊声波" />
        <Hero text="课程上了" at={4.95} until={6.05} x={430} y={600} size={120} anim="呐喊声波" />
        <Hero text="营业额" at={6.1} until={7.98} x={960} y={640} size={64} ls={0.3} rotY={0} rotX={18} anim="呐喊声波" />
        <Hero text="没有动静" at={7.1} until={7.98} x={960} y={790} size={130} ls={0.06} rotY={0} rotX={18} tone="red" anim="呐喊声波" />
        <Cutaway id="ep9" src="p9_focus" from={9.7} to={11.5} focus={[990, 430]} />
        <Cutaway id="ep9" src="p9_focus" from={12.3} to={14.11} focus={[990, 430]} skip={1.9} />
        <Hero text="下一笔投入" at={11.06} until={14.11} x={450} y={420} size={110} anim="呐喊声波" />
        <Hero text="值不值得？" at={12.5} until={14.11} x={450} y={610} size={120} tone="cream" anim="呐喊声波" />
        <Flare at={1.92} k={0.4} /><Flare at={6.05} /><Flare at={8.58} k={0.5} />
      </>}
      sfx={<>
        {OPEN_DONG}
        <Sfx at={1.89} s="叮收银机提示音1" />
        <Sfx at={3.4} s="咚咚重音心头震" />
        <Sfx at={4.13} s="故障音效" />
        <Sfx at={4.2} s="叮提示音4" />
        <Sfx at={4.92} s="叮提示音4" />
        <Sfx at={6.0} s="闪回" />
        <Sfx at={7.07} s="咚" />
        <Sfx at={8.53} s="咚" />
        <Sfx at={9.65} s="回忆-刷一下" />
        <Sfx at={12.47} s="木鱼敲击回响音效" />
      </>}
      subs={[['你追的 AI 到底是在帮你赚钱', 0.05, 2.3], ['还是在帮你花钱？', 2.3, 4.18], ['系统买了，课程上了', 4.18, 6.05], ['营业额却没有动静', 6.05, 7.98], ['这一次的奇门战略大会', 7.98, 9.7], ['再决定下一笔的技术投入', 9.7, 12.4], ['到底值不值得', 12.4, 14.11]]}
    />
  );
};

/* ================= 第 10 集（63.35 秒）================= */
regEp('ep10', 63.35, FC_EP10, TK_EP10);

export const SuyenEp10: React.FC = () => {
  const cam: Cam = { hits: [8.81, 11.23], pushes: [[4.17, 8.81, 1.05]], origin: '48% 30%', shrink: [] };
  const grade: Grade = () => [1, 1, 0];
  return (
    <Frame id="ep10" cam={cam} grade={grade} dust={11.23} asisFrom={19.12} rose={{ kicker: '林舒苑老师 · 2027 奇门战略大会', title: '做了 20 年生意，守还是转型？' }}
      behind={<>
        <Hero text="老顾客越来越少" at={0.07} until={1.69} x={960} y={170} size={140} ls={0.06} glow={0.5} />
        <Hero text="20 年的生意" at={4.17} until={6.85} x={960} y={170} size={160} ls={0.08} glow={0.5} />
        <Hero text="你的位置？" at={6.9} until={8.76} x={960} y={170} size={160} ls={0.08} tone="cream" glow={0.5} />
        <Hero text="守？" at={8.81} until={11.18} x={520} y={240} size={200} tone="cream" glow={0.4} />
        <Hero text="还是转型？" at={9.09} until={11.18} x={1400} y={260} size={150} tone="red" glow={0.4} />
        <Hero text="奇门遁甲战略大会" at={11.23} until={13.06} x={960} y={150} size={120} ls={0.12} glow={0.5} />
      </>}
      front={<>
        <Cutaway id="ep10" src="i1_shop" from={1.74} to={3.27} focus={[990, 430]} />
        <InkVig from={1.74} to={3.27} />
        <Hero text="利润" at={1.79} until={3.27} x={400} y={430} size={140} tone="cream" anim="呐喊声波" />
        <Hero text="越来越薄" at={2.21} until={3.27} x={450} y={630} size={130} tone="red" anim="呐喊声波" />
        <Cutaway id="ep10" src="i1_roots" from={13.11} to={15.71} focus={[990, 430]} />
        <Cutaway id="ep10" src="i1_roots" from={16.51} to={19.12} focus={[990, 430]} skip={2.7} />
        <Hero text="20 年的根基" at={14.98} until={19.12} x={450} y={420} size={110} anim="呐喊声波" />
        <Hero text="下一步的突破" at={17.28} until={19.12} x={470} y={620} size={110} glow={0.5} anim="呐喊声波" />
        <Flare at={1.74} k={0.4} /><Flare at={3.27} /><Flare at={11.23} k={0.5} />
      </>}
      sfx={<>
        {OPEN_DROP}
        <Sfx at={1.69} s="回忆-刷一下" />
        <Sfx at={3.23} s="闪回" />
        <Sfx at={8.78} s="咚" />
        <Sfx at={11.18} s="咚" />
        <Sfx at={13.06} s="亮一下" />
      </>}
      subs={[]}
    />
  );
};

/* ================= 第 11 集（62.15 秒）================= */
regEp('ep11', 62.15, FC_EP11, TK_EP11);

export const SuyenEp11: React.FC = () => {
  const cam: Cam = { hits: [9.24, 11.95], pushes: [[0.07, 1.33, 1.04]], origin: '48% 30%', shrink: [] };
  const grade: Grade = () => [1, 1, 0];
  return (
    <Frame id="ep11" cam={cam} grade={grade} dust={11.95} asisFrom={17.92} rose={{ kicker: '林舒苑老师 · 2027 奇门战略大会', title: '做领导的你 · 方向一错怎么办？' }}
      behind={<>
        <Hero text="做领导的你" at={5.19} until={8.19} x={960} y={160} size={130} ls={0.08} glow={0.5} />
        <Hero text="几十个人" at={8.24} until={11.9} x={520} y={240} size={150} glow={0.4} />
        <Hero text="几百个人" at={9.24} until={11.9} x={1400} y={240} size={150} tone="cream" glow={0.4} />
        <Hero text="奇门遁甲战略大会" at={11.95} until={13.36} x={960} y={150} size={120} ls={0.12} glow={0.5} />
      </>}
      front={<>
        <Hero text="方向一错" at={0.07} until={1.31} x={960} y={760} size={140} ls={0.06} rotY={0} rotX={18} tone="red" anim="呐喊声波" />
        <Cutaway id="ep11" src="i2_team" from={1.33} to={2.77} focus={[990, 430]} />
        <Cutaway id="ep11" src="i2_team" from={3.57} to={5.02} focus={[990, 430]} skip={1.54} />
        <InkVig from={1.33} to={5.02} />
        <Hero text="整年的薪水" at={1.55} until={5.02} x={430} y={400} size={110} tone="cream" anim="呐喊声波" />
        <Hero text="士气" at={2.92} until={5.02} x={380} y={580} size={130} tone="cream" anim="呐喊声波" />
        <Hero text="一起烧掉" at={3.28} until={5.02} x={450} y={770} size={130} tone="red" anim="呐喊声波" />
        <Hero text="2027 一个决定" at={6.51} until={8.19} x={960} y={790} size={110} ls={0.06} rotY={0} rotX={18} anim="呐喊声波" />
        <Hero text="跟着你冲" at={9.91} until={11.9} x={960} y={790} size={120} ls={0.06} rotY={0} rotX={18} anim="呐喊声波" />
        <Cutaway id="ep11" src="i2_lead" from={13.41} to={15.26} focus={[990, 430]} />
        <Cutaway id="ep11" src="i2_lead" from={16.06} to={17.92} focus={[990, 430]} skip={1.95} />
        <Hero text="审视方向" at={13.8} until={17.92} x={430} y={420} size={120} anim="呐喊声波" />
        <Hero text="聚焦团队火力" at={16.05} until={17.92} x={480} y={620} size={100} glow={0.5} anim="呐喊声波" />
        <Flare at={1.33} k={0.4} /><Flare at={5.02} /><Flare at={11.95} k={0.5} />
      </>}
      sfx={<>
        {OPEN_DONG}
        <Sfx at={1.28} s="旋风" />
        <Sfx at={3.25} s="咚咚重音心头震" />
        <Sfx at={4.97} s="闪回" />
        <Sfx at={9.21} s="咚" />
        <Sfx at={11.9} s="咚" />
        <Sfx at={13.36} s="亮一下" />
      </>}
      subs={[]}
    />
  );
};

/* ================= 第 12 集（65.02 秒）================= */
regEp('ep12', 65.02, FC_EP12, TK_EP12);

export const SuyenEp12: React.FC = () => {
  const cam: Cam = { hits: [3.08, 14.97], pushes: [[2.58, 4.77, 1.05]], origin: '48% 30%', shrink: [] };
  const grade: Grade = () => [1, 1, 0];
  return (
    <Frame id="ep12" cam={cam} grade={grade} dust={14.97} asisFrom={20.79} rose={{ kicker: '林舒苑老师 · 2027 奇门战略大会', title: '创业的女性 · 最怕人先倒下' }}
      behind={<>
        <Hero text="最怕的不是" at={0.07} until={2.53} x={470} y={150} size={100} ls={0.2} />
        <Hero text="事业没做起来" at={1.25} until={2.53} x={500} y={380} size={120} ls={0.06} glow={0.5} />
        <Hero text="创业的女性" at={4.88} until={9.79} x={960} y={160} size={130} ls={0.08} glow={0.5} />
        <Hero text="奇门战略大会" at={14.97} until={16.05} x={960} y={150} size={130} ls={0.14} glow={0.5} />
      </>}
      front={<>
        <Hero text="而是" at={2.58} until={4.77} x={960} y={640} size={64} ls={0.3} rotY={0} rotX={18} anim="呐喊声波" />
        <Hero text="人先倒下去" at={3.08} until={4.77} x={960} y={790} size={130} ls={0.06} rotY={0} rotX={18} tone="red" anim="呐喊声波" />
        <Hero text="太想做出成绩" at={8.12} until={9.79} x={960} y={790} size={110} ls={0.06} rotY={0} rotX={18} tone="red" anim="呐喊声波" />
        <Cutaway id="ep12" src="i3_late" from={9.84} to={11.56} focus={[990, 430]} />
        <Cutaway id="ep12" src="i3_late" from={12.37} to={14.09} focus={[990, 430]} skip={1.83} />
        <InkVig from={9.84} to={14.09} />
        <Hero text="储备金" at={10.17} until={14.09} x={380} y={400} size={120} tone="cream" anim="呐喊声波" />
        <Hero text="时间" at={11.25} until={14.09} x={380} y={560} size={120} tone="cream" anim="呐喊声波" />
        <Hero text="退路" at={12.17} until={14.09} x={380} y={720} size={120} tone="cream" anim="呐喊声波" />
        <Hero text="全压进去" at={13.0} until={14.09} x={1450} y={760} size={120} tone="red" anim="呐喊声波" />
        <Cutaway id="ep12" src="i3_step" from={16.1} to={18.04} focus={[990, 430]} />
        <Cutaway id="ep12" src="i3_step" from={18.84} to={20.79} focus={[990, 430]} skip={2.04} />
        <Hero text="看准进退" at={16.43} until={20.79} x={430} y={420} size={120} anim="呐喊声波" />
        <Hero text="最关键的一步" at={18.92} until={20.79} x={480} y={620} size={110} glow={0.5} anim="呐喊声波" />
        <Flare at={2.58} k={0.4} /><Flare at={14.09} /><Flare at={14.97} k={0.5} />
      </>}
      sfx={<>
        {OPEN_DROP}
        <Sfx at={3.05} s="咚咚重音心头震" />
        <Sfx at={9.79} s="回忆-刷一下" />
        <Sfx at={9.94} s="诡异的滴水声" />
        <Sfx at={14.04} s="闪回" />
        <Sfx at={14.92} s="咚" />
        <Sfx at={16.05} s="亮一下" />
      </>}
      subs={[]}
    />
  );
};

/* ================= 第 13 集（58.83 秒）================= */
regEp('ep13', 58.83, FC_EP13, TK_EP13);

export const SuyenEp13: React.FC = () => {
  const cam: Cam = { hits: [1.2, 1.68, 2.53, 11.18], pushes: [[5.26, 7.79, 1.05]], origin: '48% 30%', shrink: [] };
  const grade: Grade = () => [1, 1, 0];
  return (
    <Frame id="ep13" cam={cam} grade={grade} dust={11.18} asisFrom={14.6} rose={{ kicker: '林舒苑老师 · 2027 奇门战略大会', title: '生肖牛鼠 · 第一次创业' }}
      behind={<>
        <Hero text="八字有" at={0.07} until={2.48} x={960} y={150} size={110} ls={0.2} />
        <Hero text="牛" at={1.2} until={2.48} x={560} y={300} size={300} glow={0.5} />
        <Hero text="鼠" at={1.68} until={2.48} x={1360} y={300} size={300} glow={0.5} />
        <Hero text="第一次创业" at={2.53} until={5.21} x={960} y={170} size={150} ls={0.1} glow={0.5} />
        <Hero text="先试水？" at={5.26} until={7.74} x={520} y={240} size={170} tone="cream" glow={0.4} />
        <Hero text="押重注？" at={6.88} until={7.74} x={1400} y={240} size={170} tone="red" glow={0.4} />
        <Hero text="奇门遁甲战略大会" at={11.18} until={12.32} x={960} y={150} size={120} ls={0.12} glow={0.5} />
        <Luoshu at={12.32} shatter={999} until={14.6} x={1480} y={430} cell={120} />
        <Hero text="起步节奏" at={13.14} until={14.6} x={960} y={150} size={150} ls={0.14} glow={0.5} />
      </>}
      front={<>
        <Cutaway id="ep13" src="i4_reno" from={7.79} to={9.98} focus={[990, 430]} />
        <Hero text="门店还没开" at={7.87} until={9.98} x={450} y={420} size={120} anim="呐喊声波" />
        <Hero text="几十万已经出了" at={8.85} until={9.98} x={480} y={610} size={100} tone="red" anim="呐喊声波" />
        <Flare at={1.2} k={0.4} /><Flare at={9.98} /><Flare at={11.18} k={0.5} />
      </>}
      sfx={<>
        {OPEN_DONG}
        <Sfx at={1.17} s="咚" />
        <Sfx at={1.65} s="综艺咚" />
        <Sfx at={2.5} s="咚" />
        <Sfx at={5.23} s="叮提示音4" />
        <Sfx at={6.85} s="咚咚重音心头震" />
        <Sfx at={7.74} s="复古胶片滚动" len={0.6} />
        <Sfx at={8.82} s="叮收银机提示音1" />
        <Sfx at={9.93} s="闪回" />
        <Sfx at={11.13} s="咚" />
        <Sfx at={12.3} s="亮一下" />
        <Sfx at={13.11} s="木鱼敲击回响音效" />
      </>}
      subs={[['八字中有牛和老鼠的人', 0.05, 2.48], ['第一次想要创业', 2.48, 4.01], ['你应该先试水', 4.01, 5.76], ['还是直接押重注？', 5.76, 7.79], ['门店还没开', 7.79, 8.75], ['几十万已经出了', 8.75, 9.98], ['来到老师的战略大会里', 9.98, 12.27], ['带你思考起步节奏', 12.27, 14.6]]}
    />
  );
};

/* ================= 第 14 集（59.28 秒）================= */
regEp('ep14', 59.28, FC_EP14, TK_EP14);

export const SuyenEp14: React.FC = () => {
  const cam: Cam = { hits: [0.07, 2.12, 3.65], pushes: [[6.98, 10.63, 1.05]], origin: '48% 30%', shrink: [] };
  const grade: Grade = () => [1, 1, 0];
  return (
    <Frame id="ep14" cam={cam} grade={grade} dust={10.63} asisFrom={15.05} rose={{ kicker: '林舒苑老师 · 2027 奇门战略大会', title: '35 岁以后 · 守业还是转型？' }}
      behind={<>
        <Hero text="35 岁以后" at={0.07} until={1.28} x={960} y={180} size={200} ls={0.08} glow={0.5} />
        <Hero text="守业？" at={2.12} until={4.32} x={520} y={240} size={200} tone="cream" glow={0.4} />
        <Hero text="转型？" at={3.65} until={4.32} x={1400} y={240} size={200} tone="red" glow={0.4} />
      </>}
      front={<>
        <Cutaway id="ep14" src="i5_box" from={4.37} to={6.88} focus={[990, 430]} />
        <Hero text="10 年经验" at={4.42} until={6.88} x={430} y={420} size={120} anim="呐喊声波" />
        <Hero text="重新换岗位" at={5.4} until={6.88} x={470} y={600} size={110} tone="red" anim="呐喊声波" />
        <Hero text="下一份收入" at={6.98} until={10.58} x={960} y={640} size={64} ls={0.3} rotY={0} rotX={18} anim="呐喊声波" />
        <Hero text="未必达到" at={7.78} until={10.58} x={960} y={790} size={130} ls={0.06} rotY={0} rotX={18} tone="red" anim="呐喊声波" />
        <Cutaway id="ep14" src="i5_road" from={10.63} to={12.44} focus={[990, 430]} />
        <Cutaway id="ep14" src="i5_road" from={13.24} to={15.05} focus={[990, 430]} skip={1.91} />
        <Hero text="趁你还有选择" at={10.71} until={15.05} x={470} y={420} size={100} tone="cream" anim="呐喊声波" />
        <Hero text="先准备" at={12.49} until={15.05} x={400} y={590} size={110} anim="呐喊声波" />
        <Hero text="第二条路" at={13.56} until={15.05} x={470} y={760} size={140} glow={0.6} anim="呐喊声波" />
        <Flare at={0.07} k={0.4} /><Flare at={6.88} /><Flare at={10.63} k={0.5} />
      </>}
      sfx={<>
        {OPEN_DROP}
        <Sfx at={2.09} s="咚" />
        <Sfx at={3.62} s="综艺咚" />
        <Sfx at={4.32} s="回忆-刷一下" />
        <Sfx at={5.37} s="咚咚重音心头震" />
        <Sfx at={6.83} s="闪回" />
        <Sfx at={7.75} s="咚" />
        <Sfx at={10.58} s="亮一下" />
        <Sfx at={13.53} s="木鱼敲击回响音效" />
      </>}
      subs={[['35 岁以后', 0.05, 1.28], ['下一步该守业还是准备转型？', 1.28, 4.37], ['10 年的经验重新换岗位', 4.37, 6.88], ['下一份收入未必达到你心目中想要的', 6.88, 10.63], ['趁你还有选择', 10.63, 12.39], ['先准备第二条路', 12.39, 15.05]]}
    />
  );
};

/* ================= 第 15 集（59.66 秒）================= */
regEp('ep15', 59.66, FC_EP15, TK_EP15);

export const SuyenEp15: React.FC = () => {
  const cam: Cam = { hits: [1.43, 5.16, 5.54, 6.46, 7.06, 13.11], pushes: [[12.31, 15.43, 1.05]], origin: '48% 30%', shrink: [] };
  const grade: Grade = () => [1, 1, 0];
  return (
    <Frame id="ep15" cam={cam} grade={grade} dust={13.11} asisFrom={15.43} rose={{ kicker: '林舒苑老师 · 2027 奇门战略大会', title: '2027 做狼还是做羊？' }}
      behind={<>
        <Hero text="三只羊" at={1.43} until={2.42} x={1420} y={200} size={170} glow={0.5} />
        <Hero text="20" at={5.16} until={6.41} x={520} y={220} size={300} ls={0.06} glow={0.5} />
        <Hero text="27" at={5.54} until={6.41} x={1400} y={220} size={300} ls={0.06} glow={0.5} />
        <Hero text="做狼？" at={6.46} until={7.32} x={520} y={240} size={200} tone="red" glow={0.4} />
        <Hero text="做羊？" at={7.06} until={7.32} x={1400} y={240} size={200} tone="cream" glow={0.4} />
        <Hero text="披着羊皮的狼" at={13.11} until={15.43} x={470} y={230} size={116} ls={0.06} glow={0.6} />
      </>}
      front={<>
        <Cutaway id="ep15" src="s2_flock" from={2.47} to={5.02} focus={[990, 430]} />
        <Hero text="其中一只" at={2.62} until={5.02} x={430} y={420} size={110} tone="cream" anim="呐喊声波" />
        <Hero text="是狼" at={3.91} until={5.02} x={400} y={600} size={160} tone="red" anim="呐喊声波" />
        <Cutaway id="ep15" src="s2_hunt" from={7.37} to={8.97} focus={[990, 430]} />
        <Cutaway id="ep15" src="s2_hunt" from={9.77} to={11.37} focus={[990, 430]} skip={1.7} />
        <Hero text="做羊 → 被狼吃" at={7.55} until={11.37} x={520} y={420} size={96} tone="cream" anim="呐喊声波" />
        <Hero text="做狼 → 被牧羊人杀" at={9.85} until={11.37} x={560} y={600} size={90} tone="red" anim="呐喊声波" />
        <Flare at={2.47} k={0.4} /><Flare at={5.02} /><Flare at={11.37} />
      </>}
      sfx={<>
        {OPEN_DONG}
        <Sfx at={1.4} s="综艺咚" />
        <Sfx at={2.42} s="回忆-刷一下" />
        <Sfx at={3.88} s="咚咚重音心头震" />
        <Sfx at={4.97} s="闪回" />
        <Sfx at={5.13} s="咚" />
        <Sfx at={5.51} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={6.43} s="咚" />
        <Sfx at={7.03} s="咚" />
        <Sfx at={7.32} s="猛然一惊" />
        <Sfx at={8.7} s="咚咚重音心头震" />
        <Sfx at={10.6} s="咚咚重音心头震" />
        <Sfx at={11.32} s="闪回" />
        <Sfx at={13.08} s="咚咚重音心头震" />
      </>}
      subs={[['你看我的封面', 0.05, 1.33], ['三只羊，对不对？', 1.33, 2.47], ['其中一只是披着羊皮的狼', 2.47, 5.06], ['2027 年', 5.06, 5.96], ['你要做狼还是做羊？', 5.96, 7.37], ['你做羊就被狼吃', 7.37, 9.12], ['你做狼就被牧羊人杀', 9.12, 11.67], ['就有了这一只披着羊皮的狼', 11.67, 15.43]]}
    />
  );
};

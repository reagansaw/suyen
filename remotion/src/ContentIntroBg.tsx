import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { LTH, WHITE, Seigaiha, useFonts, ROSE, ROSE_DEEP, CREAM } from './SuyenContent';

// 11-12 Reagan：竖版内容片后面不要「正能量」CTA，改接广告统一的 Intro + CTA（IC2，横的）
// 这张是中间那块的底（1080×1426，上下各是新 banner）：玫红渐层 + 名字，IC2 缩成 1080×608 放在 y=VID_Y
export const VID_Y = 470;
// 11-12 Reagan：后面玫红那段不要上下 banner → full=1080×1920，整块往下移 OFF 置中
export const FULL_OFF = 247;
export const ContentIntroBg: React.FC<{ full?: boolean }> = ({ full }) => {
  useFonts();
  const o = full ? FULL_OFF : 0;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${ROSE} 0%, ${ROSE_DEEP} 100%)` }}>
      <Seigaiha o={0.12} />
      <Img src={staticFile('suyenc/suyenlogo-light.png')} style={{ position: 'absolute', left: 455, top: 40 + o, width: 170, height: 170 }} />
      <div style={{ position: 'absolute', left: 0, width: 1080, top: 230 + o, textAlign: 'center', fontFamily: LTH, fontSize: 92, color: CREAM, letterSpacing: '0.05em', lineHeight: 1 }}>MASTER SUYEN</div>
      <div style={{ position: 'absolute', left: 0, width: 1080, top: 350 + o, textAlign: 'center', fontFamily: LTH, fontSize: 60, color: WHITE, letterSpacing: '0.12em', lineHeight: 1,
        textShadow: '0 4px 14px rgba(0,0,0,0.3)' }}>您的人生战略导师</div>
      <div style={{ position: 'absolute', left: 32, top: VID_Y - 8 + o, width: 1016, height: 624, borderRadius: 18, background: CREAM }} />
      <div style={{ position: 'absolute', left: 0, width: 1080, top: VID_Y + 660 + o, textAlign: 'center', fontFamily: LTH, fontSize: 64, color: WHITE, letterSpacing: '0.06em', lineHeight: 1.35,
        textShadow: '0 4px 14px rgba(0,0,0,0.3)' }}>3 天完全免费<br />2027 奇门战略大会</div>
    </AbsoluteFill>
  );
};

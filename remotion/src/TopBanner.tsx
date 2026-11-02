import React from 'react';
import { AbsoluteFill, Img, staticFile, delayRender, continueRender } from 'remotion';

// 上 banner（2000×667）：原图把中间字盖掉，换成每集的题目 + 痛点。版式照原图：金色胶囊 / 金色大字 / 深红胶囊
export type TopBannerProps = { pill: string; main: string; sub: string };
const BG = '#CD3751';
const GOLD = 'linear-gradient(180deg, #FFF6DA 0%, #FFE08A 40%, #F2B640 62%, #C9821E 100%)';

export const TopBanner: React.FC<TopBannerProps> = ({ pill, main, sub }) => {
  const [h] = React.useState(() => delayRender('top-banner-font'));
  React.useEffect(() => {
    new FontFace('LTH', `url(${staticFile('ivyga/fonts/LantingheiSC-Heavy.ttf')})`).load()
      .then((ff) => { (document as any).fonts.add(ff); continueRender(h); }).catch(() => continueRender(h));
  }, [h]);
  const mainSize = Math.min(150, 1280 / main.length);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Img src={staticFile('suyenc/banner_top.webp')} style={{ width: 2000, height: 667 }} />
      {/* 盖掉原来的字：两块羽化的底色，避开左边罗盘、右边卫星和地球 */}
      <svg width={2000} height={667} style={{ position: 'absolute', inset: 0 }}>
        <defs><filter id="fe" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="14" /></filter></defs>
        <g filter="url(#fe)" fill={BG}>
          <rect x={318} y={82} width={1335} height={300} rx={30} />
          <rect x={318} y={330} width={1135} height={180} rx={30} />
          <rect x={1440} y={250} width={250} height={140} rx={30} />
        </g>
      </svg>
      <div style={{ position: 'absolute', left: 300, width: 1400, top: 92, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'LTH' }}>
        <div style={{ padding: '10px 70px 14px', borderRadius: 60, background: 'linear-gradient(180deg, #FFF3D0 0%, #F6D489 55%, #E2AE55 100%)',
          boxShadow: '0 6px 14px rgba(90,10,20,0.35), inset 0 2px 0 rgba(255,255,255,0.8)', transform: 'skewX(-8deg)' }}>
          <div style={{ fontSize: 84, color: '#8E1424', letterSpacing: '0.02em', lineHeight: 1.1, textShadow: '0 2px 0 rgba(255,255,255,0.35)' }}>{pill}</div>
        </div>
        <div style={{ marginTop: 14, position: 'relative', transform: 'skewX(-8deg)', fontSize: mainSize, lineHeight: 1.15, whiteSpace: 'nowrap', letterSpacing: '0.01em' }}>
          {/* 3D：后层深红描边 + 投影，前层金色渐变 */}
          <div style={{ position: 'absolute', inset: 0, color: '#7A0F1C', WebkitTextStroke: '14px #7A0F1C',
            textShadow: '0 6px 0 #5A0812, 0 10px 18px rgba(40,0,6,0.6)' }}>{main}</div>
          <div style={{ position: 'relative', backgroundImage: GOLD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            filter: 'drop-shadow(0 0 1px rgba(255,240,200,0.6))' }}>{main}</div>
        </div>
        <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 40 }}>
          <div style={{ width: 150, height: 5, background: 'linear-gradient(90deg, rgba(255,214,140,0), #FFD68C)' }} />
          <div style={{ padding: '8px 70px 12px', borderRadius: 50, background: 'linear-gradient(180deg, #C21E33 0%, #8C0F20 100%)',
            border: '4px solid #F2C774', boxShadow: '0 6px 14px rgba(60,0,10,0.4)' }}>
            <div style={{ fontSize: 60, color: '#FFFFFF', letterSpacing: '0.3em', marginRight: '-0.3em', transform: 'skewX(-8deg)', lineHeight: 1.1 }}>{sub}</div>
          </div>
          <div style={{ width: 150, height: 5, background: 'linear-gradient(90deg, #FFD68C, rgba(255,214,140,0))' }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

import React from 'react';
import { AbsoluteFill, Img, staticFile, delayRender, continueRender } from 'remotion';

// 上 banner（2000×667）：原图把中间字盖掉，换成每集的题目 + 痛点。版式照原图：金色胶囊 / 金色大字 / 深红胶囊
export type TopBannerProps = { pill: string; main: string; sub: string; v2?: boolean };
const BG = '#CD3751';
const GOLD = 'linear-gradient(180deg, #FFF6DA 0%, #FFE08A 40%, #F2B640 62%, #C9821E 100%)';

export const TopBanner: React.FC<TopBannerProps> = ({ pill, main, sub, v2 }) => {
  const [h] = React.useState(() => delayRender('top-banner-font'));
  React.useEffect(() => {
    new FontFace('LTH', `url(${staticFile('ivyga/fonts/LantingheiSC-Heavy.ttf')})`).load()
      .then((ff) => { (document as any).fonts.add(ff); continueRender(h); }).catch(() => continueRender(h));
  }, [h]);
  const mainSize = Math.min(150, 1280 / main.length);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Img src={staticFile(v2 ? 'suyenc/banner_top_v2.webp' : 'suyenc/banner_top.webp')} style={{ width: 2000, height: 667 }} />
      {/* 盖掉原来的字：两块羽化的底色，避开左边罗盘、右边卫星和地球 */}
      {!v2 && <svg width={2000} height={667} style={{ position: 'absolute', inset: 0 }}>
        <defs><filter id="fe" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="14" /></filter></defs>
        <g filter="url(#fe)" fill={BG}>
          <rect x={318} y={82} width={1335} height={300} rx={30} />
          <rect x={318} y={330} width={1135} height={180} rx={30} />
          <rect x={1440} y={250} width={250} height={140} rx={30} />
        </g>
      </svg>}
      {/* v2：新底图有云纹 → 只盖原字本身（抠出字 → 往外扩 → 羽化 → 填底色），旁边的云纹留着 */}
      {v2 && <svg width={2000} height={667} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="soft"><feGaussianBlur stdDeviation="18" /></filter>
          <mask id="tb" maskUnits="userSpaceOnUse" x="0" y="0" width="2000" height="667"><polygon points="300,60 1720,60 1720,315 1680,395 1575,420 1530,470 1460,470 1460,540 300,540" fill="#fff" filter="url(#soft)" /></mask>
          <filter id="cover" x="0" y="0" width="2000" height="667" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 8 0 0 -3" result="a" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -8 0 0 0 5.9" result="b" />
            <feMerge result="k"><feMergeNode in="a" /><feMergeNode in="b" /></feMerge>
            <feMorphology in="k" operator="dilate" radius="16" result="d" />
            <feGaussianBlur in="d" stdDeviation="10" result="m" />
            <feFlood floodColor={BG} />
            <feComposite in2="m" operator="in" />
          </filter>
        </defs>
        <image href={staticFile('suyenc/banner_top_v2.webp')} width={2000} height={667} filter="url(#cover)" mask="url(#tb)" />
      </svg>}
      {/* 整块缩到 0.86、以 1:1 版裁切的中线（y≈277）为中心，上下各留一点红色空隙 */}
      <div style={{ position: 'absolute', left: 300, width: 1400, top: 92, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'LTH', transform: v2 ? 'translateY(-8px) scale(0.8)' : 'scale(0.86)', transformOrigin: '700px 185px' }}>  {/* v2（11-09 新 banner）：缩到 0.8 往上 8px，下面红色空隙多一点 */}
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

// 11-09 Reagan：上 banner 用原图本来的三行字（banner_top_v2.webp）→ 原字整块搬过来缩到 0.8、往上 8px，下面留红色空隙；右下角地球不搬
export const TopBannerOrig: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Img src={staticFile('suyenc/banner_top_v2.webp')} style={{ width: 2000, height: 667 }} />
    <svg width={2000} height={667} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <filter id="fe" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="14" /></filter>
        {/* 把原字从红底抠出来：金字 / 白字（G 高）+ 深红描边和胶囊（R 低），红底和淡云纹变透明 */}
        <filter id="key" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 8 0 0 -3" result="a" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -8 0 0 0 5.9" result="b" />
          <feMerge><feMergeNode in="a" /><feMergeNode in="b" /></feMerge>
        </filter>
      </defs>
      <g filter="url(#fe)" fill={BG}>
        <rect x={318} y={82} width={1335} height={300} rx={30} />
        <rect x={318} y={330} width={1135} height={190} rx={30} />
        <rect x={1440} y={250} width={250} height={140} rx={30} />
      </g>
    </svg>
    <div style={{ position: 'absolute', left: 340, top: 82, width: 1340, height: 440, overflow: 'hidden', transform: 'translateY(-8px) scale(0.8)', transformOrigin: '660px 195px',
      clipPath: 'polygon(0 0, 100% 0, 100% 68%, 82% 68%, 82% 100%, 0 100%)', filter: 'url(#key)' }}>
      <Img src={staticFile('suyenc/banner_top_v2.webp')} style={{ position: 'absolute', left: -340, top: -82, width: 2000, height: 667 }} />
    </div>
  </AbsoluteFill>
);

import React from 'react';
import { Composition, Still } from 'remotion';
import { TopBanner } from './TopBanner';
import { SuyenES4, SuyenEP1, SuyenEI2, SuyenEP6, SuyenEp1, suyenEFrames, withIntroV2 } from './SuyenHooksE';
import * as EPS from './SuyenEps';
import { SuyenEVS4, suyenEVFrames } from './SuyenHooksEV';
import { SuyenC55, SuyenC57, SuyenC57S1, suyenCFrames } from './SuyenContent';
import { SuyenC51a, framesC51a } from './suyenc/c51a';
import { SuyenC51b, framesC51b } from './suyenc/c51b';
import { SuyenC53a, framesC53a } from './suyenc/c53a';
import { SuyenC53b, framesC53b } from './suyenc/c53b';
import { SuyenC54, framesC54 } from './suyenc/c54';
import { SuyenC56, framesC56 } from './suyenc/c56';
import { SuyenC57a, framesC57a } from './suyenc/c57a';
import { SuyenC57c, framesC57c } from './suyenc/c57c';
import { SuyenC57d, framesC57d } from './suyenc/c57d';
import { SuyenC59a, framesC59a } from './suyenc/c59a';
import { SuyenC59b, framesC59b } from './suyenc/c59b';
import { SuyenC59c, framesC59c } from './suyenc/c59c';
import { SuyenC60, framesC60 } from './suyenc/c60';

// 横版 16:9：钩子 P1 / I2 / P6 + 广告第一集；竖版 S4（C0057，广告不用，只留着参考）
export const Root: React.FC = () => (
  <>
    <Composition id="SuyenEP1" component={SuyenEP1} durationInFrames={suyenEFrames('p1')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEI2" component={SuyenEI2} durationInFrames={suyenEFrames('i2')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEP6" component={SuyenEP6} durationInFrames={suyenEFrames('p6')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenES4" component={SuyenES4} durationInFrames={suyenEFrames('s4')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEp1" component={SuyenEp1} durationInFrames={suyenEFrames('ep1')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEVS4" component={SuyenEVS4} durationInFrames={suyenEVFrames('s4')} fps={30} width={1080} height={1920} />
    {/* eps:start */}
    <Composition id="SuyenEp2" component={EPS.SuyenEp2} durationInFrames={suyenEFrames('ep2')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEp3" component={EPS.SuyenEp3} durationInFrames={suyenEFrames('ep3')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEp4" component={EPS.SuyenEp4} durationInFrames={suyenEFrames('ep4')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEp5" component={EPS.SuyenEp5} durationInFrames={suyenEFrames('ep5')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEp6" component={EPS.SuyenEp6} durationInFrames={suyenEFrames('ep6')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEp9" component={EPS.SuyenEp9} durationInFrames={suyenEFrames('ep9')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEp10" component={EPS.SuyenEp10} durationInFrames={suyenEFrames('ep10')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEp11" component={EPS.SuyenEp11} durationInFrames={suyenEFrames('ep11')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEp12" component={EPS.SuyenEp12} durationInFrames={suyenEFrames('ep12')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEp13" component={EPS.SuyenEp13} durationInFrames={suyenEFrames('ep13')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEp14" component={EPS.SuyenEp14} durationInFrames={suyenEFrames('ep14')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEp15" component={EPS.SuyenEp15} durationInFrames={suyenEFrames('ep15')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEp1IntroV2" component={withIntroV2(SuyenEp1)} durationInFrames={suyenEFrames('ep1')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEp2IntroV2" component={withIntroV2(EPS.SuyenEp2)} durationInFrames={suyenEFrames('ep2')} fps={30} width={1920} height={1080} />
    {/* eps:end */}
    {/* 1:1 版上 banner：每集换题目 + 痛点 */}
    <Still id="TopBanner" component={TopBanner} width={2000} height={667} defaultProps={{ pill: '别人求救，你救不救？', main: '一句求救，赔上全团队薪水', sub: '不再靠感情做决定' }} />
    {/* 内容片（竖版玫红模板，skills/suyen-content-rose）*/}
    <Composition id="SuyenC55" component={SuyenC55} durationInFrames={suyenCFrames('c55')} fps={30} width={1080} height={1920} />
    <Composition id="SuyenC57" component={SuyenC57} durationInFrames={suyenCFrames('c57')} fps={30} width={1080} height={1920} />
    <Composition id="SuyenC51a" component={SuyenC51a} durationInFrames={framesC51a} fps={30} width={1080} height={1920} />
    <Composition id="SuyenC51b" component={SuyenC51b} durationInFrames={framesC51b} fps={30} width={1080} height={1920} />
    <Composition id="SuyenC53a" component={SuyenC53a} durationInFrames={framesC53a} fps={30} width={1080} height={1920} />
    <Composition id="SuyenC53b" component={SuyenC53b} durationInFrames={framesC53b} fps={30} width={1080} height={1920} />
    <Composition id="SuyenC54" component={SuyenC54} durationInFrames={framesC54} fps={30} width={1080} height={1920} />
    <Composition id="SuyenC56" component={SuyenC56} durationInFrames={framesC56} fps={30} width={1080} height={1920} />
    <Composition id="SuyenC57a" component={SuyenC57a} durationInFrames={framesC57a} fps={30} width={1080} height={1920} />
    <Composition id="SuyenC57c" component={SuyenC57c} durationInFrames={framesC57c} fps={30} width={1080} height={1920} />
    <Composition id="SuyenC57d" component={SuyenC57d} durationInFrames={framesC57d} fps={30} width={1080} height={1920} />
    <Composition id="SuyenC59a" component={SuyenC59a} durationInFrames={framesC59a} fps={30} width={1080} height={1920} />
    <Composition id="SuyenC59b" component={SuyenC59b} durationInFrames={framesC59b} fps={30} width={1080} height={1920} />
    <Composition id="SuyenC59c" component={SuyenC59c} durationInFrames={framesC59c} fps={30} width={1080} height={1920} />
    <Composition id="SuyenC60" component={SuyenC60} durationInFrames={framesC60} fps={30} width={1080} height={1920} />
    <Composition id="SuyenC57S1" component={SuyenC57S1} durationInFrames={suyenCFrames('c57')} fps={30} width={1080} height={1920} />
  </>
);

import React from 'react';
import { Composition } from 'remotion';
import { SuyenES4, SuyenEP1, SuyenEI2, SuyenEP6, SuyenEp1, suyenEFrames, withIntroV2 } from './SuyenHooksE';
import * as EPS from './SuyenEps';
import { SuyenEVS4, suyenEVFrames } from './SuyenHooksEV';

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
    <Composition id="SuyenEp1IntroV2" component={withIntroV2(SuyenEp1)} durationInFrames={suyenEFrames('ep1')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEp2IntroV2" component={withIntroV2(EPS.SuyenEp2)} durationInFrames={suyenEFrames('ep2')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEp3" component={EPS.SuyenEp3} durationInFrames={suyenEFrames('ep3')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEp4" component={EPS.SuyenEp4} durationInFrames={suyenEFrames('ep4')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEp5" component={EPS.SuyenEp5} durationInFrames={suyenEFrames('ep5')} fps={30} width={1920} height={1080} />
    <Composition id="SuyenEp6" component={EPS.SuyenEp6} durationInFrames={suyenEFrames('ep6')} fps={30} width={1920} height={1080} />
    {/* eps:end */}
  </>
);

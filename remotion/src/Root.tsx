import React from 'react';
import { Composition } from 'remotion';
import { SuyenES4, SuyenEP1, SuyenEI2, SuyenEP6, SuyenEp1, suyenEFrames } from './SuyenHooksE';
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
  </>
);

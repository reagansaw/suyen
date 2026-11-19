# 出处

这个 skill 是 AIGOAL 自己写的，主体来自 studio.aigoal.ai 的实测规则和 Master Suyen 示范片实际跑出来的经验。2026-11-19 对照过几个高星的开源 Seedance skill，补进了我们缺的基本功，全部用我们自己的话改写：

| 来源 | 授权 | 借了什么 |
|---|---|---|
| **AIGOAL studio 大脑**（studio.aigoal.ai 提示词指南 2026-09-28 版、Seedance 词典、gem_knowledge 手艺卡） | 自家 | 主体规则；离线快照 `studio-brain-snapshot.md`：规格、价钱念法、读音表、中文安全运镜词、运动强度梯子、画风轨道、品质冲突矩阵、灯光三层、焦段、演员调度、台词量、片型模板 |
| [MapleShaw/seedance2.0-prompt-skill](https://github.com/MapleShaw/seedance2.0-prompt-skill) | MIT | 字符上限要真的数、头尾余量、反应时长、闪现标时长、人物持续小动作、近景环绕崩脸、两轴上限、贯穿运镜每拍重述、视频延长接法、审核词清单、二分法 |
| [dexhunter/seedance2-skill](https://github.com/dexhunter/seedance2-skill) | MIT | 即梦多模态上限、@视频 参考运镜写法、视频编辑写法、音乐卡点 |
| [liangdabiao/make-prompt-seedance2](https://github.com/liangdabiao/make-prompt-seedance2) | 未标授权（仅供学习交流） | 只借思路：一次只改一处、先出小样、废片排查 |
| [liangdabiao/ecom-video-seedance-prompt](https://github.com/liangdabiao/ecom-video-seedance-prompt) | 未标授权 | 只借思路：镜头卡字段、难还原元素、自然流 / 付费流 |
| [dingtom336-gif/viral-video-replicator](https://github.com/dingtom336-gif/viral-video-replicator) | README 写 MIT | 只借思路：换产品时把旧产品字眼泛化、衣服锁定句 |

有冲突的地方我们的取舍：不写 4K / 电影级（真人写实会变塑料，CG 大片例外）；不叫 Seedance 在画面里写字；中文提示词用中文运镜词。

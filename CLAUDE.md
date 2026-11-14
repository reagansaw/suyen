# video-editor · Master Suyen 影片工厂

这个 repo 是 Reagan 的影片生产线：用 **Remotion（React 做视频）+ ffmpeg + macOS Vision 抠像**把林舒苑的原片剪成广告片和内容片。

**开工前先读该项目的手册，不要凭这份文件开始动手：**

| 要做什么 | 先读 |
|---|---|
| 横版 16:9 广告（C0001–C0048） | `project/suyen2027conference/HANDOFF.md`（301 行，全部是 Reagan 批注过的，是唯一的规则来源） |
| 竖版内容片 / reels（C0049–C0060，玫红模板） | `project/suyen2027conference/skills/suyen-content-rose/SKILL.md` |
| 1:1 上下 banner 版 | `project/suyen2027conference/docs/1比1-上下banner.md` |
| 落地页 / lead magnet / webinar 报名页 | `project/suyen2027conference/skills/suyen-landing/SKILL.md` |
| WhatsApp 预热 / 提醒讯息 | `project/suyen2027conference/skills/suyen-whatsapp/SKILL.md` |
| 奇门解盘 1对1 上下格访谈片（4 个版本） | skill `qimen-jiepan-1on1`（`.claude/skills/qimen-jiepan-1on1/`） |
| 竖版片尾 CTA（留言「正能量」，不带 BGM） | skill `suyen-cta`（`.claude/skills/suyen-cta/`） |
| 任何新片子要定结构／镜头／节奏（含 webinar、长片） | skill `selling-video-craft`（效果型三段框架、有效画面、赛马） |
| 要写给模型的指令（口播、分镜、AI 生成画面、复刻爆款） | skill `ai-prompt-formula`（六要素公式、七大专家、Seedance 提示词） |
| Suyen 的素材 / 原片 / 品牌档在哪个 Drive | `project/suyen2027conference/DRIVE.md`（链接总表，新链接也贴这里） |
| 哪一支原片是什么（C0001…） | `project/suyen2027conference/原片目录.md`（写法 `[题目] (C0001)`） |
| 这一支内容片用什么 style | `project/suyen2027conference/pipeline/内容片-style.md`（开工前先定，版式库插件 `reagansaw/jingjian`） |
| 这个 project 该用哪组导演／专家、素材在哪个 Drive | `project/<name>/EXPERTS.md`（索引 `project/INDEX.md`） |
| **开新 project / 新客户 / 没有 EXPERTS.md** | **先跑 skill `new-project-intake` 问卷，问清性质和 Drive 链接再动手** |

有冲突时：**Reagan 在对话里的最新指示 > HANDOFF.md > 这份文件**。

## 目录

```
project/suyen2027conference/        手册、文案、分镜检查图、每一集的剪片产生器（pipeline/epN/、content/）
remotion/             Remotion 工程（真正的合成在这里）
  src/                *.tsx 合成 + *.json（逐帧脸位置 face、圆框轨迹 track、字幕 subs）
  public/             素材：suyenh(横版成片) suyenc(竖版) suyenbr(B-roll) suyenph(照片) sfx22(音效) audio(BGM) ivyga/fonts(兰亭黑)
  scripts/            render.mjs（渲整支）、stills.mjs（抽检查图）
  out/                渲出来的 raw 片和检查图
tools/                抠像和追踪：subjectmatte / facetrack（Swift，要先编译）、gate_matte.py、dechair.py
studio/               studio.aigoal.ai 的 API 和建 B-roll 画布的脚本
bgm/                  通用音效库（sfx-index.json 是索引）
```

## 常用指令

都在 `remotion/` 里跑。这是 8GB Mac，重指令一律 `nice -n 19`，ffmpeg 加 `-threads 2`，一次只跑一样。

```bash
npm run dev                                                   # Remotion Studio（预览）
nice -n 19 node scripts/stills.mjs '[["SuyenEp2","sb_00.30",0.3]]'   # 抽检查图 → out/stills/
CONCURRENCY=2 nice -n 19 node scripts/render.mjs SuyenEp2 out/ep2-raw.mp4   # 渲整支；FRAMES=起-止 只渲一段
```

母带、手机版、交片前的检查（响度 / 冷场 / 黑帧）照 `HANDOFF.md` 4.5 节。

第一次装：`cd remotion && npm install`；`cd tools && swiftc -O subjectmatte.swift -o subjectmatte && swiftc -O facetrack.swift -o facetrack`；字体和原片资料夹（`SUYEN_RAW`）见 `HANDOFF.md` 第 3 节。

## 几条红线（细节都在 HANDOFF.md 第 2、6 节）

- **字绝对不盖脸**：大字放人后层（`behind`），加护脸层 `FaceGuard`，`front` 只放离脸远的东西。每次出图逐格检查。
- **先给分镜检查图，Reagan 点头才渲染。**
- **studio.aigoal.ai 只建画布，绝不按 Run**（Run 花 Reagan 的点数，他自己按）。
- 名字一律「**林舒苑**」（whisper 会听成林苏妍／薛老师），头衔「奇门遁甲战略导师」。
- 横版只用 C0001–C0048，竖版内容片才用 C0049–C0060。
- 不要卡通动效、不要阴影光晕代替立体厚度、不要压暗横版背景、不要用 jy21 旧音效。
- 删档前看清楚，**只删自己产生的**；只杀自己开的 PID，不要按名字 pkill。

## 钥匙

`studio/studio_api.py` 的钥匙从环境变量 `AIGOAL_STUDIO_KEY` 或 repo 根目录 `.env` 读。**绝不印出来、不写进代码。**

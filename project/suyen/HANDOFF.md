# Master Suyen · 2027 奇门战略大会广告 · 交接手册（给第二台电脑的 Claude）

> 这份写的是第一台电脑 2026-10-30～31 两天跟 Reagan 来回改了 9 版才定下来的所有做法。**每一条都是 Reagan 亲口要求或亲口否定过的**，照做，不要自己发明风格。
> 有冲突时：Reagan 在对话里的最新指示 > 这份手册。

---

## 0. 你的任务

做 **13 支广告**，就是第 2 集到第 14 集（第 1 集已经做好）。

- 横版 16:9（1920×1080，30fps）
- 每支 **1 分钟以内**，整支 **1.1 倍速**
- 每支都照第 1 集的做法：`remotion/src/SuyenHooksE.tsx` 最底下的 `SuyenEp1`，加上 `pipeline/ep1/`
- **先给分镜检查图，Reagan 点头才渲染**。他说过：「我觉得你给我看了图先，再染」

### 13 支的素材

**只用 C0001–C0048**（Reagan：「广告暂时只用 c001-c0048 影片」）。这台电脑也已经下载好 C0001–C0048。

秒数是原片秒数，来自 whisper，剪之前要逐字再对一次。

| 集 | 钩子代号 | 原片 | 用哪一段 | 开头第一句（钩子） | 备注 |
|---|---|---|---|---|---|
| 2 | P2 痛点→结果 | C0006 | 0.0–34 | 以为抓到翻身的机会，结果赔掉六位数、七位数 | |
| 3 | P3 | C0011 | 2.4–41.6 | 企业家们，你今年赚到的钱，明年要拿去扩张、投资产品还是扎人才？ | 长，要剪 |
| 4 | P4 | C0014 | 2.4–37 | 订单还没收到钱，薪水租金已经追到门口 | **14–16.5 秒有「等一下」要剪掉** |
| 5 | P5 | C0027 | 2.8–36.2 | 别人求救，你要不要拿公司的钱去救？ | |
| 6 | P6 | C0029 | 2.2–30 | 一笔投入，动的可能是孩子的学费、父母的养老、你十年的储蓄 | **钩子已做好**：`SuyenEP6`（v9 定稿） |
| 7 | P7 | C0007 | 16.6–61 | 你的竞争对手快你 5 倍、10 倍……更何况你的竞争对手不是人 | 44 秒，长，要删句子 |
| 8 | P8 | C0009 | 5.1–43 | 定位要换、渠道要换、新伙伴要换——新伙伴是贵人还是拖你下水的人？ | |
| 9 | P9 | C0022 | 3.7–38 | 你追的 AI，到底是在帮你赚钱，还是在帮你花钱？ | **24 秒附近重讲，要剪** |
| 10 | I1 身份→结果 | C0018 | 1.3–40 | 企业家们，你做了 20 年的生意……老顾客越来越少，利润越来越薄 | |
| 11 | I2 | C0019 | 2.6–37.5 | 做领导的你——你的一个决定，几十几百个人跟着冲 | **钩子已做好**：`SuyenEI2`（v9 定稿） |
| 12 | I3 | C0020 | 12.8–45 | 创业的女性：你太想做出成绩，把储备金、时间、退路全压进去 | |
| 13 | I4 | C0021 | 3.9–73 | 八字中有牛和老鼠的人，第一次创业 | **43–47 秒重复要剪**；很长。CTA 用它自己的 C0021 61.4–73（「生肖牛和老鼠的人，你们还怕吗？……」） |
| 14 | I5 | C0025 | 2.3–34 | 35 岁以后，该守业还是转型 | 尾巴的「很假」要剪掉 |

每一支的完整逐字稿在 `docs/文案-各组.md`，分类和 AIDA/FAB 说明在 `docs/AIDA-分类表.md`。原片的 whisper 转写放在 `transcripts/`：
- `tx/` = 全部原片，第一次转写
- `tx2/` = 最佳 take，加了提示词再转一次

**这些转写都没有逐字时间。剪之前一定要自己重新转写，拿到逐字时间**（做法见第 3 节）。

---

## 1. 每一集的结构（照第 1 集）

Reagan 的五步口播广告：画面加台词钩子 3 秒 → 痛点 → 教方法 → 我们是提供者 → 点链接。

```
① 钩子 + 痛点 + 教方法（FAB）   ← 那支原片的整段脚本（每支都是一条完整的小广告）
② 我们是谁（介绍）              ← C0037 3.65–16.00 + 16.22–19.32
   「大家好，我是林舒苑，您的人生战略导师。我在过去16年培训超过千多场课程，也帮助过几万个学员，来自于世界各地，从上市公司大家族到小家庭」
③ 报名 CTA（下面三选一）
   CTA-1 C0048：4.30–7.40 / 7.70–11.85 / 13.57–23.10 / 27.10–33.30（第 1 集用的切法；最后一段延到 33.30：讲完挥手笑 2 秒。Reagan 10-31：「后面预留多 2 秒，不然后面卡顿」）
         「我为大家准备了三天完全免费的2027年奇门战略大会。你在2027年那么混乱的赤马红羊年的年代，依然抓准趋势，落实你想要的结果。那么马上报名，我们到时见」
   ~~CTA-2 C0039~~ **不能用**：整段只拍到 logo 墙，声音是别人（男声）。Reagan 10-31：「要一直是 Suyen 的声音」
   CTA-1 短版 C0048：4.30–7.40 / 7.70–11.85 / 27.10–33.30（脚本长的时候用，代替 CTA-2）
         「三天完全免费的战略大会，如果你想要看清2027年趋势，你是一个企业家，你是一个要更精准的方向的人，你一定要马上报名，我们到时见」
   CTA-4 C0021：61.4–73，只配第 13 集
```

- **时长预算**：原片接起来总长 **≤ 66 秒**，加速 1.1 倍后才会 ≤ 60 秒。脚本太长时：
  - 先剪掉句子之间超过 0.4 秒的停顿（切口都要落在字和字的空隙里）
  - 再把 CTA-1 换成 CTA-2
  - 最后才删脚本里比较不重要的句子。**不能删钩子**
- 原片脚本结尾如果有它自己的软收尾（像「记得来舒苑老师的战略大会」），一般删掉，换成上面的 CTA。
- **名字一律是「林舒苑」**（Master Suyen Lim，书封面上写「NO.1 奇门遁甲战略导师」）。whisper 会听成「林苏妍、薛老师、苏妍」，字幕和名牌都要打「林舒苑」。头衔写「奇门遁甲战略导师」。

---

## 2. 视觉铁律（全部是 Reagan 批注过的，违反就会被打回来）

### 人和脸
1. **第 0 秒就要看到人**，不准黑屏或墨色遮罩开场。
2. **字绝对不能盖住人脸**（Reagan 讲了三次）。三重保险：
   - 大字一律放在**人后层**（`behind`）。人像抠像叠在字上面，等于「字在人后面」。
   - 加**护脸层** `FaceGuard`：用 facetrack 逐帧找到她的脸中心，把原片的脸用柔边椭圆（125×165 px）叠回最上层。抠像漏掉头部的那几格也挡得住。
   - **前景层**（`front`）只放离脸远的东西（胸口以下、画面边缘）。前景的大字入场用「呐喊声波」（从小放大，不会扫过脸），不要用缩小II。
   - 曾经出过事：把大字误放进 `front`，结果「门」字盖到她的眼睛。**每一集出图后都要逐格检查**。
3. **B-roll 里别人的脸也不要被字挡到**，数字人的脸也一样。
4. **半身圆框**（右下角）必须**一直跟着人**：用 facetrack 的脸中心往下 150 px 对准，平滑 7 格。不要用抠像算位置，会被墙上海报印的人脸带偏（C0029 就有一张 Suyen 的海报）。
5. **抠像要准**，脚和衣角不能被切掉：
   - 用 `tools/subjectmatte`（macOS「主体抠图」，跟照片 App 长按抠图同一套），只留跟人像分割重叠 ≥35% 的物体，边缘是全分辨率。
   - 遮罩再处理：`erosion` 两次 → `gblur sigma=1.3` → `(val-28)*1.18`，这样收边加柔化，才不会有白墙白边和锯齿。
   - 坐在椅子上的片：「椅子可以出现，如果 crop 不干净」→ `MIN_OVERLAP=0.02` 让椅子整张保留，不要留半张残影。
   - 墙上海报印着人：用 `tools/gate_matte.py`，按脸的位置把那一边切掉。
6. **不能让人半身浮空**：抠出来的人如果下缘有断口（例如站在桌子后面），就不要把她单独叠到 B-roll 上。

### B-roll
7. **B-roll 不要常换**：大约 15 秒换一次，一段只换一次。
8. 讲 **points** 的时候：**整个画面切到 B-roll**（不抠人），Suyen 缩进右下角的**金框半身圆框**继续讲。左边或上面跟着她讲的话，一条一条出立体字。
9. **负面的 B-roll 用别的演员，绝不能用 Suyen 的脸。** ~~正能量的才可以用「数字人 Suyen」~~ → **数字人 Suyen 也不用了**（Reagan 10-31：「AI generate 有点老，用 original image」）：要她就用原片的她本人。
10. B-roll 在 studio.aigoal.ai 生成。**只建画布，绝不按 Run**（Run 会花 Reagan 的点数，由他自己按）。
    - 一个节点 Reagan 常常会跑好几次：要拿 `runHistory` 里 `timestamp` 最大的那一次。
    - Reagan 把影片模型换成了 `grok-imagine-1.5` 720p。
11. 马和羊的风格：
    - 负面 / 2027 / 赤马红羊：**熔岩裂纹 + 火焰鬃毛的火马火羊**（参考 `studio/assets/ref_horse_goat_run.jpg`）
    - 正能量：**书封面那只彩虹鬃毛吉祥羊，站在金色梯田日出里**（`remotion/public/suyenbr/goat_positive.mp4`）
    - 奇门天宫风格参考 `ref_goat_palace.jpg`
12. 介绍段的「证明」用**真照片**（`remotion/public/suyenph/`，从 landing page 来，只有 600×400）。做成**金框卡片**，底下铺同一张照片放大糊掉当背景，**不要整张撑满**（会糊）。用 Real-ESRGAN 放大过的 `hd-*.jpg`（Reagan 10-31：「照片很蒙」）。
    - **大字里不要用「·」分隔**（Reagan 10-31：「不要有 dot」）→ 用空格或直接连写，例如「3 天完全免费」。

### 字和动画
13. 字体：**Lantinghei SC Heavy（兰亭黑特粗）**，大字、字幕、印章全部用它。
14. 大字是**斜 3D 立体字**（照之前 UNO 那种）：`perspective` 里面做 `rotateY` / `rotateX`，再往后叠几层厚度。**靠厚度显示，不要阴影、不要光晕**。
15. 入场多用**剪映动画，尤其是「缩小II」**（13 倍缩到 1 倍，就是 `jyIn`）。前景、脸附近用「呐喊声波」。
16. **开场的字一定要大**，可以放中间（放在人后面）。
17. **讲到才出现**：2027 一定要等她讲到 2027 才飞出来；年份、数字、关键词都要按她讲的时间出现。
18. **不要卡通**：翻牌板、老虎机、电池、小人、金币雨、朱砂斜划（slash）全部被否定过。要商用、玄学、东方美学：
    - 金线罗盘
    - 洛书九宫
    - 朱砂印
    - 宣纸签
    - 一炷香
    - 水墨转场
    - 金尘
19. 横版**背景不要压暗、不要变灰**（只在故事转折的那一下短暂变黑白）。
20. 白墙上**不要用米白字、细淡金线**。名牌放在浅色墙上，要用墨色名字配深金头衔（`NameTag light`）。
21. 数字（RM10,000,000 这种）要大、清楚：立体字放在胸口以下，用「呐喊声波」。
22. 字幕：兰亭黑 50px 奶油色，`y=958`，加立体阴影 `depth`，**一行**。照她讲的原话打，不要改成书面语。

### 声音
23. **音效只用剪映 2-2 包**，已经复制到 `remotion/public/sfx22/<中文名>.mp3`（62 个），音量在 `VOL` 表。**不要用刀砍、颂钵那些（旧的 jy21 包）**。
24. **开场只放一个音效：水滴声或咚，不要两个叠在一起**（Reagan：「不是 +，水滴声或咚」）。
25. 每个大字都配音效，按意思挑：
    - 出大字：咚、综艺咚
    - 2027：综艺咚咚两声鼓点转场音效
    - 盖印、投入防守：木鱼敲击回响音效
    - 切 B-roll：回忆-刷一下、闪回、旋风
    - 数字滚动：复古胶片滚动、叮收银机提示音1
    - 痛点：咚咚重音心头震、诡异的滴水声
    - 正面：正确、亮一下

    卡通类（青蛙、鸭子、婴儿）不要用。
26. BGM：`audio/bgm-zhushen-loop.mp3`（诸神降临）音量 0.3，循环。
27. 母带：`loudnorm=I=-15:TP=-2:LRA=11` → 4 倍过采样限幅（见 4.4 节）。交片前检查：
    - 响度大约 −15 到 −16 LUFS
    - 没有超过 0.4 秒的冷场
    - 没有黑帧（YAVG<20）

---

## 3. 环境准备（第一次）

```bash
git clone https://github.com/reagansaw/suyen.git && cd suyen/remotion && npm install
```

**字体**（版权字体，不放进 git）。从 macOS 自带的 Lantinghei.ttc 导出 SC Heavy：

```bash
F=$(find /System/Library/AssetsV2 -name 'Lantinghei.ttc' 2>/dev/null | head -1)   # 找不到就先在「字体册」下载「兰亭黑-简」
uvx --from fonttools python -c "
from fontTools.ttLib import TTCollection
c=TTCollection('$F')
[f.save('public/ivyga/fonts/LantingheiSC-Heavy.ttf') for f in c.fonts if f['name'].getDebugName(4)=='Lantinghei SC Heavy']"
```

**工具**（macOS Vision）：

```bash
cd ../tools && swiftc -O subjectmatte.swift -o subjectmatte && swiftc -O facetrack.swift -o facetrack
```

**原片资料夹**：`export SUYEN_RAW="<这台电脑放 C0001–C0048 的资料夹>"`（档名是 `C00xx.MP4`）。

**studio 钥匙**：在 repo 根目录建 `.env`，写入 `AIGOAL_STUDIO_KEY=...`，跟 Reagan 拿。**绝不印出来、不写进代码、不 commit**（`.env` 已经在 `.gitignore` 里）。

**转写**：用 `uvx --offline --from mlx-whisper mlx_whisper`，模型 `mlx-community/whisper-large-v3-turbo`，加 `--word-timestamps True`。initial prompt 写：

> 以下是简体中文的句子。林舒苑，奇门遁甲战略大会，年盘，宫位，赤马红羊年，2027年。

**机器规矩**（8GB Mac）：
- 重的指令一律加 `nice -n 19`，ffmpeg 加 `-threads 2`
- 渲染用 `CONCURRENCY=2`，一次只跑一样
- 渲染前看 `df -h ~`，要 ≥5GB
- 只杀自己开的 PID，不要按名字 pkill
- **删档前先看清楚，只删自己产生的**（第一台电脑误删过别的项目的暂存，被系统挡下来）

---

## 4. 每一集的流程（照第 1 集抄）

### 4.1 剪原片 → 一支接好、1.1 倍速的片
1. 复制 `pipeline/ep1/` 成 `pipeline/epN/`，改 `prep_epN.py` 里的 `PIECES`（原片、起、止、内容）和输出档名 `public/suyenh/epN.mp4`。
2. 先把要用的每段原片拿去转写（逐字时间），**每一刀都落在字和字的空隙里**：起点在第一个字开始前约 0.05–0.1 秒，止点在最后一个字结束后约 0.25 秒。
3. 跑 `python3 prep_epN.py`，它会剪段、接起来、`setpts=PTS/1.1` 加 `atempo=1.1`（音调不变）、`loudnorm`，然后输出 `pieces.json`（每段在成片里的起止）。
4. **成片再转写一次检查**：
   - 不能少字（例如第 1 集的「储蓄」差点被剪掉）
   - 不能多出前一句的尾音（第 1 集 47 秒差点多出一个「让」，后来把切口往后挪了 0.07 秒）
   - whisper 在短片段的最后一个字常常会漏掉：要加 prompt 再听一次，确认到底有没有

### 4.2 抠像和追踪
```bash
V=remotion/public/suyenh/epN.mp4
tools/subjectmatte $V /tmp/m_epN.mp4                 # 坐椅子的片要 MIN_OVERLAP=0.02
tools/facetrack $V /tmp/face_epN.json <起始脸x> <起始脸y>
ffmpeg -i $V -i /tmp/m_epN.mp4 -filter_complex "[1:v]format=gray,erosion,erosion,gblur=sigma=1.3,lutyuv=y='clip((val-28)*1.18,0,255)'[m];[0:v][m]alphamerge,format=yuva420p[v]" \
  -map "[v]" -an -c:v libvpx-vp9 -pix_fmt yuva420p -deadline realtime -cpu-used 8 -b:v 6M -auto-alt-ref 0 remotion/public/suyenh/pf/epN.webm
```
然后把脸的轨迹平滑 7 格，写成两个 JSON：
- `src/suyenh-face-epN.json`：脸中心，护脸层用
- `src/suyenh-track-epN.json`：y 加 150，圆框用

写法照 `pipeline/ep1/gen_ep1.py` 前面那段。

### 4.3 写这一集的合成
- 在 `SuyenHooksE.tsx` 里加 `'epN'`：`HookId`、`M`（时长从 `pieces.json` 来）、`FACE`、`TRACK`，再把 `SuyenEpN` 注册到 `Root.tsx`。
- `pipeline/ep1/gen_ep1.py` 是第 1 集的产生器，可以照抄：
  - `ft(原片, 原片秒)` 会把原片的字时间换算成成片时间（已经除过 1.1）
  - 钩子已经做好的那几集（第 6 集 P6、第 11 集 I2）：把 `SuyenEP6` / `SuyenEI2` 的 behind / front / sfx / subs 拿来，**时间全部 ÷1.1**（产生器里的 `scale()` 就是在做这件事）
  - 其他集：钩子照同样的风格自己设计，元件都在 `SuyenHooksE.tsx` 里：`Hero`、`Seal`、`Luopan`、`Luoshu`、`Incense`、`Slip`、`House`、`Cutaway`、`PhotoWall`、`NameTag`、`Flare`、`InkVig`、`InkBrush`、`Embers`、`GoldDust`
- `Cutaway` 的用法：
  - `src` 是 `public/suyenbr/<名字>.mp4`
  - `bg` 可以换成照片墙
  - 两段 B-roll 要接在一起时，前一段用 `last={false}`，后一段用 `cont`，圆框就不会再弹一次
  - **注意**：`Cutaway` 里面的 `bg` 是放在 `Sequence` 里，`useCurrentFrame` 会从 0 开始算。像 `PhotoWall` 那样要传 `base` 把起点加回去（第 1 集第一次照片没出现就是这个原因）
- 每一集都要有：
  - 介绍段的名牌：`NameTag light`，放在不挡人的一边
  - 介绍段的照片墙 `PhotoWall`，配立体字「16 年」「千多场课程」「几万个学员」「来自世界各地」「上市公司 · 大家族 · 小家庭」
  - CTA 段的「3 天 · 完全免费」「2027 奇门战略大会」「马上报名」
  - 照片墙和介绍、CTA 这几段可以直接照抄第 1 集，只要改时间。

### 4.4 先出分镜检查图给 Reagan 看
```bash
cd remotion && nice -n 19 node scripts/stills.mjs '[["SuyenEpN","sb_00.30",0.3], ...]'   # 每 2.5 秒一格，每个大字入场后 +0.15 秒、+0.6 秒各一格
```
- 拼成有时间标签的总览图，可以用 PIL，字体用 `/System/Library/Fonts/STHeiti Medium.ttc`。
- **自己先逐格检查**：有没有字盖到脸、人有没有浮空、圆框有没有跟着人、字有没有被画面边缘切掉。
- 然后把检查图和一张时间表（时间 / 她讲什么 / 画面）一起给 Reagan，**等他说可以才渲染**。

### 4.5 渲染和交片
```bash
CONCURRENCY=2 nice -n 19 node scripts/render.mjs SuyenEpN out/epN-raw.mp4
nice -n 19 ffmpeg -threads 2 -i out/epN-raw.mp4 -map 0:v -map 0:a -c:v copy \
  -af "loudnorm=I=-15:TP=-2:LRA=11,aresample=192000,alimiter=limit=0.79:attack=3:release=60:level=false,aresample=48000" \
  -c:a aac -b:a 256k -movflags +faststart ~/Downloads/"Suyen-广告第N集-横版-v1.mp4"
nice -n 19 ffmpeg -threads 2 -i <上一个> -c:v libx264 -preset slow -crf 25 -maxrate 6M -bufsize 12M -pix_fmt yuv420p -c:a copy -movflags +faststart <名字>-手机.mp4
```
- 检查：响度、冷场（`silencedetect -40dB 0.4s`）、黑帧，都要过。
- 手机版通常 8–12MB，传给 Reagan 的是手机版。
- 旧版本要删掉（Reagan：「delete 那些没有用的……所有占用空间的都 delete」）。**只删自己产生的**。

### 4.6 每一集的 B-roll（studio）
- 照 `studio/suyen_ep1_build.py` 的写法建一个新画布：先跑第一帧图（gpt-image-2），再跑影片（16:9）。
- **建好画布就停下来**，把链接给 Reagan，他自己 Run。
- 每一集大约 2–3 个场景：
  - 教方法的 points：负面的用演员，正面的可以用数字人 Suyen
  - 2027 / 赤马红羊：火马火羊横版（`public/suyenbr/ep1_horse_goat_h.mp4` 可以直接重复用）
  - 正能量收尾：彩虹吉祥羊（`goat_positive.mp4`，可以重复用）
- 数字人的参考图：`studio/assets/ref_suyen_face.jpg`，是她 C0037 的正面截图。prompt 里要写清楚：短 bob、眼镜、珊瑚粉西装、金项链，「Keep her face, hair, glasses and outfit exactly the same as @image1」。
- 已经有、可以直接重复用的 B-roll 在 `remotion/public/suyenbr/`：
  - `p1_tired`：加班累垮的老板
  - `i2_team`：老板带整队人冲出门，撞进雾里
  - `p6_points`：学费、医院账单、存款崩盘，三个镜头
  - `ep1_yearchart`：奇门年盘浮在吉隆坡夜空
  - `ep1_dh_point`：数字人 Suyen 指年盘、推金棋子
  - `ep1_horse_goat_h`：火马火羊横版
  - `goat_positive`：彩虹吉祥羊
  - `horse_goat_v`：火马火羊竖版

---

## 5. 第 1 集当作样板（定稿）

- 脚本和时间表：`pipeline/ep1/第一集-脚本.md`；剪法：`pipeline/ep1/prep_ep1.py`；产生器：`pipeline/ep1/gen_ep1.py`
- 合成：`remotion/src/SuyenHooksE.tsx` 的 `SuyenEp1`
- 分镜检查图：`docs/review/第一集-分镜-*.jpg`；钩子 v9 检查图：`docs/review/v9-检查-*.jpg`

结构（59.7 秒，1.1 倍速）：
1. **0–12.7**：钩子 P1。胸口出 RM 数字（呐喊声波）→「没达成」红字在人后 → 讲「精力耗尽」时整画面切到加班老板，右下角是圆框 → 2027 拆成「20」「27」放在脸两边 → 罗盘 →「翻」「倍」
2. **12.7–26.9**：「奇门遁甲战略大会」在人后。切到年盘 B-roll，再切到数字人 B-roll（圆框跟着人）。points 依序出现：趋势 / 格局 / 宫位·方向·时间点 / 投入 / 防守
3. **26.9–40.9**：她本人讲话加名牌，接着是照片墙：台上演讲、千人大会、几百人合照、黄衣大合照、电视节目
4. **40.9–59.7**：「3 天 · 完全免费」「2027 奇门战略大会」→ 火马火羊配「赤马红羊年」→ 彩虹羊配「抓准趋势」「落实结果」→「马上报名」

---

## 6. 不要做的事
- 不要用 C0049 以后的片（S4 钩子用的 C0057，广告不能用）
- 不要在 studio 按 Run
- 不要没给分镜检查图就渲染
- 不要把字放进 `front` 又让它碰到脸
- 不要用阴影或光晕代替立体厚度
- 不要压暗横版背景
- 不要用卡通动效、斜划、jy21 旧音效
- 不要用「林苏妍」
- 不要 commit `.env`、字体、原片、`node_modules`、`public/suyenh`

## 7. 其他档案
- **竖版内容片（C0049–C0060，玫红模板）**：全部做法在 `skills/suyen-content-rose/SKILL.md`。代码 `remotion/src/SuyenContent.tsx`，剪片工具 `content/`
- `docs/AIDA-分类表.md`：27 个钩子（P1–P9、R1–R6、I1–I8、S1–S4）、介绍、4 个 CTA、证明素材
- `docs/文案-各组.md`：每一组的完整文案。⚠ 标的是听不清、要再确认的字
- `pipeline/prep_hooks.py`：钩子单独剪的版本，做 15–20 秒钩子探针时用（`MODE=h` 是横版）
- `pipeline/hk/`：P1、I2、P6、S4 钩子那几秒的逐字时间
- `tools/dechair.py`：坐黄沙发那支用，按色相去掉黄色
- `tools/gate_matte.py`：切掉海报上的人
- `tools/track_pip.py`：旧方法，不要用，改用 facetrack
- `studio/suyen_broll_build.py`：第 1 批和第 2 批 B-roll 画布的写法（`82df8ea8-…`）
- `studio/suyen_ep1_build.py`：第 1 集 B-roll 画布的写法（`a8a40fe5-…`）

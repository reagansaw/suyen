---
name: suyen-content-rose
description: Master Suyen（林舒苑）竖版内容片模板「玫红 style 2」——C0049–C0060 竖拍访问剪成 1 分钟内的 9:16 内容片（钩子 3 秒 + 好奇目录 + 每 5–8 秒换效果 + 1 个 B-roll + 9 秒真声 CTA「正能量」）。做 Suyen 内容片 / 竖版 / reels / 玫红模板 / 内容① 内容② 那种片时用。
---

# Suyen 竖版内容片 · 玫红模板（style 2）

> Reagan 2026-11-01：「玫瑰红的那个要作为 skills」。这一份是第一台电脑 10-31 跟 Reagan 改到定稿（内容① v6、内容② v2）的全部做法。
> **每一条都是 Reagan 亲口要求或亲口否定过的。** 冲突时：Reagan 在对话里的最新指示 > 这份 > `HANDOFF.md`（横版广告手册）。

## 0. 这个模板是什么

| | |
|---|---|
| 尺寸 | 1080×1920，30fps，竖版 |
| 素材 | **C0049–C0060**（竖拍访问，存档是横的，要 `transpose=1` 转正）。广告（横版 13 集）不能用这批，内容片才用 |
| 长度 | 每支 **< 60 秒**（正文约 45–48 秒 + CTA 9.3 秒） |
| 速度 | 段内停顿删掉 + 整支 **1.15 倍**（音调不变） |
| 颜色 | 她简介海报：玫红 `#D2405A`、深玫红 `#A82745`、米黄 `#F3E6C4`、藏青 `#1F2B45`、蝴蝶渐层（橙→玫红→紫）、青海波底纹 |
| 字体 | 兰亭黑特粗 Lantinghei SC Heavy（`LTH`），全部字都用它 |
| 代码 | `remotion/src/SuyenContent.tsx`（模板 + 两支定稿）；剪片 `content/` |
| 定稿样片 | `SuyenC55`（内容① 防骗 4 符号，55.4s）、`SuyenC57`（内容② 年度关键字，57.5s）。检查图在 `examples/`（n55-*、n57-*） |

同一个档里还有 **style 1 东方暗金**（`SuyenC57S1`，墨黑 + 金 + 朱砂、背景压暗、金罗盘、金尘）。Reagan 要的模板是 **style 2 玫红**；他点名才用 style 1。切换方式：合成最上面 `applyTheme(1|2)`。

---

## 1. 每支片的骨架（照内容①②抄）

```
0–3s   钩子：冷开场先放「结论那句」+ 镜头冲进 + 3D 大字在人后 + 开场音效（水滴 + 咚）
       → 第 0 秒就要看到人，不准黑屏
3s 起  好奇条：顶部 TopBanner（米黄斜角标题条，像她海报）+ 右上 IndexPanel「目录」锁住答案，讲到才一格一格解锁
之后   每 5–8 秒换一个吸睛效果（见第 3 节元件），讲到才出现
中间   一个 B-roll（全片只一个），她缩成右上小卡继续讲
最后   CtaEnd：9.3 秒真声 CTA + 留言框打「正能量」+ MASTER SUYEN + 右上 logo
```

内容②（访问片）特别规则：**从男访问员的问题开始**（他不在镜头里，用 `QuestionCard`「访问员问 ❓」把他的问题打在画面上），接着才是她的回答。

---

## 2. 铁律（违反就会被打回来）

### 节奏
1. **她讲话慢、字跟字中间会拖** → 一律用 `content/cutlib.py`：段内静音（−30dB、≥0.16s）删到两边各留 0.06s，再整支 1.15×。不要手动 1.1× 了事。
2. 剪点落在字和字的空隙（先用 whisper 逐字时间对过）。
3. 交片前：没有 > 0.4s 冷场（`silencedetect -40dB 0.4`）、没有黑帧（YAVG<20）。

### 人和脸
4. **字绝对不盖脸**。三层：`behind`（大字放这里，人叠在上面）→ `Plate person`（抠像 webm）→ `Plate face`（facetrack 护脸）→ 前景只放离脸远的东西（胸口以下、画面边缘）。
5. **2027 / 大字放在人头后面**（`behind` 层）。
6. **不要圆框，不要任何「瞄准框 / 角括号 / Target」**——Reagan：像 Target，对 Master 不敬。要强调她的时候用 `HandCircle`（名字是旧的，现在是**聚光灯**：周围变黑白压暗 + 一道光扫过 + 标签卡放在她头旁边，不盖脸）。
7. B-roll 时她的小卡：**右上角**（`Cutaway pipTopAt`），等右上的目录收掉才弹出来，不要右下。

### 字幕
8. 字幕：**白色兰亭黑特粗 76px、柔和阴影、没有描边**（Reagan：border line font 不专业）。位置**中下 y≈1100**。
9. **图卡放在字幕上面**；画面有图卡时字幕往下挪：一般图卡 → 1250；B-roll / 狼羊对比这种占满下半的 → 1420–1430。用 `Subs yAt={(t)=>…}` 按时间段写。
10. 照她讲的原话打，名字永远是「林舒苑」（不是林苏妍）。

### 目录 / 好奇
11. 右上 `IndexPanel` 锁住答案、讲到才解锁。**全部揭晓后约 1 秒就收掉**（内容②：2027 真假混亮相 +1.0s），标题条同时换成答案（「真 · 假 · 混」），小卡接着弹到右上。

### B-roll
12. **一支片只用 1 个 B-roll**。竖版现成：`public/suyenbr/horse_goat_v.mp4`（火马火羊）；内容①用的是图 `public/suyenc/sheep_trio.png`（Downloads「Wolf in Sheep's Clothing Trio」，去字、只留羊）。
13. 新 B-roll 在 studio.aigoal.ai 建画布，**绝不按 Run**（花 Reagan 点数，他自己按）。

### CTA（`CtaEnd`，所有内容片共用）
14. 约 **9.3 秒，全部是她自己的真声音**（`public/suyenc/cta_vo.wav`）：「三天完全免费的 2027 年奇门战略大会 / 那么马上报名 / 正能量」。克隆声试过两次 Reagan 都说「不像」「要有能量力量」，**不要再用 AI 克隆**（`CTA_CLONE=false`）。
15. 画面：玫红渐层 + 青海波底 + 中间**一张**现场卡（3 段活动片轮播 `ev/s_teach, a_phones, s_class`）+ 上方大字跟着讲（3 天完全免费 → 2027 奇门战略大会 → 马上报名 → 留言打上「正能量」）+ 下方留言框打字「正能量」发送。
16. **不提 Allianz**，卡上不能有 Allianz 字样的镜头。
17. 片尾：左上 **MASTER SUYEN**，**logo 右上**（`suyenc/suyenlogo.png`）。

### 声音
18. 音效只用剪映 2-2 包 `public/sfx22/`（音量表 `VOL`）。开场：`一滴水滴声` + `开场音效咚`。大字：咚 / 综艺咚；切 B-roll：回忆-刷一下；打勾：正确；警告：猛然一惊 / 咚咚重音心头震；故障字：故障音效；卡片：纸张抖动声。
19. BGM `audio/bgm-zhushen-loop.mp3`，内容片音量 0.15–0.22。

### 流程
20. **先出分镜检查图给 Reagan 看，点头才渲染。**
21. Reagan 常在外面：**交手机版**（crf 25、maxrate 6M，约 17–22MB），并报每支的秒数。

---

## 3. 元件表（都在 `SuyenContent.tsx`）

| 元件 | 用途 / 放哪层 |
|---|---|
| `Plate layer=bg/person/face` | 原片底、抠像人、护脸；`cam`（hits 冲击 + pushes 推镜）、`shakes`、`gray`（黑白段） |
| `Hero` | 3D 斜立体大字，`behind` 层；`anim` 缩小II（默认）/ 呐喊声波（脸附近）/ 放大 |
| `TopBanner` | 顶部米黄斜角标题条（kicker + title） |
| `IndexPanel` | 右上目录，`slots` 讲到才解锁；`pulse` 解锁前闪 |
| `MysteryTiles` | 开场 4 张问号牌 |
| `NameTag` | 名牌「林舒苑 · 奇门遁甲战略导师」 |
| `Glitch` | 故障字（假、叛逆乱） |
| `Chip` | 斜贴标签（好的羊 / 退 3 步 / ✓ 安全） |
| `Cutaway` | 全片唯一的 B-roll：`src`（suyenbr 影片）或 `image`；`pipTopAt` = 小卡右上弹出时间 |
| `HandCircle` | **聚光灯**强调（不是圈！）+ 头旁标签 |
| `Checklist` | 打勾清单 + 盖章 |
| `CircleStage` | 她缩到中间小舞台，两边出对比大字（狼？羊？/ 跟天动、跟磁场动） |
| `PhoneQimen` | 手机奇门盘画面，点一下宫位亮 |
| `Seal` | 朱砂印章字 |
| `Flash` | 闪白 / 闪红 |
| `FlipPair` | 两字翻转（慢 ↔ 快） |
| `BlindBox` | 盲盒弹开 |
| `SpeedLines` | 速度线（什么都快） |
| `LuopanRing` | 金线罗盘环（讲「大局」时锁定） |
| `Road` | 慢慢走到目的地的路 |
| `QuestionCard` | 访问员问题卡 |
| `Bug` | 正片时右上小 logo |
| `Subs` | 字幕（见铁律 8–9） |
| `CtaEnd` | CTA + 片尾（见铁律 14–17） |
| `GoldDust` / `STYLE1` | 只有 style 1 用 |

时间写法：
- 内容①（`SuyenC55`）直接写成片秒数。
- 内容②（`C57`）写 **原片秒数 `R(原片秒)`**，`mkR(subs)` 自动换成删停顿 + 1.15× 后的成片秒数。**新片一律用 `R()` 写**，以后再改剪辑不用重算时间。

---

## 4. 做一支新内容片（步骤）

前置：`HANDOFF.md` 第 3 节（npm install、导出兰亭黑字体、编 `tools/subjectmatte` 和 `tools/facetrack`、whisper）。

```bash
# 0) 原片（每支 1–3GB，先 df -h ~ 要 ≥5GB）
bash content/dl_raw.sh C0053

# 1) 逐字转写要用的那一段（initial prompt 写这段会出现的关键词）
ffmpeg -ss <起> -t <长> -i raw/C0053.MP4 -vn -ac 1 -ar 16000 content/transcripts/C0053_x.wav
uvx --offline --from mlx-whisper mlx_whisper content/transcripts/C0053_x.wav --model mlx-community/whisper-large-v3-turbo \
  --output-format json --output-dir content/transcripts --word-timestamps True --condition-on-previous-text False \
  --initial-prompt "以下是简体中文的句子。林舒苑，奇门遁甲，2027年，真假混，……"
# 时间要加回 <起>

# 2) 写 content/prep_c53.py（照 prep_c57b.py：PIECES = [(原片起, 原片止, '内容'), …]，钩子那句放第一段）
cd content && python3 prep_c53.py          # → remotion/public/suyenc/c53.mp4 + content/c53_pieces.json
python3 export_subs.py c53                 # → remotion/src/suyenc-c53-subs.json
#    成片再转写一次：不能少字、不能带到前一句尾音；正文要 ≤ 50 秒（加 CTA 后 < 60）

# 3) 抠像 + 脸轨迹（后两个数 = 第一帧脸中心大概位置）
cd .. && bash content/matte.sh c53 600 620  # → public/suyenc/pf/c53.webm + src/suyenc-face-c53.json

# 4) SuyenContent.tsx：import face/subs JSON → EPS 加 c53（dur 用 subs JSON 的 dur，tail: CTA_DUR）
#    → 照 C57 写一个新合成（applyTheme(2)、R = mkR(subs)、behind / 前景 / Subs yAt / CtaEnd / Sfx / BGM）
#    → Root.tsx 注册 SuyenC53（1080×1920、suyenCFrames('c53')）

# 5) 分镜检查图（每 2.5 秒一格 + 每个效果入场 +0.15s/+0.6s）→ 自己先逐格查（字盖脸？小卡位置？字幕被图卡挡？）→ 给 Reagan，等他点头
cd remotion && nice -n 19 node scripts/stills.mjs '[["SuyenC53","c53-00.3",0.3],["SuyenC53","c53-02.5",2.5]]'

# 6) 渲染 + 母带 + 手机版
CONCURRENCY=2 nice -n 19 node scripts/render.mjs SuyenC53 out/c53-raw.mp4
nice -n 19 ffmpeg -threads 2 -i out/c53-raw.mp4 -c:v copy \
  -af "loudnorm=I=-15:TP=-2:LRA=11,aresample=192000,alimiter=limit=0.79:attack=3:release=60:level=false,aresample=48000" \
  -c:a aac -b:a 192k -movflags +faststart ~/Downloads/"Suyen-内容③-<题目>-竖版-v1.mp4"
nice -n 19 ffmpeg -threads 2 -i ~/Downloads/"Suyen-内容③-<题目>-竖版-v1.mp4" -c:v libx264 -crf 25 -maxrate 6M -bufsize 12M -preset medium \
  -pix_fmt yuv420p -c:a copy -movflags +faststart ~/Downloads/"Suyen-内容③-<题目>-竖版-v1-手机.mp4"
# QA：ebur128 响度 −15～−16 LUFS、峰值 ≤ −1；silencedetect −40dB 0.4s = 0；YAVG<20 黑帧 = 0
```

8GB Mac：重活一次一个、`nice -n 19`、ffmpeg `-threads 2`、渲染 `CONCURRENCY=2`；只删自己产生的档、只杀自己的 PID。

### 重现两支定稿（换电脑后）
```bash
bash content/dl_raw.sh C0055 C0057
cd content && python3 prep_c55b.py && python3 prep_c57b.py && python3 export_subs.py c57 && cd ..
bash content/matte.sh c55 640 600 && bash content/matte.sh c57 550 620
cd remotion && CONCURRENCY=2 nice -n 19 node scripts/render.mjs SuyenC57 out/c57-raw.mp4
```
（`cta_vo.wav`、`ev/*.mp4`、logo、羊图已经在 git 里；剪好的 `c55/c57.mp4` 和 `pf/*.webm` 太大不进 git，用上面重新产生。）

---

## 5. 两支定稿的内容（参考）

**内容① 防骗 4 符号（C0055 → SuyenC55，55.4s）**
钩子「只要看到这四个符号，你马上退三步」→ 2027 真假混（真 / 假 故障字 / 混）→ 三只羊图（好的羊、病的羊、披着羊皮的狼）→ 聚光灯「判断力」→ 合作清单盖「小心！」→ 狼？羊？→ 手机奇门盘点宫位 → 天蓬 / 玄武 / 朱雀 / 腾蛇 四个印章（目录解锁）→ 退 3 步、想 3 次、不要急 → 慢 ↔ 快 → CTA。剪段在 `content/prep_c55.py`。

**内容② 年度关键字（C0057 → SuyenC57，57.5s）**
访问员问「了解了，是不是就保证生意一定上？是不是就保证不会被人骗？」→ 她答「最起码你保本……不会踩坑」→ 2024 盲（盲盒）→ 2025 叛逆乱（故障）→ 2026 快狠暴（速度线）→ 罗盘「大局给予我们的指示」→ 火马火羊 B-roll + 真 / 假 / 混 印章 → 目录收掉、小卡右上 → 要不要学 / 听 / 了解更多 → 聚光灯「固执」→ 跟天动、跟磁场动 → 不可以踩坑 → 顺顺慢慢走到目的地 → CTA。剪段在 `content/prep_c57b.py`。

## 6. 内容③–⑮（11-01 夜写好，等渲染）

13 集都照第 1–4 节的做法写好了：剪段表 `content/episodes.py`（每集一段，钩子放第一段、访问员的问题用 QuestionCard），合成 `remotion/src/suyenc/<id>.tsx`（共用外壳 + 新效果在 `suyenc/kit.tsx`），`Root.tsx` 已注册 `SuyenC51a` … `SuyenC60`。

| id | 合成 | 内容 | 原片 | B-roll |
|---|---|---|---|---|
| c51a | SuyenC51a | 内容③ 真假混混在哪里（香港汇款骗局） | C0051 | p2_loss |
| c51b | SuyenC51b | 内容④ 破解真假混 3 个方法 | C0051 | ep1_yearchart |
| c53a | SuyenC53a | 内容⑤ 慢在哪一步 | C0053 | p2_fork |
| c53b | SuyenC53b | 内容⑥ 生肖鼠连续四年 | C0053 | ep1_yearchart |
| c54 | SuyenC54 | 内容⑦ 热锅上的蚂蚁（牛 · 狗 · 鼠） | C0054 | ep1_yearchart |
| c56 | SuyenC56 | 内容⑧ 35 岁第二成长曲线 | C0056 | i2_team |
| c57a | SuyenC57a | 内容⑨ 空亡：冲还是守 | C0057 | p2_loss |
| c57c | SuyenC57c | 内容⑩ 最担心小孩和老人 | C0057 | 三只羊图 |
| c57d | SuyenC57d | 内容⑪ 裁人还是请人 / 要不要扩充 | C0057 | i2_team |
| c59a | SuyenC59a | 内容⑫ 我的初心（你的成功就是我的荣耀） | C0059 | intro_v2 |
| c59b | SuyenC59b | 内容⑬ 3 种人一定要来 | C0059 | ep1_yearchart |
| c59c | SuyenC59c | 内容⑭ 大会 4 大收获 | C0059 | intro_v2（小卡左上，因为右上有目录） |
| c60 | SuyenC60 | 内容⑮ 美容院学生故事 | C0060 | p2_loss |

**另一台电脑怎么剪：**
```bash
bash content/dl_raw.sh C0051 C0053 C0054 C0056 C0057 C0059 C0060
STEP=cut bash content/render_eps.sh all      # 先剪片 + 抠像
cd remotion && nice -n 19 node scripts/stills.mjs '[["SuyenC51a","c51a-03",3],["SuyenC51a","c51a-12",12]]'   # 分镜检查图 → 给 Reagan 看
bash content/render_eps.sh c51a              # 点头后：渲染 + 母带 + 手机版 + QA，一集一集
```
新工具：`content/words.py <原片> <起> <止> [--subs]`（逐字时间 / 字幕草稿）；`R(原片秒, 1)` = 同一句第二次出现（冷开场钩子重复用的那句）。

**写的时候已知、渲染前要看的：**
- 时间点都照 whisper 逐字时间写，字幕已人工改字（奇门 / 天蓬 / 六害 / 凶星大耗 / 遍地黄金 / 微整 …）。「凶星大耗」「遍地黄金」「微整」「刷到傻掉」是照听的，Reagan 看时留意。
- 每集正文要 ≤ 50 秒（+ CTA 9.3 秒 < 60）。剪完 `episodes.py` 会印出秒数，超过就删一段再剪。
- 第一台电脑剪了几集做分镜检查（见下面 QA 记录），没有渲染整支。

## 6b. 还没做 / 待定
- 内容② 的 style 1 / style 2 由 Reagan 选（模板默认 style 2 玫红）。
- 内容② CTA 段峰值 −1.0（目标 −2），需要时把限幅调紧。
- C0057 156–390（2026 赚钱方法能不能用在 2027 / 量子纠缠）、C0060 2024 扎根段 没剪（太长、太抽象），要的话再加。

## 7. 新电脑把这个 skill 装进 Claude Code
```bash
mkdir -p ~/.claude/skills && ln -s "$(pwd)/skills/suyen-content-rose" ~/.claude/skills/suyen-content-rose   # 在 repo 根目录跑
```
（或者直接在 repo 里开 Claude Code，`CLAUDE.md` 会指到这里。）

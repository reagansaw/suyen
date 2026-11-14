---
name: qimen-jiepan-1on1
description: Master Suyen（林舒苑）「奇门解盘 1对1」竖版片的完整做法——老师 + 客人 + iPad 录屏三支素材，剪成 1 分 40 秒左右的 9:16 上下两格访谈片，一次出 4 支（原版、Seedance 2.5 换人版、原版马赛克、Seedance 版马赛克）。包含三支片对时间、钩子、进度条、客人声音压低、去 studio.aigoal.ai 用 Seedance 2.5 把客人换成不存在的人、脸部马赛克、BGM 和音效、渲染和检查。做奇门解盘、1对1 解盘、个案解盘、访谈上下格、客人换脸 / 换人、客人打马赛克、iPad 录屏解盘片时用。
---

# 奇门解盘 1对1 · 上下两格访谈片（4 个版本）

> 这一份是 2026-11-13 到 11-14 跟 Reagan 一路改到 v6 定稿的全部做法。
> **每一条规矩都是 Reagan 亲口要求或亲口否定过的。** 冲突时：Reagan 在对话里的最新指示 > 这份。
> 代码和脚本是那支定稿片的原样，放在这个文件夹里。换新个案时照抄骨架，只改内容。

## 0. 成品是什么

| | |
|---|---|
| 尺寸 | 1080×1920，30fps，竖版 |
| 素材 | 3 支：老师手机（主时间轴）、客人手机、iPad 录屏（她当场在盘上画圈） |
| 长度 | 原版约 102.7 秒，Seedance 版 107.8 秒（含 1 秒声明卡和 9.3 秒 CTA） |
| 响度 | 约 −14.5 LUFS |
| 4 支 | `SuyenQm1` 原版 ｜ `SuyenQm1Gen` Seedance 版 ｜ `SuyenQm1Mz` 原版 + 马赛克 ｜ `SuyenQm1GenMz` Seedance 版 + 马赛克 |
| 代码 | `remotion/qm1.tsx`（整支片一个档）+ `remotion/qm1_faces.ts`（马赛克位置） |
| 工程 | 放进 `reagansaw/suyen` 的 Remotion 工程：`remotion/src/suyenq/`，在 `Root.tsx` 登记 4 个合成 |

4 支的差别：

| 版本 | 客人画面 | 客人声音 |
|---|---|---|
| 原版 | 原片 | 原声压低 |
| Seedance 版 | 换成 AI 生成、不存在的年长的人 | Seedance 自己生成的声音，再压低 |
| 原版马赛克 | 原片，脸上盖马赛克 | 同原版 |
| Seedance 版马赛克 | 换人片，脸上盖马赛克 | 同 Seedance 版 |

## 1. 铁律（不要再问，照做）

1. **studio.aigoal.ai 只搭画布，不按 Run。** Reagan 自己按、自己花 credits。跑完他讲一声，才去拉结果。
2. **换上去的脸必须是 AI 生成、不存在的人。** 不照任何真人。
3. **iPad 录屏定格。** 不推近、不跟着笔走、不压暗其他宫、不加圆框和瞄准框。要的是她当场画圈的真实感。
4. **字不盖脸。** 字幕压在上下格交界上（中下）。
5. **片上不放小字声明。** 「真实个案改编 / 示范个案」「AI 处理」都不放。
6. **CTA 是老师真声**，用「留言打上正能量」那一段（9.3 秒）。不用克隆声音，不提 Allianz，**不要 BGM**。CTA 是独立一块，做法在 [`suyen-cta`](../suyen-cta/SKILL.md)。
7. 名字写「**Master Suyen Lim**　林舒苑 · 奇门遁甲战略导师」。小标写「奇门解盘」。
8. 不编数字、不编案例。字幕照他们真的讲的话写。
9. 钥匙不印出来、不进 git。客人原片、换人片、成片、BGM 都不进 git。
10. 8GB 的 Mac 一次只跑一个重活：`/Users/reagansaw/Code/.locks/heavy-run.sh nice -n 19 …`，ffmpeg 加 `-threads 2`。
11. 正常流程是**先给分镜检查图，Reagan 点头才渲**。

## 2. 需要的东西和放哪里

| 东西 | 位置 | 进 git 吗 |
|---|---|---|
| 三支原片 | `~/Downloads/`（这支片：`IMG_1787.MOV` 老师、`IMG_8723.MOV` 客人、`RPReplay_Final….MP4` iPad） | 不进 |
| 代理片和声音 | `suyen/remotion/public/qm1/`（`teacher.mp4` `client.mp4` `ipad.mp4` `teacher.m4a` `client_low.m4a`） | 不进 |
| 换人片 | `suyen/qimen-1on1/swap/gen/A.mp4…`（原档）→ `public/qm1/gen/A.mp4 + A.m4a` | 不进 |
| B-roll | `public/qm1/broll/ledger.mp4`、`dusty.mp4` | 不进 |
| BGM | `public/qm1/bgm/hook.mp3`、`void.mp3`（来源见第 9 节） | 不进 |
| 如意花纹 | `public/qm1/ruyi-1…6.png`（Reagan 给的「六种如意花纹」图切出来的；1 平安 2 财富 3 健康 4 吉祥 5 繁荣 6 平衡，每集换一个，这集讲钱用 2） | 不进 |
| 音效 | `suyen/remotion/public/sfx22/*.mp3` | 已在 suyen repo |
| Logo | `suyen/remotion/public/suyenc/suyenlogo-light.png` | 已在 suyen repo |
| CTA | `suyen/remotion/src/suyenq/cta.tsx` 的 `QmCta`（见 [`suyen-cta`](../suyen-cta/SKILL.md)）+ `public/suyenc/cta_vo.wav`、`public/suyenc/ev/*.mp4`、`public/qm1/cta_award.mp4` | 代码在 `skills/suyen-cta/remotion/`；片段不进 git |
| 渲染脚本 | `suyen/remotion/scripts/render.mjs`、`stills.mjs`（这里 `remotion/` 有一份） | 已在 suyen repo |
| studio 钥匙 | 环境变量 `AIGOAL_STUDIO_KEY`，或 repo 根目录 `.env` | 绝不进 |

**脚本要放回 suyen repo 才跑得动**（里面的路径是照那边写的）：

| 这里 | 放去 suyen repo 的 |
|---|---|
| `remotion/qm1.tsx`、`qm1_faces.ts` | `remotion/src/suyenq/` |
| `scripts/studio/*.py` | `studio/` |
| `scripts/proxy.sh`、`cut_swap.py`、`sync.py`、`ink.py` | `qimen-1on1/` |
| `scripts/render4.sh` | `remotion/` |
| 其余 `scripts/*.sh`、`scripts/mosaic/` | 哪里都可以，在 suyen repo 根目录跑 |

Remotion 版本 4.0.484，React 18.3.1。`Root.tsx` 加：

```tsx
import { SuyenQm1, SuyenQm1Gen, SuyenQm1Mz, SuyenQm1GenMz, framesQm1, framesQm1Gen } from './suyenq/qm1';
<Composition id="SuyenQm1" component={SuyenQm1} durationInFrames={framesQm1} fps={30} width={1080} height={1920} />
<Composition id="SuyenQm1Gen" component={SuyenQm1Gen} durationInFrames={framesQm1Gen} fps={30} width={1080} height={1920} />
<Composition id="SuyenQm1Mz" component={SuyenQm1Mz} durationInFrames={framesQm1} fps={30} width={1080} height={1920} />
<Composition id="SuyenQm1GenMz" component={SuyenQm1GenMz} durationInFrames={framesQm1Gen} fps={30} width={1080} height={1920} />
```

## 3. 整个流程（照顺序）

| 步 | 做什么 | 用什么 |
|---|---|---|
| 1 | 三支原片转 1080p 代理片 | `scripts/proxy.sh` |
| 2 | 三支片对时间，找 iPad 哪几秒有动笔 | `scripts/sync.py`、`scripts/ink.py` |
| 3 | 老师那支转文字，照盘改术语 | mlx-whisper |
| 4 | 写剪辑安排，给 Reagan 看 | `examples/剪辑安排.md` |
| 5 | 做声音：老师原声、客人压低 | `scripts/audio.sh` |
| 6 | 写 `qm1.tsx` 的 `SHOTS`，出分镜检查图 | `remotion/stills.mjs` |
| 7 | 客人换人：切片 → 搭画布 → Reagan 跑 → 拉回来 → 核对 | 第 7 节 |
| 8 | B-roll 画布 | `scripts/studio/qm1_broll_build.py` |
| 9 | 马赛克 | 第 8 节 |
| 10 | BGM 和音效 | 第 9 节 |
| 11 | 渲 4 支，检查 | `scripts/render4.sh`、`scripts/check.sh` |

## 4. 对时间和转文字（第 1–3 步）

**代理片**：`proxy.sh`。老师和客人 `scale=1080:1920`，iPad `scale=1334:1920`，都是 30fps、`-g 15`、没有声音。

**对时间**：`sync.py` 拿三支的音量曲线互相比，印出时间差。整支片一律用**老师那支的秒数**。这支片量到：

```
客人秒数 = 老师秒数 − 0.09
iPad 秒数 = 老师秒数 + 2.61
```

写进 `qm1.tsx`：`const OFF = { t: 0, c: -0.09, ipad: 2.61 }`。新个案要重量。

**iPad 哪里有动笔**：`ink.py` 印出画面有变的时段。这支片 178 秒之后没有再画，后面只能靠老师、客人和 B-roll。

**转文字**：

```bash
uvx --offline --from mlx-whisper mlx_whisper x.wav --model mlx-community/whisper-large-v3-turbo --language zh --word-timestamps True --output-format json --output-dir .
```

whisper 听术语会错，一定照盘改，再请老师对一次。这支片错过的：辛金→「心经」、坎宫→「砍工」、庚金→「更金」、天英→「天鹰」、天心→「天星」、奇门遁甲→「启门顿讲」、卷钱跑路→「卷钱保路」。

## 5. 剪法和版式（第 4、6 步）

### 骨架（照这支抄）

| 段 | 内容 | 这支片 |
|---|---|---|
| 钩子 | **先放高潮**：客人问 → 老师给答案 → 客人反应 | 「他有真的要骗我吗？」→「他是有心欺骗。」→ 客人听到的样子，半速 |
| 标题卡 | 这一集的问题，2.7 秒 | Logo +「奇门解盘」+「合作 20 年的伙伴」，1 秒后才出「还能信吗？」，再停 1.5 秒 |
| 声明卡 | 标题之后 1 秒 | 三行字：「奇门遁甲，东方千年智慧。」「不是迷信，内容只供参考。」「故事如有雷同，纯属巧合。」然后才进主题 |
| 倒回开头 | 客人讲他的问题 | 账和钱给伙伴管 → 讲的跟看到的不一样 → 合作十几二十年 → 还能信吗 |
| 盘先讲中他 | 老师先讲一件他自己的事，他说「是」 | 「你本身是大生意的大老板」→「是。」 |
| 3–4 个小问题 | 每个问题一小段，进度条跟着走 | 钱去哪里 → 他有没有心 → 几时开始 → 拿得回吗 |
| CTA | 老师真声 9.3 秒，没有 BGM | 留言打上「正能量」（`<QmCta />`） |

留住人的做法：每 2–4 秒换一次画面；老师 / 客人 / iPad / B-roll 轮流，同一种不连续超过 5 秒；术语第一次出现弹一张小卡。

### 镜头写法（`SHOTS`）

每个镜头一行，`s` 是老师秒数的起止：

| 字段 | 意思 |
|---|---|
| `sp` | 谁在讲：`t` 老师、`c` 客人 |
| `lay` | `dual` 上下格 ｜ `full` 一个人满版 ｜ `react` 钩子里老师拉到上面、客人在下面 ｜ `card` 标题卡或 CTA |
| `top` | 上格放什么：`t` / `c`（听的人）、`ipad`、`broll`、`year`（年份大字）、`cal`（月份格）、`pct`（百分比大字） |
| `sub` | 字幕，一行一句，镜头时间平均分 |
| `term` | 术语小卡 |
| `step` | 属于第几个小问题（0–3），进度条用 |
| `fx` | 钩子特效：`in` 冲进来、`slam` 大字砸下来 + 闪白 + 震 |
| `big` | 砸下来的大字 |
| `rate` | 慢动作，0.5 = 半速 |
| `tin` | 用「穿过去」接进来（几格），不硬切 |
| `view` | iPad 要显示原片哪一块（默认只取九宫格 `[196, 722, 953, 968]`；她在格子外写字时要给） |
| `g` | 这个客人镜头对应哪一段换人片（A–J） |
| `alt` | 换人版要改的写法。原版上格是真客人在听 → 换人版不能出现原本的人，改成 `top: 'ipad'` 或老师满版 |
| `rg` | `react` 镜头在换人版用哪一段换人片、从第几秒开始（他听着没讲话的那一段） |

`fk`、`focus`、`pal`、`dim` 是以前「镜头跟着笔走 / 压暗其他宫」留下的字段，**现在不起作用**（Reagan 否定了，`Mock` 里 `zoom = 1`）。`pal` 只还用来决定术语小卡放左边还是右边。

### 版式数字

- 颜色：玫红 `#D2405A`、亮玫红 `#FF7C95`、深玫红 `#7A1730`、米黄 `#F3E6C4`、底色 `#1B0A12`、白 `#FFFDF7`。
- 字体：标题和字幕宋体（`Songti SC`），小字 `Noto Sans SC`。
- 上下格：交界在 y=1010（上格是 iPad 时 985），斜 172 度，上下各 70px 渐变融合。**盘和人各占一半。**
- 背景：深酒红放射渐变 + 很淡的如意花纹慢慢飘（不透明度 0.09）+ 一圈柔光。
- iPad：黑边圆角机身（mockup），放在背景上，x 居中、y=222，最高 735。
- 进度条：最上面 y=44，左右各留 40，高 10，分 6 段「开场 / 他的问题 / 4 个小问题」。走到的那段亮玫红，走完的米黄。段名字 23px，**只在上下格镜头出**（钩子和标题卡只留条）。
- 问题胶囊：y=112，「合作 20 年的伙伴，还能信吗？」，玫红底白字 44px。只在上下格镜头出。
- 字幕：58px 宋体特粗，圆角 18。**老师讲 = 玫红底白字，客人讲 = 米黄底深字。** 位置压在交界上（`seam − 48`，iPad 时 `seam + 12`）。
- 名字条：第一次出现老师时，x=50、y=760，左边一条玫红竖线。
- 术语小卡：米黄底、玫红边、斜 −3 度、弹出来。
- 标题卡：Logo 180×180（`suyenc/suyenlogo-light.png`，如意花纹只留在背景）→「奇门解盘」→ 大标题 98px（数字 150px 亮玫红）→ 第 30 格弹出第二行 → 下面一台斜放的 iPad。
- 声明卡（`note: 'DISC'`，Reagan 11-14 加，为了保护）：同一个背景，三行字放正中间，第一行 68px 白色粗宋体，后两行 56px 米黄，上下各一条短线，行距 34px。只出 1 秒（三行其实读不完，是 Reagan 定的；要改长改 `s: [0, 1.0]`）。进度条的「开场」段和钩子配乐都算到声明卡结束。
- 人在格子里的位置：`POSE`。老师上格 `{ sc: 1.1, x: -108, y: -250 }`（要盖满右上角，不能露黑）。新素材要重调。
- 钩子 `slam`：第 13 格闪白 + 震 9 格 + 大字从 2.6 倍砸到 1 倍 + 画面压暗发红 + 上下黑边。

### 出检查图

```bash
cd remotion && node scripts/stills.mjs '[["SuyenQm1","hook",1.0],["SuyenQm1","title",5.5],["SuyenQm1Gen","dual",12]]'
```

图在 `remotion/out/stills/*.jpg`（是 jpg，不是 png）。拼成一张给 Reagan 看，他点头才渲。

## 6. 声音（第 5 步）

`scripts/audio.sh <老师原片> <客人原片> [压低开始秒 压低结束秒]`

- **老师**：原声，只做 `highpass=f=70,loudnorm=I=-16:TP=-1.5`。
- **客人**：整支压低，认不出原本的声音。Reagan 听过说「低沉可以」。做法是音高降到 0.87 倍、速度不变：

  ```
  aresample=48000,asetrate=48000*0.87,aresample=48000,atempo=1.149425287
  ```

  （1 ÷ 0.87 = 1.149425287，所以长度不变、不会跟画面对不上。）
- **老师麦克风里收到的客人插话**：也要压低。这支片是那一声「是」，在老师那支的 133.32–134.20 秒。只压那一小段，前后原样接回去（`audio.sh` 的 `lower_slice`）。先留一份 `teacher_raw.m4a`。
  怎么找：成片里听到没压低的男声 → 换算回老师秒数 → 那几秒抽出来转文字确认。
- 每个镜头只放**讲话那个人**的那一轨（客人镜头放 `client_low.m4a`，老师镜头放 `teacher.m4a`，换人镜头放 `gen/X.m4a`）。`react` 和标题卡没有人声。

## 7. Seedance 2.5 换人（去 studio.aigoal.ai）

目的：客人不想出脸，把他整个人换成一个不存在的人，房间、姿势、动作照旧。

### 7.1 切出要换的片段

`scripts/cut_swap.py`：从客人 4K 原片切出每一句（A–J），1080×1920、带原声，**每段至少 5 秒**，句子前面留 0.3 秒。同时存每段第一格 `X.jpg` 和 `manifest.json`（记每句在片段里的起止）。

### 7.2 测试画布：先定脸，只测一段

`scripts/studio/qm1_swap_test.py` → 搭一个画布（只搭，不 Run）：

1. **定妆图**：`gpt-image-2`，改图模式（`i2i`），输入是原片第一格，9:16、2K、高品质。提示：房间、椅子、角度、灯光、姿势全部不变，只把人换成「55 岁左右的马来西亚华人老板，两鬓灰白，深蓝长袖衬衫，没有纹身、手表、首饰」，并写明**是新的、虚构的人，不像任何真人或名人**。年纪和样子 Reagan 可以改。
2. 用同一段（这支片是 H，「他有真的要骗我吗？」）测几种换法。

测出来的结果：

| 换法 | 结果 |
|---|---|
| A：参考影片 + 定妆图，没有声音 | **嘴型对不上**。Seedance 是重新生成，不会照抄嘴型 |
| **B：再接原片那一句声音当嗓音参考，打开「生成声音」，提示里写明他讲哪一句** | **用这个。** 画面和声音一起生成，嘴型才对得上；成片用它自己生成的声音 |
| C / D：改原片换人（Seedance 2.0 Video Edit、Wan 2.7 Video Edit） | 搭了当后备，最后没用 |

### 7.3 全部镜头的画布

`scripts/studio/qm1_swap_all.py`（`--update` 原地改，已经跑出来的结果会保留；`--dry` 只数节点）。

每段一个影片节点，设定：

| 设定 | 值 |
|---|---|
| model | `seedance-2.5` |
| generationType | `text-to-video` |
| qualityMode | `hd` |
| 比例 / 分辨率 | `9:16` / `720p` |
| duration | 这一段的秒数（A 7 秒、B 5 秒，其余 4 秒） |
| refImageCount 1 | **同一张定妆图**（`swap/look-v1.png`），接 `ref-image-1`。10 段共用，才是同一个人 |
| referenceVideoCount 1 | 原片那一段，**拿掉声音**（`X_silent.mp4`），接 `ref-video-1`（动作参考） |
| referenceAudioCount 1 | 他那一句的原声（`X_line.mp3`），接 `ref-audio-1`（嗓音参考） |
| generateAudio | `true` |
| fixedLens | `true` |
| multiShot | `false` |

提示的写法（每段只换秒数、那一句话、语气）：

> {N}-second vertical 9:16 realistic iPhone interview footage, locked-off camera. @video1 is the performance reference: copy its framing, the room, the chair, the lighting, and the man's body movement, head turns and hand gestures. Replace only the person: the man is the person in @image1, with the same face, hair, age and clothing as @image1 in every frame. He is speaking Malaysian Mandarin Chinese to someone off-camera on the right, {语气}, and says exactly this one line, once: 「{那一句}」 His voice is the voice in @audio1. His lips match every syllable of the speech. After the line he stays silent and keeps looking at the other person. Sound: only his voice and quiet room tone, no music, no sound effects, no other voices. Natural skin texture, natural hands with five fingers, face stays consistent, no morphing, no beauty filter, no camera movement, no text, no subtitles, no logos, no watermark.

踩过的坑：

- **嗓音参考至少要 2 秒**（5–7 秒最稳）。太短的句子节点会失败 → 改接最长那一句的声音（这支片 D、G、I 改用 A 段 6.1 秒那一句）。嗓音也更一致。
- 同一个节点重跑不用动别的节点。
- 上传文件：`create_upload` → `curl PUT` 到 `upload_url` → `finish_upload`，拿 `file_url` 放进 `fileUpload` 节点。上传过的网址和画布 id 存在 `swap/studio_all.json`，不重复传。
- 搭完跑 `validate_workflow`，`ready_to_run` 要是 True。

把画布链接给 Reagan，告诉他：从上到下一段一个节点；每段跑完看三样——**脸是不是同一个人、嘴型对不对、讲的字有没有错**；不满意就重跑那一个。

### 7.4 Reagan 跑完之后

```bash
python3 scripts/studio/studio_pull.py <画布 id> qimen-1on1/swap/gen 2     # s_A → A.mp4
zsh scripts/gen_prep.sh A B C D E F G H I J
```

`gen_prep.sh` 做四件事：

1. 画面转成 1080×1920、30fps → `public/qm1/gen/X.mp4`
2. **它自己生成的声音也压低**（同一条压低链 + 响度 −16）→ `gen/X.m4a`
3. 把每段声音转成文字，**一段一段对照字幕**。讲错字的请 Reagan 重跑那一段
4. 量每段讲话的起止秒（`bounds.py`）→ 抄进 `qm1.tsx` 的 `GEN`

这支片的 `GEN`：

```ts
const GEN = { A: [0.38, 5.36], B: [0.62, 3.84], C: [0.4, 2.2], D: [0.62, 2.98], E: [0.1, 1.0], F: [0.14, 2.94], G: [0.46, 3.4], H: [0, 1.26], I: [0.46, 1.82], J: [0.92, 2.84] };
```

换人版的镜头长度 = 那一段讲话的起止，前留 0.12 秒、后留 0.22 秒（`resolve()` 自动算）。所以 Seedance 版比原版长 5 秒左右，正常。还没生成的段会出一张「这一段换人片还没生成」的卡，不会坏。

## 8. 马赛克

做法：在客人的脸上盖一块**同一段片的低像素副本**，放大时不做平滑，就是真的马赛克格子，而且会跟着脸动。

```bash
zsh scripts/mosaic/make_px.sh
python3 scripts/mosaic/faces_to_ts.py /tmp/qm1mz remotion/src/suyenq/qm1_faces.ts
```

1. **量脸的位置**：`faces.swift` 用 macOS 自带的 Vision（`VNDetectFaceRectanglesRequest`），每 3 格测一次，印出「格数 x y w h」（0–1，左上角是原点）。一格里有几张脸就取最大那张。客人整支片（3051 次）和 10 段换人片都要测。这支片没有一次测不到。
2. **做低像素副本**：每支片缩到 **40×72**（`scale=40:72:flags=area`，crf 8）→ `client_px.mp4`、`gen/A_px.mp4…`
3. **整理位置**（`faces_to_ts.py`）：前后各 2 次取平均（框不抖）；框放大——宽 ×1.55、高 ×1.7，再往上移 0.08 个脸高（盖到头发和下巴）。
4. **画上去**（`qm1.tsx` 的 `Vid`）：马赛克开着、而且这一格是客人时，在脸的位置放一个裁切框（圆角 14），里面放 `_px.mp4`，跟主片一样的大小、位置、起点、速度，加 `imageRendering: 'pixelated'`。3 格之间的位置直线补。
5. 开关：`<Cut mode="orig" mz />`、`<Cut mode="gen" mz />`。老师和 iPad 不会被盖。

检查：每 6 秒抽一格看（`check.sh` 会出检查图）。他动作快的地方要另外看。

## 9. BGM 和音效

**BGM 两首**，文件在 Reagan 的 `~/Movies/`：

| 用在哪 | 文件 | 取多长 | 音量 |
|---|---|---|---|
| 开头钩子，到标题卡结束 | `紧张Hook(BGM).mp3` → `bgm/hook.mp3` | 头 10 秒 | 0.36 |
| 标题卡之后整支垫底 | `Void (BGM).mp3` → `bgm/void.mp3` | 头 125 秒 | 0.11 |

```bash
ffmpeg -i ~/Movies/"紧张Hook(BGM).mp3" -t 10 -c:a libmp3lame -b:a 192k remotion/public/qm1/bgm/hook.mp3
ffmpeg -i ~/Movies/"Void (BGM).mp3" -t 125 -c:a libmp3lame -b:a 192k remotion/public/qm1/bgm/void.mp3
```

音量怎么走：

- 钩子 BGM：「有心欺骗」砸下来那一下收掉（第 3–9 格），再回来（第 16–30 格）；标题卡结束前后 18 格淡出。
- Void：标题卡结束前 10 格开始淡入，30 格到位。**第二次「他是有心欺骗」之前收掉**（前 20 格到前 6 格），让那一句干净地出来，之后 50–80 格再回来。**CTA 开始前收掉**（前 24 格到前 2 格），CTA 没有 BGM。
- CTA 自己带声音和音效（`QmCta`，见 [`suyen-cta`](../suyen-cta/SKILL.md)），**不要 BGM**（Reagan 11-14）。

**音效**（都在 `sfx22/`）：

| 什么时候 | 音效 | 音量 |
|---|---|---|
| 第 0 格，钩子冲进来 | 呼2 | 0.8 |
| 老师那一句前 1 格 | 撞击光1 | 0.9 |
| 「有心欺骗」砸下来（+12、+13 格） | 猛然一惊 0.9、咚咚重音心头震 1.0 | |
| 反应镜头开始 | 呼2 | 0.5 |
| 标题卡前 6 格 | 扫光 | 0.7 |
| 标题卡 +7 格 | 开场音效咚 | 0.7 |
| 标题卡 +30 格（第二行弹出） | 综艺咚 | 0.8 |
| 标题卡结束前 6 格 | 回忆-刷一下 | 0.7 |
| 第二次「有心欺骗」 | 撞击光1 0.7、猛然一惊 0.8、咚咚重音心头震 0.9 | |

## 10. B-roll

`scripts/studio/qm1_broll_build.py`：1:1（放上半格），每段先用 `gpt-image-2` 出第一帧（1:1、2K），满意了再用 `seedance-2.5` 出 5 秒影片（720p、没有声音，第一帧图接 `ref-image-1`，提示写 `@image1 is the first frame`）。画面里不出现人脸和看得懂的字。同样只搭画布。

这支片两段：「账本和对不上的数字」「三年没翻的账本」。178 秒后没有画盘的地方，用年份大字、月份格、百分比大字（代码画的，不用生成）。

## 11. 渲染和检查

```bash
cd remotion && zsh render4.sh v6        # 4 支，一支一支跑
zsh check.sh ../qimen-1on1/out/*-v6.mp4
```

- 每支约 90–96MB（crf 16）。
- **zsh 的坑**：`for p in "A B"; set -- $p` 不会拆字，4 支会瞬间全失败；每支分开写一行。不要接 `| tail`，失败会被吃掉。
- 只杀自己开的进程（记 PID），不要照名字杀。
- 检查：长度对不对、没有黑画面、没有长时间没声音、响度约 −14 LUFS、马赛克每 6 秒抽一格都盖住。
- **老实报告**：没有从头到尾看过、没有重听的地方要讲出来。

## 12. Reagan 否定过的做法（不要再做）

| 做过 | 他说 | 现在 |
|---|---|---|
| iPad 镜头跟着笔走、推近、压暗其他宫 | 要当场画圈的真实感 | iPad 定格 |
| 标题卡上面放如意图案 | 放 Suyen logo | Logo，如意只留背景 |
| 底下放「真实个案改编」「AI 处理」小字 | 都不需要放 | 全部拿掉 |
| 进度用 4 颗胶囊 | 上面要 loading bar | 最上面一条 6 段进度条 |
| 换人只换画面、配原声 | 嘴型对不上 | Seedance 画面和声音一起生成 |
| 出生年打码「19■■」 | 1977 对的 | 字幕照写 |
| CTA 另外做 | 用之前那个留言正能量 | `QmCta` |
| CTA 现场卡里闪过一个男生 | 那个男的部分拿出来，其他留着，换成 IMG_1685 的 28–31 秒 | 4 段轮播，见 `suyen-cta` |
| 整段 CTA 都换成领奖片 | 不是，只换男生那一小段 | 同上 |
| CTA 下面垫 BGM | 不要 BGM | 配乐在 CTA 前收掉 |

## 13. 换新个案时要改的地方

1. `proxy.sh`、`sync.py`、`ink.py`、`cut_swap.py` 里的文件名和秒数。
2. `qm1.tsx`：`OFF`、`QUESTION`、`STEPS`、`SHOTS`、标题卡的两行字、`RUYI`（换花纹）、`GRID`（九宫格在录屏里的位置）、`POSE`、`GEN`，B-roll 的名字。建议复制成 `qm2.tsx`，合成名也换。
3. `qm1_swap_test.py` 的 `MAN`（要换成什么样的人）和房间描述；`qm1_swap_all.py` 的 `CLIPS`（每段的秒数、那一句话、语气）和 `VOICE_FROM`。
4. `qm1_broll_build.py` 的 `SCENES`。
5. 老师麦克风里有没有客人插话要压低。
6. `.gitignore` 加：`remotion/public/qm2/`、`qimen-1on1/swap/`、`src/`、`out/`、`broll/`。

---
name: new-project-intake
description: 开新 project / 新客户 / 新片型时的开工问卷。先问清这个 project 的性质（卖什么、给谁看、什么味道、看什么指标、素材在哪个 Google Drive），再写出 project/<name>/EXPERTS.md（专家配方 ＋ 素材来源 ＋ 禁忌），并登记到 project/INDEX.md。只要用户说要做一个新 project、新客户、新品牌、新系列片，或者 project/<name>/EXPERTS.md 还不存在就要先跑这个。
---

# 开新 project：先问，再建档

**铁律：`project/<name>/EXPERTS.md` 不存在 → 不准开始剪片、不准写提示词。先把下面的问卷问完。**

## 第一步：问 Reagan（一次问完，别一条一条挤）

用 AskUserQuestion 一次抛 3–4 题，问不到的就按「默认」栏先填，并在文件里标 `（待确认）`。

| # | 要问的 | 为什么要问 | 问不到时的默认 |
|---|---|---|---|
| 1 | **这个 project 卖什么？**（课程／实体产品／个人 IP／门店／SaaS） | 决定主身份导演 | 个人 IP |
| 2 | **给谁看？**（受众、年龄、痛点） | 六要素里的「对象」 | 30+ 女性 |
| 3 | **要什么味道？**（东方美学大气／利落现代／接地气真实／人气热闹） | 决定叠哪几个专家 | 接地气真实 |
| 4 | **片型和比例？**（横版广告／竖版 reels／1:1 banner／webinar 长片） | 决定三段框架的时长分配 | 竖版 reels |
| 5 | **看完要他做什么动作？** | 后段促单的落点 | 私信咨询 |
| 6 | **公司 identity 在哪？**（Drive 里的 VI 手册／Logo／色票／字体／头衔标准写法／slogan／资质背书） | 片子的味道和用字都要照品牌来，不能我自己定 | 问到为止，这条不能空 |
| 6b | **照片和原片在哪？**（人物照、现场照、学员见证、产品图、视频原片、卖点资料） | 有效画面＝有证据，证据都在这里 | 问到为止，这条不能空 |
| 7 | **有没有对标爆款？**（抖音/小红书链接） | 可以照 `ai-prompt-formula` 第 4 节 1:1 复刻 | 无 |
| 8 | **禁忌 / 合规红线？** | 医疗功效、绝对化用语、行业限制 | 不出现医疗功效表述、不用绝对化用语 |

## 第二步：素材来源（Google Drive）——必填

每个 project 都要记下素材放在哪、**哪种东西去哪个资料夹拿**，以后做片不用再问一次。

- 链接直接贴 Drive 的分享链接（资料夹或文件都行）。
- **Drive 链接是私有的，不能用 WebFetch 抓**（会失败）。要读里面的东西只有两条路：
  1. **Google Drive 连接器**（MCP）：`search_files` / `read_file_content` / `download_file_content`。要先在 claude.ai 的 connector 设置里授权，否则这些工具不可用。
  2. Reagan 自己同步／下载到本地（例如 `SUYEN_RAW` 那种资料夹），我读本地路径。
- 视频原片**不要期望直接从 Drive 流式读取**来剪：先下载到本地再进 Remotion / ffmpeg 流程。
- 每个链接后面一定要写清**里面有什么、什么时候去拿**，否则等于没记。

分两块记（模板第 3A / 3B 节）：
- **3A 公司 identity**：品牌规范、Logo、色票 HEX、字体、公司名/人名/头衔标准写法、slogan、资质背书。→ 决定片子的味道、用色、用字；**提示词里的风格描述和合成里的颜色都从这里取，不准凭感觉**。
- **3B 照片 / 影像**：人物照、现场照、学员见证、产品图、视频原片、文案卖点资料。→ 决定「有效画面」拿什么当证据；**参数一律以卖点资料为准，不许自己编**（对应发布前审核第 1 条）。

## 第二步 b：Reagan 只丢一条 Drive 链接时（最常见）

**默认情况就是这样：他只给一条资料夹链接，其余由我自己摸。不要再回头追问每一个子资料夹。**

1. 从链接里取 ID：`/drive/folders/<FOLDER_ID>`、`/file/d/<FILE_ID>`、或 `?id=<ID>`。
2. 用 Google Drive 连接器逐层摸清结构（授权在 claude.ai 的 connector 设置里，Reagan 自己开）：
   - `search_files`，用 `'<FOLDER_ID>' in parents` 列出这一层；对每个子资料夹再列一次，摸 2–3 层就够。
   - 要看内容：文件用 `read_file_content`（文件）、`get_file_metadata`（类型大小）；二进制／视频用 `download_file_content`。
   - 连接器没授权 → 一句话告诉 Reagan 去 claude.ai connector 设置开 Google Drive，**不要试 WebFetch**（私有链接必失败），也不要卡住，先把别的问题问完。
3. **自己按文件名／类型归类**填进 EXPERTS.md 的 3A / 3B 两张表，不要求他分类：
   - logo / vi / brand / 品牌 / 规范 / 色 / hex / font / 字体 / 头衔 / slogan → **3A identity**
   - 人物照 / 形象 / 现场 / 授课 / 学员 / 见证 / 产品 / 场地 / `.jpg .png .heic` → **3B 照片**
   - `.mp4 .mov` / 原片 / raw / C00xx → **3B 视频原片**（注明先下载到本地再剪）
   - 课纲 / 卖点 / 文案 / `.docx .pdf .xlsx` → **3B 文案卖点资料**（参数以此为准，不许自己编）
   - 认不出的 → 照原名列在表尾，标 `（用途待确认）`，不要猜。
4. **把 identity 类的东西真的读进来**：色票抄成 HEX、字体抄全名、名字头衔 slogan 抄原文，写进 EXPERTS.md（以后写提示词和 Remotion 合成直接用，不必再开 Drive）。Logo／字体文件下载到本地备用（字体放 `remotion/public/ivyga/fonts`）。
5. 摸完给 Reagan 一个 5 行以内的回报：找到哪几类、identity 抄到了什么、哪几样缺（例：没看到色票 / 没看到资质背书），**只追缺的那几样**。

## 第三步：写档

照 `EXPERTS.template.md` 建 `project/<name>/EXPERTS.md`：
- 专家配方从 skill `ai-prompt-formula` 第 2c 节的表里挑，对不上就按答案现配（主身份 1 个 ＋ 叠加 2–4 个，最要紧的排第一）。
- 结构／镜头／节奏照 skill `selling-video-craft`。
- 建完在 `project/INDEX.md` 加一行：`| <name> | 卖什么 | 主身份 | Drive 链接 |`。
- 最后把配方念给 Reagan 听一遍（3 行以内），让他点头或改。

## 第四步：以后每次做这个 project 的片

1. 读 `project/<name>/EXPERTS.md` → 拿身份、味道、落点、禁忌
2. 要素材 → 照里面的「素材来源」去对应 Drive 资料夹／本地路径找
3. 结构套 `selling-video-craft`，提示词套 `ai-prompt-formula`
4. 出分镜检查图 → Reagan 点头 → 才渲染

# 内容片 · 每一支的 style

**每做一支内容片，开工前先在这里给它定 style，再动手剪。** 规则在 skill `suyen-content-rose`；版式和字幕样式从 **video-craft 版式库**（`reagansaw/jingjian`，100 张版式 + 657 款字幕）挑。

开工前先确认插件市场有装（没有就装，一次就好）：

```bash
claude plugin marketplace list                      # 看有没有 video-craft（reagansaw/jingjian）
claude plugin marketplace add reagansaw/jingjian    # 没有才跑
claude plugin install video-craft@video-craft       # 装插件本体
```

挑好就把「版式库第几张 / 哪一款字幕」填进下面那一支的格子，没挑就写「照玫红模板」。玫红模板的铁律照样要守：字不盖脸、1 个 B-roll、片尾人后层「正能量」、< 60 秒。

| 片 | 题目 | 原片 | 合成 | style | B-roll（只 1 个） | 版式库挑了哪一张 |
|---|---|---|---|---|---|---|
| 内容① | 防骗 4 符号 | C0055 | `SuyenC55` | 玫红 style 2 | 三只羊图（sheep_trio.png） | 待填 |
| 内容② | 2027 关键字：真 · 假 · 混 | C0057 385–540 | `SuyenC57` | 玫红 style 2（Reagan 11-02 定；金色 style 1 不用） | 火马火羊 horse_goat_v | 待填 |
| 内容③ | 真假混到底混在哪里（香港汇款骗局） | C0051 0–74 | `SuyenC51a` | 玫红 style 2 | 汇去香港 | 待填 |
| 内容④ | 破解真假混：3 个方法 | C0051 90–255 | `SuyenC51b` | 玫红 style 2 | 古人大数据 ep1_yearchart | 待填 |
| 内容⑤ | 2027 要慢？慢在哪一步 | C0053 0–74 | `SuyenC53a` | 玫红 style 2 | 岔路 p2_fork | 待填 |
| 内容⑥ | 生肖鼠 · 2026–2029 连续四年 | C0053 74–218 | `SuyenC53b` | 玫红 style 2 | 年盘 ep1_yearchart | 待填 |
| 内容⑦ | 热锅上的蚂蚁：要注意的生肖 | C0054 14–102 | `SuyenC54` | 玫红 style 2 | 年盘 ep1_yearchart | 待填 |
| 内容⑧ | 35 岁以上：第二道成长曲线 | C0056 22–133 | `SuyenC56` | 玫红 style 2 | 团队 i2_team | 待填 |
| 内容⑨ | 空亡符号：冲还是守 | C0057 3–96 | `SuyenC57a` | 玫红 style 2 | 财产洗劫 p2_loss | 待填 |
| 内容⑩ | 真假混：最担心小孩子和老一辈 | C0057 542–679 | `SuyenC57c` | 玫红 style 2 | 三只羊图 | 待填 |
| 内容⑪ | 2027 裁人还是请人？要不要扩充 | C0057 681–854 | `SuyenC57d` | 玫红 style 2 | 团队 i2_team | 待填 |
| 内容⑫ | 做战略大会的初心 | C0059 3–97 | `SuyenC59a` | 玫红 style 2 | intro_v2 | 待填 |
| 内容⑬ | 3 种人一定要来 | C0059 116–184 / 414–433 | `SuyenC59b` | 玫红 style 2 | 年盘 ep1_yearchart | 待填 |
| 内容⑭ | 3 天 · 4 大收获 | C0059 215–383 | `SuyenC59c` | 玫红 style 2 | intro_v2 | 待填 |
| 内容⑮ | 学生真实故事：美容院老板 | C0060 10–247 | `SuyenC60` | 玫红 style 2 | 100K→50K p2_loss | 待填 |
| 内容⑯ | 择日指南 2027 | （择日指南原片，不在 C0049–C0060） | `—（不是 Remotion 合成）` | 原片直出 + 下 banner | — | 待填 |

## 新的一支怎么填

1. 定题目和原片段落 → 加一行。
2. **style**：预设「玫红 style 2」。要换风格就从版式库挑一张，写成「版式库 #37 · 字幕样式 jy-214」这种写法，Claude 照它做。
3. B-roll 一支只能有一个，先看 `remotion/public/suyenbr/` 有没有现成的；要新的在 studio.aigoal.ai 建画布，**绝不按 Run**。
4. 剪完出分镜检查图 → 点头 → 渲染（步骤看 skill `suyen-content-rose` 第 4 节）。

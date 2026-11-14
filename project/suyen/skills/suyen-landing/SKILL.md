---
name: suyen-landing
description: Master Suyen（林舒苑）落地页 / landing page / 报名页 / 领取页 做法——照 Reagan 的 Canva 文案模板写字、照 suyen2027.aigoal.ai 的排版（玫红、Noto Sans SC、字体大小量过）出 HTML，一次出 Opt-in 页 + Thank you 页，再放进 app.aigoal.ai。按 category 分：lead-magnet（免费领取电子书 / 指南，Opt-in + Thank you 两页）和 webinar（免费讲座 / 战略大会，报名 + VIP 升级 + 登记成功三页）。做 Suyen 的落地页、领取页、lead magnet 页、opt-in、thank you 页、报名页时用。
---

# Suyen 落地页 · Landing page skill

> Reagan 11-12：「分 category，现在做的是 lead magnet；Opt-in page + Thank you page；跟着我的 Canva 文案模板；design 跟着现在 Suyen 的排版，字体大小等等。」
> 冲突时：Reagan 在对话里的最新指示 > 这份。

## 0. 先选 category

| category | 用在哪 | 状态 |
|---|---|---|
| **lead-magnet** | 免费领取一样东西（电子书、指南、清单），换名字 + WhatsApp + Email | ✅ 有模板：`templates/lead-magnet/`，范例 `examples/yunshi-guide/`（《1岁到100岁运势指南》） |
| **webinar** | 免费讲座、几天的战略大会，报名后卖 VIP 升级 | ✅ 有模板：`templates/webinar/`（3 页：报名 → VIP 升级 → 登记成功），照线上 suyen2027.aigoal.ai。**还没有填好的范例**，线上那页就是范例 |

lead-magnet = 两页：**Opt-in 页**（填资料）+ **Thank you 页**（领取成功，下一步）。
webinar = 三页：**报名页** → **VIP 升级页**（没有 VIP 可以卖就跳过）→ **登记成功页**。几页一起出、一起交。

## 1. 做一组页的步骤

0. **webinar 另外要问的 4 样**（lead magnet 跳过）：活动日期、每天时间、线上还是现场（Zoom / 地点）；每一天真的会讲什么；有没有 VIP（价钱、每样特权和真的定价、要不要收 SST、付款链接）；WhatsApp 社群链接。然后照 `references/copy-webinar.md` 和 `templates/webinar/` 做，下面第 2–6 步一样。
1. **问清楚 5 样**（缺了就问，不要自己编）：
   - Lead magnet 叫什么、里面有什么（照封面 / 目录写，不要加没有的内容）
   - 给谁：目标人群 + 他最痛的 3 件事
   - 封面图、老师照片（一定用真的；AI 图只能当背景装饰）
   - 领取后他会收到什么、从哪里收到（WhatsApp / Email / 下载链接）
   - Thank you 页的下一步：加 Community？报名 3 天战略大会？（链接要真的）
2. **写文案**：照 `references/copy-lead-magnet.md`，Canva 模板 8 块的顺序，一块一块填。数字、见证、头衔只用真的（线上 suyen2027 页有的才可以抄），没有就留【待补】给负责人。
3. **出 HTML**：复制 `templates/lead-magnet/optin.html` + `thanks.html` 到新资料夹，只改【】里的字和图片，**CSS 不要动**（排版数字在 `references/design.md`，是从线上页量出来的）。
4. **先出手机首屏截图给负责人看**（390 宽），点头才写完整页。改字也是先截图看，不用一直重做整页。
5. **自己检查**（第 4 节清单）＋ 有装 impeccable 的话跑一次 `/impeccable critique` 看有没有明显问题（只改问题，不换排版风格）。
6. **放进 app.aigoal.ai**：照 `references/aigoal-import.md`。上线前在手机真的填一次表，确认资料进 CRM、Thank you 页有出来。

## 2. 文案铁律（照 Canva 模板 + Suyen 页）

- **首屏只放 4 样**：顶条一句戳痛 → 小标（多久 / 什么）→ 大字结果（短语，手机一行最多 6 个字）→ 一句点名「尤其是…的你」+ 一个按钮。
- **按钮全页同一句**（例：「立即免费领取」），不要每个按钮换字。
- **封面不放答案**：讲后果 + 悬念，答案在 lead magnet 里面。
- **痛点 3 个**：标题讲后果，内文讲画面，最后一句「不是你不够努力，是…」把人带到解决方法。
- **之前 / 之后**：一条对一条，灰色是过去，玫红是之后。
- **讲师**：回答 Canva 那 4 题——你是谁、做了多久、突出成绩、现在教你做一样的事。
- 名字永远是「林舒苑」/ Master Suyen Lim；不提 Allianz。
- 马来西亚华人口语、白话，不要 AI 腔（「赋能」「助力」「深度解析」这类不用）。
- **免费东西也要讲价值**：模板的「原价 RMXXX → 现在 RMXX」，lead magnet 写「免费领取」；**原价只能写真的价钱**，没有就不写原价。

## 3. 设计铁律（照 suyen2027.aigoal.ai）

全部数字在 `references/design.md`。最常被忘记的：
- 一种中文字体 **Noto Sans SC**（数字可以用 Inter），标题 900 粗。
- 大标题：手机 55px / 电脑 80px；首屏大字：手机 72px / 电脑 120px，**米黄 #EFDFB3** 在玫红卡上。
- 内文 16–17px，行高 1.75–1.8；小字 14px。
- 按钮：药丸形（999px 圆角），高 56px，17px 700，字距 .04em。
- 每一块上下 64px（手机）/ 96px（电脑），内容最宽 1180px，两边 20px。
- 底部固定报名条（米白半透明 + 模糊），手机电脑都在，body 底部留 124px。
- 颜色只用玫红系 + 米黄 + 深酒红 + 米白底，不加别的颜色。
- **中文标题按短语包 `<span class="g">…</span>`**（inline-block），换行才会落在短语之间，不会「十二生 / 肖」这样断开；标点跟着前一个短语。首屏大字每个 `.g` 手机最多 4–5 个字。

## 4. 交件前检查

- [ ] 390 宽手机：没有横向卷动，大字没有一个字掉到下一行
- [ ] 首屏 4 样 + 1 个按钮，按钮在第一屏看得到
- [ ] 全页按钮同一句，点了都跳到表单
- [ ] 表单 3 栏：称呼、WhatsApp 号码（必填）、Email（选填）
- [ ] 没有 `<script>`（平台会剥掉）；没有编出来的数字 / 见证 / 原价
- [ ] Thank you 页：大大的「领取成功」+ 3 步下一步 + 真的链接
- [ ] 图片都是真的、有 alt，老师的脸没有被字盖住
- [ ] webinar：日期 / 时间 / 方式在首屏、表单旁边、底部固定条三处都一样；议程跟负责人对过
- [ ] webinar VIP 页：每样价值加起来等于总价值；有「不用了」链接去登记成功页；付款链接是真的

## 5. 档案

```
skills/suyen-landing/
  SKILL.md                         ← 这份
  references/copy-lead-magnet.md   ← Canva 文案模板 8 块 + Thank you 页，每块怎么填 + Suyen 范例句
  references/copy-webinar.md       ← webinar 3 页每块怎么填 + 线上 suyen2027 的范例句
  references/design.md             ← 线上页量出来的颜色、字体大小、间距
  references/aigoal-import.md      ← 放进 app.aigoal.ai 的规矩
  templates/lead-magnet/optin.html ← 空白模板（改【】就好）
  templates/lead-magnet/thanks.html
  templates/webinar/optin.html     ← 报名页（多了活动资料、适合对象、议程、FAQ）
  templates/webinar/vip.html       ← VIP 升级页（进度条、价钱、特权清单、「不用了」链接）
  templates/webinar/thanks.html    ← 登记成功页（加社群、记日历、当天准备）
  examples/yunshi-guide/           ← 填好的范例：《1岁到100岁运势指南》（文案是草稿，Community 链接未给）
                                      preview-*-mobile.jpg 是 390 宽手机截图
```

## 6. 装进 Claude Code

```bash
mkdir -p ~/.claude/skills && ln -s "$(pwd)/skills/suyen-landing" ~/.claude/skills/suyen-landing   # 在 suyen repo 根目录跑
```
本机预览：`python3 -m http.server 8978 --directory skills/suyen-landing` → 打开 `http://localhost:8978/examples/yunshi-guide/optin.html`，浏览器调成手机宽度看。

# 配图（每拍一张海报）

> Reagan 11-18：讯息也要配照片，aigoal 系统已经会生成。
> 系统接口：aigoal-ops `server.js` `/api/funnels/:id/reminder-image`（KIE gpt-image-2）。11-18 读的版本。

## 系统会做什么

- 1:1 正方形海报，自动带参考图：品牌 logo、讲师照（Settings 里「人物」角色是讲师 / 老板的那张）、产品图。
- 跟品牌色。
- 默认**不放日期时间**，避免每周滚动的活动下一场图就错了。一次性活动要放日期，可以打开（见下面 `include`）。
- 讲师照放几张，海报上就锁几个人，不会多出一张 AI 乱加的脸。
- 每张图要 20–100 秒，生成后存进系统（KIE 的链接 24 小时就过期，系统会自己下载存好）。
- **用的是系统的生图额度**，所以先看 prompt，确认了才生成。

## 哪几拍要配图

| beat | 要不要 | 海报重点 |
|---|---|---|
| `A_GATE` | 要 | 活动名 ＋ 讲师 ＋「免费线上 Live」 |
| `AY` | 可选 | 小礼物的样子（有真的礼物图就上传，不要 AI 画假的） |
| `B` | 要 | 「明天见」的感觉 ＋ 讲题 |
| `C` | 可选 | 「今晚」 |
| `C2` | 要 | 「LIVE NOW 直播中」 |

有图的那拍，WhatsApp 是**图 ＋ 文字当说明**发出去；送审时会注册成带图片头的模板。之后换图不用重新审。

## 步骤

1. **先出 prompt，不花额度**：`POST /api/funnels/<funnel_id>/reminder-image`，body 填 `{ "kind": "A_GATE", "brief": "<一句给设计的话>" }`。
   - 会回 `prompt`、参考图清单 `refs`、品牌色 `colors`。
   - `brief` 用落地页的主视觉概念写，例如：「夜里的迷雾 → 天亮，冷灰转暖橙，标题《玄学群英会》，副标 12 月天冲地克」。
   - 要放日期：加 `"include": { "date": true, "time": true }`。
2. **给负责人看 prompt 和参考图**。不对就改 prompt 或 `brief`。
3. **真的生成**：同一个接口，再带上 `"prompt": "<确认过的 prompt>"`。可选带 `ref_urls`（只用勾选的参考图）和 `colors`（`{c1, c2}`）。会回 `task`。
4. **拿成品**：`GET /api/funnels/<funnel_id>/reminder-image-status?task=<task>`，每 10 秒问一次，等到 `state: "ok"`，拿 `url`。
5. **挂上去**：把 `url` 放进 `reminders.json` 的 `media`：`{ "A_GATE": "<url>", "B": "<url>" }`，跟文字一起送（见 `aigoal-setup.md` 第 3 步）。
6. 截图或下载给负责人看。图上的字要对：活动名、讲师名字（林舒苑 / Master Suyen Lim）。**AI 写错字是常见的**，错了就重做。

## 不可以

- 图上不放价钱、不放保证（「包你转运」）、不放假的 QR code。
- 讲师的脸只用她真的照片当参考，不要 AI 生成一个「像她的人」。
- 不用别人的照片或新闻图。

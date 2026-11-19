# 放进 aigoal：留言链条

> 出处：aigoal-ops `automations.js`（social_comment 触发、social_reply / social_dm 步骤、branches）、`social.js`、`server.js`。11-18 读的版本。系统改过就先看 `https://app.aigoal.ai/api/docs`。
> 钥匙怎么拿：照 `suyen-whatsapp` 技能的 `references/aigoal-setup.md` 第 1 段。钥匙只用对方贴来的，不写进任何档案。

## 1. 先看现况（只读）

- `GET /api/wa/bots`：拿 bot 的 `id` 和现在的 `settings.automations`（全部链条）。
- `GET /api/social/posts`：最近的贴文，拿 `post_id`。或 `POST /api/social/resolve-post`，body 填 `{ "ref": "<贴文链接>" }`，把链接换成 ID。
- 确认专页 / IG 已经接上 aigoal（贴文清单拿得到就是接上了）。

## 2. 链条 JSON（`chain.json`）

```json
{
  "id": "yunshiguide",
  "name": "留言『指南』→ 私讯发运势指南",
  "enabled": true,
  "action": { "type": "flow" },
  "trigger": {
    "type": "social_comment",
    "match": "contains",
    "keywords": ["指南", "zhinan"],
    "posts": { "<post_id>": true }
  },
  "flow": [
    {
      "kind": "social_reply",
      "text": "私讯你了，记得看看 Requests 📩\n已经发给你啦，去私讯看看 🙏\n发了！没看到就去讯息请求找找 😊\n收到～指南在你的私讯里了 📥"
    },
    {
      "kind": "social_dm",
      "text": "嗨 {name} 🙏\n你要的《1岁到100岁运势指南》准备好了。\n点下面的按钮，我马上发给你 👇\n\n—林舒苑\nMaster Suyen Lim",
      "branch_style": "button",
      "branches": [
        {
          "id": "get",
          "label": "发给我 📩",
          "flow": [
            {
              "kind": "social_dm",
              "text": "来了 {name} 🙌\n\n先找你自己出生年份的那一页。\n\n老师的 Live 和每月提醒，\n都先在 WhatsApp 公布 👇\n\n—林舒苑\nMaster Suyen Lim",
              "buttons": [
                { "text": "📥 领取指南", "kind": "url", "value": "<资料链接>" },
                { "text": "💬 加入 WhatsApp", "kind": "url", "value": "<WhatsApp Community 链接>" }
              ]
            },
            { "kind": "tag", "tag": "ig_yunshi_guide" }
          ]
        }
      ]
    }
  ]
}
```

要点：
- **`branch_style` 一定要写 `"button"`**。不写，系统默认是 `quick`（quick reply）。
- `trigger.match`：
  - `contains`：留言里有关键字就算（建议）。
  - `word`：要整个词对上。
  - `any`：任何留言都触发，不建议。
- 套用哪几篇：
  - `posts: { "<post_id>": true }`：只这几篇。**每篇默认是关的**，要列出来。
  - 或 `"all_posts": "ig"` / `"fb"` / `"all"`：这个平台全部贴文，以后发的也算。会对所有贴文的关键字留言开火，要负责人点头。
- 公开回覆 `social_reply` 的 `text`：一行一句，系统随机挑一句。
- 链条里**第一个 `social_dm`** 会用 private reply 发（回那个留言）。之后的 `social_dm` 用一般私讯发，要在他点按钮后 24 小时内。
- 按钮 `kind`：`url` 打开网址；`tag` 点了贴标签。最多 3 个，文字 ≤ 20 字符。分叉 `branches` 最多 4 条。
- `{name}` 会换成他的名字；`{keyword}` 换成他留言的关键字。按钮网址也可以用 `{name}`、`{keyword}`、`{lid}`。
- 系统会挡：每个专页每小时私讯上限（默认 20）、同一个人 24 小时只跑一次、同一个留言只回一次。
- **要 follow up**：在 `branches[].flow` 里，接在第二条私讯后面再加一个 `social_dm`，用 `wait_min` 设「距上一步几分钟」，例如 20 小时就填 `1200`：
  ```json
  { "kind": "social_dm", "wait_min": 1200,
    "text": "嗨 {name}，指南领到了吗？🙏\n还没打开的话，点下面再拿一次 👇\n\n—林舒苑\nMaster Suyen Lim",
    "buttons": [{ "text": "📥 领取指南", "kind": "url", "value": "<领取页链接>" }] }
  ```
  - `wait_min` 是从他点「发给我」那一刻起算（中间的步骤也会加进去）。全部加起来**不可以超过 1,440（24 小时）**，建议 ≤ 1,200。
  - 支线里只能放 `social_dm`、`tag`、`notify`。不能再分叉（一层而已），所以「他点了再追」那一种，要另外用 `tag` 按钮点火另一条链条，做之前先跟负责人讲清楚。
  - 11-18 用 `automations.flowScheduleSocial` 跑过：`wait_min: 1200` 那条排在点按钮后 20 小时。
- 上面这份 JSON 11-18 用 aigoal 的 `automations.validate` 跑过：触发、两条私讯、按钮、`branch_style: button`、`tag` 都保留下来。

## 3. 写进去（先讲给负责人听，他点头才打）

1. 从 `GET /api/wa/bots` 拿到那个 bot 现在的 `settings.automations`（全部链条）。
2. 把新链条**加在后面**。同一个 `id` 已经有了就替换那一条。**不要删掉其他链条。**
3. `POST /api/wa/bots/<bot_id>`，body 填 `{ "settings": { "automations": [ …全部链条… ] } }`。
   - ⚠️ 这个接口是**整个清单覆盖**：少传一条，那条就被删了。所以一定要先拿现况、再整份送回去。
   - 送之前把「原本几条 → 送出几条」念给他听，数字要对。
4. 再 `GET /api/wa/bots` 一次，确认新链条在、旧的都还在、`branch_style` 是 `button`。

## 4. 测

- 用一个**不是专页管理员**的账号，去那篇贴文留言关键字（管理员自己的留言系统会忽略）。
- 看三件事：
  1. 留言下面有没有公开回覆。
  2. 有没有收到私讯，有没有「发给我 📩」按钮（IG 没关注的话在 Requests）。
  3. 点按钮后，有没有收到第二条和两个按钮，按钮打不打得开。
- 在 IG **网页版**也看一次按钮显不显示。
- 有错：看 aigoal 里那条链条的发送记录（错误会记在 `err`）。
- 测过才说「好了」。

## 5. 贴文本身（可选）

- **发贴文**：`POST /api/social/schedule`。栏位：`page_id`、`platforms`、`type`、`caption`、`image_url` / `video_url`、`publish_at`（`"now"` 或时间）、`first_comment`。**发出去就公开了**，一定要负责人说「发」才打。
- 发贴文**不会**自动建留言链条：发了之后拿 `post_id` 填进链条，或链条用 `all_posts`。
- **贴文配图**：`POST /api/broadcast/gen-image`，body 填 `{ "text": "<贴文文案>", "brief": "<一句给设计的话>" }`。
  - 第一次只回 prompt 和参考图，不花额度。
  - 给负责人看过，再带上 `"prompt"` 打一次，才真的生成，会回 `task`。
  - 用 `GET /api/broadcast/gen-image-status?task=<task>` 等到 `state: "ok"`。
  - 规矩照 `suyen-whatsapp` 的 `references/photo.md`（不放价钱、讲师的脸只用真照片、图上的字要对过）。

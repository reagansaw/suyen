# 放进 aigoal 系统（拿 API key → 送进去）

> Reagan 11-18：讯息和照片做好、负责人说可以之后，问他要不要放进系统；要的话，一步一步教他拿 API key。
> 接口出处：aigoal-ops `server.js`。11-18 读的版本，系统改过就先看 `https://app.aigoal.ai/api/docs`。

## 0. 先问，不要自己冲

讯息和照片交件、负责人说 OK 之后，问他一句：

> 「要我直接放进 aigoal 系统吗？要的话，我教你拿一把钥匙（API key），1 分钟。」

他说不要，就到此为止：他自己照 txt 贴进系统。

## 1. 教他拿钥匙（两种，挑一种）

先问他：**「你在 aigoal 是 Management（管理层）吗？」**

### A. 他是 Management → 长期 API 钥匙（推荐，不会过期）

1. 登入 **app.aigoal.ai**。
2. 进 **Agency Portal**，按 **「长期 API 钥匙」**（钥匙图案）。
3. 按建立，名字写「WhatsApp 讯息 · Claude」。
4. 复制那串 `aig_ak_…`。**只显示一次**，复制好再关。
5. 贴给 Claude。
6. 再告诉 Claude **是哪个客户**（例：Master Suyen Lim）。Claude 用 `GET /api/agency/tenants` 找出 tenant ID，**找到后念给他确认一次**。

用法：`Authorization: Bearer aig_ak_…` ＋ `x-impersonate-tenant: <tenant_id>`。

### B. 不是 Management → 登入 token（1 小时过期）

1. 用**那个客户的账号**登入 **app.aigoal.ai**（或能切换进那个客户的账号）。
2. 打开 Console：Mac 按 `Cmd + Option + J`，Windows 按 `Ctrl + Shift + J`。
3. 贴这一行，按 Enter：
   ```
   copy(JSON.parse(localStorage.ag_supa_session).access_token)
   ```
   显示 `undefined` 是正常的，钥匙已经复制好了。
4. 贴给 Claude。**1 小时后过期**，过期了 Claude 会请他再拿一次。

用法：`Authorization: Bearer <token>`。如果是 staff 切进客户，再加 `x-impersonate-tenant: <tenant_id>`。

### 钥匙的规矩

- 钥匙等于他的账号。存在 scratchpad 的暂存档，**不要写进 skill、txt、README、git**。
- 用完提醒他：长期钥匙不用了，就在同一个地方撤销。
- 不要自己去电脑里翻钥匙；只用他贴给你的。

## 2. 先看系统现况（只读）

- `GET /api/funnels`：这个活动有没有漏斗了。有就用它的 `id`，**不要另外建一个**。
- 先确认号码是不是官方号：`GET /api/waba/templates`，看回来的 `waba`。`false` 就是扫码号：第 5 步送审跳过，而且扫码号发不了模板按钮，只有文字。

## 3. 每一步写之前，先给负责人看「要写什么、写去哪」

照下面的顺序，**每一步说一句给他听，他点头才打**。

1. **没有漏斗 → 把落地页汇入成漏斗**
   - `POST /api/landing/import`，body 填 `{ "mode": "asis", "pages": [{ "html": "<optin.html>", "role": "optin" }, { "html": "<thanks.html>", "role": "thanks" }] }`
   - 再 `POST /api/funnels/<id>/kind`，body 填 `{ "kind": "webinar" }`
   - ⚠️ 表单里 `<input type="hidden" name="funnel">` **没有用**，系统不会送出去。报名页一定要是漏斗的 optin 页，报名后才会触发提醒。
   - 页面里的相对路径图片（`logo.png`）不会跟着上去，要先上传或换成网址。
2. **设活动时间**
   - `POST /api/funnels/<id>/webinar-time`，body 填 `{ "at": "2026-12-01T21:00", "location": "<进场链接>" }`
   - 没写时区就当马来西亚时间。
   - `location` 就是 `{zoom}` 会换成的链接（FB 群组 / Zoom）。
3. **送文字、按钮、拍子、配图**：`POST /api/funnels/<id>/reminders`，body 就是 `reminders.json`：
   ```json
   {
     "reply_gate": true,
     "community_url": "<WhatsApp Community 链接>",
     "overrides": { "A_GATE": "…", "AY": "…", "B": "…", "C": "…", "C2": "…" },
     "media": { "A_GATE": "<图 url>", "B": "<图 url>", "C2": "<图 url>" },
     "beats": { "C": { "h": -3 }, "C2": { "h": 0 }, "F1": false, "F2": false, "F3": false },
     "reminder_buttons": { "A_GATE": "quick", "B": "quick" },
     "reminder_btn_text": { "A_GATE": "YES", "B": "YES 我会出席" }
   }
   ```
   回来的 `warnings` 念给他听（例如「疑似写死了日期」）。
4. **预览**：`GET /api/funnels/<id>/beats-preview`，把每拍几点发、发什么给他看。
5. **送 Meta 审核**（只有官方号）：每拍各打一次 `POST /api/waba/templates/register-beat`，body 填 `{ "funnel_id": "<id>", "kind": "A_GATE" }`。`B`、`C`、`C2` 也各一次；`AY` 不用。
   - **这一步是对外的**，送出去就进 Meta 审核。送之前再问一次。
   - 审核要时间：第一封（报名当下）要用到之前就要批好。
   - `GET /api/waba/templates` 看状态（approved / pending / rejected）。被拒的，把 `reject_reason` 念给他，改文字再送。
6. **发布**：`POST /api/funnels/<id>/publish`。**会让页面公开上线**，一定要他说「发布」才打。

## 4. 做完报告

一张表：每拍几点发、文字送了没、图挂了没、审核状态。再列还没做的（例：C2 还在审、Community 链接还没给）。

**不要说「全部搞定」**，除非：
- 每拍都 approved；
- 他用自己的号码报名测过一次，收到第一封、回了 YES、也收到链接。

建议他测一次。

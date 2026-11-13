# 放进 app.aigoal.ai

（来源：AIgoal webinar funnel 11-05 导入版的做法 + aigoal 落地页 asis 导入。新 category 第一次放的时候，照这份做完要在手机真的填一次表确认。）

1. **不能有 `<script>`**：平台导入会剥掉。模板已经不用 JS（按钮是 `href="#claim"` 跳到表单）。
2. **表单**：`<form ... data-aigoal-lead>`，栏位 `name`（称呼）、`phone`（WhatsApp）、`email`（选填）。要分来源就加 hidden `<input type="hidden" name="funnel" value="...">`。
3. **图片**：本机的 `cover.jpg` 这些要先上传到平台（落地页编辑器的图片 / 媒体库），再把 `src` 换成平台给的网址。不要留本机路径。
4. **影片**（如果有见证影片）：用平台的影片占位 `data-aigoal-video`，不要直接贴 iframe。
5. **Thank you 页**：在 funnel 里设成「提交后跳转」的那一页。WhatsApp Community 链接：webinar funnel 用过 `{{community}}` 占位；lead magnet funnel 能不能用同一个占位**还没验证**——不确定就直接贴真的链接。
6. **上线前**：手机打开 → 填一次真的资料 → 看有没有跳 Thank you 页 → 去 aigoal CRM 看名单有没有进来 → WhatsApp 有没有收到东西。
7. 复制页面（copy）**不会**带过去：发布状态 / 网址、Google Sheet 绑定、form_tag、funnel 归属——新页要自己补这几样。

## webinar 另外要注意（还没在平台上实测过这套模板）

8. **3 页的跳转**：报名页设「提交后跳转」→ VIP 升级页；VIP 页的「不用了」链接和付款成功后都 → 登记成功页。
9. **VIP 付款**：模板的升级按钮只是一个链接 `href="【付款链接】"`，要换成平台给的收款链接。线上 suyen2027 的 VIP 页是用平台自己的付款功能（有 JS），**这套不带 JS 的模板接不接得上同一个功能还没验证**——放之前先问 Reagan 用哪一种。
10. **分类题**：表单多了 `joined_before`、`want`、`consent` 三栏。这三栏会不会进 CRM **还没验证**，上线前填一次真的看 CRM 有没有。
11. **社群链接**：webinar funnel 用过 `{{community}}` 占位，登记成功页可以用它代替直接贴链接。

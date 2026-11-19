# 排版数字（2026-11-12 从 suyen2027.aigoal.ai 线上页量的）

在浏览器用 390×844（手机）和 1280×800（电脑）量 computed style。模板的 CSS 就是照这些写的，**不要改**。

## 颜色（:root）

| 变数 | 色号 | 用在哪 |
|---|---|---|
| `--crimson` | `#D03F58` | 主按钮底、强调字 |
| `--crimson-600` | `#B83349` | 首屏卡底色、小字红（米白底上 5.3:1） |
| `--crimson-700` | `#8E2438` | 渐层深的那边 |
| `--crimson-900` | `#3B0F18` | 顶条底色、讲师卡底 |
| `--beige` | `#EFDFB3` | 首屏大字、顶条数字、勾勾圈 |
| `--canvas` | `#FAF5E6` | 整页底色 |
| `--surface` | `#FFFFFF` | 卡片 |
| `--ink` | `#2A1418` | 标题、内文 |
| `--muted` | `#5E4A4C` | 内文次要、sub |
| `--line` | `#E6D9B8` | 线、输入框边 |
| `--pill-bg` | `#F6E3E6` | 小标签（「适合对象」）底色 |

首屏卡：底 `#B83349` + 两个 radial-gradient（右上 `#DC4D65` 亮光、左下深色），圆角手机 26px / 电脑 32px。

## 字体

- 中文 `"Noto Sans SC","PingFang SC","Microsoft YaHei",system-ui,sans-serif`（Google Fonts 载 400/700/900）
- 数字 / 英文强调 `"Inter","Noto Sans SC"`（顶条 99%、讲师数字）

| 元素 | 手机 390 | 电脑 1280 | 粗 | 行高 | 其他 |
|---|---|---|---|---|---|
| 顶条（topban） | 17px，数字 17.5px | 同 | 400 / 数字 900 | 1.8 | 底 `#3B0F18`，字 `#FFFAEB`，数字 `#EFDFB3`，padding 12px 20px |
| 首屏小标（h1 .l1） | 25px | 40px | 900 | 1.3 | 白，字距 .8px |
| 首屏大字（h1 .l3） | 72px | 120px | 900 | 1.12 | 米黄 `#EFDFB3`，短语用 `.g` inline-block 包起来 |
| 首屏 lead | 14px | 14–16px | 400 | 1.75 | `rgba(255,250,235,.9)` |
| 区块大标题（h2） | 55px | 80px | 900 | 1.2 | 字距 -0.01em，强调字用 `--crimson` |
| sub（标题下那句） | 14px | 14px | 400 | 1.75 | `--muted`，电脑最宽 504px |
| 卡片标题（h3） | 24px | 24px | 900 | 1.4 | |
| 卡片内文 | 16px | 16px | 400 | 1.75 | `--muted` |
| 内文 body | 17px | 17px | 400 | 1.8 | |
| 小标签 pill | 13px | 13px | 800 | — | 字 `#B83349` 底 `#F6E3E6`，padding 6px 14px，999px，字距 1px |
| 讲师数字 dt | 32px | 32px | 900 | 1.2 | Inter |

## 按钮

- `.btn`：inline-flex，min-height **56px**，padding 0 30px，圆角 **999px**，`700 17px/1`，字距 .04em
- 首屏上：白底 `#FFFFFF` 字 `#B83349`，大一号 19px（`.btn-big`），手机宽 100%
- 其他地方：`--crimson #D03F58` 底白字

## 间距 / 版面

- `section` 上下 **64px（手机）/ 96px（电脑）**
- `.wrap` 最宽 **1180px**，两边 20px（含 safe-area）
- 首屏卡外面 margin 12px 20px；卡里 padding 44px 20px（电脑 90px）
- 卡片圆角 22px，大卡 32px；阴影 `0 1px 2px rgba(42,20,24,.05), 0 8px 24px rgba(42,20,24,.06)`

## 底部固定报名条（mbar）

- `position:fixed; bottom:0`，底 `rgba(250,245,230,.96)` + `backdrop-filter: blur(10px)`，padding 10px 20px，阴影 `0 -8px 24px rgba(42,20,24,.08)`
- 上面一行小字（日期 / 「免费领取」说明），下面主按钮全宽
- `body { padding-bottom: 124px }` 免得盖到最后的内容

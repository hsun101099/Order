# 簡易點餐系統 · Order Studio

一套展示型（Prototype）點餐系統，設計語彙參考 Apple / Notion / Linear / Stripe Dashboard：
極簡、留白充足、卡片式介面、16px 圓角、柔和陰影、微動畫與完整 RWD。

所有資料皆為 Mock Data，操作結果保存在瀏覽器 `localStorage`，沒有任何後端串接。

## 功能

**點餐流程（三步驟）**

1. 選擇一份主餐：起司牛 / 花生牛 / BBQ 豬 / 酸辣雞腿
2. 選擇一杯飲料：汽水 / 無糖茶
3. 填寫取餐姓名（可加備註）→ 送出後顯示訂單編號與金額

每一份訂單固定為「一份餐點 + 一杯飲料」，因此兩個步驟皆為單選。

**訂單總覽**

- 四張 Summary Card：總訂單、處理中、已完成、已取消
- 三張圖表：餐點分布（Bar）、飲料比例（Donut）、近 8 小時訂單量（Trend）
- 訂單列表：搜尋（姓名 / 訂單編號 / 餐點 / 飲料 / 金額）、狀態 Filter、進度百分比、狀態 Badge
- 等候提醒：未完成且建立超過 20 分鐘的訂單整列轉淡紅、出現「⚠ 等候逾 20 分」標記，並累計於右上角通知
- 點擊任一筆開啟右側 Drawer（不跳頁）：訂單摘要、可展開的流程 Timeline、備註編輯、推進流程 / 取消訂單

**狀態流**

`待製作 → 製作中 → 可取餐 → 已完成`，任何階段皆可取消。

| 狀態 | Badge 顏色 | 進度 |
| --- | --- | --- |
| 待製作 | 灰 | 25% |
| 製作中 | 琥珀 | 60% |
| 可取餐 | 青綠 | 85% |
| 已完成 | 綠 | 100% |
| 已取消 | 紅 | — |

## 執行方式

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 產出 dist/
npm run preview  # 預覽 build 結果
```

需求：Node.js 18 以上。

## 資料夾架構

```
.
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src
    ├── main.jsx                 # React 進入點
    ├── App.jsx                  # 版面組合、頁面切換、Drawer / Toast 狀態
    ├── index.css                # Tailwind 與共用 class（card / focus-ring）
    ├── components
    │   ├── Sidebar.jsx          # 側邊導覽（桌機固定 / 手機抽屜）
    │   ├── Header.jsx           # 標題、日期、通知、使用者頭像
    │   ├── SummaryCard.jsx      # 統計卡片
    │   ├── Chart.jsx            # BarChart / DonutChart / TrendChart
    │   ├── SearchBar.jsx        # 搜尋框
    │   ├── FilterTabs.jsx       # 狀態篩選（Framer Motion layoutId 滑動）
    │   ├── OrderTable.jsx       # 訂單表格（桌機）＋卡片列表（手機）、逾時判定
    │   ├── StatusBadge.jsx      # 狀態 Badge
    │   ├── ProgressBar.jsx      # 進度條
    │   ├── Drawer.jsx           # 通用右側 Drawer（ESC 關閉、鎖背景捲動）
    │   ├── OrderDrawer.jsx      # 訂單明細 Drawer 內容
    │   ├── Timeline.jsx         # 可展開的流程 Timeline
    │   ├── StepIndicator.jsx    # 點餐步驟指示器
    │   ├── OptionCard.jsx       # 餐點 / 飲料選擇卡
    │   └── Toast.jsx            # 操作回饋提示
    ├── pages
    │   ├── OrderPage.jsx        # 點餐流程與訂單摘要
    │   └── DashboardPage.jsx    # 統計、圖表與訂單列表
    ├── hooks
    │   └── useOrders.js         # 訂單狀態管理與 localStorage 持久化
    ├── data
    │   ├── menu.js              # 餐點、飲料與色彩語彙
    │   ├── orderStatus.js       # 狀態定義、流程順序、篩選項目
    │   └── mockOrders.js        # 20 筆展示訂單
    └── utils
        └── format.js            # 日期、金額、相對時間格式化
```

## 設計規格

| 用途 | 色碼 |
| --- | --- |
| 背景 | `#F8FAFC` |
| 卡片 | `#FFFFFF` |
| Primary | `#2563EB` |
| Success | `#16A34A` |
| Warning | `#F59E0B` |
| Danger | `#DC2626` |
| 主要文字 | `#0F172A` / `#334155`（深灰，非純黑） |

- 圓角：卡片 16px、控制元件 12px
- 動效：Framer Motion（Drawer 彈簧滑入、卡片進場、進度條與圖表補間、Filter 滑動指示）
- 圖示：Lucide Icons
- 圖表：以 SVG / CSS 自繪，不額外引入圖表函式庫

## 技術假設

- 餐點與飲料價格為展示用設定（主餐 110–130 元、飲料 30 元），可於 `src/data/menu.js` 調整
- 「等候過久」門檻設為 20 分鐘，可於 `src/components/OrderTable.jsx` 的 `DELAY_THRESHOLD_MINUTES` 調整
- Timeline 各階段的負責人 / 說明為情境示意文字，位於 `src/components/Timeline.jsx`

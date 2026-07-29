# 今天吃什麼

一個給一群人一起點餐用的小工具。選餐點、選飲料、寫名字，然後在同一頁看到大家點了什麼。

沒有後台、沒有報表、沒有流程審核 — 資料存在瀏覽器 `localStorage`，重新整理還在。

## 怎麼用

**我要點（三步，選完自動往下）**

1. 選一份主餐：起司牛 / 花生牛 / BBQ 豬 / 酸辣雞腿
2. 選一杯飲料：汽水 / 無糖茶
3. 寫下名字（想備註「不要洋蔥」也可以）

每個人固定一份餐配一杯飲料，所以兩步都是單選。

**大家點的**

- 最上面一句話看完：幾個人、各餐幾份、總共多少錢，一鍵「複製訂單」可直接貼到群組
- 餐點與飲料統整卡：每個品項幾份，以及**點的人是誰**（名字 chip）
- 每個人點的：頭像、名字、餐點 · 飲料 · 備註、金額，滑過可刪除
- 「重來一輪」可以清空重新開始

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
    ├── App.jsx                  # 頁面切換與共用狀態
    ├── index.css                # Tailwind 與共用 class
    ├── components
    │   ├── TopBar.jsx           # 品牌、日期與「我要點 / 大家點的」切換
    │   ├── StepIndicator.jsx    # 三步驟指示器
    │   ├── OptionCard.jsx       # 餐點 / 飲料選擇卡
    │   ├── TallyCard.jsx        # 單一品項的統整（幾份 + 誰點的）
    │   ├── PersonList.jsx       # 每個人點了什麼
    │   └── Toast.jsx            # 操作回饋提示
    ├── pages
    │   ├── OrderPage.jsx        # 點餐三步驟
    │   └── SummaryPage.jsx      # 大家點的統整
    ├── hooks
    │   └── useOrders.js         # 訂單資料、統整計算與 localStorage
    ├── data
    │   ├── menu.js              # 餐點、飲料與色彩語彙
    │   └── mockOrders.js        # 15 筆展示資料
    └── utils
        └── format.js            # 日期、金額、相對時間格式化
```

## 設計

| 用途 | 色碼 |
| --- | --- |
| 背景 | `#F8FAFC` |
| 卡片 | `#FFFFFF` |
| Primary | `#2563EB` |
| Success | `#16A34A` |
| Danger | `#DC2626` |
| 文字 | `#0F172A` / `#334155`（深灰，非純黑） |

- 單欄置中版面，最寬 768px，手機到桌機都是同一套節奏
- 圓角 16–24px、柔和陰影、Hover 微浮起
- 動效使用 Framer Motion：卡片依序進場、步驟切換、名字 chip 彈入、刪除滑出
- 圖示使用 Lucide Icons

## 可以調整的地方

- 餐點與飲料價格：`src/data/menu.js`（主餐 110–130、飲料 30，為展示用設定）
- 展示資料：`src/data/mockOrders.js`

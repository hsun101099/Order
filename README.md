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
- 最下方可**下載 PDF**：一份排版乾淨的統整單據（總計、餐點、飲料、每個人點的），檔名 `order-summary-YYYY-MM-DD.pdf`

## 執行方式

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 產出 dist/
npm run preview  # 預覽 build 結果
```

需求：Node.js 18 以上。**沒有設定 Firebase 也可以直接跑**，資料會存在瀏覽器本機。

## 接上 Firebase

專案建好之後照著做，程式碼不用改：

1. Firebase Console → 建立專案 → 建立 **Firestore Database**（正式或測試模式皆可）
2. 專案設定 → 一般 → 你的應用程式 → 新增「網頁應用程式」，複製 SDK 設定
3. 把 `.env.example` 複製成 `.env.local`，填入下列值：

   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

4. 重新啟動 `npm run dev`

填好之後會自動切換成 Firestore：多台裝置、多個人同時點餐都會**即時同步**（用 `onSnapshot` 監聽），統整頁下方會顯示「已連線 Firebase」。沒填就維持本機模式，兩種模式的操作完全一樣。

**若畫面上出現「尚未連上 Firestore」的黃色提示**，最常見的原因是專案還沒有建立 Firestore 資料庫
（Firebase Console → 建置 → Firestore Database → 建立資料庫）。此時 SDK 會退回離線快取繼續運作，
但點的餐不會同步給其他人，所以介面會明確標示出來，而不是安靜地顯示空清單。

**安全規則**：`firestore.rules` 附了一份可直接部署的規則（開放讀寫，但限制欄位與字數）。這是給熟人小圈子用的設定；要公開給不特定人使用前，請改成需要登入：

```bash
firebase deploy --only firestore:rules
```

**注意**：連線 Firebase 時「重來一輪」＝清空 Firestore 裡的 `orders` collection（不會再塞入展示資料）；本機模式則會還原成展示資料。

資料結構（`orders` collection，一份文件 = 一個人的餐）：

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `customerName` | string | 姓名 |
| `mealId` | string | 餐點代號，如 `cheese-beef` |
| `drinkId` | string | 飲料代號，如 `soda` |
| `note` | string | 備註，可為空字串 |
| `total` | number | 金額 |
| `createdAt` | timestamp | 由 `serverTimestamp()` 寫入 |

## 資料夾架構

```
.
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example                 # Firebase 設定範本
├── firestore.rules              # Firestore 安全規則
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
    │   └── useOrders.js         # 訂單資料訂閱與統整計算
    ├── lib
    │   ├── firebase.js          # Firebase 初始化與設定偵測
    │   └── ordersRepository.js  # 資料來源：Firestore 即時同步 / 本機儲存
    ├── data
    │   ├── menu.js              # 餐點、飲料與色彩語彙
    │   └── mockOrders.js        # 15 筆展示資料
    └── utils
        ├── format.js            # 日期、金額、相對時間格式化
        └── exportPdf.js         # 統整單據排版與 PDF 匯出
```

`useOrders` 只認 `ordersRepository` 的介面（`subscribe` / `add` / `remove` / `reset`），
所以有沒有 Firebase 對畫面元件完全透明。

## PDF 匯出

- 點統整頁最下方的「下載 PDF」即可，PDF 相關套件是**點下去才載入**（動態 import），不影響首次開啟速度
- 匯出的不是網頁截圖，而是另外排版的 A4 單據；內容超過一頁會自動分頁
- 中文直接使用系統字型（`html2canvas` → `jsPDF`），不需要另外嵌入字型檔
- 檔名刻意使用英數（`order-summary-2026-07-29.pdf`）：部分瀏覽器與作業系統會丟棄含中文的下載檔名，連副檔名一起遺失

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

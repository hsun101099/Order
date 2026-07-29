# 點餐

一個給一群人一起點餐用的小工具。選餐點、選飲料、寫名字，然後在同一頁看到大家點了什麼。

**每個人固定點兩份**：兩份主餐 + 兩杯飲料，數量在介面、資料層與 Firestore 規則三處都有把關，不能多點或少點。

沒有後台、沒有報表、沒有金額計算 — 只看得到誰點了什麼。

## 怎麼用

**我要點（三步，選完自動往下）**

1. 選兩份主餐：起司牛 / 花生牛 / BBQ 豬 / 酸辣雞腿（同一款可以點兩份）
2. 選兩杯飲料：汽水 / 無糖茶（兩杯可以一樣）
3. 寫下名字

每張卡片用 +／− 調整份數，右上角顯示「已選 n / 2 份」；選滿兩份會自動前往下一步，
選滿之後 + 按鈕會停用，因此不可能多選，也不能少於兩份就往下走。

**大家點的**

- 一人一列，顯示名字與他的兩份餐點、兩杯飲料
- **只能刪除自己點的**：這台裝置送出的那幾筆會標示「你」並顯示刪除鍵，別人的沒有
- 「重來一輪」可以清空重新開始

**統整**

- 幾個人、共幾份，以及餐點與飲料各自的品項份數
- 「複製統計」把文字版統計複製起來，可直接貼到群組
- **下載 PDF**：A4 橫式兩頁（第一頁每個人點的、第二頁份數統計），檔名 `order-summary-YYYY-MM-DD.pdf`

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
| `meals` | array | 兩個餐點代號，如 `['cheese-beef', 'bbq-pork']` |
| `drinks` | array | 兩個飲料代號，如 `['soda', 'soda']` |
| `createdAt` | timestamp | 由 `serverTimestamp()` 寫入 |

安全規則會檢查 `meals` 與 `drinks` 的長度必須剛好是 2，所以就算有人繞過介面直接寫入，
份數不對的資料也會被拒絕。

**改動欄位時記得同步更新規則。** 規則使用 `hasOnly` 限制欄位，
資料結構改了卻沒重新發布規則，寫入會被擋下（`permission-denied`），
畫面上會出現紅色提示說明這筆餐點被退回。

## 部署到 GitHub Pages

已經設定好自動部署：**推送到這個分支，GitHub Actions 就會自動打包並上線**。

第一次需要先開啟 Pages（只做一次）：

1. GitHub repo → **Settings** → 左側 **Pages**
2. **Source** 選 **GitHub Actions**（不是 Deploy from a branch）
3. 回到 **Actions** 分頁，確認 `Deploy to GitHub Pages` 這個 workflow 跑完（約 1～2 分鐘）

> **第 2 步一定要做。** 如果 Source 停留在「Deploy from a branch」，
> GitHub 會另外跑一個 `pages build and deployment`，把 repo 根目錄當成網站發佈，
> 並且覆蓋掉本 workflow 的部署結果。根目錄的 `index.html` 是 Vite 的開發進入點
> （引用 `/src/main.jsx`，正式站上不存在），因此網站會顯示**一片空白**。
> 症狀是：Actions 顯示部署成功，但打開網址什麼都沒有，而且 Actions 清單裡
> 同時有兩個部署紀錄在跑。

完成後網址是：

```
https://hsun101099.github.io/Order/
```

**相關設定**

- `vite.config.js` 的 `base` 會在打包時指向 `/<repo 名稱>/`；workflow 已自動帶入 repo 名稱，
  改名 repo 不用改設定。若之後換成自訂網域或 `<帳號>.github.io`，把 `VITE_BASE` 設成 `/`
- `.env.production` 有進版控，CI 打包時才有 Firebase 設定。
  Firebase 的網頁設定一定會被打包進前端程式碼，任何人看網頁原始碼都拿得到，本來就不是機密；
  真正決定誰能讀寫的是 `firestore.rules`

### 刪除權限的限制

「只能刪自己的」是**介面層**的限制：`src/lib/ownership.js` 把這台裝置送出的訂單 ID
記在 localStorage，只有這些才顯示刪除鍵。因此：

- 換一台裝置或清除瀏覽器資料後，原本那幾筆就不再顯示刪除鍵（自己也刪不掉）
- 懂技術的人仍可繞過介面直接呼叫 Firestore 刪除任何一筆

要做到真正無法繞過，必須改用 Firebase Authentication（匿名登入即可），
在訂單寫入 `uid`，並把規則改成 `allow delete: if request.auth.uid == resource.data.uid`。

### ⚠️ 上線前請注意權限

網頁一旦公開，**知道網址的人都能點餐、也能刪掉別人的餐**（目前的規則是開放讀寫）。
自己人小圈子用沒問題；如果網址可能外流，建議至少做其中一項：

- 把 `firestore.rules` 的 `allow delete` 改成 `if false`（只能新增，不能刪）
- 改成需要登入（`request.auth != null`）並開啟 Firebase Authentication
- 開啟 [App Check](https://firebase.google.com/docs/app-check) 阻擋非本站來源的存取

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
    ├── config.js                # 系統名稱（標頭與 PDF 共用）
    ├── App.jsx                  # 頁面切換與共用狀態
    ├── index.css                # Tailwind 與共用 class
    ├── components
    │   ├── TopBar.jsx           # 品牌、日期與三個分頁切換
    │   ├── StepIndicator.jsx    # 三步驟指示器
    │   ├── OptionCard.jsx       # 餐點 / 飲料選擇卡
    │   ├── TallyList.jsx        # 品項統計（每個品項幾份）
    │   ├── PersonList.jsx       # 每個人點了什麼
    │   ├── EmptyState.jsx       # 尚無訂單時的共用畫面
    │   └── Toast.jsx            # 操作回饋提示
    ├── pages
    │   ├── OrderPage.jsx        # 點餐三步驟
    │   ├── PeoplePage.jsx       # 大家點的（每個人一列）
    │   └── StatsPage.jsx        # 統整（份數統計與匯出）
    ├── hooks
    │   └── useOrders.js         # 訂單資料訂閱與統整計算
    ├── lib
    │   ├── firebase.js          # Firebase 初始化與設定偵測
    │   ├── ordersRepository.js  # 資料來源：Firestore 即時同步 / 本機儲存
    │   └── ownership.js         # 記錄本機送出過的訂單，用於限制刪除範圍
    ├── data
    │   ├── menu.js              # 餐點、飲料與色彩語彙
    │   └── mockOrders.js        # 12 筆展示資料
    └── utils
        ├── format.js            # 日期與相對時間格式化
        └── exportPdf.js         # 統整單據排版與 PDF 匯出
```

`useOrders` 只認 `ordersRepository` 的介面（`subscribe` / `add` / `remove` / `reset`），
所以有沒有 Firebase 對畫面元件完全透明。

## PDF 匯出

- 點統整頁最下方的「下載 PDF」即可，PDF 相關套件是**點下去才載入**（動態 import），不影響首次開啟速度
- 版面為 **A4 橫式，固定兩頁**：第一頁是每個人點的（雙欄），第二頁是餐點與飲料的份數統計
- 人數很多時第一頁會自動往後分頁，統計仍固定另起新頁
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

- 每人份數：`src/data/menu.js` 的 `PORTIONS_PER_PERSON`（同時要更新 `firestore.rules` 裡的 `size() == 2`）
- 餐點與飲料品項：`src/data/menu.js`
- 展示資料：`src/data/mockOrders.js`

這個版本不處理金額，介面與 PDF 都只呈現份數。

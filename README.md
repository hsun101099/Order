# 淡水連鎖飲料店統整

整理淡水常見的連鎖飲料品牌，讓人快速瀏覽、篩選，並從中挑一家來喝。

純前端網站（React + Vite + Tailwind），沒有後端與資料庫，資料寫在版控裡。

> 舊的「漢堡車點餐」程式碼保留在 `claude/simple-ordering-system-ml65rl` 分支。

## 功能

- **瀏覽品牌**：卡片列出店名、分類、招牌品項、價位區間與淡水常見區域。
- **篩選**：關鍵字（店名 / 英文名 / 品項）、分類、地區、價位帶、特色標籤（標籤採「全部符合」）。
- **排序**：推薦、價位高低、店名。
- **詳細資訊**：點卡片開啟面板，看完整招牌品項與特色。
- **待選清單**：把想喝的店加進底部清單，猶豫時按「幫我選一家」隨機抽。清單存在瀏覽器 `localStorage`，換裝置不同步。

## 開發

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 產出 dist/
npm run preview
```

## 維護品牌資料

所有內容集中在 `src/data/shops.js`，新增一家店就是在 `SHOPS` 陣列加一筆：

```js
{
  id: 'unique-id',          // 待選清單以此為鍵，不要重複或隨意更動
  name: '品牌中文名',
  enName: 'Brand Name',
  category: 'tea',          // 對應 CATEGORIES
  accent: '#0F766E',        // 卡片上的品牌色塊
  priceMin: 35,
  priceMax: 75,
  signatures: ['招牌一', '招牌二'],
  areas: ['station'],       // 對應 AREAS
  tags: ['nosugar'],        // 對應 TAGS
  desc: '一兩句話說明特色。',
}
```

`CATEGORIES` / `AREAS` / `TAGS` / `PRICE_BANDS` 也在同一個檔案，改動後篩選列會自動跟著變。

> 資料說明：價位區間與門市分布屬參考值，各品牌會調整菜單與展店，實際請以官方公告為準。資料刻意不收地址與電話，避免過期後誤導使用者。

## 檔案結構

```
src/
  App.jsx                    篩選、排序與版面組裝
  data/shops.js              品牌資料與篩選選項（唯一需要維護的資料來源）
  hooks/useShortlist.js      待選清單（localStorage）
  components/
    FilterBar.jsx            搜尋框與篩選晶片
    ShopCard.jsx             品牌卡片
    ShopDetail.jsx           詳細資訊面板
    ShortlistBar.jsx         底部待選清單與隨機挑選
```

## 部署

`.github/workflows` 內的 GitHub Pages workflow 目前只在 `main` 與舊的點餐分支上觸發。要讓這個網站上線，把本分支加進 workflow 的 `branches` 清單，或合併到 `main`。打包路徑由 `VITE_BASE` 控制（預設 `/Order/`），改用自訂網域時設成 `/`。

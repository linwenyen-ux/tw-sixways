# 台股選股六大策略 — 每日戰情板（手機版）

每個交易日收盤後由本機排程產生並推上來的靜態頁面。三個分頁：

| 分頁 | 內容 |
|---|---|
| 📊 大盤 | 四指數（加權指數／台灣50／富邦科技／中型100）投票結果、市場廣度、規則式解讀 |
| 📈 持股 | 追蹤標的的趨勢研判（頭頭高低／底底高低、月線、壓力支撐線）**不含成本與損益** |
| 🔍 全池 | 299 檔個股近 5 個交易日觸發的六大策略訊號，可篩選與排序 |

## 加到手機主畫面

- **iPhone（Safari）**：開啟網址 → 分享 → 加入主畫面
- **Android（Chrome）**：開啟網址 → 右上選單 → 安裝應用程式／加到主畫面

裝好之後會像一般 App 一樣全螢幕開啟，離線時顯示最後一次看過的內容。

## 這個 repo 是怎麼更新的

本機 `PythonStockTW/zhu_app.py` 產生 `index.html`，`publish_pages.sh` 用 repo 層級的
deploy key 推到 `main`，GitHub Pages 直接發布根目錄。此處**只有產生後的靜態檔**，
策略與回測程式都留在本機。

## 檔案

```
index.html   每日重產的整頁（資料內嵌，無外部請求）
manifest.json  PWA 設定
sw.js        service worker：index.html 走 network-first、圖示走 cache-first
icons/       App 圖示
.nojekyll    要求 GitHub Pages 原樣輸出，不跑 Jekyll
```

## 免責

純技術面統計與規則判讀，不是投資建議。

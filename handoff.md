# FocusDesk 交接紀錄

> 本檔案用於「收工」或「今天先這樣」時整理目前進度，讓下一次對話可以快速銜接。

## 目前狀態

- 專案：FocusDesk（Next.js 15 + Supabase）
- 工作區：`C:\Users\vince\OneDrive\桌面\0914VB`
- 目前主題：寶可夢圖鑑／訓練家工作台風格
- 最近驗證：`npx tsc --noEmit` 與 `npm.cmd run build` 均通過
- 本次收工時：開發伺服器目前未在背景監聽，下一次開工時需重新執行 `npm.cmd run dev`

## 待辦事項

- [x] 確認本地開發伺服器可正常開啟（`http://localhost:3000`；上次已驗證）
- [ ] 瀏覽 `/today`、`/projects`、`/projects/demo` 的新版視覺效果
- [ ] 如需要，補上 `/inbox` 與 `/settings` 頁面（目前側邊欄連結尚未有對應頁面）
- [ ] 後續將靜態示範資料接上 Supabase

## 下一步

1. 開啟 `http://localhost:3000` 檢查畫面。
2. 依畫面回饋調整寶可夢風格的色彩、字體與元件細節。
3. 需要結束工作時，輸入「收工」或「今天先這樣」，更新本檔案與 `worklog.md`。

## 2026-09-14 追加交接

- 已依 SPEC-01～03 補上 `app/api/tasks/route.ts`，新增任務可在 Supabase 設定完成且登入後走伺服器端 API。
- `app/today/page.tsx` 已加入表單提交、載入／儲存錯誤提示、收件匣歸屬與本地開發模式。
- 本地開發模式會使用 localStorage；正式規格仍需 Supabase 環境變數、登入與資料庫 migration。
- `npx tsc --noEmit` 已通過。
- production build 曾執行至頁面產生／最佳化階段，但本次被使用者中斷，尚未取得最終成功結果。
- 收工時 `localhost:3000`、`localhost:3001` 都沒有監聽中的開發伺服器。

### 下次開工優先事項

1. 先讀取本檔案與 `worklog.md`。
2. 確認 `.env.local` 是否已填入 Supabase URL／anon key。
3. 執行完整 `npm.cmd run build` 並取得最終結果。
4. 啟動 `npm.cmd run dev`，測試本地模式或登入後的 Supabase 新增任務。

## 2026-09-14 ESG 文獻功能交接

- 今日工作新增「每日搜尋 10 篇 ESG 落地醫療產業文獻並完成摘要」。
- 新增 [lib/research.ts](lib/research.ts)，包含 10 篇 ESG 醫療文獻、摘要與閱讀連結。
- `/today` 開啟時會將 ESG 文獻推送到收件匣；本地模式使用 localStorage，Supabase 模式使用 `/api/tasks`。
- 新增 `/inbox/esg` ESG 醫療專屬文件夾，依日期顯示摘要與外部連結。
- 新增 `supabase/migrations/002_task_folders.sql`，為 tasks 增加 `folder` 欄位與索引。
- `npx tsc --noEmit`：通過；`/today`、`/inbox/esg`：HTTP 200。
- 尚未在最後一輪 ESG 修改後重新執行 production build。
- Supabase 模式使用前需套用 migration 002；目前未設定 `.env.local`，本地仍是 localStorage 模式。
- 每日自動更新目前在開啟 `/today` 時執行，尚未接背景 cron 排程。

### 下次開工

1. 若使用 Supabase，套用 migration 002 並設定 `.env.local`。
2. 執行完整 production build。
3. 確認 `/inbox/esg` 的 10 篇摘要與日期分類。
4. 如需要背景每日自動搜尋，再接 cron／排程服務。

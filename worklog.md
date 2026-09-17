# FocusDesk 工作記錄

本檔案記錄每次工作階段的重點、驗證結果與後續事項。

## 2026-09-14

### 本次完成

- 修正 `app/projects/demo/page.tsx` 的 Kanban `groups` 型別錯誤。
- 建立 `app/pokemon.css`，加入寶可夢圖鑑／訓練家工作台風格：紅白球品牌標記、紅藍黃色彩、深藍描邊、像素字體、卡片陰影與背景網格。
- 在 `app/globals.css` 引入新版主題樣式。
- 建立 `handoff.md` 與本工作記錄檔。
- 啟動 Next.js 本地開發伺服器，網址為 `http://localhost:3000`。

### 驗證

- `npx tsc --noEmit`：通過。
- `npm.cmd run build`：通過。
- `npm.cmd run dev`：已啟動並 Ready。

### 尚未完成

- 尚未完成瀏覽器畫面檢查。
- 尚未補上 `/inbox`、`/settings` 頁面。
- 尚未將示範資料接上 Supabase。

### 下次接續

- 先確認本地 dev server 與新版 UI。
- 依需求微調視覺樣式，再處理缺少的頁面或資料串接。

## 2026-09-14｜收工整理

### 本次重點

- 檢查專案資料夾，確認目前包含 `app`、`lib`、`supabase`、規格文件、交接文件與工作記錄。
- 確認交接流程：說「收工」或「今天先這樣」時更新本檔案與 `handoff.md`；說「打開工」時讀取兩份記錄並接續工作。

### 收工狀態

- TypeScript 檢查與 production build：已通過（前次驗證）。
- 開發伺服器：目前未在 `localhost:3000` 監聽；下次開工時重新啟動。

### 下一次開工

1. 先讀取 `handoff.md` 與 `worklog.md`。
2. 執行 `npm.cmd run dev`。
3. 開啟 `http://localhost:3000` 檢查寶可夢風格 UI。
4. 再依需求處理 `/inbox`、`/settings` 或 Supabase 串接。

## 2026-09-14｜收工整理（二）

### 本次完成

- 重新對照 SPEC-01～04，確認原本新增任務只是前端 state／localStorage，沒有真正寫入 Supabase。
- 新增 `app/api/tasks/route.ts`：支援目前使用者任務查詢與快速新增，使用 Supabase session、收件匣專案與 RLS。
- 更新 `app/today/page.tsx`：
  - 使用表單提交，不使用 `prompt` 或 `window.prompt`。
  - 任務名稱必填。
  - 快速新增預設為收件匣、`todo`、`normal`、無截止日。
  - Supabase 設定存在時走 API；未設定時使用明確的 localStorage 開發模式。
  - 加入載入、錯誤、成功提示。
  - 加入收件匣任務區塊。

### 驗證狀態

- `npx tsc --noEmit`：通過。
- `npm.cmd run build`：本次執行曾到達頁面產生／最佳化階段，但被使用者中斷，未取得最終 exit code。
- 開發伺服器：收工時未運行。

### 尚未完成／風險

- 尚未確認 `.env.local` 與 Supabase 專案設定。
- `/projects` 及 `/projects/demo` 仍是靜態展示，尚未接上資料庫 CRUD／Kanban 更新。
- `/inbox`、`/settings` 頁面仍未建立。

## 2026-09-14｜ESG 文獻功能收工

### 本次完成

- 新增每日工作項目：每日搜尋 10 篇 ESG 落地醫療產業文獻並完成摘要。
- 新增 10 篇 ESG 醫療文獻資料、重點摘要與 PubMed／PMC 連結。
- 收件匣文獻新增 `folder` 分類欄位。
- 新增 `supabase/migrations/002_task_folders.sql`。
- 新增 `/inbox/esg` 專屬文件夾頁面，顯示 ESG 文獻、搜尋日期、摘要與閱讀連結。
- `/today` 開啟時會自動補入當日 ESG 文獻；localStorage 與 Supabase API 都有對應流程。

### 驗證

- `npx tsc --noEmit`：通過。
- `http://localhost:3000/today`：HTTP 200。
- `http://localhost:3000/inbox/esg`：HTTP 200。
- 最後一輪 ESG 修改後尚未重新執行 production build。

### 後續事項

- Supabase 使用者需執行 migration 002。
- 目前沒有 `.env.local`，本地測試使用 localStorage。
- 每日自動搜尋仍是開啟 `/today` 時觸發，尚未加入背景排程。

## 2026-09-15｜開工

### 本次完成

- 讀取並確認 `handoff.md`、`worklog.md` 的交接狀態。
- 確認 `.env.local` 不存在，故目前仍為 localStorage 開發模式。
- 清理 `.next` 後重試 build；受限環境仍出現 `spawn EPERM`，改在受限環境外執行後 production build 成功。
- 啟動 Next.js dev server，確認 `/`、`/today`、`/projects`、`/projects/demo`、`/inbox`、`/inbox/esg`、`/login` HTTP 200。
- 新增 `app/settings/page.tsx`，補齊設定頁與側邊欄連結。

### 驗證／待驗證

- `npx.cmd tsc --noEmit`：通過。
- `npm.cmd run build`：通過，已產生 13 個路由。
- `/settings`：HTTP 200。

### 下一步

- 完成新增設定頁後的 typecheck、build 與路由檢查。
- 若進入正式串接，設定 Supabase 環境變數並套用兩個 migration。

## 2026-09-15｜Vercel 部署

- Vercel CLI 登入 `emmyyang`，建立並連結專案 `0914vb`。
- Production deployment：`https://0914vb-ten.vercel.app`，狀態 READY。
- Vercel 雲端 build 成功，包含 13 個 Next.js routes。
- 透過 `vercel curl` 驗證 production `/settings` 頁面可回傳 HTML。
- 本地目前仍有未提交修改（`.gitignore`、`handoff.md`、`worklog.md`、`app/settings/`）；本次部署為目前工作區 snapshot，尚未 push GitHub。

## 2026-09-15｜法規文件搜尋

### 本次完成

- 確認指定資料夾有 2 個文件（PDF、DOC），合計約 9.25 MB；沒有將它們複製到 repo。
- 新增法規文件 migration、RLS、全文搜尋 RPC 與私有 Storage bucket 定義。
- 新增 `/regulations` 搜尋頁、搜尋 API、登入保護的 signed URL 文件查看 API。
- 新增本機匯入器與 `pdf-parse`、`word-extractor` 依賴。
- `npx.cmd tsc --noEmit`：通過。
- `npm.cmd run build`：通過。
- 已部署到 `https://0914vb-ten.vercel.app`，Vercel build READY。

### 阻礙

- `0914vb` 尚無 Supabase 環境變數；匯入器已安全停止，沒有上傳任何公司文件。
- 需要 Supabase URL、anon key 與本機專用 service-role key，才能執行 migration 與匯入。

### 下一步

- 完成 Supabase 專案與金鑰設定後，再執行 migration、匯入文件及 production 搜尋測試。

## 2026-09-15｜收工

- 完成法規搜尋功能程式碼、migration 與本機匯入器，並部署最新版本至 `https://0914vb-ten.vercel.app`。
- 完成 typecheck、local production build 與 Vercel cloud build 驗證。
- 確認 2 份公司文件仍只存在於 `C:\Users\vince\OneDrive\桌面\0914法規`，沒有進入 repo 或 Vercel deployment upload。
- 目前阻礙是 `0914vb` 沒有 Supabase 環境變數；尚未建立 schema、私有 bucket 或匯入文件。
- 下次從 Supabase 專案／金鑰設定開始，再執行 migration、匯入與 production 搜尋測試。
## 2026-09-17

### 停用每日文獻寄信功能

- 使用者要求取消寄信並重新製作每日文獻流程。
- 已移除 Resend、email HTML、寄件者／收件者環境變數與寄信結果處理。
- Cron 保留為每日資料更新：Supabase 文獻摘要、文獻明細、研究題目與 FocusDesk 任務。
- 新增 migration 005 移除 `literature_digests.recipient` 與 `sent_at`。
- `npx.cmd tsc --noEmit` 通過；production build 因 OneDrive Windows `spawn EPERM` 阻塞。

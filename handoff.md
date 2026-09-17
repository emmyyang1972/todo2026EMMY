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

## 2026-09-15 開工進度

- 已確認 `.env.local` 尚未設定，現階段維持 localStorage 開發模式。
- 已清理 `.next` 並在受限環境外重新執行 production build，成功通過。
- 已啟動 `http://localhost:3000`；核心頁面與 `/inbox`、`/inbox/esg`、`/login` 均 HTTP 200。
- 已新增 `/settings` 頁面，補齊側邊欄原有連結，顯示目前本地開發模式與登入入口。
- 新增頁面後 `npx.cmd tsc --noEmit`、`npm.cmd run build` 均通過，`/settings` HTTP 200。

### 下一步

1. 重新驗證 TypeScript、production build 與 `/settings` HTTP 200。
2. 若要使用正式資料持久化，設定 `.env.local` 並套用 migration 001、002。
3. 再決定是否把專案／Kanban 示範資料改為 Supabase CRUD。

## 2026-09-15 Vercel 部署

- 已以 Vercel CLI 建立並連結 `emmyyang/0914vb` 專案。
- Production deployment 已 READY，別名為 `https://0914vb-ten.vercel.app`。
- Vercel build 成功；已用 Vercel CLI 驗證 production `/settings` 可正常回傳頁面。
- Vercel 已建立 `.vercel/project.json` 並將 `.vercel`、`.env*` 加入 `.gitignore`；目前尚未將本地修改 commit／push 到 GitHub。

## 2026-09-15 法規文件搜尋開發

- 新增 `supabase/migrations/003_regulatory_documents.sql`：法規文件、分段全文、全文搜尋 RPC、RLS 與 `regulatory-documents` 私有 bucket。
- 新增 `app/regulations/page.tsx`、`app/api/regulations/route.ts` 與 signed URL 查看 API。
- 新增 `scripts/import-regulations.mjs`，直接讀取 `C:\Users\vince\OneDrive\桌面\0914法規` 的 PDF／DOC，不把文件放入 repo。
- 新增 `npm.cmd run import:regulations` 指令與 PDF／DOC 解析套件。
- typecheck、production build 均通過；新增程式已部署到 `https://0914vb-ten.vercel.app`。
- 尚未執行 migration 或文件匯入：Vercel 與本機目前沒有 Supabase URL／anon key／service-role key。

### 下一步

1. 提供或建立 Supabase 專案，取得 URL、anon key、service-role key。
2. 在 Supabase SQL Editor 執行 migration 001～003。
3. 將 URL／anon key 設到 Vercel `0914vb`，service-role key 只放本機。
4. 執行 `npm.cmd run import:regulations -- "C:\Users\vince\OneDrive\桌面\0914法規"`。
5. 登入 production 後測試 `/regulations` 搜尋與文件查看。

## 2026-09-15 收工狀態

### 已完成

- 已部署最新程式到 `https://0914vb-ten.vercel.app`，Vercel production READY。
- 已完成法規文件搜尋頁、搜尋 API、登入保護的 signed URL 查看 API。
- 已完成 `003_regulatory_documents.sql` 與本機匯入器，來源為 `C:\Users\vince\OneDrive\桌面\0914法規`。
- 已確認來源資料為 1 個 PDF 與 1 個 DOC，約 9.25 MB；沒有放入 repo，也尚未上傳。

### 驗證與阻礙

- `npx.cmd tsc --noEmit`、`npm.cmd run build`、Vercel cloud build：通過。
- 匯入器在缺少 Supabase 金鑰時安全停止，未傳送文件。
- `0914vb` 目前沒有 Supabase 環境變數，尚未執行 migration 或文件匯入。

### 下一次開工

1. 取得 Supabase URL、anon key 與 service-role key（service-role key 僅在本機使用）。
2. 在 Supabase SQL Editor 執行 migrations 001～003。
3. 將 URL／anon key 設定到 Vercel 專案 `0914vb`。
4. 執行 `npm.cmd run import:regulations -- "C:\Users\vince\OneDrive\桌面\0914法規"`。
5. 登入 production，測試文件搜尋、內容查看與權限隔離。

## 2026-09-17 停用每日文獻寄信

### 已完成

- 移除 `/api/cron/daily-literature` 的 Resend API 呼叫、寄件者／收件者設定與寄信成功／失敗流程。
- 每日 Cron 現在只搜尋文獻、寫入 `literature_digests`、`literature_papers`、`literature_ideas`，並建立 FocusDesk 研究題目任務。
- 移除 `.env.example` 的 `RESEND_API_KEY`、`LITERATURE_EMAIL_TO`、`LITERATURE_EMAIL_FROM`。
- 新增 `supabase/migrations/005_remove_literature_email_metadata.sql`，移除舊的 `recipient` 與 `sent_at` 欄位。
- README 已改為明確標示「只更新資料，不寄信」。

### 驗證

- `npx.cmd tsc --noEmit`：通過。
- `npm.cmd run build`：受 Windows／OneDrive `spawn EPERM` 阻塞，尚未完成 production build 驗證。

### 下一步

1. 在 Supabase 執行 migration 005。
2. 重新部署 Vercel。
3. 使用 `CRON_SECRET` 呼叫 Cron endpoint，確認只回傳資料更新結果且不產生任何寄信請求。

# FocusDesk

依照 SPEC-01 至 SPEC-04 建立的單人待辦與專案管理系統基礎。

## 啟動

1. 安裝 Node.js 18.18 或以上版本。
2. 複製 `.env.example` 為 `.env.local`，填入 Supabase URL 與 anon key。
3. 在 Supabase SQL Editor 執行 `supabase/migrations/001_initial.sql`。
4. 在 Supabase Authentication > Providers 啟用 Google，並將 OAuth callback 設為 `http://localhost:3000/auth/callback`。
5. 執行 `npm install` 後執行 `npm run dev`。

## 每日 ESG 醫療文獻助理

已新增每日自動化流程：從 PubMed／NCBI E-utilities 搜尋台灣與國際 ESG 醫院／醫療產業研究，整理 10 篇摘要、產生至少 3 個研究題目，寄送至 `emmyyang1972@gmail.com`，並寫入 FocusDesk 待辦區。

正式啟用前：

1. 在 Supabase 執行 `supabase/migrations/001_initial.sql` 至 `004_daily_literature.sql`。
2. 登入一次，取得帳號 UUID，填入 `LITERATURE_OWNER_ID`。
3. 在 Resend 設定已驗證寄件網域，填入 `RESEND_API_KEY` 與 `LITERATURE_EMAIL_FROM`。
4. 在 Vercel 設定 `.env.example` 中的 server-only 變數：`SUPABASE_SERVICE_ROLE_KEY`、`RESEND_API_KEY`、`LITERATURE_OWNER_ID`、`CRON_SECRET`。
5. 部署後，Vercel Cron 會依 `vercel.json` 每日 00:00 UTC（台灣上午 8:00）呼叫 `/api/cron/daily-literature`。也可用 `Authorization: Bearer <CRON_SECRET>` 手動測試。

`SUPABASE_SERVICE_ROLE_KEY`、`RESEND_API_KEY` 與 `CRON_SECRET` 只能放在本機／Vercel 環境變數，不能放進 Git。摘要是研究導讀用途，正式判讀仍應開啟原文。

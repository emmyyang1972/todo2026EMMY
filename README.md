# FocusDesk

依照 SPEC-01 至 SPEC-04 建立的單人待辦與專案管理系統基礎。

## 啟動

1. 安裝 Node.js 18.18 或以上版本。
2. 複製 `.env.example` 為 `.env.local`，填入 Supabase URL 與 anon key。
3. 在 Supabase SQL Editor 執行 `supabase/migrations/001_initial.sql`。
4. 在 Supabase Authentication > Providers 啟用 Google，並將 OAuth callback 設為 `http://localhost:3000/auth/callback`。
5. 執行 `npm install` 後執行 `npm run dev`。

目前頁面包含登入、今日首頁、快速新增、搜尋、專案列表與 Kanban 視圖。Supabase migration 與 RLS 已完成，UI 的任務操作目前先以畫面狀態示範，下一步可接入查詢 mutation。

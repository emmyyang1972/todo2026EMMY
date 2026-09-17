-- 每日文獻改為只寫入資料庫與 FocusDesk，不再保存或使用寄信 metadata。
alter table public.literature_digests drop column if exists recipient;
alter table public.literature_digests drop column if exists sent_at;

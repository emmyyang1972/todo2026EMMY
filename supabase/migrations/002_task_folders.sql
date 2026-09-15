alter table public.tasks add column if not exists folder text;
create index if not exists tasks_owner_folder on public.tasks(owner_id, folder);

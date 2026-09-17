create table if not exists public.literature_digests (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete cascade,
  digest_date date not null, paper_count integer not null default 0, recipient text not null, generated_at timestamptz not null default now(), sent_at timestamptz,
  unique(owner_id, digest_date)
);
create table if not exists public.literature_papers (
  id uuid primary key default gen_random_uuid(), digest_id uuid not null references public.literature_digests(id) on delete cascade,
  pmid text not null, region text not null, title text not null, journal text, year text, abstract text not null default '', key_points jsonb not null default '[]'::jsonb,
  url text not null, authors jsonb not null default '[]'::jsonb, doi text, unique(digest_id, pmid)
);
create table if not exists public.literature_ideas (
  id uuid primary key default gen_random_uuid(), digest_id uuid not null references public.literature_digests(id) on delete cascade,
  title text not null, question text not null, design text not null, outcomes text not null, gap text not null
);
alter table public.literature_digests enable row level security;
alter table public.literature_papers enable row level security;
alter table public.literature_ideas enable row level security;
create policy "owners read literature digests" on public.literature_digests for select using (owner_id = auth.uid());
create policy "owners read literature papers" on public.literature_papers for select using (exists (select 1 from public.literature_digests d where d.id = digest_id and d.owner_id = auth.uid()));
create policy "owners read literature ideas" on public.literature_ideas for select using (exists (select 1 from public.literature_digests d where d.id = digest_id and d.owner_id = auth.uid()));

create table if not exists public.regulatory_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_name text not null unique,
  file_type text not null,
  storage_path text not null unique,
  content text not null default '',
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.regulatory_documents enable row level security;
create policy "authenticated users can read regulatory documents" on public.regulatory_documents
  for select to authenticated using (true);

create index if not exists regulatory_documents_search_idx
  on public.regulatory_documents using gin (to_tsvector('simple', title || ' ' || content));

create table if not exists public.regulatory_document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.regulatory_documents(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  unique(document_id, chunk_index)
);

alter table public.regulatory_document_chunks enable row level security;
create policy "authenticated users can read regulatory chunks" on public.regulatory_document_chunks
  for select to authenticated using (true);
create index if not exists regulatory_document_chunks_document_idx on public.regulatory_document_chunks(document_id, chunk_index);

create or replace function public.search_regulatory_documents(search_query text)
returns table (id uuid, title text, file_name text, file_type text, summary text, snippet text, storage_path text)
language sql stable security invoker set search_path = public
as $$
  select d.id, d.title, d.file_name, d.file_type, d.summary,
    ts_headline('simple', d.content, websearch_to_tsquery('simple', search_query), 'MaxWords=45, MinWords=12') as snippet,
    d.storage_path
  from public.regulatory_documents d
  where nullif(trim(search_query), '') is null
     or to_tsvector('simple', d.title || ' ' || d.content) @@ websearch_to_tsquery('simple', search_query)
  order by d.updated_at desc;
$$;

insert into storage.buckets (id, name, public)
values ('regulatory-documents', 'regulatory-documents', false)
on conflict (id) do nothing;

create policy "authenticated users can read regulatory files" on storage.objects
  for select to authenticated using (bucket_id = 'regulatory-documents');

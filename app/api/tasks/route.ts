import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

function missingConfig() {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: values => values.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
    },
  })
}

export async function GET() {
  if (missingConfig()) return NextResponse.json({ error: 'Supabase 尚未設定' }, { status: 503 })
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '請先登入' }, { status: 401 })

  const { data, error } = await supabase.from('tasks').select('id,title,description,external_url,folder,status,priority,due_at,is_today_focus,project_id,created_at,projects!inner(name,is_inbox)').eq('owner_id', user.id).order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tasks: data ?? [] })
}

export async function POST(request: Request) {
  if (missingConfig()) return NextResponse.json({ error: 'Supabase 尚未設定' }, { status: 503 })
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '請先登入' }, { status: 401 })

  const body = await request.json().catch(() => null) as { title?: unknown; description?: unknown; external_url?: unknown; folder?: unknown } | null
  const title = typeof body?.title === 'string' ? body.title.trim() : ''
  if (!title) return NextResponse.json({ error: '任務名稱不可為空白' }, { status: 400 })

  const { data: inbox, error: inboxError } = await supabase.from('projects').select('id,name,is_inbox').eq('owner_id', user.id).eq('is_inbox', true).single()
  if (inboxError || !inbox) return NextResponse.json({ error: '找不到收件匣專案，請先完成帳號初始化' }, { status: 409 })

  const description = typeof body?.description === 'string' ? body.description.trim() || null : null
  const externalUrl = typeof body?.external_url === 'string' ? body.external_url.trim() || null : null
  const folder = typeof body?.folder === 'string' ? body.folder.trim() || null : null
  const { data: task, error } = await supabase.from('tasks').insert({ owner_id: user.id, project_id: inbox.id, title, description, external_url: externalUrl, folder, status: 'todo', priority: 'normal' }).select('id,title,description,external_url,folder,status,priority,due_at,is_today_focus,project_id,created_at,projects!inner(name,is_inbox)').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ task }, { status: 201 })
}

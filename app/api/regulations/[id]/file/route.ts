import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return NextResponse.json({ error: '尚未設定 Supabase' }, { status: 503 })
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { cookies: { getAll: () => cookieStore.getAll(), setAll: items => items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '請先登入' }, { status: 401 })
  const { id } = await context.params
  const { data: document, error } = await supabase.from('regulatory_documents').select('storage_path,file_name,file_type').eq('id', id).single()
  if (error || !document) return NextResponse.json({ error: '找不到文件' }, { status: 404 })
  const { data: signed, error: signedError } = await supabase.storage.from('regulatory-documents').createSignedUrl(document.storage_path, 60)
  if (signedError || !signed?.signedUrl) return NextResponse.json({ error: '無法產生文件連結' }, { status: 500 })
  return NextResponse.redirect(signed.signedUrl)
}

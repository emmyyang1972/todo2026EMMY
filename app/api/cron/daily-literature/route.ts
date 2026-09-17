import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { collectDailyDigest, digestEmailHtml } from '../../../../lib/daily-literature'

export const maxDuration = 60

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return request.headers.get('authorization') === `Bearer ${secret}` || request.headers.get('x-cron-secret') === secret
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: '未授權的排程請求' }, { status: 401 })
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const resendKey = process.env.RESEND_API_KEY
  const ownerId = process.env.LITERATURE_OWNER_ID
  const recipient = process.env.LITERATURE_EMAIL_TO || 'emmyyang1972@gmail.com'
  if (!url || !serviceKey || !resendKey || !ownerId) return NextResponse.json({ error: '缺少 Supabase、Resend 或 LITERATURE_OWNER_ID 環境變數' }, { status: 503 })
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei' }).format(new Date())
  const digest = await collectDailyDigest(date)
  const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
  const { data: inbox } = await supabase.from('projects').select('id').eq('owner_id', ownerId).eq('is_inbox', true).single()
  if (!inbox) return NextResponse.json({ error: '找不到研究者的收件匣專案，請先登入一次初始化帳號' }, { status: 409 })
  const { data: digestRow, error: digestError } = await supabase.from('literature_digests').upsert({ owner_id: ownerId, digest_date: date, paper_count: digest.papers.length, recipient, generated_at: new Date().toISOString() }, { onConflict: 'owner_id,digest_date' }).select('id').single()
  if (digestError || !digestRow) return NextResponse.json({ error: digestError?.message ?? '無法儲存文獻摘要' }, { status: 500 })
  await supabase.from('literature_papers').delete().eq('digest_id', digestRow.id)
  await supabase.from('literature_ideas').delete().eq('digest_id', digestRow.id)
  await supabase.from('literature_papers').insert(digest.papers.map(paper => ({ digest_id: digestRow.id, pmid: paper.pmid, region: paper.region, title: paper.title, journal: paper.journal, year: paper.year, abstract: paper.abstract, key_points: paper.keyPoints, url: paper.url, authors: paper.authors, doi: paper.doi ?? null })))
  await supabase.from('literature_ideas').insert(digest.ideas.map(idea => ({ digest_id: digestRow.id, ...idea })))
  await supabase.from('tasks').delete().eq('owner_id', ownerId).eq('folder', `研究題目建議-${date}`)
  await supabase.from('tasks').insert(digest.ideas.map(idea => ({ owner_id: ownerId, project_id: inbox.id, title: `[${date}] ${idea.title}`, description: `研究問題：${idea.question}\n可能設計：${idea.design}\n觀察結果：${idea.outcomes}\n需補查：${idea.gap}`, folder: `研究題目建議-${date}`, due_at: `${date}T23:59:59+08:00`, is_today_focus: true, priority: 'high', status: 'todo' })))
  const emailResponse = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.LITERATURE_EMAIL_FROM || 'FocusDesk <onboarding@resend.dev>', to: [recipient], subject: `FocusDesk｜${date} ESG 醫療文獻摘要`, html: digestEmailHtml(digest) }) })
  if (!emailResponse.ok) return NextResponse.json({ error: `郵件寄送失敗：${await emailResponse.text()}`, collected: digest.papers.length }, { status: 502 })
  await supabase.from('literature_digests').update({ sent_at: new Date().toISOString() }).eq('id', digestRow.id)
  return NextResponse.json({ ok: true, date, papers: digest.papers.length, ideas: digest.ideas.length, recipient })
}

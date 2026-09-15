'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, CheckSquare, ExternalLink, FolderKanban, Inbox as InboxIcon, Settings } from 'lucide-react'
import { esgPapers } from '../../../lib/research'

type Paper = { id: string; title: string; description: string; externalUrl: string; date: string }
const remoteEnabled = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

function Sidebar() { return <aside className="sidebar"><div className="brand"><span className="brand-mark"><CheckSquare size={19} /></span><span>FocusDesk</span></div><p className="nav-title">工作空間</p><Link className="nav-item" href="/today"><CalendarDays size={17} /><span>今日</span></Link><Link className="nav-item" href="/projects"><FolderKanban size={17} /><span>專案</span></Link><Link className="nav-item active" href="/inbox"><InboxIcon size={17} /><span>收件匣</span></Link><div className="side-bottom"><Link className="nav-item" href="/settings"><Settings size={17} /><span>設定</span></Link></div></aside> }

export default function EsgInbox() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [error, setError] = useState('')
  useEffect(() => {
    async function load() {
      const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei' }).format(new Date())
      if (!remoteEnabled) {
        const saved = window.localStorage.getItem('focusdesk.tasks')
        const local = saved ? JSON.parse(saved) as Array<{ id: string; title: string; description?: string; externalUrl?: string; folder?: string; createdAt?: string }> : []
        const matches = local.filter(task => task.folder === 'ESG醫療' && task.externalUrl).map(task => ({ id: task.id, title: task.title, description: task.description ?? '', externalUrl: task.externalUrl!, date: task.createdAt ?? today }))
        setPapers(matches.length ? matches : esgPapers.map((paper, index) => ({ id: `preview-${index}`, title: paper.title, description: paper.description, externalUrl: paper.url, date: today })))
        return
      }
      const response = await fetch('/api/tasks', { cache: 'no-store' }); const body = await response.json().catch(() => ({}))
      if (!response.ok) { setError(body.error ?? '無法載入 ESG 文件夾'); return }
      setPapers((body.tasks as Array<{ id: string; title: string; description?: string; external_url?: string; folder?: string; created_at?: string }>).filter(task => task.folder === 'ESG醫療' && task.external_url).map(task => ({ id: task.id, title: task.title, description: task.description ?? '', externalUrl: task.external_url!, date: task.created_at?.slice(0, 10) ?? today })))
    }
    load().catch(() => setError('無法讀取 ESG 文獻'))
  }, [])
  return <div className="shell"><Sidebar /><main className="main"><Link href="/inbox" className="muted"><ArrowLeft size={15} style={{ verticalAlign: '-3px' }} /> 返回收件匣</Link><div className="topline" style={{ marginTop: 25 }}><div><h1>ESG 醫療專屬文件夾</h1><div className="date">環境、社會與治理落地醫療產業的每日文獻摘要</div></div><div className="avatar">E</div></div>{error && <p role="alert" style={{ color: '#b92135', fontWeight: 700 }}>{error}</p>}<section className="section" style={{ marginTop: 28 }}><h2><span><CalendarDays size={16} style={{ verticalAlign: '-3px' }} /> 依搜尋日期整理</span><span>{papers.length} 篇</span></h2>{papers.map(paper => <article className="task" key={paper.id}><div className="task-title"><div style={{ color: '#17233d' }}>{paper.title}</div><div className="task-meta">{paper.date} · {paper.description}</div></div><a href={paper.externalUrl} target="_blank" rel="noreferrer" aria-label={`閱讀：${paper.title}`}><ExternalLink size={17} color="#2c5aa8" /></a></article>)}</section></main></div>
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, CheckSquare, FolderKanban, Inbox as InboxIcon, Settings, ExternalLink } from 'lucide-react'

type InboxTask = { id: string; title: string; description?: string; externalUrl?: string; folder?: string; createdAt?: string; project?: string; status: string }
const remoteEnabled = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

function Sidebar() { return <aside className="sidebar"><div className="brand"><span className="brand-mark"><CheckSquare size={19} /></span><span>FocusDesk</span></div><p className="nav-title">工作空間</p><Link className="nav-item" href="/today"><CalendarDays size={17} /><span>今日</span></Link><Link className="nav-item" href="/projects"><FolderKanban size={17} /><span>專案</span></Link><Link className="nav-item active" href="/inbox"><InboxIcon size={17} /><span>收件匣</span></Link><div className="side-bottom"><Link className="nav-item" href="/settings"><Settings size={17} /><span>設定</span></Link></div></aside> }

export default function InboxPage() {
  const [tasks, setTasks] = useState<InboxTask[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      if (!remoteEnabled) {
        const saved = window.localStorage.getItem('focusdesk.tasks')
        if (saved) {
          try { setTasks((JSON.parse(saved) as InboxTask[]).filter(task => task.project === '收件匣')) } catch { setError('收件匣資料格式無法讀取') }
        }
        return
      }
      const response = await fetch('/api/tasks', { cache: 'no-store' })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) { setError(body.error ?? '無法載入收件匣'); return }
      setTasks((body.tasks as Array<{ id: string; title: string; description?: string | null; external_url?: string | null; folder?: string | null; created_at?: string; status: string; projects?: { name: string; is_inbox: boolean } }>).filter(task => task.projects?.is_inbox).map(task => ({ id: task.id, title: task.title, description: task.description ?? undefined, externalUrl: task.external_url ?? undefined, folder: task.folder ?? undefined, createdAt: task.created_at, project: '收件匣', status: task.status })))
    }
    load().catch(() => setError('無法連線到收件匣'))
  }, [])

  const groups = useMemo(() => {
    const map = new Map<string, InboxTask[]>()
    tasks.forEach(task => { const date = task.createdAt?.slice(0, 10) ?? '未分類日期'; map.set(date, [...(map.get(date) ?? []), task]) })
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  }, [tasks])

  return <div className="shell"><Sidebar /><main className="main"><div className="topline"><div><h1>收件匣</h1><div className="date">每日研究文獻會依搜尋日期整理在這裡。</div></div><div className="avatar">V</div></div><Link className="nav-item active" href="/inbox/esg" style={{ width: 'fit-content', marginTop: 22 }}>ESG 醫療專屬文件夾</Link>{error && <p role="alert" style={{ color: '#b92135', fontWeight: 700 }}>{error}</p>}{groups.length ? groups.map(([date, items]) => <section className="section" key={date} style={{ marginTop: 24 }}><h2><span><CalendarDays size={16} style={{ verticalAlign: '-3px' }} /> {date}</span><span>{items.length} 項</span></h2>{items.map(task => <article className="task" key={task.id}><div className="task-title">{task.title}<div className="task-meta">{task.description ?? '收件匣任務'} · {task.folder ?? '一般'} · {task.status === 'completed' ? '已完成' : '待處理'}</div></div>{task.externalUrl && <a href={task.externalUrl} target="_blank" rel="noreferrer" aria-label={`閱讀：${task.title}`}><ExternalLink size={17} color="#2c5aa8" /></a>}</article>)}</section>) : <section className="section" style={{ marginTop: 24 }}><p className="empty">目前沒有收件匣項目。回到今日頁面搜尋文獻後，系統會自動整理到這裡。</p></section>}</main></div>
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { CheckSquare, CalendarDays, FolderKanban, Inbox, Settings, Search, Plus, ChevronRight, CircleAlert, BookOpen } from 'lucide-react'
import { esgPapers, researchPapers } from '../../lib/research'

type Task = { id: string; title: string; project: string; projectId: string; status: 'todo' | 'in_progress' | 'completed' | 'cancelled' | 'blocked'; priority: 'critical' | 'high' | 'normal' | 'low'; due?: string; dueBucket?: 'overdue' | 'today' | 'upcoming'; focus?: boolean; description?: string; externalUrl?: string; folder?: string; createdAt?: string }
type ApiTask = { id: string; title: string; description?: string | null; external_url?: string | null; folder?: string | null; created_at?: string; status: Task['status']; priority: Task['priority']; due_at: string | null; is_today_focus: boolean; project_id: string; projects?: { name: string; is_inbox: boolean } | { name: string; is_inbox: boolean }[] }

const remoteEnabled = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
const initial: Task[] = [
  { id: 'daily-hospital-quality', title: '每日搜尋 5 篇醫院品質論文', project: '每日研究', projectId: 'daily-research', status: 'todo', priority: 'high', due: '今天', dueBucket: 'today', focus: true },
  { id: 'daily-esg-healthcare', title: '每日搜尋 10 篇 ESG 落地醫療產業文獻並完成摘要', project: 'ESG 醫療', projectId: 'esg-research', status: 'todo', priority: 'high', due: '今天', dueBucket: 'today', focus: true },
  { id: 'demo-1', title: '完成產品首頁 wireframe', project: 'FocusDesk 重新設計', projectId: 'focusdesk', status: 'in_progress', priority: 'high', due: '今天', dueBucket: 'today', focus: true },
  { id: 'demo-2', title: '回覆設計師的修改建議', project: 'FocusDesk 重新設計', projectId: 'focusdesk', status: 'todo', priority: 'normal', due: '今天', dueBucket: 'today' },
  { id: 'demo-3', title: '整理競品分析與筆記', project: '行銷活動企劃', projectId: 'marketing', status: 'todo', priority: 'low', due: '明天', dueBucket: 'upcoming' },
  { id: 'demo-4', title: '完成首頁文案 wireframe', project: 'FocusDesk 重新設計', projectId: 'focusdesk', status: 'blocked', priority: 'critical', due: '昨天', dueBucket: 'overdue' },
]

function normalize(task: ApiTask): Task {
  const project = Array.isArray(task.projects) ? task.projects[0] : task.projects
  let dueBucket: Task['dueBucket']
  let due: string | undefined
  if (task.due_at) {
    const date = new Date(task.due_at)
    const today = new Date()
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    const diff = Math.round((target - start) / 86400000)
    dueBucket = diff < 0 ? 'overdue' : diff === 0 ? 'today' : diff <= 7 ? 'upcoming' : undefined
    due = diff < 0 ? '逾期' : diff === 0 ? '今天' : diff === 1 ? '明天' : date.toLocaleDateString('zh-TW')
  }
  return { id: task.id, title: task.title, project: project?.name ?? '未知專案', projectId: task.project_id, status: task.status, priority: task.priority, due, dueBucket, focus: task.is_today_focus, description: task.description ?? undefined, externalUrl: task.external_url ?? undefined, folder: task.folder ?? undefined, createdAt: task.created_at }
}

function Sidebar() {
  return <aside className="sidebar"><div className="brand"><span className="brand-mark"><CheckSquare size={19} /></span><span>FocusDesk</span></div><p className="nav-title">研究工作空間</p><Link className="nav-item active" href="/today"><CalendarDays size={17} /><span>今日</span></Link><Link className="nav-item" href="/literature"><BookOpen size={17} /><span>文獻研究</span></Link><Link className="nav-item" href="/projects"><FolderKanban size={17} /><span>專案</span></Link><Link className="nav-item" href="/inbox"><Inbox size={17} /><span>收件匣</span></Link><div className="side-bottom"><Link className="nav-item" href="/settings"><Settings size={17} /><span>設定</span></Link></div></aside>
}

function TaskRow({ task, onDone }: { task: Task; onDone: () => void }) {
  return <div className="task"><button className={'check ' + (task.status === 'completed' ? 'done' : '')} aria-label="完成任務" onClick={onDone}>{task.status === 'completed' ? '✓' : ''}</button><div className="task-title">{task.title}<div className="task-meta">{task.project}{task.due && <> · {task.due}</>}</div></div>{task.priority === 'critical' && <span className="pill">重要</span>}<ChevronRight size={15} color="#aab3aa" /></div>
}

export default function Today() {
  const [tasks, setTasks] = useState<Task[]>(remoteEnabled ? [] : initial)
  const [query, setQuery] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [loading, setLoading] = useState(remoteEnabled)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    async function load() {
      if (!remoteEnabled) {
        const saved = window.localStorage.getItem('focusdesk.tasks')
        let stored = initial
        if (saved) { try { stored = JSON.parse(saved) as Task[] } catch { window.localStorage.removeItem('focusdesk.tasks') } }
        const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei' }).format(new Date())
        const existingUrls = new Set(stored.map(task => task.externalUrl).filter(Boolean))
        const allPapers = [...researchPapers, ...esgPapers]
        const papers = allPapers.filter(paper => !existingUrls.has(paper.url)).map((paper, index) => ({ id: `research-${today}-${index}`, title: paper.title, project: '收件匣', projectId: 'inbox', status: 'todo' as const, priority: 'normal' as const, description: paper.description, externalUrl: paper.url, folder: paper.folder, createdAt: today }))
        const dailyTasks = initial.slice(0, 2).filter(seed => !stored.some(task => task.id === seed.id))
        const withDailyTask = [...dailyTasks, ...stored]
        setTasks([...papers, ...withDailyTask])
        setLoading(false)
        return
      }
      const response = await fetch('/api/tasks', { cache: 'no-store' })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) setError(body.error ?? '無法載入任務')
      else {
        const loaded = (body.tasks as ApiTask[]).map(normalize)
        const existingUrls = new Set(loaded.map(task => task.externalUrl).filter(Boolean))
        const missing = [...researchPapers, ...esgPapers].filter(paper => !existingUrls.has(paper.url))
        const created = await Promise.all(missing.map(async paper => { const result = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: paper.title, description: paper.description, external_url: paper.url, folder: paper.folder }) }); if (!result.ok) return null; return normalize((await result.json()).task as ApiTask) }))
        setTasks([...created.filter((task): task is Task => Boolean(task)), ...loaded])
      }
      setLoading(false)
    }
    load().catch(() => { setError('無法連線到任務服務'); setLoading(false) })
  }, [])

  useEffect(() => { if (!remoteEnabled && !loading) window.localStorage.setItem('focusdesk.tasks', JSON.stringify(tasks)) }, [loading, tasks])

  async function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = newTitle.trim()
    if (!title || saving) return
    setSaving(true); setError(''); setNotice('')
    if (remoteEnabled) {
      const response = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) { setError(body.error ?? '新增任務失敗'); setSaving(false); return }
      setTasks(current => [normalize(body.task as ApiTask), ...current])
    } else {
      setTasks(current => [{ id: `local-${Date.now()}`, title, project: '收件匣', projectId: 'inbox', status: 'todo', priority: 'normal', createdAt: new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei' }).format(new Date()) }, ...current])
    }
    setNewTitle(''); setNotice('任務已新增至收件匣'); setSaving(false)
  }

  const active = useMemo(() => tasks.filter(task => !['completed', 'cancelled'].includes(task.status) && (!query || `${task.title}${task.project}`.toLowerCase().includes(query.toLowerCase()))), [tasks, query])
  const focus = active.filter(task => task.focus)
  const inbox = active.filter(task => task.projectId === 'inbox')
  const overdue = active.filter(task => task.dueBucket === 'overdue')
  const due = active.filter(task => task.dueBucket === 'today' && !task.focus)
  const upcoming = active.filter(task => task.dueBucket === 'upcoming')
  const doing = active.filter(task => task.status === 'in_progress' && !task.focus && !upcoming.includes(task))
  const finish = (id: string) => setTasks(current => current.map(task => task.id === id ? { ...task, status: 'completed' } : task))

  return <div className="shell"><Sidebar /><main className="main"><div className="topline"><div><h1>早安，Vince <span style={{ color: '#d9844b' }}>✦</span></h1><div className="date">今日工作台</div></div><div className="avatar">V</div></div><div className="quick"><Search size={18} color="#9ba59c" style={{ margin: '12px 0 0 12px' }} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜尋任務、專案或標籤…" /></div><form className="quick" onSubmit={add}><Plus size={18} color="#9ba59c" style={{ margin: '12px 0 0 12px' }} /><input value={newTitle} onChange={event => setNewTitle(event.target.value)} placeholder="輸入新任務名稱…" aria-label="新任務名稱" /><button type="submit" disabled={saving}><Plus size={17} /> {saving ? '儲存中…' : '新增任務'}</button></form>{error && <p role="alert" style={{ color: '#b92135', fontWeight: 700 }}>{error}</p>}{notice && <p role="status" style={{ color: '#2f7358', fontWeight: 700 }}>{notice}</p>}{loading ? <p className="empty">正在載入任務…</p> : <div className="sections"><section className="section"><h2>收件匣 <span>{inbox.length} 項</span></h2>{inbox.length ? inbox.map(task => <TaskRow key={task.id} task={task} onDone={() => finish(task.id)} />) : <p className="empty">輸入任務名稱後按「新增任務」，任務會先放在這裡。</p>}</section><section className="section"><h2>今日焦點 <span>{focus.length} 項</span></h2>{focus.length ? focus.map(task => <TaskRow key={task.id} task={task} onDone={() => finish(task.id)} />) : <p className="empty">還沒有今日焦點，挑一件重要的事開始吧。</p>}</section><section className="section"><h2><span style={{ color: '#c96c42' }}><CircleAlert size={15} style={{ verticalAlign: '-3px' }} /> 逾期</span><span>{overdue.length} 項</span></h2>{overdue.length ? overdue.map(task => <TaskRow key={task.id} task={task} onDone={() => finish(task.id)} />) : <p className="empty">太好了，目前沒有逾期任務。</p>}</section><section className="section"><h2>今天到期 <span>{due.length} 項</span></h2>{due.length ? due.map(task => <TaskRow key={task.id} task={task} onDone={() => finish(task.id)} />) : <p className="empty">今天沒有其他到期任務。</p>}</section><section className="section"><h2>即將到期／進行中 <span>未來 7 天</span></h2>{[...upcoming, ...doing].length ? [...upcoming, ...doing].map(task => <TaskRow key={task.id} task={task} onDone={() => finish(task.id)} />) : <p className="empty">接下來幾天很清爽。</p>}</section></div>}</main></div>
}

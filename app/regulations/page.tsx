'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, CheckSquare, ExternalLink, FolderKanban, Inbox, Search, Settings } from 'lucide-react'

type DocumentResult = { id: string; title: string; file_name: string; file_type: string; summary?: string | null; snippet?: string | null; storage_path: string }

function Sidebar() { return <aside className="sidebar"><div className="brand"><span className="brand-mark"><CheckSquare size={19} /></span><span>FocusDesk</span></div><p className="nav-title">工作空間</p><Link className="nav-item" href="/today"><CalendarDays size={17} /><span>今日</span></Link><Link className="nav-item" href="/projects"><FolderKanban size={17} /><span>專案</span></Link><Link className="nav-item" href="/inbox"><Inbox size={17} /><span>收件匣</span></Link><div className="side-bottom"><Link className="nav-item" href="/settings"><Settings size={17} /><span>設定</span></Link></div></aside> }

export default function RegulationsPage() {
  const [query, setQuery] = useState('')
  const [documents, setDocuments] = useState<DocumentResult[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function search(value = query) {
    setLoading(true); setError('')
    const response = await fetch(`/api/regulations?q=${encodeURIComponent(value)}`, { cache: 'no-store' })
    const body = await response.json().catch(() => ({}))
    if (!response.ok) setError(body.error ?? '無法搜尋法規文件'); else setDocuments(body.documents ?? [])
    setLoading(false)
  }

  useEffect(() => { search('').catch(() => { setError('無法連線到法規文件'); setLoading(false) }) }, [])
  function submit(event: FormEvent) { event.preventDefault(); search().catch(() => { setError('搜尋失敗'); setLoading(false) }) }

  return <div className="shell"><Sidebar /><main className="main"><Link href="/today" className="muted"><ArrowLeft size={15} style={{ verticalAlign: '-3px' }} /> 返回今日</Link><div className="topline" style={{ marginTop: 25 }}><div><h1>法規文件</h1><div className="date">搜尋公司內部法規資料，文件僅限登入使用者查看。</div></div><div className="avatar">R</div></div><form className="quick" onSubmit={submit}><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜尋文件名稱或全文內容…" aria-label="搜尋法規文件" /><button type="submit"><Search size={16} /> 搜尋</button></form>{error && <p role="alert" style={{ color: '#b92135', fontWeight: 700 }}>{error}</p>}<section className="section"><h2><span>搜尋結果</span><span>{loading ? '搜尋中…' : `${documents.length} 份文件`}</span></h2>{documents.length ? documents.map(document => <article className="task" key={document.id}><div className="task-title">{document.title}<div className="task-meta">{document.file_name} · {document.file_type}</div>{document.snippet && <div className="task-meta" style={{ marginTop: 8 }}>{document.snippet}</div>}</div><a href={`/api/regulations/${document.id}/file`} target="_blank" rel="noreferrer" aria-label={`查看：${document.title}`}><ExternalLink size={17} color="#2c5aa8" /></a></article>) : !loading && <p className="empty">尚未有可查詢文件，請先完成資料庫 migration 與本機匯入。</p>}</section></main></div>
}

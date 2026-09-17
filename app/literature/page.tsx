'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, CalendarDays, CheckSquare, ClipboardCheck, ExternalLink, FolderKanban, Inbox, Lightbulb, Search, Settings } from 'lucide-react'
import type { LiteraturePaper, ResearchIdea } from '../../lib/literature'

type DailyRecord = { date: string; query: string; papers: LiteraturePaper[]; ideas: ResearchIdea[] }

function Sidebar() {
  return <aside className="sidebar"><div className="brand"><span className="brand-mark"><CheckSquare size={19} /></span><span>FocusDesk</span></div><p className="nav-title">研究工作空間</p><Link className="nav-item" href="/today"><CalendarDays size={17} /><span>今日</span></Link><Link className="nav-item active" href="/literature"><BookOpen size={17} /><span>文獻研究</span></Link><Link className="nav-item" href="/esg"><ClipboardCheck size={17} /><span>ESG 學習</span></Link><Link className="nav-item" href="/projects"><FolderKanban size={17} /><span>專案</span></Link><Link className="nav-item" href="/inbox"><Inbox size={17} /><span>收件匣</span></Link><div className="side-bottom"><Link className="nav-item" href="/settings"><Settings size={17} /><span>設定</span></Link></div></aside>
}

export default function LiteraturePage() {
  const [query, setQuery] = useState('hospital quality patient safety')
  const [days, setDays] = useState('30')
  const [papers, setPapers] = useState<LiteraturePaper[]>([])
  const [ideas, setIdeas] = useState<ResearchIdea[]>([])
  const [history, setHistory] = useState<DailyRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const today = useMemo(() => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei' }).format(new Date()), [])
  useEffect(() => {
    const saved = window.localStorage.getItem('focusdesk.literature.history')
    if (saved) { try { setHistory(JSON.parse(saved) as DailyRecord[]) } catch { window.localStorage.removeItem('focusdesk.literature.history') } }
  }, [])

  async function search(event: React.FormEvent) {
    event.preventDefault(); setLoading(true); setError(''); setNotice('')
    try {
      const response = await fetch(`/api/literature/search?q=${encodeURIComponent(query.trim())}&days=${days}&limit=10`, { cache: 'no-store' })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(body.error ?? '搜尋失敗')
      setPapers(body.papers ?? []); setIdeas(body.ideas ?? []); setNotice(`已找到 ${body.papers?.length ?? 0} 篇文獻`)
    } catch (reason) { setError(reason instanceof Error ? reason.message : '搜尋失敗，請稍後重試') }
    finally { setLoading(false) }
  }

  function saveToday() {
    if (!papers.length) return setError('請先搜尋文獻，再儲存今日整理')
    const record = { date: today, query, papers, ideas }
    const next = [record, ...history.filter(item => !(item.date === today && item.query === query))].slice(0, 30)
    setHistory(next); window.localStorage.setItem('focusdesk.literature.history', JSON.stringify(next)); setNotice('已儲存今日文獻整理')
  }

  function loadRecord(record: DailyRecord) { setQuery(record.query); setPapers(record.papers); setIdeas(record.ideas); setNotice(`已載入 ${record.date} 的整理`) }

  return <div className="shell"><Sidebar /><main className="main"><Link href="/today" className="muted"><ArrowLeft size={15} style={{ verticalAlign: '-3px' }} /> 返回今日</Link><div className="topline" style={{ marginTop: 25 }}><div><h1>文獻研究工作台</h1><div className="date">每日搜尋、整理重點，形成可驗證的論文研究方向</div></div><div className="avatar">R</div></div><section className="section" style={{ marginTop: 28 }}><h2><span><Search size={16} style={{ verticalAlign: '-3px' }} /> 今日文獻搜尋</span><span>PubMed</span></h2><form onSubmit={search} className="research-form"><input value={query} onChange={event => setQuery(event.target.value)} placeholder="例如：hospital patient safety implementation" aria-label="文獻搜尋關鍵字" /><select value={days} onChange={event => setDays(event.target.value)} aria-label="搜尋期間"><option value="1">最近 1 日</option><option value="7">最近 7 日</option><option value="30">最近 30 日</option><option value="90">最近 90 日</option></select><button type="submit" disabled={loading}>{loading ? '搜尋中…' : '搜尋文獻'}</button></form><p className="task-meta">搜尋結果保留 PMID 與 PubMed 連結；摘要缺失時不自動推論。</p>{error && <p role="alert" style={{ color: '#b92135', fontWeight: 700 }}>{error}</p>}{notice && <p role="status" style={{ color: '#2f7358', fontWeight: 700 }}>{notice}</p>}</section><div className="research-grid"><section className="section"><h2><span><BookOpen size={16} style={{ verticalAlign: '-3px' }} /> 文獻與重點</span><span>{papers.length} 篇</span></h2>{papers.length ? papers.map(paper => <article className="paper-card" key={paper.pmid}><div className="paper-heading"><div><h3>{paper.title}</h3><div className="task-meta">{paper.journal} · {paper.year} · PMID {paper.pmid}</div></div><a href={paper.url} target="_blank" rel="noreferrer" aria-label={`開啟 PubMed：${paper.title}`}><ExternalLink size={17} color="#2c5aa8" /></a></div><div className="key-points"><strong>重點整理</strong>{paper.keyPoints.map((point, index) => <p key={`${paper.pmid}-${index}`}>{point}</p>)}</div></article>) : <p className="empty">輸入研究主題後搜尋，今天的文獻會顯示在這裡。</p>}</section><section className="section ideas"><h2><span><Lightbulb size={16} style={{ verticalAlign: '-3px' }} /> 可能的論文研究</span><span>候選</span></h2><p className="task-meta">以下是依搜尋結果整理的候選方向，需人工查證研究缺口與可行性。</p>{ideas.length ? ideas.map((idea, index) => <article className="idea-card" key={`${idea.title}-${index}`}><h3>{idea.title}</h3><p><strong>研究問題：</strong>{idea.question}</p><p><strong>可能設計：</strong>{idea.design}</p><p><strong>觀察結果：</strong>{idea.outcomes}</p><p><strong>需補查：</strong>{idea.gap}</p></article>) : <p className="empty">完成一次搜尋後，系統會列出研究方向候選。</p>}</section></div><section className="section" style={{ marginTop: 24 }}><div className="history-actions"><h2><span><CalendarDays size={16} style={{ verticalAlign: '-3px' }} /> 今日整理</span><button type="button" onClick={saveToday}>儲存今日整理</button></h2></div>{history.length ? history.slice(0, 5).map(record => <button className="history-row" key={`${record.date}-${record.query}`} onClick={() => loadRecord(record)}><span>{record.date} · {record.query}</span><span>{record.papers.length} 篇</span></button>) : <p className="empty">尚未儲存搜尋紀錄。</p>}</section></main></div>
}

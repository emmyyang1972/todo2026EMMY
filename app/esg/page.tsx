'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, CalendarDays, Check, CheckSquare, ClipboardCheck, ExternalLink, FolderKanban, Inbox, Settings } from 'lucide-react'
import { esgCrosswalk, esgLessons, lessonForDate, type EsgLesson } from '../../lib/esg-learning'

function Sidebar() {
  return <aside className="sidebar"><div className="brand"><span className="brand-mark"><CheckSquare size={19} /></span><span>FocusDesk</span></div><p className="nav-title">研究工作空間</p><Link className="nav-item" href="/today"><CalendarDays size={17} /><span>今日</span></Link><Link className="nav-item" href="/literature"><BookOpen size={17} /><span>文獻研究</span></Link><Link className="nav-item active" href="/esg"><ClipboardCheck size={17} /><span>ESG 學習</span></Link><Link className="nav-item" href="/projects"><FolderKanban size={17} /><span>專案</span></Link><Link className="nav-item" href="/inbox"><Inbox size={17} /><span>收件匣</span></Link><div className="side-bottom"><Link className="nav-item" href="/settings"><Settings size={17} /><span>設定</span></Link></div></aside>
}

function dateKey(date: Date) { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei' }).format(date) }

export default function EsgLearningPage() {
  const [tab, setTab] = useState<'daily' | 'crosswalk'>('daily')
  const [selected, setSelected] = useState<EsgLesson>(() => lessonForDate())
  const [completed, setCompleted] = useState<string[]>([])
  const today = useMemo(() => dateKey(new Date()), [])
  const selectedIndex = esgLessons.findIndex(item => item.id === selected.id)
  const done = completed.includes(selected.id)

  useEffect(() => {
    const saved = window.localStorage.getItem('focusdesk.esg.completed')
    if (saved) { try { setCompleted(JSON.parse(saved) as string[]) } catch { window.localStorage.removeItem('focusdesk.esg.completed') } }
  }, [])

  useEffect(() => { window.localStorage.setItem('focusdesk.esg.completed', JSON.stringify(completed)) }, [completed])

  function selectOffset(offset: number) { setSelected(esgLessons[(selectedIndex + offset + esgLessons.length) % esgLessons.length]) }
  function toggleComplete() { setCompleted(current => done ? current.filter(id => id !== selected.id) : [...current, selected.id]) }

  return <div className="shell"><Sidebar /><main className="main"><Link href="/today" className="muted"><ArrowLeft size={15} style={{ verticalAlign: '-3px' }} /> 返回今日</Link><div className="topline" style={{ marginTop: 25 }}><div><p className="eyebrow">ESG LEARNING LAB</p><h1>醫院永續報告書學習</h1><div className="date">每日拆解一個揭露要求，逐步建立醫院永續報告書與 GRI 對照能力</div></div><div className="avatar">E</div></div><div className="esg-tabs" role="tablist"><button className={tab === 'daily' ? 'active' : ''} onClick={() => setTab('daily')} role="tab">每日條文拆解</button><button className={tab === 'crosswalk' ? 'active' : ''} onClick={() => setTab('crosswalk')} role="tab">醫院報告書 ↔ GRI 對照</button></div>{tab === 'daily' ? <><section className="section esg-hero"><div><span className="eyebrow">TODAY · {today}</span><h2>{selected.title}</h2><p>{selected.standard} · {selected.disclosure}</p></div><button className={`complete-button ${done ? 'done' : ''}`} onClick={toggleComplete}>{done ? <><Check size={16} /> 已完成</> : '完成今日學習'}</button></section><div className="esg-nav"><button onClick={() => selectOffset(-1)}>← 上一條</button><span>第 {selectedIndex + 1} / {esgLessons.length} 條</span><button onClick={() => selectOffset(1)}>下一條 →</button></div><div className="esg-learning-grid"><section className="section"><h2>白話拆解</h2><p className="esg-lead">{selected.plainLanguage}</p><h3>醫院怎麼落地</h3><p>{selected.hospitalPractice}</p><h3>今天要找的證據</h3><ul className="evidence-list">{selected.evidence.map(item => <li key={item}>{item}</li>)}</ul></section><section className="section reflection"><h2>反思題</h2><p>{selected.reflection}</p><div className="source-card"><div><strong>參考來源</strong><span>{selected.sourceLabel}</span><small>{selected.sourcePath}</small></div><ExternalLink size={16} /></div></section></div><section className="section esg-index"><h2><span>學習清單</span><span>{completed.length} / {esgLessons.length} 已完成</span></h2><div className="lesson-list">{esgLessons.map(item => <button key={item.id} className={item.id === selected.id ? 'selected' : ''} onClick={() => setSelected(item)}><span className={completed.includes(item.id) ? 'lesson-check complete' : 'lesson-check'}>{completed.includes(item.id) && <Check size={12} />}</span><span><strong>{item.disclosure}</strong><small>{item.title}</small></span></button>)}</div></section></> : <section className="section"><div className="crosswalk-intro"><div><h2>從報告書章節回到 GRI 要求</h2><p className="task-meta">先問醫院實務問題，再核對揭露編號與可驗證證據。這是學習對照，不代表已完成合規判定。</p></div><ClipboardCheck size={32} color="#2f7358" /></div><div className="crosswalk-table-wrap"><table className="crosswalk-table"><thead><tr><th>報告書主題</th><th>醫院先問</th><th>GRI 對照</th><th>揭露</th><th>應備證據</th></tr></thead><tbody>{esgCrosswalk.map(row => <tr key={row.reportSection}><td><strong>{row.reportSection}</strong></td><td>{row.hospitalQuestion}</td><td><span className="gri-pill">{row.gri}</span></td><td>{row.disclosure}</td><td>{row.evidence}</td></tr>)}</tbody></table></div><p className="task-meta crosswalk-note">參考資料存放於 `C:\1ESG`；原始 PDF／Excel 未複製到專案，正式揭露前仍須回到原文與醫院內部紀錄核對。</p></section>}</main></div>
}

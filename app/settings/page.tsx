import Link from 'next/link'
import { CalendarDays, CheckSquare, FolderKanban, Inbox, Settings } from 'lucide-react'

function Sidebar() {
  return <aside className="sidebar"><div className="brand"><span className="brand-mark"><CheckSquare size={19} /></span><span>FocusDesk</span></div><p className="nav-title">工作空間</p><Link className="nav-item" href="/today"><CalendarDays size={17} /><span>今日</span></Link><Link className="nav-item" href="/projects"><FolderKanban size={17} /><span>專案</span></Link><Link className="nav-item" href="/inbox"><Inbox size={17} /><span>收件匣</span></Link><div className="side-bottom"><Link className="nav-item active" href="/settings"><Settings size={17} /><span>設定</span></Link></div></aside>
}

export default function SettingsPage() {
  return <div className="shell"><Sidebar /><main className="main"><div className="topline"><div><h1>設定</h1><div className="date">管理 FocusDesk 的工作方式與資料連線。</div></div><div className="avatar">V</div></div><div className="sections" style={{ marginTop: 32 }}><section className="section"><h2>工作模式</h2><div className="task"><div className="task-title">目前資料模式<div className="task-meta">尚未設定 Supabase，使用此瀏覽器的 localStorage 儲存資料。</div></div><span className="pill">本地開發</span></div></section><section className="section"><h2>帳戶</h2><div className="task"><div className="task-title">登入功能<div className="task-meta">設定 Supabase 環境變數後，可由登入頁連接 Google OAuth。</div></div><Link className="muted" href="/login">前往登入</Link></div></section></div></main></div>
}

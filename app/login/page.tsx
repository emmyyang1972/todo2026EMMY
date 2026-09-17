'use client'
import { useState } from 'react'
import { createClient } from '../../lib/supabase'
import { CheckSquare, ArrowRight } from 'lucide-react'

export default function Login() {
  const [loading, setLoading] = useState(false)
  async function login() { setLoading(true); const supabase = createClient(); await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/auth/callback` } }); setLoading(false) }
  return <main className="auth"><div className="auth-card"><div className="brand"><span className="brand-mark"><CheckSquare size={19}/></span> FocusDesk</div><div className="auth-copy"><p className="eyebrow">MEDICAL QUALITY WORKSPACE</p><h1>讓每項工作，<br/><em>都有清楚的依據。</em></h1><p>以結構化任務、研究與文件，支持可靠的醫療品質工作。</p></div><button className="google-btn" onClick={login} disabled={loading}><span className="google">G</span>{loading ? '連線中…' : '使用 Google 登入'}<ArrowRight size={18}/></button><small>登入即代表你同意我們的服務條款。</small></div></main>
}

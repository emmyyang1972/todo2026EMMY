'use client'
import { useState } from 'react'
import { createClient } from '../../lib/supabase'
import { CheckSquare, ArrowRight } from 'lucide-react'

export default function Login() {
  const [loading, setLoading] = useState(false)
  async function login() { setLoading(true); const supabase = createClient(); await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/auth/callback` } }); setLoading(false) }
  return <main className="auth"><div className="pikachu" role="img" aria-label="會跳的皮卡丘"><span className="pika-ear pika-ear-left" /><span className="pika-ear pika-ear-right" /><span className="pika-tail" /><span className="pika-body"><i className="pika-eye pika-eye-left" /><i className="pika-eye pika-eye-right" /><i className="pika-cheek pika-cheek-left" /><i className="pika-cheek pika-cheek-right" /><b className="pika-mouth" /></span></div><div className="auth-card"><div className="brand"><span className="brand-mark"><CheckSquare size={19}/></span> FocusDesk</div><div className="auth-copy"><p className="eyebrow">YOUR CALM WORKSPACE</p><h1>把注意力，留給<br/><em>真正重要的事。</em></h1><p>清楚整理每一天的任務，讓專案穩定向前。</p></div><button className="google-btn" onClick={login} disabled={loading}><span className="google">G</span>{loading ? '連線中…' : '使用 Google 登入'}<ArrowRight size={18}/></button><small>登入即代表你同意我們的服務條款。</small></div></main>
}

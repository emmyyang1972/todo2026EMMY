import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'FocusDesk', description: '專注於真正重要的待辦事項' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="zh-Hant"><body>{children}</body></html> }

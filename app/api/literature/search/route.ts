import { NextResponse } from 'next/server'
import { buildResearchIdeas, summarizeAbstract, type LiteraturePaper } from '../../../../lib/literature'

const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'

function xmlValue(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i'))
  return match ? decodeXml(match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()) : ''
}

function decodeXml(value: string) {
  return value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&')
}

async function fetchText(url: string) {
  const response = await fetch(url, { headers: { 'User-Agent': 'FocusDesk literature research tool' }, signal: AbortSignal.timeout(15000), cache: 'no-store' })
  if (!response.ok) throw new Error(`NCBI 回應 ${response.status}`)
  return response.text()
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const query = (params.get('q') ?? '').trim()
  const days = Math.min(Math.max(Number(params.get('days') ?? 30) || 30, 1), 365)
  const limit = Math.min(Math.max(Number(params.get('limit') ?? 10) || 10, 1), 20)
  if (!query) return NextResponse.json({ error: '請輸入文獻搜尋關鍵字' }, { status: 400 })
  try {
    const term = `${query} AND ("last ${days} days"[PDat])`
    const searchUrl = `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=${limit}&sort=date&term=${encodeURIComponent(term)}`
    const search = await (await fetch(searchUrl, { signal: AbortSignal.timeout(15000), cache: 'no-store' })).json() as { esearchresult?: { idlist?: string[] } }
    const ids = search.esearchresult?.idlist ?? []
    if (!ids.length) return NextResponse.json({ papers: [], ideas: [], query, days })
    const xml = await fetchText(`${EUTILS}/efetch.fcgi?db=pubmed&retmode=xml&id=${ids.join(',')}`)
    const papers: LiteraturePaper[] = (xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/gi) ?? []).map(article => {
      const abstract = (article.match(/<AbstractText(?:\s[^>]*)?>([\s\S]*?)<\/AbstractText>/gi) ?? []).map(item => item.replace(/<AbstractText[^>]*>/i, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).join(' ')
      const journal = xmlValue(article, 'ISOAbbreviation') || xmlValue(article, 'Journal') || '期刊未標示'
      const year = (xmlValue(article, 'Year') || xmlValue(article, 'PubDate')).match(/\b(19|20)\d{2}\b/)?.[0] ?? '年份未標示'
      const pmid = xmlValue(article, 'PMID')
      return { pmid, title: xmlValue(article, 'ArticleTitle'), journal, year, abstract: decodeXml(abstract), keyPoints: summarizeAbstract(decodeXml(abstract)), url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` }
    }).filter(paper => paper.pmid && paper.title)
    return NextResponse.json({ papers, ideas: buildResearchIdeas(papers), query, days })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? `文獻搜尋失敗：${error.message}` : '文獻搜尋失敗，請稍後重試' }, { status: 502 })
  }
}

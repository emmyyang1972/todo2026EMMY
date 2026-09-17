import { buildResearchIdeas, summarizeAbstract, type LiteraturePaper, type ResearchIdea } from './literature'

const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'
const ESG_TERMS = '(ESG[Title/Abstract] OR "environmental sustainability"[Title/Abstract] OR "social sustainability"[Title/Abstract] OR "sustainable healthcare"[Title/Abstract] OR climate[Title/Abstract] OR carbon[Title/Abstract] OR green[Title/Abstract])'
const HEALTH_TERMS = '(hospital*[Title/Abstract] OR healthcare[Title/Abstract] OR "health care"[Title/Abstract] OR medical[Title/Abstract] OR health system*[Title/Abstract])'

export type DailyPaper = LiteraturePaper & { region: '台灣' | '國際'; authors: string[]; doi?: string }
export type DailyDigest = { date: string; papers: DailyPaper[]; ideas: ResearchIdea[] }

function decodeXml(value: string) { return value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&') }
function xmlValue(xml: string, tag: string) {
  const match = xml.match(new RegExp('<' + tag + '(?:\\s[^>]*)?>([\\s\\S]*?)</' + tag + '>', 'i'))
  return match ? decodeXml(match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()) : ''
}
function abstractValue(article: string) {
  return decodeXml((article.match(/<AbstractText(?:\s[^>]*)?>([\s\S]*?)<\/AbstractText>/gi) ?? []).map(item => item.replace(/<AbstractText[^>]*>/i, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).join(' '))
}
function authorsValue(article: string) {
  return [...article.matchAll(/<Author[^>]*>[\s\S]*?<LastName>([^<]+)<\/LastName>[\s\S]*?(?:<Initials>([^<]+)<\/Initials>)?[\s\S]*?<\/Author>/gi)].map(match => match[1] + (match[2] ? ' ' + match[2] : ''))
}
async function fetchJson(url: string) {
  const response = await fetch(url, { headers: { 'User-Agent': 'FocusDesk daily literature research tool' }, signal: AbortSignal.timeout(20000), cache: 'no-store' })
  if (!response.ok) throw new Error('NCBI 回應 ' + response.status)
  return response.json() as Promise<{ esearchresult?: { idlist?: string[] } }>
}
async function fetchXml(url: string) {
  const response = await fetch(url, { headers: { 'User-Agent': 'FocusDesk daily literature research tool' }, signal: AbortSignal.timeout(20000), cache: 'no-store' })
  if (!response.ok) throw new Error('NCBI 回應 ' + response.status)
  return response.text()
}
async function searchPool(term: string, region: DailyPaper['region'], limit = 5) {
  const search = await fetchJson(EUTILS + '/esearch.fcgi?db=pubmed&retmode=json&retmax=' + Math.max(limit, 10) + '&sort=date&term=' + encodeURIComponent(term + ' AND ("last 365 days"[PDat])'))
  const ids = search.esearchresult?.idlist ?? []
  if (!ids.length) return []
  const xml = await fetchXml(EUTILS + '/efetch.fcgi?db=pubmed&retmode=xml&id=' + ids.join(','))
  return (xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/gi) ?? []).map(article => {
    const abstract = abstractValue(article)
    const pmid = xmlValue(article, 'PMID')
    const doi = [...article.matchAll(/<ArticleId IdType="doi">([^<]+)<\/ArticleId>/gi)][0]?.[1]
    const dateText = xmlValue(article, 'Year') || xmlValue(article, 'PubDate')
    const year = dateText.match(/\b(19|20)\d{2}\b/)?.[0] ?? '年份未標示'
    return { pmid, title: xmlValue(article, 'ArticleTitle'), journal: xmlValue(article, 'ISOAbbreviation') || '期刊未標示', year, abstract, keyPoints: summarizeAbstract(abstract), url: 'https://pubmed.ncbi.nlm.nih.gov/' + pmid + '/', region, authors: authorsValue(article), doi: doi ? decodeXml(doi) : undefined }
  }).filter(paper => paper.pmid && paper.title).slice(0, limit) as DailyPaper[]
}
export async function collectDailyDigest(date: string): Promise<DailyDigest> {
  const taiwan = await searchPool(ESG_TERMS + ' AND ' + HEALTH_TERMS + ' AND (Taiwan[Affiliation] OR Taiwan[Title/Abstract])', '台灣')
  let international = await searchPool(ESG_TERMS + ' AND ' + HEALTH_TERMS + ' NOT Taiwan[Affiliation]', '國際')
  const selected = [...taiwan, ...international]
  if (selected.length < 10) {
    const fallback = await searchPool(ESG_TERMS + ' AND ' + HEALTH_TERMS, '國際', 20)
    const seen = new Set(selected.map(paper => paper.pmid))
    international = [...international, ...fallback.filter(paper => !seen.has(paper.pmid))]
  }
  const papers = [...taiwan, ...international].filter((paper, index, all) => all.findIndex(item => item.pmid === paper.pmid) === index).slice(0, 10)
  const ideas = buildResearchIdeas(papers).slice(0, 3)
  const defaults = ['醫院 ESG 指標與醫療品質的關聯', '低碳醫療措施的臨床落地評估', '醫療組織永續治理的執行障礙']
  while (ideas.length < 3) ideas.push({ title: defaults[ideas.length], question: '如何在醫療場域建立可追蹤、可驗證的研究設計？', design: '混合方法研究，搭配流程指標、結果指標與利害關係人訪談。', outcomes: '品質、安全、碳排、成本與執行可行性。', gap: '需人工確認研究場域、樣本數、資料來源與倫理審查要求。' })
  return { date, papers, ideas }
}

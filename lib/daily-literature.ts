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
export function digestEmailHtml(digest: DailyDigest) {
  const rows = digest.papers.map((paper, index) => '<tr><td style="padding:16px 0;border-bottom:1px solid #d9e2ec;vertical-align:top"><div style="font-size:12px;color:#159a9c;font-weight:700">' + (index + 1) + '. ' + paper.region + ' · ' + paper.journal + ' · ' + paper.year + '</div><a href="' + paper.url + '" style="display:block;margin:5px 0;color:#123b5d;font-size:16px;font-weight:700;text-decoration:none">' + paper.title + '</a><div style="color:#526b82;font-size:13px;line-height:1.7">' + paper.keyPoints.join(' ') + '</div></td></tr>').join('')
  const ideas = digest.ideas.map((idea, index) => '<li style="margin:0 0 14px"><strong>' + (index + 1) + '. ' + idea.title + '</strong><br><span style="color:#526b82">研究問題：' + idea.question + '<br>可能設計：' + idea.design + '</span></li>').join('')
  return '<!doctype html><html lang="zh-Hant"><body style="margin:0;background:#f4f8fb;font-family:Arial, sans-serif;color:#102a43"><div style="max-width:720px;margin:0 auto;padding:32px 20px"><div style="background:#123b5d;color:white;padding:24px 28px;border-radius:14px 14px 0 0"><div style="font-size:11px;letter-spacing:2px;color:#8de0d8">FOCUSDESK · MEDICAL QUALITY WORKSPACE</div><h1 style="margin:10px 0 0;font-size:26px">每日 ESG 醫療文獻摘要</h1><div style="margin-top:6px;color:#dcecf5">' + digest.date + ' · ' + digest.papers.length + ' 篇</div></div><div style="background:#fff;padding:22px 28px"><h2 style="color:#123b5d;font-size:18px">今日研究文獻</h2><table style="width:100%;border-collapse:collapse">' + rows + '</table><h2 style="margin-top:28px;color:#123b5d;font-size:18px">待辦區：研究題目建議</h2><ol style="padding-left:22px;line-height:1.65">' + ideas + '</ol></div><div style="padding:18px 28px;color:#7890a5;font-size:12px">資料來源：PubMed／NCBI E-utilities。摘要為自動整理，請開啟原文進行正式判讀。</div></div></body></html>'
}

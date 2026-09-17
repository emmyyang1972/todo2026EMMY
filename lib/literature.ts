export type LiteraturePaper = {
  pmid: string
  title: string
  journal: string
  year: string
  abstract: string
  keyPoints: string[]
  url: string
}

export type ResearchIdea = {
  title: string
  question: string
  design: string
  outcomes: string
  gap: string
}

export function summarizeAbstract(abstract: string): string[] {
  if (!abstract.trim()) return ['PubMed 未提供摘要，需開啟原文進行人工閱讀。']
  const sentences = abstract.replace(/\s+/g, ' ').split(/(?<=[.!?。！？])\s+/).filter(Boolean)
  return sentences.slice(0, 3)
}

export function buildResearchIdeas(papers: LiteraturePaper[]): ResearchIdea[] {
  const text = papers.map(paper => `${paper.title} ${paper.abstract}`).join(' ').toLowerCase()
  const ideas: ResearchIdea[] = []
  if (/quality|品質|safety|安全|infection|感染/.test(text)) ideas.push({ title: '醫療品質／病人安全介入的在地成效', question: '在本院或目標醫療場域導入文獻中的品質或安全介入後，照護結果是否改善？', design: '前後比較或準實驗研究，搭配流程稽核與訪談。', outcomes: '感染率、事件率、遵從率、住院天數與工作流程時間。', gap: '需人工確認介入內容、基線值、混雜因素與追蹤期。' })
  if (/implementation|implement|落地|adoption|barrier|culture/.test(text)) ideas.push({ title: '醫療措施落地的阻礙與促進因素', question: '哪些組織、團隊與個人因素影響研究證據在臨床現場的採用？', design: '混合方法研究：量化問卷加上半結構訪談或焦點團體。', outcomes: '採用率、持續使用率、執行忠實度與人員接受度。', gap: '需人工補查適用理論、量表授權、抽樣策略與倫理審查。' })
  if (/carbon|climate|green|environment|waste|energy|碳|氣候|綠色|環境|廢棄物|能源/.test(text)) ideas.push({ title: '醫療流程減碳與照護品質的平衡', question: '高碳排醫療流程的減量介入，是否同時維持或改善病人安全與服務品質？', design: '生命週期盤查結合前後比較，或比較不同流程的碳排與臨床結果。', outcomes: 'CO2e、能源／耗材用量、成本、病人結果與人員負擔。', gap: '需人工確認排放係數、盤查邊界、替代方案與品質安全門檻。' })
  if (/cost|economic|成本|費用|resource|資源/.test(text)) ideas.push({ title: '介入措施的成本與可持續性', question: '介入的成效是否足以抵銷新增成本與人力負荷，並能在日常作業中持續？', design: '成本效果分析或多準則評估，搭配執行成效追蹤。', outcomes: '每件改善成本、時間成本、成本效果比與維持率。', gap: '需人工確認成本觀點、計算期間、資料完整性與可比較性。' })
  if (!ideas.length) ideas.push({ title: '將目前證據轉化為可驗證的場域研究', question: '目前文獻結果在本研究場域、族群或制度下是否仍然成立？', design: '先做範疇回顧與可行性研究，再依結果進行觀察性或介入研究。', outcomes: '主要照護結果、流程指標、使用者經驗與執行可行性。', gap: '需人工確認研究族群、主要終點、樣本數、偏差與倫理要求。' })
  return ideas.slice(0, 5)
}

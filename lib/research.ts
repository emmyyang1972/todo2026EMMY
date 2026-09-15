export type ResearchPaper = { title: string; url: string; description: string; folder?: string }

export const researchPapers: ResearchPaper[] = [
  { title: 'What is the relationship between hospital management practices and quality of care?', url: 'https://pubmed.ncbi.nlm.nih.gov/39575503/', description: '全球醫院管理實務與醫療品質關聯的系統性回顧。' },
  { title: 'The effectiveness of quality management interventions in reducing hospital-associated infections', url: 'https://pubmed.ncbi.nlm.nih.gov/39952629/', description: '品質管理介入降低成人住院病人醫療照護相關感染的系統性回顧。' },
  { title: 'Optimizing ward rounds: systematic review and meta-analysis of interventions to enhance patient safety', url: 'https://pubmed.ncbi.nlm.nih.gov/40202092/', description: '改善病房查房流程與病人安全的系統性回顧與統合分析。' },
  { title: 'Improving patient safety culture in hospitals: A scoping review', url: 'https://pubmed.ncbi.nlm.nih.gov/40506293/', description: '醫院病人安全文化改善策略的範疇回顧。' },
  { title: 'Strategies and tools to learn from work that goes well within healthcare patient safety practices', url: 'https://pubmed.ncbi.nlm.nih.gov/40229754/', description: '從醫療工作成功案例學習、改善病人安全的混合方法系統性回顧。' },
]

export const esgPapers: ResearchPaper[] = [
  { title: 'Interventions to reduce greenhouse gas emissions from health-system solid waste: a systematic review', url: 'https://pubmed.ncbi.nlm.nih.gov/41698385/', description: '重點：醫療固體廢棄物應以減量、再使用、回收與生命週期管理為核心。落地：先建立廢棄物盤查，再依 waste hierarchy 設定採購、分類與處置指標。', folder: 'ESG醫療' },
  { title: 'Green hospitals: maximizing health and climate benefits globally', url: 'https://pubmed.ncbi.nlm.nih.gov/40382960/', description: '重點：能源、廢棄物、水、供應鏈、遠距醫療與生物親和設計可共同降低碳排並提升韌性。落地：以跨部門氣候行動框架設定年度減碳與健康成果。', folder: 'ESG醫療' },
  { title: 'Environmental sustainability in healthcare: impacts of climate change, challenges and opportunities', url: 'https://pubmed.ncbi.nlm.nih.gov/41090314/', description: '重點：醫療設施、供應鏈與臨床流程都會受到氣候風險影響。落地：用 rethink、reduce、reuse、repair、recycle 與 research 六類行動盤點科別機會。', folder: 'ESG醫療' },
  { title: 'Implementing a Sustainability Framework in Healthcare: A Three-Lens Framework', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10340760/', description: '重點：永續落地需要政治、策略與文化三個視角同時推進。落地：由治理層授權、納入核心策略，再透過文化與臨床團隊建立持續改善機制。', folder: 'ESG醫療' },
  { title: 'Implementing Clinical Decarbonization Actions: Lessons Learned from the University of California Health System', url: 'https://pubmed.ncbi.nlm.nih.gov/41073170/', description: '重點：前線人員面臨競爭優先事項，成功需要資料、專責時間、資金、同儕專家與供應鏈協作。落地：把永續納入醫院使命與臨床工作責任。', folder: 'ESG醫療' },
  { title: "Cleaner air, healthier hospitals: Implementing the UK's Clean Air Hospital Framework", url: 'https://pubmed.ncbi.nlm.nih.gov/40669189/', description: '重點：醫院可用室內外監測網掌握 NO2、PM10 與 PM2.5，連結交通與能源排放管理。落地：建立基線監測、公開指標與改善後追蹤。', folder: 'ESG醫療' },
  { title: 'Assessing the environmental impact of coronary artery bypass grafting to decrease its footprint', url: 'https://pubmed.ncbi.nlm.nih.gov/39960886/', description: '重點：冠狀動脈繞道手術單一病人流程具有顯著碳與其他環境足跡。落地：以生命週期評估找出手術室能源、耗材、運輸與恢復流程的減量點。', folder: 'ESG醫療' },
  { title: 'Switch It Off! Carbon, Financial and Health Service Impacts of Switching Off a Computed Tomography Scanner', url: 'https://pubmed.ncbi.nlm.nih.gov/40975894/', description: '重點：非必要時段關閉閒置 CT 可降低能源使用，且研究未發現明顯臨床負面影響。落地：建立設備待機規範、責任人與能源成效儀表板。', folder: 'ESG醫療' },
  { title: 'Implementation of Green Surgery Approach in Healthcare System and its Effect on Carbon Footprint Reduction in Operating Theatres', url: 'https://pubmed.ncbi.nlm.nih.gov/40417196/', description: '重點：可重複器械、HVAC 優化、再生能源、廢棄物管理與員工訓練是綠色手術的主要介入方向。落地：以手術路徑建立碳盤查並同步檢核病人安全。', folder: 'ESG醫療' },
  { title: 'Effectiveness of Interventions to Reduce Carbon-Emissions Within Secondary Healthcare', url: 'https://pubmed.ncbi.nlm.nih.gov/41978671/', description: '重點：不同專科與照護路徑的減碳證據仍不均，需同時確認成本、照護品質與排放結果。落地：優先選擇高碳排臨床路徑做比較性改善研究。', folder: 'ESG醫療' },
]

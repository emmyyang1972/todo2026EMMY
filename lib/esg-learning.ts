export type EsgLesson = {
  id: string
  standard: string
  disclosure: string
  title: string
  plainLanguage: string
  hospitalPractice: string
  evidence: string[]
  reflection: string
  sourcePath: string
  sourceLabel: string
}

export type EsgCrosswalk = {
  reportSection: string
  hospitalQuestion: string
  gri: string
  disclosure: string
  evidence: string
  sourcePath: string
}

export const esgLessons: EsgLesson[] = [
  { id: 'gri-1-01', standard: 'GRI 1：基礎 2021', disclosure: 'GRI 1：使用 GRI Standards 的基本原則', title: '先確認報告的目的與邊界', plainLanguage: '永續報告書不是把活動成果堆在一起，而是要讓讀者理解組織對經濟、環境與人群的重大影響。', hospitalPractice: '先畫出醫院的組織邊界與營運範圍：院本部、分院、附設機構、外包服務與供應鏈，避免只寫最容易取得的資料。', evidence: ['組織與報告邊界圖', '納入與排除單位清單', '資料負責人與更新週期'], reflection: '如果今天要讓病人、員工與董事會各自找到關心的資訊，報告書需要補哪一段？', sourcePath: 'C:\\1ESG\\GRI\\GRI 1- Foundation 2021 - Traditional Chinese.pdf', sourceLabel: 'GRI 1 基礎 2021' },
  { id: 'gri-1-02', standard: 'GRI 1：基礎 2021', disclosure: 'GRI 1：報導原則', title: '把品質原則變成編輯檢查表', plainLanguage: '報告內容要平衡、清楚、可比較、及時、可驗證；只寫亮點而不寫風險，會削弱可信度。', hospitalPractice: '同一個指標要固定定義、期間、計算方式與資料來源；若今年改變邊界或算法，要在報告書明確說明。', evidence: ['指標定義表', '年度比較資料', '查證或內部覆核紀錄'], reflection: '醫院目前有哪些數據只有單年數字，還不能支持趨勢判讀？', sourcePath: 'C:\\1ESG\\GRI\\GRI 1- Foundation 2021 - Traditional Chinese.pdf', sourceLabel: 'GRI 1 基礎 2021' },
  { id: 'gri-2-01', standard: 'GRI 2：一般揭露 2021', disclosure: 'GRI 2-1 組織詳細資訊', title: '讓讀者知道「誰」在負責', plainLanguage: '報告書要交代組織名稱、所有權、法律形式、營運地點與主要活動，讓後續數據有清楚的主體。', hospitalPractice: '醫院可把醫療服務、教學、研究、公共衛生與附設事業分開描述，並說明各單位是否納入本報告。', evidence: ['醫院基本資料', '服務與院區清單', '組織邊界說明'], reflection: '讀者能否只看報告書就判斷本院區與附設單位是否納入？', sourcePath: 'C:\\1ESG\\GRI\\GRI 2- General Disclosures 2021 - Traditional Chinese.pdf', sourceLabel: 'GRI 2 一般揭露 2021' },
  { id: 'gri-2-02', standard: 'GRI 2：一般揭露 2021', disclosure: 'GRI 2-9 治理結構與組成', title: '把治理責任寫到人與機制', plainLanguage: '永續工作不能只寫「成立 ESG 小組」，還要交代最高治理單位、委員會、權責與報告路徑。', hospitalPractice: '畫出院級永續治理架構，標明院長、董事會、永續委員會、品質／職安／環安單位與各資料窗口的責任。', evidence: ['治理架構圖', '委員會議事錄', '權責矩陣與年度追蹤表'], reflection: '哪一個永續風險目前沒有明確的決策者或升級路徑？', sourcePath: 'C:\\1ESG\\GRI\\GRI 2- General Disclosures 2021 - Traditional Chinese.pdf', sourceLabel: 'GRI 2 一般揭露 2021' },
  { id: 'gri-2-04', standard: 'GRI 2：一般揭露 2021', disclosure: 'GRI 2-29 利害關係人議合', title: '不要把利害關係人議合寫成宣傳', plainLanguage: '議合要交代對象、方式、頻率、關心議題，以及議合結果如何影響決策。', hospitalPractice: '將病人、家屬、員工、醫師、供應商、主管機關、社區與志工分組，對應問卷、座談、申訴、病安事件或員工調查等證據。', evidence: ['利害關係人地圖', '議合紀錄與回覆率', '議題如何進入改善計畫的紀錄'], reflection: '今年哪一項利害關係人意見真正改變了醫院的資源或流程？', sourcePath: 'C:\\1ESG\\GRI\\GRI 2- General Disclosures 2021 - Traditional Chinese.pdf', sourceLabel: 'GRI 2 一般揭露 2021' },
  { id: 'gri-3-01', standard: 'GRI 3：重大主題 2021', disclosure: 'GRI 3-1 鑑別重大主題的流程', title: '從影響出發，而不是從熱門議題出發', plainLanguage: '重大主題應依組織對經濟、環境與人群的實際或潛在影響來判定，不能只因為 ESG 熱門就列入。', hospitalPractice: '把病人安全、醫療可近性、員工健康、能源與碳排、醫療廢棄物、供應鏈人權等議題放進影響評估流程。', evidence: ['影響清單與評估準則', '重大主題排序矩陣', '利害關係人與專家意見'], reflection: '若只看媒體聲量，哪些真正影響病人與員工的議題可能被忽略？', sourcePath: 'C:\\1ESG\\GRI\\GRI 3- Material Topics 2021 - Traditional Chinese.pdf', sourceLabel: 'GRI 3 重大主題 2021' },
  { id: 'gri-3-02', standard: 'GRI 3：重大主題 2021', disclosure: 'GRI 3-2 重大主題清單', title: '公布主題，也公布判定邏輯', plainLanguage: '列出重大主題只是結果，還要讓讀者知道主題如何被選出、今年是否有變動，以及主題的影響範圍。', hospitalPractice: '用一頁表格呈現重大主題、影響對象、影響地點、正負面影響與對應 GRI 主題準則。', evidence: ['重大主題清單', '年度變動說明', '主題與指標對照表'], reflection: '本院今年重大主題與上一年度不同時，報告書是否說明原因？', sourcePath: 'C:\\1ESG\\GRI\\GRI 3- Material Topics 2021 - Traditional Chinese.pdf', sourceLabel: 'GRI 3 重大主題 2021' },
  { id: 'gri-3-03', standard: 'GRI 3：重大主題 2021', disclosure: 'GRI 3-3 重大主題的管理', title: '每個重大主題都要接到管理循環', plainLanguage: '完整揭露應說明影響、政策承諾、責任、行動、目標、指標與改善結果，而不是只列活動名稱。', hospitalPractice: '用「風險／影響－制度－行動－指標－檢討」串起病安、職安、能源、廢棄物與供應商管理。', evidence: ['政策與程序', '年度目標與績效', '異常事件與改善追蹤'], reflection: '哪個主題只有活動照片，卻缺少目標、指標或改善結果？', sourcePath: 'C:\\1ESG\\GRI\\GRI 3- Material Topics 2021 - Traditional Chinese.pdf', sourceLabel: 'GRI 3 重大主題 2021' },
  { id: 'gri-308-01', standard: 'GRI 308：供應商環境評估 2016', disclosure: 'GRI 308-1 以環境準則篩選新供應商', title: '供應商管理要能留下篩選證據', plainLanguage: '揭露重點不是「重視綠色採購」，而是新供應商中有多少依環境準則篩選，以及準則是什麼。', hospitalPractice: '將醫材、藥品、清潔、餐飲、洗滌、工程與能源採購分群，建立環境問卷、資格審查與採購評選紀錄。', evidence: ['供應商環境問卷', '評選表與合約條款', '新供應商總數與篩選數'], reflection: '本院哪一類高金額或高環境影響採購還沒有環境準則？', sourcePath: 'C:\\1ESG\\GRI\\GRI 308-1(範例說明).xlsx', sourceLabel: 'GRI 308-1 範例說明' },
  { id: 'gri-308-02', standard: 'GRI 308：供應商環境評估 2016', disclosure: 'GRI 308-2 供應鏈負面環境衝擊', title: '發現問題後要寫改善閉環', plainLanguage: '如果供應商評估發現實際或潛在負面環境衝擊，報告書要交代數量、地點、影響與改善處理。', hospitalPractice: '將缺失分級，連結限期改善、複查、輔導、暫停採購或替代供應商決策，並保留結案證據。', evidence: ['供應商風險分級', '改善通知與複查紀錄', '已改善／未改善件數'], reflection: '若供應商沒有改善，醫院的升級處置與採購決策由誰核准？', sourcePath: 'C:\\1ESG\\GRI\\GRI 308-2(範例說明).xlsx', sourceLabel: 'GRI 308-2 範例說明' },
  { id: 'hospital-report-01', standard: '醫院永續報告書實務', disclosure: '報告書章節與 GRI 對照', title: '從醫院報告書反查資料證據', plainLanguage: '學習寫作最快的方式，是拿實際醫院報告書逐章反查：這段敘述對應哪個重大主題、哪個 GRI 揭露與哪份原始紀錄？', hospitalPractice: '以高醫、長庚、新光與中山醫院等資料夾內報告為案例，先看章節架構，再回到本院找同類資料，不直接照抄敘事。', evidence: ['章節目錄與 GRI 索引', '指標數據與年度比較', '案例背後的制度或紀錄'], reflection: '本院最容易先完成哪一章？最缺資料的是哪一章？', sourcePath: 'C:\\1ESG\\台灣醫院永續報告書', sourceLabel: '台灣醫院永續報告書案例集' },
]

export const esgCrosswalk: EsgCrosswalk[] = [
  { reportSection: '組織與報告邊界', hospitalQuestion: '哪些院區、附設單位與重大外包活動納入？', gri: 'GRI 2', disclosure: '2-1、2-2', evidence: '組織資料、邊界清單、報告範圍說明', sourcePath: 'C:\\1ESG\\GRI\\GRI 2- General Disclosures 2021 - Traditional Chinese.pdf' },
  { reportSection: '永續治理', hospitalQuestion: '誰負責決策、監督與追蹤永續風險？', gri: 'GRI 2', disclosure: '2-9、2-12、2-13', evidence: '治理架構、會議紀錄、權責矩陣', sourcePath: 'C:\\1ESG\\GRI\\GRI 2- General Disclosures 2021 - Traditional Chinese.pdf' },
  { reportSection: '利害關係人議合', hospitalQuestion: '病人、員工、供應商與社區的意見如何影響優先順序？', gri: 'GRI 2', disclosure: '2-29', evidence: '議合計畫、回饋統計、議題回應紀錄', sourcePath: 'C:\\1ESG\\GRI\\GRI 2- General Disclosures 2021 - Traditional Chinese.pdf' },
  { reportSection: '重大主題分析', hospitalQuestion: '重大主題如何鑑別、排序與年度更新？', gri: 'GRI 3', disclosure: '3-1、3-2', evidence: '影響評估、重大主題矩陣、年度變動說明', sourcePath: 'C:\\1ESG\\GRI\\GRI 3- Material Topics 2021 - Traditional Chinese.pdf' },
  { reportSection: '病人安全與醫療品質', hospitalQuestion: '如何管理病安風險、事件學習與改善結果？', gri: 'GRI 3 / GRI 416', disclosure: '3-3、416-1、416-2', evidence: '病安指標、事件分析、改善追蹤與教育紀錄', sourcePath: 'C:\\1ESG\\台灣醫院永續報告書\\2024 KMUH ESG.pdf' },
  { reportSection: '能源與氣候行動', hospitalQuestion: '能源、排放與減碳目標如何量化和追蹤？', gri: 'GRI 302 / GRI 305', disclosure: '302-1、302-4、305-1、305-5', evidence: '能源帳單、溫室氣體盤查、減量專案成果', sourcePath: 'C:\\1ESG\\GRI\\GRI 302- Energy 2016 - Traditional Chinese.pdf' },
  { reportSection: '醫療廢棄物與循環', hospitalQuestion: '廢棄物來源、分類、處理與減量是否可追溯？', gri: 'GRI 306', disclosure: '306-1、306-2、306-3', evidence: '廢棄物重量、清運聯單、減量與再利用紀錄', sourcePath: 'C:\\1ESG\\GRI\\GRI 306- Waste 2020 - Traditional Chinese.pdf' },
  { reportSection: '供應鏈環境評估', hospitalQuestion: '新供應商如何篩選，發現負面衝擊後如何改善？', gri: 'GRI 308', disclosure: '308-1、308-2', evidence: '供應商問卷、評選表、缺失改善與複查紀錄', sourcePath: 'C:\\1ESG\\GRI\\GRI 308-1(範例說明).xlsx' },
  { reportSection: '員工職業健康安全', hospitalQuestion: '員工與承攬商的職安風險如何辨識、預防與改善？', gri: 'GRI 403', disclosure: '403-1、403-2、403-9', evidence: '職安制度、危害辨識、事故率與改善措施', sourcePath: 'C:\\1ESG\\GRI\\GRI 403- Occupational Health and Safety 2018 - Traditional Chinese.pdf' },
]

export function lessonForDate(date = new Date()) {
  const utcDay = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000)
  return esgLessons[((utcDay % esgLessons.length) + esgLessons.length) % esgLessons.length]
}

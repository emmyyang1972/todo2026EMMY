import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { PDFParse } from 'pdf-parse'
import WordExtractor from 'word-extractor'

const sourceDir = process.argv[2] ?? 'C:\\Users\\vince\\OneDrive\\桌面\\0914法規'
const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!supabaseUrl || !serviceRoleKey) throw new Error('請設定 SUPABASE_URL 與 SUPABASE_SERVICE_ROLE_KEY；service-role key 僅供本機匯入使用。')
const supabase = createClient(supabaseUrl, serviceRoleKey)
const bucket = 'regulatory-documents'

async function extractText(filePath) {
  const extension = path.extname(filePath).toLowerCase()
  if (extension === '.pdf') {
    const parser = new PDFParse({ data: await readFile(filePath) })
    try { return (await parser.getText()).text.trim() } finally { await parser.destroy() }
  }
  if (extension === '.doc') return (await new WordExtractor().extract(filePath)).getBody().trim()
  throw new Error(`不支援的檔案格式：${extension}`)
}

function splitChunks(text, size = 4000) {
  const result = []
  for (let offset = 0; offset < text.length; offset += size) result.push(text.slice(offset, offset + size))
  return result.length ? result : ['']
}

for (const entry of await readdir(sourceDir, { withFileTypes: true })) {
  if (!entry.isFile() || !['.pdf', '.doc'].includes(path.extname(entry.name).toLowerCase())) continue
  const filePath = path.join(sourceDir, entry.name)
  const content = await extractText(filePath)
  if (!content) console.warn(`警告：${entry.name} 沒有擷取到文字，可能需要 OCR。`)
  const storagePath = `source/${entry.name}`
  const fileBuffer = await readFile(filePath)
  const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, fileBuffer, { contentType: entry.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'application/msword', upsert: true })
  if (uploadError) throw uploadError
  const { data: document, error: documentError } = await supabase.from('regulatory_documents').upsert({ title: path.basename(entry.name, path.extname(entry.name)), file_name: entry.name, file_type: path.extname(entry.name).slice(1).toUpperCase(), storage_path: storagePath, content, summary: content.slice(0, 500) }, { onConflict: 'file_name' }).select('id').single()
  if (documentError) throw documentError
  const { error: deleteError } = await supabase.from('regulatory_document_chunks').delete().eq('document_id', document.id)
  if (deleteError) throw deleteError
  const { error: chunkError } = await supabase.from('regulatory_document_chunks').insert(splitChunks(content).map((chunk, index) => ({ document_id: document.id, chunk_index: index, content: chunk })))
  if (chunkError) throw chunkError
  console.log(`已匯入：${entry.name}（${content.length} 字元）`)
}

import DOMPurify from 'dompurify'
import { marked } from 'marked'

let markedConfigured = false

function ensureMarkedConfigured() {
  if (markedConfigured) return
  marked.setOptions({
    gfm: true,
    breaks: true,
  })
  markedConfigured = true
}

/**
 * Render deskripsi dataset CKAN (`notes`) sebagai HTML aman.
 * CKAN menyimpan `notes` sebagai Markdown; newline tunggal diperlakukan sebagai line break (opsi `breaks`).
 */
export function renderCkanNotesMarkdown(notes) {
  if (!notes || typeof notes !== 'string') return ''
  ensureMarkedConfigured()
  const html = marked.parse(notes)
  return DOMPurify.sanitize(html)
}

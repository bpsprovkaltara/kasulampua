import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { formatDate } from './dates'

let markedConfigured = false

function ensureMarkedConfigured() {
  if (markedConfigured) return
  marked.setOptions({
    gfm: true,
    breaks: true,
  })
  markedConfigured = true
}

export function renderCkanNotesMarkdown(notes) {
  if (!notes || typeof notes !== 'string') return ''
  ensureMarkedConfigured()

  let lines = notes.split(/\r?\n/)
  const metadataLabels = ['Subject', 'Subjek', 'Unit', 'Sumber', 'Definisi', 'Tahun', 'Lisensi', 'Terakhir di-harvest', 'Terakhir harvest']
  
  const processedLines = lines.map(line => {
    const trimmedLine = line.trim()
    
    const plainForMatch = trimmedLine.replace(/<[^>]*>/g, '').replace(/[*_~]+/g, '').trim()
    
    for (const label of metadataLabels) {
      const labelPrefixRegex = new RegExp(`^${label}\\s*:`, 'i')
      
      if (labelPrefixRegex.test(plainForMatch)) {
        const colonIndex = plainForMatch.indexOf(':')
        let value = ''
        if (colonIndex !== -1) {
          value = plainForMatch.substring(colonIndex + 1).trim()
        }

        const finalLabel = label.toLowerCase().includes('harvest') ? 'Terakhir di-harvest' : label
        
        if (finalLabel === 'Terakhir di-harvest' && value && value !== '-') {
          value = formatDate(value)
        }
        
        return `**${finalLabel}:** ${value || '-'}`
      }
    }
    return line
  })

  let processedNotes = processedLines.join('\n')
  const html = marked.parse(processedNotes)
  return DOMPurify.sanitize(html)
}

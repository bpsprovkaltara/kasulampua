

export const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  
  let cleanDate = dateStr.trim().replace(/\s+UTC$/i, '').replace(' ', 'T')
  if (cleanDate.length === 16) cleanDate += ':00'

  const date = new Date(cleanDate)
  if (isNaN(date.getTime())) return '-'

  const tanggal = date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const waktu = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  return `${tanggal} ${waktu}`
}

export const formatLongDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

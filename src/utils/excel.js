import * as XLSX from 'xlsx'


function splitword(text) {
  return text.split(/[\s,]+/).slice(0, 5).join(' ')
}

export const downloadExcel = (data, index, yearRange) => {
  const item = data[index]
  const arrayTahun = yearRange.split('-').map(Number)
  const tahunValid = arrayTahun
    .map(y => item.tahun.find(t => t.label == y))
    .filter(Boolean)
  const turvarval = item.turvar?.[0]?.val ?? ''

  const turtahunLength = item.turtahun.length
  const turtahunval = item.turtahun[0]?.val
  const turvarLength = item.turvar.length

  let sheetData = []
  const varval = item.var?.[0]?.val ?? ''
  const header = [item.labelvervar]

  // Buat header sesuai jenis tabel
  if (turtahunval == 0 && turvarLength === 1) {
    // ✅ Jenis 1: turtahun0_turvar0
    tahunValid.forEach(t => header.push(t.label))
    sheetData.push(header)

    item.vervar.forEach(vervar => {
      const row = [splitword(vervar.label)]
      tahunValid.forEach(tahun => {
        const key = `${vervar.val}${varval}${item.turvar[0].val}${tahun.val}${turtahunval}`
        row.push(item.datacontent[key] ?? '')
      })
      sheetData.push(row)
    })

  } else if (turtahunval !== 0 && turtahunLength > 1 && turvarLength === 1) {

    const header2 = [''];
      tahunValid.forEach(() => {
        item.turtahun.forEach(tt => {
          header2.push(tt.label);
        });
      });
      sheetData.push(header2);

    item.vervar.forEach(vervar => {
      const row = [splitword(vervar.label)]
      tahunValid.forEach(tahun => {
        item.turtahun.forEach(turtahun => {
          const key = `${String(vervar.val)}${String(varval)}${String(turvarval)}${String(tahun.val)}${String(turtahun.val)}`
          console.log(key)

          row.push(item.datacontent[key] ?? '')
        })
      })
      sheetData.push(row)
    })

  } else if (turtahunval == 0 && turvarLength > 1 && turvarval) {
    // ✅ Jenis 3: turtahun0_turvar1
    const selectedTurvar = item.turvar.find(t => t.val == turvarval)
    header[0] += ` (${selectedTurvar.label})`
    tahunValid.forEach(t => header.push(t.label))
    sheetData.push(header)

    item.vervar.forEach(vervar => {
      const row = [splitword(vervar.label)]
      tahunValid.forEach(tahun => {
        const key = `${vervar.val}${varval}${turvarval}${tahun.val}${turtahunval}`
        row.push(item.datacontent[key] ?? '')
      })
      sheetData.push(row)
    })
  }

  // Simpan ke file
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

  const namaFile =
    turtahunval == 0 && turvarLength === 1
      ? 'turtahun0_turvar0.xlsx'
      : turtahunval !== 0 && turtahunLength > 1 && turvarLength === 1
      ? 'turtahun1_turvar0.xlsx'
      : 'turtahun0_turvar1.xlsx'

  XLSX.writeFile(workbook, namaFile)
}

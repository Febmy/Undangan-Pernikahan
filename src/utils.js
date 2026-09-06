export function toGCalFormat(iso) {
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  )
}

export function gcalLink(ev) {
  const url = new URL('https://calendar.google.com/calendar/render')
  url.searchParams.set('action', 'TEMPLATE')
  url.searchParams.set('text', ev.label)
  url.searchParams.set('dates', `${toGCalFormat(ev.mulaiISO)}/${toGCalFormat(ev.selesaiISO)}`)
  url.searchParams.set('location', ev.alamat)
  url.searchParams.set('details', ev.tempat)
  return url.toString()
}

// Konversi ISO ("2026-12-21T08:00:00+07:00") -> value untuk <input type="datetime-local">
export function isoToLocalInput(iso) {
  if (!iso) return ''
  return iso.slice(0, 16)
}

// Konversi value <input type="datetime-local"> -> ISO dengan asumsi zona WIB (+07:00)
export function localInputToIso(value) {
  if (!value) return ''
  return `${value}:00+07:00`
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/**
 * Membaca nama tamu dari URL secara cerdas.
 * Mendukung spasi, tanda '+', tanda '&' mentah, maupun '%26',
 * sehingga nama seperti "Febmy & Partner" tidak terpotong.
 */
export function getGuestNameFromUrl(search = typeof window !== 'undefined' ? window.location.search : '') {
  if (!search) return ''

  // Tangkap seluruh nilai setelah ?to=, ?nama=, atau ?name= sampai batas anchor (#) atau param berikutnya (&key=)
  const match = search.match(/[?&](?:to|nama|name)=((?:(?!&[a-zA-Z_0-9]+=)[^#])*)/i)
  if (match && match[1]) {
    try {
      const decoded = decodeURIComponent(match[1].replace(/\+/g, ' '))
      return decoded.trim()
    } catch {
      return match[1].replace(/\+/g, ' ').trim()
    }
  }

  const params = new URLSearchParams(search)
  return params.get('to') || params.get('nama') || params.get('name') || ''
}


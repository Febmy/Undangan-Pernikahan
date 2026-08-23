import { useState } from 'react'
import useReveal from '../hooks/useReveal'
import { Ornament } from './Cover'
import { copyText } from '../utils'

export default function Closing({ config }) {
  const [ref, visible] = useReveal()
  const [copied, setCopied] = useState(false)
  const { pria, wanita } = config.mempelai

  async function handleCopyLink() {
    const ok = await copyText(window.location.href)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  const waHref = config.whatsapp
    ? `https://wa.me/${config.whatsapp}`
    : `https://wa.me/?text=${encodeURIComponent('Undangan Pernikahan: ' + window.location.href)}`

  return (
    <section ref={ref} className={`panel closing reveal${visible ? ' is-visible' : ''}`}>
      <Ornament center />
      <p className="eyebrow">Terima Kasih</p>
      <p className="closing__msg">{config.pesanPenutup}</p>
      <p className="closing__names">
        {wanita.namaPanggilan} &amp; {pria.namaPanggilan}
      </p>
      <div className="closing__share">
        <button className="btn" onClick={handleCopyLink}>
          {copied ? 'Tersalin ✓' : 'Salin Tautan'}
        </button>
        <a className="btn" href={waHref} target="_blank" rel="noopener noreferrer">
          Bagikan ke WhatsApp
        </a>
      </div>
    </section>
  )
}

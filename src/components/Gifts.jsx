import { useState } from 'react'
import useReveal from '../hooks/useReveal'
import { copyText } from '../utils'

export default function Gifts({ config }) {
  const [ref, visible] = useReveal()
  const [copiedIdx, setCopiedIdx] = useState(null)

  async function handleCopy(nomor, idx) {
    const ok = await copyText(nomor)
    if (ok) {
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 1800)
    }
  }

  return (
    <section ref={ref} className={`panel gift reveal${visible ? ' is-visible' : ''}`}>
      <div className="panel__head">
        <p className="eyebrow">Tanda Kasih</p>
        <h2>Kirim Hadiah</h2>
      </div>
      <p className="gift__note">
        Doa restu Anda adalah hadiah terindah. Namun jika ingin memberi tanda kasih, kami sediakan
        dalam bentuk cashless.
      </p>
      {config.hadiah.map((g, i) => (
        <div className="gift-card" key={i}>
          <div className="gift-card__info">
            <p className="gift-card__bank">{g.bank}</p>
            <p className="gift-card__num">{g.nomor}</p>
            <p className="gift-card__holder">a.n. {g.atasNama}</p>
          </div>
          <button className="btn" onClick={() => handleCopy(g.nomor, i)}>
            {copiedIdx === i ? 'Tersalin ✓' : 'Salin'}
          </button>
        </div>
      ))}
    </section>
  )
}

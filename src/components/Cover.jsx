import { useState } from 'react'

export function Ornament({ flip, center }) {
  const cls = ['ornament', flip && 'ornament--flip', center && 'ornament--center']
    .filter(Boolean)
    .join(' ')
  return (
    <svg className={cls} viewBox="0 0 100 100" fill="none">
      <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
        <path d="M50 96 C 47 74, 53 50, 50 6" />
        <path d="M50 74 C 39 68, 29 58, 26 46" />
        <path d="M50 74 C 61 68, 71 58, 74 46" />
        <path d="M50 48 C 41 42, 33 33, 32 22" />
        <path d="M50 48 C 59 42, 67 33, 68 22" />
        <path d="M50 22 C 46 16, 44 11, 45 4" />
        <path d="M50 22 C 54 16, 56 11, 55 4" />
        <circle cx="26" cy="46" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="74" cy="46" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="32" cy="22" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="68" cy="22" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="50" cy="5" r="1.6" fill="currentColor" stroke="none" />
      </g>
    </svg>
  )
}

export default function Cover({ config, guestName, musicSrc, onStartMusic, onOpen }) {
  const [closing, setClosing] = useState(false)
  const { pria, wanita } = config.mempelai

  function handleOpen() {
    setClosing(true)
    if (musicSrc) onStartMusic()
    setTimeout(onOpen, 850)
  }

  return (
    <section className={`cover${closing ? ' cover--bloom' : ''}`}>
      <Ornament />
      <p className="eyebrow">{config.eyebrow}</p>
      <div className="cover__seal">
        {(wanita.namaPanggilan[0] || 'A') + (pria.namaPanggilan[0] || 'B')}
      </div>
      <h1 className="cover__names">
        {wanita.namaPanggilan} <span>&amp;</span> {pria.namaPanggilan}
      </h1>
      <p className="cover__date">{config.tanggalCover}</p>
      <div className="cover__guest">
        <p>Kepada Yth. Bapak/Ibu/Saudara/i</p>
        <p className="cover__guest-name">{guestName || config.guestFallback}</p>
      </div>
      <button className="btn btn--open" onClick={handleOpen}>
        Buka Undangan
      </button>
      <Ornament flip />
    </section>
  )
}

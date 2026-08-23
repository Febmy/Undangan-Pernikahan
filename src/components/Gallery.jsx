import { useState } from 'react'
import useReveal from '../hooks/useReveal'

export default function Gallery({ config }) {
  const [ref, visible] = useReveal()
  const [selected, setSelected] = useState(null)
  const photos = config.galeri || []

  return (
    <section ref={ref} className={`panel gallery reveal${visible ? ' is-visible' : ''}`}>
      <div className="panel__head">
        <p className="eyebrow">Galeri</p>
        <h2>Momen Kami</h2>
      </div>
      <div className="gallery__grid">
        {photos.length > 0
          ? photos.map((src, i) => (
              <div className="gallery__tile" key={i} onClick={() => setSelected(src)}>
                <img src={src} alt="Galeri" loading="lazy" />
              </div>
            ))
          : Array.from({ length: 6 }).map((_, i) => (
              <div className="gallery__tile" key={i}>
                <span className="gallery__placeholder">Tambahkan URL foto di src/config.js</span>
              </div>
            ))}
      </div>
      {selected && (
        <div className="lightbox" onClick={() => setSelected(null)}>
          <button className="lightbox__close" onClick={() => setSelected(null)}>
            Tutup
          </button>
          <img src={selected} alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  )
}

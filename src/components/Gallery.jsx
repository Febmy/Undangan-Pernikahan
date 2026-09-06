import { useState } from 'react'
import useReveal from '../hooks/useReveal'
import OptimizedImage from './OptimizedImage'

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
                <OptimizedImage
                  src={src}
                  alt={`Momen Foto ${i + 1}`}
                  targetWidth={360}
                  quality={80}
                  aspectRatio="1/1"
                  fallbackType="gallery"
                />
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
          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <OptimizedImage
              src={selected}
              alt="Pratinjau Foto"
              targetWidth={1200}
              quality={85}
              loading="eager"
              fetchPriority="high"
              fallbackType="gallery"
            />
          </div>
        </div>
      )}
    </section>
  )
}

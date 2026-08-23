import useReveal from '../hooks/useReveal'
import { gcalLink } from '../utils'

export default function Events({ config }) {
  const [ref, visible] = useReveal()

  return (
    <section ref={ref} className={`panel events reveal${visible ? ' is-visible' : ''}`}>
      <div className="panel__head">
        <p className="eyebrow">Waktu &amp; Tempat</p>
        <h2>Rangkaian Acara</h2>
      </div>
      {config.acara.map((ev) => (
        <div className="event-card" key={ev.label}>
          <p className="event-card__label">{ev.label}</p>
          <p className="event-card__date">{ev.tanggal}</p>
          <p className="event-card__time">{ev.jam}</p>
          <p className="event-card__venue">{ev.tempat}</p>
          <p className="event-card__addr">{ev.alamat}</p>
          <div className="event-card__actions">
            <a className="btn" href={ev.mapsUrl} target="_blank" rel="noopener noreferrer">
              Lihat Lokasi
            </a>
            <a className="btn" href={gcalLink(ev)} target="_blank" rel="noopener noreferrer">
              Simpan ke Kalender
            </a>
          </div>
        </div>
      ))}
    </section>
  )
}

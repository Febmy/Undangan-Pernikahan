import useReveal from '../hooks/useReveal'

export default function Story({ config }) {
  const [ref, visible] = useReveal()

  if (!config.kisah || config.kisah.length === 0) return null

  return (
    <section ref={ref} className={`panel story reveal${visible ? ' is-visible' : ''}`}>
      <div className="panel__head">
        <p className="eyebrow">Kisah Kami</p>
        <h2>Perjalanan Cinta</h2>
      </div>
      <div className="story__list">
        {config.kisah.map((k, i) => (
          <div className="story__item" key={i}>
            <p className="story__date">{k.tahun}</p>
            <p className="story__title">{k.judul}</p>
            <p className="story__desc">{k.cerita}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

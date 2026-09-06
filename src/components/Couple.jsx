import useReveal from '../hooks/useReveal'
import OptimizedImage from './OptimizedImage'

function Person({ p }) {
  const initial = p.namaPanggilan ? p.namaPanggilan[0] : '•'

  return (
    <div className="person">
      <div className="person__photo">
        {p.foto ? (
          <OptimizedImage
            src={p.foto}
            alt={`Foto ${p.namaPanggilan}`}
            targetWidth={260}
            quality={85}
            aspectRatio="1/1"
            fallbackType="initial"
            fallbackInitial={initial}
          />
        ) : (
          <span className="person__initial">{initial}</span>
        )}
      </div>
      <h3 className="person__name">{p.namaLengkap}</h3>
      <p className="person__parents">{p.orangTua}</p>
      {p.instagram && <p className="person__ig">{p.instagram}</p>}
    </div>
  )
}

export default function Couple({ config }) {
  const [ref, visible] = useReveal()
  const { pria, wanita } = config.mempelai

  return (
    <section ref={ref} className={`panel couple reveal${visible ? ' is-visible' : ''}`}>
      <div className="panel__head">
        <p className="eyebrow">Mempelai</p>
        <h2>Yang Berbahagia</h2>
      </div>
      <Person p={pria} />
      <div className="couple__amp">&amp;</div>
      <Person p={wanita} />
    </section>
  )
}

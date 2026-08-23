import useReveal from '../hooks/useReveal'

function Person({ p }) {
  return (
    <div className="person">
      <div className="person__photo">
        {p.foto ? (
          <img src={p.foto} alt={`Foto ${p.namaPanggilan}`} />
        ) : (
          <span className="person__initial">{p.namaPanggilan[0] || '•'}</span>
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

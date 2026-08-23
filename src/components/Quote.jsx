import useReveal from '../hooks/useReveal'

export default function Quote({ config }) {
  const [ref, visible] = useReveal()
  const { arabic, makna, referensi } = config.quote

  return (
    <section ref={ref} className={`panel quote reveal${visible ? ' is-visible' : ''}`}>
      {arabic && arabic.trim() && <p className="quote__arabic">{arabic}</p>}
      <p className="quote__meaning">&ldquo;{makna}&rdquo;</p>
      <p className="quote__ref">{referensi}</p>
    </section>
  )
}

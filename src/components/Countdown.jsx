import useReveal from '../hooks/useReveal'
import useCountdown from '../hooks/useCountdown'

function Box({ num, label }) {
  return (
    <div className="countdown__box">
      <div className="countdown__num">{String(num).padStart(2, '0')}</div>
      <div className="countdown__label">{label}</div>
    </div>
  )
}

export default function Countdown({ config }) {
  const [ref, visible] = useReveal()
  const t = useCountdown(config.countdownTarget)

  return (
    <section ref={ref} className={`panel countdown reveal${visible ? ' is-visible' : ''}`}>
      <p className="eyebrow">Menanti Hari Bahagia</p>
      <p className="countdown__note">Hitung mundur menuju hari yang dinanti</p>
      {t.invalid ? null : t.done ? (
        <p className="countdown__done">Hari bahagia telah tiba 🎉</p>
      ) : (
        <div className="countdown__grid">
          <Box num={t.days} label="Hari" />
          <Box num={t.hours} label="Jam" />
          <Box num={t.mins} label="Menit" />
          <Box num={t.secs} label="Detik" />
        </div>
      )}
    </section>
  )
}

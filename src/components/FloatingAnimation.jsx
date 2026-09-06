import { useMemo } from 'react'

export default function FloatingAnimation({ active = true }) {
  // Buat 16 partikel dengan posisi, delay, dan durasi acak terprediksi
  const particles = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => {
      const isSparkle = i % 4 === 0
      const left = (i * 6.25 + (i % 3) * 3) % 96 + 2 // 2% - 98%
      const size = isSparkle ? 4 + (i % 3) * 2 : 12 + (i % 4) * 4 // px
      const duration = 9 + (i % 5) * 2.5 // 9s - 19s
      const delay = (i * 0.7) % 7 // 0s - 7s
      const swayDuration = 3 + (i % 3) // 3s - 5s
      return {
        id: i,
        isSparkle,
        left: `${left}%`,
        size,
        duration: `${duration}s`,
        delay: `${delay}s`,
        swayDuration: `${swayDuration}s`,
      }
    })
  }, [])

  if (!active) return null

  return (
    <div className="floating-canvas" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`floating-item ${p.isSparkle ? 'floating-item--sparkle' : 'floating-item--petal'}`}
          style={{
            left: p.left,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        >
          {p.isSparkle ? (
            <span
              className="sparkle-dot"
              style={{
                width: p.size,
                height: p.size,
                animationDuration: p.swayDuration,
              }}
            />
          ) : (
            <svg
              className="petal-svg"
              viewBox="0 0 30 30"
              style={{
                width: p.size,
                height: p.size,
                animationDuration: p.swayDuration,
              }}
            >
              <path
                d="M15 2 C8 8 2 16 7 24 C12 30 22 28 26 21 C30 14 24 6 15 2 Z"
                fill="currentColor"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}

import { useMemo } from 'react'

export default function FloatingAnimation({ active = true }) {
  // Gunakan 10 partikel elegan agar animasi sangat ringan di HP dan baterai awet
  const particles = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => {
      const isSparkle = i % 3 === 0
      const left = (i * 10 + (i % 3) * 4) % 94 + 3 // 3% - 97%
      const size = isSparkle ? 4 + (i % 3) * 2 : 11 + (i % 3) * 3 // px
      const duration = 11 + (i % 4) * 2.5 // 11s - 21s
      const delay = (i * 0.9) % 6 // 0s - 6s
      const swayDuration = 3.5 + (i % 3) * 0.8 // 3.5s - 5.1s
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

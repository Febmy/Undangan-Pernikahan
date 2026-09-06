import { useState } from 'react'
import { getOptimizedImageUrl } from '../imageUtils'

/**
 * Komponen gambar anti-lag dan anti-rusak.
 * - Otomatis mengubah URL Supabase ke CDN thumbnail yang ringan
 * - Menampilkan skeleton shimmer saat memuat (bebas layout shift)
 * - Transisi fade-in halus saat gambar selesai diunduh
 * - Fallback elegan jika gambar gagal memuat (tidak menampilkan ikon patah/rusak)
 */
export default function OptimizedImage({
  src,
  alt = '',
  targetWidth = 400,
  quality = 80,
  className = '',
  wrapperClassName = '',
  aspectRatio,
  loading = 'lazy',
  fetchPriority,
  fallbackType = 'none', // 'initial' | 'gallery' | 'none'
  fallbackInitial = '•',
  onClick,
  style = {},
  imageStyle = {},
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const optimizedSrc = getOptimizedImageUrl(src, { width: targetWidth, quality })

  // Jika URL tidak ada atau gagal dimuat
  if (!src || error) {
    if (fallbackType === 'initial') {
      return (
        <span className="person__initial" aria-label={alt}>
          {fallbackInitial}
        </span>
      )
    }

    if (fallbackType === 'gallery') {
      return (
        <div className="gallery__placeholder-card">
          <svg className="gallery__placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Foto Kenangan</span>
        </div>
      )
    }

    return null
  }

  return (
    <div
      className={`img-container ${wrapperClassName}${!loaded ? ' is-loading' : ''}`}
      style={{
        aspectRatio: aspectRatio || undefined,
        ...style,
      }}
      onClick={onClick}
    >
      {!loaded && <div className="img-shimmer" aria-hidden="true" />}
      <img
        src={optimizedSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`img-fluid ${className}${loaded ? ' is-loaded' : ''}`}
        style={imageStyle}
      />
    </div>
  )
}

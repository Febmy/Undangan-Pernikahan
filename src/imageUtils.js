/**
 * Helper untuk optimasi gambar dan kompresi di sisi klien.
 */

/**
 * Mengubah URL gambar ke versi CDN teroptimasi (Supabase Storage / Unsplash).
 * Mengurangi ukuran gambar hingga 90%+ tanpa mengurangi ketajaman di layar.
 *
 * @param {string} url - URL asli gambar
 * @param {object} options - { width: number, quality: number, height?: number }
 * @returns {string} URL teroptimasi
 */
export function getOptimizedImageUrl(url, { width = 400, quality = 80, height } = {}) {
  if (!url || typeof url !== 'string') return ''

  // 1. Supabase Storage: Ubah /object/public/ ke /render/image/public/
  if (url.includes('/storage/v1/object/public/')) {
    const renderUrl = url.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    )
    const params = new URLSearchParams()
    if (width) params.set('width', Math.round(width))
    if (height) params.set('height', Math.round(height))
    if (quality) params.set('quality', quality)
    params.set('resize', 'contain')

    const separator = renderUrl.includes('?') ? '&' : '?'
    return `${renderUrl}${separator}${params.toString()}`
  }

  // 2. Unsplash: Sesuaikan parameter w & q
  if (url.includes('images.unsplash.com')) {
    try {
      const u = new URL(url)
      u.searchParams.set('w', Math.round(width).toString())
      u.searchParams.set('q', quality.toString())
      u.searchParams.set('auto', 'format')
      return u.toString()
    } catch {
      return url
    }
  }

  return url
}

/**
 * Mengompresi file gambar di browser sebelum diunggah ke Supabase Storage.
 * Mengubah foto kamera berukuran 5MB-15MB menjadi ~150KB-350KB JPEG tajam.
 *
 * @param {File} file - File foto dari input file
 * @param {object} options - { maxWidth: 1600, maxHeight: 1600, quality: 0.85 }
 * @returns {Promise<File>} File gambar yang sudah dikompresi
 */
export function compressImage(file, { maxWidth = 1600, maxHeight = 1600, quality = 0.85 } = {}) {
  return new Promise((resolve, reject) => {
    // Jika bukan file gambar atau format SVG/GIF, jangan kompres
    if (!file || !file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
      return resolve(file)
    }

    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        let { width, height } = img

        // Hitung rasio pengecilan dimensi
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          } else {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')

        // Gambar ke canvas dengan smoothing berkualitas tinggi
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        // Konversi ke Blob JPEG berkualitas tinggi
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file)
            }

            // Jika hasil kompresi ternyata lebih besar dari file asli, pakai file asli
            if (blob.size >= file.size) {
              return resolve(file)
            }

            // Ubah ekstensi file ke .jpg jika sebelumnya berbeda
            const originalName = file.name.replace(/\.[^/.]+$/, '')
            const compressedFile = new File([blob], `${originalName}.jpg`, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })

            resolve(compressedFile)
          },
          'image/jpeg',
          quality
        )
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import defaultConfig from '../config'

/**
 * Mengambil data undangan yang sudah diisi mempelai lewat form (/isi-data).
 * Jika belum ada data tersimpan, dipakai data contoh dari src/config.js
 * sebagai tampilan awal/preview.
 */
const CACHE_KEY = 'wedding_config_cache'

function getInitialConfig() {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const parsed = JSON.parse(cached)
      if (parsed && typeof parsed === 'object') {
        return { config: parsed, isCached: true }
      }
    }
  } catch {
    // Abaikan error localStorage (private browsing)
  }
  return { config: defaultConfig, isCached: false }
}

export default function useWeddingConfig() {
  const initial = getInitialConfig()
  const [config, setConfig] = useState(initial.config)
  const [loaded, setLoaded] = useState(initial.isCached)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const { data, error } = await supabase
          .from('wedding_config')
          .select('data')
          .eq('id', 1)
          .maybeSingle()

        if (active && !error && data && data.data) {
          setConfig(data.data)
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(data.data))
          } catch {
            // Abaikan kuota localStorage
          }
        }
      } catch {
        // Gagal memuat dari Supabase — tetap pakai data yang ada
      } finally {
        if (active) setLoaded(true)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return { config, loaded }
}

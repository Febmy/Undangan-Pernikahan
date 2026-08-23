import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import defaultConfig from '../config'

/**
 * Mengambil data undangan yang sudah diisi mempelai lewat form (/isi-data).
 * Jika belum ada data tersimpan, dipakai data contoh dari src/config.js
 * sebagai tampilan awal/preview.
 */
export default function useWeddingConfig() {
  const [config, setConfig] = useState(defaultConfig)
  const [loaded, setLoaded] = useState(false)

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
        }
      } catch {
        // Gagal memuat dari Supabase — tetap pakai data default
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

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { isoToLocalInput, localInputToIso } from '../utils'
import defaultConfig from '../config'
import { compressImage } from '../imageUtils'

const newAcara = () => ({
  label: '',
  tanggal: '',
  jam: '',
  tempat: '',
  alamat: '',
  mapsUrl: '',
  mulaiISO: '',
  selesaiISO: '',
})
const newKisah = () => ({ tahun: '', judul: '', cerita: '' })
const newHadiah = () => ({ bank: '', nomor: '', atasNama: '' })

export const MAX_HADIAH = 5

export const BANK_SUGGESTIONS = [
  'Bank BCA',
  'Bank Mandiri',
  'Bank BRI',
  'Bank BNI',
  'Bank Syariah Indonesia (BSI)',
  'Bank CIMB Niaga',
  'Bank Permata',
  'Bank Danamon',
  'Bank Tabungan Negara (BTN)',
  'Bank Jago',
  'SeaBank',
  'Bank Neo Commerce',
  'Jenius (BTPN)',
  'GoPay',
  'OVO',
  'DANA',
  'ShopeePay',
  'LinkAja',
]

function Field({ label, hint, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {hint && <p className="field__hint">{hint}</p>}
    </div>
  )
}

function PhotoUpload({ label, value, uploading, onFile }) {
  return (
    <Field label={label}>
      <div className="photo-upload">
        {value && <img src={value} alt="" className="photo-upload__preview" />}
        <label className="btn photo-upload__btn">
          {uploading ? 'Mengunggah…' : value ? 'Ganti Foto' : 'Unggah Foto'}
          <input
            type="file"
            accept="image/*"
            hidden
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files && e.target.files[0]
              if (file) onFile(file)
              e.target.value = ''
            }}
          />
        </label>
      </div>
    </Field>
  )
}

function MusicUpload({ value, uploading, onFile, onRemove, onUrlChange }) {
  return (
    <div className="music-upload">
      <div className="music-upload__actions">
        <label className="btn photo-upload__btn">
          {uploading ? 'Mengunggah Lagu…' : value ? 'Ganti File Lagu (.mp3)' : 'Unggah File Lagu (.mp3)'}
          <input
            type="file"
            accept="audio/*,.mp3,.m4a,.wav,.ogg"
            hidden
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files && e.target.files[0]
              if (file) onFile(file)
              e.target.value = ''
            }}
          />
        </label>
        {value && (
          <button
            type="button"
            className="music-upload__remove"
            onClick={onRemove}
            disabled={uploading}
          >
            Hapus Musik
          </button>
        )}
      </div>

      {value && (
        <div className="music-upload__preview">
          <p className="field__hint" style={{ marginBottom: 6 }}>Pratinjau lagu:</p>
          <audio controls src={value} preload="metadata" className="music-upload__player" />
        </div>
      )}

      <div className="music-upload__divider">
        <span>atau masukkan URL / file langsung</span>
      </div>

      <input
        type="text"
        placeholder="https://.../lagu.mp3 atau /lagu.mp3"
        value={value}
        onChange={(e) => onUrlChange(e.target.value)}
      />
    </div>
  )
}

const THEMES = [
  {
    id: 'emerald-gold',
    name: 'Imperial Emerald & Gold',
    category: 'Botanical Heritage',
    desc: 'Nuansa hijau zamrud bangsawan, kertas perkamen hangat, dan aksen emas klasik.',
    palette: ['#233a2c', '#f5f1e4', '#a9813e', '#32503e'],
    dark: false,
  },
  {
    id: 'midnight-gold',
    name: 'Royal Midnight & Gold',
    category: 'Dark Luxury / Gala',
    desc: 'Latar malam obsidian mewah dipadukan dengan emas berkilau dan nuansa gala dinner megah.',
    palette: ['#0d131f', '#d4af37', '#f1f5f9', '#1a263c'],
    dark: true,
  },
  {
    id: 'ivory-gold',
    name: 'Ivory Marble & Classic Gold',
    category: 'Timeless Elegance',
    desc: 'Putih gading bersih nan abadi, berkelas ala ballroom hotel bintang 5.',
    palette: ['#faf7f2', '#b3883b', '#1a1918', '#e2cca0'],
    dark: false,
  },
  {
    id: 'burgundy-rose',
    name: 'Velvet Burgundy & Rose Gold',
    category: 'Venetian Romance',
    desc: 'Nuansa anggur merah beludru yang kaya dan hangat, dipadukan dengan kilau rose gold romantis.',
    palette: ['#1c070d', '#d99b82', '#f9eff1', '#451723'],
    dark: true,
  },
  {
    id: 'cashmere-luxe',
    name: 'Cashmere & Old Money Greige',
    category: 'Modern Minimalist Luxe',
    desc: 'Estetika minimalis mahal bergaya desainer Paris, lembut dan menenangkan.',
    palette: ['#f3eee5', '#9c7f53', '#24201a', '#d1be9b'],
    dark: false,
  },
  {
    id: 'cinematic-romance',
    name: 'Cinematic Romance & Frosted Glass',
    category: 'Custom Background & Petals',
    desc: 'Foto background kustom dengan efek kaca beku (frosted glass) mewah dan animasi kelopak bunga/emas melayang.',
    palette: ['#ffffff', '#b5893e', '#f7a8b8', '#231f1b'],
    dark: false,
  },
]

function ThemePicker({ currentTheme, onSelect }) {
  return (
    <div className="theme-picker">
      <div className="theme-picker__grid">
        {THEMES.map((t) => {
          const isSelected = (currentTheme || 'emerald-gold') === t.id
          return (
            <div
              key={t.id}
              className={`theme-card${isSelected ? ' theme-card--active' : ''}`}
              onClick={() => onSelect(t.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(t.id)}
            >
              <div className="theme-card__header">
                <div>
                  <span className="theme-card__cat">{t.category}</span>
                  <div className="theme-card__name">{t.name}</div>
                </div>
                {isSelected ? (
                  <span className="theme-card__badge">✓ Terpilih</span>
                ) : t.dark ? (
                  <span className="theme-card__badge theme-card__badge--dark">Dark Mode</span>
                ) : null}
              </div>

              <div className="theme-card__swatches">
                {t.palette.map((color, idx) => (
                  <div
                    key={idx}
                    className="theme-card__swatch"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              <p className="theme-card__desc">{t.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function IntakeForm() {
  const [form, setForm] = useState(defaultConfig)
  const [initLoaded, setInitLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveState, setSaveState] = useState(null) // null | 'success' | 'error'
  const [uploadingFoto, setUploadingFoto] = useState({ pria: false, wanita: false })
  const [uploadingGaleri, setUploadingGaleri] = useState(false)
  const [uploadingMusik, setUploadingMusik] = useState(false)
  const [uploadingBg, setUploadingBg] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      const { data, error } = await supabase
        .from('wedding_config')
        .select('data')
        .eq('id', 1)
        .maybeSingle()
      if (active) {
        if (!error && data && data.data) {
          setForm({
            ...defaultConfig,
            ...data.data,
            hadiah: Array.isArray(data.data.hadiah) ? data.data.hadiah : (defaultConfig.hadiah || []),
          })
        }
        setInitLoaded(true)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }
  function updateMempelai(sisi, field, value) {
    setForm((f) => ({
      ...f,
      mempelai: { ...f.mempelai, [sisi]: { ...f.mempelai[sisi], [field]: value } },
    }))
  }
  function updateQuote(field, value) {
    setForm((f) => ({ ...f, quote: { ...f.quote, [field]: value } }))
  }
  function updateArrayItem(key, idx, field, value) {
    setForm((f) => {
      const arr = [...(f[key] || [])]
      arr[idx] = { ...arr[idx], [field]: value }
      return { ...f, [key]: arr }
    })
  }
  function addArrayItem(key, template) {
    setForm((f) => {
      const current = f[key] || []
      if (key === 'hadiah' && current.length >= MAX_HADIAH) return f
      return { ...f, [key]: [...current, template()] }
    })
  }
  function removeArrayItem(key, idx) {
    setForm((f) => ({ ...f, [key]: (f[key] || []).filter((_, i) => i !== idx) }))
  }

  async function uploadToStorage(file, prefix) {
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '-')
    const path = `${prefix}-${Date.now()}-${safeName}`
    const { error } = await supabase.storage.from('wedding-photos').upload(path, file)
    if (error) throw error
    const { data } = supabase.storage.from('wedding-photos').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleFotoUpload(sisi, file) {
    setUploadingFoto((u) => ({ ...u, [sisi]: true }))
    try {
      const compressed = await compressImage(file, { maxWidth: 1000, maxHeight: 1000, quality: 0.85 })
      const url = await uploadToStorage(compressed, `mempelai-${sisi}`)
      updateMempelai(sisi, 'foto', url)
    } catch {
      alert('Gagal mengunggah foto. Silakan coba lagi.')
    } finally {
      setUploadingFoto((u) => ({ ...u, [sisi]: false }))
    }
  }

  async function handleGaleriUpload(files) {
    setUploadingGaleri(true)
    try {
      const urls = []
      for (const file of files) {
        // eslint-disable-next-line no-await-in-loop
        const compressed = await compressImage(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.85 })
        // eslint-disable-next-line no-await-in-loop
        const url = await uploadToStorage(compressed, 'galeri')
        urls.push(url)
      }
      setForm((f) => ({ ...f, galeri: [...f.galeri, ...urls] }))
    } catch {
      alert('Sebagian foto gagal diunggah. Silakan coba lagi.')
    } finally {
      setUploadingGaleri(false)
    }
  }

  async function handleMusikUpload(file) {
    if (!file) return
    if (file.size > 25 * 1024 * 1024) {
      alert('Ukuran file musik terlalu besar (maksimal 25MB). Silakan gunakan file berukuran lebih kecil.')
      return
    }
    setUploadingMusik(true)
    try {
      const url = await uploadToStorage(file, 'musik')
      updateField('musikUrl', url)
    } catch (err) {
      console.error('Upload musik gagal:', err)
      alert('Gagal mengunggah file musik. Pastikan format file audio didukung dan coba lagi.')
    } finally {
      setUploadingMusik(false)
    }
  }

  async function handleBgUpload(file) {
    if (!file) return
    if (file.size > 25 * 1024 * 1024) {
      alert('Ukuran file foto terlalu besar (maksimal 25MB). Silakan gunakan file berukuran lebih kecil.')
      return
    }
    setUploadingBg(true)
    try {
      const compressed = await compressImage(file, { maxWidth: 1920, maxHeight: 1920, quality: 0.85 })
      const url = await uploadToStorage(compressed, 'background')
      updateField('customBackgroundUrl', url)
    } catch (err) {
      console.error('Upload background gagal:', err)
      alert('Gagal mengunggah foto background. Pastikan file gambar valid dan coba lagi.')
    } finally {
      setUploadingBg(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setSaveState(null)
    const { error } = await supabase
      .from('wedding_config')
      .upsert({ id: 1, data: form, updated_at: new Date().toISOString() })
    setSaving(false)
    if (!error) {
      try {
        localStorage.setItem('wedding_config_cache', JSON.stringify(form))
      } catch {
        // Abaikan kuota localStorage
      }
      setSaveState('success')
    } else {
      setSaveState('error')
    }
  }

  if (!initLoaded) {
    return (
      <div className="intake-page">
        <p className="loading-screen">Memuat form…</p>
      </div>
    )
  }

  const { pria, wanita } = form.mempelai

  return (
    <div className="intake-page">
      <div className="intake__intro">
        <p className="eyebrow">Form Data Undangan</p>
        <h1>Halo, Calon Pengantin! 👋</h1>
        <p>
          Isi data di bawah ini untuk melengkapi undangan digital kalian. Semua data akan
          langsung tampil di halaman undangan setelah disimpan. Kalian bisa membuka form ini
          lagi kapan saja untuk mengubah data yang sudah diisi.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <section className="intake__section" style={{ borderTop: 'none', paddingTop: 0 }}>
          <h2>Pilihan Tema &amp; Gaya Visual</h2>
          <p className="field__hint" style={{ marginTop: -12, marginBottom: 16 }}>
            Pilih nuansa visual dan kombinasi warna yang paling cocok untuk pernikahan kalian. Seluruh halaman undangan akan otomatis mengikuti tema ini.
          </p>
          <ThemePicker
            currentTheme={form.tema}
            onSelect={(themeId) => updateField('tema', themeId)}
          />

          <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px dashed var(--line)' }}>
            <h3 style={{ fontSize: 16, marginBottom: 10, color: 'var(--forest-deep)' }}>
              Pengaturan Background &amp; Animasi
            </h3>

            <Field
              label="Foto Background Kustom (Opsional)"
              hint="Direkomendasikan terutama untuk tema Cinematic Romance, atau foto prewedding kalian."
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <label className="btn photo-upload__btn">
                  {uploadingBg
                    ? 'Mengunggah Foto…'
                    : form.customBackgroundUrl
                    ? 'Ganti Foto Background'
                    : 'Unggah Foto Background'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={uploadingBg}
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0]
                      if (file) handleBgUpload(file)
                      e.target.value = ''
                    }}
                  />
                </label>
                {form.customBackgroundUrl && (
                  <button
                    type="button"
                    className="music-upload__remove"
                    onClick={() => updateField('customBackgroundUrl', '')}
                    disabled={uploadingBg}
                  >
                    Hapus (Kembali ke Default)
                  </button>
                )}
              </div>

              {form.customBackgroundUrl && (
                <img
                  src={form.customBackgroundUrl}
                  alt="Background Preview"
                  className="bg-upload__preview"
                />
              )}

              <div style={{ marginTop: 10 }}>
                <input
                  type="text"
                  placeholder="Atau masukkan URL foto background (https://...)"
                  value={form.customBackgroundUrl || ''}
                  onChange={(e) => updateField('customBackgroundUrl', e.target.value)}
                />
              </div>
            </Field>

            <div style={{ marginTop: 14 }}>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={form.animasiKelopak !== false}
                  onChange={(e) => updateField('animasiKelopak', e.target.checked)}
                />
                <span>Aktifkan animasi kelopak bunga &amp; partikel emas melayang di undangan ✨🌸</span>
              </label>
            </div>
          </div>
        </section>

        <section className="intake__section">
          <h2>Info Utama</h2>
          <Field label="Judul kecil di atas nama (eyebrow)">
            <input
              type="text"
              value={form.eyebrow}
              onChange={(e) => updateField('eyebrow', e.target.value)}
            />
          </Field>
          <Field label="Tanggal yang tampil di halaman pembuka" hint="Contoh: Sabtu, 21 Desember 2026">
            <input
              type="text"
              value={form.tanggalCover}
              onChange={(e) => updateField('tanggalCover', e.target.value)}
            />
          </Field>
          <Field label="Tanggal &amp; jam acara utama (untuk hitung mundur)" hint="Waktu Indonesia Barat (WIB)">
            <input
              type="datetime-local"
              value={isoToLocalInput(form.countdownTarget)}
              onChange={(e) => updateField('countdownTarget', localInputToIso(e.target.value))}
            />
          </Field>
          <Field label="Sapaan default jika link dibuka tanpa nama tamu">
            <input
              type="text"
              value={form.guestFallback}
              onChange={(e) => updateField('guestFallback', e.target.value)}
            />
          </Field>
        </section>

        <section className="intake__section">
          <h2>Mempelai Pria</h2>
          <Field label="Nama lengkap">
            <input
              type="text"
              value={pria.namaLengkap}
              onChange={(e) => updateMempelai('pria', 'namaLengkap', e.target.value)}
            />
          </Field>
          <Field label="Nama panggilan">
            <input
              type="text"
              value={pria.namaPanggilan}
              onChange={(e) => updateMempelai('pria', 'namaPanggilan', e.target.value)}
            />
          </Field>
          <Field label="Putra dari" hint='Contoh: "Putra dari Bapak ... & Ibu ..."'>
            <input
              type="text"
              value={pria.orangTua}
              onChange={(e) => updateMempelai('pria', 'orangTua', e.target.value)}
            />
          </Field>
          <Field label="Instagram (opsional)">
            <input
              type="text"
              placeholder="@namaakun"
              value={pria.instagram}
              onChange={(e) => updateMempelai('pria', 'instagram', e.target.value)}
            />
          </Field>
          <PhotoUpload
            label="Foto"
            value={pria.foto}
            uploading={uploadingFoto.pria}
            onFile={(file) => handleFotoUpload('pria', file)}
          />
        </section>

        <section className="intake__section">
          <h2>Mempelai Wanita</h2>
          <Field label="Nama lengkap">
            <input
              type="text"
              value={wanita.namaLengkap}
              onChange={(e) => updateMempelai('wanita', 'namaLengkap', e.target.value)}
            />
          </Field>
          <Field label="Nama panggilan">
            <input
              type="text"
              value={wanita.namaPanggilan}
              onChange={(e) => updateMempelai('wanita', 'namaPanggilan', e.target.value)}
            />
          </Field>
          <Field label="Putri dari" hint='Contoh: "Putri dari Bapak ... & Ibu ..."'>
            <input
              type="text"
              value={wanita.orangTua}
              onChange={(e) => updateMempelai('wanita', 'orangTua', e.target.value)}
            />
          </Field>
          <Field label="Instagram (opsional)">
            <input
              type="text"
              placeholder="@namaakun"
              value={wanita.instagram}
              onChange={(e) => updateMempelai('wanita', 'instagram', e.target.value)}
            />
          </Field>
          <PhotoUpload
            label="Foto"
            value={wanita.foto}
            uploading={uploadingFoto.wanita}
            onFile={(file) => handleFotoUpload('wanita', file)}
          />
        </section>

        <section className="intake__section">
          <h2>Kutipan Pembuka</h2>
          <Field label="Teks Arab (opsional)" hint="Kosongkan jika tidak ingin ditampilkan">
            <textarea
              value={form.quote.arabic}
              onChange={(e) => updateQuote('arabic', e.target.value)}
            />
          </Field>
          <Field label="Arti / makna">
            <textarea
              value={form.quote.makna}
              onChange={(e) => updateQuote('makna', e.target.value)}
            />
          </Field>
          <Field label="Sumber/referensi" hint="Contoh: QS. Ar-Rūm: 21">
            <input
              type="text"
              value={form.quote.referensi}
              onChange={(e) => updateQuote('referensi', e.target.value)}
            />
          </Field>
        </section>

        <section className="intake__section">
          <h2>Rangkaian Acara</h2>
          {form.acara.map((ev, idx) => (
            <div className="array-card" key={idx}>
              {form.acara.length > 1 && (
                <button
                  type="button"
                  className="array-card__remove"
                  onClick={() => removeArrayItem('acara', idx)}
                  aria-label="Hapus acara ini"
                >
                  ×
                </button>
              )}
              <Field label="Nama acara" hint="Contoh: Akad Nikah / Resepsi">
                <input
                  type="text"
                  value={ev.label}
                  onChange={(e) => updateArrayItem('acara', idx, 'label', e.target.value)}
                />
              </Field>
              <Field label="Tanggal (teks tampilan)">
                <input
                  type="text"
                  value={ev.tanggal}
                  onChange={(e) => updateArrayItem('acara', idx, 'tanggal', e.target.value)}
                />
              </Field>
              <Field label="Jam (teks tampilan)" hint="Contoh: 08.00 – 10.00 WIB">
                <input
                  type="text"
                  value={ev.jam}
                  onChange={(e) => updateArrayItem('acara', idx, 'jam', e.target.value)}
                />
              </Field>
              <Field label="Nama tempat">
                <input
                  type="text"
                  value={ev.tempat}
                  onChange={(e) => updateArrayItem('acara', idx, 'tempat', e.target.value)}
                />
              </Field>
              <Field label="Alamat lengkap">
                <textarea
                  value={ev.alamat}
                  onChange={(e) => updateArrayItem('acara', idx, 'alamat', e.target.value)}
                />
              </Field>
              <Field label="Link Google Maps" hint="Buka Google Maps, cari lokasi, salin link-nya">
                <input
                  type="url"
                  placeholder="https://maps.google.com/..."
                  value={ev.mapsUrl}
                  onChange={(e) => updateArrayItem('acara', idx, 'mapsUrl', e.target.value)}
                />
              </Field>
              <Field label="Mulai (untuk tombol Simpan ke Kalender)" hint="WIB">
                <input
                  type="datetime-local"
                  value={isoToLocalInput(ev.mulaiISO)}
                  onChange={(e) =>
                    updateArrayItem('acara', idx, 'mulaiISO', localInputToIso(e.target.value))
                  }
                />
              </Field>
              <Field label="Selesai (untuk tombol Simpan ke Kalender)" hint="WIB">
                <input
                  type="datetime-local"
                  value={isoToLocalInput(ev.selesaiISO)}
                  onChange={(e) =>
                    updateArrayItem('acara', idx, 'selesaiISO', localInputToIso(e.target.value))
                  }
                />
              </Field>
            </div>
          ))}
          <button type="button" className="array-add" onClick={() => addArrayItem('acara', newAcara)}>
            + Tambah Acara
          </button>
        </section>

        <section className="intake__section">
          <h2>Kisah Cinta</h2>
          {form.kisah.map((k, idx) => (
            <div className="array-card" key={idx}>
              <button
                type="button"
                className="array-card__remove"
                onClick={() => removeArrayItem('kisah', idx)}
                aria-label="Hapus kisah ini"
              >
                ×
              </button>
              <Field label="Tahun">
                <input
                  type="text"
                  value={k.tahun}
                  onChange={(e) => updateArrayItem('kisah', idx, 'tahun', e.target.value)}
                />
              </Field>
              <Field label="Judul singkat">
                <input
                  type="text"
                  value={k.judul}
                  onChange={(e) => updateArrayItem('kisah', idx, 'judul', e.target.value)}
                />
              </Field>
              <Field label="Cerita">
                <textarea
                  value={k.cerita}
                  onChange={(e) => updateArrayItem('kisah', idx, 'cerita', e.target.value)}
                />
              </Field>
            </div>
          ))}
          <button type="button" className="array-add" onClick={() => addArrayItem('kisah', newKisah)}>
            + Tambah Momen
          </button>
        </section>

        <section className="intake__section">
          <h2>Galeri Foto</h2>
          <div className="gallery-upload__grid">
            {form.galeri.map((src, idx) => (
              <div className="gallery-upload__tile" key={idx}>
                <img src={src} alt="" />
                <button
                  type="button"
                  className="gallery-upload__remove"
                  onClick={() => removeArrayItem('galeri', idx)}
                  aria-label="Hapus foto ini"
                >
                  ×
                </button>
              </div>
            ))}
            <label className="gallery-upload__add">
              {uploadingGaleri ? '…' : '+ Tambah'}
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                disabled={uploadingGaleri}
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  if (files.length) handleGaleriUpload(files)
                  e.target.value = ''
                }}
              />
            </label>
          </div>
          <p className="field__hint">Bisa pilih beberapa foto sekaligus.</p>
        </section>

        <section className="intake__section">
          <div className="section-head-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 style={{ margin: 0 }}>Kado Digital</h2>
            <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', background: 'var(--paper-deep)', border: '1px solid var(--line)', color: 'var(--ink)' }}>
              {(form.hadiah || []).length} / {MAX_HADIAH} Rekening
            </span>
          </div>
          <p className="field__hint" style={{ marginBottom: '16px' }}>
            Bisa ditambahkan hingga maksimal {MAX_HADIAH} rekening bank atau e-wallet untuk kado cashless.
          </p>

          <datalist id="bank-list-options">
            {BANK_SUGGESTIONS.map((bank) => (
              <option key={bank} value={bank} />
            ))}
          </datalist>

          {(form.hadiah || []).map((g, idx) => (
            <div className="array-card" key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                  Rekening #{idx + 1}
                </span>
                <button
                  type="button"
                  className="array-card__remove"
                  onClick={() => removeArrayItem('hadiah', idx)}
                  aria-label="Hapus rekening ini"
                  title="Hapus rekening"
                >
                  ×
                </button>
              </div>

              <Field label="Nama bank / e-wallet" hint="Pilih dari daftar saran atau ketik manual">
                <input
                  type="text"
                  list="bank-list-options"
                  placeholder="Contoh: Bank BCA, Bank Mandiri, GoPay..."
                  value={g.bank || ''}
                  onChange={(e) => updateArrayItem('hadiah', idx, 'bank', e.target.value)}
                />
              </Field>
              <Field label="Nomor rekening / nomor akun">
                <input
                  type="text"
                  placeholder="Contoh: 1234567890"
                  value={g.nomor || ''}
                  onChange={(e) => updateArrayItem('hadiah', idx, 'nomor', e.target.value)}
                />
              </Field>
              <Field label="Atas nama">
                <input
                  type="text"
                  placeholder="Contoh: Nama Pemilik Rekening"
                  value={g.atasNama || ''}
                  onChange={(e) => updateArrayItem('hadiah', idx, 'atasNama', e.target.value)}
                />
              </Field>
            </div>
          ))}

          {(form.hadiah || []).length === 0 && (
            <div style={{ textAlign: 'center', padding: '16px', border: '1px dashed var(--line)', borderRadius: '10px', marginBottom: '16px', color: 'var(--ink)', opacity: 0.8, fontSize: '13px' }}>
              Belum ada rekening kado digital. Klik tombol di bawah untuk menambahkan (maksimal {MAX_HADIAH}).
            </div>
          )}

          {(form.hadiah || []).length < MAX_HADIAH ? (
            <button
              type="button"
              className="array-add"
              onClick={() => addArrayItem('hadiah', newHadiah)}
            >
              + Tambah Rekening ({(form.hadiah || []).length}/{MAX_HADIAH})
            </button>
          ) : (
            <div style={{ textAlign: 'center', padding: '10px', borderRadius: '8px', background: 'rgba(169, 129, 62, 0.08)', border: '1px solid var(--line)', fontSize: '12px', color: 'var(--gold)' }}>
              ✓ Batas maksimal {MAX_HADIAH} rekening telah tercapai
            </div>
          )}
        </section>

        <section className="intake__section">
          <h2>Lainnya</h2>
          <Field label="Nomor WhatsApp untuk tombol Bagikan (opsional)" hint="Format: 62812xxxxxxx">
            <input
              type="text"
              value={form.whatsapp}
              onChange={(e) => updateField('whatsapp', e.target.value)}
            />
          </Field>
          <Field
            label="Musik latar / lagu (.mp3)"
            hint="Unggah file lagu dari perangkat Anda atau masukkan link audio langsung."
          >
            <MusicUpload
              value={form.musikUrl}
              uploading={uploadingMusik}
              onFile={handleMusikUpload}
              onRemove={() => updateField('musikUrl', '')}
              onUrlChange={(val) => updateField('musikUrl', val)}
            />
          </Field>
          <Field label="Pesan penutup">
            <textarea
              value={form.pesanPenutup}
              onChange={(e) => updateField('pesanPenutup', e.target.value)}
            />
          </Field>
        </section>

        <div className="intake__submit-bar">
          <button type="submit" className="btn rsvp__submit" disabled={saving}>
            {saving ? 'Menyimpan…' : 'Simpan Data Undangan'}
          </button>
          {saveState === 'success' && (
            <p className="intake__status intake__status--success">
              Tersimpan! Undangan sudah diperbarui — <Link to="/">lihat undangan →</Link>
            </p>
          )}
          {saveState === 'error' && (
            <p className="intake__status intake__status--error">
              Gagal menyimpan. Periksa koneksi internet dan coba lagi.
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

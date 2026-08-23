import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { isoToLocalInput, localInputToIso } from '../utils'
import defaultConfig from '../config'

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

export default function IntakeForm() {
  const [form, setForm] = useState(defaultConfig)
  const [initLoaded, setInitLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveState, setSaveState] = useState(null) // null | 'success' | 'error'
  const [uploadingFoto, setUploadingFoto] = useState({ pria: false, wanita: false })
  const [uploadingGaleri, setUploadingGaleri] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      const { data, error } = await supabase
        .from('wedding_config')
        .select('data')
        .eq('id', 1)
        .maybeSingle()
      if (active) {
        if (!error && data && data.data) setForm(data.data)
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
      const arr = [...f[key]]
      arr[idx] = { ...arr[idx], [field]: value }
      return { ...f, [key]: arr }
    })
  }
  function addArrayItem(key, template) {
    setForm((f) => ({ ...f, [key]: [...f[key], template()] }))
  }
  function removeArrayItem(key, idx) {
    setForm((f) => ({ ...f, [key]: f[key].filter((_, i) => i !== idx) }))
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
      const url = await uploadToStorage(file, `mempelai-${sisi}`)
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
        const url = await uploadToStorage(file, 'galeri')
        urls.push(url)
      }
      setForm((f) => ({ ...f, galeri: [...f.galeri, ...urls] }))
    } catch {
      alert('Sebagian foto gagal diunggah. Silakan coba lagi.')
    } finally {
      setUploadingGaleri(false)
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
    setSaveState(error ? 'error' : 'success')
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
          <h2>Kado Digital</h2>
          {form.hadiah.map((g, idx) => (
            <div className="array-card" key={idx}>
              {form.hadiah.length > 1 && (
                <button
                  type="button"
                  className="array-card__remove"
                  onClick={() => removeArrayItem('hadiah', idx)}
                  aria-label="Hapus rekening ini"
                >
                  ×
                </button>
              )}
              <Field label="Nama bank / e-wallet">
                <input
                  type="text"
                  value={g.bank}
                  onChange={(e) => updateArrayItem('hadiah', idx, 'bank', e.target.value)}
                />
              </Field>
              <Field label="Nomor rekening / nomor akun">
                <input
                  type="text"
                  value={g.nomor}
                  onChange={(e) => updateArrayItem('hadiah', idx, 'nomor', e.target.value)}
                />
              </Field>
              <Field label="Atas nama">
                <input
                  type="text"
                  value={g.atasNama}
                  onChange={(e) => updateArrayItem('hadiah', idx, 'atasNama', e.target.value)}
                />
              </Field>
            </div>
          ))}
          <button type="button" className="array-add" onClick={() => addArrayItem('hadiah', newHadiah)}>
            + Tambah Rekening
          </button>
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
          <Field label="Link musik latar / mp3 (opsional)">
            <input
              type="url"
              placeholder="https://..."
              value={form.musikUrl}
              onChange={(e) => updateField('musikUrl', e.target.value)}
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

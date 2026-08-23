import { useCallback, useEffect, useState } from 'react'
import useReveal from '../hooks/useReveal'
import { supabase } from '../supabaseClient'

const emptyForm = { name: '', status: 'Hadir', guests: 1, message: '' }

export default function Rsvp() {
  const [ref, visible] = useReveal()
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const loadItems = useCallback(async () => {
    setStatus('loading')
    const { data, error } = await supabase
      .from('rsvp')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setStatus('error')
      return
    }
    setItems(data || [])
    setStatus('ready')
  }, [])

  useEffect(() => {
    loadItems()

    // Dengarkan ucapan baru dari tamu lain secara real-time
    const channel = supabase
      .channel('rsvp-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'rsvp' },
        (payload) => {
          setItems((prev) => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadItems])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) return

    setSubmitting(true)
    const { error } = await supabase.from('rsvp').insert([
      {
        name: form.name.trim(),
        status: form.status,
        guests: Number(form.guests) || 1,
        message: form.message.trim(),
      },
    ])
    setSubmitting(false)

    if (error) {
      alert('Gagal mengirim ucapan. Silakan coba lagi.')
      return
    }
    setForm(emptyForm)
  }

  const hadir = items
    .filter((i) => i.status === 'Hadir')
    .reduce((sum, i) => sum + (i.guests || 1), 0)
  const tidak = items.filter((i) => i.status === 'Tidak Hadir').length

  return (
    <section ref={ref} className={`panel rsvp reveal${visible ? ' is-visible' : ''}`}>
      <div className="panel__head">
        <p className="eyebrow">Konfirmasi Kehadiran</p>
        <h2>Ucapan &amp; Doa Restu</h2>
      </div>

      <p className="rsvp__tally">
        {status === 'loading' ? 'Memuat data kehadiran…' : `${hadir} akan hadir · ${tidak} tidak hadir`}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="rsvpName">Nama</label>
          <input
            id="rsvpName"
            type="text"
            required
            maxLength={60}
            placeholder="Nama Anda"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="rsvpStatus">Konfirmasi Kehadiran</label>
          <select
            id="rsvpStatus"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="Hadir">Hadir</option>
            <option value="Tidak Hadir">Tidak Hadir</option>
            <option value="Masih Ragu">Masih Ragu</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="rsvpGuests">Jumlah Tamu</label>
          <input
            id="rsvpGuests"
            type="number"
            min={1}
            max={10}
            value={form.guests}
            onChange={(e) => setForm((f) => ({ ...f, guests: e.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="rsvpMsg">Ucapan &amp; Doa</label>
          <textarea
            id="rsvpMsg"
            required
            maxLength={280}
            placeholder="Tuliskan ucapan dan doa terbaik Anda"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          />
        </div>
        <button type="submit" className="btn rsvp__submit" disabled={submitting}>
          {submitting ? 'Mengirim…' : 'Kirim Ucapan'}
        </button>
      </form>

      <div className="rsvp__list">
        {status === 'loading' && <p className="rsvp__loading">Memuat ucapan…</p>}
        {status === 'error' && (
          <p className="rsvp__empty">
            Belum bisa memuat ucapan. Periksa konfigurasi Supabase (VITE_SUPABASE_URL /
            VITE_SUPABASE_ANON_KEY) di file .env.
          </p>
        )}
        {status === 'ready' && items.length === 0 && (
          <p className="rsvp__empty">Jadilah yang pertama memberi ucapan &amp; doa restu.</p>
        )}
        {status === 'ready' &&
          items.map((i) => (
            <div className="rsvp__item" key={i.id}>
              <div className="rsvp__item-top">
                <span>{i.name}</span>
                <span className="rsvp__item-status">{i.status}</span>
              </div>
              <p className="rsvp__item-msg">{i.message}</p>
            </div>
          ))}
      </div>
      <p className="rsvp__privacy">
        Ucapan yang dikirim akan terlihat oleh tamu lain yang membuka undangan ini.
      </p>
    </section>
  )
}

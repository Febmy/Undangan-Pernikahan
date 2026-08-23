import { useMemo, useRef, useState } from 'react'
import Cover from '../components/Cover'
import Quote from '../components/Quote'
import Couple from '../components/Couple'
import Events from '../components/Events'
import Countdown from '../components/Countdown'
import Story from '../components/Story'
import Gallery from '../components/Gallery'
import Gifts from '../components/Gifts'
import Rsvp from '../components/Rsvp'
import Closing from '../components/Closing'
import MusicToggle from '../components/MusicToggle'
import useWeddingConfig from '../hooks/useWeddingConfig'

export default function Invitation() {
  const { config, loaded } = useWeddingConfig()
  const [opened, setOpened] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  // Nama tamu dibaca dari URL, contoh: https://domain-anda.com/?to=Budi%20%26%20Keluarga
  const guestName = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('to') || params.get('nama') || params.get('name') || ''
  }, [])

  function startMusic() {
    if (!config.musikUrl || !audioRef.current) return
    audioRef.current.play().catch(() => {})
    setPlaying(true)
  }

  function toggleMusic() {
    if (!audioRef.current) return
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {})
      setPlaying(true)
    } else {
      audioRef.current.pause()
      setPlaying(false)
    }
  }

  if (!loaded) {
    return (
      <div className="stage">
        <div className="invite">
          <div className="loading-screen">Memuat undangan…</div>
        </div>
      </div>
    )
  }

  return (
    <div className="stage">
      <div className="invite">
        {!opened && (
          <Cover
            config={config}
            guestName={guestName}
            musicSrc={config.musikUrl}
            onStartMusic={startMusic}
            onOpen={() => setOpened(true)}
          />
        )}

        {opened && (
          <div className="content">
            <Quote config={config} />
            <Couple config={config} />
            <Events config={config} />
            <Countdown config={config} />
            <Story config={config} />
            <Gallery config={config} />
            <Gifts config={config} />
            <Rsvp />
            <Closing config={config} />
            <footer className="footer">Dibuat dengan ♥ — Undangan Digital</footer>
          </div>
        )}

        <MusicToggle hidden={!config.musikUrl || !opened} playing={playing} onToggle={toggleMusic} />
        {config.musikUrl && <audio ref={audioRef} src={config.musikUrl} loop />}
      </div>
    </div>
  )
}

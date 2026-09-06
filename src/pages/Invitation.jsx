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
import FloatingAnimation from '../components/FloatingAnimation'
import useWeddingConfig from '../hooks/useWeddingConfig'

import { getOptimizedImageUrl } from '../imageUtils'
import { getGuestNameFromUrl } from '../utils'

export default function Invitation() {
  const { config, loaded } = useWeddingConfig()
  const [opened, setOpened] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  // Nama tamu dibaca dari URL cerdas (mendukung 'Febmy & Partner', spasi, maupun %26)
  const guestName = useMemo(() => {
    return getGuestNameFromUrl()
  }, [])

  function startMusic() {
    if (!config.musikUrl || !audioRef.current) return
    audioRef.current
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }

  function toggleMusic() {
    if (!audioRef.current) return
    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    } else {
      audioRef.current.pause()
      setPlaying(false)
    }
  }

  if (!loaded) {
    return (
      <div className="stage" data-theme={config.tema || 'emerald-gold'}>
        <div className="invite">
          <div className="splash-screen">
            <div className="splash-seal">
              <span className="splash-seal__spin" />
              <span className="splash-seal__text">✦</span>
            </div>
            <p className="eyebrow" style={{ marginTop: 20 }}>Undangan Pernikahan</p>
            <p className="splash-note">Mempersiapkan lembar undangan…</p>
          </div>
        </div>
      </div>
    )
  }

  const optimizedBg = config.customBackgroundUrl
    ? getOptimizedImageUrl(config.customBackgroundUrl, { width: 1080, quality: 80 })
    : ''

  const stageStyle = optimizedBg
    ? { '--bg-custom-url': `url("${optimizedBg}")` }
    : undefined

  return (
    <div className="stage" data-theme={config.tema || 'emerald-gold'} style={stageStyle}>
      <FloatingAnimation active={config.animasiKelopak !== false} />
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
        {config.musikUrl && (
          <audio
            ref={audioRef}
            src={config.musikUrl}
            preload="none"
            loop
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        )}
      </div>
    </div>
  )
}

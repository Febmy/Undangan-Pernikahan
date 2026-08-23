export default function MusicToggle({ hidden, playing, onToggle }) {
  return (
    <button className="music-toggle" hidden={hidden} aria-label="Putar/hentikan musik" onClick={onToggle}>
      {playing ? '❚❚' : '♪'}
    </button>
  )
}

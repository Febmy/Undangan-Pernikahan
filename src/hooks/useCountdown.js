import { useEffect, useState } from 'react'

function calc(targetISO) {
  const target = new Date(targetISO).getTime()
  if (Number.isNaN(target)) return { invalid: true }
  const diff = target - Date.now()
  if (diff <= 0) return { done: true, days: 0, hours: 0, mins: 0, secs: 0 }
  return {
    done: false,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  }
}

export default function useCountdown(targetISO) {
  const [timeLeft, setTimeLeft] = useState(() => calc(targetISO))

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calc(targetISO)), 1000)
    return () => clearInterval(id)
  }, [targetISO])

  return timeLeft
}

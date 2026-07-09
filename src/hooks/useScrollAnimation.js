import { useEffect, useRef, useState } from 'react'

export default function useScrollAnimation() {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Fallback: if element is already in/near viewport on mount, show immediately
    const rect = node.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.05, rootMargin: '200px 0px 200px 0px' }
    )

    observer.observe(node)

    // Hard fallback: force visible after 1.5s no matter what (prevents permanent blank sections)
    const fallbackTimer = setTimeout(() => setIsVisible(true), 1500)

    return () => {
      observer.disconnect()
      clearTimeout(fallbackTimer)
    }
  }, [])

  return { ref, isVisible }
}

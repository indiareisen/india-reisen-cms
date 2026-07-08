import { useState, useEffect } from 'react'

export default function useWishlist() {
  const [wishlisted, setWishlisted] = useState({})

  // Load wishlist from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('journeyWishlist')
    if (stored) {
      try {
        setWishlisted(JSON.parse(stored))
      } catch (e) {
        console.error('Error loading wishlist:', e)
      }
    }
  }, [])

  // Save wishlist to localStorage
  const toggleWishlist = (id, journey) => {
    setWishlisted(prev => {
      const updated = { ...prev }
      if (updated[id]) {
        delete updated[id]
        console.log('❤️ Removed from wishlist:', id)
      } else {
        updated[id] = journey
        console.log('❤️ Added to wishlist:', id)
      }
      localStorage.setItem('journeyWishlist', JSON.stringify(updated))
      return updated
    })
  }

  const isWishlisted = (id) => !!wishlisted[id]

  const getWishlistCount = () => Object.keys(wishlisted).length

  const getWishlistJourneys = () => Object.values(wishlisted)

  return {
    wishlisted,
    toggleWishlist,
    isWishlisted,
    getWishlistCount,
    getWishlistJourneys
  }
}

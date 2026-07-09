import { useState, useEffect } from 'react'

export default function useWishlist() {
  const [wishlisted, setWishlisted] = useState({})
  const [loading, setLoading] = useState(true)

  // Load wishlist from localStorage on mount and whenever storage changes
  useEffect(() => {
    loadWishlist()
    
    // Listen for storage changes (from other tabs)
    window.addEventListener('storage', loadWishlist)
    return () => window.removeEventListener('storage', loadWishlist)
  }, [])

  const loadWishlist = () => {
    try {
      const stored = localStorage.getItem('journeyWishlist')
      if (stored) {
        const parsed = JSON.parse(stored)
        console.log('📋 Loaded wishlist:', Object.keys(parsed).length, 'items')
        setWishlisted(parsed)
      } else {
        console.log('📋 No wishlist found')
        setWishlisted({})
      }
    } catch (e) {
      console.error('❌ Error loading wishlist:', e)
      setWishlisted({})
    } finally {
      setLoading(false)
    }
  }

  const toggleWishlist = (id, journey) => {
    setWishlisted(prev => {
      const updated = { ...prev }
      if (updated[id]) {
        delete updated[id]
        console.log('❤️ Removed from wishlist:', id)
      } else {
        updated[id] = journey
        console.log('❤️ Added to wishlist:', id, journey.title)
      }
      localStorage.setItem('journeyWishlist', JSON.stringify(updated))
      console.log('💾 Wishlist saved to localStorage')
      return updated
    })
  }

  const isWishlisted = (id) => {
    return !!wishlisted[id]
  }

  const getWishlistCount = () => {
    return Object.keys(wishlisted).length
  }

  const getWishlistJourneys = () => {
    return Object.values(wishlisted)
  }

  return {
    wishlisted,
    toggleWishlist,
    isWishlisted,
    getWishlistCount,
    getWishlistJourneys,
    loading
  }
}

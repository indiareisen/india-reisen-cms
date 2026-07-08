import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function SocialMediaCreator() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const snap = await getDocs(collection(db, 'socialPosts'))
      const postsList = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setPosts(postsList)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>📱 Social Media Creator</h1>
      <p>Create and manage social media content for all platforms.</p>
      
      <div style={{ marginTop: '30px', padding: '20px', background: '#f0f0f0', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ color: '#666' }}>Social media management features coming soon!</p>
        <p style={{ color: '#999', fontSize: '14px' }}>
          Total posts: {posts.length}
        </p>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function BlogPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setBlogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '10px', color: '#d1356f' }}>Travel Blog</h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>Stories, tips, and insights from our journeys across India</p>

      {loading ? (
        <div>Loading blog posts...</div>
      ) : blogs.length === 0 ? (
        <div>No blog posts yet.</div>
      ) : (
        <div style={{ display: 'grid', gap: '30px' }}>
          {blogs.map(blog => (
            <article key={blog.id} style={{
              borderBottom: '2px solid #eee',
              paddingBottom: '30px'
            }}>
              <h2 style={{ margin: '0 0 10px 0', color: '#d1356f', fontSize: '24px' }}>{blog.title}</h2>
              <div style={{ display: 'flex', gap: '20px', margin: '10px 0 15px 0', fontSize: '13px', color: '#999' }}>
                <span>By {blog.author}</span>
                <span>{blog.category}</span>
              </div>
              <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '16px', lineHeight: '1.6' }}>{blog.excerpt}</p>
              <button style={{
                padding: '8px 20px',
                background: '#d1356f',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                Read Full Article
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

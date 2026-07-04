import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function BlogManager() {
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
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading blogs...</div>

  return (
    <div>
      <h1>Blog Management</h1>
      <p>Create, edit, and publish blog posts</p>
      
      <div style={{ marginTop: '20px', padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h2>Published Blogs ({blogs.length})</h2>
        {blogs.length === 0 ? (
          <p>No blogs yet. Start writing!</p>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {blogs.map(blog => (
              <div key={blog.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px' }}>
                <h3>{blog.title}</h3>
                <p>{blog.excerpt}</p>
                <p><strong>Author:</strong> {blog.author}</p>
                <p><strong>Category:</strong> {blog.category}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

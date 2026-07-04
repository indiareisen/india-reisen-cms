import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function BlogManager() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Travel Tips'
  })

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

  const handleAddBlog = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'blogs'), {
        ...formData,
        createdAt: Timestamp.now()
      })
      setFormData({ title: '', excerpt: '', content: '', author: '', category: 'Travel Tips' })
      setShowForm(false)
      fetchBlogs()
    } catch (error) {
      console.error('Error adding blog:', error)
    }
  }

  const handleDeleteBlog = async (id) => {
    if (window.confirm('Delete this blog post?')) {
      try {
        await deleteDoc(doc(db, 'blogs', id))
        fetchBlogs()
      } catch (error) {
        console.error('Error deleting blog:', error)
      }
    }
  }

  if (loading) return <div>Loading blogs...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Blog Management</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '10px 20px', background: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {showForm ? '✕ Cancel' : '+ Write Blog'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddBlog} style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            <input type="text" placeholder="Author" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <option>Travel Tips</option>
              <option>Culture</option>
              <option>Planning</option>
              <option>Guides</option>
            </select>
          </div>
          <textarea placeholder="Excerpt" value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', marginBottom: '15px', minHeight: '60px', boxSizing: 'border-box' }} />
          <textarea placeholder="Full Content" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', marginBottom: '15px', minHeight: '200px', boxSizing: 'border-box' }} />
          <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Publish Blog
          </button>
        </form>
      )}

      <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h2>Published Blogs ({blogs.length})</h2>
        {blogs.length === 0 ? (
          <p>No blogs yet. Start writing!</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {blogs.map(blog => (
              <div key={blog.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px', background: '#f9f9f9' }}>
                <h3>{blog.title}</h3>
                <p style={{ margin: '5px 0' }}><strong>Author:</strong> {blog.author} | <strong>Category:</strong> {blog.category}</p>
                <p>{blog.excerpt}</p>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>Content preview: {blog.content.substring(0, 100)}...</p>
                <button 
                  onClick={() => handleDeleteBlog(blog.id)}
                  style={{ marginTop: '10px', padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

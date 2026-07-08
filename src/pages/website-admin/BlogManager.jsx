import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function BlogManager() {
  const [posts, setPosts] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    category: 'Travel',
    author: '',
    content: '',
    featuredImage: ''
  })
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const snap = await getDocs(collection(db, 'posts'))
      const postsList = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setPosts(postsList)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, featuredImage: event.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await updateDoc(doc(db, 'posts', editing), {
          ...formData,
          updatedAt: new Date()
        })
        setEditing(null)
      } else {
        await addDoc(collection(db, 'posts'), {
          ...formData,
          createdAt: new Date()
        })
      }
      setFormData({ title: '', category: 'Travel', author: '', content: '', featuredImage: '' })
      fetchPosts()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this post?')) {
      try {
        await deleteDoc(doc(db, 'posts', id))
        fetchPosts()
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  return (
    <div>
      <h1>📝 Blog Manager</h1>

      {/* Form */}
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2>{editing ? 'Edit Post' : 'Create New Post'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Post title"
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option>Travel</option>
              <option>Culture</option>
              <option>Adventure</option>
              <option>Food</option>
              <option>Tips</option>
              <option>Stories</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Author name"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Featured Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            />
            {formData.featuredImage && (
              <img src={formData.featuredImage} alt="Preview" style={{ marginTop: '10px', maxWidth: '200px', borderRadius: '4px' }} />
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Write your blog post..."
              required
              rows={8}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'monospace', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 20px',
              background: '#d1356f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {editing ? 'Update Post' : 'Create Post'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null)
                setFormData({ title: '', category: 'Travel', author: '', content: '', featuredImage: '' })
              }}
              style={{
                marginLeft: '10px',
                padding: '10px 20px',
                background: '#999',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Posts List */}
      <h2>All Posts ({posts.length})</h2>
      {loading ? (
        <div>Loading...</div>
      ) : posts.length === 0 ? (
        <p>No blog posts yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {posts.map(post => (
            <div key={post.id} style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', display: 'flex', gap: '15px', alignItems: 'start' }}>
              {post.featuredImage && (
                <img src={post.featuredImage} alt={post.title} style={{ width: '100px', height: '100px', borderRadius: '4px', objectFit: 'cover' }} />
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0' }}>{post.title}</h3>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>
                  {post.category} • {post.author}
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: '#999' }}>
                  {post.content?.substring(0, 100)}...
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    setEditing(post.id)
                    setFormData(post)
                  }}
                  style={{
                    padding: '8px 15px',
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  style={{
                    padding: '8px 15px',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

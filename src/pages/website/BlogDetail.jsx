import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function BlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const postDoc = await getDoc(doc(db, 'posts', id))
      if (postDoc.exists()) {
        setPost({ id: postDoc.id, ...postDoc.data() })
      }

      const settingsDoc = await getDoc(doc(db, 'settings', 'general'))
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data())
      }

      const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(3))
      const postsSnap = await getDocs(postsQuery)
      const postsList = postsSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(p => p.id !== id)
        .slice(0, 3)
      setRelatedPosts(postsList)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
  if (!post) return <div style={{ padding: '40px', textAlign: 'center' }}>Post not found</div>

  const primaryColor = settings?.primaryColor || '#d1356f'
  const secondaryColor = settings?.secondaryColor || '#D4A574'

  return (
    <div>
      {/* Back Button */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => navigate('/blog')}
          style={{
            background: primaryColor,
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ← Back to Blog
        </button>
      </div>

      {/* Header */}
      <section style={{
        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.2)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {post.category || 'Uncategorized'}
            </span>
          </div>
          <h1 style={{ fontSize: '42px', margin: '0 0 20px 0' }}>{post.title}</h1>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            <span>✍️ {post.author || 'India Reisen'}</span>
            <span style={{ marginLeft: '20px' }}>📅 {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px' }}>
        {/* Featured Image */}
        {post.featuredImage && (
          <img
            src={post.featuredImage}
            alt={post.title}
            style={{
              width: '100%',
              height: '400px',
              borderRadius: '12px',
              marginBottom: '40px',
              objectFit: 'cover'
            }}
          />
        )}

        {/* Article Content */}
        <article style={{
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#333',
          marginBottom: '60px'
        }}>
          {post.content && (
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {post.content}
            </div>
          )}
        </article>

        {/* Share Section */}
        <div style={{
          padding: '30px',
          background: '#f9f9f9',
          borderRadius: '8px',
          marginBottom: '60px'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: primaryColor }}>Share This Post</h3>
          <div style={{ display: 'flex', gap: '15px' }}>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              background: primaryColor,
              color: 'white',
              borderRadius: '50%',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              f
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}`} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              background: primaryColor,
              color: 'white',
              borderRadius: '50%',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              𝕏
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              background: primaryColor,
              color: 'white',
              borderRadius: '50%',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              in
            </a>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 style={{ color: primaryColor, marginBottom: '30px' }}>Related Posts</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {relatedPosts.map(relPost => (
                <div
                  key={relPost.id}
                  onClick={() => navigate(`/blog/${relPost.id}`)}
                  style={{
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)'
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{
                    background: relPost.featuredImage ? `url('${relPost.featuredImage}')` : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '150px',
                    borderRadius: '8px 8px 0 0'
                  }}></div>
                  <div style={{ padding: '15px', background: '#f9f9f9' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: primaryColor }}>
                      {relPost.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                      {relPost.createdAt ? new Date(relPost.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

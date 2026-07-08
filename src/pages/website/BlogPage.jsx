import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseService'
import { useNavigate } from 'react-router-dom'
import useScrollAnimation from '../../hooks/useScrollAnimation'

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [categories, setCategories] = useState(['All'])
  const postsPerPage = 6
  const navigate = useNavigate()
  const headerSection = useScrollAnimation()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'general'))
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data())
      }

      const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
      const postsSnap = await getDocs(postsQuery)
      const postsList = postsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      setPosts(postsList)

      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(postsList.map(p => p.category).filter(Boolean))]
      setCategories(uniqueCategories)
      setFilteredPosts(postsList)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter posts by category
  useEffect(() => {
    let filtered = posts
    if (selectedCategory !== 'All') {
      filtered = posts.filter(p => p.category === selectedCategory)
    }
    setFilteredPosts(filtered)
    setCurrentPage(1)
  }, [selectedCategory, posts])

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const startIdx = (currentPage - 1) * postsPerPage
  const paginatedPosts = filteredPosts.slice(startIdx, startIdx + postsPerPage)

  const primaryColor = settings?.primaryColor || '#d1356f'
  const secondaryColor = settings?.secondaryColor || '#D4A574'

  return (
    <div>
      {/* Header */}
      <section 
        ref={headerSection.ref}
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          color: 'white',
          padding: '60px 20px',
          textAlign: 'center',
          opacity: headerSection.isVisible ? 1 : 0,
          transform: headerSection.isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s ease'
        }}
      >
        <h1 style={{ fontSize: '42px', margin: '0 0 20px 0' }}>📝 Travel Blog</h1>
        <p style={{ fontSize: '16px', margin: 0 }}>Stories, tips, and guides from our travelers</p>
      </section>

      {/* Content */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        {/* Category Filter */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ color: primaryColor, marginBottom: '20px' }}>Filter by Category</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '10px 20px',
                  background: selectedCategory === cat ? primaryColor : '#f0f0f0',
                  color: selectedCategory === cat ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  if (selectedCategory !== cat) {
                    e.target.style.background = '#e0e0e0'
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedCategory !== cat) {
                    e.target.style.background = '#f0f0f0'
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Count */}
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
        </p>

        {/* Blog Posts Grid */}
        {loading ? (
          <div>Loading posts...</div>
        ) : paginatedPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '8px' }}>
            <p style={{ color: '#666' }}>No blog posts found in this category.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '30px', marginBottom: '50px' }}>
              {paginatedPosts.map((post, idx) => (
                <div
                  key={post.id}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    animation: `fadeInUp 0.8s ease ${idx * 0.1}s backwards`
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  {/* Feature Image */}
                  <div style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px'
                  }}>
                    Blog Image
                  </div>

                  {/* Content */}
                  <div style={{ padding: '25px' }}>
                    {/* Category Badge */}
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{
                        display: 'inline-block',
                        background: primaryColor,
                        color: 'white',
                        padding: '5px 12px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {post.category || 'Uncategorized'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{ margin: '0 0 10px 0', color: primaryColor, fontSize: '20px' }}>
                      {post.title}
                    </h3>

                    {/* Author & Date */}
                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '15px' }}>
                      <span>✍️ {post.author || 'India Reisen'}</span>
                      <span style={{ marginLeft: '15px' }}>📅 {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleDateString() : 'N/A'}</span>
                    </div>

                    {/* Excerpt */}
                    <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                      {post.content?.substring(0, 150)}...
                    </p>

                    {/* Read More Button */}
                    <button
                      onClick={() => navigate(`/blog/${post.id}`)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: primaryColor,
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Read More →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center', marginTop: '40px' }}>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '10px 15px',
                    background: currentPage === 1 ? '#ccc' : primaryColor,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  ← Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      width: '40px',
                      height: '40px',
                      background: currentPage === page ? primaryColor : '#f0f0f0',
                      color: currentPage === page ? 'white' : '#333',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '10px 15px',
                    background: currentPage === totalPages ? '#ccc' : primaryColor,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

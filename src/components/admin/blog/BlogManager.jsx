import React, { useState, useEffect } from 'react';

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', author: '', image: '', category: '' });

  useEffect(() => {
    const saved = localStorage.getItem('blogs');
    if (saved) setBlogs(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    const updated = [...blogs, { ...formData, id: Date.now(), date: new Date().toISOString().split('T')[0] }];
    localStorage.setItem('blogs', JSON.stringify(updated));
    setBlogs(updated);
    setFormData({ title: '', content: '', author: '', image: '', category: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    const updated = blogs.filter(b => b.id !== id);
    localStorage.setItem('blogs', JSON.stringify(updated));
    setBlogs(updated);
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#d1356f', marginBottom: '24px' }}>📝 Blog Manager</h1>
      
      <button onClick={() => setShowForm(true)} style={{ padding: '12px 24px', backgroundColor: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '24px' }}>+ Write Post</button>

      {showForm && (
        <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #e0e0e0' }}>
          <h3>Create Blog Post</h3>
          <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
          <input type="text" placeholder="Author" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
          <input type="text" placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
          <textarea placeholder="Content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} style={{ width: '100%', marginBottom: '12px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', minHeight: '120px' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSave} style={{ flex: 1, padding: '10px', backgroundColor: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Publish</button>
            <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
        {blogs.map(post => (
          <div key={post.id} style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#d1356f' }}>{post.title}</h3>
            <p style={{ margin: '4px 0', color: '#666', fontSize: '12px' }}>By {post.author} • {post.date} • {post.category}</p>
            <p style={{ margin: '8px 0', fontSize: '14px', lineHeight: '1.5' }}>{post.content.substring(0, 100)}...</p>
            <button onClick={() => handleDelete(post.id)} style={{ padding: '6px 12px', backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', width: '100%' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogManager;

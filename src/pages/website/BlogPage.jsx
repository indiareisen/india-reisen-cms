import { useState, useEffect } from 'react';
import { getBlogs } from '../../services/firebaseService';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const data = await getBlogs();
      setBlogs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading blogs:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading blogs...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Travel Blog</h1>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No blog posts yet</p>
          </div>
        ) : (
          <div className="space-y-8">
            {blogs.map((blog) => (
              <article key={blog.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                {blog.image && (
                  <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover" />
                )}
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{blog.title}</h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {blog.author} • {new Date(blog.createdAt?.toDate?.()).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 mb-4">{blog.content?.substring(0, 200)}...</p>
                  <button
                    style={{ color: '#d1356f' }}
                    className="font-semibold hover:opacity-80 transition"
                  >
                    Read More →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;

import { useState, useEffect } from 'react';
import { getMedia, addMedia, deleteMedia } from '../../services/firebaseService';

const MediaGallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ url: '', title: '', category: 'journey' });

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const data = await getMedia();
      setMedia(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMedia(formData);
      loadMedia();
      setFormData({ url: '', title: '', category: 'journey' });
    } catch (error) {
      alert('Error uploading media');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this image?')) {
      try {
        await deleteMedia(id);
        loadMedia();
      } catch (error) {
        alert('Error deleting media');
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">🖼️ Photo Gallery</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Add Photo</h2>
        <input
          type="url"
          placeholder="Image URL (from Cloudinary, etc.)"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          required
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
        />
        <input
          type="text"
          placeholder="Image Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
        />
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
        >
          <option>journey</option>
          <option>testimonial</option>
          <option>team</option>
          <option>destination</option>
        </select>
        <button type="submit" className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700">
          Upload Photo
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {media.map(item => (
          <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
            <img src={item.url} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full mb-4">{item.category}</span>
              <button
                onClick={() => handleDelete(item.id)}
                className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaGallery;

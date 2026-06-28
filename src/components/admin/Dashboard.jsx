import { useState, useEffect } from 'react';
import SampleDataButton from './SampleDataButton';

const Dashboard = ({ setActiveTab }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const navigationCards = [
    {
      id: 'itineraries',
      icon: '🗺️',
      title: 'Journeys',
      description: 'Manage travel itineraries and packages',
      color: 'from-blue-500 to-blue-600',
      accent: 'bg-blue-100'
    },
    {
      id: 'blogs',
      icon: '📝',
      title: 'Blog Posts',
      description: 'Create and edit blog content',
      color: 'from-purple-500 to-purple-600',
      accent: 'bg-purple-100'
    },
    {
      id: 'media',
      icon: '🖼️',
      title: 'Media Gallery',
      description: 'Upload and manage images',
      color: 'from-pink-500 to-pink-600',
      accent: 'bg-pink-100'
    },
    {
      id: 'team',
      icon: '👥',
      title: 'Team Members',
      description: 'Manage team profiles',
      color: 'from-green-500 to-green-600',
      accent: 'bg-green-100'
    },
    {
      id: 'reviews',
      icon: '⭐',
      title: 'Reviews',
      description: 'Manage customer reviews',
      color: 'from-yellow-500 to-yellow-600',
      accent: 'bg-yellow-100'
    },
    {
      id: 'clients',
      icon: '👤',
      title: 'Manage Clients',
      description: 'Client database and contacts',
      color: 'from-indigo-500 to-indigo-600',
      accent: 'bg-indigo-100'
    },
    {
      id: 'invoices',
      icon: '📄',
      title: 'Create Invoices',
      description: 'Generate and manage invoices',
      color: 'from-orange-500 to-orange-600',
      accent: 'bg-orange-100'
    },
    {
      id: 'social',
      icon: '📱',
      title: 'Social Content',
      description: 'Create social media posts',
      color: 'from-cyan-500 to-cyan-600',
      accent: 'bg-cyan-100'
    },
    {
      id: 'website',
      icon: '🌐',
      title: 'Website Control',
      description: 'Manage hero, banners & content',
      color: 'from-red-500 to-red-600',
      accent: 'bg-red-100'
    },
    {
      id: 'admin',
      icon: '🔐',
      title: 'Settings',
      description: 'Global settings & branding',
      color: 'from-slate-500 to-slate-600',
      accent: 'bg-slate-100'
    }
  ];

  const websitePages = [
    {
      id: 'website-home',
      icon: '🏠',
      title: 'Website Home',
      description: 'Preview homepage',
      color: 'from-teal-500 to-teal-600',
      accent: 'bg-teal-100'
    },
    {
      id: 'website-journeys',
      icon: '📍',
      title: 'Website Journeys',
      description: 'Preview journeys page',
      color: 'from-emerald-500 to-emerald-600',
      accent: 'bg-emerald-100'
    },
    {
      id: 'website-blog',
      icon: '📰',
      title: 'Website Blog',
      description: 'Preview blog page',
      color: 'from-lime-500 to-lime-600',
      accent: 'bg-lime-100'
    },
    {
      id: 'website-contact',
      icon: '✉️',
      title: 'Website Contact',
      description: 'Preview contact page',
      color: 'from-rose-500 to-rose-600',
      accent: 'bg-rose-100'
    }
  ];

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">India Reisen CMS</h1>
          <p className="text-lg text-gray-600">Manage your travel content and business operations</p>
        </div>

        {/* Sample Data Button */}
        <div className="mb-12">
          <SampleDataButton />
        </div>

        {/* Admin Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">📊 Admin Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {navigationCards.map((card) => (
              <button
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className={`bg-gradient-to-br ${card.color} p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-white text-left group cursor-pointer`}
              >
                <div className={`${card.accent} w-16 h-16 rounded-lg flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-sm opacity-90">{card.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Website Preview Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">🌐 Website Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {websitePages.map((page) => (
              <button
                key={page.id}
                onClick={() => setActiveTab(page.id)}
                className={`bg-gradient-to-br ${page.color} p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-white text-left group cursor-pointer`}
              >
                <div className={`${page.accent} w-16 h-16 rounded-lg flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {page.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{page.title}</h3>
                <p className="text-sm opacity-90">{page.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-pink-600">
          <h3 className="text-xl font-bold text-gray-800 mb-3">💡 Quick Tips</h3>
          <ul className="text-gray-700 space-y-2">
            <li>✓ Add sample data first to test the website</li>
            <li>✓ Configure website settings under Website Control</li>
            <li>✓ Preview your website in the Website Preview section</li>
            <li>✓ All changes sync in real-time with Firebase</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

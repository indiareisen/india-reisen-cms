import { useState } from 'react';
import { seedSampleData } from '../../utils/seedData';

const SampleDataButton = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddSampleData = async () => {
    setLoading(true);
    const result = await seedSampleData();
    setMessage(result.success ? '✅ Sample data added! Refresh to see.' : '❌ ' + result.error);
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <button
        onClick={handleAddSampleData}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Adding Sample Data...' : '📋 Add Sample Journeys & Blogs'}
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
};

export default SampleDataButton;

import { useState, useEffect } from 'react';
import { getAdmins, createAdmin, updateAdminRole } from '../../services/adminService';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'viewer' });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAdmin(formData);
      loadAdmins();
      setFormData({ name: '', email: '', role: 'viewer' });
      setShowForm(false);
    } catch (error) {
      alert('Error creating admin');
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateAdminRole(id, newRole);
      loadAdmins();
    } catch (error) {
      alert('Error updating role');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">👥 Admin Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-pink-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-pink-700"
        >
          {showForm ? '✕ Close' : '➕ Add Admin'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
          <input
            type="text"
            placeholder="Admin Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
          >
            <option>viewer</option>
            <option>manager</option>
            <option>owner</option>
          </select>
          <button type="submit" className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700">
            Create Admin
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b-2">
            <tr>
              <th className="px-6 py-4 text-left font-bold">Name</th>
              <th className="px-6 py-4 text-left font-bold">Email</th>
              <th className="px-6 py-4 text-left font-bold">Role</th>
              <th className="px-6 py-4 text-left font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{admin.name}</td>
                <td className="px-6 py-4">{admin.email}</td>
                <td className="px-6 py-4">
                  <select
                    value={admin.role}
                    onChange={(e) => handleRoleChange(admin.id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded"
                  >
                    <option>viewer</option>
                    <option>manager</option>
                    <option>owner</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded text-white font-semibold ${admin.role === 'owner' ? 'bg-red-600' : admin.role === 'manager' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                    {admin.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManagement;

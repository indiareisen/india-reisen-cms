import React, { useState, useEffect } from 'react';

const ClientManager = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    address: '',
    gstNumber: '',
    phoneNumber: '',
    email: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    const saved = localStorage.getItem('invoiceClients');
    if (saved) {
      setClients(JSON.parse(saved));
    }
  };

  const saveClientsToStorage = (updatedClients) => {
    localStorage.setItem('invoiceClients', JSON.stringify(updatedClients));
    setClients(updatedClients);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Name and Email are required');
      return;
    }

    if (editingId) {
      const updated = clients.map(c =>
        c.id === editingId ? { ...c, ...formData, updatedAt: new Date().toISOString() } : c
      );
      saveClientsToStorage(updated);
      setEditingId(null);
    } else {
      const newClient = { id: Date.now().toString(), ...formData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      saveClientsToStorage([...clients, newClient]);
    }
    resetForm();
  };

  const handleEditClient = (client) => {
    setFormData(client);
    setEditingId(client.id);
    setShowForm(true);
  };

  const handleDeleteClient = (id) => {
    if (window.confirm('Delete this client?')) {
      const updated = clients.filter(c => c.id !== id);
      saveClientsToStorage(updated);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', company: '', address: '', gstNumber: '', phoneNumber: '', email: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '2px solid #d1356f', paddingBottom: '16px' }}>
        <div><h1 style={{ color: '#d1356f', margin: 0, fontSize: '32px' }}>Client Manager</h1><p style={{ color: '#D4A574', margin: '8px 0 0 0', fontWeight: 'bold', fontSize: '14px' }}>India Reisen</p></div>
        <button onClick={() => { resetForm(); setShowForm(true); }} style={{ padding: '12px 24px', backgroundColor: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>+ Add New Client</button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#fff5f9', padding: '24px', borderRadius: '8px', marginBottom: '32px', border: '1px solid #ffccdd' }}>
          <h2 style={{ marginTop: 0, color: '#d1356f', fontSize: '20px' }}>{editingId ? 'Edit Client' : 'Add New Client'}</h2>
          <form onSubmit={handleAddClient}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div><label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Name *</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px' }} required /></div>
              <div><label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Company *</label><input type="text" name="company" value={formData.company} onChange={handleInputChange} placeholder="ABC Enterprises" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px' }} required /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Address</label><textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="City, State" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px', minHeight: '80px', fontFamily: 'Arial' }} /></div>
              <div><label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>GST</label><input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} placeholder="GST Number" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px' }} /></div>
              <div><label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Phone</label><input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="+91 98765 43210" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px' }} /></div>
              <div><label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' }}>Email *</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px' }} required /></div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={resetForm} style={{ padding: '10px 20px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Cancel</button>
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>{editingId ? 'Update' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
        <div style={{ color: '#666', fontSize: '14px', display: 'flex', alignItems: 'center' }}>{filteredClients.length} of {clients.length} clients</div>
      </div>

      {filteredClients.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
          <thead>
            <tr style={{ backgroundColor: '#fff5f9', borderBottom: '2px solid #D4A574' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#d1356f', fontSize: '14px' }}>Name</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#d1356f', fontSize: '14px' }}>Company</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#d1356f', fontSize: '14px' }}>Email</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#d1356f', fontSize: '14px' }}>Phone</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#d1356f', fontSize: '14px' }}>GST</th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: 'bold', color: '#d1356f', fontSize: '14px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client, idx) => (
              <tr key={client.id} style={{ borderBottom: '1px solid #eee', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500' }}>{client.name}</td>
                <td style={{ padding: '16px', fontSize: '14px' }}>{client.company}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#d1356f' }}><a href={`mailto:${client.email}`} style={{ color: '#d1356f', textDecoration: 'none' }}>{client.email}</a></td>
                <td style={{ padding: '16px', fontSize: '14px' }}>{client.phoneNumber || '—'}</td>
                <td style={{ padding: '16px', fontSize: '14px' }}>{client.gstNumber || '—'}</td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <button onClick={() => handleEditClient(client)} style={{ padding: '6px 12px', backgroundColor: '#D4A574', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', marginRight: '8px' }}>Edit</button>
                  <button onClick={() => handleDeleteClient(client.id)} style={{ padding: '6px 12px', backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ backgroundColor: '#f5f5f5', padding: '48px', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
          <p style={{ fontSize: '16px', margin: 0 }}>{searchTerm ? 'No clients found.' : 'No clients yet. Click "Add New Client" to start.'}</p>
        </div>
      )}
    </div>
  );
};

export default ClientManager;

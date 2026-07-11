import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../../services/firebaseService';

const emptyForm = {
  name: '',
  company: '',
  address: '',
  gstNumber: '',
  phoneNumber: '',
  email: '',
  nationality: '',
  passportNumber: '',
  passportExpiry: '',
  visaStatus: 'Not Required',
  visaNumber: '',
  visaExpiry: '',
  billingAddress: '',
  billingNotes: ''
};

const ClientManager = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setClients(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Name and Email are required');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'clients', editingId), {
          ...formData,
          updatedAt: Timestamp.now()
        });
      } else {
        await addDoc(collection(db, 'clients'), {
          ...formData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
      await loadClients();
      resetForm();
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Error saving client. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditClient = (client) => {
    setFormData({ ...emptyForm, ...client });
    setEditingId(client.id);
    setShowForm(true);
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('Delete this client? This will permanently remove their passport, visa, and billing details.')) {
      try {
        await deleteDoc(doc(db, 'clients', id));
        await loadClients();
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Error deleting client. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setShowForm(false);
    setEditingId(null);
  };

  const filteredClients = clients.filter(client =>
    (client.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333', fontSize: '14px' };
  const inputStyle = { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px' };
  const sectionHeadStyle = { fontSize: '15px', fontWeight: 'bold', color: '#d1356f', margin: '24px 0 12px 0', borderBottom: '1px solid #ffccdd', paddingBottom: '6px' };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '2px solid #d1356f', paddingBottom: '16px' }}>
        <div><h1 style={{ color: '#d1356f', margin: 0, fontSize: '32px' }}>Client Manager</h1><p style={{ color: '#D4A574', margin: '8px 0 0 0', fontWeight: 'bold', fontSize: '14px' }}>India Reisen</p></div>
        <button onClick={() => { resetForm(); setShowForm(true); }} style={{ padding: '12px 24px', backgroundColor: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>+ Add New Client</button>
      </div>

      <div style={{ background: '#fff9e6', border: '1px solid #ffe08a', borderRadius: '6px', padding: '12px 16px', marginBottom: '24px', fontSize: '13px', color: '#7a5c00' }}>
        🔒 This section stores sensitive personal data (passport, visa, billing details). Only share client records with authorized team members.
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#fff5f9', padding: '24px', borderRadius: '8px', marginBottom: '32px', border: '1px solid #ffccdd' }}>
          <h2 style={{ marginTop: 0, color: '#d1356f', fontSize: '20px' }}>{editingId ? 'Edit Client' : 'Add New Client'}</h2>
          <form onSubmit={handleAddClient}>

            <div style={sectionHeadStyle}>Basic Information</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Name *</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" style={inputStyle} required /></div>
              <div><label style={labelStyle}>Company</label><input type="text" name="company" value={formData.company} onChange={handleInputChange} placeholder="ABC Enterprises" style={inputStyle} /></div>
              <div><label style={labelStyle}>Email *</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" style={inputStyle} required /></div>
              <div><label style={labelStyle}>Phone</label><input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="+91 98765 43210" style={inputStyle} /></div>
              <div><label style={labelStyle}>Nationality</label><input type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} placeholder="e.g. United States" style={inputStyle} /></div>
              <div><label style={labelStyle}>GST Number</label><input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} placeholder="GST Number (corporate)" style={inputStyle} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Address</label><textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="City, State, Country" style={{ ...inputStyle, minHeight: '70px', fontFamily: 'Arial' }} /></div>
            </div>

            <div style={sectionHeadStyle}>Passport & Visa Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Passport Number</label><input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleInputChange} placeholder="Passport number" style={inputStyle} /></div>
              <div><label style={labelStyle}>Passport Expiry</label><input type="date" name="passportExpiry" value={formData.passportExpiry} onChange={handleInputChange} style={inputStyle} /></div>
              <div>
                <label style={labelStyle}>Visa Status</label>
                <select name="visaStatus" value={formData.visaStatus} onChange={handleInputChange} style={inputStyle}>
                  <option>Not Required</option>
                  <option>Not Started</option>
                  <option>Applied</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>
              <div><label style={labelStyle}>Visa Number</label><input type="text" name="visaNumber" value={formData.visaNumber} onChange={handleInputChange} placeholder="Visa number (if applicable)" style={inputStyle} /></div>
              <div><label style={labelStyle}>Visa Expiry</label><input type="date" name="visaExpiry" value={formData.visaExpiry} onChange={handleInputChange} style={inputStyle} /></div>
            </div>

            <div style={sectionHeadStyle}>Billing Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Billing Address</label><textarea name="billingAddress" value={formData.billingAddress} onChange={handleInputChange} placeholder="If different from contact address" style={{ ...inputStyle, minHeight: '60px', fontFamily: 'Arial' }} /></div>
              <div><label style={labelStyle}>Billing Notes</label><textarea name="billingNotes" value={formData.billingNotes} onChange={handleInputChange} placeholder="Payment terms, preferred currency, invoicing notes, etc." style={{ ...inputStyle, minHeight: '60px', fontFamily: 'Arial' }} /></div>
            </div>
            <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
              Note: this system does not store card numbers or payment credentials — only invoicing/billing reference notes.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={resetForm} style={{ padding: '10px 20px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Cancel</button>
              <button type="submit" disabled={saving} style={{ padding: '10px 20px', backgroundColor: saving ? '#e39ab5' : '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                {saving ? 'Saving...' : (editingId ? 'Update' : 'Save')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
        <div style={{ color: '#666', fontSize: '14px', display: 'flex', alignItems: 'center' }}>{filteredClients.length} of {clients.length} clients</div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Loading clients...</div>
      ) : filteredClients.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
          <thead>
            <tr style={{ backgroundColor: '#fff5f9', borderBottom: '2px solid #D4A574' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#d1356f', fontSize: '14px' }}>Name</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#d1356f', fontSize: '14px' }}>Company</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#d1356f', fontSize: '14px' }}>Email</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#d1356f', fontSize: '14px' }}>Phone</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#d1356f', fontSize: '14px' }}>Visa Status</th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: 'bold', color: '#d1356f', fontSize: '14px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client, idx) => (
              <tr key={client.id} style={{ borderBottom: '1px solid #eee', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500' }}>{client.name}</td>
                <td style={{ padding: '16px', fontSize: '14px' }}>{client.company || '—'}</td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#d1356f' }}><a href={`mailto:${client.email}`} style={{ color: '#d1356f', textDecoration: 'none' }}>{client.email}</a></td>
                <td style={{ padding: '16px', fontSize: '14px' }}>{client.phoneNumber || '—'}</td>
                <td style={{ padding: '16px', fontSize: '14px' }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: client.visaStatus === 'Approved' ? '#e7ffe7' : client.visaStatus === 'Rejected' ? '#ffe7e7' : '#f0f0f0',
                    color: client.visaStatus === 'Approved' ? '#2D6A4F' : client.visaStatus === 'Rejected' ? '#c62828' : '#666'
                  }}>
                    {client.visaStatus || 'Not Required'}
                  </span>
                </td>
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

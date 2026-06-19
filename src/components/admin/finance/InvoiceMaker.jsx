import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const logoUrl = 'https://res.cloudinary.com/dl1q4dw72/image/upload/v1781181114/final-logo_fqu772.png';

const InvoiceMaker = () => {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientForm, setShowClientForm] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2024-001');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState([{ id: 1, description: '', quantity: 1, rate: 0, gst: 0 }]);
  const [nextItemId, setNextItemId] = useState(2);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [notes, setNotes] = useState('');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountName, setAccountName] = useState('India Reisen Travel Pvt Ltd');
  const [accountNumber, setAccountNumber] = useState('5000123456789');
  const [ifscCode, setIfscCode] = useState('HDFC0000001');
  const [newClient, setNewClient] = useState({ name: '', company: '', address: '', gstNumber: '', phoneNumber: '', email: '' });
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    const savedClients = localStorage.getItem('invoiceClients');
    if (savedClients) {
      const parsed = JSON.parse(savedClients);
      setClients(parsed);
    }
  }, []);

  const saveClients = (updatedClients) => {
    localStorage.setItem('invoiceClients', JSON.stringify(updatedClients));
    setClients(updatedClients);
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newClient.name || !newClient.email) return alert('Name and Email required');
    
    const client = { 
      id: Date.now().toString(), 
      ...newClient,
      createdAt: new Date().toISOString() 
    };
    const updated = [...clients, client];
    saveClients(updated);
    setSelectedClientId(client.id);
    setSelectedClient(client);
    setNewClient({ name: '', company: '', address: '', gstNumber: '', phoneNumber: '', email: '' });
    setShowClientForm(false);
  };

  const handleSelectClient = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client);
    setSelectedClientId(clientId);
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm('Delete this client?')) {
      const updated = clients.filter(c => c.id !== clientId);
      saveClients(updated);
      if (selectedClientId === clientId) {
        setSelectedClientId('');
        setSelectedClient(null);
      }
    }
  };

  const handleAddItem = () => {
    const newItem = { id: nextItemId, description: '', quantity: 1, rate: 0, gst: 0 };
    setItems([...items, newItem]);
    setNextItemId(nextItemId + 1);
  };

  const handleUpdateItem = (id, field, value) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: field === 'quantity' || field === 'rate' || field === 'gst' ? parseFloat(value) || 0 : value } : item
    ));
  };

  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const gstAmount = items.reduce((sum, item) => sum + (item.quantity * item.rate * item.gst / 100), 0);
    const beforeDiscount = subtotal + gstAmount;
    const discount = (beforeDiscount * discountPercent) / 100;
    const total = beforeDiscount - discount;
    return { subtotal, gstAmount, beforeDiscount, discount, total };
  };

  const formatIndianNumber = (num) => {
    return num.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  };

  const amountInWords = (amount) => {
    const crore = Math.floor(amount / 10000000);
    const remainder = amount % 10000000;
    const lakh = Math.floor(remainder / 100000);
    const rest = remainder % 100000;

    let words = '';
    if (crore > 0) words += `${crore} Crore `;
    if (lakh > 0) words += `${lakh} Lakh `;
    if (rest > 0) words += `${rest}`;
    
    return words.trim() || '0';
  };

  const { subtotal, gstAmount, beforeDiscount, discount, total } = calculateTotals();

  const handleExportPNG = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${invoiceNumber}.png`;
      link.click();
    } catch (error) {
      alert('Error exporting PNG: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${invoiceNumber}.pdf`);
    } catch (error) {
      alert('Error exporting PDF: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#ffffff', borderRight: '1px solid #e0e0e0' }}>
        <h1 style={{ color: '#d1356f', marginBottom: '24px', fontSize: '28px' }}>Invoice Maker</h1>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Bill To</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <select
              value={selectedClientId}
              onChange={(e) => handleSelectClient(e.target.value)}
              style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
            >
              <option value="">Select a client...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.company} ({client.name})</option>
              ))}
            </select>
            <button
              onClick={() => setShowClientForm(true)}
              style={{ padding: '10px 16px', backgroundColor: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              + New
            </button>
          </div>

          {selectedClient && (
            <div style={{ backgroundColor: '#fff5f9', padding: '12px', borderRadius: '4px', marginBottom: '12px', fontSize: '13px' }}>
              <p style={{ margin: '4px 0', fontWeight: 'bold' }}>{selectedClient.name}</p>
              <p style={{ margin: '4px 0' }}>{selectedClient.company}</p>
              <p style={{ margin: '4px 0', color: '#666' }}>{selectedClient.address}</p>
              <p style={{ margin: '4px 0', color: '#666' }}>GST: {selectedClient.gstNumber}</p>
              <button
                onClick={() => handleDeleteClient(selectedClient.id)}
                style={{ marginTop: '8px', padding: '6px 12px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
              >
                Delete Client
              </button>
            </div>
          )}
        </div>

        {showClientForm && (
          <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '4px', marginBottom: '24px', border: '1px solid #e0e0e0' }}>
            <h3 style={{ marginTop: 0, marginBottom: '12px', color: '#d1356f' }}>Add New Client</h3>
            <form onSubmit={handleAddClient}>
              <input type="text" placeholder="Person's Name" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} required />
              <input type="text" placeholder="Company Name" value={newClient.company} onChange={(e) => setNewClient({ ...newClient, company: e.target.value })} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} required />
              <textarea placeholder="Full Address" value={newClient.address} onChange={(e) => setNewClient({ ...newClient, address: e.target.value })} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', minHeight: '60px' }} />
              <input type="text" placeholder="GST Number" value={newClient.gstNumber} onChange={(e) => setNewClient({ ...newClient, gstNumber: e.target.value })} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
              <input type="tel" placeholder="Phone Number" value={newClient.phoneNumber} onChange={(e) => setNewClient({ ...newClient, phoneNumber: e.target.value })} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
              <input type="email" placeholder="Email Address" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} style={{ width: '100%', marginBottom: '12px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} required />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save Client</button>
                <button type="button" onClick={() => setShowClientForm(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ marginTop: 0, color: '#333', fontSize: '16px' }}>Invoice Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div><label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>Invoice No.</label><input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} /></div>
            <div><label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>Invoice Date</label><input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} /></div>
            <div><label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>Due Date</label><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} /></div>
            <div><label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>Discount %</label><input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)} min="0" step="0.1" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} /></div>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ marginTop: 0, color: '#333', fontSize: '16px', marginBottom: '12px' }}>Line Items</h3>
          {items.map((item) => (
            <div key={item.id} style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
              <input type="text" placeholder="Description" value={item.description} onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px 60px', gap: '8px', alignItems: 'flex-end' }}>
                <div><label style={{ display: 'block', fontSize: '11px', color: '#666' }}>Qty</label><input type="number" value={item.quantity} onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)} min="1" step="1" style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }} /></div>
                <div><label style={{ display: 'block', fontSize: '11px', color: '#666' }}>Rate</label><input type="number" value={item.rate} onChange={(e) => handleUpdateItem(item.id, 'rate', e.target.value)} min="0" step="0.01" style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }} /></div>
                <div><label style={{ display: 'block', fontSize: '11px', color: '#666' }}>GST %</label><input type="number" value={item.gst} onChange={(e) => handleUpdateItem(item.id, 'gst', e.target.value)} min="0" max="100" step="0.1" style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }} /></div>
                <div><label style={{ display: 'block', fontSize: '11px', color: '#666' }}>Subtotal</label><div style={{ padding: '6px', fontSize: '12px', fontWeight: 'bold', color: '#d1356f' }}>₹{formatIndianNumber(item.quantity * item.rate)}</div></div>
                <button onClick={() => handleRemoveItem(item.id)} style={{ padding: '6px 12px', backgroundColor: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Remove</button>
              </div>
            </div>
          ))}
          <button onClick={handleAddItem} style={{ width: '100%', padding: '10px', backgroundColor: '#f5f5f5', border: '1px dashed #d1356f', color: '#d1356f', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>+ Add Item</button>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ marginTop: 0, color: '#333', fontSize: '16px' }}>Bank Details</h3>
          <input type="text" placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
          <input type="text" placeholder="Account Holder Name" value={accountName} onChange={(e) => setAccountName(e.target.value)} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
          <input type="text" placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
          <input type="text" placeholder="IFSC Code" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} style={{ width: '100%', marginBottom: '0', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Notes/Terms</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: '100%', height: '80px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif' }} placeholder="Enter payment terms, thank you message, or other notes..." />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button onClick={handleExportPNG} disabled={exporting} style={{ padding: '12px', backgroundColor: '#D4A574', color: 'white', border: 'none', borderRadius: '4px', cursor: exporting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px', opacity: exporting ? 0.6 : 1 }}>
            {exporting ? '⏳ Exporting...' : '⬇ Export as PNG'}
          </button>
          <button onClick={handleExportPDF} disabled={exporting} style={{ padding: '12px', backgroundColor: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: exporting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px', opacity: exporting ? 0.6 : 1 }}>
            {exporting ? '⏳ Exporting...' : '📄 Export as PDF'}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', justifyContent: 'center', backgroundColor: '#eee' }}>
        <div ref={previewRef} style={{ width: '850px', backgroundColor: 'white', padding: '40px', boxShadow: '0 0 20px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#333' }}>
          {/* LOGO HEADER */}
          <div style={{ textAlign: 'center', marginBottom: '32px', paddingBottom: '24px', borderBottom: '2px solid #D4A574' }}>
            <img src={logoUrl} alt="India Reisen" style={{ height: '80px', objectFit: 'contain', marginBottom: '16px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ textAlign: 'left' }}>
                <h1 style={{ color: '#d1356f', margin: '0 0 8px 0', fontSize: '32px' }}>INVOICE</h1>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '4px 0', fontWeight: 'bold' }}>Invoice No: {invoiceNumber}</p>
                <p style={{ margin: '4px 0' }}>Date: {invoiceDate}</p>
                {dueDate && <p style={{ margin: '4px 0' }}>Due: {dueDate}</p>}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '8px', color: '#d1356f' }}>BILL TO</p>
            {selectedClient ? (
              <div>
                <p style={{ margin: '4px 0', fontWeight: 'bold' }}>{selectedClient.name}</p>
                <p style={{ margin: '4px 0' }}>{selectedClient.company}</p>
                <p style={{ margin: '4px 0' }}>{selectedClient.address}</p>
                {selectedClient.gstNumber && <p style={{ margin: '4px 0' }}>GST: {selectedClient.gstNumber}</p>}
                {selectedClient.phoneNumber && <p style={{ margin: '4px 0' }}>Phone: {selectedClient.phoneNumber}</p>}
                {selectedClient.email && <p style={{ margin: '4px 0' }}>Email: {selectedClient.email}</p>}
              </div>
            ) : (
              <p style={{ color: '#999', fontStyle: 'italic' }}>Select a client to populate</p>
            )}
          </div>

          <table style={{ width: '100%', marginBottom: '24px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #D4A574', backgroundColor: '#fff5f9' }}>
                <th style={{ textAlign: 'left', padding: '10px', fontWeight: 'bold', color: '#d1356f' }}>Description</th>
                <th style={{ textAlign: 'right', padding: '10px', fontWeight: 'bold', color: '#d1356f', width: '80px' }}>Qty</th>
                <th style={{ textAlign: 'right', padding: '10px', fontWeight: 'bold', color: '#d1356f', width: '100px' }}>Rate (₹)</th>
                <th style={{ textAlign: 'right', padding: '10px', fontWeight: 'bold', color: '#d1356f', width: '70px' }}>GST %</th>
                <th style={{ textAlign: 'right', padding: '10px', fontWeight: 'bold', color: '#d1356f', width: '100px' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const amount = item.quantity * item.rate;
                const gst = amount * (item.gst / 100);
                const total = amount + gst;
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>{item.description}</td>
                    <td style={{ textAlign: 'right', padding: '10px' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right', padding: '10px' }}>{formatIndianNumber(item.rate)}</td>
                    <td style={{ textAlign: 'right', padding: '10px' }}>{item.gst}%</td>
                    <td style={{ textAlign: 'right', padding: '10px', fontWeight: 'bold' }}>{formatIndianNumber(total)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}><span>Subtotal:</span><span>₹{formatIndianNumber(subtotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}><span>GST:</span><span>₹{formatIndianNumber(gstAmount)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee', color: '#666' }}><span>Before Discount:</span><span>₹{formatIndianNumber(beforeDiscount)}</span></div>
              {discountPercent > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee', color: '#d1356f' }}><span>Discount ({discountPercent}%):</span><span>-₹{formatIndianNumber(discount)}</span></div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px solid #d1356f', fontWeight: 'bold', fontSize: '16px', color: '#d1356f' }}><span>Total:</span><span>₹{formatIndianNumber(total)}</span></div>
            </div>
          </div>

          <div style={{ marginBottom: '24px', padding: '12px', backgroundColor: '#fff5f9', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Amount in Words:</p>
            <p style={{ margin: '4px 0 0 0', fontWeight: 'bold', color: '#d1356f' }}>Rupees {amountInWords(Math.floor(total))} only</p>
          </div>

          <div style={{ marginBottom: '24px', backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#333' }}>Bank Details</p>
            <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
              <div style={{ display: 'flex' }}><span style={{ width: '150px', fontWeight: 'bold' }}>Bank Name:</span><span>{bankName}</span></div>
              <div style={{ display: 'flex' }}><span style={{ width: '150px', fontWeight: 'bold' }}>Account Holder:</span><span>{accountName}</span></div>
              <div style={{ display: 'flex' }}><span style={{ width: '150px', fontWeight: 'bold' }}>Account Number:</span><span>{accountNumber}</span></div>
              <div style={{ display: 'flex' }}><span style={{ width: '150px', fontWeight: 'bold' }}>IFSC Code:</span><span>{ifscCode}</span></div>
            </div>
          </div>

          {notes && (
            <div style={{ marginBottom: '24px', padding: '12px', backgroundColor: '#f0f8f0', borderRadius: '4px' }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#333' }}>Notes</p>
              <p style={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{notes}</p>
            </div>
          )}

          <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '2px solid #D4A574', textAlign: 'center', fontSize: '12px', color: '#666' }}>
            <p style={{ margin: '4px 0' }}>Thank you for your business!</p>
            <p style={{ margin: '4px 0' }}><strong style={{ color: '#d1356f' }}>India Reisen</strong> | Explore. Experience. Enchant.</p>
            <p style={{ margin: '4px 0', fontSize: '11px' }}>www.indiareisen.com | team@indiareisen.com | +91 98108 27785</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceMaker;

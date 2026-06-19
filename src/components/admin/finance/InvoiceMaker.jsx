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
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    
    const convertHundreds = (num) => {
      let result = '';
      if (num >= 100) {
        result += ones[Math.floor(num / 100)] + ' hundred';
        num %= 100;
        if (num > 0) result += ' ';
      }
      if (num >= 20) {
        result += tens[Math.floor(num / 10)];
        if (num % 10 > 0) result += ' ' + ones[num % 10];
      } else if (num >= 10) {
        result += teens[num - 10];
      } else if (num > 0) {
        result += ones[num];
      }
      return result.trim();
    };

    if (amount === 0) return 'zero';
    
    const crore = Math.floor(amount / 10000000);
    const lakh = Math.floor((amount % 10000000) / 100000);
    const thousand = Math.floor((amount % 100000) / 1000);
    const hundred = amount % 1000;

    let words = '';
    if (crore > 0) words += convertHundreds(crore) + ' crore ';
    if (lakh > 0) words += convertHundreds(lakh) + ' lakh ';
    if (thousand > 0) words += convertHundreds(thousand) + ' thousand ';
    if (hundred > 0) words += convertHundreds(hundred);

    return words.trim();
  };

  const { subtotal, gstAmount, beforeDiscount, discount, total } = calculateTotals();

  const handleExportPNG = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        allowTaint: true,
        useCORS: true
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
        allowTaint: true,
        useCORS: true
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

  const handleSendEmail = async () => {
    if (!selectedClient) {
      alert('Please select a client first');
      return;
    }

    setExporting(true);
    try {
      const invoiceHtml = previewRef.current?.innerHTML;
      if (!invoiceHtml) {
        throw new Error('Could not generate invoice HTML');
      }

      const response = await fetch('https://project-5alhy.vercel.app/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: selectedClient.email,
          invoiceNumber: invoiceNumber,
          invoiceHtml: invoiceHtml,
          clientName: selectedClient.name
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`✅ Invoice sent to ${selectedClient.email}!`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert(`Error sending email: ${error.message}`);
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <button onClick={handleExportPNG} disabled={exporting} style={{ padding: '12px', backgroundColor: '#D4A574', color: 'white', border: 'none', borderRadius: '4px', cursor: exporting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px', opacity: exporting ? 0.6 : 1 }}>
            {exporting ? '⏳ Exporting...' : '⬇ Export as PNG'}
          </button>
          <button onClick={handleExportPDF} disabled={exporting} style={{ padding: '12px', backgroundColor: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: exporting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px', opacity: exporting ? 0.6 : 1 }}>
            {exporting ? '⏳ Exporting...' : '📄 Export as PDF'}
          </button>
          <button onClick={handleSendEmail} disabled={exporting} style={{ padding: '12px', backgroundColor: '#D4A574', color: 'white', border: 'none', borderRadius: '4px', cursor: exporting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px', opacity: exporting ? 0.6 : 1 }}>
            {exporting ? '⏳ Sending...' : '✉️ Send via Email'}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#eee' }}>
        <div ref={previewRef} style={{ width: '820px', backgroundColor: 'white', padding: '30px', boxShadow: '0 0 20px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#333', minHeight: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '3px solid #D4A574' }}>
            <img src={logoUrl} alt="India Reisen" style={{ height: '60px', marginBottom: '12px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
              <div style={{ textAlign: 'left' }}>
                <h1 style={{ color: '#d1356f', margin: '0', fontSize: '28px' }}>INVOICE</h1>
              </div>
              <div style={{ textAlign: 'right', fontSize: '11px' }}>
                <p style={{ margin: '2px 0' }}>Invoice No: <strong>{invoiceNumber}</strong></p>
                <p style={{ margin: '2px 0' }}>Date: {invoiceDate}</p>
                {dueDate && <p style={{ margin: '2px 0' }}>Due: {dueDate}</p>}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '6px', color: '#d1356f', fontSize: '11px' }}>BILL TO</p>
            {selectedClient ? (
              <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                <p style={{ margin: '2px 0', fontWeight: 'bold' }}>{selectedClient.name}</p>
                <p style={{ margin: '2px 0' }}>{selectedClient.company}</p>
                <p style={{ margin: '2px 0' }}>{selectedClient.address}</p>
                {selectedClient.gstNumber && <p style={{ margin: '2px 0' }}>GST: {selectedClient.gstNumber}</p>}
                {selectedClient.phoneNumber && <p style={{ margin: '2px 0' }}>Phone: {selectedClient.phoneNumber}</p>}
                {selectedClient.email && <p style={{ margin: '2px 0' }}>Email: {selectedClient.email}</p>}
              </div>
            ) : (
              <p style={{ color: '#999', fontStyle: 'italic', fontSize: '11px' }}>Select a client to populate</p>
            )}
          </div>

          <table style={{ width: '100%', marginBottom: '16px', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #D4A574', backgroundColor: '#fff5f9' }}>
                <th style={{ textAlign: 'left', padding: '8px', fontWeight: 'bold', color: '#d1356f' }}>Description</th>
                <th style={{ textAlign: 'right', padding: '8px', fontWeight: 'bold', color: '#d1356f', width: '70px' }}>Qty</th>
                <th style={{ textAlign: 'right', padding: '8px', fontWeight: 'bold', color: '#d1356f', width: '90px' }}>Rate (₹)</th>
                <th style={{ textAlign: 'right', padding: '8px', fontWeight: 'bold', color: '#d1356f', width: '60px' }}>GST %</th>
                <th style={{ textAlign: 'right', padding: '8px', fontWeight: 'bold', color: '#d1356f', width: '100px' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const amount = item.quantity * item.rate;
                const gst = amount * (item.gst / 100);
                const total = amount + gst;
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '6px 8px' }}>{item.description}</td>
                    <td style={{ textAlign: 'right', padding: '6px 8px' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right', padding: '6px 8px' }}>{formatIndianNumber(item.rate)}</td>
                    <td style={{ textAlign: 'right', padding: '6px 8px' }}>{item.gst}%</td>
                    <td style={{ textAlign: 'right', padding: '6px 8px', fontWeight: 'bold' }}>{formatIndianNumber(total)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '280px', fontSize: '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eee' }}><span>Subtotal:</span><span>₹{formatIndianNumber(subtotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eee' }}><span>GST:</span><span>₹{formatIndianNumber(gstAmount)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eee', color: '#666' }}><span>Before Discount:</span><span>₹{formatIndianNumber(beforeDiscount)}</span></div>
              {discountPercent > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eee', color: '#d1356f' }}><span>Discount ({discountPercent}%):</span><span>-₹{formatIndianNumber(discount)}</span></div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '2px solid #d1356f', fontWeight: 'bold', fontSize: '13px', color: '#d1356f' }}><span>Total:</span><span>₹{formatIndianNumber(total)}</span></div>
            </div>
          </div>

          <div style={{ marginBottom: '16px', padding: '10px', backgroundColor: '#fff5f9', borderRadius: '3px', fontSize: '11px' }}>
            <p style={{ margin: '0 0 4px 0', color: '#666' }}>Amount in Words:</p>
            <p style={{ margin: '0', fontWeight: 'bold', color: '#d1356f' }}>Rupees {amountInWords(Math.floor(total))} only</p>
          </div>

          <div style={{ marginBottom: '16px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '3px', border: '1px solid #e0e0e0', fontSize: '10px' }}>
            <p style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: '#333' }}>Bank Details</p>
            <div style={{ lineHeight: '1.5' }}>
              <div style={{ display: 'flex' }}><span style={{ width: '140px', fontWeight: 'bold' }}>Bank Name:</span><span>{bankName}</span></div>
              <div style={{ display: 'flex' }}><span style={{ width: '140px', fontWeight: 'bold' }}>Account Holder:</span><span>{accountName}</span></div>
              <div style={{ display: 'flex' }}><span style={{ width: '140px', fontWeight: 'bold' }}>Account Number:</span><span>{accountNumber}</span></div>
              <div style={{ display: 'flex' }}><span style={{ width: '140px', fontWeight: 'bold' }}>IFSC Code:</span><span>{ifscCode}</span></div>
            </div>
          </div>

          {notes && (
            <div style={{ marginBottom: '16px', padding: '10px', backgroundColor: '#f0f8f0', borderRadius: '3px', fontSize: '10px' }}>
              <p style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: '#333' }}>Notes</p>
              <p style={{ margin: '0', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>{notes}</p>
            </div>
          )}

          <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '2px solid #D4A574', textAlign: 'center', fontSize: '10px', color: '#666' }}>
            <p style={{ margin: '4px 0' }}>Thank you for your business!</p>
            <p style={{ margin: '4px 0' }}><strong style={{ color: '#d1356f' }}>India Reisen</strong> | Explore. Experience. Enchant.</p>
            <p style={{ margin: '4px 0' }}>www.indiareisen.com | team@indiareisen.com | +91 98108 27785</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceMaker;

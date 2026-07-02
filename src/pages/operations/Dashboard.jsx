import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function OperationsDashboard() {
  const [stats, setStats] = useState({ clients: 0, invoices: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const clientsSnap = await getDocs(collection(db, 'clients'))
      const invoicesSnap = await getDocs(collection(db, 'invoices'))

      setStats({
        clients: clientsSnap.size,
        invoices: invoicesSnap.size
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Operations Dashboard</h1>
      <p>Manage business operations, clients, and finances</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <div style={{
          background: 'white',
          border: '4px solid #3498db',
          padding: '30px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h2>👥 Clients</h2>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#3498db' }}>
            {stats.clients}
          </div>
        </div>

        <div style={{
          background: 'white',
          border: '4px solid #2ecc71',
          padding: '30px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h2>💰 Invoices</h2>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#2ecc71' }}>
            {stats.invoices}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px', background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a href="/admin/operations/clients" style={{
            background: '#3498db',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            textDecoration: 'none'
          }}>Manage Clients</a>
          <a href="/admin/operations/invoices" style={{
            background: '#2ecc71',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            textDecoration: 'none'
          }}>Create Invoice</a>
          <a href="/admin/operations/reports" style={{
            background: '#f39c12',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            textDecoration: 'none'
          }}>View Reports</a>
        </div>
      </div>
    </div>
  )
}

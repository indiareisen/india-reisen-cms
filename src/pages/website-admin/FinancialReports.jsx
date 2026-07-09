import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function FinancialReports() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalJourneys: 0,
    avgPrice: 0,
    highestPrice: 0,
    lowestPrice: 0
  })
  const [journeys, setJourneys] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFinancialData()
  }, [])

  const fetchFinancialData = async () => {
    try {
      const journeysSnap = await getDocs(collection(db, 'journeys'))
      const journeysList = journeysSnap.docs.map(d => ({ id: d.id, ...d.data() }))

      const prices = journeysList.map(j => j.price || 0).filter(p => p > 0)
      const totalRevenue = prices.reduce((sum, p) => sum + p, 0)
      const avgPrice = prices.length > 0 ? totalRevenue / prices.length : 0
      const highestPrice = Math.max(...prices, 0)
      const lowestPrice = Math.min(...prices.filter(p => p > 0), 0)

      setStats({
        totalRevenue,
        totalJourneys: journeysList.length,
        avgPrice: Math.round(avgPrice),
        highestPrice,
        lowestPrice
      })

      setJourneys(journeysList.sort((a, b) => (b.price || 0) - (a.price || 0)))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const primaryColor = '#d1356f'

  if (loading) return <div>Loading financial reports...</div>

  return (
    <div>
      <h1>💰 Financial Reports</h1>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px'
        }}>
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Total Revenue</p>
          <h2 style={{ margin: '10px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>${(stats.totalRevenue / 1000).toFixed(1)}K</h2>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px'
        }}>
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Average Price</p>
          <h2 style={{ margin: '10px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>${stats.avgPrice}</h2>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px'
        }}>
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Highest Price</p>
          <h2 style={{ margin: '10px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>${stats.highestPrice}</h2>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px'
        }}>
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Lowest Price</p>
          <h2 style={{ margin: '10px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>${stats.lowestPrice}</h2>
        </div>
      </div>

      {/* Journey Revenue List */}
      <div style={{ background: 'white', padding: '25px', borderRadius: '12px' }}>
        <h2 style={{ margin: '0 0 20px 0', color: primaryColor }}>Journey Revenue Breakdown</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Journey</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Destination</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Price</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Duration</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>% of Total</th>
              </tr>
            </thead>
            <tbody>
              {journeys.map((journey, idx) => (
                <tr key={journey.id} style={{ borderBottom: '1px solid #eee', background: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                  <td style={{ padding: '12px' }}>{journey.title}</td>
                  <td style={{ padding: '12px' }}>{journey.destination}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: primaryColor }}>${journey.price}</td>
                  <td style={{ padding: '12px' }}>{journey.duration} days</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                    {stats.totalRevenue > 0 ? ((journey.price / stats.totalRevenue) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Button */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => {
            const csv = 'Journey,Destination,Price,Duration\n' + 
              journeys.map(j => `${j.title},${j.destination},${j.price},${j.duration}`).join('\n')
            const blob = new Blob([csv], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'financial_report.csv'
            a.click()
          }}
          style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          📥 Export Report
        </button>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'

export default function ActivityLog() {
  const [activities, setActivities] = useState([])

  useEffect(() => {
    // Load activities from localStorage
    const stored = localStorage.getItem('adminActivityLog')
    if (stored) {
      try {
        setActivities(JSON.parse(stored))
      } catch (e) {
        console.error('Error loading activities:', e)
      }
    }
  }, [])

  const clearLog = () => {
    if (confirm('Clear all activity logs?')) {
      localStorage.removeItem('adminActivityLog')
      setActivities([])
      alert('✅ Activity log cleared')
    }
  }

  return (
    <div>
      <h1>📋 Activity Log</h1>
      <p style={{ color: '#666' }}>Track all admin actions and changes</p>

      {/* Clear Button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={clearLog}
          style={{
            padding: '10px 20px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🗑️ Clear Log
        </button>
      </div>

      {/* Activity List */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px' }}>
        {activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <p>No activities recorded yet</p>
          </div>
        ) : (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {activities.map((activity, idx) => (
              <div key={idx} style={{
                padding: '15px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start'
              }}>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#333' }}>
                    {activity.action}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                    {activity.details}
                  </p>
                </div>
                <span style={{ fontSize: '11px', color: '#ccc', whiteSpace: 'nowrap' }}>
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div style={{
          background: '#f0f0f0',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Total Activities</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#d1356f' }}>
            {activities.length}
          </p>
        </div>

        <div style={{
          background: '#f0f0f0',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Today's Activities</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#d1356f' }}>
            {activities.filter(a => {
              const today = new Date().toDateString()
              return new Date(a.timestamp).toDateString() === today
            }).length}
          </p>
        </div>
      </div>
    </div>
  )
}

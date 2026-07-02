export default function AdminPanel() {
  return (
    <div>
      <h1>Operations Settings</h1>
      <p>Configure operations and admin preferences</p>

      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>Settings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ fontWeight: 'bold' }}>Default Currency:</label>
            <p>USD</p>
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Tax Rate (GST):</label>
            <p>18%</p>
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Company Name:</label>
            <p>India Reisen</p>
          </div>
        </div>
      </div>
    </div>
  )
}

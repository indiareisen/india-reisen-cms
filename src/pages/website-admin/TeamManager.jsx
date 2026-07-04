import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function TeamManager() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    expertise: '',
    email: ''
  })

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    try {
      const q = query(collection(db, 'team'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setTeam(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error fetching team:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTeam = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'team'), {
        ...formData,
        expertise: formData.expertise.split(',').map(e => e.trim()),
        createdAt: Timestamp.now()
      })
      setFormData({ name: '', role: '', bio: '', expertise: '', email: '' })
      setShowForm(false)
      fetchTeam()
    } catch (error) {
      console.error('Error adding team member:', error)
    }
  }

  const handleDeleteTeam = async (id) => {
    if (window.confirm('Remove this team member?')) {
      try {
        await deleteDoc(doc(db, 'team', id))
        fetchTeam()
      } catch (error) {
        console.error('Error deleting team member:', error)
      }
    }
  }

  if (loading) return <div>Loading team...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Team Management</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '10px 20px', background: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {showForm ? '✕ Cancel' : '+ Add Member'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddTeam} style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            <input type="text" placeholder="Role" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            <input type="text" placeholder="Expertise (comma separated)" value={formData.expertise} onChange={(e) => setFormData({...formData, expertise: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <textarea placeholder="Bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', marginBottom: '15px', minHeight: '100px', boxSizing: 'border-box' }} />
          <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Add Member
          </button>
        </form>
      )}

      <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h2>Team Members ({team.length})</h2>
        {team.length === 0 ? (
          <p>No team members yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {team.map(member => (
              <div key={member.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px', background: '#f9f9f9' }}>
                <h3>{member.name}</h3>
                <p><strong>Role:</strong> {member.role}</p>
                <p><strong>Email:</strong> <a href={`mailto:${member.email}`}>{member.email}</a></p>
                <p><strong>Bio:</strong> {member.bio}</p>
                {member.expertise && <p><strong>Expertise:</strong> {Array.isArray(member.expertise) ? member.expertise.join(', ') : member.expertise}</p>}
                <button 
                  onClick={() => handleDeleteTeam(member.id)}
                  style={{ marginTop: '10px', padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  🗑️ Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

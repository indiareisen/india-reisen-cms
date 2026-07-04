import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function TeamManager() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)

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

  if (loading) return <div>Loading team members...</div>

  return (
    <div>
      <h1>Team Management</h1>
      <p>Manage team members and guides</p>
      
      <div style={{ marginTop: '20px', padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h2>Team Members ({team.length})</h2>
        {team.length === 0 ? (
          <p>No team members yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {team.map(member => (
              <div key={member.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px' }}>
                {member.image && <img src={member.image} alt={member.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }} />}
                <h3>{member.name}</h3>
                <p><strong>Role:</strong> {member.role}</p>
                <p><strong>Bio:</strong> {member.bio}</p>
                {member.expertise && <p><strong>Expertise:</strong> {member.expertise.join(', ')}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

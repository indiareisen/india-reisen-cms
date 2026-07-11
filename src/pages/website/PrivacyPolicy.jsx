import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function PrivacyPolicy() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'general'))
        if (docSnap.exists()) setSettings(docSnap.data())
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  const primaryColor = settings?.primaryColor || '#d1356f'

  const sectionStyle = { marginBottom: '32px' }
  const headingStyle = { color: primaryColor, fontSize: '19px', marginBottom: '10px', marginTop: 0 }
  const textStyle = { color: '#555', lineHeight: '1.75', fontSize: '15px', margin: '0 0 12px 0' }
  const listStyle = { color: '#555', lineHeight: '1.75', fontSize: '15px', margin: '0 0 12px 0', paddingLeft: '22px' }
  const subheadStyle = { color: '#333', fontSize: '15px', fontWeight: 'bold', margin: '18px 0 8px 0' }

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '80px 20px' }}>
      <h1 style={{ color: primaryColor, marginBottom: '8px' }}>Privacy Policy</h1>
      <p style={{ color: '#999', fontSize: '13px', marginBottom: '40px' }}>
        Effective Date: July 11, 2026
      </p>

      <p style={textStyle}>
        Welcome to India Reisen ("Company", "we", "our", or "us"). We respect your privacy and are
        committed to protecting your personal information.
      </p>
      <p style={{ ...textStyle, marginBottom: '40px' }}>
        This Privacy Policy explains how we collect, use, store, and protect information when you visit{' '}
        <strong>www.indiareisen.com</strong> and use our travel services.
      </p>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>1. About Us</h2>
        <p style={textStyle}><strong>Brand Name:</strong> India Reisen</p>
        <p style={textStyle}><strong>Business Location:</strong> Noida, Uttar Pradesh, India</p>
        <p style={textStyle}>
          India Reisen is a Destination Management Company (DMC) specializing in inbound travel to India,
          Nepal, and Bhutan. We provide luxury holidays, cultural tours, wildlife safaris, business travel,
          corporate travel, MICE (Meetings, Incentives, Conferences & Exhibitions), tailor-made itineraries,
          transportation, hotel reservations, guides, and related travel services.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>2. Information We Collect</h2>
        <p style={subheadStyle}>Personal Information</p>
        <ul style={listStyle}>
          <li>Full Name</li>
          <li>Nationality</li>
          <li>Email Address</li>
          <li>Phone Number</li>
          <li>WhatsApp Number</li>
          <li>Passport details (when required for bookings)</li>
          <li>Visa-related information</li>
          <li>Billing information</li>
          <li>Company name (for corporate bookings)</li>
        </ul>
        <p style={subheadStyle}>Travel Information</p>
        <ul style={listStyle}>
          <li>Arrival and departure details</li>
          <li>Flight information</li>
          <li>Hotel preferences</li>
          <li>Dietary requirements</li>
          <li>Medical requirements voluntarily shared</li>
          <li>Emergency contact details</li>
          <li>Travel preferences</li>
        </ul>
        <p style={subheadStyle}>Technical Information</p>
        <p style={textStyle}>When you visit our website we may automatically collect:</p>
        <ul style={listStyle}>
          <li>IP address</li>
          <li>Browser type</li>
          <li>Device information</li>
          <li>Operating system</li>
          <li>Pages visited</li>
          <li>Referral source</li>
          <li>Time spent on pages</li>
          <li>Cookies and analytics data</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>3. How We Use Your Information</h2>
        <p style={textStyle}>Your information may be used to:</p>
        <ul style={listStyle}>
          <li>Prepare quotations</li>
          <li>Confirm travel bookings</li>
          <li>Reserve hotels</li>
          <li>Arrange transport</li>
          <li>Book flights or trains (where applicable)</li>
          <li>Process payments</li>
          <li>Respond to enquiries</li>
          <li>Provide customer support</li>
          <li>Improve our website</li>
          <li>Send booking confirmations</li>
          <li>Send travel documents</li>
          <li>Meet legal and immigration requirements</li>
          <li>Prevent fraud</li>
          <li>Communicate before, during and after your trip</li>
        </ul>
        <p style={textStyle}>
          With your consent, we may also send promotional offers, newsletters and travel updates.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>4. Sharing Your Information</h2>
        <p style={textStyle}>We only share information when necessary with:</p>
        <ul style={listStyle}>
          <li>Hotels</li>
          <li>Airlines</li>
          <li>Transport providers</li>
          <li>Local guides</li>
          <li>Government authorities (where legally required)</li>
          <li>Visa processing partners</li>
          <li>Payment gateways</li>
          <li>Technology providers</li>
          <li>Insurance providers (if applicable)</li>
        </ul>
        <p style={{ ...textStyle, fontWeight: 'bold' }}>We do not sell your personal information.</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>5. International Data Transfers</h2>
        <p style={textStyle}>
          As we serve international travellers, your information may be transferred to trusted suppliers
          located in India, Nepal, Bhutan or other countries involved in providing your travel arrangements.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>6. Cookies</h2>
        <p style={textStyle}>Our website uses cookies to:</p>
        <ul style={listStyle}>
          <li>Improve website performance</li>
          <li>Remember preferences</li>
          <li>Analyse visitor behaviour</li>
          <li>Enhance user experience</li>
          <li>Measure marketing effectiveness</li>
        </ul>
        <p style={textStyle}>You can disable cookies through your browser settings.</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>7. Data Security</h2>
        <p style={textStyle}>
          We use reasonable administrative, technical and organizational safeguards to protect your
          personal information from unauthorized access, alteration, disclosure or destruction.
        </p>
        <p style={textStyle}>
          However, no online transmission or storage system can be guaranteed to be 100% secure.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>8. Data Retention</h2>
        <p style={textStyle}>We retain personal information only for as long as necessary to:</p>
        <ul style={listStyle}>
          <li>Provide travel services</li>
          <li>Meet legal obligations</li>
          <li>Resolve disputes</li>
          <li>Maintain accounting records</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>9. Your Rights</h2>
        <p style={textStyle}>Depending on applicable laws, you may request to:</p>
        <ul style={listStyle}>
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Delete your personal information</li>
          <li>Restrict processing</li>
          <li>Withdraw consent where applicable</li>
          <li>Request a copy of your data</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>10. Third-Party Links</h2>
        <p style={textStyle}>
          Our website may contain links to third-party websites. We are not responsible for their privacy
          practices.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>11. Children's Privacy</h2>
        <p style={textStyle}>
          Our services are not directed toward children without parental involvement. Information relating
          to minors is collected only as required for travel bookings.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>12. Changes to This Policy</h2>
        <p style={textStyle}>
          We may update this Privacy Policy periodically. Changes become effective once published on this
          page.
        </p>
      </div>

      <div style={{ ...sectionStyle, background: '#f9f9f9', padding: '25px', borderRadius: '10px', marginTop: '40px' }}>
        <h2 style={headingStyle}>13. Contact Us</h2>
        <p style={{ ...textStyle, marginBottom: '4px' }}><strong>India Reisen</strong></p>
        <p style={{ ...textStyle, marginBottom: '4px' }}>Noida, Uttar Pradesh, India</p>
        <p style={{ ...textStyle, marginBottom: '4px' }}>
          Website: <a href="https://www.indiareisen.com" style={{ color: primaryColor }}>www.indiareisen.com</a>
        </p>
        <p style={{ ...textStyle, marginBottom: '4px' }}>
          Email: <a href="mailto:team@indiareisen.com" style={{ color: primaryColor }}>team@indiareisen.com</a>
        </p>
        <p style={{ ...textStyle, marginBottom: '4px' }}>
          Phone: <a href="tel:+919811041785" style={{ color: primaryColor }}>+91 98110 41785</a>
        </p>
        <p style={{ ...textStyle, marginBottom: 0, marginTop: '10px' }}>
          For any questions regarding this Privacy Policy, please contact us.
        </p>
      </div>
    </div>
  )
}

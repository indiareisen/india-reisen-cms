import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function TermsAndConditions() {
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

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '80px 20px' }}>
      <h1 style={{ color: primaryColor, marginBottom: '8px' }}>Terms & Conditions</h1>
      <p style={{ color: '#999', fontSize: '13px', marginBottom: '40px' }}>
        Effective Date: July 11, 2026
      </p>

      <p style={textStyle}>
        These Terms & Conditions ("Terms") govern your use of the India Reisen website
        (www.reisenindia.com) and any travel planning, quotation, or booking services provided by
        India Reisen ("Company", "we", "us", "our"). By using this website or engaging our services,
        you agree to these Terms.
      </p>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>1. About Our Services</h2>
        <p style={textStyle}>
          India Reisen is a Destination Management Company (DMC) based in Noida, Uttar Pradesh, India,
          specializing in inbound travel to India, Nepal, and Bhutan. We design and arrange bespoke
          itineraries, luxury holidays, cultural tours, wildlife safaris, business and corporate travel,
          and MICE services, working with hotels, transport providers, guides, and other local partners.
        </p>
        <p style={textStyle}>
          Enquiries submitted through this website (via our contact form or direct communication) are
          treated as requests for a quotation, not a confirmed booking. A booking is only confirmed once
          both parties have agreed on the itinerary, price, and payment terms in writing, and any required
          deposit has been received.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>2. Quotations & Pricing</h2>
        <ul style={listStyle}>
          <li>Quotations are valid for the period stated at the time of issue and are subject to availability.</li>
          <li>Prices may vary based on season, exchange rates, and supplier costs, and are subject to change until a booking is confirmed with a deposit.</li>
          <li>All prices are quoted per person unless stated otherwise, and exclude items explicitly marked as not included (e.g. international flights, visa fees, personal expenses, travel insurance, unless specified).</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>3. Booking, Payment & Deposits</h2>
        <ul style={listStyle}>
          <li>A booking is confirmed upon receipt of a deposit as communicated for your specific itinerary.</li>
          <li>The remaining balance is due before the start of travel, as agreed at the time of booking.</li>
          <li>Payment methods and currency will be confirmed directly with our team; we do not process card payments through this website.</li>
          <li>Failure to pay the balance by the agreed date may result in cancellation of the booking, subject to our cancellation terms below.</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>4. Cancellations & Refunds</h2>
        <p style={textStyle}>
          Cancellation terms vary depending on the specific hotels, transport, and experiences booked, as
          many of our suppliers apply their own cancellation policies. Specific cancellation terms and any
          applicable refund amounts will be communicated in writing at the time of booking confirmation.
          As a general guide:
        </p>
        <ul style={listStyle}>
          <li>Cancellations made well in advance of travel typically incur lower charges than late cancellations.</li>
          <li>Deposits may be non-refundable or partially refundable depending on supplier terms.</li>
          <li>No-shows and cancellations made after travel has commenced are generally non-refundable.</li>
        </ul>
        <p style={textStyle}>
          We recommend all travellers obtain comprehensive travel insurance covering trip cancellation,
          interruption, medical emergencies, and evacuation.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>5. Travel Documents & Visas</h2>
        <p style={textStyle}>
          It is the traveller's responsibility to hold a valid passport (with the required minimum validity),
          any necessary visas, and to meet any health/vaccination requirements for their destination. While
          we may assist with visa guidance or processing support where offered, final responsibility for
          valid travel documentation rests with the traveller. We are not liable for any loss arising from a
          traveller's failure to hold correct documentation.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>6. Changes to Itinerary</h2>
        <p style={textStyle}>
          We aim to deliver itineraries as planned. However, due to factors outside our control (weather,
          local conditions, supplier availability, safety concerns, or government restrictions), we reserve
          the right to make reasonable changes to accommodations, transport, or activities, and will do our
          best to offer comparable alternatives.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>7. Force Majeure</h2>
        <p style={textStyle}>
          We are not liable for failure to perform our obligations where such failure results from
          circumstances beyond our reasonable control, including but not limited to natural disasters,
          extreme weather, pandemics, war, civil unrest, strikes, government action, or transport
          disruptions.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>8. Limitation of Liability</h2>
        <p style={textStyle}>
          India Reisen acts as an intermediary arranging services provided by third parties (hotels,
          airlines, transport operators, local guides, and other suppliers). While we carefully select our
          partners, we are not liable for the acts, omissions, negligence, or default of these independent
          third-party suppliers, except where required by applicable law. Our liability for any claim
          relating to services we directly provide is limited to the amount paid to us for the relevant
          service.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>9. Health & Safety</h2>
        <p style={textStyle}>
          Travellers participating in adventure activities, wildlife safaris, or physically demanding
          itineraries do so at their own risk and should ensure they are medically fit to do so. Please
          inform us of any medical conditions, dietary requirements, or accessibility needs in advance so we
          can plan accordingly.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>10. Website Use & Intellectual Property</h2>
        <p style={textStyle}>
          All content on this website — including text, images, logos, and itinerary descriptions — is the
          property of India Reisen or its licensors and may not be copied, reproduced, or used commercially
          without our prior written consent.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>11. Governing Law</h2>
        <p style={textStyle}>
          These Terms are governed by the laws of India. Any disputes arising from these Terms or our
          services shall be subject to the exclusive jurisdiction of the courts of Uttar Pradesh, India.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>12. Changes to These Terms</h2>
        <p style={textStyle}>
          We may update these Terms periodically to reflect changes in our services or applicable law.
          Updates take effect once published on this page.
        </p>
      </div>

      <div style={{ ...sectionStyle, background: '#f9f9f9', padding: '25px', borderRadius: '10px', marginTop: '40px' }}>
        <h2 style={headingStyle}>13. Contact Us</h2>
        <p style={{ ...textStyle, marginBottom: '4px' }}><strong>India Reisen</strong></p>
        <p style={{ ...textStyle, marginBottom: '4px' }}>Noida, Uttar Pradesh, India</p>
        <p style={{ ...textStyle, marginBottom: '4px' }}>
          Website: <a href="https://www.reisenindia.com" style={{ color: primaryColor }}>www.reisenindia.com</a>
        </p>
        <p style={{ ...textStyle, marginBottom: '4px' }}>
          Email: <a href="mailto:team@indiareisen.com" style={{ color: primaryColor }}>team@indiareisen.com</a>
        </p>
        <p style={{ ...textStyle, marginBottom: 0 }}>
          Phone: <a href="tel:+919811041785" style={{ color: primaryColor }}>+91 98110 41785</a>
        </p>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { submitContactComplaint, isConvexConfigured } from '../lib/convexBackend'

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatusMessage('')

    try {
      if (!isConvexConfigured) {
        throw new Error('Backend is not configured yet')
      }

      const complaint = await submitContactComplaint({
        submittedBy: formData.email.trim().toLowerCase() || formData.name.trim(),
        category: 'other',
        description: `Contact form message from ${formData.name.trim()} (${formData.email.trim()}): ${formData.message.trim()}`
      })

      setStatusMessage(`Thanks, your message was sent to backend. Reference: ${complaint.referenceId}`)
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      setStatusMessage(
        `Unable to reach backend right now: ${error instanceof Error ? error.message : 'Unknown error'}. Please call +91-80-2843 7150.`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="contact-page">
      <section className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
        </div>
      </section>

      <section className="page-content">
        <div className="contact-container" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2>Mail Us</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="email">E-Mail:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                />
              </div>
              <button
                type="submit"
                className="btn"
                disabled={isSubmitting}
                style={{ backgroundColor: '#007bff', color: 'white', padding: '12px 30px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>

              {statusMessage && (
                <p style={{ marginTop: '12px', color: '#0b3556', fontWeight: 600 }}>
                  {statusMessage}
                </p>
              )}
            </form>
          </div>

          <div style={{ flex: 1, minWidth: '300px' }}>
            <h3>General</h3>
            <div className="contact-info" style={{ marginTop: '20px' }}>
              <p><strong>Campus:</strong></p>
              <p>No.14, Ramohalli Cross, Kumbalgodu,<br />
              Mysore Road, Bangalore-560 074</p>
              <p>Phone: +91-80-2843 7150, 9901559955</p>
              <p>Tele-Fax: +91-80-2843 7468</p>
              <p>Email: <a href="mailto:info@rrdch.org" style={{ color: '#007bff', textDecoration: 'none' }}>info@rrdch.org</a></p>
              <p><a href="mailto:admission@rrdch.org" style={{ color: '#007bff', textDecoration: 'none' }}>admission@rrdch.org</a></p>
              <p><a href="mailto:principalrrdch@gmail.com" style={{ color: '#007bff', textDecoration: 'none' }}>principalrrdch@gmail.com</a></p>

              <p style={{ marginTop: '20px' }}><strong>Head Office:</strong></p>
              <p>Moogambigai Charitable Trust<br />
              RajaRajeswari College of Engineering Campus<br />
              No.14, Ramohalli Cross<br />
              Kumbalgodu, Mysore Road<br />
              Bangalore-560 074<br />
              Karnataka</p>
              <p>Tel: +91-80-2843 7124, +91-80-6566 6769, +91-9901559955</p>
              <p>Fax: +91-80-2843 7373</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '40px' }}>
          <iframe
            width="100%"
            height="300"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src="https://maps.google.com/maps?q=RajaRajeswari+Dental+College&t=m&z=15&output=embed"
            title="RRDCH Map"
            style={{ border: 0 }}
          />
        </div>
      </section>
    </div>
  )
}

export default ContactUs

import React from 'react'

const Alumni: React.FC = () => {
  return (
    <div className="alumni-page">
      <section className="page-header">
        <div className="container">
          <h1>Alumni</h1>
        </div>
      </section>

      <section className="page-content">
        <div>
          <h2>Welcome to Your Alma Mater</h2>
          <p>RajaRajeswari Dental College & Hospital takes pride in its extensive network of successful alumni who have made significant contributions to the field of dentistry across the globe. Our graduates are working in prestigious institutions, running successful private practices, and contributing to dental research worldwide.</p>

          <h2>Alumni Association</h2>
          <p>The RRDCH Alumni Association serves as a bridge between the college and its graduates, fostering lifelong connections and professional growth. The association organizes regular meetings, continuing education programs, and networking events.</p>

          <h2>Benefits of Joining the Alumni Association</h2>
          <ul>
            <li><strong>Networking Opportunities:</strong> Connect with fellow alumni and expand your professional network</li>
            <li><strong>Continuing Education:</strong> Access to workshops, seminars, and CDE programs</li>
            <li><strong>Career Support:</strong> Job opportunities and career guidance</li>
            <li><strong>Research Collaboration:</strong> Opportunities for collaborative research projects</li>
            <li><strong>Library Access:</strong> Access to college digital library resources</li>
            <li><strong>Event Invitations:</strong> Invitations to college events, convocations, and celebrations</li>
            <li><strong>Mentorship:</strong> Opportunities to mentor current students</li>
          </ul>

          <h2>Notable Achievements</h2>
          <p>Our alumni have achieved remarkable success in various fields:</p>
            <ul>
            <li>Many have established successful dental practices across India and abroad</li>
            <li>Several are serving as faculty members in prestigious dental colleges</li>
            <li>Many have pursued and completed postgraduate specializations (MDS) in various dental disciplines</li>
            <li>Some have completed PhD programs and are contributing to dental research</li>
            <li>Alumni are working in government healthcare services and armed forces</li>
            <li>Many have received awards and recognition for their contributions to dentistry</li>
          </ul>

          <h2>Alumni Events</h2>
          <p>The college organizes regular alumni meets and events:</p>
          <ul>
            <li><strong>Annual Alumni Meet:</strong> A grand gathering of all alumni</li>
            <li><strong>Graduation Day:</strong> Alumni are invited to attend graduation ceremonies</li>
            <li><strong>CDE Programs:</strong> Special continuing dental education programs for alumni</li>
            <li><strong>Reunions:</strong> Batch-specific reunion events</li>
          </ul>

          <h2>Stay Connected</h2>
          <p>We encourage all our alumni to stay connected with the college and fellow graduates. Update your contact information with the alumni office to receive updates about events and opportunities.</p>

          <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd' }}>
            <h3 style={{ color: '#007bff' }}>Contact Alumni Association</h3>
            <p><strong>Email:</strong> alumni@rrdch.org</p>
            <p><strong>Phone:</strong> +91-80-2843 7150</p>
            <p><strong>Address:</strong> RajaRajeswari Dental College & Hospital, No.14, Ramohalli Cross, Kumbalgodu, Bengaluru - 560 074, Karnataka, India</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Alumni

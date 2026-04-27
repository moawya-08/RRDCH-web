import React from 'react'
import { Link } from 'react-router-dom'

const Courses: React.FC = () => {
  return (
    <div className="courses-page">
      <section className="page-header">
        <div className="container">
          <h1>Courses</h1>
        </div>
      </section>

      <section className="page-content">
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: '300px' }}>
            <h2>Our Programmes</h2>
            <p style={{ marginBottom: '30px' }}>RajaRajeswari Dental College & Hospital offers a range of dental education programmes at undergraduate, postgraduate, and doctoral levels.</p>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
                <h3 style={{ color: '#007bff' }}>BDS (Bachelor of Dental Surgery)</h3>
                <p>5 years undergraduate program including 1 year internship</p>
                <Link to="/bds" className="btn" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '4px', display: 'inline-block', marginTop: '10px' }}>View Details</Link>
              </div>

              <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
                <h3 style={{ color: '#007bff' }}>MDS (Master of Dental Surgery)</h3>
                <p>3 years postgraduate program in all specialties of Dental Surgery</p>
                <Link to="/mds" className="btn" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '4px', display: 'inline-block', marginTop: '10px' }}>View Details</Link>
              </div>

              <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
                <h3 style={{ color: '#007bff' }}>Ph.D</h3>
                <p>Doctoral program in Orthodontics and Periodontology</p>
                <Link to="/phd" className="btn" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '4px', display: 'inline-block', marginTop: '10px' }}>View Details</Link>
              </div>

              <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
                <h3 style={{ color: '#007bff' }}>Certificate Course in Implantology</h3>
                <p>Specialized certificate program in dental implantology</p>
                <Link to="/certificate-course-in-implantology" className="btn" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '4px', display: 'inline-block', marginTop: '10px' }}>View Details</Link>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '250px' }}>
            <h3>Programmes</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '15px' }}>
                <Link to="/bds" style={{ color: '#007bff', textDecoration: 'none', fontSize: '16px' }}>BDS</Link>
              </li>
              <li style={{ marginBottom: '15px' }}>
                <Link to="/certificate-course-in-implantology" style={{ color: '#007bff', textDecoration: 'none', fontSize: '16px' }}>Certificate Course in Implantology</Link>
              </li>
              <li style={{ marginBottom: '15px' }}>
                <Link to="/mds" style={{ color: '#007bff', textDecoration: 'none', fontSize: '16px' }}>MDS</Link>
              </li>
              <li style={{ marginBottom: '15px' }}>
                <Link to="/phd" style={{ color: '#007bff', textDecoration: 'none', fontSize: '16px' }}>Ph.D</Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Courses

import React from 'react'
import { Link } from 'react-router-dom'

const Facilities: React.FC = () => {
  return (
    <div className="facilities-page">
      <section className="page-header">
        <div className="container">
          <h1>Facilities</h1>
        </div>
      </section>

      <section className="page-content">
        <div>
          <h2>Campus Overview</h2>
          <p>RajaRajeswari Dental College & Hospital is situated on a sprawling 5-acre campus on the Bangalore-Mysore Highway, 19 km from Vidhana Soudha. The lush green campus features 4 lakh sq. feet of modern buildings housing the Dental Institute, 10 specialty dental clinics, supporting labs, classrooms, and residential accommodation for staff and students.</p>

          <h2>Dental Hospital Facilities</h2>
          <ul>
            <li><strong>250 Modern Dental Units/Chairs</strong> across all departments</li>
            <li><strong>Daily Patient Load:</strong> 450-500 patients</li>
            <li><strong>10 Specialty Dental Clinics</strong> with advanced equipment</li>
            <li><strong>Well-equipped Laboratories</strong> for practical training</li>
            <li><strong>Digital X-ray Facilities</strong> including CBCT</li>
            <li><strong>Sterilization Center</strong> following international standards</li>
            <li><strong>Pharmacy</strong> within the campus</li>
          </ul>

          <h2>Academic Facilities</h2>
          <ul>
            <li><strong>Spacious Classrooms</strong> with audio-visual aids</li>
            <li><strong>Digital Library</strong> with access to online journals and e-books</li>
            <li><strong>Seminar Halls</strong> for presentations and discussions</li>
            <li><strong>Auditorium</strong> with seating capacity for large events</li>
            <li><strong>Pre-clinical Laboratories</strong> for hands-on training</li>
            <li><strong>Research Laboratories</strong> for advanced research</li>
          </ul>

          <h2>Student Amenities</h2>
          <ul>
            <li><strong>Hostel Accommodation</strong> for boys and girls</li>
            <li><strong>Cafeteria</strong> serving hygienic food</li>
            <li><strong>Gymnasium</strong> for physical fitness</li>
            <li><strong>Sports & Recreation</strong> facilities</li>
            <li><strong>Transportation</strong> services</li>
            <li><strong>24/7 Medical Services</strong> on campus</li>
          </ul>

          <h2>Additional Facilities</h2>
          <ul>
            <li><strong>1000-bedded Medical College Hospital</strong> for medical training</li>
            <li><strong>Wi-Fi Campus</strong> with internet connectivity</li>
            <li><strong>Banking Services</strong> on campus</li>
            <li><strong>ATM Facility</strong></li>
            <li><strong>Security Services</strong> round the clock</li>
          </ul>

          <h2>Explore Our Facilities</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
            <Link to="/auditorium" className="btn" style={{ display: 'block', padding: '20px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', textDecoration: 'none', color: '#333', textAlign: 'center' }}>
              <h3 style={{ color: '#007bff', marginBottom: '10px' }}>Auditorium</h3>
              <p>Modern auditorium for events and programs</p>
            </Link>

            <Link to="/cafeteria" className="btn" style={{ display: 'block', padding: '20px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', textDecoration: 'none', color: '#333', textAlign: 'center' }}>
              <h3 style={{ color: '#007bff', marginBottom: '10px' }}>Cafeteria</h3>
              <p>Hygienic food services for students and staff</p>
            </Link>

            <Link to="/classroom" className="btn" style={{ display: 'block', padding: '20px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', textDecoration: 'none', color: '#333', textAlign: 'center' }}>
              <h3 style={{ color: '#007bff', marginBottom: '10px' }}>Classrooms</h3>
              <p>Well-equipped classrooms with modern amenities</p>
            </Link>

            <Link to="/digital-library" className="btn" style={{ display: 'block', padding: '20px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', textDecoration: 'none', color: '#333', textAlign: 'center' }}>
              <h3 style={{ color: '#007bff', marginBottom: '10px' }}>Digital Library</h3>
              <p>Extensive digital resources and e-books</p>
            </Link>

            <Link to="/gymnasium" className="btn" style={{ display: 'block', padding: '20px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', textDecoration: 'none', color: '#333', textAlign: 'center' }}>
              <h3 style={{ color: '#007bff', marginBottom: '10px' }}>Gymnasium</h3>
              <p>Fitness center for physical well-being</p>
            </Link>

            <Link to="/hostel" className="btn" style={{ display: 'block', padding: '20px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', textDecoration: 'none', color: '#333', textAlign: 'center' }}>
              <h3 style={{ color: '#007bff', marginBottom: '10px' }}>Hostel</h3>
              <p>Comfortable accommodation for students</p>
            </Link>

            <Link to="/sports-recreation" className="btn" style={{ display: 'block', padding: '20px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', textDecoration: 'none', color: '#333', textAlign: 'center' }}>
              <h3 style={{ color: '#007bff', marginBottom: '10px' }}>Sports & Recreation</h3>
              <p>Facilities for sports and recreational activities</p>
            </Link>

            <Link to="/transportation" className="btn" style={{ display: 'block', padding: '20px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', textDecoration: 'none', color: '#333', textAlign: 'center' }}>
              <h3 style={{ color: '#007bff', marginBottom: '10px' }}>Transportation</h3>
              <p>Transport services for students and staff</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Facilities

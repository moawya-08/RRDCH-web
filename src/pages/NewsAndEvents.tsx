import React from 'react'

const NewsAndEvents: React.FC = () => {
  const newsItems = [
    {
      title: 'Admission Open for 2026-27',
      date: 'January 2026',
      category: 'Admissions',
      description: 'Applications are invited for BDS, MDS, PhD, and Certificate Course in Implantology for the academic year 2026-27.'
    },
    {
      title: 'Ph.D Entrance Exam Notification',
      date: 'March 2025',
      category: 'Academic',
      description: 'Ph.D Entrance Examination notification released. Interested candidates can apply for PhD programs in Orthodontics and Periodontology.'
    },
    {
      title: 'Certificate Course in Implantology',
      date: 'July 2025',
      category: 'Courses',
      description: 'Applications invited for Certificate Course in Implantology 2026-27. Send your application to pgrrdc@gmail.com'
    },
    {
      title: '19th Graduation Day',
      date: 'Recent',
      category: 'Events',
      description: 'The 19th Graduation Day ceremony was held successfully, celebrating the achievements of our graduating students.'
    },
    {
      title: 'Blood Donation Camp',
      date: 'Recent',
      category: 'Community Service',
      description: 'RRDCH organized a successful blood donation camp as part of our community service initiative.'
    },
    {
      title: 'World Oral Health Day Celebrations',
      date: 'March 2025',
      category: 'Events',
      description: 'College celebrated World Oral Health Day with various awareness programs and free dental checkup camps.'
    },
  ]

  return (
    <div className="news-events-page">
      <section className="page-header">
        <div className="container">
          <h1>News and Events</h1>
        </div>
      </section>

      <section className="page-content">
        <div>
          <h2>Latest Updates</h2>
          <p>Stay informed about the latest news, events, and announcements from RajaRajeswari Dental College & Hospital.</p>

          <div style={{ display: 'grid', gap: '25px', marginTop: '30px' }}>
            {newsItems.map((item, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '25px',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '5px 12px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      fontSize: '12px',
                      borderRadius: '4px',
                      fontWeight: '600',
                    }}
                  >
                    {item.category}
                  </span>
                  <span style={{ color: '#666', fontSize: '14px' }}>{item.date}</span>
                </div>
                <h3 style={{ fontSize: '22px', marginBottom: '12px', color: '#333' }}>{item.title}</h3>
                <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.6' }}>{item.description}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '40px' }}>
            <h2>Upcoming Events</h2>
            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd', marginTop: '20px' }}>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #e0e0e0' }}>
                  <strong style={{ color: '#007bff' }}>Annual Sports Meet</strong>
                  <p style={{ margin: '5px 0 0 0', color: '#666' }}>Inter-department sports competition</p>
                </li>
                <li style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #e0e0e0' }}>
                  <strong style={{ color: '#007bff' }}>CDE Program</strong>
                  <p style={{ margin: '5px 0 0 0', color: '#666' }}>Continuing Dental Education program on recent advances</p>
                </li>
                <li style={{ marginBottom: '0' }}>
                  <strong style={{ color: '#007bff' }}>Alumni Meet</strong>
                  <p style={{ margin: '5px 0 0 0', color: '#666' }}>Annual alumni gathering and networking event</p>
                </li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', border: '1px solid #bbdefb' }}>
            <h3 style={{ color: '#007bff', marginBottom: '10px' }}>Subscribe to Updates</h3>
            <p>Stay updated with the latest news and events by subscribing to our newsletter. Contact us at info@rrdch.org to be added to our mailing list.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default NewsAndEvents

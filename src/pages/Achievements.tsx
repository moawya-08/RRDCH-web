import React from 'react'

const Achievements: React.FC = () => {
  const achievements = [
    {
      title: 'NAAC A Accreditation',
      year: '2021',
      category: 'Institutional',
      description: 'RajaRajeswari Dental College & Hospital has been accredited with A Grade by the National Assessment and Accreditation Council (NAAC).'
    },
    {
      title: 'NABH Accreditation',
      year: '2021',
      category: 'Healthcare Quality',
      description: 'The college hospital has received NABH accreditation for maintaining high standards of healthcare quality and patient safety.'
    },
    {
      title: 'ISO Certification',
      year: '2025',
      category: 'Quality Management',
      description: 'RRDCH has been awarded ISO certification for its quality management systems.'
    },
    {
      title: 'RCPS Recognition',
      year: '2021',
      category: 'International',
      description: 'Recognized by Royal College of Physicians and Surgeons of Glasgow, UK for Part 1 & 2 MFDS Examinations.'
    },
    {
      title: 'SLMC Recognition',
      year: '2021',
      category: 'International',
      description: 'Recognized by Sri Lanka Medical Council for dental education programs.'
    },
    {
      title: 'IAO Accreditation',
      year: '2021',
      category: 'International',
      description: 'Accredited by International Accreditation Organization for maintaining global education standards.'
    },
    {
      title: 'DCI Recognition',
      year: '1992',
      category: 'Regulatory',
      description: 'Recognized by Dental Council of India since establishment for BDS and MDS programs.'
    },
    {
      title: 'RGUHS Affiliation',
      year: '1992',
      category: 'Academic',
      description: 'Permanently affiliated to Rajiv Gandhi University of Health Sciences, Karnataka.'
    },
  ]

  return (
    <div className="achievements-page">
      <section className="page-header">
        <div className="container">
          <h1>Achievements</h1>
        </div>
      </section>

      <section className="page-content">
        <div>
          <h2>Our Milestones</h2>
          <p>RajaRajeswari Dental College & Hospital has achieved numerous milestones in dental education, healthcare quality, and institutional excellence over the years.</p>

          <div style={{ display: 'grid', gap: '25px', marginTop: '30px' }}>
            {achievements.map((achievement, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '25px',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  borderLeft: '4px solid #007bff',
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
                    {achievement.category}
                  </span>
                  <span style={{ color: '#666', fontSize: '14px', fontWeight: '600' }}>{achievement.year}</span>
                </div>
                <h3 style={{ fontSize: '22px', marginBottom: '12px', color: '#333' }}>{achievement.title}</h3>
                <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.6' }}>{achievement.description}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '40px', padding: '25px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd' }}>
            <h3 style={{ color: '#007bff', marginBottom: '15px' }}>Academic Excellence</h3>
            <ul>
              <li><strong>100% Pass Rate</strong> in university examinations consistently</li>
              <li><strong>University Ranks</strong> secured by our students regularly</li>
              <li><strong>Research Publications</strong> in national and international journals</li>
              <li><strong>Conference Presentations</strong> at national and international levels</li>
              <li><strong>Best Paper Awards</strong> won by our faculty and students</li>
            </ul>
          </div>

          <div style={{ marginTop: '30px', padding: '25px', backgroundColor: '#e3f2fd', borderRadius: '8px', border: '1px solid #bbdefb' }}>
            <h3 style={{ color: '#007bff', marginBottom: '15px' }}>Community Service</h3>
            <ul>
              <li>Regular <strong>Free Dental Camps</strong> in rural areas</li>
              <li><strong>Blood Donation Camps</strong> organized annually</li>
              <li><strong>Oral Health Awareness</strong> programs in schools and communities</li>
              <li><strong>Tobacco Cessation</strong> campaigns and counseling</li>
              <li><strong>NSS Activities</strong> for community development</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Achievements

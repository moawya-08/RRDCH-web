import React from 'react'

const PhotoGallery: React.FC = () => {
  const galleryImages = [
    { category: 'Events', title: 'Graduation Day 2024', description: '19th Graduation Day ceremony' },
    { category: 'Events', title: 'Cultural Programs', description: 'Annual cultural celebrations' },
    { category: 'Facilities', title: 'Campus View', description: 'Beautiful 5-acre campus' },
    { category: 'Facilities', title: 'Dental Hospital', description: 'Modern dental clinics' },
    { category: 'Academics', title: 'Clinical Training', description: 'Students learning clinical skills' },
    { category: 'Academics', title: 'Research Work', description: 'Research presentations' },
    { category: 'Events', title: 'Blood Donation Camp', description: 'Community service initiative' },
    { category: 'Events', title: 'Oral Health Day', description: 'World Oral Health Day celebrations' },
    { category: 'Facilities', title: 'Library', description: 'Digital library facilities' },
    { category: 'Facilities', title: 'Auditorium', description: 'State-of-the-art auditorium' },
    { category: 'Events', title: 'Sports Day', description: 'Annual sports meet' },
    { category: 'Academics', title: 'Lecture Hall', description: 'Modern classrooms' },
  ]

  return (
    <div className="photo-gallery-page">
      <section className="page-header">
        <div className="container">
          <h1>Photo Gallery</h1>
        </div>
      </section>

      <section className="page-content">
        <div>
          <h2>College Events & Facilities</h2>
          <p>Explore our collection of photographs showcasing the vibrant campus life, events, and facilities at RajaRajeswari Dental College & Hospital.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px', marginTop: '30px' }}>
            {galleryImages.map((image, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#f8f9fa',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <div
                  style={{
                    height: '200px',
                    backgroundColor: '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    fontSize: '14px',
                  }}
                >
                  <img
                    src={`https://via.placeholder.com/400x300?text=${encodeURIComponent(image.title)}`}
                    alt={image.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '15px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      fontSize: '12px',
                      borderRadius: '4px',
                      marginBottom: '10px',
                    }}
                  >
                    {image.category}
                  </span>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#333' }}>{image.title}</h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>{image.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd' }}>
            <h3 style={{ color: '#007bff' }}>More Photos Coming Soon</h3>
            <p>We are continuously updating our photo gallery with new images from recent events and activities. Check back regularly for the latest updates from RRDCH.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PhotoGallery

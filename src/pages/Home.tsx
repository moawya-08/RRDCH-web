import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const sliderImages = [
  {
    src: 'https://www.rrdch.org/rrdch/wp-content/uploads/2025/04/University-Rank-holders-banner.jpg',
    alt: 'University Rank Holders'
  },
  {
    src: 'https://www.rrdch.org/rrdch/wp-content/uploads/2025/01/rrdch-slider-Dr-A-C-1.jpg',
    alt: 'RRDCH Slider'
  },
  {
    src: 'https://www.rrdch.org/rrdch/wp-content/uploads/2024/04/Slider-12.jpg',
    alt: 'Slider 12'
  },
  {
    src: 'https://www.rrdch.org/rrdch/wp-content/uploads/2024/04/im11.jpg',
    alt: 'Campus showcase 11'
  },
  {
    src: 'https://www.rrdch.org/rrdch/wp-content/uploads/2024/04/im10.jpg',
    alt: 'Campus showcase 10'
  },
  {
    src: 'https://www.rrdch.org/rrdch/wp-content/uploads/2024/04/slider_9-1.jpg',
    alt: 'Campus showcase 9'
  },
  {
    src: 'https://www.rrdch.org/rrdch/wp-content/uploads/2024/04/slider_8-1.jpg',
    alt: 'Campus showcase 8'
  },
  {
    src: 'https://www.rrdch.org/rrdch/wp-content/uploads/2024/04/slider_7.jpg',
    alt: 'Campus showcase 7'
  },
  {
    src: 'https://www.rrdch.org/rrdch/wp-content/uploads/2024/04/slider_6.jpg',
    alt: 'Campus showcase 6'
  },
  {
    src: 'https://www.rrdch.org/rrdch/wp-content/uploads/2024/04/slider_5.jpg',
    alt: 'Campus showcase 5'
  },
  {
    src: 'https://www.rrdch.org/rrdch/wp-content/uploads/2024/04/slider_4.jpg',
    alt: 'Campus showcase 4'
  },
  {
    src: 'https://www.rrdch.org/rrdch/wp-content/uploads/2024/04/slider_3.jpg',
    alt: 'Campus showcase 3'
  },
  {
    src: 'https://www.rrdch.org/rrdch/wp-content/uploads/2024/04/slider_2.jpg',
    alt: 'Campus showcase 2'
  },
  {
    src: 'https://www.rrdch.org/rrdch/wp-content/uploads/2024/04/slider_1.jpg',
    alt: 'Campus showcase 1'
  }
]

const spotlightCards = [
  {
    key: 'home.spotlight.chairman',
    title: "Chairman's Desk",
    image: '/chairman-photo.jpg',
    description:
      'It is my pleasure to congratulate you on your enrolling yourself as a student in our group of institutions, which are well known for the discipline, quality education and personality development. Our Students ...',
    to: '/chairmans-desk'
  },
  {
    key: 'home.spotlight.college',
    title: 'College',
    image: '/college-photo.webp',
    description:
      'Rajarajeswari Dental College & Hospital was established in the year 1992 with just 40 admissions in BDS course. The college is recognized by DCI, Govt. of Karnataka and Govt. of India...',
    to: '/about-us'
  },
  {
    key: 'home.spotlight.hospital',
    title: 'Hospital',
    image: '/hospital-photo.jpg',
    description:
      'Dental clinics in all departments have 250 modern dental units / chairs. An average 450 to 500 patients are treated in these clinics daily. Each department is staffed with more than required number of full time...',
    to: '/about-us'
  }
]

const quickFacts = [
  { value: '1992', key: 'home.fact.established', label: 'Established' },
  { value: '100', key: 'home.fact.bdsAdmissions', label: 'BDS admissions' },
  { value: '250', key: 'home.fact.modernUnits', label: 'Modern dental units / chairs' },
  { value: '450-500', key: 'home.fact.patients', label: 'Patients treated daily' }
]

const programmeLinks = [
  { key: 'nav.bds', label: 'BDS', to: '/bds' },
  { key: 'nav.mds', label: 'MDS', to: '/mds' },
  { key: 'nav.phd', label: 'Ph.D', to: '/phd' },
  { key: 'home.programme.certificate', label: 'Certificate', to: '/certificate-course-in-implantology' }
]

const announcementLinks = [
  {
    key: 'home.announcement.implantology',
    label:
      'Application are invited from eligible candidates for Certificate Course in Implantology 2026-27, Interested candidates send your application to: pgrrdc@gmail.com',
    href: 'mailto:pgrrdc@gmail.com'
  },
  {
    key: 'home.announcement.phd',
    label: 'Ph.D Entrance Exam Notification',
    href: 'https://www.rrdch.org/rrdch/wp-content/uploads/2025/03/Ph.D-Entrance-Exam-Notification.pdf'
  },
  {
    key: 'home.announcement.admission',
    label: 'Admission Enquiry for 2026-27',
    href: 'https://www.rrdch.org/dental-admissions-bds-mds-phd-Implantology-certicate-courses/'
  }
]

const Home: React.FC = () => {
  const { t } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % sliderImages.length)
    }, 4500)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="home-page">
      <section className="home-hero-section cinematic-hero">
        <div className="cinematic-frame">
          {sliderImages.map((slide, index) => (
            <figure key={slide.src} className={`cinematic-slide ${index === currentSlide ? 'is-active' : ''}`} aria-hidden={index !== currentSlide}>
              <img src={slide.src} alt={slide.alt} />
            </figure>
          ))}

          <div className="cinematic-controls" aria-label="Home slider controls">
            <button
              type="button"
              onClick={() => setCurrentSlide((currentSlide - 1 + sliderImages.length) % sliderImages.length)}
              aria-label="Previous slide"
            >
              &larr;
            </button>
            <button type="button" onClick={() => setCurrentSlide((currentSlide + 1) % sliderImages.length)} aria-label="Next slide">
              &rarr;
            </button>
          </div>
        </div>
      </section>

      <section className="home-highlights-section">
        <div className="container highlights-card">
          <div className="section-heading">
            <p className="eyebrow">{t('home.highlightsEyebrow', 'Admissions & Highlights')}</p>
            <h2>{t('home.highlightsTitle', 'Admissions, highlights and programme information.')}</h2>
          </div>

          <div className="highlight-links-grid">
            {announcementLinks.map((link) => (
              <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                {t(link.key, link.label)}
              </a>
            ))}
          </div>

          <div className="quick-facts-grid">
            {quickFacts.map((fact) => (
              <div key={fact.label} className="quick-fact-card">
                <strong>{fact.value}</strong>
                <span>{t(fact.key, fact.label)}</span>
              </div>
            ))}
          </div>

          <div className="programme-links">
            {programmeLinks.map((programme) => (
              <Link key={programme.label} to={programme.to}>
                {t(programme.key, programme.label)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-spotlights-section">
        <div className="container section-heading">
          <p className="eyebrow">{t('home.snapshotEyebrow', 'Institution Snapshot')}</p>
          <h2>{t('home.snapshotTitle', "Chairman's Desk, College and Hospital.")}</h2>
        </div>

        <div className="container spotlight-grid">
          {spotlightCards.map((card) => (
            <article key={card.title} className="spotlight-card">
              <img src={card.image} alt={card.title} />
              <div className="spotlight-content">
                <h3>{t(card.key, card.title)}</h3>
                <p>{card.description}</p>
                <Link className="spotlight-link" to={card.to}>
                  {t('home.readMore', 'Read More')}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="virtual-tour-section">
        <div className="container virtual-tour-card">
          <div className="section-heading">
            <p className="eyebrow">{t('home.tourEyebrow', 'Campus Tour')}</p>
            <h2>{t('home.tourTitle', 'Explore the RRDCH campus virtual tour.')}</h2>
          </div>

          <div className="virtual-tour-frame">
            <iframe
              allowFullScreen
              src="https://www.easytourz.com/BT-EmabedTour/all/2e6200684201ca03"
              title="RRDCH Campus Tour"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

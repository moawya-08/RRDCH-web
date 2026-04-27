import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../context/LanguageContext'

type NavChild = {
  key: string
  label: string
  to?: string
  href?: string
  external?: boolean
  description?: string
}

type NavItem = {
  key: string
  label: string
  to?: string
  href?: string
  external?: boolean
  children?: NavChild[]
}

type SearchEntry = {
  label: string
  to: string
}

type IconName = 'search' | 'globe' | 'calendar' | 'phone' | 'mail'

const utilityLinks = [
  { label: 'ESI', href: 'https://www.rrdch.org/e-s-i/' },
  { label: 'NAAC', href: 'https://www.rrdch.org/accreditation/naac/' },
  { label: 'NIRF', href: 'https://www.rrdch.org/nirf/' },
  { label: 'Circulars', href: 'https://www.rrdch.org/circulars/' },
  { label: 'Feedback', href: 'https://www.rrdch.org/feedback/' }
]

const navigation: NavItem[] = [
  { key: 'nav.home', label: 'Home', to: '/' },
  {
    key: 'nav.aboutUs',
    label: 'About Us',
    to: '/about-us',
    children: [
      { key: 'nav.trust', label: 'Trust', to: '/trust' },
      { key: 'nav.management', label: 'Management', to: '/management' },
      { key: 'nav.governingCouncil', label: 'Governing Council', to: '/governing-council' },
      { key: 'nav.visionMission', label: 'Vision & Mission', to: '/about-us' }
    ]
  },
  {
    key: 'nav.coursesOffered',
    label: 'Courses Offered',
    to: '/courses',
    children: [
      { key: 'nav.bds', label: 'Bachelor of Dental Surgery (BDS)', to: '/bds' },
      { key: 'nav.mds', label: 'Master of Dental Surgery (MDS)', to: '/mds' },
      { key: 'nav.phd', label: 'Ph.D', to: '/phd' },
      { key: 'nav.certificateCourse', label: 'Certificate Course', to: '/certificate-course-in-implantology' }
    ]
  },
  {
    key: 'nav.department',
    label: 'Department',
    children: [
      {
        key: 'nav.oralMedicineRadiology',
        label: 'Oral Medicine & Radiology',
        to: '/departments/oral-medicine-radiology',
        description: 'Preliminary investigation and diagnosis of dental issues, oral lesions and systemic diseases with oral manifestations.'
      },
      {
        key: 'nav.prostheticsCrownBridge',
        label: 'Prosthetics & Crown & Bridge',
        to: '/departments/prosthetics-crown-bridge',
        description: 'Replacement of missing teeth and associated oral structures to restore function, support and facial form.'
      },
      {
        key: 'nav.oralMaxillofacialSurgery',
        label: 'Oral & Maxillofacial Surgery',
        to: '/departments/oral-maxillofacial-surgery',
        description: 'Surgical care for jaw and facial conditions including fractures, congenital issues, cancers and major maxillofacial cases.'
      },
      {
        key: 'nav.periodontologyDept',
        label: 'Periodontology',
        to: '/departments/periodontology',
        description: 'Management of gum and periodontal disease with training in scaling, root planing, splinting and periodontal surgeries.'
      },
      {
        key: 'nav.pedodonticsPreventiveDentistry',
        label: 'Pedodontics & Preventive Dentistry',
        to: '/departments/pedodontics-preventive-dentistry',
        description: 'Child-focused preventive dental care using fluorides, sealants and habit correction to reduce caries and malocclusion risk.'
      },
      {
        key: 'nav.conservativeDentistryEndodontics',
        label: 'Conservative Dentistry & Endodontics',
        to: '/departments/conservative-dentistry-endodontics',
        description: 'Restorative and endodontic care including root canal treatment, endodontic surgery and aesthetic restorations.'
      },
      {
        key: 'nav.orthodonticsDentofacialOrthopedics',
        label: 'Orthodontics & Dentofacial Orthopedics',
        to: '/departments/orthodontics-dentofacial-orthopedics',
        description: 'Correction of jaw and tooth alignment using removable appliances, fixed braces, aligners and surgical orthodontics.'
      },
      {
        key: 'nav.publicHealthDentistryDept',
        label: 'Public Health Dentistry',
        to: '/departments/public-health-dentistry',
        description: 'Community-oriented oral healthcare through outreach camps, satellite centres, education and referral support.'
      },
      {
        key: 'nav.oralMaxillofacialPathology',
        label: 'Oral & Maxillofacial Pathology',
        to: '/departments/oral-maxillofacial-pathology',
        description: 'Study and diagnosis of diseases affecting oral and maxillofacial tissues through laboratory and histopathology work.'
      },
      {
        key: 'nav.implantologyDept',
        label: 'Implantology',
        to: '/departments/implantology',
        description: 'Advanced implant-based permanent tooth replacement supported by specialist teams and a one-year certificate programme.'
      },
      {
        key: 'nav.researchPublication',
        label: 'Research & Publication',
        to: '/departments/research-publication',
        description: 'Institution-wide research support with active projects, Real Time PCR facilities and indexed scientific publishing.'
      },
      {
        key: 'nav.orofacialPain',
        label: 'Orofacial Pain',
        to: '/departments/orofacial-pain',
        description: 'Focused care for orofacial pain and temporomandibular dysfunction, including migraine-related facial pain cases.'
      }
    ]
  },
  {
    key: 'nav.academics',
    label: 'Academics',
    children: [
      { key: 'nav.admissionEnquiry', label: 'Admission Enquiry', to: '/make-enquiry' },
      { key: 'nav.achievements', label: 'Achievements', to: '/achievements' },
      { key: 'nav.extraCurricular', label: 'Extra Curricular Activities', to: '/extra-curricular-activities' },
      { key: 'nav.feedback', label: 'Feedback', to: '/feedback' },
      { key: 'nav.calendar', label: 'Calendar of Events', to: '/calendar-of-events' },
      { key: 'nav.timeTable', label: 'Time Table', to: '/time-table' }
    ]
  },
  {
    key: 'nav.facilities',
    label: 'Facilities',
    to: '/facilities',
    children: [
      { key: 'nav.auditorium', label: 'Auditorium', to: '/auditorium' },
      { key: 'nav.cafeteria', label: 'Cafeteria', to: '/cafeteria' },
      { key: 'nav.classroom', label: 'Classroom', to: '/classroom' },
      { key: 'nav.digitalLibrary', label: 'Digital Library', to: '/digital-library' },
      { key: 'nav.gymnasium', label: 'Gymnasium', to: '/gymnasium' },
      { key: 'nav.hostel', label: 'Hostel', to: '/hostel' },
      { key: 'nav.sportsRecreation', label: 'Sports & Recreation', to: '/sports-recreation' },
      { key: 'nav.transportation', label: 'Transportation', to: '/transportation' }
    ]
  },
  {
    key: 'nav.gallery',
    label: 'Gallery',
    children: [
      { key: 'nav.photoGallery', label: 'Photo Gallery', to: '/photo-gallery' },
      { key: 'nav.videoGallery', label: 'Video Gallery', to: '/video-gallery' }
    ]
  },
  { key: 'nav.newsEvents', label: 'News & Events', to: '/news-and-events' },
  { key: 'nav.alumni', label: 'Alumni', to: '/alumni' },
  { key: 'nav.contactUs', label: 'Contact Us', to: '/contact-us' }
]

const Icon = ({ name }: { name: IconName }) => {
  switch (name) {
    case 'search':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10.5 4a6.5 6.5 0 1 0 4 11.6l4.5 4.5 1.4-1.4-4.5-4.5A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" fill="currentColor" />
        </svg>
      )
    case 'globe':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm6.9 9h-3.1a15.9 15.9 0 0 0-1.4-5 8 8 0 0 1 4.5 5ZM12 4.1c.9 1.1 1.7 3.1 2 5.9h-4c.3-2.8 1.1-4.8 2-5.9ZM4.1 13h3.1a15.9 15.9 0 0 0 1.4 5 8 8 0 0 1-4.5-5Zm3.1-2H4.1a8 8 0 0 1 4.5-5 15.9 15.9 0 0 0-1.4 5Zm2 0h5.6c-.1 1-.2 2-.2 3s.1 2 .2 3H9.2c.1-1 .2-2 .2-3s-.1-2-.2-3Zm.8 8h4c-.3 2.8-1.1 4.8-2 5.9-.9-1.1-1.7-3.1-2-5.9Zm4.4-1a15.9 15.9 0 0 0 1.4-5h3.1a8 8 0 0 1-4.5 5Z" fill="currentColor" />
        </svg>
      )
    case 'calendar':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 2h2v3H7V2Zm8 0h2v3h-2V2ZM4 5h16a1 1 0 0 1 1 1v13a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a1 1 0 0 1 1-1Zm1 5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9H5Zm3 3h3v3H8v-3Z" fill="currentColor" />
        </svg>
      )
    case 'phone':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6.6 2h3.3c.5 0 .9.3 1 .8l.7 3.4c.1.4 0 .8-.3 1.1L9.5 9.2a13.3 13.3 0 0 0 5.3 5.3l1.9-1.8c.3-.3.7-.4 1.1-.3l3.4.7c.5.1.8.5.8 1v3.3c0 .6-.4 1-1 1C10.5 22 2 13.5 2 3c0-.6.4-1 1-1h3.6Z" fill="currentColor" />
        </svg>
      )
    case 'mail':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.2l9 5.4 9-5.4V7H3Zm18 10V9.6l-8.5 5.1a1 1 0 0 1-1 0L3 9.6V17h18Z" fill="currentColor" />
        </svg>
      )
  }
}

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { language, setLanguage, t } = useLanguage()
  const { user, loading: authLoading, isAuthenticated, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [signingOut, setSigningOut] = useState(false)

  const patientName = user?.name?.trim() || user?.phone || user?.email?.split('@')[0] || 'Patient'

  const searchEntries = useMemo<SearchEntry[]>(
    () => [
      ...navigation.flatMap((item) => {
        const entries: SearchEntry[] = []

        if (item.to) {
          entries.push({ label: t(item.key, item.label), to: item.to })
        }

        if (item.children) {
          entries.push(
            ...item.children
              .filter((child): child is NavChild & { to: string } => Boolean(child.to))
              .map((child) => ({ label: t(child.key, child.label), to: child.to }))
          )
        }

        return entries
      }),
      { label: t('home.spotlight.chairman', "Chairman's Desk"), to: '/chairmans-desk' }
    ],
    [t]
  )

  const searchMatches = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return searchEntries.slice(0, 8)
    }

    return searchEntries.filter((entry) => entry.label.toLowerCase().includes(query)).slice(0, 8)
  }, [searchQuery])

  const closeMenus = () => {
    setMobileMenuOpen(false)
    setOpenDropdown(null)
    setSearchOpen(false)
  }

  const toggleDropdown = (label: string) => {
    setOpenDropdown((current) => (current === label ? null : label))
  }

  const handleSearchNavigate = (to: string) => {
    navigate(to)
    setSearchQuery('')
    setSearchOpen(false)
    closeMenus()
  }

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (searchMatches.length > 0) {
      handleSearchNavigate(searchMatches[0].to)
    }
  }

  const handleSignOut = async () => {
    setSigningOut(true)

    try {
      await signOut()
      closeMenus()

      if (location.pathname === '/book-appointment') {
        navigate('/', { replace: true })
      }
    } finally {
      setSigningOut(false)
    }
  }

  const renderNavDestination = (entry: NavItem | NavChild, className: string, content: ReactNode, onNavigate?: () => void) => {
    if (entry.to) {
      return (
        <Link className={className} to={entry.to} onClick={onNavigate}>
          {content}
        </Link>
      )
    }

    if (entry.href) {
      return (
        <a
          className={className}
          href={entry.href}
          target={entry.external ? '_blank' : undefined}
          rel={entry.external ? 'noreferrer' : undefined}
          onClick={onNavigate}
        >
          {content}
        </a>
      )
    }

    return <span className={`${className} nav-link-label`}>{content}</span>
  }

  return (
    <>
      <header className="site-header">
      <div className="header-utility">
        <div className="container header-utility-inner">
          <div className="utility-contact-links" aria-label="RRDCH quick call numbers">
            <a className="utility-call-link" href="tel:+918028437150">
              +91-80-2843 7150
            </a>
            <a className="utility-call-link" href="tel:+919901559955">
              9901559955
            </a>
          </div>

          <div className="utility-links" aria-label="RRDCH utility links">
            {utilityLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="header-brand">
        <div className="container header-brand-inner">
          <Link className="brand-lockup" to="/" onClick={closeMenus}>
            <div className="brand-logo-wrap">
              <img
                src="/rrdch-logo-clean.png"
                alt="RajaRajeswari Dental College and Hospital"
              />
            </div>

            <div className="brand-copy">
                <p className="brand-kicker">{t('header.city', 'Bangalore, Karnataka')}</p>
                <h1>{t('header.title', 'RajaRajeswari Dental College & Hospital')}</h1>
                <p className="brand-subtitle">
                  {t('header.subtitle', 'Recognised by Royal College of Physicians and Surgeons of Glasgow, UK for part 1 & 2 MFDS Examinations')}
                </p>
            </div>
          </Link>

          <div className="header-side-panel">
            <section className="header-account-panel" aria-live="polite" aria-label="Patient account">
              <div className="portal-account-head">
                <span className="portal-account-mark">+</span>
                <p className="header-account-title">Patient Portal</p>
              </div>

              {authLoading ? (
                <div className="header-account-summary">
                  <strong className="header-account-name">Checking your session</strong>
                  <span className="header-account-meta">Loading your Convex authenticated patient details.</span>
                </div>
              ) : isAuthenticated ? (
                <>
                  <div className="header-account-summary">
                    <strong className="header-account-name">{patientName}</strong>
                    <span className="header-account-meta">Appointments, reports and payments ready in your dashboard.</span>
                  </div>

                  <div className="header-account-actions">
                    <Link className="portal-account-cta" to="/portal" onClick={closeMenus}>
                      Open Portal
                    </Link>

                    <Link className="portal-account-cta portal-account-cta-secondary" to="/book-appointment" onClick={closeMenus}>
                      Book Appointment
                    </Link>

                    <button type="button" className="portal-account-signout" onClick={() => void handleSignOut()} disabled={signingOut}>
                      {signingOut ? 'Signing out...' : 'Sign Out'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="header-account-summary">
                    <strong className="header-account-name">Guest Access</strong>
                    <span className="header-account-meta">Sign in to open your appointment, report and payment dashboard.</span>
                  </div>

                  <div className="header-account-actions">
                    <Link className="portal-account-cta" to="/sign-in?redirect=%2Fportal" onClick={closeMenus}>
                      Sign In to Portal
                    </Link>
                  </div>
                </>
              )}
            </section>

            <div className="header-actions" aria-label="Header quick actions">
              <a className="action-pill action-pill-danger" href="tel:+919901559955">
                <span className="action-pill-icon">
                  <Icon name="phone" />
                </span>
                  {t('actions.emergency', 'Emergency')}
              </a>

              <label className="language-pill">
                <span className="action-pill-icon">
                  <Icon name="globe" />
                </span>
                <select value={language} onChange={(event) => setLanguage(event.target.value as typeof language)}>
                  <option value="english">English</option>
                  <option value="kannada">Kannada</option>
                  <option value="hindi">Hindi</option>
                  <option value="tamil">Tamil</option>
                  <option value="telugu">Telugu</option>
                  <option value="malayalam">Malayalam</option>
                  <option value="marathi">Marathi</option>
                </select>
              </label>

              <a className="action-pill action-pill-erp" href="https://rrdch.eduwizerp.com/" target="_blank" rel="noreferrer">
                <span className="action-pill-icon">
                  <Icon name="globe" />
                </span>
                {t('actions.studentErp', 'Student ERP')}
              </a>

            </div>
          </div>
        </div>
      </div>

      </header>

      <div className="header-menu-shell">
        <div className="container">
          <div className="header-menu-row">
            <div className="header-menu-card">
              <button
                type="button"
                className={`menu-toggle ${mobileMenuOpen ? 'is-open' : ''}`}
                aria-expanded={mobileMenuOpen}
                aria-controls="site-navigation"
                onClick={() => setMobileMenuOpen((current) => !current)}
              >
                <span />
                <span />
                <span />
                <strong>Menu</strong>
              </button>

              <nav id="site-navigation" className={`site-nav ${mobileMenuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
                {navigation.map((item) => {
                  const hasChildren = Boolean(item.children?.length)
                  const isOpen = openDropdown === item.label

                  return (
                    <div
                      key={item.label}
                      className={`nav-item ${hasChildren ? 'has-children' : ''} ${isOpen ? 'is-open' : ''}`}
                      onMouseEnter={() => hasChildren && setOpenDropdown(item.label)}
                      onMouseLeave={() => hasChildren && setOpenDropdown((current) => (current === item.label ? null : current))}
                    >
                      <div className="nav-link-row">
                        {renderNavDestination(item, 'nav-link', t(item.key, item.label), closeMenus)}

                        {hasChildren && (
                          <button
                            type="button"
                            className={`nav-trigger ${isOpen ? 'is-open' : ''}`}
                            aria-expanded={isOpen}
                            aria-label={`Toggle ${t(item.key, item.label)} submenu`}
                            onClick={() => toggleDropdown(item.label)}
                          >
                            <span className="nav-caret" />
                          </button>
                        )}
                      </div>

                      {hasChildren && (
                        <div className={`nav-dropdown ${item.children!.length > 4 ? 'is-wide' : ''} ${item.key === 'nav.department' ? 'is-department-grid' : ''}`}>
                          {item.children!.map((child) =>
                            child.to || child.href ? (
                              <span key={child.label}>
                                {renderNavDestination(
                                  child,
                                  `nav-dropdown-link ${item.key === 'nav.department' ? 'nav-dropdown-link-detail' : ''}`,
                                  item.key === 'nav.department' ? (
                                    <span className="nav-dropdown-copy">
                                      <strong>{t(child.key, child.label)}</strong>
                                      {child.description && <small>{child.description}</small>}
                                    </span>
                                  ) : (
                                    t(child.key, child.label)
                                  ),
                                  closeMenus
                                )}
                              </span>
                            ) : null
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </nav>

              <div className="header-search-wrap header-search-wrap-nav">
                <button type="button" className="search-toggle" onClick={() => setSearchOpen((current) => !current)}>
                  <span className="action-pill-icon">
                    <Icon name="search" />
                  </span>
                  {t('search.label', 'Search')}
                </button>

                {searchOpen && (
                  <div className="header-search-panel">
                    <form className="header-search-form" onSubmit={handleSearchSubmit}>
                      <input
                        type="search"
                        name="s"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder={t('search.placeholder', 'Search pages')}
                      />
                      <button type="submit">{t('search.go', 'Go')}</button>
                    </form>

                    <div className="header-search-results">
                      {searchMatches.length > 0 ? (
                        searchMatches.map((match) => (
                          <button key={`${match.to}-${match.label}`} type="button" className="header-search-result" onClick={() => handleSearchNavigate(match.to)}>
                            {match.label}
                          </button>
                        ))
                      ) : (
                        <p className="header-search-empty">{t('search.empty', 'No matching pages found.')}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header

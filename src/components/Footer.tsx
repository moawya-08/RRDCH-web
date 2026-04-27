import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

type IconName = 'facebook' | 'youtube' | 'linkedin' | 'instagram' | 'twitter' | 'blog' | 'google'

const footerLinks = [
  { key: 'nav.aboutUs', label: 'About Us', to: '/about-us' },
  { key: 'nav.coursesOffered', label: 'Courses Offered', to: '/courses' },
  { key: 'nav.facilities', label: 'Facilities', to: '/facilities' },
  { key: 'nav.newsEvents', label: 'News & Events', to: '/news-and-events' },
  { key: 'nav.photoGallery', label: 'Photo Gallery', to: '/photo-gallery' },
  { key: 'nav.contactUs', label: 'Contact Us', to: '/contact-us' }
]

const courseLinks = [
  { key: 'nav.bds', label: 'Bachelor of Dental Surgery (BDS)', to: '/bds' },
  { key: 'nav.mds', label: 'Master of Dental Surgery (MDS)', to: '/mds' },
  { key: 'nav.phd', label: 'Ph.D', to: '/phd' },
  { key: 'nav.certificateCourse', label: 'Certificate Course', to: '/certificate-course-in-implantology' }
]

const institutionLinks = [
  {
    label: 'RajaRajeswari Medical College & Hospital',
    href: 'http://www.rrmch.org/',
    image: 'https://www.rrdch.org/rrdch/wp-content/themes/firststep-dentaire/images/RR-Hospital.png',
    tone: 'dental'
  },
  {
    label: 'RajaRajeswari College of Nursing',
    href: 'https://www.rrcn.org/',
    image: 'https://www.rrdch.org/rrdch/wp-content/themes/firststep-dentaire/images/RR-Nursing.png',
    tone: 'nursing'
  },
  {
    label: 'RajaRajeswari College of Engineering',
    href: 'https://www.rrce.org/',
    image: 'https://www.rrdch.org/rrdch/wp-content/themes/firststep-dentaire/images/RR-Engineeringl.png',
    tone: 'engineering-rr'
  },
  {
    label: 'ACS College of Engineering',
    href: 'https://www.acsce.edu.in/',
    image: 'https://www.rrdch.org/rrdch/wp-content/themes/firststep-dentaire/images/Acs-Engineeringl.png',
    tone: 'engineering-acs'
  }
]

const accreditationBadges = [
  {
    image: 'https://www.rrdch.org/rrdch/wp-content/themes/firststep-dentaire/images/NABH.png',
    alt: 'NABH',
    href: 'https://www.rrdch.org/rrdch/wp-content/uploads/2025/07/NABH-accredited.pdf'
  },
  {
    image: 'https://www.rrdch.org/rrdch/wp-content/themes/firststep-dentaire/images/naac.png',
    alt: 'NAAC',
    href: 'https://www.rrdch.org/accreditation/naac/'
  },
  {
    image: 'https://www.rrdch.org/rrdch/wp-content/themes/firststep-dentaire/images/iso1.png',
    alt: 'ISO',
    href: 'https://www.rrdch.org/rrdch/wp-content/uploads/2026/02/ISO-certificate-of-registration-12.05.2027.pdf'
  },
  {
    image: 'https://www.rrdch.org/rrdch/wp-content/uploads/2025/06/img1.png',
    alt: 'IAO',
    href: 'https://www.iao.org/India-Karnataka/RajaRajeswari-Dental-College-And-Hospital'
  },
  {
    image: 'https://www.rrdch.org/rrdch/wp-content/themes/firststep-dentaire/images/RCPSG3.png',
    alt: 'RCPSG',
    href: 'https://www.rrdch.org/rrdch/wp-content/uploads/2021/07/RCPSG.pdf'
  },
  {
    image: 'https://www.rrdch.org/rrdch/wp-content/themes/firststep-dentaire/images/SLMC9.png',
    alt: 'SLMC',
    href: 'https://www.rrdch.org/rrdch/wp-content/uploads/2021/07/SLMC.pdf'
  }
]

const socialLinks = [
  { label: 'Google', href: 'https://plus.google.com/u/0/105929040179620924526/posts', icon: 'google' as IconName },
  { label: 'Blog', href: 'http://www.rrdch.org/blog/', icon: 'blog' as IconName },
  { label: 'Facebook', href: 'https://www.facebook.com/Rajarajeswari.Dental.College.Hospital', icon: 'facebook' as IconName },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCt_lgB_UcI8PcoNa0FUQS0w', icon: 'youtube' as IconName },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/rajarajeswari-dental-college-hospital/', icon: 'linkedin' as IconName },
  { label: 'Instagram', href: 'https://www.instagram.com/rrdchcollege/', icon: 'instagram' as IconName },
  { label: 'Twitter', href: 'https://twitter.com/rrdch', icon: 'twitter' as IconName }
]

const Icon = ({ name }: { name: IconName }) => {
  switch (name) {
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13.5 21v-7h2.3l.5-3h-2.8V9.3c0-.9.3-1.6 1.6-1.6H16V5.1c-.6-.1-1.3-.1-2-.1-2 0-3.4 1.2-3.4 3.6V11H8v3h2.6v7h2.9Z" fill="currentColor" />
        </svg>
      )
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21.4 7.2a2.9 2.9 0 0 0-2-2C17.7 4.7 12 4.7 12 4.7s-5.7 0-7.4.5a2.9 2.9 0 0 0-2 2A30 30 0 0 0 2 12a30 30 0 0 0 .6 4.8 2.9 2.9 0 0 0 2 2c1.7.5 7.4.5 7.4.5s5.7 0 7.4-.5a2.9 2.9 0 0 0 2-2A30 30 0 0 0 22 12a30 30 0 0 0-.6-4.8ZM10 15.7V8.3L16 12l-6 3.7Z" fill="currentColor" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6.4 8.8a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6ZM4.9 19V10h3V19h-3Zm5 0V10h2.8v1.3h.1c.4-.7 1.4-1.6 2.9-1.6 3 0 3.5 2 3.5 4.6V19h-3v-4c0-1 0-2.4-1.5-2.4s-1.7 1.1-1.7 2.3V19h-3Z" fill="currentColor" />
        </svg>
      )
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 8A3.2 3.2 0 1 1 12 8.8a3.2 3.2 0 0 1 0 6.4Zm6.1-8.2a1.1 1.1 0 1 1-2.1 0 1.1 1.1 0 0 1 2.1 0ZM21 8.1c0-1.5 0-3-.8-4.2A5.6 5.6 0 0 0 16.1 1c-1.3-.1-5-.1-8.3 0A5.6 5.6 0 0 0 3.8 3.9C3 5.1 3 6.6 3 8.1v7.8c0 1.5 0 3 .8 4.2A5.6 5.6 0 0 0 7.9 23c1.3.1 5 .1 8.3 0a5.6 5.6 0 0 0 4-2.9c.8-1.2.8-2.7.8-4.2V8.1Zm-1.8 9.4c0 1.2-.3 2.3-1.2 3.1-.8.8-1.9 1.2-3.1 1.2H9.1c-1.2 0-2.3-.4-3.1-1.2-.9-.8-1.2-1.9-1.2-3.1V8.5c0-1.2.3-2.3 1.2-3.1.8-.9 1.9-1.2 3.1-1.2h5.8c1.2 0 2.3.3 3.1 1.2.9.8 1.2 1.9 1.2 3.1v9Z" fill="currentColor" />
        </svg>
      )
    case 'twitter':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m14.1 10.2 6.3-7.2H19l-5.5 6.3L9.1 3H4l6.6 9.6L4 21h1.4l5.8-6.6L15.9 21H21l-6.9-10.8ZM12 13.4l-.6-.8-4.9-6.9h2.3l4 5.7.6.8 5.1 7.1h-2.3L12 13.4Z" fill="currentColor" />
        </svg>
      )
    case 'blog':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 4h7a5 5 0 0 1 0 10H9v4H6V4Zm3 7h4a2 2 0 1 0 0-4H9v4Zm7 1a4 4 0 0 1 0 8h-7v-8h7Zm0 5a1 1 0 1 0 0-2h-4v2h4Z" fill="currentColor" />
        </svg>
      )
    case 'google':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.2 10.2v3.1h4.5c-.2 1-.6 1.9-1.3 2.5-.8.8-2 1.4-3.8 1.4-3 0-5.4-2.5-5.4-5.5s2.4-5.5 5.4-5.5c1.6 0 2.8.6 3.6 1.4l2.2-2.2A8.5 8.5 0 0 0 11.6 3C6.8 3 3 6.9 3 11.7s3.8 8.7 8.6 8.7c2.6 0 4.6-.9 6.1-2.4 1.5-1.5 2-3.6 2-5.3 0-.5 0-1-.1-1.4h-7.4Z" fill="currentColor" />
        </svg>
      )
  }
}

const Footer = () => {
  const { t } = useLanguage()

  return (
    <footer className="site-footer">
      <div className="institution-strip">
        <div className="container">
          <div className="section-heading section-heading-light">
            <p className="eyebrow">{t('footer.groupEyebrow', 'RajaRajeswari Group of Institutions')}</p>
            <h2>{t('footer.groupTitle', 'Connected campuses and partner institutions.')}</h2>
          </div>

          <div className="institution-grid">
            {institutionLinks.map((institution) => (
              <a key={institution.label} className={`institution-card institution-card-${institution.tone}`} href={institution.href} target="_blank" rel="noreferrer">
                <div className="institution-icon-wrap">
                  <img src={institution.image} alt={institution.label} />
                </div>
                <h3>{institution.label}</h3>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-accreditation-band">
        <div className="container">
          <p className="footer-accreditation-title">{t('footer.accreditationTitle', 'Accreditations & Recognitions')}</p>
          <div className="footer-accreditation-grid">
            {accreditationBadges.map((badge) => (
              <a key={badge.alt} href={badge.href} target="_blank" rel="noreferrer">
                <img src={badge.image} alt={badge.alt} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container footer-grid">
        <div className="footer-brand-panel">
          <img
            className="footer-logo"
            src="https://www.rrdch.org/rrdch/wp-content/uploads/2018/09/rrdch-logo.png"
            alt="RajaRajeswari Dental College and Hospital"
          />

          <p className="footer-tagline">{t('footer.tagline', 'RajaRajeswari Dental College & Hospital')}</p>
          <p className="footer-address">
            No.14, Ramohalli Cross, Kumbalgodu, Bengaluru - 560 074, Karnataka, India.
          </p>

          <div className="footer-contact-list">
            <a href="mailto:principalrrdch@gmail.com">principalrrdch@gmail.com</a>
            <a href="tel:+918028437150">+91-80-2843 7150</a>
            <a href="tel:+918028437468">+91-80-2843 7468</a>
            <a href="tel:+919901559955">+91 9901559955</a>
          </div>
        </div>

        <div>
          <h3>{t('footer.explore', 'Explore')}</h3>
          <div className="footer-link-list">
            {footerLinks.map((link) => (
              <Link key={link.label} to={link.to}>
                {t(link.key, link.label)}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3>{t('footer.courses', 'Courses')}</h3>
          <div className="footer-link-list">
            {courseLinks.map((link) => (
              <Link key={link.label} to={link.to}>
                {t(link.key, link.label)}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3>{t('footer.connect', 'Connect')}</h3>
          <p className="footer-connect-copy">{t('footer.socialCopy', 'Official social links.')}</p>

          <div className="footer-socials" aria-label="Social links">
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
                <Icon name={social.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>&copy; {t('footer.rights', '2013 RRDCH. All Rights Reserved.')}</p>
          <p>{t('footer.hosted', 'Site Hosted, Designed and Maintained by RRDCH')}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

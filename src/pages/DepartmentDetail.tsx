import React from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { departmentMap, departments } from '../data/departments'

const DepartmentDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  if (!slug || !departmentMap[slug]) {
    return <Navigate to="/" replace />
  }

  const department = departmentMap[slug]

  return (
    <div className="department-page">
      <header className="page-header department-page-header">
        <div className="container department-header-grid">
          <div>
            <p className="eyebrow">Department</p>
            <h1>{department.title}</h1>
            <p className="department-header-copy">Official department information, adapted from the original RRDCH website into this redesigned local experience.</p>

            <div className="department-header-actions">
              <a className="spotlight-link" href={department.officialUrl} target="_blank" rel="noreferrer">
                View Official Source
              </a>
              <Link className="spotlight-link department-secondary-link" to="/contact-us">
                Contact Department
              </Link>
            </div>
          </div>

          <div className="department-hero-image-wrap">
            <img src={department.imageUrl} alt={department.title} />
          </div>
        </div>
      </header>

      <section className="page-content department-page-content">
        <div className="container department-content-grid">
          <article className="department-main-card">
            <h2>Overview</h2>
            {department.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <div className="department-focus-block">
              <h3>Focus Areas</h3>
              <ul>
                {department.focusAreas.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>

          <aside className="department-side-card">
            <h3>All Departments</h3>
            <div className="department-list-links">
              {departments.map((item) => (
                <Link key={item.slug} className={item.slug === department.slug ? 'is-active' : ''} to={`/departments/${item.slug}`}>
                  {item.title}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}

export default DepartmentDetail

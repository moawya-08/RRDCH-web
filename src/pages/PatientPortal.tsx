import { useMemo } from 'react'
import { useQuery } from 'convex/react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AnnouncementRecord, AppointmentRecord, ComplaintRecord, ReportRecord, convexApi } from '../lib/convexApi'

const fallbackAnnouncements: AnnouncementRecord[] = [
  {
    _id: 'portal-fallback-1',
    title: 'Patient portal is now active',
    body: 'You can review appointments, lab reports, billing status and front-desk updates in one place.',
    targetAudience: 'patients',
    publishedBy: 'RRDCH Front Desk',
    isActive: true,
    publishedAt: Date.now()
  },
  {
    _id: 'portal-fallback-2',
    title: 'Bring your appointment reference number',
    body: 'Please keep your RRD appointment ID handy when visiting the registration counter.',
    targetAudience: 'patients',
    publishedBy: 'Hospital Desk',
    isActive: true,
    publishedAt: Date.now()
  }
]

const formatCurrency = (amountPaise: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amountPaise / 100)

const formatDate = (value: string | number) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(typeof value === 'number' ? new Date(value) : new Date(`${value}T00:00:00`))

const sortAppointments = (items: AppointmentRecord[]) =>
  [...items].sort((left, right) => {
    const dateCompare = left.date.localeCompare(right.date)
    if (dateCompare !== 0) return dateCompare
    return left.timeSlot.localeCompare(right.timeSlot)
  })

const getStatusLabel = (value: string) => value.replace(/_/g, ' ')

const PatientPortal = () => {
  const { user } = useAuth()
  const appointmentsQuery = useQuery(convexApi.appointments.listForViewer, {}) as AppointmentRecord[] | undefined
  const reportsQuery = useQuery(convexApi.reports.listForViewer, {}) as ReportRecord[] | undefined
  const announcementsQuery = useQuery(convexApi.announcements.listActive, { targetAudience: 'patients' }) as AnnouncementRecord[] | undefined
  const complaintsQuery = useQuery(
    convexApi.complaints.listBySubmitter,
    user?.email || user?.phone ? { submittedBy: user.email || user.phone } : 'skip'
  ) as ComplaintRecord[] | undefined

  const appointments = useMemo(() => sortAppointments(appointmentsQuery ?? []), [appointmentsQuery])
  const reports = reportsQuery ?? []
  const complaints = complaintsQuery ?? []
  const announcements = announcementsQuery && announcementsQuery.length > 0 ? announcementsQuery : fallbackAnnouncements
  const nextAppointment = appointments.find((appointment) => appointment.status === 'confirmed' || appointment.status === 'pending')
  const pendingPaymentAmount = appointments
    .filter((appointment) => appointment.paymentStatus === 'pending')
    .reduce((total, appointment) => total + appointment.amountPaise, 0)
  const completedVisits = appointments.filter((appointment) => appointment.status === 'completed').length
  const patientName = user?.name || user?.email?.split('@')[0] || user?.phone || 'Patient'
  const patientIdentity = user?.email || user?.phone || 'RRDCH patient'
  const patientInitial = patientName.trim().charAt(0).toUpperCase() || 'P'

  return (
    <div className="patient-portal-page">
      <section className="container portal-shell-redesign">
        <aside className="portal-sidebar-card">
          <div className="portal-profile-card">
            {user?.image ? <img className="portal-avatar-image" src={user.image} alt={patientName} /> : <div className="portal-avatar-fallback">{patientInitial}</div>}
            <div>
              <p className="eyebrow">Patient Account</p>
              <h1>{patientName}</h1>
              <p>{patientIdentity}</p>
            </div>
          </div>

          <nav className="portal-nav-list" aria-label="Patient portal sections">
            <a href="#portal-overview">Overview</a>
            <a href="#portal-appointments">Appointments</a>
            <a href="#portal-reports">Reports</a>
            <a href="#portal-support">Support</a>
            <a href="#portal-updates">Updates</a>
          </nav>

          <div className="portal-sidebar-callout">
            <strong>Next Visit</strong>
            <span>{nextAppointment ? `${formatDate(nextAppointment.date)} at ${nextAppointment.timeSlot}` : 'No upcoming visit yet'}</span>
            <p>{nextAppointment ? `${nextAppointment.department} • ${nextAppointment.appointmentId}` : 'Use the booking page to schedule your next consultation.'}</p>
            <Link className="portal-sidebar-cta" to="/book-appointment">Book Appointment</Link>
          </div>
        </aside>

        <section className="portal-dashboard-stage">
          <header className="portal-dashboard-head" id="portal-overview">
            <div>
              <p className="eyebrow">Patient Portal</p>
              <h2>Overview</h2>
              <p>Your appointments, files, payments and hospital updates in one place.</p>
            </div>
            <div className="portal-dashboard-actions">
              <Link className="form-submit" to="/book-appointment">Book Appointment</Link>
              <Link className="form-submit form-submit-secondary" to="/contact-us">Front Desk</Link>
            </div>
          </header>

          <section className="portal-content">
        <div className="portal-metrics-grid">
          <article className="portal-metric-card">
            <span>Total Appointments</span>
            <strong>{appointments.length}</strong>
            <p>All requests linked to this account.</p>
          </article>
          <article className="portal-metric-card">
            <span>Reports</span>
            <strong>{reports.length}</strong>
            <p>Lab, radiology and prescription records.</p>
          </article>
          <article className="portal-metric-card">
            <span>Pending Payment</span>
            <strong>{formatCurrency(pendingPaymentAmount)}</strong>
            <p>Billing items awaiting confirmation.</p>
          </article>
          <article className="portal-metric-card">
            <span>Completed Visits</span>
            <strong>{completedVisits}</strong>
            <p>Closed appointments in your history.</p>
          </article>
        </div>

        <div className="portal-main-grid">
          <section className="portal-panel portal-panel-large" id="portal-appointments">
            <div className="portal-panel-heading">
              <div>
                <p className="eyebrow">Appointments</p>
                <h2>Your visit timeline</h2>
              </div>
              <Link to="/book-appointment">New booking</Link>
            </div>

            <div className="portal-list">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <article className="portal-list-item" key={appointment._id}>
                    <div>
                      <strong>{appointment.department}</strong>
                      <span>{appointment.appointmentId}</span>
                    </div>
                    <div>
                      <strong>{formatDate(appointment.date)}</strong>
                      <span>{appointment.timeSlot}</span>
                    </div>
                    <div className="portal-badge-row">
                      <span className={`portal-badge portal-badge-${appointment.status}`}>{getStatusLabel(appointment.status)}</span>
                      <span className={`portal-badge portal-badge-${appointment.paymentStatus}`}>{getStatusLabel(appointment.paymentStatus)}</span>
                    </div>
                  </article>
                ))
              ) : (
                <p className="portal-empty">No appointments found for this account yet.</p>
              )}
            </div>
          </section>

          <aside className="portal-side-stack">
            <section className="portal-panel" id="portal-reports">
              <p className="eyebrow">Reports</p>
              <h2>Lab & clinical files</h2>
              <div className="portal-mini-list">
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <a className="portal-mini-item" key={report._id} href={report.externalFileUrl || '#'}>
                      <strong>{getStatusLabel(report.reportType)}</strong>
                      <span>{getStatusLabel(report.deliveryStatus)} - {formatDate(report.uploadedAt)}</span>
                    </a>
                  ))
                ) : (
                  <p className="portal-empty">No reports uploaded yet.</p>
                )}
              </div>
            </section>

            <section className="portal-panel" id="portal-support">
              <p className="eyebrow">Support</p>
              <h2>Complaints & requests</h2>
              <div className="portal-mini-list">
                {complaints.length > 0 ? (
                  complaints.slice(0, 4).map((complaint) => (
                    <article className="portal-mini-item" key={complaint._id}>
                      <strong>{complaint.referenceId}</strong>
                      <span>{getStatusLabel(complaint.status)} - {complaint.description}</span>
                    </article>
                  ))
                ) : (
                  <p className="portal-empty">No support requests submitted.</p>
                )}
              </div>
            </section>
          </aside>
        </div>

        <section className="portal-panel" id="portal-updates">
          <div className="portal-panel-heading">
            <div>
              <p className="eyebrow">Hospital Updates</p>
              <h2>Announcements for patients</h2>
            </div>
          </div>
          <div className="portal-announcements-grid">
            {announcements.slice(0, 3).map((announcement) => (
              <article className="portal-announcement" key={announcement._id}>
                <strong>{announcement.title}</strong>
                <p>{announcement.body}</p>
                <span>{announcement.publishedBy}</span>
              </article>
            ))}
          </div>
        </section>
          </section>
        </section>
      </section>
    </div>
  )
}

export default PatientPortal

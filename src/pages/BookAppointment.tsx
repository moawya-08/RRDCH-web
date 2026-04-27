import { useMutation } from 'convex/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { convexApi } from '../lib/convexApi'

type AppointmentOption = {
  label: string
  doctorId: string
  doctorName: string
}

type AppointmentFormData = {
  name: string
  email: string
  phone: string
  department: string
  date: string
  time: string
  doctor: string
  notes: string
}

const departmentOptions: AppointmentOption[] = [
  { label: 'General Dentistry', doctorId: 'general-dentistry', doctorName: 'General Consultation Desk' },
  { label: 'Orthodontics', doctorId: 'orthodontics', doctorName: 'Orthodontics Unit' },
  { label: 'Periodontology', doctorId: 'periodontology', doctorName: 'Periodontology Unit' },
  { label: 'Oral and Maxillofacial Surgery', doctorId: 'oral-maxillofacial-surgery', doctorName: 'Maxillofacial Surgery Unit' },
  { label: 'Pedodontics', doctorId: 'pedodontics', doctorName: 'Pedodontics Unit' },
  { label: 'Prosthodontics', doctorId: 'prosthodontics', doctorName: 'Prosthodontics Unit' }
]

const initialFormData: AppointmentFormData = {
  name: '',
  email: '',
  phone: '',
  department: departmentOptions[0]!.label,
  date: '',
  time: '',
  doctor: departmentOptions[0]!.doctorName,
  notes: ''
}

const minAppointmentDate = new Date().toISOString().split('T')[0]

const BookAppointment: React.FC = () => {
  const { user } = useAuth()
  const createBooking = useMutation(convexApi.appointments.createBooking)
  const [formData, setFormData] = useState(initialFormData)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      name: current.name || user?.name || '',
      email: current.email || user?.email || '',
      phone: current.phone || user?.phone || ''
    }))
  }, [user])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      doctor: name === 'department' ? departmentOptions.find((department) => department.label === value)?.doctorName || current.doctor : current.doctor,
      [name]: value
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      const selectedDepartment = departmentOptions.find((department) => department.label === formData.department)

      if (!selectedDepartment) {
        throw new Error('Please select a valid department')
      }

      const booking = await createBooking({
        patientName: formData.name.trim(),
        patientEmail: formData.email.trim().toLowerCase(),
        patientPhone: formData.phone.trim(),
        department: formData.department,
        doctorId: selectedDepartment.doctorId,
        date: formData.date,
        timeSlot: formData.time,
        notes: formData.notes.trim() || undefined,
        amountPaise: 0,
        source: 'web'
      })

      setSuccessMessage(
        `Your appointment request has been stored in Convex with ID ${booking.appointmentId}. ${formData.department} is scheduled for ${formData.date} at ${formData.time}.`
      )

      setFormData((current) => ({
        ...current,
        date: '',
        time: '',
        notes: ''
      }))
    } catch (submitError) {
      console.error('Appointment booking failed:', submitError)
      setError(submitError instanceof Error ? submitError.message : 'We could not submit your appointment right now. Please try again in a moment.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="booking-page">
      <section className="page-header">
        <div className="container">
          <h1>Book Appointment</h1>
        </div>
      </section>

      <section className="booking-page-body">
        <div className="container booking-layout">
          <aside className="booking-aside">
            <p className="eyebrow">Authenticated Booking</p>
            <h2>Your patient details are ready.</h2>
            <p>
              Submit your preferred department, date and time. The RRDCH team will use your registered email and phone number to
              confirm the visit.
            </p>

            <ul className="booking-meta-list">
              <li>
                <strong>Signed in as</strong>
                <span>{user?.email || user?.phone || 'Convex authenticated patient'}</span>
              </li>
              <li>
                <strong>Hospital hours</strong>
                <span>Monday to Saturday, 9:00 AM to 5:00 PM</span>
              </li>
              <li>
                <strong>Need urgent help?</strong>
                <span>
                  Call <a href="tel:+919901559955">+91 9901559955</a>
                </span>
              </li>
            </ul>

            <p className="booking-aside-note">
              Need admissions or campus guidance instead? <Link to="/contact-us">Contact the college office</Link>.
            </p>
          </aside>

          <section className="booking-card" aria-labelledby="appointment-form-title">
            <div className="section-heading">
              <p className="eyebrow">Appointment Desk</p>
              <h2 id="appointment-form-title">Choose a slot and send your request.</h2>
            </div>

            <p className="form-note">
              We use your Convex account to prefill patient details. Update the phone number if the hospital should call a different contact.
            </p>

            {error && <div className="form-message is-error">{error}</div>}
            {successMessage && <div className="form-message is-success">{successMessage}</div>}

            <form className="form-stack" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="name">Patient Name</label>
                  <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-field">
                  <label htmlFor="email">Email Address</label>
                  <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="phone">Mobile Number</label>
                  <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                </div>

                <div className="form-field">
                  <label htmlFor="department">Department</label>
                  <select id="department" name="department" value={formData.department} onChange={handleChange}>
                    {departmentOptions.map((department) => (
                      <option key={department.doctorId} value={department.label}>
                        {department.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="date">Preferred Date</label>
                  <input id="date" name="date" type="date" min={minAppointmentDate} value={formData.date} onChange={handleChange} required />
                </div>

                <div className="form-field">
                  <label htmlFor="time">Preferred Time</label>
                  <input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="doctor">Assigned Unit</label>
                <input id="doctor" name="doctor" type="text" value={formData.doctor} onChange={handleChange} readOnly />
              </div>

              <div className="form-field">
                <label htmlFor="notes">Symptoms or Notes</label>
                <textarea id="notes" name="notes" rows={5} value={formData.notes} onChange={handleChange} />
              </div>

              <div className="form-actions">
                <button type="submit" className="form-submit" disabled={submitting}>
                  {submitting ? 'Saving to Convex...' : 'Confirm appointment request'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </section>
    </div>
  )
}

export default BookAppointment

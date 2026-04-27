import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createAppointmentBooking, isConvexConfigured } from '../lib/convexBackend'

type ChatAction = {
  label: string
  kind: 'route' | 'external' | 'tel' | 'mailto'
  value: string
}

type ChatMessage = {
  id: number
  sender: 'bot' | 'user'
  text: string
  actions?: ChatAction[]
  quickReplies?: string[]
}

type AppointmentStep = 'idle' | 'name' | 'phone' | 'department' | 'date' | 'notes'

type AppointmentDraft = {
  name: string
  phone: string
  department: string
  preferredDate: string
  notes: string
}

type AppointmentInputMode = 'default' | 'notes'

type KnowledgeEntry = {
  keywords: string[]
  response: string
  actions?: ChatAction[]
  quickReplies?: string[]
}

const QUICK_REPLIES = ['Admissions', 'Courses', 'Departments', 'Facilities', 'Contact', 'Emergency', 'Book appointment']
const APPOINTMENT_DEPARTMENTS = ['BDS', 'MDS', 'Ph.D', 'Certificate Course', 'General Enquiry', 'Hospital Consultation']
const APPOINTMENT_TIME_SLOTS = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']

const departmentDoctorMap: Record<string, string> = {
  BDS: 'general-dentistry',
  MDS: 'mds-clinic',
  'Ph.D': 'phd-research-unit',
  'Certificate Course': 'implantology-certificate',
  'General Enquiry': 'general-consultation-desk',
  'Hospital Consultation': 'hospital-consultation-desk'
}

const knowledgeBase: KnowledgeEntry[] = [
  {
    keywords: ['admission', 'admissions', 'apply', 'enquiry', 'inquiry', 'fees'],
    response:
      'For admissions, the fastest next step is the Admission Enquiry page. You can review courses first and then submit your enquiry.',
    actions: [
      { label: 'Admission Enquiry', kind: 'route', value: '/make-enquiry' },
      { label: 'Courses Offered', kind: 'route', value: '/courses' }
    ],
    quickReplies: ['BDS', 'MDS', 'Contact']
  },
  {
    keywords: ['course', 'courses', 'bds', 'mds', 'phd', 'certificate'],
    response:
      'RRDCH offers BDS, MDS, Ph.D and Certificate Course options. You can open the course pages directly from here.',
    actions: [
      { label: 'BDS', kind: 'route', value: '/bds' },
      { label: 'MDS', kind: 'route', value: '/mds' },
      { label: 'Ph.D', kind: 'route', value: '/phd' },
      { label: 'Certificate Course', kind: 'route', value: '/certificate-course-in-implantology' }
    ],
    quickReplies: ['Admissions', 'Departments', 'Facilities']
  },
  {
    keywords: ['department', 'departments', 'speciality', 'specialities', 'specialties', 'available department', 'department available'],
    response:
      'Departments currently available include:\n\n- Oral Medicine & Radiology\n- Prosthetics & Crown & Bridge\n- Oral & Maxillofacial Surgery\n- Periodontology\n- Pedodontics & Preventive Dentistry\n- Conservative Dentistry & Endodontics\n- Orthodontics & Dentofacial Orthopedics\n- Public Health Dentistry\n- Oral & Maxillofacial Pathology\n- Implantology\n- Research & Publication\n- Orofacial Pain\n\nYou can open department pages directly below.',
    actions: [
      { label: 'Oral Medicine', kind: 'route', value: '/departments/oral-medicine-radiology' },
      { label: 'Orthodontics', kind: 'route', value: '/departments/orthodontics-dentofacial-orthopedics' },
      { label: 'Implantology', kind: 'route', value: '/departments/implantology' },
      { label: 'Public Health', kind: 'route', value: '/departments/public-health-dentistry' }
    ],
    quickReplies: ['Book appointment', 'Contact', 'Facilities']
  },
  {
    keywords: ['facility', 'facilities', 'hostel', 'library', 'gym', 'transport', 'classroom', 'sports'],
    response:
      'You can explore campus facilities like hostel, digital library, gymnasium, transportation, classrooms and sports & recreation from the facilities section.',
    actions: [
      { label: 'Facilities', kind: 'route', value: '/facilities' },
      { label: 'Hostel', kind: 'route', value: '/hostel' },
      { label: 'Digital Library', kind: 'route', value: '/digital-library' }
    ],
    quickReplies: ['Campus tour', 'Contact']
  },
  {
    keywords: ['contact', 'phone', 'email', 'address', 'location', 'map'],
    response:
      'You can contact RRDCH at +91-80-2843 7150, +91-80-2843 7468 or +91 9901559955. You can also email principalrrdch@gmail.com.',
    actions: [
      { label: 'Call Main Line', kind: 'tel', value: '+918028437150' },
      { label: 'Email RRDCH', kind: 'mailto', value: 'principalrrdch@gmail.com' },
      { label: 'Contact Page', kind: 'route', value: '/contact-us' }
    ],
    quickReplies: ['Emergency', 'Admissions']
  },
  {
    keywords: ['emergency', 'urgent', 'help now'],
    response: 'For urgent help, please contact the emergency number directly.',
    actions: [{ label: 'Call Emergency', kind: 'tel', value: '+919901559955' }],
    quickReplies: ['Contact', 'Book appointment']
  },
  {
    keywords: ['erp', 'student portal', 'student erp', 'login'],
    response: 'You can open the Student ERP directly from here.',
    actions: [{ label: 'Open Student ERP', kind: 'external', value: 'https://rrdch.eduwizerp.com/' }],
    quickReplies: ['Admissions', 'Contact']
  },
  {
    keywords: ['tour', 'virtual tour', 'campus tour'],
    response: 'You can scroll to the Campus Tour section on the home page to explore the virtual tour.',
    actions: [{ label: 'Home Page', kind: 'route', value: '/' }],
    quickReplies: ['Facilities', 'Gallery']
  },
  {
    keywords: ['gallery', 'photos', 'videos'],
    response: 'RRDCH has both photo and video gallery pages available.',
    actions: [
      { label: 'Photo Gallery', kind: 'route', value: '/photo-gallery' },
      { label: 'Video Gallery', kind: 'route', value: '/video-gallery' }
    ],
    quickReplies: ['Campus tour', 'Contact']
  }
]

const emptyAppointmentDraft = (): AppointmentDraft => ({
  name: '',
  phone: '',
  department: '',
  preferredDate: '',
  notes: ''
})

const normalize = (value: string) => value.trim().toLowerCase()

const toIsoDate = (value: string) => {
  const parts = value.split('-')

  if (parts.length !== 3) {
    return value
  }

  const [year, month, day] = parts
  return `${day}-${month}-${year}`
}

const to24HourTime = (slot: string) => {
  const [time, meridiem] = slot.split(' ')
  const [hourText, minuteText] = time.split(':')
  let hour = Number(hourText)

  if (meridiem === 'PM' && hour !== 12) {
    hour += 12
  }

  if (meridiem === 'AM' && hour === 12) {
    hour = 0
  }

  return `${hour.toString().padStart(2, '0')}:${minuteText}`
}

const formatDateLabel = (value: string) => {
  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return parsedDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const Chatbot = () => {
  const navigate = useNavigate()
  const nextId = useRef(1)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [appointmentStep, setAppointmentStep] = useState<AppointmentStep>('idle')
  const [appointmentInputMode, setAppointmentInputMode] = useState<AppointmentInputMode>('default')
  const [appointmentDraft, setAppointmentDraft] = useState<AppointmentDraft>(emptyAppointmentDraft)
  const [appointmentDateValue, setAppointmentDateValue] = useState('')
  const [appointmentTimeValue, setAppointmentTimeValue] = useState(APPOINTMENT_TIME_SLOTS[0])
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 0,
      sender: 'bot',
      text:
        'Hello! I am the RRDCH assistant. I can help with admissions, courses, departments, facilities, contact details and appointment requests.',
      quickReplies: QUICK_REPLIES
    }
  ])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const hasUnreadPrompt = useMemo(() => !isOpen && messages.length === 1, [isOpen, messages.length])

  const addMessage = (message: Omit<ChatMessage, 'id'>) => {
    setMessages((current) => [...current, { id: nextId.current++, ...message }])
  }

  const addUserMessage = (text: string) => {
    addMessage({ sender: 'user', text })
  }

  const addBotMessage = (text: string, actions?: ChatAction[], quickReplies?: string[]) => {
    addMessage({ sender: 'bot', text, actions, quickReplies })
  }

  const persistAppointmentRequest = (request: AppointmentDraft) => {
    const saved = window.localStorage.getItem('rrdch-appointment-requests')
    const currentRequests = saved ? (JSON.parse(saved) as Array<AppointmentDraft & { createdAt: string }>) : []

    currentRequests.push({ ...request, createdAt: new Date().toISOString() })
    window.localStorage.setItem('rrdch-appointment-requests', JSON.stringify(currentRequests))
  }

  const cancelAppointmentFlow = () => {
    setAppointmentStep('idle')
    setAppointmentInputMode('default')
    setAppointmentDraft(emptyAppointmentDraft())
    setAppointmentDateValue('')
    setAppointmentTimeValue(APPOINTMENT_TIME_SLOTS[0])
    addBotMessage('No problem. I cancelled the appointment flow. How else can I help?', undefined, QUICK_REPLIES)
  }

  const completeAppointmentFlow = (request: AppointmentDraft) => {
    const submitRequest = async () => {
      const doctorId = departmentDoctorMap[request.department] ?? 'general-consultation-desk'
      const emailAlias = request.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '.')
        .replace(/^\.+|\.+$/g, '')
      const payload = {
        patientName: request.name,
        patientEmail: `${emailAlias || 'patient'}@rrdch-chatbot.local`,
        patientPhone: request.phone,
        department: request.department,
        doctorId,
        date: toIsoDate(appointmentDateValue || new Date().toISOString().slice(0, 10)),
        timeSlot: to24HourTime(appointmentTimeValue),
        notes: request.notes || undefined,
        amountPaise: 0,
        source: 'web' as const
      }

      try {
        if (!isConvexConfigured) {
          throw new Error('Backend is not configured yet')
        }

        const booking = await createAppointmentBooking(payload)
        addBotMessage(
          `Appointment request submitted successfully.\n\nBooking ID: ${booking.appointmentId}\nDepartment: ${request.department}\nPreferred date/time: ${request.preferredDate}\n\nThe backend has received this request.`,
          [
            { label: 'Contact Us', kind: 'route', value: '/contact-us' },
            { label: 'Call Main Line', kind: 'tel', value: '+918028437150' }
          ],
          ['Book appointment', 'Admissions', 'Contact']
        )
      } catch (error) {
        persistAppointmentRequest(request)
        addBotMessage(
          `I couldn't reach the backend just now, so I saved your request locally as a fallback.\n\nReason: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease confirm with the office by phone while we reconnect the backend.`,
          [
            { label: 'Call Main Line', kind: 'tel', value: '+918028437150' },
            { label: 'Open Contact Page', kind: 'route', value: '/contact-us' }
          ],
          ['Book appointment', 'Contact']
        )
      } finally {
        setAppointmentStep('idle')
        setAppointmentInputMode('default')
        setAppointmentDraft(emptyAppointmentDraft())
        setAppointmentDateValue('')
        setAppointmentTimeValue(APPOINTMENT_TIME_SLOTS[0])
      }
    }

    void submitRequest()
  }

  const handleAppointmentInput = (value: string) => {
    if (normalize(value) === 'cancel') {
      cancelAppointmentFlow()
      return
    }

    if (appointmentStep === 'name') {
      if (value.trim().length < 2) {
        addBotMessage('Please enter a valid full name, or type "cancel" to stop.')
        return
      }

      setAppointmentDraft((current) => ({ ...current, name: value.trim() }))
      setAppointmentStep('phone')
      addBotMessage('Thanks. What phone number should the team use to reach you?')
      return
    }

    if (appointmentStep === 'phone') {
      const digits = value.replace(/\D/g, '')

      if (digits.length < 10) {
        addBotMessage('Please enter a valid phone number with at least 10 digits, or type "cancel" to stop.')
        return
      }

      setAppointmentDraft((current) => ({ ...current, phone: value.trim() }))
      setAppointmentInputMode('default')
      setAppointmentStep('department')
      addBotMessage('Which department or course would you like the appointment for? You can choose an option below or type your own.')
      return
    }

    if (appointmentStep === 'department') {
      if (value.trim().length < 2) {
        addBotMessage('Please enter the department or purpose of appointment, or type "cancel" to stop.')
        return
      }

      setAppointmentDraft((current) => ({ ...current, department: value.trim() }))
      setAppointmentStep('date')
      setAppointmentInputMode('default')
      addBotMessage('Please select your preferred appointment date and time from the options below.')
      return
    }

    if (appointmentStep === 'date') {
      addBotMessage('Please use the date selector and time options below to continue your appointment request.')
      return
    }

    if (appointmentStep === 'notes') {
      if (appointmentInputMode !== 'notes') {
        if (normalize(value) === 'skip') {
          completeAppointmentFlow({ ...appointmentDraft, notes: '' })
          return
        }

        setAppointmentInputMode('notes')
      }

      const nextDraft = {
        ...appointmentDraft,
        notes: normalize(value) === 'skip' ? '' : value.trim()
      }

      completeAppointmentFlow(nextDraft)
    }
  }

  const handleDepartmentSelect = (department: string) => {
    addUserMessage(department)
    setAppointmentDraft((current) => ({ ...current, department }))
    setAppointmentStep('date')
    setAppointmentInputMode('default')
    addBotMessage('Please select your preferred appointment date and time from the options below.')
  }

  const handleDateSelectionSubmit = () => {
    if (!appointmentDateValue) {
      addBotMessage('Please select a date before continuing.')
      return
    }

    const preferredDate = `${formatDateLabel(appointmentDateValue)}, ${appointmentTimeValue}`

    addUserMessage(preferredDate)
    setAppointmentDraft((current) => ({ ...current, preferredDate }))
    setAppointmentStep('notes')
    setAppointmentInputMode('default')
    addBotMessage('Would you like to add any notes to the appointment request?', undefined, ['Write notes', 'Skip notes'])
  }

  const handleSkipNotes = () => {
    addUserMessage('Skip notes')
    completeAppointmentFlow({ ...appointmentDraft, notes: '' })
  }

  const handleWriteNotes = () => {
    addUserMessage('Write notes')
    setAppointmentInputMode('notes')
    addBotMessage('Please type your notes below. You can also type "skip" if you changed your mind.')
  }

  const handleKnowledgeResponse = (value: string) => {
    const query = normalize(value)

    const appointmentIntent =
      query === 'appointment' ||
      query === 'book appointment' ||
      query.includes('book an appointment') ||
      query.includes('appointment booking') ||
      query.includes('schedule appointment') ||
      query.includes('new appointment')

    if (appointmentIntent) {
      navigate('/book-appointment')
      setIsOpen(false)
      return
    }

    if (query === 'bds') {
      addBotMessage('Here is the BDS page.', [{ label: 'Open BDS', kind: 'route', value: '/bds' }], ['Admissions', 'Book appointment'])
      return
    }

    if (query === 'mds') {
      addBotMessage('Here is the MDS page.', [{ label: 'Open MDS', kind: 'route', value: '/mds' }], ['Admissions', 'Book appointment'])
      return
    }

    const match = knowledgeBase.find((entry) => entry.keywords.some((keyword) => query.includes(keyword)))

    if (match) {
      addBotMessage(match.response, match.actions, match.quickReplies)
      return
    }

    addBotMessage(
      'I can help with admissions, courses, departments, facilities, contact details, ERP access and appointment requests. Try one of the quick options below.',
      undefined,
      QUICK_REPLIES
    )
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const value = inputValue.trim()

    if (!value) {
      return
    }

    addUserMessage(value)
    setInputValue('')

    if (appointmentStep !== 'idle') {
      handleAppointmentInput(value)
      return
    }

    handleKnowledgeResponse(value)
  }

  const handleAction = (action: ChatAction) => {
    if (action.kind === 'route') {
      navigate(action.value)
      setIsOpen(false)
      return
    }

    if (action.kind === 'external') {
      window.open(action.value, '_blank', 'noopener,noreferrer')
      return
    }

    if (action.kind === 'tel') {
      window.location.href = `tel:${action.value}`
      return
    }

    window.location.href = `mailto:${action.value}`
  }

  const handleQuickReply = (reply: string) => {
    addUserMessage(reply)

    if (reply === 'Book appointment') {
      navigate('/book-appointment')
      setIsOpen(false)
      return
    }

    if (reply === 'Write notes') {
      setAppointmentInputMode('notes')
      addBotMessage('Please type your notes below. You can also type "skip" if there are no extra notes.')
      return
    }

    if (reply === 'Skip notes') {
      completeAppointmentFlow({ ...appointmentDraft, notes: '' })
      return
    }

    handleKnowledgeResponse(reply)
  }

  const appointmentInputPlaceholder =
    appointmentStep === 'idle'
      ? 'Ask about admissions, courses or facilities'
      : appointmentStep === 'name'
        ? 'Enter full name'
        : appointmentStep === 'phone'
          ? 'Enter phone number'
          : appointmentStep === 'department'
            ? 'Type a department or purpose'
            : appointmentStep === 'notes' && appointmentInputMode === 'notes'
              ? 'Type appointment notes'
              : 'Use the options below'

  const isTextInputDisabled = appointmentStep === 'date'

  const minimumDate = useMemo(() => new Date().toISOString().split('T')[0], [])

  return (
    <div className="chatbot-shell" aria-live="polite">
      {isOpen && (
        <section className="chatbot-panel" aria-label="RRDCH chatbot">
          <div className="chatbot-panel-header">
            <div>
              <p className="chatbot-kicker">RRDCH Assistant</p>
              <h2>How can I help?</h2>
            </div>

            <button type="button" className="chatbot-close" aria-label="Close chatbot" onClick={() => setIsOpen(false)}>
              x
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <article key={message.id} className={`chatbot-message chatbot-message-${message.sender}`}>
                <p>{message.text}</p>

                {message.actions && message.actions.length > 0 && (
                  <div className="chatbot-actions-row">
                    {message.actions.map((action) => (
                      <button key={`${message.id}-${action.label}`} type="button" className="chatbot-action" onClick={() => handleAction(action)}>
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

                {message.quickReplies && message.quickReplies.length > 0 && (
                  <div className="chatbot-quick-row">
                    {message.quickReplies.map((reply) => (
                      <button key={`${message.id}-${reply}`} type="button" className="chatbot-quick-reply" onClick={() => handleQuickReply(reply)}>
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </article>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {appointmentStep === 'department' && (
            <div className="chatbot-appointment-panel">
              <p className="chatbot-appointment-title">Choose a department or type your own below.</p>
              <div className="chatbot-quick-row">
                {APPOINTMENT_DEPARTMENTS.map((department) => (
                  <button key={department} type="button" className="chatbot-quick-reply" onClick={() => handleDepartmentSelect(department)}>
                    {department}
                  </button>
                ))}
              </div>
            </div>
          )}

          {appointmentStep === 'date' && (
            <div className="chatbot-appointment-panel chatbot-appointment-panel-date">
              <p className="chatbot-appointment-title">Select your preferred date and time.</p>
              <div className="chatbot-date-controls">
                <input type="date" min={minimumDate} value={appointmentDateValue} onChange={(event) => setAppointmentDateValue(event.target.value)} />
                <select value={appointmentTimeValue} onChange={(event) => setAppointmentTimeValue(event.target.value)}>
                  {APPOINTMENT_TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              <button type="button" className="chatbot-confirm-button" onClick={handleDateSelectionSubmit}>
                Confirm Date
              </button>
            </div>
          )}

          {appointmentStep === 'notes' && appointmentInputMode !== 'notes' && (
            <div className="chatbot-appointment-panel">
              <p className="chatbot-appointment-title">Add extra notes if needed, or skip this step.</p>
              <div className="chatbot-quick-row">
                <button type="button" className="chatbot-quick-reply" onClick={handleWriteNotes}>
                  Write notes
                </button>
                <button type="button" className="chatbot-quick-reply" onClick={handleSkipNotes}>
                  Skip notes
                </button>
              </div>
            </div>
          )}

          <form className="chatbot-input-row" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={appointmentInputPlaceholder}
              disabled={isTextInputDisabled}
            />
            <button type="submit">Send</button>
          </form>

          {appointmentStep !== 'idle' && <p className="chatbot-helper">Type "cancel" anytime to stop the appointment flow.</p>}
        </section>
      )}

      <button type="button" className={`chatbot-launcher ${hasUnreadPrompt ? 'is-highlighted' : ''}`} onClick={() => setIsOpen((current) => !current)}>
        <span className="chatbot-launcher-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 3c5 0 9 3.5 9 7.8 0 4.2-4 7.7-9 7.7-.7 0-1.3-.1-2-.2L5 21l1.2-4.1C4.2 15.5 3 13.3 3 10.8 3 6.5 7 3 12 3Zm-4.2 7.2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm4.2 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm4.2 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" fill="currentColor" />
          </svg>
        </span>
        <span>{isOpen ? 'Close Chat' : 'Chat with RRDCH'}</span>
      </button>
    </div>
  )
}

export default Chatbot

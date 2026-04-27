const query = (name: string) => name as any
const mutation = (name: string) => name as any

export type ViewerProfile = {
  _id: string
  name?: string
  email?: string
  phone?: string
  image?: string
  role?: 'patient' | 'student' | 'doctor' | 'admin'
}

export type AppointmentRecord = {
  _id: string
  patientName: string
  patientEmail: string
  patientPhone: string
  department: string
  doctorId: string
  date: string
  timeSlot: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  appointmentId: string
  notes?: string
  amountPaise: number
  paymentStatus: 'not_required' | 'pending' | 'paid' | 'failed' | 'refunded'
  paymentOrderId?: string
  paymentId?: string
  source: 'web' | 'android' | 'ios'
  createdAt: number
  userId?: string
  notificationStatus?: 'idle' | 'pending' | 'sent' | 'skipped' | 'failed'
  confirmationSentAt?: number
  notificationError?: string
}

export type ComplaintRecord = {
  _id: string
  submittedBy: string
  category: 'maintenance' | 'food' | 'safety' | 'other'
  description: string
  status: 'open' | 'in_progress' | 'resolved'
  referenceId: string
  hostelBlock?: string
  roomNumber?: string
  createdAt: number
  updatedAt: number
}

export type ReportRecord = {
  _id: string
  patientId: string
  reportType: 'lab' | 'radiology' | 'pathology' | 'prescription' | 'other'
  appointmentId?: string
  externalFileKey?: string
  externalFileUrl?: string
  deliveryStatus: 'pending' | 'sent' | 'failed'
  uploadedAt: number
  expiryTime: number
  archivedAt?: number
}

export type AnnouncementRecord = {
  _id: string
  title: string
  body: string
  targetAudience: 'patients' | 'students' | 'all'
  publishedBy: string
  isActive: boolean
  publishedAt: number
}

export const convexApi = {
  users: {
    viewerProfile: query('users:viewerProfile'),
    ensureViewerProfile: mutation('users:ensureViewerProfile'),
    upsertViewerProfile: mutation('users:upsertViewerProfile')
  },
  appointments: {
    createBooking: mutation('appointments:createBooking'),
    listForViewer: query('appointments:listForViewer')
  },
  complaints: {
    listBySubmitter: query('complaints:listBySubmitter')
  },
  announcements: {
    listActive: query('announcements:listActive')
  },
  reports: {
    listForViewer: query('reports:listForViewer')
  }
}

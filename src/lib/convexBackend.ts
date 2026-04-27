import { ConvexHttpClient } from 'convex/browser'
import { makeFunctionReference } from 'convex/server'

type BookingPayload = {
  patientName: string
  patientEmail: string
  patientPhone: string
  department: string
  doctorId: string
  date: string
  timeSlot: string
  notes?: string
  amountPaise: number
  source: 'web' | 'android' | 'ios'
}

type BookingResponse = {
  appointmentId: string
  id: string
  confirmedImmediately: boolean
  requiresPayment: boolean
}

type ComplaintPayload = {
  submittedBy: string
  category: 'maintenance' | 'food' | 'safety' | 'other'
  description: string
  hostelBlock?: string
  roomNumber?: string
}

type ComplaintResponse = {
  referenceId: string
  id: string
}

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined

let client: ConvexHttpClient | null = null

const createBookingMutation = makeFunctionReference<'mutation'>('appointments:createBooking')
const createComplaintMutation = makeFunctionReference<'mutation'>('complaints:createComplaint')

const getClient = () => {
  if (!convexUrl) {
    throw new Error('VITE_CONVEX_URL is not configured. Add it to .env.local and restart frontend.')
  }

  if (!client) {
    client = new ConvexHttpClient(convexUrl)
  }

  return client
}

export const isConvexConfigured = Boolean(convexUrl)

export const createAppointmentBooking = async (payload: BookingPayload) => {
  const response = await getClient().mutation(createBookingMutation, payload)
  return response as BookingResponse
}

export const submitContactComplaint = async (payload: ComplaintPayload) => {
  const response = await getClient().mutation(createComplaintMutation, payload)
  return response as ComplaintResponse
}

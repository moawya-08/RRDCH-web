"use node"

import { v } from 'convex/values'
import { action } from './_generated/server'

function disabledPaymentError() {
  throw new Error('Online payments are disabled. Payments are tracked manually by the front desk.')
}

export const createOrderForAppointment = action({
  args: {
    appointmentId: v.string(),
  },
  handler: async () => disabledPaymentError(),
})

export const verifyPaymentAndConfirmAppointment = action({
  args: {
    appointmentId: v.string(),
    razorpayOrderId: v.string(),
    razorpayPaymentId: v.string(),
    razorpaySignature: v.string(),
  },
  handler: async () => disabledPaymentError(),
})

"use node"

import { v } from 'convex/values'
import { internalAction } from './_generated/server'
import { internal } from './_generated/api'

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 10) {
    return `91${digits}`
  }
  return digits
}

function buildMessage(args: { date: string; timeSlot: string; department: string; doctorName: string }) {
  return `✅ *Appointment Confirmed*

Dear Patient,

Your appointment has been successfully booked!

📅 Date: ${args.date}
⏰ Time: ${args.timeSlot}
🏥 Department: ${args.department}
👨‍⚕️ Doctor: ${args.doctorName}

Please arrive 15 minutes before your appointment time.

Thank you for choosing RRDCH!

---
Rajarajeshwari Dental College & Hospital`
}

function messageToHtml(message: string) {
  const escaped = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return `<p style="margin:0;white-space:pre-wrap;font-family:Arial,sans-serif;line-height:1.5;">${escaped}</p>`
}

async function sendWhatsApp(args: { phoneNumber: string; message: string; patientName: string; date: string; timeSlot: string }) {
  const whatsappApiUrl = process.env.WHATSAPP_API_URL
  if (!whatsappApiUrl) {
    return { status: 'skipped' as const, detail: 'WHATSAPP_API_URL is not configured.' }
  }

  const secret = process.env.WHATSAPP_API_SECRET
  const response = await fetch(`${whatsappApiUrl.replace(/\/$/, '')}/api/send-appointment-confirmation`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(secret ? { authorization: `Bearer ${secret}` } : {}),
    },
    body: JSON.stringify({
      phoneNumber: normalizePhone(args.phoneNumber),
      patientName: args.patientName,
      date: args.date,
      timeSlot: args.timeSlot,
      message: args.message,
    }),
  })

  if (!response.ok) {
    throw new Error(`WhatsApp failed: ${await response.text()}`)
  }

  return { status: 'sent' as const }
}

async function sendEmail(args: { to: string; patientName: string; message: string }) {
  const resendApiKey = process.env.RESEND_API_KEY
  const emailFrom = process.env.EMAIL_FROM
  if (!resendApiKey || !emailFrom) {
    return { status: 'skipped' as const, detail: 'RESEND_API_KEY or EMAIL_FROM is not configured.' }
  }

  const recipient = args.to.trim().toLowerCase()
  if (!recipient) {
    return { status: 'skipped' as const, detail: 'Patient email is missing.' }
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${resendApiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: emailFrom,
      to: recipient,
      subject: 'RRDCH appointment confirmed',
      text: args.message,
      html: messageToHtml(args.message),
    }),
  })

  if (!response.ok) {
    throw new Error(`Email failed: ${await response.text()}`)
  }

  return { status: 'sent' as const }
}

export const sendBookingConfirmation = internalAction({
  args: {
    appointmentId: v.string(),
    patientName: v.string(),
    patientEmail: v.string(),
    patientPhone: v.string(),
    date: v.string(),
    timeSlot: v.string(),
    department: v.string(),
    doctorName: v.string(),
  },
  handler: async (ctx, args) => {
    const message = buildMessage({
      date: args.date,
      timeSlot: args.timeSlot,
      department: args.department,
      doctorName: args.doctorName,
    })
    const failures: string[] = []
    const skipped: string[] = []
    let sentCount = 0

    try {
      const result = await sendWhatsApp({
        phoneNumber: args.patientPhone,
        patientName: args.patientName,
        date: args.date,
        timeSlot: args.timeSlot,
        message,
      })
      if (result.status === 'sent') sentCount += 1
      if (result.status === 'skipped' && result.detail) skipped.push(result.detail)
    } catch (error) {
      failures.push(error instanceof Error ? error.message : 'WhatsApp notification failed.')
    }

    try {
      const result = await sendEmail({
        to: args.patientEmail,
        patientName: args.patientName,
        message,
      })
      if (result.status === 'sent') sentCount += 1
      if (result.status === 'skipped' && result.detail) skipped.push(result.detail)
    } catch (error) {
      failures.push(error instanceof Error ? error.message : 'Email notification failed.')
    }

    const status = failures.length > 0 ? 'failed' : sentCount > 0 ? 'sent' : 'skipped'
    await ctx.runMutation(internal.appointments.markConfirmationNotification, {
      appointmentId: args.appointmentId,
      status,
      error: [...failures, ...skipped].join(' | ') || undefined,
    })

    return { status, sentCount, failures, skipped }
  },
})

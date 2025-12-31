import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'

const router = Router()

// n8n Webhook endpoint for appointment notifications
router.post('/n8n/appointment', async (req: Request, res: Response) => {
  try {
    const { appointmentId, action, data } = req.body

    console.log('n8n Appointment Webhook:', { appointmentId, action })

    switch (action) {
      case 'confirm':
        await prisma.appointment.update({
          where: { id: appointmentId },
          data: { status: 'CONFIRMED' }
        })
        break

      case 'cancel':
        await prisma.appointment.update({
          where: { id: appointmentId },
          data: { status: 'CANCELLED' }
        })
        break

      case 'reschedule':
        if (data?.newScheduledAt) {
          await prisma.appointment.update({
            where: { id: appointmentId },
            data: { scheduledAt: new Date(data.newScheduledAt) }
          })
        }
        break

      case 'reminder':
        // Log reminder sent
        console.log('Reminder sent for appointment:', appointmentId)
        break
    }

    res.json({ success: true, action })
  } catch (error) {
    console.error('n8n appointment webhook error:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
})

// n8n Webhook endpoint for call notifications
router.post('/n8n/call', async (req: Request, res: Response) => {
  try {
    const { callId, action, data } = req.body

    console.log('n8n Call Webhook:', { callId, action })

    switch (action) {
      case 'transcribe':
        if (data?.transcript) {
          await prisma.callLog.update({
            where: { id: callId },
            data: { transcript: data.transcript }
          })
        }
        break

      case 'summarize':
        if (data?.summary) {
          await prisma.callLog.update({
            where: { id: callId },
            data: { summary: data.summary }
          })
        }
        break
    }

    res.json({ success: true, action })
  } catch (error) {
    console.error('n8n call webhook error:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
})

// n8n Webhook endpoint for notification triggers
router.post('/n8n/notification', async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body

    console.log('n8n Notification Webhook:', { type, data })

    // This endpoint receives notifications from n8n workflows
    // It can be used to trigger actions in the system

    switch (type) {
      case 'APPOINTMENT_REMINDER':
        // Handle appointment reminder logic
        console.log('Processing appointment reminder:', data)
        break

      case 'FOLLOW_UP':
        // Handle follow-up notification
        console.log('Processing follow-up:', data)
        break

      case 'PRESCRIPTION_READY':
        // Handle prescription ready notification
        console.log('Processing prescription notification:', data)
        break
    }

    res.json({ success: true, type })
  } catch (error) {
    console.error('n8n notification webhook error:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
})

// Health check for webhooks
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    webhooks: {
      appointment: '/api/webhooks/n8n/appointment',
      call: '/api/webhooks/n8n/call',
      notification: '/api/webhooks/n8n/notification'
    },
    timestamp: new Date().toISOString()
  })
})

export default router


import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import axios from 'axios'

const router = Router()

const VAPI_API_KEY = process.env.VAPI_API_KEY
const VAPI_BASE_URL = 'https://api.vapi.ai'

// VAPI Assistant Configuration for Doctor's Calling Agent
const DOCTOR_ASSISTANT_CONFIG = {
  name: 'Medical Office Assistant',
  model: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    systemPrompt: `You are a professional medical office assistant for a doctor's clinic. Your role is to:

1. Greet callers warmly and professionally
2. Handle appointment inquiries and bookings
3. Provide clinic information (hours, location, services)
4. Take messages for the doctor when unavailable
5. Handle prescription refill requests (note them down)
6. Triage urgent calls appropriately

Guidelines:
- Be empathetic and professional
- Collect caller's name and phone number
- Ask about the reason for their call
- For appointments, ask preferred date/time
- For urgent medical emergencies, advise calling emergency services (1122)
- Keep responses concise and helpful
- Always confirm information before ending the call

Clinic Information:
- Hours: Monday-Friday 9 AM to 5 PM, Saturday 10 AM to 2 PM
- Services: General consultation, follow-up visits, prescription refills
- Location: Will be provided by the doctor's profile`
  },
  voice: {
    provider: 'elevenlabs',
    voiceId: 'rachel' // Professional female voice
  },
  firstMessage: 'Hello, thank you for calling the medical office. How may I assist you today?',
  endCallMessage: 'Thank you for calling. Have a great day and take care of your health!',
  recordingEnabled: true,
  transcriptionEnabled: true
}

// Create or update VAPI assistant for a doctor
router.post('/assistant/create', async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.body

    if (!VAPI_API_KEY) {
      return res.status(500).json({ 
        error: 'VAPI API key not configured',
        message: 'Please configure VAPI_API_KEY in environment variables'
      })
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { specialty: true }
    })

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' })
    }

    // Customize assistant for this doctor
    const assistantConfig = {
      ...DOCTOR_ASSISTANT_CONFIG,
      name: `${doctor.firstName} ${doctor.lastName}'s Office Assistant`,
      model: {
        ...DOCTOR_ASSISTANT_CONFIG.model,
        systemPrompt: DOCTOR_ASSISTANT_CONFIG.model.systemPrompt + `

Doctor Information:
- Name: Dr. ${doctor.firstName} ${doctor.lastName}
- Specialty: ${doctor.specialty.name}
- Location: ${doctor.address}, ${doctor.city}
- Working Hours: ${doctor.availableFrom} to ${doctor.availableTo}
- Working Days: ${doctor.workingDays.join(', ')}
- Consultation Fee: Rs. ${doctor.consultationFee}`
      }
    }

    // Create assistant in VAPI
    const response = await axios.post(
      `${VAPI_BASE_URL}/assistant`,
      assistantConfig,
      {
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    res.json({
      message: 'VAPI assistant created successfully',
      assistantId: response.data.id,
      assistant: response.data
    })
  } catch (error: any) {
    console.error('Create VAPI assistant error:', error.response?.data || error.message)
    res.status(500).json({ 
      error: 'Failed to create VAPI assistant',
      details: error.response?.data || error.message
    })
  }
})

// Get call logs for a doctor
router.get('/calls/:doctorId', async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params
    const { limit = '20', offset = '0' } = req.query

    const callLogs = await prisma.callLog.findMany({
      where: { doctorId },
      orderBy: { startedAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    })

    res.json(callLogs)
  } catch (error) {
    console.error('Get call logs error:', error)
    res.status(500).json({ error: 'Failed to fetch call logs' })
  }
})

// VAPI Webhook - Handle call events
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const { type, call, transcript, summary } = req.body

    console.log('VAPI Webhook received:', type)

    switch (type) {
      case 'call-started':
        // Log call start
        await prisma.callLog.create({
          data: {
            doctorId: call.metadata?.doctorId || '',
            callerPhone: call.customer?.number || 'Unknown',
            callerName: call.customer?.name || 'Unknown Caller',
            callType: 'INCOMING',
            status: 'ACTIVE',
            vapiCallId: call.id
          }
        })
        break

      case 'call-ended':
        // Update call log with duration and transcript
        if (call.id) {
          await prisma.callLog.updateMany({
            where: { vapiCallId: call.id },
            data: {
              status: 'COMPLETED',
              endedAt: new Date(),
              duration: call.duration || 0,
              transcript: transcript || null,
              summary: summary || null
            }
          })
        }
        break

      case 'transcript':
        // Handle real-time transcript updates if needed
        console.log('Transcript update:', transcript)
        break

      case 'function-call':
        // Handle function calls from the assistant
        // This can be used to book appointments, etc.
        const { functionName, parameters } = req.body
        
        if (functionName === 'book_appointment') {
          // Handle appointment booking
          console.log('Booking appointment:', parameters)
        }
        break
    }

    res.json({ received: true })
  } catch (error) {
    console.error('VAPI webhook error:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
})

// Initiate an outbound call
router.post('/call/outbound', async (req: Request, res: Response) => {
  try {
    const { doctorId, phoneNumber, assistantId, message } = req.body

    if (!VAPI_API_KEY) {
      return res.status(500).json({ error: 'VAPI API key not configured' })
    }

    if (!phoneNumber || !assistantId) {
      return res.status(400).json({ error: 'Phone number and assistant ID are required' })
    }

    const response = await axios.post(
      `${VAPI_BASE_URL}/call/phone`,
      {
        assistantId,
        customer: {
          number: phoneNumber
        },
        metadata: {
          doctorId,
          callType: 'outbound'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    // Log the outbound call
    await prisma.callLog.create({
      data: {
        doctorId,
        callerPhone: phoneNumber,
        callType: 'OUTGOING',
        status: 'ACTIVE',
        vapiCallId: response.data.id
      }
    })

    res.json({
      message: 'Outbound call initiated',
      callId: response.data.id
    })
  } catch (error: any) {
    console.error('Outbound call error:', error.response?.data || error.message)
    res.status(500).json({ 
      error: 'Failed to initiate call',
      details: error.response?.data || error.message
    })
  }
})

// Get VAPI assistant configuration template
router.get('/assistant/template', (req: Request, res: Response) => {
  res.json({
    message: 'VAPI Assistant Configuration Template',
    template: DOCTOR_ASSISTANT_CONFIG,
    instructions: {
      step1: 'Sign up at https://vapi.ai and get your API key',
      step2: 'Add VAPI_API_KEY to your .env file',
      step3: 'Use POST /api/vapi/assistant/create to create an assistant for a doctor',
      step4: 'Configure the webhook URL in VAPI dashboard to: YOUR_DOMAIN/api/vapi/webhook',
      step5: 'Assign a phone number to your assistant in VAPI dashboard'
    }
  })
})

export default router


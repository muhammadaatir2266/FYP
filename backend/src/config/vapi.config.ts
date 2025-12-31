/**
 * VAPI Configuration for Smart Doctor Calling Agent
 * 
 * This configuration defines how the AI voice assistant behaves
 * when handling calls for doctor's offices.
 */

export interface VapiAssistantConfig {
  name: string
  model: {
    provider: string
    model: string
    systemPrompt: string
    temperature?: number
    maxTokens?: number
  }
  voice: {
    provider: string
    voiceId: string
  }
  firstMessage: string
  endCallMessage: string
  recordingEnabled: boolean
  transcriptionEnabled: boolean
  functions?: VapiFunction[]
}

export interface VapiFunction {
  name: string
  description: string
  parameters: {
    type: string
    properties: Record<string, {
      type: string
      description: string
      enum?: string[]
    }>
    required: string[]
  }
}

// Function definitions for VAPI assistant
export const VAPI_FUNCTIONS: VapiFunction[] = [
  {
    name: 'book_appointment',
    description: 'Book an appointment with the doctor for a patient',
    parameters: {
      type: 'object',
      properties: {
        patientName: {
          type: 'string',
          description: 'Full name of the patient'
        },
        patientPhone: {
          type: 'string',
          description: 'Phone number of the patient'
        },
        preferredDate: {
          type: 'string',
          description: 'Preferred date for the appointment (YYYY-MM-DD format)'
        },
        preferredTime: {
          type: 'string',
          description: 'Preferred time for the appointment (HH:MM format)'
        },
        reason: {
          type: 'string',
          description: 'Reason for the appointment'
        }
      },
      required: ['patientName', 'patientPhone', 'preferredDate', 'reason']
    }
  },
  {
    name: 'check_availability',
    description: 'Check available appointment slots for a specific date',
    parameters: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Date to check availability (YYYY-MM-DD format)'
        }
      },
      required: ['date']
    }
  },
  {
    name: 'cancel_appointment',
    description: 'Cancel an existing appointment',
    parameters: {
      type: 'object',
      properties: {
        patientPhone: {
          type: 'string',
          description: 'Phone number used for the appointment'
        },
        appointmentDate: {
          type: 'string',
          description: 'Date of the appointment to cancel'
        }
      },
      required: ['patientPhone', 'appointmentDate']
    }
  },
  {
    name: 'take_message',
    description: 'Take a message for the doctor when they are unavailable',
    parameters: {
      type: 'object',
      properties: {
        callerName: {
          type: 'string',
          description: 'Name of the caller'
        },
        callerPhone: {
          type: 'string',
          description: 'Phone number of the caller'
        },
        message: {
          type: 'string',
          description: 'Message to leave for the doctor'
        },
        urgency: {
          type: 'string',
          description: 'Urgency level of the message',
          enum: ['low', 'medium', 'high', 'urgent']
        }
      },
      required: ['callerName', 'callerPhone', 'message']
    }
  },
  {
    name: 'request_prescription_refill',
    description: 'Request a prescription refill for an existing patient',
    parameters: {
      type: 'object',
      properties: {
        patientName: {
          type: 'string',
          description: 'Name of the patient'
        },
        patientPhone: {
          type: 'string',
          description: 'Phone number of the patient'
        },
        medicationName: {
          type: 'string',
          description: 'Name of the medication to refill'
        },
        pharmacyName: {
          type: 'string',
          description: 'Preferred pharmacy for the prescription'
        }
      },
      required: ['patientName', 'patientPhone', 'medicationName']
    }
  },
  {
    name: 'transfer_to_emergency',
    description: 'Transfer the call to emergency services for urgent medical situations',
    parameters: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
          description: 'Reason for emergency transfer'
        }
      },
      required: ['reason']
    }
  }
]

// Base assistant configuration template
export const BASE_ASSISTANT_CONFIG: VapiAssistantConfig = {
  name: 'Medical Office Assistant',
  model: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    systemPrompt: `You are a professional, empathetic medical office assistant for a doctor's clinic. Your primary responsibilities include:

## Core Responsibilities
1. **Greeting Callers**: Warmly greet callers and identify their needs
2. **Appointment Management**: Handle appointment inquiries, bookings, and cancellations
3. **Information Provider**: Share clinic hours, location, and available services
4. **Message Taking**: Record messages for the doctor when unavailable
5. **Prescription Refills**: Process prescription refill requests
6. **Emergency Triage**: Identify urgent situations and direct appropriately

## Communication Guidelines
- Be warm, professional, and empathetic at all times
- Speak clearly and at a moderate pace
- Confirm information by repeating it back to the caller
- Use the patient's name when addressing them
- Apologize for any inconvenience and offer solutions

## Information Collection
When booking appointments, collect:
1. Patient's full name
2. Contact phone number
3. Preferred date and time
4. Reason for visit

## Emergency Protocol
If a caller describes symptoms that sound like a medical emergency:
- Chest pain with shortness of breath
- Severe bleeding
- Loss of consciousness
- Difficulty breathing
- Signs of stroke (face drooping, arm weakness, speech difficulty)

Immediately advise them to:
1. Call emergency services (1122 in Pakistan, 911 in US)
2. Go to the nearest emergency room
3. Do NOT wait for an appointment

## Closing Calls
- Summarize any actions taken or information provided
- Confirm next steps with the caller
- Thank them for calling
- Wish them well

Remember: You are the first point of contact for patients. Your professionalism and empathy directly impact their healthcare experience.`,
    temperature: 0.7,
    maxTokens: 500
  },
  voice: {
    provider: 'elevenlabs',
    voiceId: 'rachel' // Professional female voice
  },
  firstMessage: 'Assalam o Alaikum, thank you for calling the medical office. This is your AI assistant. How may I help you today?',
  endCallMessage: 'Thank you for calling. Please take care of your health, and don\'t hesitate to reach out if you need any assistance. Allah Hafiz!',
  recordingEnabled: true,
  transcriptionEnabled: true,
  functions: VAPI_FUNCTIONS
}

/**
 * Generate a customized assistant configuration for a specific doctor
 */
export function generateDoctorAssistantConfig(doctor: {
  firstName: string
  lastName: string
  specialty: string
  address: string
  city: string
  phone: string
  availableFrom: string | null
  availableTo: string | null
  workingDays: string[]
  consultationFee: number | null
}): VapiAssistantConfig {
  const customSystemPrompt = `${BASE_ASSISTANT_CONFIG.model.systemPrompt}

## Doctor Information
- **Name**: Dr. ${doctor.firstName} ${doctor.lastName}
- **Specialty**: ${doctor.specialty}
- **Location**: ${doctor.address}, ${doctor.city}
- **Contact**: ${doctor.phone}
- **Working Hours**: ${doctor.availableFrom || '09:00'} to ${doctor.availableTo || '17:00'}
- **Working Days**: ${doctor.workingDays.join(', ')}
- **Consultation Fee**: Rs. ${doctor.consultationFee || 'Contact for pricing'}

When patients ask about the doctor's availability, refer to these working hours and days.
When patients ask about fees, mention the consultation fee listed above.`

  return {
    ...BASE_ASSISTANT_CONFIG,
    name: `Dr. ${doctor.firstName} ${doctor.lastName}'s Office Assistant`,
    model: {
      ...BASE_ASSISTANT_CONFIG.model,
      systemPrompt: customSystemPrompt
    },
    firstMessage: `Assalam o Alaikum, thank you for calling Dr. ${doctor.firstName} ${doctor.lastName}'s ${doctor.specialty} clinic. This is your AI assistant. How may I help you today?`
  }
}

/**
 * VAPI Webhook event types
 */
export type VapiWebhookEventType = 
  | 'call-started'
  | 'call-ended'
  | 'transcript'
  | 'function-call'
  | 'speech-update'
  | 'hang'
  | 'transfer'

export interface VapiWebhookPayload {
  type: VapiWebhookEventType
  call?: {
    id: string
    orgId: string
    createdAt: string
    updatedAt: string
    type: 'inbound' | 'outbound'
    status: 'queued' | 'ringing' | 'in-progress' | 'forwarding' | 'ended'
    endedReason?: string
    duration?: number
    customer?: {
      number: string
      name?: string
    }
    metadata?: Record<string, any>
  }
  transcript?: string
  summary?: string
  functionName?: string
  parameters?: Record<string, any>
}

export default {
  BASE_ASSISTANT_CONFIG,
  VAPI_FUNCTIONS,
  generateDoctorAssistantConfig
}


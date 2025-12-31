import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import { getChatCompletion, extractSymptoms, extractSpecialist, isUrgent } from '../lib/openai'
import axios from 'axios'

const router = Router()

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface AnalyzeRequest {
  message: string
  location?: string
  conversationHistory?: ChatMessage[]
}

// Analyze symptoms and provide recommendations
router.post('/analyze', async (req: Request<{}, {}, AnalyzeRequest>, res: Response) => {
  try {
    const { message, location, conversationHistory = [] } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Get AI response
    let aiResponse: string
    try {
      aiResponse = await getChatCompletion(conversationHistory, message)
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError)
      // Provide a fallback response
      aiResponse = generateFallbackResponse(message)
    }

    // Extract symptoms and specialist recommendation from AI response
    const symptoms = extractSymptoms(aiResponse)
    const recommendedSpecialist = extractSpecialist(aiResponse)
    const urgent = isUrgent(aiResponse)

    // Clean the response by removing the metadata tags
    let cleanResponse = aiResponse
      .replace(/\[SYMPTOMS:[^\]]+\]/g, '')
      .replace(/\[SPECIALIST:[^\]]+\]/g, '')
      .replace(/\[URGENT:[^\]]+\]/g, '')
      .trim()

    // Get prediction from ML model if symptoms are identified
    let prediction = null
    if (symptoms.length > 0) {
      try {
        const mlResponse = await axios.post(
          `${process.env.ML_MODEL_API_URL}/predict`,
          { symptoms },
          { timeout: 5000 }
        )
        prediction = mlResponse.data
      } catch (mlError) {
        console.log('ML Model not available, using fallback prediction')
        prediction = await getFallbackPrediction(symptoms)
      }
    }

    // Get doctor recommendations if specialist is identified
    let doctors: any[] = []
    if (recommendedSpecialist || symptoms.length > 0) {
      doctors = await getDoctorRecommendations(
        recommendedSpecialist || 'General Physician',
        location || 'Taxila'
      )
    }

    // Add urgent warning if needed
    if (urgent) {
      cleanResponse = `⚠️ **IMPORTANT**: Based on your symptoms, I recommend seeking immediate medical attention.\n\n${cleanResponse}`
    }

    res.json({
      message: cleanResponse,
      prediction,
      doctors,
      symptoms,
      recommendedSpecialist,
      urgent
    })
  } catch (error) {
    console.error('Chat analysis error:', error)
    res.status(500).json({ 
      error: 'Failed to analyze symptoms',
      message: 'Please try again later'
    })
  }
})

// Get chat history for a session
router.get('/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params

    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        },
        predictions: {
          include: { disease: true }
        }
      }
    })

    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    res.json(session)
  } catch (error) {
    console.error('Get session error:', error)
    res.status(500).json({ error: 'Failed to get chat session' })
  }
})

// Helper function to get doctor recommendations
async function getDoctorRecommendations(specialty: string, city: string) {
  try {
    const doctors = await prisma.doctor.findMany({
      where: {
        isActive: true,
        isVerified: true,
        OR: [
          { specialty: { name: { contains: specialty, mode: 'insensitive' } } },
          { city: { contains: city, mode: 'insensitive' } }
        ]
      },
      include: {
        specialty: true
      },
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' }
      ],
      take: 5
    })

    return doctors.map(doc => ({
      id: doc.id,
      name: `Dr. ${doc.firstName} ${doc.lastName}`,
      specialty: doc.specialty.name,
      rating: doc.rating,
      distance: calculateDistance(city, doc.city),
      address: `${doc.address}, ${doc.city}`,
      phone: doc.phone,
      available: isAvailableToday(doc.workingDays, doc.availableFrom, doc.availableTo),
      consultationFee: doc.consultationFee
    }))
  } catch (error) {
    console.error('Error fetching doctors:', error)
    return []
  }
}

// Helper function to calculate approximate distance
function calculateDistance(userCity: string, doctorCity: string): string {
  if (userCity.toLowerCase() === doctorCity.toLowerCase()) {
    return '< 5 km'
  }
  // Approximate distances between cities in the region
  const distances: Record<string, Record<string, string>> = {
    'taxila': { 'rawalpindi': '35 km', 'islamabad': '40 km', 'wah cantt': '5 km' },
    'rawalpindi': { 'taxila': '35 km', 'islamabad': '15 km', 'wah cantt': '30 km' },
    'islamabad': { 'taxila': '40 km', 'rawalpindi': '15 km', 'wah cantt': '35 km' },
    'wah cantt': { 'taxila': '5 km', 'rawalpindi': '30 km', 'islamabad': '35 km' }
  }
  
  const userCityLower = userCity.toLowerCase()
  const doctorCityLower = doctorCity.toLowerCase()
  
  return distances[userCityLower]?.[doctorCityLower] || '~20 km'
}

// Helper function to check if doctor is available today
function isAvailableToday(workingDays: string[], availableFrom?: string | null, availableTo?: string | null): boolean {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const isWorkingDay = workingDays.includes(today)
  
  if (!isWorkingDay || !availableFrom || !availableTo) {
    return false
  }

  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  
  return currentTime >= availableFrom && currentTime <= availableTo
}

// Fallback prediction when ML model is not available
async function getFallbackPrediction(symptoms: string[]) {
  try {
    // Try to find matching disease based on symptoms in database
    const disease = await prisma.disease.findFirst({
      where: {
        symptoms: {
          some: {
            symptom: {
              name: {
                in: symptoms.map(s => s.charAt(0).toUpperCase() + s.slice(1))
              }
            }
          }
        }
      },
      include: {
        recommendedSpecialty: true
      }
    })

    if (disease) {
      return {
        disease: disease.name,
        confidence: 70,
        description: disease.description,
        precautions: disease.precautions
      }
    }

    return {
      disease: 'General Health Concern',
      confidence: 50,
      description: 'Based on your symptoms, a general health consultation is recommended.',
      precautions: [
        'Rest and stay hydrated',
        'Monitor your symptoms',
        'Consult a healthcare professional if symptoms persist',
        'Avoid self-medication'
      ]
    }
  } catch (error) {
    return null
  }
}

// Generate fallback response when OpenAI is not available
function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('headache') || lowerMessage.includes('head pain')) {
    return `I understand you're experiencing headache symptoms. Headaches can have various causes including stress, dehydration, lack of sleep, or underlying conditions.

[SYMPTOMS: headache]
[SPECIALIST: General Physician]

Could you tell me more about:
- How long have you had this headache?
- Is it accompanied by any other symptoms like nausea, sensitivity to light, or fever?
- Have you been under stress recently?

In the meantime, try to rest in a quiet, dark room, stay hydrated, and avoid screen time if possible.`
  }

  if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
    return `I see you're experiencing fever. Fever is often a sign that your body is fighting an infection.

[SYMPTOMS: fever]
[SPECIALIST: General Physician]

To help me understand better:
- What is your temperature reading?
- Do you have any other symptoms like cough, body aches, or sore throat?
- How long have you had the fever?

Make sure to stay hydrated and rest. If your fever is above 103°F (39.4°C) or persists for more than 3 days, please seek immediate medical attention.`
  }

  if (lowerMessage.includes('chest pain') || lowerMessage.includes('heart')) {
    return `Chest pain is a symptom that should be taken seriously.

[SYMPTOMS: chest pain]
[SPECIALIST: Cardiologist]
[URGENT: true]

⚠️ If you're experiencing severe chest pain, especially with shortness of breath, pain radiating to your arm or jaw, or excessive sweating, please seek emergency medical care immediately.

Can you describe:
- Where exactly is the pain located?
- Is it sharp or dull?
- Does it worsen with movement or breathing?`
  }

  return `Thank you for sharing your symptoms with me. I'm here to help you understand your health concerns better.

To provide you with the most accurate guidance, could you please describe:
- Your main symptoms in detail
- How long you've been experiencing them
- Any other symptoms you've noticed
- Your location (so I can recommend nearby doctors)

Remember, while I can provide general health information, it's important to consult with a qualified healthcare professional for proper diagnosis and treatment.`
}

export default router


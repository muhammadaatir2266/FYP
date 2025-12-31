'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Send, 
  Stethoscope, 
  Brain, 
  ArrowLeft, 
  Sparkles,
  MapPin,
  Phone,
  Star,
  Clock,
  User,
  Loader2
} from 'lucide-react'
import axios from 'axios'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  doctors?: Doctor[]
  prediction?: PredictionResult
}

interface Doctor {
  id: string
  name: string
  specialty: string
  rating: number
  distance: string
  address: string
  phone: string
  available: boolean
}

interface PredictionResult {
  disease: string
  confidence: number
  description: string
  precautions: string[]
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI medical assistant powered by advanced machine learning. I can help you understand your symptoms, predict potential conditions, and recommend doctors near you.\n\nPlease describe your symptoms in detail, and I'll analyze them for you. Remember, this is for informational purposes only and not a substitute for professional medical advice.",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Call the backend API for symptom analysis
      const response = await axios.post(`${API_URL}/chat/analyze`, {
        message: input,
        location: userLocation,
        conversationHistory: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      })

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date(),
        prediction: response.data.prediction,
        doctors: response.data.doctors
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      // Fallback response if API is not available
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm currently unable to connect to the analysis service. Please ensure the backend server is running.\n\nIn the meantime, here's what I can tell you:\n\n**For any concerning symptoms, please:**\n- Contact your healthcare provider\n- Visit an urgent care facility if symptoms are severe\n- Call emergency services (911) for life-threatening conditions\n\nOnce the system is fully operational, I'll be able to analyze your symptoms and recommend appropriate specialists.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-medical-teal to-medical-emerald flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-display font-semibold text-medical-slate">
                    AI Medical Assistant
                  </h1>
                  <div className="flex items-center gap-1 text-xs text-medical-teal">
                    <span className="w-2 h-2 rounded-full bg-medical-teal animate-pulse" />
                    Online - Ready to help
                  </div>
                </div>
              </div>
            </div>

            {/* Location Input */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Your city (e.g., Taxila)"
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/30 focus:border-medical-teal"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="space-y-6">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex items-start gap-4 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    message.role === 'assistant' 
                      ? 'bg-gradient-to-br from-medical-teal to-medical-emerald' 
                      : 'bg-slate-200'
                  }`}>
                    {message.role === 'assistant' ? (
                      <Brain className="w-5 h-5 text-white" />
                    ) : (
                      <User className="w-5 h-5 text-slate-600" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 max-w-[80%] ${
                    message.role === 'user' ? 'text-right' : ''
                  }`}>
                    <div className={`inline-block rounded-2xl px-5 py-3 ${
                      message.role === 'assistant'
                        ? 'bg-white shadow-sm rounded-tl-none text-left'
                        : 'bg-gradient-to-r from-medical-teal to-medical-emerald text-white rounded-tr-none'
                    }`}>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </p>
                    </div>

                    {/* Prediction Result */}
                    {message.prediction && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 bg-white rounded-2xl p-5 shadow-sm border border-medical-teal/20"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-5 h-5 text-medical-teal" />
                          <span className="font-semibold text-medical-slate">
                            AI Analysis Result
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <span className="text-xs text-slate-500 uppercase tracking-wide">
                              Predicted Condition
                            </span>
                            <p className="font-semibold text-medical-slate">
                              {message.prediction.disease}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-500 uppercase tracking-wide">
                              Confidence
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-medical-teal to-medical-emerald rounded-full"
                                  style={{ width: `${message.prediction.confidence}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-medical-teal">
                                {message.prediction.confidence}%
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-slate-500 uppercase tracking-wide">
                              Description
                            </span>
                            <p className="text-sm text-slate-600">
                              {message.prediction.description}
                            </p>
                          </div>
                          {message.prediction.precautions.length > 0 && (
                            <div>
                              <span className="text-xs text-slate-500 uppercase tracking-wide">
                                Recommended Precautions
                              </span>
                              <ul className="mt-1 space-y-1">
                                {message.prediction.precautions.map((precaution, idx) => (
                                  <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-medical-teal mt-1.5 flex-shrink-0" />
                                    {precaution}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Doctor Recommendations */}
                    {message.doctors && message.doctors.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-5 h-5 text-medical-teal" />
                          <span className="font-semibold text-medical-slate">
                            Recommended Doctors Near You
                          </span>
                        </div>
                        <div className="grid gap-3">
                          {message.doctors.map((doctor) => (
                            <div
                              key={doctor.id}
                              className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:border-medical-teal/30 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-medical-slate">
                                    {doctor.name}
                                  </h4>
                                  <p className="text-sm text-medical-teal">
                                    {doctor.specialty}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-lg">
                                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                  <span className="text-sm font-medium text-amber-700">
                                    {doctor.rating}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-slate-400" />
                                  <span>{doctor.address} ({doctor.distance})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-slate-400" />
                                  <span>{doctor.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-slate-400" />
                                  <span className={doctor.available ? 'text-green-600' : 'text-red-500'}>
                                    {doctor.available ? 'Available Today' : 'Next Available: Tomorrow'}
                                  </span>
                                </div>
                              </div>
                              <button className="mt-3 w-full py-2 bg-gradient-to-r from-medical-teal to-medical-emerald text-white text-sm font-medium rounded-lg hover:shadow-md transition-shadow">
                                Book Appointment
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <p className="text-xs text-slate-400 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-medical-teal to-medical-emerald flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none px-5 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-medical-teal animate-spin" />
                    <span className="text-sm text-slate-500">Analyzing symptoms...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input Area */}
      <div className="glass border-t border-slate-200 sticky bottom-0">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-end gap-4">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your symptoms in detail..."
                rows={1}
                className="w-full px-5 py-3 pr-12 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/30 focus:border-medical-teal resize-none text-sm"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-medical-teal to-medical-emerald text-white rounded-xl hover:shadow-lg hover:shadow-medical-teal/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            This AI assistant provides general health information only. Always consult a qualified healthcare professional for medical advice.
          </p>
        </div>
      </div>
    </div>
  )
}


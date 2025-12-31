'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  User as UserIcon,
  Loader2,
  LogOut,
  Menu,
  X,
  Paperclip,
  Image as ImageIcon
} from 'lucide-react'
import axios from 'axios'
import { getCurrentUser, logoutUser, type User } from '@/lib/auth'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  doctors?: Doctor[]
  prediction?: PredictionResult
  image?: string
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
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
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
  const [attachedImage, setAttachedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== 'patient') {
      router.push('/login')
    } else {
      setCurrentUser(user)
    }
  }, [router])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleLogout = () => {
    logoutUser()
    router.push('/')
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setAttachedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setAttachedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSendMessage = async () => {
    if ((!input.trim() && !attachedImage) || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input || '📷 Sent an image',
      timestamp: new Date(),
      image: imagePreview || undefined
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    const currentImage = attachedImage
    const currentImagePreview = imagePreview
    handleRemoveImage()
    setIsLoading(true)

    try {
      // Prepare form data for image upload
      const formData = new FormData()
      formData.append('message', input)
      formData.append('location', userLocation)
      if (currentImage) {
        formData.append('image', currentImage)
      }
      formData.append('conversationHistory', JSON.stringify(messages.map(m => ({
        role: m.role,
        content: m.content
      }))))

      // Call the backend API for symptom analysis
      const response = await axios.post(`${API_URL}/chat/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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

  if (!currentUser) return null

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200 p-6 flex flex-col transition-transform z-50 ${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-medical-teal to-medical-emerald flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-medical-slate">
              MediAssist<span className="gradient-text">AI</span>
            </span>
          </div>
          <button 
            onClick={() => setShowSidebar(false)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="bg-gradient-to-br from-medical-teal/10 to-medical-emerald/10 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-medical-teal to-medical-emerald flex items-center justify-center text-white font-semibold">
              {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-medical-slate">{currentUser.name}</p>
              <p className="text-xs text-slate-500">Patient</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-medical-teal">
            <span className="w-2 h-2 rounded-full bg-medical-teal animate-pulse" />
            Active Session
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-3 mb-6">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1">Total Consultations</p>
            <p className="text-2xl font-bold text-medical-slate">12</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1">Appointments Booked</p>
            <p className="text-2xl font-bold text-medical-slate">5</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <Link 
            href="/chat"
            className="flex items-center gap-3 px-4 py-3 bg-medical-teal/10 text-medical-teal rounded-xl font-medium"
          >
            <Brain className="w-5 h-5" />
            AI Consultation
          </Link>
          <Link 
            href="/appointments"
            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <Clock className="w-5 h-5" />
            My Appointments
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-slate-200 pt-4 space-y-2">
          <Link 
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col lg:ml-72">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowSidebar(true)}
                  className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
                >
                  <Menu className="w-5 h-5" />
                </button>
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
              <div className="hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                <MapPin className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Your city (e.g., Taxila)"
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  className="bg-transparent text-sm focus:outline-none w-40"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
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
                        : 'bg-gradient-to-br from-slate-200 to-slate-300'
                    }`}>
                      {message.role === 'assistant' ? (
                        <Brain className="w-5 h-5 text-white" />
                      ) : (
                        <UserIcon className="w-5 h-5 text-slate-600" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`flex-1 max-w-[85%] ${
                      message.role === 'user' ? 'text-right' : ''
                    }`}>
                      <div className={`inline-block rounded-2xl px-5 py-3 ${
                        message.role === 'assistant'
                          ? 'bg-white shadow-md rounded-tl-none text-left border border-slate-100'
                          : 'bg-gradient-to-r from-medical-teal to-medical-emerald text-white rounded-tr-none shadow-lg'
                      }`}>
                        {message.image && (
                          <div className="mb-3">
                            <img 
                              src={message.image} 
                              alt="Attached" 
                              className="rounded-xl max-w-full h-auto max-h-64 object-cover"
                            />
                          </div>
                        )}
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </p>
                      </div>

                      {/* Prediction Result */}
                      {message.prediction && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 bg-white rounded-2xl p-6 shadow-lg border border-medical-teal/20"
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-medical-teal to-medical-emerald flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold text-medical-slate text-lg">
                              AI Analysis Result
                            </span>
                          </div>
                          <div className="space-y-4">
                            <div className="bg-medical-teal/5 rounded-xl p-4">
                              <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                                Predicted Condition
                              </span>
                              <p className="font-bold text-medical-slate text-lg mt-1">
                                {message.prediction.disease}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                                Confidence Level
                              </span>
                              <div className="flex items-center gap-3 mt-2">
                                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-medical-teal to-medical-emerald rounded-full transition-all duration-500"
                                    style={{ width: `${message.prediction.confidence}%` }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-medical-teal min-w-[45px]">
                                  {message.prediction.confidence}%
                                </span>
                              </div>
                            </div>
                            <div>
                              <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                                Description
                              </span>
                              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                {message.prediction.description}
                              </p>
                            </div>
                            {message.prediction.precautions.length > 0 && (
                              <div>
                                <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                                  Recommended Precautions
                                </span>
                                <ul className="mt-2 space-y-2">
                                  {message.prediction.precautions.map((precaution, idx) => (
                                    <li key={idx} className="text-sm text-slate-600 flex items-start gap-3 bg-slate-50 rounded-lg p-3">
                                      <span className="w-5 h-5 rounded-full bg-medical-teal/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="w-2 h-2 rounded-full bg-medical-teal" />
                                      </span>
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
                                className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:border-medical-teal/30 hover:shadow-xl transition-all"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h4 className="font-bold text-medical-slate text-lg">
                                      {doctor.name}
                                    </h4>
                                    <p className="text-sm text-medical-teal font-medium">
                                      {doctor.specialty}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 rounded-lg">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    <span className="text-sm font-bold text-amber-700">
                                      {doctor.rating}
                                    </span>
                                  </div>
                                </div>
                                <div className="space-y-2 text-sm text-slate-600 mb-4">
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
                                    <span className={doctor.available ? 'text-green-600 font-medium' : 'text-red-500'}>
                                      {doctor.available ? 'Available Today' : 'Next Available: Tomorrow'}
                                    </span>
                                  </div>
                                </div>
                                <button className="w-full py-3 bg-gradient-to-r from-medical-teal to-medical-emerald text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-medical-teal/30 transition-all">
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
                  <div className="bg-white rounded-2xl rounded-tl-none px-5 py-3 shadow-md border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-medical-teal animate-spin" />
                      <span className="text-sm text-slate-500">Analyzing your symptoms...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </main>

        {/* Input Area */}
        <div className="bg-white border-t border-slate-200 sticky bottom-0">
          <div className="max-w-4xl mx-auto px-6 py-4">
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="h-20 w-20 object-cover rounded-lg border-2 border-medical-teal"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className="flex items-end gap-3">
              {/* Attachment Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3.5 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all"
                title="Attach image"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your symptoms or attach an image..."
                  rows={1}
                  className="w-full px-5 py-3 pr-12 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/30 focus:border-medical-teal resize-none text-sm bg-slate-50"
                  style={{ minHeight: '52px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={(!input.trim() && !attachedImage) || isLoading}
                className="p-3.5 bg-gradient-to-r from-medical-teal to-medical-emerald text-white rounded-2xl hover:shadow-lg hover:shadow-medical-teal/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">
              This AI assistant provides general health information only. Always consult a qualified healthcare professional for medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

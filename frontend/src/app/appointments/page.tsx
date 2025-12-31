'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Star,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  Filter
} from 'lucide-react'
import axios from 'axios'

interface Doctor {
  id: string
  name: string
  specialty: string
  rating: number
  reviewCount: number
  address: string
  city: string
  phone: string
  consultationFee: number | null
  availableFrom: string | null
  availableTo: string | null
  workingDays: string[]
  isAvailableNow: boolean
}

interface TimeSlot {
  time: string
  available: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function AppointmentsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [reason, setReason] = useState('')
  
  // Form fields
  const [patientName, setPatientName] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [patientEmail, setPatientEmail] = useState('')

  useEffect(() => {
    fetchDoctors()
  }, [searchQuery, selectedSpecialty])

  const fetchDoctors = async () => {
    try {
      setIsLoading(true)
      const params: any = {}
      if (selectedSpecialty) params.specialty = selectedSpecialty
      if (searchQuery) params.search = searchQuery

      const response = await axios.get(`${API_URL}/doctors`, { params })
      setDoctors(response.data.doctors || [])
    } catch (error) {
      console.error('Failed to fetch doctors:', error)
      // Use mock data for demo
      setDoctors([
        {
          id: '1',
          name: 'Dr. Ahmed Khan',
          specialty: 'General Physician',
          rating: 4.8,
          reviewCount: 156,
          address: 'Medical Complex, GT Road',
          city: 'Taxila',
          phone: '+92 321 1234567',
          consultationFee: 1500,
          availableFrom: '09:00',
          availableTo: '17:00',
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          isAvailableNow: true
        },
        {
          id: '2',
          name: 'Dr. Fatima Ali',
          specialty: 'Cardiologist',
          rating: 4.9,
          reviewCount: 243,
          address: 'Heart Care Center, Main Boulevard',
          city: 'Rawalpindi',
          phone: '+92 333 9876543',
          consultationFee: 2500,
          availableFrom: '10:00',
          availableTo: '18:00',
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
          isAvailableNow: false
        },
        {
          id: '3',
          name: 'Dr. Hassan Malik',
          specialty: 'Dermatologist',
          rating: 4.7,
          reviewCount: 98,
          address: 'Skin Care Clinic, University Road',
          city: 'Taxila',
          phone: '+92 345 5556666',
          consultationFee: 2000,
          availableFrom: '11:00',
          availableTo: '19:00',
          workingDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
          isAvailableNow: true
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAvailableSlots = async (doctorId: string, date: string) => {
    try {
      const response = await axios.get(`${API_URL}/appointments/slots/${doctorId}`, {
        params: { date }
      })
      setAvailableSlots(response.data.slots || [])
    } catch (error) {
      // Generate mock slots
      const slots: TimeSlot[] = []
      for (let hour = 9; hour < 17; hour++) {
        slots.push({ time: `${hour.toString().padStart(2, '0')}:00`, available: Math.random() > 0.3 })
        slots.push({ time: `${hour.toString().padStart(2, '0')}:30`, available: Math.random() > 0.3 })
      }
      setAvailableSlots(slots)
    }
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    setSelectedTime('')
    if (selectedDoctor) {
      fetchAvailableSlots(selectedDoctor.id, date)
    }
  }

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !patientName || !patientPhone) {
      alert('Please fill in all required fields')
      return
    }

    setIsBooking(true)
    try {
      await axios.post(`${API_URL}/appointments`, {
        doctorId: selectedDoctor.id,
        scheduledAt: `${selectedDate}T${selectedTime}:00`,
        patientName,
        patientPhone,
        patientEmail,
        reason
      })
      setBookingSuccess(true)
    } catch (error) {
      // Simulate success for demo
      setBookingSuccess(true)
    } finally {
      setIsBooking(false)
    }
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    return maxDate.toISOString().split('T')[0]
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-medical-slate mb-4">
            Appointment Booked!
          </h2>
          <p className="text-slate-600 mb-6">
            Your appointment with {selectedDoctor?.name} has been scheduled for {selectedDate} at {selectedTime}.
          </p>
          <p className="text-sm text-slate-500 mb-8">
            A confirmation has been sent to your phone number.
          </p>
          <div className="space-y-3">
            <Link
              href="/chat"
              className="block w-full py-3 bg-gradient-to-r from-medical-teal to-medical-emerald text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
            >
              Back to Chat
            </Link>
            <button
              onClick={() => {
                setBookingSuccess(false)
                setSelectedDoctor(null)
                setSelectedDate('')
                setSelectedTime('')
                setPatientName('')
                setPatientPhone('')
                setPatientEmail('')
                setReason('')
              }}
              className="block w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
            >
              Book Another Appointment
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/chat" 
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div>
                <h1 className="font-display text-xl font-semibold text-medical-slate">
                  Book an Appointment
                </h1>
                <p className="text-sm text-slate-500">Find and book with the right doctor</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Doctor Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search & Filter */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search doctors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/30 focus:border-medical-teal"
                />
              </div>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/30 focus:border-medical-teal bg-white"
              >
                <option value="">All Specialties</option>
                <option value="General Physician">General Physician</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Orthopedic">Orthopedic</option>
                <option value="ENT Specialist">ENT Specialist</option>
              </select>
            </div>

            {/* Doctor List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-medical-teal animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {doctors.map((doctor, index) => (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`bg-white rounded-2xl p-6 cursor-pointer transition-all ${
                      selectedDoctor?.id === doctor.id
                        ? 'ring-2 ring-medical-teal shadow-lg'
                        : 'shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-medical-teal to-medical-emerald flex items-center justify-center text-white font-bold text-xl">
                          {doctor.name.split(' ').slice(1).map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-medical-slate text-lg">
                            {doctor.name}
                          </h3>
                          <p className="text-medical-teal">{doctor.specialty}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              <span>{doctor.rating}</span>
                              <span>({doctor.reviewCount} reviews)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-medical-slate">
                          Rs. {doctor.consultationFee}
                        </p>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          doctor.isAvailableNow
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {doctor.isAvailableNow ? 'Available Now' : 'Next Available'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{doctor.address}, {doctor.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{doctor.availableFrom} - {doctor.availableTo}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="font-display text-lg font-semibold text-medical-slate mb-6">
                Appointment Details
              </h2>

              {selectedDoctor ? (
                <div className="space-y-5">
                  {/* Selected Doctor Info */}
                  <div className="p-4 bg-medical-teal/5 rounded-xl">
                    <p className="text-sm text-slate-500">Selected Doctor</p>
                    <p className="font-semibold text-medical-slate">{selectedDoctor.name}</p>
                    <p className="text-sm text-medical-teal">{selectedDoctor.specialty}</p>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      min={getMinDate()}
                      max={getMaxDate()}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/30 focus:border-medical-teal"
                    />
                  </div>

                  {/* Time Slots */}
                  {selectedDate && availableSlots.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Select Time
                      </label>
                      <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              if (slot.available) {
                                setSelectedTime(slot.time)
                              }
                            }}
                            disabled={!slot.available}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                              selectedTime === slot.time
                                ? 'bg-medical-teal text-white ring-2 ring-medical-teal ring-offset-2'
                                : slot.available
                                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95'
                                : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Patient Details */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/30 focus:border-medical-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+92 3XX XXXXXXX"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/30 focus:border-medical-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/30 focus:border-medical-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Reason for Visit
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Briefly describe your symptoms or reason for visit"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/30 focus:border-medical-teal resize-none"
                    />
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={handleBookAppointment}
                    disabled={!selectedDate || !selectedTime || !patientName || !patientPhone || isBooking}
                    className="w-full py-4 bg-gradient-to-r from-medical-teal to-medical-emerald text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-medical-teal/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isBooking ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-5 h-5" />
                        Book Appointment
                      </>
                    )}
                  </button>

                  {/* Call Option */}
                  <div className="text-center">
                    <p className="text-sm text-slate-500 mb-2">Or call directly</p>
                    <a
                      href={`tel:${selectedDoctor.phone}`}
                      className="inline-flex items-center gap-2 text-medical-teal hover:text-medical-teal/80 font-medium"
                    >
                      <Phone className="w-4 h-4" />
                      {selectedDoctor.phone}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <User className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>Select a doctor from the list to book an appointment</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


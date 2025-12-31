'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft,
  Stethoscope,
  Phone,
  Calendar,
  Users,
  Clock,
  MessageSquare,
  Settings,
  Bell,
  Search,
  ChevronRight,
  CheckCircle,
  XCircle,
  PhoneCall,
  PhoneOff,
  Voicemail,
  TrendingUp,
  Activity
} from 'lucide-react'

interface Appointment {
  id: string
  patientName: string
  time: string
  date: string
  status: 'confirmed' | 'pending' | 'cancelled'
  reason: string
}

interface CallLog {
  id: string
  callerName: string
  phone: string
  time: string
  duration: string
  type: 'incoming' | 'outgoing' | 'missed' | 'voicemail'
  summary: string
}

const mockAppointments: Appointment[] = [
  { id: '1', patientName: 'Ahmed Khan', time: '09:00 AM', date: 'Today', status: 'confirmed', reason: 'Follow-up checkup' },
  { id: '2', patientName: 'Fatima Ali', time: '10:30 AM', date: 'Today', status: 'confirmed', reason: 'Fever and headache' },
  { id: '3', patientName: 'Hassan Malik', time: '02:00 PM', date: 'Today', status: 'pending', reason: 'General consultation' },
  { id: '4', patientName: 'Ayesha Siddiqui', time: '03:30 PM', date: 'Today', status: 'confirmed', reason: 'Lab results review' },
  { id: '5', patientName: 'Usman Tariq', time: '09:00 AM', date: 'Tomorrow', status: 'pending', reason: 'Chronic pain management' },
]

const mockCallLogs: CallLog[] = [
  { id: '1', callerName: 'New Patient', phone: '+92 321 1234567', time: '08:45 AM', duration: '2:34', type: 'incoming', summary: 'Inquiry about appointment availability' },
  { id: '2', callerName: 'Ahmed Khan', phone: '+92 333 9876543', time: '08:30 AM', duration: '1:15', type: 'outgoing', summary: 'Appointment confirmation call' },
  { id: '3', callerName: 'Unknown', phone: '+92 300 5555555', time: '08:15 AM', duration: '-', type: 'missed', summary: 'No voicemail left' },
  { id: '4', callerName: 'Fatima Ali', phone: '+92 345 1112222', time: '07:50 AM', duration: '0:45', type: 'voicemail', summary: 'Requesting prescription refill' },
]

const stats = [
  { label: 'Today\'s Appointments', value: '8', icon: Calendar, color: 'from-medical-teal to-medical-cyan' },
  { label: 'Pending Calls', value: '3', icon: Phone, color: 'from-medical-cyan to-medical-emerald' },
  { label: 'Total Patients', value: '156', icon: Users, color: 'from-medical-emerald to-accent-coral' },
  { label: 'Avg. Wait Time', value: '12m', icon: Clock, color: 'from-accent-coral to-accent-rose' },
]

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState<'appointments' | 'calls' | 'messages'>('appointments')
  const [searchQuery, setSearchQuery] = useState('')

  const getCallIcon = (type: CallLog['type']) => {
    switch (type) {
      case 'incoming': return <PhoneCall className="w-4 h-4 text-green-500" />
      case 'outgoing': return <Phone className="w-4 h-4 text-blue-500" />
      case 'missed': return <PhoneOff className="w-4 h-4 text-red-500" />
      case 'voicemail': return <Voicemail className="w-4 h-4 text-amber-500" />
    }
  }

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            Confirmed
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        )
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-medical-slate text-white p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-medical-teal to-medical-emerald flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <span className="font-display text-xl font-bold">
            MediAssist<span className="text-medical-teal">AI</span>
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'appointments' 
                ? 'bg-white/10 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Appointments
          </button>
          <button
            onClick={() => setActiveTab('calls')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'calls' 
                ? 'bg-white/10 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Phone className="w-5 h-5" />
            Call Logs
            <span className="ml-auto bg-accent-coral text-white text-xs px-2 py-0.5 rounded-full">3</span>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'messages' 
                ? 'bg-white/10 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Messages
          </button>
        </nav>

        <div className="border-t border-white/10 pt-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <Link 
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-medical-slate">
              Doctor Dashboard
            </h1>
            <p className="text-slate-500">Welcome back, Dr. Aatir</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/30 focus:border-medical-teal text-sm w-64"
              />
            </div>
            <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-coral rounded-full" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-medical-teal to-medical-emerald flex items-center justify-center text-white font-semibold">
              DA
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="font-display text-3xl font-bold text-medical-slate mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-3 gap-6">
          {/* Appointments / Calls List */}
          <div className="col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-medical-slate">
                  {activeTab === 'appointments' ? "Today's Schedule" : 'Recent Calls'}
                </h2>
                <button className="text-sm text-medical-teal hover:text-medical-teal/80 font-medium">
                  View All
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'appointments' ? (
                <motion.div
                  key="appointments"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="divide-y divide-slate-100"
                >
                  {mockAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                            {appointment.patientName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold text-medical-slate">
                              {appointment.patientName}
                            </h3>
                            <p className="text-sm text-slate-500">{appointment.reason}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium text-medical-slate">{appointment.time}</p>
                            <p className="text-sm text-slate-500">{appointment.date}</p>
                          </div>
                          {getStatusBadge(appointment.status)}
                          <ChevronRight className="w-5 h-5 text-slate-300" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="calls"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="divide-y divide-slate-100"
                >
                  {mockCallLogs.map((call, index) => (
                    <motion.div
                      key={call.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                            {getCallIcon(call.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-medical-slate">
                              {call.callerName}
                            </h3>
                            <p className="text-sm text-slate-500">{call.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium text-medical-slate">{call.time}</p>
                            <p className="text-sm text-slate-500">
                              {call.duration !== '-' ? `Duration: ${call.duration}` : 'No answer'}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300" />
                        </div>
                      </div>
                      <p className="mt-2 ml-14 text-sm text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
                        {call.summary}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* VAPI Call Agent Status */}
          <div className="space-y-6">
            {/* AI Agent Status */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-medical-teal to-medical-emerald flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-medical-slate">VAPI Call Agent</h3>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Active & Listening
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Calls Handled Today</span>
                  <span className="font-medium text-medical-slate">24</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Appointments Booked</span>
                  <span className="font-medium text-medical-slate">8</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Avg. Call Duration</span>
                  <span className="font-medium text-medical-slate">1:45</span>
                </div>
              </div>
              <button className="mt-4 w-full py-2 bg-slate-100 text-medical-slate text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                Configure Agent
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-medical-slate mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-medical-slate text-sm">Add Appointment</p>
                    <p className="text-xs text-slate-500">Schedule a new patient</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-medical-slate text-sm">Make Call</p>
                    <p className="text-xs text-slate-500">Contact a patient</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-medical-slate text-sm">View Analytics</p>
                    <p className="text-xs text-slate-500">Check performance</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


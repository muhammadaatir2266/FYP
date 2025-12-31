'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Stethoscope, 
  Users, 
  UserCheck, 
  Activity,
  Settings,
  FileText,
  BarChart3,
  Shield,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Bell,
  Menu,
  X,
  Phone,
  MessageSquare,
  DollarSign,
  Eye,
  MoreVertical
} from 'lucide-react'
import { getCurrentUser, logoutUser, type User } from '@/lib/auth'

interface DoctorPending {
  id: string
  name: string
  email: string
  specialization: string
  licenseNumber: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function AdminDashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'patients' | 'appointments' | 'analytics'>('overview')
  const [showSidebar, setShowSidebar] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data
  const [pendingDoctors] = useState<DoctorPending[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.j@example.com',
      specialization: 'Cardiologist',
      licenseNumber: 'MD-12345',
      submittedAt: '2 hours ago',
      status: 'pending'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      email: 'michael.c@example.com',
      specialization: 'Neurologist',
      licenseNumber: 'MD-67890',
      submittedAt: '5 hours ago',
      status: 'pending'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.r@example.com',
      specialization: 'Dermatologist',
      licenseNumber: 'MD-54321',
      submittedAt: '1 day ago',
      status: 'pending'
    }
  ])

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== 'admin') {
      router.push('/login')
    } else {
      setCurrentUser(user)
    }
  }, [router])

  const handleLogout = () => {
    logoutUser()
    router.push('/')
  }

  if (!currentUser) return null

  const stats = [
    { 
      icon: Users, 
      title: 'Total Users', 
      count: '1,234', 
      change: '+12%',
      trend: 'up',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      icon: UserCheck, 
      title: 'Active Doctors', 
      count: '156', 
      change: '+8%',
      trend: 'up',
      color: 'from-medical-teal to-medical-cyan',
      bgColor: 'bg-medical-teal/10',
      textColor: 'text-medical-teal'
    },
    { 
      icon: Calendar, 
      title: 'Appointments Today', 
      count: '89', 
      change: '+23%',
      trend: 'up',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      icon: DollarSign, 
      title: 'Revenue (Month)', 
      count: 'Rs. 2.4M', 
      change: '+15%',
      trend: 'up',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      icon: Activity, 
      title: 'System Health', 
      count: '98.5%', 
      change: '+0.5%',
      trend: 'up',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    { 
      icon: AlertCircle, 
      title: 'Pending Reviews', 
      count: '12', 
      change: '-3',
      trend: 'down',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ]

  const recentActivity = [
    { type: 'user', message: 'New patient registered', time: '2 min ago', icon: Users, color: 'text-blue-500' },
    { type: 'doctor', message: 'Dr. Sarah Johnson submitted credentials', time: '15 min ago', icon: UserCheck, color: 'text-medical-teal' },
    { type: 'appointment', message: '5 new appointments booked', time: '1 hour ago', icon: Calendar, color: 'text-green-500' },
    { type: 'system', message: 'System backup completed', time: '2 hours ago', icon: Shield, color: 'text-purple-500' },
    { type: 'alert', message: 'Server response time increased', time: '3 hours ago', icon: AlertCircle, color: 'text-orange-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200 p-6 flex flex-col transition-transform z-50 ${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-medical-teal to-medical-emerald flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-medical-slate">
              MediAssist<span className="gradient-text">AI</span>
            </span>
          </Link>
          <button 
            onClick={() => setShowSidebar(false)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Profile */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-4 mb-6 border border-red-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-semibold">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-medical-slate">{currentUser.name}</p>
              <p className="text-xs text-red-600 font-medium">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'overview'
                ? 'bg-medical-teal text-white shadow-lg shadow-medical-teal/30'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'doctors'
                ? 'bg-medical-teal text-white shadow-lg shadow-medical-teal/30'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <UserCheck className="w-5 h-5" />
            <span className="font-medium">Doctors</span>
            {pendingDoctors.length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {pendingDoctors.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('patients')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'patients'
                ? 'bg-medical-teal text-white shadow-lg shadow-medical-teal/30'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Patients</span>
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'appointments'
                ? 'bg-medical-teal text-white shadow-lg shadow-medical-teal/30'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Appointments</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'analytics'
                ? 'bg-medical-teal text-white shadow-lg shadow-medical-teal/30'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </button>
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-slate-200 pt-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
          <Link 
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Logout</span>
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

      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
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
                <div>
                  <h1 className="font-display text-2xl font-bold text-medical-slate">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-slate-500">
                    Manage and monitor the entire platform
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-teal/30 focus:border-medical-teal text-sm w-64"
                  />
                </div>
                <button className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <Bell className="w-5 h-5 text-slate-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <Download className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {stat.change}
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-medical-slate mb-1">
                      {stat.count}
                    </h3>
                    <p className="text-sm text-slate-600">{stat.title}</p>
                  </motion.div>
                ))}
              </div>

              {/* Charts and Activity */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-bold text-medical-slate">
                      Recent Activity
                    </h2>
                    <button className="text-sm text-medical-teal hover:text-medical-cyan font-medium">
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center ${activity.color}`}>
                          <activity.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-medical-slate">
                            {activity.message}
                          </p>
                          <p className="text-xs text-slate-500">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-display text-lg font-bold text-medical-slate mb-4">
                      Quick Stats
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Active Sessions</span>
                        <span className="text-lg font-bold text-medical-slate">342</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Avg Response Time</span>
                        <span className="text-lg font-bold text-medical-slate">1.2s</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Server Uptime</span>
                        <span className="text-lg font-bold text-green-600">99.9%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">API Calls Today</span>
                        <span className="text-lg font-bold text-medical-slate">12.4K</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-medical-teal to-medical-emerald rounded-2xl p-6 text-white shadow-lg">
                    <h3 className="font-display text-lg font-bold mb-2">
                      System Status
                    </h3>
                    <p className="text-sm text-white/80 mb-4">
                      All systems operational
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-sm">Healthy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'doctors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-medical-slate">
                  Doctor Management
                </h2>
                <button className="px-4 py-2 bg-gradient-to-r from-medical-teal to-medical-emerald text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
                  Add Doctor
                </button>
              </div>

              {/* Pending Approvals */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-lg font-bold text-medical-slate flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    Pending Approvals ({pendingDoctors.length})
                  </h3>
                </div>
                <div className="space-y-4">
                  {pendingDoctors.map((doctor, index) => (
                    <motion.div
                      key={doctor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-medical-teal to-medical-emerald flex items-center justify-center text-white font-semibold">
                          {doctor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-semibold text-medical-slate">{doctor.name}</h4>
                          <p className="text-sm text-slate-600">{doctor.specialization}</p>
                          <p className="text-xs text-slate-500">License: {doctor.licenseNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Active Doctors Table */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-display text-lg font-bold text-medical-slate mb-6">
                  Active Doctors
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Doctor</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Specialty</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Patients</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Rating</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-medical-teal to-medical-emerald flex items-center justify-center text-white font-semibold text-sm">
                                DA
                              </div>
                              <div>
                                <p className="font-medium text-medical-slate">Dr. Ahmed Khan</p>
                                <p className="text-xs text-slate-500">ahmed@example.com</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-600">Cardiologist</td>
                          <td className="py-4 px-4 text-sm text-slate-600">234</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium text-medical-slate">4.8</span>
                              <span className="text-amber-500">★</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              Active
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4 text-slate-600" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-medical-slate mb-6">
                Patient Management
              </h2>
              <p className="text-slate-600">Patient management interface coming soon...</p>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-medical-slate mb-6">
                Appointment Management
              </h2>
              <p className="text-slate-600">Appointment management interface coming soon...</p>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-medical-slate mb-6">
                Analytics & Reports
              </h2>
              <p className="text-slate-600">Analytics dashboard coming soon...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

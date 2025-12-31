'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  MessageSquare, 
  Phone, 
  Stethoscope, 
  Brain, 
  MapPin, 
  Calendar,
  Shield,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI Symptom Analysis',
    description: 'Advanced machine learning model analyzes your symptoms and predicts potential conditions with high accuracy.',
    color: 'from-medical-teal to-medical-cyan'
  },
  {
    icon: Stethoscope,
    title: 'Smart Doctor Recommendations',
    description: 'Get personalized doctor recommendations based on your condition and location.',
    color: 'from-medical-cyan to-medical-emerald'
  },
  {
    icon: Phone,
    title: 'Automated Calling Agent',
    description: 'VAPI-powered voice assistant handles appointment booking and inquiries automatically.',
    color: 'from-medical-emerald to-accent-coral'
  },
  {
    icon: MessageSquare,
    title: 'Conversational Chatbot',
    description: 'Natural language chatbot powered by OpenAI for seamless patient interaction.',
    color: 'from-accent-coral to-accent-rose'
  },
  {
    icon: MapPin,
    title: 'Location-Based Search',
    description: 'Find doctors near you with integrated location services and mapping.',
    color: 'from-accent-rose to-accent-violet'
  },
  {
    icon: Calendar,
    title: 'Appointment Management',
    description: 'Easy scheduling and management of medical appointments.',
    color: 'from-accent-violet to-medical-teal'
  }
]

const stats = [
  { value: '98%', label: 'Accuracy Rate' },
  { value: '24/7', label: 'Availability' },
  { value: '500+', label: 'Conditions Covered' },
  { value: '1000+', label: 'Doctors Listed' }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-medical-teal to-medical-emerald flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-medical-slate">
                MediAssist<span className="gradient-text">AI</span>
              </span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <Link 
                href="/chat" 
                className="px-4 py-2 text-medical-slate hover:text-medical-teal transition-colors font-medium"
              >
                Patient Chat
              </Link>
              <Link 
                href="/doctor" 
                className="px-4 py-2 text-medical-slate hover:text-medical-teal transition-colors font-medium"
              >
                Doctor Portal
              </Link>
              <Link 
                href="/chat" 
                className="px-6 py-2.5 bg-gradient-to-r from-medical-teal to-medical-emerald text-white rounded-full font-medium hover:shadow-lg hover:shadow-medical-teal/30 transition-all"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-medical-teal/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-medical-cyan/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-medical-emerald/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-medical-teal/10 text-medical-teal text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Healthcare Assistant
              </div>
              
              <h1 className="font-display text-5xl lg:text-6xl font-bold text-medical-slate leading-tight mb-6">
                Your Personal
                <span className="block gradient-text">Medical Assistant</span>
              </h1>
              
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Experience the future of healthcare with our AI-powered virtual assistant. 
                Get instant symptom analysis, personalized doctor recommendations, and 
                automated appointment scheduling—all in one place.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/chat"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-medical-teal to-medical-emerald text-white rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-medical-teal/30 transition-all group"
                >
                  Start Consultation
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/doctor"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-medical-slate rounded-full font-semibold text-lg hover:shadow-lg transition-all border border-slate-200"
                >
                  Doctor Login
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 mt-10 pt-10 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-medical-teal" />
                  <span className="text-sm text-slate-600">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-medical-teal" />
                  <span className="text-sm text-slate-600">24/7 Available</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Main Card */}
                <div className="absolute inset-0 glass rounded-3xl shadow-2xl p-8 flex flex-col justify-center">
                  <div className="space-y-6">
                    {/* Chat Preview */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-medical-teal to-medical-emerald flex items-center justify-center flex-shrink-0">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm">
                        <p className="text-sm text-slate-700">
                          Hello! I'm your AI medical assistant. How can I help you today?
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 justify-end">
                      <div className="bg-gradient-to-r from-medical-teal to-medical-emerald rounded-2xl rounded-tr-none p-4 shadow-sm">
                        <p className="text-sm text-white">
                          I have a headache and slight fever...
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-slate-600">You</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-medical-teal to-medical-emerald flex items-center justify-center flex-shrink-0">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm">
                        <p className="text-sm text-slate-700">
                          I understand. Let me analyze your symptoms and recommend the best specialist near you...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 w-20 h-20 glass rounded-2xl shadow-lg flex items-center justify-center"
                >
                  <Stethoscope className="w-10 h-10 text-medical-teal" />
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute -bottom-4 -left-4 w-16 h-16 glass rounded-2xl shadow-lg flex items-center justify-center"
                >
                  <Phone className="w-8 h-8 text-medical-emerald" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="font-display text-4xl font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-medical-slate mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our comprehensive platform combines cutting-edge AI technology with 
              healthcare expertise to provide you with the best medical assistance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 card-hover"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display text-xl font-semibold text-medical-slate mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-medical-teal via-medical-cyan to-medical-emerald p-12 text-center"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative">
              <h2 className="font-display text-4xl font-bold text-white mb-4">
                Ready to Transform Your Healthcare Experience?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of patients who trust MediAssist AI for their healthcare needs. 
                Start your free consultation today.
              </p>
              <Link 
                href="/chat"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-medical-teal rounded-full font-semibold text-lg hover:shadow-xl transition-all group"
              >
                Start Free Consultation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-medical-teal to-medical-emerald flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-medical-slate">
                MediAssist<span className="gradient-text">AI</span>
              </span>
            </div>
            
            <p className="text-slate-600 text-sm">
              © 2024 MediAssist AI. Built by Muhammad Aatir, Mudassir Rizwan & Shariq Mateen
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}


'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Stethoscope, 
  Phone,
  MapPin,
  Briefcase,
  Award,
  Upload,
  ArrowRight,
  ArrowLeft,
  FileText,
  X
} from 'lucide-react'

export default function DoctorDetailsPage() {
  const router = useRouter()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    specialization: '',
    licenseNumber: '',
    phoneNumber: '',
    clinicAddress: '',
    experience: ''
  })

  useEffect(() => {
    // Check if basic signup data exists
    const basicData = localStorage.getItem('doctorSignupData')
    if (!basicData) {
      router.push('/signup')
    }
  }, [router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Get basic signup data
    const basicData = localStorage.getItem('doctorSignupData')
    if (basicData) {
      const completeData = {
        ...JSON.parse(basicData),
        ...formData,
        proofDocument: uploadedFile?.name
      }
      console.log('Complete Doctor Signup:', completeData)
      
      // Clear stored data
      localStorage.removeItem('doctorSignupData')
      
      // Handle doctor signup logic here
      // Redirect to success page or dashboard
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-medical-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-medical-cyan/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-medical-emerald/10 rounded-full blur-3xl" />
      </div>

      {/* Logo - Top Left */}
      <Link href="/" className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 sm:gap-3 z-50">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-medical-teal to-medical-emerald flex items-center justify-center shadow-lg">
          <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <span className="font-display text-lg sm:text-xl font-bold text-medical-slate">
          MediAssist<span className="gradient-text">AI</span>
        </span>
      </Link>

      {/* Doctor Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-medical-teal/10 text-medical-teal text-xs sm:text-sm font-medium mb-4">
              <Stethoscope className="w-3 h-3 sm:w-4 sm:h-4" />
              Medical Professional Verification
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-medical-slate mb-2">
              Complete Your Profile
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Please provide your professional credentials
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Specialization */}
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-medical-slate mb-2">
                  Specialization <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-teal/50 focus:border-medical-teal transition-all"
                    placeholder="e.g., Cardiologist"
                    required
                  />
                </div>
              </div>

              {/* License Number */}
              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-medical-slate mb-2">
                  Medical License Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-teal/50 focus:border-medical-teal transition-all"
                    placeholder="License number"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-medical-slate mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-teal/50 focus:border-medical-teal transition-all"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
              </div>

              {/* Years of Experience */}
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-medical-slate mb-2">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <input
                    type="number"
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-teal/50 focus:border-medical-teal transition-all"
                    placeholder="Years"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Clinic Address */}
            <div>
              <label htmlFor="clinicAddress" className="block text-sm font-medium text-medical-slate mb-2">
                Clinic/Hospital Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-3 text-slate-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <textarea
                  id="clinicAddress"
                  value={formData.clinicAddress}
                  onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-teal/50 focus:border-medical-teal transition-all resize-none"
                  placeholder="Full address of your clinic or hospital"
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-medical-slate mb-2">
                Upload Proof of Credentials <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Please upload your medical license, degree certificate, or any official document (PDF, JPG, PNG - Max 5MB)
              </p>
              
              {!uploadedFile ? (
                <label className="block">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-medical-teal hover:bg-medical-teal/5 transition-all">
                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-medical-slate mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">
                      PDF, JPG, PNG up to 5MB
                    </p>
                  </div>
                </label>
              ) : (
                <div className="bg-medical-teal/5 border border-medical-teal/20 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-medical-teal/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-medical-teal" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-medical-slate">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your credentials will be verified by our team within 24-48 hours. 
                You'll receive an email once your account is approved.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3.5 bg-white border border-slate-200 text-medical-slate rounded-xl font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 bg-gradient-to-r from-medical-teal to-medical-emerald text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-medical-teal/30 transition-all flex items-center justify-center gap-2 group"
              >
                Complete Registration
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

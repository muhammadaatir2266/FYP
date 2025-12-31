// Sample users database
export const SAMPLE_USERS = {
  admin: {
    email: 'admin@mediassist.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    id: '1'
  },
  doctor: {
    email: 'doctor@mediassist.com',
    password: 'doctor123',
    role: 'doctor',
    name: 'Dr. Sarah Johnson',
    id: '2',
    specialization: 'Cardiologist',
    licenseNumber: 'MD-12345'
  },
  patient: {
    email: 'patient@mediassist.com',
    password: 'patient123',
    role: 'patient',
    name: 'John Doe',
    id: '3'
  }
}

export type UserRole = 'admin' | 'doctor' | 'patient'

export interface User {
  email: string
  role: UserRole
  name: string
  id: string
  specialization?: string
  licenseNumber?: string
}

// Authenticate user
export const authenticateUser = (email: string, password: string): User | null => {
  const user = Object.values(SAMPLE_USERS).find(
    u => u.email === email && u.password === password
  )
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword as User
  }
  
  return null
}

// Store user in localStorage
export const setCurrentUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUser', JSON.stringify(user))
  }
}

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('currentUser')
    if (userStr) {
      return JSON.parse(userStr)
    }
  }
  return null
}

// Logout user
export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUser')
  }
}

// Check if user has specific role
export const hasRole = (user: User | null, role: UserRole): boolean => {
  return user?.role === role
}

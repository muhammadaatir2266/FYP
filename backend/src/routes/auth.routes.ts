import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Register a new user (patient)
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone, city, gender } = req.body

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user and patient profile
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'PATIENT',
        patient: {
          create: {
            firstName,
            lastName,
            phone,
            city,
            gender
          }
        }
      },
      include: {
        patient: true
      }
    })

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: {
          id: user.patient?.id,
          firstName: user.patient?.firstName,
          lastName: user.patient?.lastName
        }
      },
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        patient: true,
        doctor: {
          include: { specialty: true }
        }
      }
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    // Prepare profile based on role
    let profile: any = null
    if (user.role === 'PATIENT' && user.patient) {
      profile = {
        id: user.patient.id,
        firstName: user.patient.firstName,
        lastName: user.patient.lastName,
        phone: user.patient.phone,
        city: user.patient.city
      }
    } else if (user.role === 'DOCTOR' && user.doctor) {
      profile = {
        id: user.doctor.id,
        firstName: user.doctor.firstName,
        lastName: user.doctor.lastName,
        specialty: user.doctor.specialty.name,
        phone: user.doctor.phone,
        city: user.doctor.city
      }
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile
      },
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Get current user profile
router.get('/me', async (req: Request, res: Response) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        patient: true,
        doctor: {
          include: { specialty: true }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Prepare profile based on role
    let profile: any = null
    if (user.role === 'PATIENT' && user.patient) {
      profile = {
        id: user.patient.id,
        firstName: user.patient.firstName,
        lastName: user.patient.lastName,
        phone: user.patient.phone,
        city: user.patient.city,
        dateOfBirth: user.patient.dateOfBirth,
        gender: user.patient.gender,
        medicalHistory: user.patient.medicalHistory,
        allergies: user.patient.allergies
      }
    } else if (user.role === 'DOCTOR' && user.doctor) {
      profile = {
        id: user.doctor.id,
        firstName: user.doctor.firstName,
        lastName: user.doctor.lastName,
        specialty: user.doctor.specialty.name,
        phone: user.doctor.phone,
        address: user.doctor.address,
        city: user.doctor.city,
        qualifications: user.doctor.qualifications,
        experience: user.doctor.experience,
        rating: user.doctor.rating,
        reviewCount: user.doctor.reviewCount
      }
    }

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      profile
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Failed to get profile' })
  }
})

// Update patient profile
router.patch('/profile/patient', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }

    if (decoded.role !== 'PATIENT') {
      return res.status(403).json({ error: 'Not authorized' })
    }

    const { firstName, lastName, phone, city, dateOfBirth, gender, medicalHistory, allergies } = req.body

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { patient: true }
    })

    if (!user?.patient) {
      return res.status(404).json({ error: 'Patient profile not found' })
    }

    const updatedPatient = await prisma.patient.update({
      where: { id: user.patient.id },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
        city: city || undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender: gender || undefined,
        medicalHistory: medicalHistory || undefined,
        allergies: allergies || undefined
      }
    })

    res.json({
      message: 'Profile updated successfully',
      profile: updatedPatient
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

export default router


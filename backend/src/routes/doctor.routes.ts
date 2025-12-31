import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'

const router = Router()

// Get all doctors with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { 
      specialty, 
      city, 
      available, 
      minRating,
      page = '1',
      limit = '10'
    } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const where: any = {
      isActive: true,
      isVerified: true
    }

    if (specialty) {
      where.specialty = {
        name: { contains: specialty as string, mode: 'insensitive' }
      }
    }

    if (city) {
      where.city = { contains: city as string, mode: 'insensitive' }
    }

    if (minRating) {
      where.rating = { gte: parseFloat(minRating as string) }
    }

    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        include: {
          specialty: true,
          reviews: {
            take: 3,
            orderBy: { createdAt: 'desc' }
          }
        },
        orderBy: [
          { rating: 'desc' },
          { reviewCount: 'desc' }
        ],
        skip,
        take: limitNum
      }),
      prisma.doctor.count({ where })
    ])

    res.json({
      doctors: doctors.map(doc => ({
        id: doc.id,
        name: `Dr. ${doc.firstName} ${doc.lastName}`,
        specialty: doc.specialty.name,
        phone: doc.phone,
        address: doc.address,
        city: doc.city,
        qualifications: doc.qualifications,
        experience: doc.experience,
        rating: doc.rating,
        reviewCount: doc.reviewCount,
        consultationFee: doc.consultationFee,
        availableFrom: doc.availableFrom,
        availableTo: doc.availableTo,
        workingDays: doc.workingDays,
        isAvailableNow: isAvailableNow(doc.workingDays, doc.availableFrom, doc.availableTo),
        recentReviews: doc.reviews
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    console.error('Get doctors error:', error)
    res.status(500).json({ error: 'Failed to fetch doctors' })
  }
})

// Get doctor by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        specialty: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        appointments: {
          where: {
            scheduledAt: { gte: new Date() },
            status: { in: ['PENDING', 'CONFIRMED'] }
          },
          orderBy: { scheduledAt: 'asc' },
          take: 5
        }
      }
    })

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' })
    }

    res.json({
      id: doctor.id,
      name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      specialty: doctor.specialty.name,
      phone: doctor.phone,
      address: doctor.address,
      city: doctor.city,
      latitude: doctor.latitude,
      longitude: doctor.longitude,
      qualifications: doctor.qualifications,
      experience: doctor.experience,
      rating: doctor.rating,
      reviewCount: doctor.reviewCount,
      consultationFee: doctor.consultationFee,
      availableFrom: doctor.availableFrom,
      availableTo: doctor.availableTo,
      workingDays: doctor.workingDays,
      isAvailableNow: isAvailableNow(doctor.workingDays, doctor.availableFrom, doctor.availableTo),
      reviews: doctor.reviews,
      upcomingAppointments: doctor.appointments.length
    })
  } catch (error) {
    console.error('Get doctor error:', error)
    res.status(500).json({ error: 'Failed to fetch doctor' })
  }
})

// Get doctors by specialty
router.get('/specialty/:specialtyName', async (req: Request, res: Response) => {
  try {
    const { specialtyName } = req.params
    const { city } = req.query

    const where: any = {
      isActive: true,
      isVerified: true,
      specialty: {
        name: { contains: specialtyName, mode: 'insensitive' }
      }
    }

    if (city) {
      where.city = { contains: city as string, mode: 'insensitive' }
    }

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        specialty: true
      },
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' }
      ],
      take: 10
    })

    res.json(doctors.map(doc => ({
      id: doc.id,
      name: `Dr. ${doc.firstName} ${doc.lastName}`,
      specialty: doc.specialty.name,
      phone: doc.phone,
      address: `${doc.address}, ${doc.city}`,
      rating: doc.rating,
      reviewCount: doc.reviewCount,
      consultationFee: doc.consultationFee,
      isAvailableNow: isAvailableNow(doc.workingDays, doc.availableFrom, doc.availableTo)
    })))
  } catch (error) {
    console.error('Get doctors by specialty error:', error)
    res.status(500).json({ error: 'Failed to fetch doctors' })
  }
})

// Get all specialties
router.get('/meta/specialties', async (req: Request, res: Response) => {
  try {
    const specialties = await prisma.specialty.findMany({
      include: {
        _count: {
          select: { doctors: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    res.json(specialties.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      iconName: s.iconName,
      doctorCount: s._count.doctors
    })))
  } catch (error) {
    console.error('Get specialties error:', error)
    res.status(500).json({ error: 'Failed to fetch specialties' })
  }
})

// Add review for a doctor
router.post('/:id/reviews', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { reviewerName, rating, comment } = req.body

    if (!reviewerName || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid review data' })
    }

    const doctor = await prisma.doctor.findUnique({ where: { id } })
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' })
    }

    // Create review and update doctor rating
    const [review] = await prisma.$transaction([
      prisma.review.create({
        data: {
          doctorId: id,
          reviewerName,
          rating,
          comment
        }
      }),
      prisma.doctor.update({
        where: { id },
        data: {
          rating: (doctor.rating * doctor.reviewCount + rating) / (doctor.reviewCount + 1),
          reviewCount: { increment: 1 }
        }
      })
    ])

    res.status(201).json(review)
  } catch (error) {
    console.error('Add review error:', error)
    res.status(500).json({ error: 'Failed to add review' })
  }
})

// Helper function to check if doctor is available now
function isAvailableNow(workingDays: string[], availableFrom?: string | null, availableTo?: string | null): boolean {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const isWorkingDay = workingDays.includes(today)
  
  if (!isWorkingDay || !availableFrom || !availableTo) {
    return false
  }

  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  
  return currentTime >= availableFrom && currentTime <= availableTo
}

export default router


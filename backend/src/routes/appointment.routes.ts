import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import axios from 'axios'

const router = Router()

// Create a new appointment
router.post('/', async (req: Request, res: Response) => {
  try {
    const { patientId, doctorId, scheduledAt, reason, duration = 30 } = req.body

    if (!patientId || !doctorId || !scheduledAt) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Check if doctor exists and is available
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { specialty: true }
    })

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' })
    }

    // Check for conflicting appointments
    const appointmentDate = new Date(scheduledAt)
    const endTime = new Date(appointmentDate.getTime() + duration * 60000)

    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        scheduledAt: {
          gte: appointmentDate,
          lt: endTime
        }
      }
    })

    if (conflictingAppointment) {
      return res.status(409).json({ error: 'Time slot is not available' })
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        scheduledAt: appointmentDate,
        duration,
        reason,
        status: 'PENDING'
      },
      include: {
        patient: true,
        doctor: {
          include: { specialty: true }
        }
      }
    })

    // Trigger n8n webhook for appointment notification (if configured)
    try {
      if (process.env.N8N_WEBHOOK_APPOINTMENT) {
        await axios.post(process.env.N8N_WEBHOOK_APPOINTMENT, {
          type: 'NEW_APPOINTMENT',
          appointment: {
            id: appointment.id,
            patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
            doctorName: `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
            specialty: appointment.doctor.specialty.name,
            scheduledAt: appointment.scheduledAt,
            reason: appointment.reason
          }
        })
      }
    } catch (webhookError) {
      console.log('n8n webhook not available:', webhookError)
    }

    res.status(201).json({
      id: appointment.id,
      patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
      doctorName: `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
      specialty: appointment.doctor.specialty.name,
      scheduledAt: appointment.scheduledAt,
      duration: appointment.duration,
      status: appointment.status,
      reason: appointment.reason
    })
  } catch (error) {
    console.error('Create appointment error:', error)
    res.status(500).json({ error: 'Failed to create appointment' })
  }
})

// Get appointments for a patient
router.get('/patient/:patientId', async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params
    const { status, upcoming } = req.query

    const where: any = { patientId }

    if (status) {
      where.status = status
    }

    if (upcoming === 'true') {
      where.scheduledAt = { gte: new Date() }
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        doctor: {
          include: { specialty: true }
        }
      },
      orderBy: { scheduledAt: 'asc' }
    })

    res.json(appointments.map(apt => ({
      id: apt.id,
      doctorName: `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}`,
      specialty: apt.doctor.specialty.name,
      doctorPhone: apt.doctor.phone,
      scheduledAt: apt.scheduledAt,
      duration: apt.duration,
      status: apt.status,
      reason: apt.reason,
      notes: apt.notes
    })))
  } catch (error) {
    console.error('Get patient appointments error:', error)
    res.status(500).json({ error: 'Failed to fetch appointments' })
  }
})

// Get appointments for a doctor
router.get('/doctor/:doctorId', async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params
    const { status, date } = req.query

    const where: any = { doctorId }

    if (status) {
      where.status = status
    }

    if (date) {
      const startOfDay = new Date(date as string)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date as string)
      endOfDay.setHours(23, 59, 59, 999)

      where.scheduledAt = {
        gte: startOfDay,
        lte: endOfDay
      }
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: true
      },
      orderBy: { scheduledAt: 'asc' }
    })

    res.json(appointments.map(apt => ({
      id: apt.id,
      patientName: `${apt.patient.firstName} ${apt.patient.lastName}`,
      patientPhone: apt.patient.phone,
      scheduledAt: apt.scheduledAt,
      duration: apt.duration,
      status: apt.status,
      reason: apt.reason,
      notes: apt.notes
    })))
  } catch (error) {
    console.error('Get doctor appointments error:', error)
    res.status(500).json({ error: 'Failed to fetch appointments' })
  }
})

// Update appointment status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status, notes } = req.body

    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status, notes },
      include: {
        patient: true,
        doctor: {
          include: { specialty: true }
        }
      }
    })

    // Trigger n8n webhook for status change notification
    try {
      if (process.env.N8N_WEBHOOK_NOTIFICATION) {
        await axios.post(process.env.N8N_WEBHOOK_NOTIFICATION, {
          type: 'APPOINTMENT_STATUS_CHANGE',
          appointment: {
            id: appointment.id,
            patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
            patientPhone: appointment.patient.phone,
            doctorName: `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
            newStatus: status,
            scheduledAt: appointment.scheduledAt
          }
        })
      }
    } catch (webhookError) {
      console.log('n8n webhook not available')
    }

    res.json({
      id: appointment.id,
      status: appointment.status,
      message: `Appointment ${status.toLowerCase()}`
    })
  } catch (error) {
    console.error('Update appointment status error:', error)
    res.status(500).json({ error: 'Failed to update appointment' })
  }
})

// Get available time slots for a doctor
router.get('/slots/:doctorId', async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params
    const { date } = req.query

    if (!date) {
      return res.status(400).json({ error: 'Date is required' })
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    })

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' })
    }

    // Check if doctor works on this day
    const requestedDate = new Date(date as string)
    const dayName = requestedDate.toLocaleDateString('en-US', { weekday: 'long' })

    if (!doctor.workingDays.includes(dayName)) {
      return res.json({ 
        available: false, 
        message: `Doctor is not available on ${dayName}`,
        slots: []
      })
    }

    // Get existing appointments for the day
    const startOfDay = new Date(date as string)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date as string)
    endOfDay.setHours(23, 59, 59, 999)

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })

    // Generate available slots
    const slots = generateTimeSlots(
      doctor.availableFrom || '09:00',
      doctor.availableTo || '17:00',
      30, // 30 minute slots
      existingAppointments.map(apt => apt.scheduledAt)
    )

    res.json({
      available: true,
      date: date,
      slots
    })
  } catch (error) {
    console.error('Get available slots error:', error)
    res.status(500).json({ error: 'Failed to fetch available slots' })
  }
})

// Helper function to generate time slots
function generateTimeSlots(
  startTime: string, 
  endTime: string, 
  slotDuration: number,
  bookedSlots: Date[]
): { time: string; available: boolean }[] {
  const slots: { time: string; available: boolean }[] = []
  
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)
  
  let currentHour = startHour
  let currentMin = startMin

  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`
    
    // Check if this slot is booked
    const isBooked = bookedSlots.some(bookedTime => {
      const bookedHour = bookedTime.getHours()
      const bookedMin = bookedTime.getMinutes()
      return bookedHour === currentHour && bookedMin === currentMin
    })

    slots.push({
      time: timeStr,
      available: !isBooked
    })

    // Increment by slot duration
    currentMin += slotDuration
    if (currentMin >= 60) {
      currentHour += Math.floor(currentMin / 60)
      currentMin = currentMin % 60
    }
  }

  return slots
}

export default router


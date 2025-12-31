import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Import routes
import chatRoutes from './routes/chat.routes'
import doctorRoutes from './routes/doctor.routes'
import appointmentRoutes from './routes/appointment.routes'
import authRoutes from './routes/auth.routes'
import symptomRoutes from './routes/symptom.routes'
import vapiRoutes from './routes/vapi.routes'
import webhookRoutes from './routes/webhook.routes'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-production-domain.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'AI Medical Assistant API'
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/symptoms', symptomRoutes)
app.use('/api/vapi', vapiRoutes)
app.use('/api/webhooks', webhookRoutes)

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message)
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested resource was not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`
  🏥 AI Medical Assistant API Server
  ===================================
  🚀 Server running on port ${PORT}
  📍 Environment: ${process.env.NODE_ENV || 'development'}
  🔗 Health check: http://localhost:${PORT}/health
  📚 API Base URL: http://localhost:${PORT}/api
  ===================================
  `)
})

export default app


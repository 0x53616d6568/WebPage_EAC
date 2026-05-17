import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { setupDatabase } from './config/setupDatabase.js'

// Routes
import authRoutes from './routes/authRoutes.js'
import usersRoutes from './routes/usersRoutes.js'
import doorsRoutes from './routes/doorsRoutes.js'
import logsRoutes from './routes/logsRoutes.js'
import requestsRoutes from './routes/requestsRoutes.js'
import preferencesRoutes from './routes/preferencesRoutes.js'

// Middleware
import { errorHandler } from './middleware/auth.js'

dotenv.config()

const app = express()
const PORT = parseInt(process.env.PORT) || 8888

// Middleware
app.use(cors())
app.use(express.json())

// Initialize database
await setupDatabase()

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/doors', doorsRoutes)
app.use('/api/logs', logsRoutes)
app.use('/api/requests', requestsRoutes)
app.use('/api/preferences', preferencesRoutes)

// Error handler
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
})


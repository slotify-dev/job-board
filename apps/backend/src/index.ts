import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env, isDevelopment } from './config/env.ts'
import { healthRouter } from './routes/health.ts'

const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan(isDevelopment ? 'dev' : 'combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/health', healthRouter)

app.get('/', (req, res) => {
  res.json({ 
    message: 'Job Board API',
    version: '1.0.0',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString()
  })
})

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`)
  console.log(`Database: ${env.DATABASE_URL.split('@')[1]}`) // Only log host/db, not credentials
})
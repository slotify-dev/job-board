import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { healthRouter } from './routes/health.ts'

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001

app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/health', healthRouter)

app.get('/', (req, res) => {
  res.json({ 
    message: 'Job Board API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
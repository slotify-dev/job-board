import { config } from 'dotenv'

config()

interface EnvironmentConfig {
  PORT: number
  NODE_ENV: 'development' | 'production' | 'test'
  DATABASE_URL: string
}

function validateEnv(): EnvironmentConfig {
  const requiredVars = ['PORT', 'NODE_ENV', 'DATABASE_URL'] as const

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`)
    }
  }

  const PORT = parseInt(process.env.PORT!, 10)
  if (isNaN(PORT) || PORT <= 0 || PORT > 65535) {
    throw new Error(`Invalid PORT: ${process.env.PORT}. Must be a valid port number.`)
  }

  const NODE_ENV = process.env.NODE_ENV!
  if (!['development', 'production', 'test'].includes(NODE_ENV)) {
    throw new Error(`Invalid NODE_ENV: ${NODE_ENV}. Must be 'development', 'production', or 'test'.`)
  }

  const DATABASE_URL = process.env.DATABASE_URL!
  if (!DATABASE_URL.startsWith('postgresql://')) {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection string starting with postgresql://')
  }

  return {
    PORT,
    NODE_ENV: NODE_ENV as EnvironmentConfig['NODE_ENV'],
    DATABASE_URL
  }
}

export const env = validateEnv()

export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'
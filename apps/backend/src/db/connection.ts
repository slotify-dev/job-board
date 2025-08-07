export interface DatabaseConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
}

export class DatabaseConnection {
  private config: DatabaseConfig

  constructor(config: DatabaseConfig) {
    this.config = config
  }

  async connect(): Promise<void> {
    console.log(`Connecting to database at ${this.config.host}:${this.config.port}`)
  }

  async disconnect(): Promise<void> {
    console.log('Disconnecting from database')
  }

  isConnected(): boolean {
    return true
  }
}
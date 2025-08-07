export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PaginationQuery {
  page?: number
  limit?: number
}

export interface SortQuery {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SearchQuery {
  search?: string
}

export type ApiError = {
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  uptime: number
  version: string
}
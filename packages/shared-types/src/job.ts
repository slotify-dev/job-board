export interface Job {
  id: string
  title: string
  description: string
  company: string
  location: string
  salaryMin?: number
  salaryMax?: number
  currency?: string
  type: JobType
  remote: boolean
  experience: ExperienceLevel
  skills: string[]
  postedAt: Date
  expiresAt?: Date
  isActive: boolean
}

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  FREELANCE = 'FREELANCE',
  INTERNSHIP = 'INTERNSHIP',
}

export enum ExperienceLevel {
  ENTRY = 'ENTRY',
  MID = 'MID',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
  EXECUTIVE = 'EXECUTIVE',
}

export interface CreateJobRequest {
  title: string
  description: string
  company: string
  location: string
  salaryMin?: number
  salaryMax?: number
  currency?: string
  type: JobType
  remote: boolean
  experience: ExperienceLevel
  skills: string[]
  expiresAt?: Date
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {
  isActive?: boolean
}
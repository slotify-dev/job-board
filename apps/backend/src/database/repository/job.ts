import { Job } from '../models/job.model';

export default class JobRepository {
  private jobs: Job[] = [];

  async create(job: Job): Promise<Job> {
    this.jobs.push(job);
    return job;
  }

  async findAll(): Promise<Job[]> {
    return this.jobs;
  }

  async findById(id: string): Promise<Job | null> {
    const job = this.jobs.find((job) => job.id === id);
    return job || null;
  }

  async update(id: string, updatedJob: Partial<Job>): Promise<Job | null> {
    const index = this.jobs.findIndex((job) => job.id === id);
    if (index === -1) return null;

    const job = { ...this.jobs[index], ...updatedJob };
    this.jobs[index] = job;
    return job;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.jobs.findIndex((job) => job.id === id);
    if (index === -1) return false;

    this.jobs.splice(index, 1);
    return true;
  }
}

import { JobSeeker } from '../models/jobSeeker.model';

export default class JobSeekerRepository {
  private jobSeekers: JobSeeker[] = [];

  async create(jobSeeker: JobSeeker): Promise<JobSeeker> {
    this.jobSeekers.push(jobSeeker);
    return jobSeeker;
  }

  async findById(id: string): Promise<JobSeeker | null> {
    const jobSeeker = this.jobSeekers.find((js) => js.id === id);
    return jobSeeker || null;
  }

  async findAll(): Promise<JobSeeker[]> {
    return this.jobSeekers;
  }

  async update(
    id: string,
    updatedJobSeeker: Partial<JobSeeker>,
  ): Promise<JobSeeker | null> {
    const index = this.jobSeekers.findIndex((js) => js.id === id);
    if (index === -1) return null;

    const existingJobSeeker = this.jobSeekers[index];
    const updated = { ...existingJobSeeker, ...updatedJobSeeker };
    this.jobSeekers[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.jobSeekers.findIndex((js) => js.id === id);
    if (index === -1) return false;

    this.jobSeekers.splice(index, 1);
    return true;
  }
}

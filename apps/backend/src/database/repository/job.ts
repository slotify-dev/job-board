import { eq, desc, and, ilike, sql } from 'drizzle-orm';
import { db } from '../client';
import { jobs, Job, NewJob } from '../models/job.model';
import { employers } from '../models/employer.model';

export interface JobFilters {
  location?: string;
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface JobWithCompany extends Job {
  companyName: string | null;
}

export default class JobRepository {
  static async findAll(filters: JobFilters = {}): Promise<{
    jobs: JobWithCompany[];
    total: number;
  }> {
    try {
      const page = filters.page || 1;
      const limit = Math.min(filters.limit || 10, 50);
      const offset = (page - 1) * limit;

      const conditions = [eq(jobs.status, filters.status || 'active')];

      if (filters.location) {
        conditions.push(ilike(jobs.location, `%${filters.location}%`));
      }

      if (filters.search) {
        conditions.push(
          sql`(${ilike(jobs.title, `%${filters.search}%`)} OR ${ilike(
            jobs.description,
            `%${filters.search}%`,
          )})`,
        );
      }

      const jobsQuery = db
        .select({
          id: jobs.id,
          uuid: jobs.uuid,
          employerId: jobs.employerId,
          title: jobs.title,
          description: jobs.description,
          location: jobs.location,
          status: jobs.status,
          createdAt: jobs.createdAt,
          companyName: employers.companyName,
        })
        .from(jobs)
        .leftJoin(employers, eq(jobs.employerId, employers.userId))
        .where(and(...conditions))
        .orderBy(desc(jobs.createdAt))
        .limit(limit)
        .offset(offset);

      const countQuery = db
        .select({ count: sql<number>`count(*)` })
        .from(jobs)
        .where(and(...conditions));

      const [jobsResult, countResult] = await Promise.all([
        jobsQuery,
        countQuery,
      ]);

      return {
        jobs: jobsResult,
        total: countResult[0]?.count || 0,
      };
    } catch (error) {
      console.error('Error finding jobs:', error);
      throw error;
    }
  }

  static async findByUuid(uuid: string): Promise<JobWithCompany | null> {
    try {
      const result = await db
        .select({
          id: jobs.id,
          uuid: jobs.uuid,
          employerId: jobs.employerId,
          title: jobs.title,
          description: jobs.description,
          location: jobs.location,
          status: jobs.status,
          createdAt: jobs.createdAt,
          companyName: employers.companyName,
        })
        .from(jobs)
        .leftJoin(employers, eq(jobs.employerId, employers.userId))
        .where(eq(jobs.uuid, uuid))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error('Error finding job by UUID:', error);
      throw error;
    }
  }

  static async findById(id: number): Promise<Job | null> {
    try {
      const result = await db
        .select()
        .from(jobs)
        .where(eq(jobs.id, id))
        .limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error finding job by ID:', error);
      throw error;
    }
  }

  static async findByEmployerId(employerId: number): Promise<Job[]> {
    try {
      const result = await db
        .select()
        .from(jobs)
        .where(eq(jobs.employerId, employerId))
        .orderBy(desc(jobs.createdAt));
      return result;
    } catch (error) {
      console.error('Error finding jobs by employer ID:', error);
      throw error;
    }
  }

  static async create(jobData: NewJob): Promise<Job> {
    try {
      const result = await db.insert(jobs).values(jobData).returning();
      if (!result[0]) {
        throw new Error('Failed to create job');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  static async updateByUuid(
    uuid: string,
    updates: Partial<NewJob>,
  ): Promise<Job | null> {
    try {
      const result = await db
        .update(jobs)
        .set(updates)
        .where(eq(jobs.uuid, uuid))
        .returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  static async deleteByUuid(uuid: string): Promise<boolean> {
    try {
      const result = await db
        .delete(jobs)
        .where(eq(jobs.uuid, uuid))
        .returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  static async findByUuidAndEmployerId(
    uuid: string,
    employerId: number,
  ): Promise<Job | null> {
    try {
      const result = await db
        .select()
        .from(jobs)
        .where(and(eq(jobs.uuid, uuid), eq(jobs.employerId, employerId)))
        .limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error finding job by UUID and employer ID:', error);
      throw error;
    }
  }
}

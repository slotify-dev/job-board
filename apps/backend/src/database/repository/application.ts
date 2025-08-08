import { eq, and, desc } from 'drizzle-orm';
import { db } from '../client';
import {
  applications,
  Application,
  NewApplication,
} from '../models/application.model';
import { jobs } from '../models/job.model';
import { jobSeekers } from '../models/jobSeeker.model';
import { employers } from '../models/employer.model';

export interface ApplicationWithJob extends Application {
  jobTitle: string | null;
  companyName: string | null;
}

export interface ApplicationWithJobSeeker extends Application {
  jobSeekerName: string | null;
  jobSeekerContactInfo: string | null;
}

export default class ApplicationRepository {
  static async findByUuid(uuid: string): Promise<Application | null> {
    try {
      const result = await db
        .select()
        .from(applications)
        .where(eq(applications.uuid, uuid))
        .limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error finding application by UUID:', error);
      throw error;
    }
  }

  static async findByJobSeekerId(
    jobSeekerId: number,
  ): Promise<ApplicationWithJob[]> {
    try {
      const result = await db
        .select({
          id: applications.id,
          uuid: applications.uuid,
          jobId: applications.jobId,
          jobSeekerId: applications.jobSeekerId,
          resumeUrl: applications.resumeUrl,
          coverLetter: applications.coverLetter,
          status: applications.status,
          createdAt: applications.createdAt,
          jobTitle: jobs.title,
          companyName: employers.companyName,
        })
        .from(applications)
        .leftJoin(jobs, eq(applications.jobId, jobs.id))
        .leftJoin(employers, eq(jobs.employerId, employers.userId))
        .where(eq(applications.jobSeekerId, jobSeekerId))
        .orderBy(desc(applications.createdAt));

      return result;
    } catch (error) {
      console.error('Error finding applications by job seeker ID:', error);
      throw error;
    }
  }

  static async findByJobId(jobId: number): Promise<ApplicationWithJobSeeker[]> {
    try {
      const result = await db
        .select({
          id: applications.id,
          uuid: applications.uuid,
          jobId: applications.jobId,
          jobSeekerId: applications.jobSeekerId,
          resumeUrl: applications.resumeUrl,
          coverLetter: applications.coverLetter,
          status: applications.status,
          createdAt: applications.createdAt,
          jobSeekerName: jobSeekers.fullName,
          jobSeekerContactInfo: jobSeekers.contactInfo,
        })
        .from(applications)
        .leftJoin(jobSeekers, eq(applications.jobSeekerId, jobSeekers.userId))
        .where(eq(applications.jobId, jobId))
        .orderBy(desc(applications.createdAt));

      return result;
    } catch (error) {
      console.error('Error finding applications by job ID:', error);
      throw error;
    }
  }

  static async create(applicationData: NewApplication): Promise<Application> {
    try {
      const result = await db
        .insert(applications)
        .values(applicationData)
        .returning();
      if (!result[0]) {
        throw new Error('Failed to create application');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  }

  static async updateByUuid(
    uuid: string,
    updates: Partial<NewApplication>,
  ): Promise<Application | null> {
    try {
      const result = await db
        .update(applications)
        .set(updates)
        .where(eq(applications.uuid, uuid))
        .returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  }

  static async findExistingApplication(
    jobId: number,
    jobSeekerId: number,
  ): Promise<Application | null> {
    try {
      const result = await db
        .select()
        .from(applications)
        .where(
          and(
            eq(applications.jobId, jobId),
            eq(applications.jobSeekerId, jobSeekerId),
          ),
        )
        .limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error finding existing application:', error);
      throw error;
    }
  }

  static async deleteByUuid(uuid: string): Promise<boolean> {
    try {
      const result = await db
        .delete(applications)
        .where(eq(applications.uuid, uuid))
        .returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  }
}

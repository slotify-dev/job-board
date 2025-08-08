import { eq } from 'drizzle-orm';
import { db } from '../client';
import { jobSeekers, JobSeeker, NewJobSeeker } from '../models/jobSeeker.model';

export default class JobSeekerRepository {
  static async findByUserId(userId: number): Promise<JobSeeker | null> {
    try {
      const result = await db
        .select()
        .from(jobSeekers)
        .where(eq(jobSeekers.userId, userId))
        .limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error finding job seeker by user ID:', error);
      throw error;
    }
  }

  static async create(jobSeekerData: NewJobSeeker): Promise<JobSeeker> {
    try {
      const result = await db
        .insert(jobSeekers)
        .values(jobSeekerData)
        .returning();
      if (!result[0]) {
        throw new Error('Failed to create job seeker profile');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating job seeker:', error);
      throw error;
    }
  }

  static async updateByUserId(
    userId: number,
    updates: Partial<NewJobSeeker>,
  ): Promise<JobSeeker | null> {
    try {
      const result = await db
        .update(jobSeekers)
        .set(updates)
        .where(eq(jobSeekers.userId, userId))
        .returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating job seeker:', error);
      throw error;
    }
  }

  static async deleteByUserId(userId: number): Promise<boolean> {
    try {
      const result = await db
        .delete(jobSeekers)
        .where(eq(jobSeekers.userId, userId))
        .returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting job seeker:', error);
      throw error;
    }
  }
}

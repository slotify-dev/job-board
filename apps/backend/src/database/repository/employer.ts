import { eq } from 'drizzle-orm';
import { db } from '../client';
import { employers, Employer, NewEmployer } from '../models/employer.model';

export default class EmployerRepository {
  static async findByUserId(userId: number): Promise<Employer | null> {
    try {
      const result = await db
        .select()
        .from(employers)
        .where(eq(employers.userId, userId))
        .limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error finding employer by user ID:', error);
      throw error;
    }
  }

  static async create(employerData: NewEmployer): Promise<Employer> {
    try {
      const result = await db
        .insert(employers)
        .values(employerData)
        .returning();
      if (!result[0]) {
        throw new Error('Failed to create employer profile');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating employer:', error);
      throw error;
    }
  }

  static async updateByUserId(
    userId: number,
    updates: Partial<NewEmployer>,
  ): Promise<Employer | null> {
    try {
      const result = await db
        .update(employers)
        .set(updates)
        .where(eq(employers.userId, userId))
        .returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating employer:', error);
      throw error;
    }
  }

  static async deleteByUserId(userId: number): Promise<boolean> {
    try {
      const result = await db
        .delete(employers)
        .where(eq(employers.userId, userId))
        .returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting employer:', error);
      throw error;
    }
  }
}

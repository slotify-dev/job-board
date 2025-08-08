import { eq, and } from 'drizzle-orm';
import { db } from '../client';
import { users, User, NewUser } from '../models/user.model';

export default class UserRepository {
  static async findById(userId: number): Promise<User | null> {
    try {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async findBySsoProviderAndId(
    provider: string,
    ssoId: string,
  ): Promise<User | null> {
    try {
      const result = await db
        .select()
        .from(users)
        .where(and(eq(users.ssoProvider, provider), eq(users.ssoId, ssoId)))
        .limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error finding user by SSO provider and ID:', error);
      throw error;
    }
  }

  static async create(userData: NewUser): Promise<User> {
    try {
      const result = await db.insert(users).values(userData).returning();
      if (!result[0]) {
        throw new Error('Failed to create user');
      }
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async updateById(
    userId: number,
    updates: Partial<NewUser>,
  ): Promise<User | null> {
    try {
      const result = await db
        .update(users)
        .set(updates)
        .where(eq(users.id, userId))
        .returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async deleteById(userId: number): Promise<boolean> {
    try {
      const result = await db
        .delete(users)
        .where(eq(users.id, userId))
        .returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

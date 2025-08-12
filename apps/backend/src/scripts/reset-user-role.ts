#!/usr/bin/env bun
/**
 * Script to reset a user's roleConfirmed flag for testing role selection flow
 * Usage: bun src/scripts/reset-user-role.ts <email>
 */

import { db } from '../database/client.js';
import { users } from '../database/models/user.model.js';
import { eq } from 'drizzle-orm';

async function resetUserRole(email: string) {
  try {
    console.log(`Resetting roleConfirmed for user: ${email}`);

    const result = await db
      .update(users)
      .set({
        roleConfirmed: false,
        role: 'job_seeker', // Reset to default
      })
      .where(eq(users.email, email))
      .returning({
        id: users.id,
        email: users.email,
        role: users.role,
        roleConfirmed: users.roleConfirmed,
      });

    if (result.length === 0) {
      console.log(`❌ User not found: ${email}`);
      process.exit(1);
    }

    console.log('✅ User updated successfully:');
    console.log(result[0]);
  } catch (error) {
    console.error('❌ Error resetting user role:', error);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: bun src/scripts/reset-user-role.ts <email>');
  process.exit(1);
}

resetUserRole(email).then(() => {
  process.exit(0);
});

import { User } from '../models/user.model';

export default class UserRepository {
  // This class will contain methods to interact with the user data in the database.
  // For example, methods to create, read, update, and delete user records.

  async createUser(userData) {
    // Logic to create a new user in the database
    return User.create(userData);
  }

  async getUserById(userId) {
    // Logic to retrieve a user by their ID
    return User.findByPk(userId);
  }

  async updateUser(userId, updatedData) {
    // Logic to update an existing user's data
    const user = await this.getUserById(userId);
    if (user) {
      return user.update(updatedData);
    }
    throw new Error('User not found');
  }

  async deleteUser(userId) {
    // Logic to delete a user from the database
    const user = await this.getUserById(userId);
    if (user) {
      return user.destroy();
    }
    throw new Error('User not found');
  }
}

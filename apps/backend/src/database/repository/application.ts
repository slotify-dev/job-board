import { Application } from '../models/application.model';

export default class ApplicationRepository {
  // This class will contain methods to interact with the application data in the database.
  // For example, methods to create, read, update, and delete application records.

  async createApplication(applicationData) {
    // Logic to create a new application in the database
    return Application.create(applicationData);
  }

  async getApplicationById(applicationId) {
    // Logic to retrieve an application by its ID
    return Application.findByPk(applicationId);
  }

  async updateApplication(applicationId, updatedData) {
    // Logic to update an existing application's data
    const application = await this.getApplicationById(applicationId);
    if (application) {
      return application.update(updatedData);
    }
    throw new Error('Application not found');
  }

  async deleteApplication(applicationId) {
    // Logic to delete an application from the database
    const application = await this.getApplicationById(applicationId);
    if (application) {
      return application.destroy();
    }
    throw new Error('Application not found');
  }
}

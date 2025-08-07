import { Employer } from '../models/employer.model';

export default class EmployerRepository {
  private employers: Employer[] = [];

  async create(employer: Employer): Promise<Employer> {
    this.employers.push(employer);
    return employer;
  }

  async findById(id: string): Promise<Employer | null> {
    return this.employers.find((emp) => emp.id === id) || null;
  }

  async findAll(): Promise<Employer[]> {
    return this.employers;
  }

  async update(
    id: string,
    updatedData: Partial<Employer>,
  ): Promise<Employer | null> {
    const employer = await this.findById(id);
    if (!employer) return null;

    Object.assign(employer, updatedData);
    return employer;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.employers.findIndex((emp) => emp.id === id);
    if (index === -1) return false;

    this.employers.splice(index, 1);
    return true;
  }
}

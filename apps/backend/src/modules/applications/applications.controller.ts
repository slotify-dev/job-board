import { Request, Response } from 'express';
import { CreateApplicationRequest } from './applications.types';

export class ApplicationsController {
  async applyToJob(
    req: Request<{ uuid: string }, object, CreateApplicationRequest>,
    res: Response,
  ) {
    // TODO: Implement job application (job seeker only)
    res.json({ success: true });
  }

  async getMyApplications(req: Request<object, object>, res: Response) {
    // TODO: Implement get user's submitted applications (job seeker only)
    res.json({ success: true });
  }
}

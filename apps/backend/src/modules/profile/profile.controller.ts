import { Request, Response } from 'express';
import {
  UpdateJobSeekerProfileRequest,
  UpdateEmployerProfileRequest,
} from './profile.types';

export class ProfileController {
  async getProfile(req: Request<object, object>, res: Response) {
    // TODO: Implement get user profile (job seeker or employer)
    res.json({ success: true });
  }

  async updateProfile(
    req: Request<
      object,
      object,
      UpdateJobSeekerProfileRequest | UpdateEmployerProfileRequest
    >,
    res: Response,
  ) {
    // TODO: Implement update user profile (job seeker or employer)
    res.json({ success: true });
  }
}

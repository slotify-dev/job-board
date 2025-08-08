import { Request, Response } from 'express';
import {
  UpdateJobSeekerProfileRequest,
  UpdateEmployerProfileRequest,
  ProfileResponse,
} from './profile.types';
import JobSeekerRepository from '../../database/repository/jobSeekers';
import EmployerRepository from '../../database/repository/employer';

export class ProfileController {
  async getProfile(
    req: Request<object, ProfileResponse>,
    res: Response<ProfileResponse>,
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false });
      }

      const { role, id: userId } = req.user;

      if (role === 'job_seeker') {
        const profile = await JobSeekerRepository.findByUserId(userId);
        return res.json({
          success: true,
          profile: profile || undefined,
          userRole: 'job_seeker',
        });
      } else if (role === 'employer') {
        const profile = await EmployerRepository.findByUserId(userId);
        return res.json({
          success: true,
          profile: profile || undefined,
          userRole: 'employer',
        });
      } else {
        return res.status(400).json({ success: false });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      return res.status(500).json({ success: false });
    }
  }

  async updateProfile(
    req: Request<
      object,
      ProfileResponse,
      UpdateJobSeekerProfileRequest | UpdateEmployerProfileRequest
    >,
    res: Response<ProfileResponse>,
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false });
      }

      const { role, id: userId } = req.user;

      if (role === 'job_seeker') {
        const updates = req.body as UpdateJobSeekerProfileRequest;
        let profile = await JobSeekerRepository.findByUserId(userId);

        if (!profile) {
          if (!updates.fullName) {
            return res.status(400).json({ success: false });
          }
          profile = await JobSeekerRepository.create({
            userId,
            fullName: updates.fullName,
            contactInfo: updates.contactInfo || null,
            resumeUrl: updates.resumeUrl || null,
          });
        } else {
          profile = await JobSeekerRepository.updateByUserId(userId, updates);
        }

        return res.json({
          success: true,
          profile: profile || undefined,
          userRole: 'job_seeker',
        });
      } else if (role === 'employer') {
        const updates = req.body as UpdateEmployerProfileRequest;
        let profile = await EmployerRepository.findByUserId(userId);

        if (!profile) {
          if (!updates.companyName || !updates.contactPerson) {
            return res.status(400).json({ success: false });
          }
          profile = await EmployerRepository.create({
            userId,
            companyName: updates.companyName,
            contactPerson: updates.contactPerson,
            companyWebsite: updates.companyWebsite || null,
          });
        } else {
          profile = await EmployerRepository.updateByUserId(userId, updates);
        }

        return res.json({
          success: true,
          profile: profile || undefined,
          userRole: 'employer',
        });
      } else {
        return res.status(400).json({ success: false });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ success: false });
    }
  }
}

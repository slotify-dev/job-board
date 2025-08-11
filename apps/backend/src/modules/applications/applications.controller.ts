import { Request, Response } from 'express';
import {
  CreateApplicationRequest,
  JobParams,
  MyApplicationsResponse,
  ApplicationResponse,
} from './applications.types';
import JobRepository from '../../database/repository/job';
import ApplicationRepository from '../../database/repository/application';
import JobSeekerRepository from '../../database/repository/jobSeekers';

export class ApplicationsController {
  async applyToJob(
    req: Request<JobParams, ApplicationResponse, CreateApplicationRequest>,
    res: Response<ApplicationResponse>,
  ) {
    try {
      if (!req.user || req.user.role !== 'job_seeker') {
        return res.status(403).json({ success: false });
      }

      const jobSeeker = await JobSeekerRepository.findByUserId(req.user.id);
      if (!jobSeeker) {
        return res.status(400).json({ success: false });
      }

      const job = await JobRepository.findByUuid(req.params.uuid);
      if (!job || job.status !== 'active') {
        return res.status(404).json({ success: false });
      }

      const existingApplication =
        await ApplicationRepository.findExistingApplication(
          job.id,
          req.user.id,
        );

      if (existingApplication) {
        return res.status(409).json({ success: false });
      }

      // Determine resume URL - use file upload path or provided URL
      let resumeUrl: string;
      if (req.file) {
        resumeUrl = `/uploads/resumes/${req.file.filename}`;
      } else if (req.body.resumeUrl) {
        resumeUrl = req.body.resumeUrl;
      } else {
        return res.status(400).json({ success: false });
      }

      const application = await ApplicationRepository.create({
        jobId: job.id,
        jobSeekerId: req.user.id,
        resumeUrl,
        coverLetter: req.body.coverLetter || null,
        status: 'pending',
      });

      return res.status(201).json({
        success: true,
        application: {
          uuid: application.uuid,
          jobId: application.jobId,
          jobSeekerId: application.jobSeekerId,
          resumeUrl: application.resumeUrl,
          coverLetter: application.coverLetter,
          status: application.status,
          createdAt: application.createdAt,
          jobTitle: job.title || 'Unknown Job',
          companyName: job.companyName || 'Unknown Company',
        },
      });
    } catch (error) {
      console.error('Error applying to job:', error);
      return res.status(500).json({ success: false });
    }
  }

  async getMyApplications(
    req: Request<object, MyApplicationsResponse>,
    res: Response<MyApplicationsResponse>,
  ) {
    try {
      if (!req.user || req.user.role !== 'job_seeker') {
        return res.status(403).json({ success: false, applications: [] });
      }

      const jobSeeker = await JobSeekerRepository.findByUserId(req.user.id);
      if (!jobSeeker) {
        return res.json({ success: true, applications: [] });
      }

      const applications = await ApplicationRepository.findByJobSeekerId(
        req.user.id,
      );

      return res.json({
        success: true,
        applications: applications.map((app) => ({
          uuid: app.uuid,
          jobId: app.jobId,
          jobSeekerId: app.jobSeekerId,
          resumeUrl: app.resumeUrl,
          coverLetter: app.coverLetter,
          status: app.status,
          createdAt: app.createdAt,
          jobTitle: app.jobTitle || 'Unknown Job',
          companyName: app.companyName || 'Unknown Company',
        })),
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
      return res.status(500).json({ success: false, applications: [] });
    }
  }
}

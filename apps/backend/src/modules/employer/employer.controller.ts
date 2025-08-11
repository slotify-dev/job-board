import { Request, Response } from 'express';
import {
  CreateJobRequest,
  UpdateJobRequest,
  UpdateApplicationStatusRequest,
  JobParams,
  ApplicationParams,
  EmployerJobsResponse,
  JobApplicationsResponse,
  JobResponse,
  ApplicationStatusResponse,
} from './employer.types';
import { JobStatus, ApplicationStatus } from '@job-board/shared-types';
import JobRepository from '../../database/repository/job';
import ApplicationRepository from '../../database/repository/application';
import EmployerRepository from '../../database/repository/employer';

export class EmployerController {
  async createJob(
    req: Request<object, JobResponse, CreateJobRequest>,
    res: Response<JobResponse>,
  ) {
    try {
      if (!req.user || req.user.role !== 'employer') {
        return res.status(403).json({ success: false });
      }

      const employer = await EmployerRepository.findByUserId(req.user.id);
      if (!employer) {
        return res.status(400).json({ success: false });
      }

      const job = await JobRepository.create({
        employerId: req.user.id,
        title: req.body.title,
        description: req.body.description,
        location: req.body.location || null,
        status: req.body.status || 'active',
      });

      return res.status(201).json({
        success: true,
        job: {
          id: job.id,
          uuid: job.uuid,
          title: job.title,
          description: job.description as Record<string, unknown>,
          location: job.location,
          status: job.status as JobStatus,
          createdAt: job.createdAt,
        },
      });
    } catch (error) {
      console.error('Error creating job:', error);
      return res.status(500).json({ success: false });
    }
  }

  async getMyJobs(
    req: Request<object, EmployerJobsResponse>,
    res: Response<EmployerJobsResponse>,
  ) {
    try {
      if (!req.user || req.user.role !== 'employer') {
        return res.status(403).json({ success: false, jobs: [] });
      }

      const jobs = await JobRepository.findByEmployerId(req.user.id);

      return res.json({
        success: true,
        jobs: jobs.map((job) => ({
          id: job.id,
          uuid: job.uuid,
          title: job.title,
          description: job.description as Record<string, unknown>,
          location: job.location,
          status: job.status as JobStatus,
          createdAt: job.createdAt,
        })),
      });
    } catch (error) {
      console.error('Error fetching employer jobs:', error);
      return res.status(500).json({ success: false, jobs: [] });
    }
  }

  async updateJob(
    req: Request<JobParams, JobResponse, UpdateJobRequest>,
    res: Response<JobResponse>,
  ) {
    try {
      if (!req.user || req.user.role !== 'employer') {
        return res.status(403).json({ success: false });
      }

      const existingJob = await JobRepository.findByUuidAndEmployerId(
        req.params.uuid,
        req.user.id,
      );

      if (!existingJob) {
        return res.status(404).json({ success: false });
      }

      const updatedJob = await JobRepository.updateByUuid(
        req.params.uuid,
        req.body,
      );

      if (!updatedJob) {
        return res.status(404).json({ success: false });
      }

      return res.json({
        success: true,
        job: {
          id: updatedJob.id,
          uuid: updatedJob.uuid,
          title: updatedJob.title,
          description: updatedJob.description as Record<string, unknown>,
          location: updatedJob.location,
          status: updatedJob.status as JobStatus,
          createdAt: updatedJob.createdAt,
        },
      });
    } catch (error) {
      console.error('Error updating job:', error);
      return res.status(500).json({ success: false });
    }
  }

  async deleteJob(
    req: Request<JobParams>,
    res: Response<{ success: boolean }>,
  ) {
    try {
      if (!req.user || req.user.role !== 'employer') {
        return res.status(403).json({ success: false });
      }

      const existingJob = await JobRepository.findByUuidAndEmployerId(
        req.params.uuid,
        req.user.id,
      );

      if (!existingJob) {
        return res.status(404).json({ success: false });
      }

      const deleted = await JobRepository.deleteByUuid(req.params.uuid);

      if (!deleted) {
        return res.status(404).json({ success: false });
      }

      return res.json({ success: true });
    } catch (error) {
      console.error('Error deleting job:', error);
      return res.status(500).json({ success: false });
    }
  }

  async getJobApplications(
    req: Request<JobParams, JobApplicationsResponse>,
    res: Response<JobApplicationsResponse>,
  ) {
    try {
      if (!req.user || req.user.role !== 'employer') {
        return res.status(403).json({ success: false, applications: [] });
      }

      const job = await JobRepository.findByUuidAndEmployerId(
        req.params.uuid,
        req.user.id,
      );

      if (!job) {
        return res.status(404).json({ success: false, applications: [] });
      }

      const applications = await ApplicationRepository.findByJobId(job.id);
      return res.json({
        success: true,
        applications: applications.map((app) => ({
          id: app.id,
          uuid: app.uuid,
          jobId: app.jobId,
          jobSeekerId: app.jobSeekerId,
          resumeUrl: app.resumeUrl,
          coverLetter: app.coverLetter,
          status: app.status as ApplicationStatus,
          createdAt: app.createdAt,
          applicant: {
            uuid: app.jobSeekerUuid?.toString() || '',
            name: app.jobSeekerName || '',
            email: app.jobSeekerEmail || '',
          },
        })),
      });
    } catch (error) {
      console.error('Error fetching job applications:', error);
      return res.status(500).json({ success: false, applications: [] });
    }
  }

  async updateApplicationStatus(
    req: Request<
      ApplicationParams,
      ApplicationStatusResponse,
      UpdateApplicationStatusRequest
    >,
    res: Response<ApplicationStatusResponse>,
  ) {
    try {
      if (!req.user || req.user.role !== 'employer') {
        return res.status(403).json({ success: false });
      }

      const application = await ApplicationRepository.findByUuid(
        req.params.uuid,
      );

      if (!application) {
        return res.status(404).json({ success: false });
      }

      const job = await JobRepository.findById(application.jobId);
      if (!job || job.employerId !== req.user.id) {
        return res.status(403).json({ success: false });
      }

      await ApplicationRepository.updateByUuid(req.params.uuid, {
        status: req.body.status,
      });

      const updatedApplication =
        await ApplicationRepository.findByUuidWithJobSeeker(req.params.uuid);

      if (!updatedApplication) {
        return res.status(500).json({
          success: false,
          message: 'Application updated but could not retrieve updated data',
        });
      }

      return res.json({
        success: true,
        application: {
          id: updatedApplication.id,
          uuid: updatedApplication.uuid,
          jobId: updatedApplication.jobId,
          jobSeekerId: updatedApplication.jobSeekerId,
          resumeUrl: updatedApplication.resumeUrl,
          coverLetter: updatedApplication.coverLetter,
          status: updatedApplication.status as ApplicationStatus,
          createdAt: updatedApplication.createdAt,
          applicant: {
            uuid: updatedApplication.jobSeekerUuid?.toString() || '',
            name: updatedApplication.jobSeekerName || '',
            email: updatedApplication.jobSeekerEmail || '',
          },
        },
        message: 'Application status updated successfully',
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      return res.status(500).json({ success: false });
    }
  }
}

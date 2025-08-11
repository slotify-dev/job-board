import { Request, Response } from 'express';
import { JobParams, JobsResponse, JobResponse } from './jobs.types';
import JobRepository from '../../database/repository/job';

export class JobsController {
  async getJobs(req: Request, res: Response<JobsResponse>) {
    try {
      const filters = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        location:
          typeof req.query.location === 'string'
            ? req.query.location
            : undefined,
        search:
          typeof req.query.search === 'string' ? req.query.search : undefined,
        status:
          typeof req.query.status === 'string' ? req.query.status : undefined,
      };

      const { jobs, total } = await JobRepository.findAll(filters);

      return res.json({
        success: true,
        jobs: jobs.map((job) => ({
          uuid: job.uuid,
          title: job.title,
          description: job.description as Record<string, unknown>,
          location: job.location,
          status: job.status,
          companyName: job.companyName,
          createdAt: job.createdAt,
        })),
        total,
        page: filters.page || 1,
        limit: filters.limit || 10,
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return res.status(500).json({
        success: false,
        jobs: [],
        total: 0,
        page: 1,
        limit: 10,
      });
    }
  }

  async getJobById(
    req: Request<JobParams, JobResponse>,
    res: Response<JobResponse>,
  ) {
    try {
      const job = await JobRepository.findByUuid(req.params.uuid);

      if (!job) {
        return res.status(404).json({
          success: false,
        });
      }

      if (job.status !== 'active') {
        return res.status(404).json({
          success: false,
        });
      }

      return res.json({
        success: true,
        job: {
          uuid: job.uuid,
          title: job.title,
          description: job.description as Record<string, unknown>,
          location: job.location,
          status: job.status,
          companyName: job.companyName,
          createdAt: job.createdAt,
        },
      });
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      return res.status(500).json({
        success: false,
      });
    }
  }
}

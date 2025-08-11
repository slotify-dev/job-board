import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEmployerJobs } from '../hooks/useEmployerJobs';
import {
  extractPlainText,
  truncateText,
} from '../../../shared/utils/blockEditorUtils';
import type { EmployerJob } from '../types/employer.types';
import { DeleteJobModal } from './DeleteJobModal';

export function JobManagementTable() {
  const { jobs, loading, deleteJob } = useEmployerJobs();
  const [deleteModalJob, setDeleteModalJob] = useState<EmployerJob | null>(
    null,
  );

  const handleDeleteClick = (job: EmployerJob) => {
    setDeleteModalJob(job);
  };

  const handleDeleteConfirm = async () => {
    if (deleteModalJob) {
      await deleteJob(deleteModalJob.uuid);
      setDeleteModalJob(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalJob(null);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Closed
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-primary-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-primary-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="card text-center py-8">
        <div className="text-primary-400 mb-3">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-black mb-2">
          No jobs posted yet
        </h3>
        <p className="text-primary-600 mb-4">
          Start by posting your first job to attract great candidates
        </p>
        <Link to="/employer/post-job" className="btn-primary inline-flex">
          Post Your First Job
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-primary-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-black">My Job Postings</h3>
            <Link to="/employer/post-job" className="btn-primary">
              Post New Job
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-primary-200">
            <thead className="bg-primary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Posted
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-primary-200">
              {jobs.map((job) => (
                <tr key={job.uuid} className="hover:bg-primary-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-black">
                        {job.title}
                      </div>
                      <div className="text-sm text-primary-600 truncate max-w-xs">
                        {truncateText(extractPlainText(job.description), 60)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-black">
                      {job.location || 'Not specified'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(job.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                    {formatDate(job.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/employer/jobs/${job.uuid}/applications`}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded text-xs font-medium"
                      >
                        Applications
                      </Link>
                      <Link
                        to={`/employer/edit-job/${job.uuid}`}
                        className="text-black hover:text-primary-700 bg-primary-100 hover:bg-primary-200 px-3 py-1 rounded text-xs font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(job)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteModalJob && (
        <DeleteJobModal
          job={deleteModalJob}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </>
  );
}

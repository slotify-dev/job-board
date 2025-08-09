import React from 'react';
import type {
  JobApplication,
  ApplicationStatus,
} from '../types/application-review.types';
import { ApplicationStatusBadge } from './ApplicationStatusBadge';
import { ApplicationStatusDropdown } from './ApplicationStatusDropdown';

interface ApplicationsTableProps {
  applications: JobApplication[];
  onStatusUpdate: (
    applicationId: string,
    status: ApplicationStatus,
  ) => Promise<void>;
  updatingId?: string | null;
}

export function ApplicationsTable({
  applications,
  onStatusUpdate,
  updatingId,
}: ApplicationsTableProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleResumeClick = (resumeUrl: string) => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (applications.length === 0) {
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-black mb-2">
          No Applications Yet
        </h3>
        <p className="text-primary-600">
          When job seekers apply to this position, their applications will
          appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-primary-200">
          <thead className="bg-primary-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                Applied Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                Cover Letter
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-primary-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-primary-200">
            {applications.map((application) => (
              <tr key={application.uuid} className="hover:bg-primary-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-black">
                      {application.applicant.name}
                    </div>
                    <div className="text-sm text-primary-600">
                      {application.applicant.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                  {formatDate(application.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ApplicationStatusBadge status={application.status} />
                </td>
                <td className="px-6 py-4">
                  {application.coverLetter ? (
                    <div className="max-w-xs">
                      <p className="text-sm text-primary-600 truncate">
                        {application.coverLetter}
                      </p>
                    </div>
                  ) : (
                    <span className="text-sm text-primary-400 italic">
                      No cover letter
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end items-center gap-2">
                    <button
                      onClick={() => handleResumeClick(application.resumeUrl)}
                      disabled={!application.resumeUrl}
                      className="text-black hover:text-primary-700 bg-primary-100 hover:bg-primary-200 px-3 py-1 rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Resume
                    </button>
                    <ApplicationStatusDropdown
                      currentStatus={application.status}
                      applicationId={application.uuid}
                      onStatusChange={onStatusUpdate}
                      disabled={updatingId === application.uuid}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

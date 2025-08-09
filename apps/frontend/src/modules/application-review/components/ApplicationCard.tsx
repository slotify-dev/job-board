import React from 'react';
import type {
  JobApplication,
  ApplicationStatus,
} from '../types/application-review.types';
import { ApplicationStatusBadge } from './ApplicationStatusBadge';
import { ApplicationStatusDropdown } from './ApplicationStatusDropdown';

interface ApplicationCardProps {
  application: JobApplication;
  onStatusUpdate: (
    applicationId: string,
    status: ApplicationStatus,
  ) => Promise<void>;
  isUpdating?: boolean;
}

export function ApplicationCard({
  application,
  onStatusUpdate,
  isUpdating = false,
}: ApplicationCardProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleResumeClick = () => {
    if (application.resumeUrl) {
      window.open(application.resumeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Applicant Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-medium text-black">
                {application.applicant.name}
              </h3>
              <p className="text-sm text-primary-600">
                {application.applicant.email}
              </p>
              <p className="text-xs text-primary-500 mt-1">
                Applied {formatDate(application.createdAt)}
              </p>
            </div>
            <ApplicationStatusBadge status={application.status} />
          </div>

          {/* Cover Letter */}
          {application.coverLetter && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-black mb-2">
                Cover Letter
              </h4>
              <div className="bg-primary-50 rounded-md p-3">
                <p className="text-sm text-primary-700 whitespace-pre-wrap">
                  {application.coverLetter.length > 200
                    ? `${application.coverLetter.substring(0, 200)}...`
                    : application.coverLetter}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleResumeClick}
              disabled={!application.resumeUrl}
              className="btn-secondary text-sm px-4 py-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              View Resume
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-primary-600">Status:</span>
              <ApplicationStatusDropdown
                currentStatus={application.status}
                applicationId={application.uuid}
                onStatusChange={onStatusUpdate}
                disabled={isUpdating}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useJobApplications } from '../hooks/useJobApplications';
import { ApplicationsOverview } from './ApplicationsOverview';
import { ApplicationsTable } from './ApplicationsTable';
import { ApplicationCard } from './ApplicationCard';
import type { ApplicationStatus } from '../types/application-review.types';

type ViewMode = 'table' | 'cards';

export function JobApplicationsView() {
  const { jobId } = useParams<{ jobId: string }>();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>(
    'all',
  );

  const {
    applications,
    loading,
    error,
    jobTitle,
    updating,
    updateApplicationStatus,
    getApplicationsByStatus,
    getStatusCounts,
  } = useJobApplications(jobId || '');

  if (!jobId) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="card text-center py-8">
          <p className="text-red-600">Job ID is required</p>
          <Link to="/employer/dashboard" className="btn-secondary mt-4">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-primary-200 rounded mb-6"></div>
          <ApplicationsOverview
            statusCounts={{
              pending: 0,
              reviewing: 0,
              interviewed: 0,
              accepted: 0,
              rejected: 0,
            }}
            loading={true}
          />
          <div className="h-64 bg-primary-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="card text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/employer/dashboard" className="btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();
  const filteredApplications =
    filterStatus === 'all'
      ? applications
      : getApplicationsByStatus(filterStatus);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-primary-600 mb-2">
          <Link to="/employer/dashboard" className="hover:text-primary-800">
            Dashboard
          </Link>
          <span>›</span>
          <span>Applications</span>
        </div>
        <h1 className="text-2xl font-bold text-black">
          Applications for: {jobTitle}
        </h1>
        <p className="text-primary-600 mt-1">
          {applications.length} total applications
        </p>
      </div>

      {/* Status Overview */}
      <ApplicationsOverview statusCounts={statusCounts} />

      {/* Filters and View Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-black">
              Filter by status:
            </label>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as ApplicationStatus | 'all')
              }
              className="text-sm border border-primary-300 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            >
              <option value="all">
                All Applications ({applications.length})
              </option>
              <option value="pending">Pending ({statusCounts.pending})</option>
              <option value="reviewing">
                Under Review ({statusCounts.reviewing})
              </option>
              <option value="interviewed">
                Interviewed ({statusCounts.interviewed})
              </option>
              <option value="accepted">
                Accepted ({statusCounts.accepted})
              </option>
              <option value="rejected">
                Rejected ({statusCounts.rejected})
              </option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-primary-600">View:</span>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded ${
              viewMode === 'table'
                ? 'bg-black text-white'
                : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-2 rounded ${
              viewMode === 'cards'
                ? 'bg-black text-white'
                : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Applications Display */}
      {viewMode === 'table' ? (
        <ApplicationsTable
          applications={filteredApplications}
          onStatusUpdate={updateApplicationStatus}
          updatingId={updating}
        />
      ) : (
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-primary-600">
                No applications found for the selected filter.
              </p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <ApplicationCard
                key={application.uuid}
                application={application}
                onStatusUpdate={updateApplicationStatus}
                isUpdating={updating === application.uuid}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

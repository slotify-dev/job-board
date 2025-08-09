import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../shared/store/store';
import { useEmployerJobs } from '../hooks/useEmployerJobs';
import { JobManagementTable } from './JobManagementTable';
import { Layout } from '../../../shared/components/layout';

export function EmployerDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { jobs, loading } = useEmployerJobs();

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="card mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-black mb-2">
                Welcome to your Employer Dashboard
              </h2>
              <p className="text-primary-600">
                Manage your job postings and find great talent
              </p>
            </div>
            <div className="bg-primary-100 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">
                  {loading
                    ? '-'
                    : jobs.filter((job) => job.status === 'active').length}
                </div>
                <div className="text-sm text-primary-600">Active Job Posts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/employer/post-job"
            className="card hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-lg mx-auto mb-3 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-black mb-1">Post a Job</h3>
              <p className="text-sm text-primary-600">
                Create a new job listing
              </p>
            </div>
          </Link>

          <Link
            to="/employer/dashboard"
            className="card hover:shadow-md transition-shadow cursor-pointer block"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-lg mx-auto mb-3 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-black mb-1">My Job Posts</h3>
              <p className="text-sm text-primary-600">
                {loading ? 'Loading...' : `${jobs.length} total jobs`}
              </p>
            </div>
          </Link>

          <Link
            to="/employer/candidates"
            className="card hover:shadow-md transition-shadow cursor-pointer block"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-lg mx-auto mb-3 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 715.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-black mb-1">Candidates</h3>
              <p className="text-sm text-primary-600">Review applications</p>
            </div>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-primary-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">
                {loading ? '-' : jobs.length}
              </div>
              <div className="text-sm text-primary-600">Total Jobs</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-primary-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">
                {loading
                  ? '-'
                  : jobs.filter((job) => job.status === 'active').length}
              </div>
              <div className="text-sm text-primary-600">Active Jobs</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-primary-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">
                {loading
                  ? '-'
                  : jobs.filter((job) => job.status === 'draft').length}
              </div>
              <div className="text-sm text-primary-600">Draft Jobs</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-primary-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">
                {loading
                  ? '-'
                  : jobs.filter((job) => job.status === 'closed').length}
              </div>
              <div className="text-sm text-primary-600">Closed Jobs</div>
            </div>
          </div>
        </div>

        {/* Job Management Section */}
        <JobManagementTable />
      </div>
    </Layout>
  );
}

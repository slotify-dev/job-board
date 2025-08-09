import { Link } from 'react-router-dom';
import { Layout } from '../../../shared/components/layout';

export function CandidatesPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/employer/dashboard"
            className="text-primary-600 hover:text-primary-800 font-medium mb-4 inline-flex items-center"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-black mt-4">All Candidates</h1>
          <p className="text-primary-600 mt-2">
            View and manage applications across all your job postings
          </p>
        </div>

        <div className="card">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-black mb-2">
              Candidates Overview
            </h3>
            <p className="text-primary-600 mb-6">
              To review applications for a specific job, go to your job posts
              and click &quot;View Applications&quot; on any job listing.
            </p>
            <Link to="/employer/dashboard" className="btn-primary">
              View My Job Posts
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-black mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/employer/post-job"
              className="card hover:shadow-md transition-shadow p-4 text-center"
            >
              <div className="w-10 h-10 bg-black rounded-lg mx-auto mb-3 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
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
              <h3 className="font-medium text-black mb-1">Post New Job</h3>
              <p className="text-sm text-primary-600">
                Create a job listing to attract candidates
              </p>
            </Link>

            <Link
              to="/employer/dashboard"
              className="card hover:shadow-md transition-shadow p-4 text-center"
            >
              <div className="w-10 h-10 bg-black rounded-lg mx-auto mb-3 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
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
              <h3 className="font-medium text-black mb-1">Manage Jobs</h3>
              <p className="text-sm text-primary-600">
                Edit and review your job postings
              </p>
            </Link>

            <Link
              to="/"
              className="card hover:shadow-md transition-shadow p-4 text-center"
            >
              <div className="w-10 h-10 bg-black rounded-lg mx-auto mb-3 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-black mb-1">Browse Jobs</h3>
              <p className="text-sm text-primary-600">
                See how your jobs appear to candidates
              </p>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

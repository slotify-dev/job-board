import { useAppSelector, useAppDispatch } from '../../../shared/store/store';
import { logout } from '../../auth/store/authSlice';
import { getUserDisplayName } from '../../auth/utils/authHelpers';
import { toast } from 'sonner';

export function EmployerDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <header className="bg-white border-b border-primary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-black">Job Board</h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-primary-600">
                Welcome, {getUserDisplayName(user)}
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm px-3 py-1"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
                <div className="text-2xl font-bold text-black">0</div>
                <div className="text-sm text-primary-600">Active Job Posts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card hover:shadow-md transition-shadow cursor-pointer">
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
          </div>

          <div className="card hover:shadow-md transition-shadow cursor-pointer">
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
              <p className="text-sm text-primary-600">Manage your listings</p>
            </div>
          </div>

          <div className="card hover:shadow-md transition-shadow cursor-pointer">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-black mb-1">Candidates</h3>
              <p className="text-sm text-primary-600">Review applications</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-primary-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">0</div>
              <div className="text-sm text-primary-600">Total Views</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-primary-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">0</div>
              <div className="text-sm text-primary-600">Applications</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-primary-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">0</div>
              <div className="text-sm text-primary-600">Interviews</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-primary-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">0</div>
              <div className="text-sm text-primary-600">Hires</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-medium text-black mb-4">
            Recent Activity
          </h3>
          <div className="text-center py-8">
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
            <p className="text-primary-600">No recent activity</p>
            <p className="text-sm text-primary-500 mt-1">
              Post your first job to see activity here
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

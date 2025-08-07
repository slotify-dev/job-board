import { useAppSelector, useAppDispatch } from '../../../shared/store/store';
import { logout } from '../../auth/store/authSlice';
import { getUserDisplayName } from '../../auth/utils/authHelpers';
import { toast } from 'sonner';

export function JobSeekerDashboard() {
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
                Welcome to your Job Seeker Dashboard
              </h2>
              <p className="text-primary-600">
                Find your dream job and manage your applications
              </p>
            </div>
            <div className="bg-primary-100 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">0</div>
                <div className="text-sm text-primary-600">
                  Active Applications
                </div>
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-black mb-1">Browse Jobs</h3>
              <p className="text-sm text-primary-600">
                Discover new opportunities
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
              <h3 className="font-medium text-black mb-1">My Applications</h3>
              <p className="text-sm text-primary-600">Track your progress</p>
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-black mb-1">Profile</h3>
              <p className="text-sm text-primary-600">
                Update your information
              </p>
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
              Start applying to jobs to see your activity here
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useAppSelector } from '../../../shared/store/store';
import { Navigate } from 'react-router-dom';

export function ProfilePageBasic() {
  const { user } = useAppSelector((state) => state.auth);

  // Redirect if not authenticated or not a job seeker
  if (!user || user.role !== 'job_seeker') {
    return <Navigate to="/auth/login" replace />;
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
            <nav className="flex space-x-8">
              <a
                href="/dashboard/job-seeker"
                className="text-primary-600 hover:text-black transition-colors"
              >
                Dashboard
              </a>
              <span className="text-black font-medium">Profile</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Profile Page - Basic Test
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                ✅ Routing Works!
              </h3>
              <p className="text-gray-600">
                You successfully navigated to the profile page.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">
                User Information
              </h3>
              <div className="mt-2 space-y-1">
                <p>
                  <strong>User ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong> {user.role}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">Next Steps</h3>
              <p className="text-gray-600">This basic version confirms that:</p>
              <ul className="mt-2 list-disc list-inside text-gray-600 space-y-1">
                <li>Authentication is working</li>
                <li>Route protection is working</li>
                <li>User data is available</li>
                <li>The page renders correctly</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

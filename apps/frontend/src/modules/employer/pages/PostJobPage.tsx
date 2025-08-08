import { Link } from 'react-router-dom';
import { PostJobForm } from '../components/PostJobForm';

export function PostJobPage() {
  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <header className="bg-white border-b border-primary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/employer/dashboard"
                className="text-primary-600 hover:text-primary-800 font-medium"
              >
                ← Back to Dashboard
              </Link>
              <div className="h-6 border-l border-primary-300"></div>
              <h1 className="text-xl font-bold text-black">Post New Job</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <PostJobForm />
      </main>
    </div>
  );
}

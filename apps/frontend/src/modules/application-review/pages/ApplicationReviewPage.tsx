import { Link } from 'react-router-dom';
import { JobApplicationsView } from '../components/JobApplicationsView';
import { Layout } from '../../../shared/components/layout';

export function ApplicationReviewPage() {
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
          <h1 className="text-2xl font-bold text-black mt-4">
            Review Applications
          </h1>
        </div>
        <JobApplicationsView />
      </div>
    </Layout>
  );
}

import { Link } from 'react-router-dom';
import { PostJobForm } from '../components/PostJobForm';
import { Layout } from '../../../shared/components/layout';

export function PostJobPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/employer/dashboard"
            className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center"
          >
            ← Back to Dashboard
          </Link>
        </div>
        <PostJobForm />
      </div>
    </Layout>
  );
}

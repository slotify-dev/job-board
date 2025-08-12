import { RoleSelectionForm } from './RoleSelectionForm';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../../shared/components/layout';
import { useEffect } from 'react';

export function RoleSelectionPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    // Redirect if role is already confirmed
    if (user?.roleConfirmed) {
      if (user.role === 'employer') {
        navigate('/dashboard/employer');
      } else {
        navigate('/dashboard/job-seeker');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleRoleSelectionSuccess = () => {
    // Redirect will be handled by the useEffect above
    // after the user state is updated
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-primary-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const userName = user.email?.split('@')[0] || 'there';

  return (
    <Layout>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black mb-2">
              Choose Your Role
            </h1>
            <p className="text-primary-600">Complete your account setup</p>
          </div>

          <RoleSelectionForm
            userName={userName}
            onSuccess={handleRoleSelectionSuccess}
          />
        </div>
      </div>
    </Layout>
  );
}

import { RoleSelectionForm } from './RoleSelectionForm';
import { useAuth } from '../hooks/useAuth';

export function RoleSelectionPage() {
  const { auth0User } = useAuth();

  const handleRoleSelectionSuccess = () => {
    // The role redirect will be handled by the useAuth hook
    // after successful account linking
  };

  if (!auth0User) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-primary-600">Loading...</p>
        </div>
      </div>
    );
  }

  const userName = auth0User.given_name || auth0User.name || 'there';

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black mb-2">Job Board</h1>
          <p className="text-primary-600">Complete your account setup</p>
        </div>

        <RoleSelectionForm
          auth0Sub={auth0User.sub || ''}
          userName={userName}
          onSuccess={handleRoleSelectionSuccess}
        />
      </div>
    </div>
  );
}

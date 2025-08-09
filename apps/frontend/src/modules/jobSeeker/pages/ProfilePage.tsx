import { useState } from 'react';
import { ProfileView } from '../components/ProfileView';
import { ProfileEditForm } from '../components/ProfileEditForm';
import { useAppSelector } from '../../../shared/store/store';
import { Navigate } from 'react-router-dom';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  // Redirect if not authenticated or not a job seeker
  if (!user || user.role !== 'job_seeker') {
    return <Navigate to="/login" replace />;
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSaved = () => {
    setIsEditing(false);
  };

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
                href="/dashboard"
                className="text-primary-600 hover:text-black transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/"
                className="text-primary-600 hover:text-black transition-colors"
              >
                Browse Jobs
              </a>
              <a
                href="/applications"
                className="text-primary-600 hover:text-black transition-colors"
              >
                My Applications
              </a>
              <span className="text-black font-medium">Profile</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {isEditing ? (
          <ProfileEditForm onCancel={handleCancel} onSaved={handleSaved} />
        ) : (
          <ProfileView onEditClick={handleEditClick} />
        )}
      </main>
    </div>
  );
}

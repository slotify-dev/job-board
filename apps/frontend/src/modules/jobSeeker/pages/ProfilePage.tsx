import { useState } from 'react';
import { ProfileView } from '../components/ProfileView';
import { ProfileEditForm } from '../components/ProfileEditForm';
import { useAppSelector } from '../../../shared/store/store';
import { Navigate } from 'react-router-dom';
import { Layout } from '../../../shared/components/layout';

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
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-black mb-2">Your Profile</h1>
            <p className="text-primary-600">
              Manage your profile information and job preferences
            </p>
          </div>

          {/* Profile Content */}
          {isEditing ? (
            <ProfileEditForm onCancel={handleCancel} onSaved={handleSaved} />
          ) : (
            <ProfileView onEditClick={handleEditClick} />
          )}
        </div>
      </div>
    </Layout>
  );
}

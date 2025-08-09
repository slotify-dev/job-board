import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Layout } from '../../../shared/components/layout';
import { EmployerProfileView } from '../components/EmployerProfileView';
import { EmployerProfileEditForm } from '../components/EmployerProfileEditForm';
import { useEmployerProfile } from '../hooks/useEmployerProfile';
import type { UpdateEmployerProfileRequest } from '../types/profile.types';

export function EmployerProfilePage() {
  const { profile, loading, error, fetchProfile, updateProfile } =
    useEmployerProfile();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // If no profile exists, start in edit mode
  useEffect(() => {
    if (!loading && !profile && !error) {
      setIsEditing(true);
    }
  }, [loading, profile, error]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (updates: UpdateEmployerProfileRequest) => {
    try {
      await updateProfile(updates);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      throw error; // Re-throw to let the form handle it
    }
  };

  const handleCancel = () => {
    if (!profile) {
      // If there's no existing profile, don't allow cancel
      toast.error('Please create your company profile to continue');
      return;
    }
    setIsEditing(false);
  };

  if (loading && !profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <div className="flex items-center justify-center py-12">
                <div className="loading-spinner"></div>
                <span className="ml-3 text-primary-600">
                  Loading profile...
                </span>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-black mb-2">
                  Error Loading Profile
                </h3>
                <p className="text-primary-600 mb-4">{error}</p>
                <button onClick={fetchProfile} className="btn-primary">
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-black mb-2">
              Company Profile
            </h1>
            <p className="text-primary-600">
              Manage your company information and contact details
            </p>
          </div>

          {/* Profile Content */}
          {isEditing ? (
            <EmployerProfileEditForm
              profile={profile}
              onSave={handleSave}
              onCancel={handleCancel}
              loading={loading}
            />
          ) : profile ? (
            <EmployerProfileView profile={profile} onEdit={handleEdit} />
          ) : (
            // This should rarely be shown due to useEffect above
            <div className="card">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0v-5a2 2 0 011-1h4a2 2 0 011 1v5m-4 0h2m-6-4h2m2-6h2m-8 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-black mb-2">
                  No Profile Found
                </h3>
                <p className="text-primary-600 mb-4">
                  Create your company profile to get started
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary"
                >
                  Create Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

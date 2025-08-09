import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../../shared/store/store';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Layout } from '../../../shared/components/layout';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface Profile {
  userId: number;
  fullName: string;
  contactInfo: string | null;
  resumeUrl: string | null;
  createdAt: Date;
}

export function ProfilePageComplete() {
  const { user } = useAppSelector((state) => state.auth);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    fullName: '',
    contactInfo: '',
    resumeUrl: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/me/profile`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No profile exists yet
          setProfile(null);
          return;
        }
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.profile) {
        const profileData = {
          ...data.profile,
          createdAt: new Date(data.profile.createdAt),
        };
        setProfile(profileData);
        setFormData({
          fullName: profileData.fullName || '',
          contactInfo: profileData.contactInfo || '',
          resumeUrl: profileData.resumeUrl || '',
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.length > 255) {
      errors.fullName = 'Full name must be less than 255 characters';
    }

    if (formData.contactInfo && formData.contactInfo.length > 1000) {
      errors.contactInfo =
        'Contact information must be less than 1000 characters';
    }

    if (formData.resumeUrl && formData.resumeUrl.trim()) {
      try {
        new URL(formData.resumeUrl);
      } catch {
        errors.resumeUrl = 'Please enter a valid URL';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/me/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          fullName: formData.fullName,
          contactInfo: formData.contactInfo || null,
          resumeUrl: formData.resumeUrl || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.profile) {
        const updatedProfile = {
          ...data.profile,
          createdAt: new Date(data.profile.createdAt),
        };
        setProfile(updatedProfile);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update profile',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleEditClick = () => {
    if (!profile) {
      // No profile exists, initialize with empty values
      setFormData({
        fullName: '',
        contactInfo: '',
        resumeUrl: '',
      });
    }
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (profile) {
      // Reset form to current profile data
      setFormData({
        fullName: profile.fullName || '',
        contactInfo: profile.contactInfo || '',
        resumeUrl: profile.resumeUrl || '',
      });
    }
    setFormErrors({});
    setIsEditing(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Redirect if not authenticated or not a job seeker
  if (!user || user.role !== 'job_seeker') {
    return <Navigate to="/auth/login" replace />;
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">Error: {error}</div>
            <button
              onClick={fetchProfile}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {profile ? 'My Profile' : 'Create Your Profile'}
            </h2>
            {!isEditing && profile && (
              <button
                onClick={handleEditClick}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* View Mode */}
          {!isEditing && (
            <div>
              {profile ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Personal Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <p className="mt-1 text-gray-900">
                            {profile.fullName}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <p className="mt-1 text-gray-900">{user.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Member Since
                          </label>
                          <p className="mt-1 text-gray-500">
                            {profile.createdAt.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Contact & Resume
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Contact Information
                          </label>
                          {profile.contactInfo ? (
                            <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                              {profile.contactInfo}
                            </p>
                          ) : (
                            <p className="mt-1 text-gray-400 italic">
                              Not provided
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Resume
                          </label>
                          {profile.resumeUrl ? (
                            <a
                              href={profile.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 text-black hover:text-gray-600 underline"
                            >
                              View Resume →
                            </a>
                          ) : (
                            <p className="mt-1 text-gray-400 italic">
                              Not provided
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Complete Your Profile
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Add your information to get started with job applications
                  </p>
                  <button
                    onClick={handleEditClick}
                    className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Set Up Profile
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Edit Mode */}
          {isEditing && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black ${
                    formErrors.fullName ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your full name"
                  required
                />
                {formErrors.fullName && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contactInfo"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contact Information
                </label>
                <textarea
                  id="contactInfo"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black ${
                    formErrors.contactInfo ? 'border-red-500' : ''
                  }`}
                  placeholder="Phone number, address, or other contact details..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Add your phone number, address, or other contact information
                </p>
                {formErrors.contactInfo && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.contactInfo}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="resumeUrl"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Resume URL
                </label>
                <input
                  type="url"
                  id="resumeUrl"
                  name="resumeUrl"
                  value={formData.resumeUrl}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black ${
                    formErrors.resumeUrl ? 'border-red-500' : ''
                  }`}
                  placeholder="https://drive.google.com/..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Link to your resume (Google Drive, Dropbox, personal website,
                  etc.)
                </p>
                {formErrors.resumeUrl && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.resumeUrl}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </span>
                  ) : (
                    'Save Profile'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

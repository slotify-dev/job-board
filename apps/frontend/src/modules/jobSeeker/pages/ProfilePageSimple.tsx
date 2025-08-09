import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../shared/store/store';
import { Navigate } from 'react-router-dom';
import { profileServiceSimple } from '../services/profileServiceSimple';
import type { SimpleProfile } from '../services/profileServiceSimple';

export function ProfilePageSimple() {
  const { user } = useAppSelector((state) => state.auth);
  const [profile, setProfile] = useState<SimpleProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const profileData = await profileServiceSimple.getProfile();
        setProfile(profileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchProfile();
    }
  }, [user]);

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
        <div className="card">
          <h2 className="text-2xl font-bold text-black mb-6">
            Profile Page Test
          </h2>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          )}

          {error && <div className="text-red-600 mb-4">Error: {error}</div>}

          <div className="space-y-4">
            <h3 className="text-lg font-medium">User Information</h3>
            <p>
              <strong>User ID:</strong> {user.id}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>

            {profile && (
              <>
                <h3 className="text-lg font-medium">Profile Information</h3>
                <p>
                  <strong>Full Name:</strong> {profile.fullName}
                </p>
                <p>
                  <strong>Contact Info:</strong>{' '}
                  {profile.contactInfo || 'Not provided'}
                </p>
                <p>
                  <strong>Resume URL:</strong>{' '}
                  {profile.resumeUrl || 'Not provided'}
                </p>
              </>
            )}

            {!loading && !profile && !error && (
              <div className="text-primary-600">
                No profile found. This user needs to create a profile.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

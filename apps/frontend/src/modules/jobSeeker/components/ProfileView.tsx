import { useProfile } from '../hooks/useProfile';
import type { JobSeekerProfile } from '../types/profile.types';
import { ResumeViewer } from '../../../components/ResumeViewer';

interface ProfileViewProps {
  onEditClick: () => void;
}

export function ProfileView({ onEditClick }: ProfileViewProps) {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error loading profile: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="btn-secondary"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <svg
            className="w-16 h-16 mx-auto text-primary-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h3 className="text-lg font-medium text-black mb-2">
            Complete Your Profile
          </h3>
          <p className="text-primary-600 mb-6">
            Add your information to get started with job applications
          </p>
          <button onClick={onEditClick} className="btn-primary">
            Set Up Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">My Profile</h2>
          <button onClick={onEditClick} className="btn-secondary">
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Full Name
              </label>
              <p className="text-black font-medium">{profile.fullName}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Member Since
              </label>
              <p className="text-primary-600">
                {profile.createdAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Email
              </label>
              <p className="text-primary-600">{profile.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Phone
              </label>
              {profile.phone ? (
                <p className="text-primary-600">{profile.phone}</p>
              ) : (
                <p className="text-primary-400 italic">
                  No phone number provided
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Address
              </label>
              {profile.address ? (
                <p className="text-primary-600">{profile.address}</p>
              ) : (
                <p className="text-primary-400 italic">No address provided</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Resume
              </label>
              {profile.resumeUrl ? (
                <ResumeViewer
                  resumeUrl={profile.resumeUrl}
                  applicantName={profile.fullName}
                  variant="link"
                  className="text-black hover:text-primary-600 transition-colors"
                />
              ) : (
                <p className="text-primary-400 italic">No resume uploaded</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completion Status */}
      <div className="card">
        <h3 className="text-lg font-medium text-black mb-4">
          Profile Completion
        </h3>
        <ProfileCompletionStatus profile={profile} />
      </div>
    </div>
  );
}

interface ProfileCompletionStatusProps {
  profile: JobSeekerProfile;
}

function ProfileCompletionStatus({ profile }: ProfileCompletionStatusProps) {
  const completionItems = [
    {
      label: 'Full Name',
      completed: !!profile.fullName,
      required: true,
    },
    {
      label: 'Email',
      completed: !!profile.email,
      required: true,
    },
    {
      label: 'Phone',
      completed: !!profile.phone,
      required: false,
    },
    {
      label: 'Address',
      completed: !!profile.address,
      required: false,
    },
    {
      label: 'Resume',
      completed: !!profile.resumeUrl,
      required: false,
    },
  ];

  const requiredCompleted = completionItems.filter(
    (item) => item.required && item.completed,
  ).length;
  const requiredTotal = completionItems.filter((item) => item.required).length;
  const totalCompleted = completionItems.filter(
    (item) => item.completed,
  ).length;
  const totalItems = completionItems.length;

  const completionPercentage = Math.round((totalCompleted / totalItems) * 100);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-primary-600">Profile Completion</span>
          <span className="text-black font-medium">
            {completionPercentage}%
          </span>
        </div>
        <div className="w-full bg-primary-100 rounded-full h-2">
          <div
            className="bg-black rounded-full h-2 transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-2">
        {completionItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-primary-600">
              {item.label}
              {item.required && <span className="text-red-500 ml-1">*</span>}
            </span>
            <div className="flex items-center">
              {item.completed ? (
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-primary-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3a1 1 0 002 0V7zm-1 6a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      {requiredCompleted < requiredTotal && (
        <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
          Complete required fields (*) to enable job applications.
        </div>
      )}
    </div>
  );
}

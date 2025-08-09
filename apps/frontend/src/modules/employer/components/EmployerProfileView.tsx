import type { EmployerProfile } from '../types/profile.types';

interface EmployerProfileViewProps {
  profile: EmployerProfile;
  onEdit: () => void;
}

export function EmployerProfileView({
  profile,
  onEdit,
}: EmployerProfileViewProps) {
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold text-black">Company Profile</h2>
        <button onClick={onEdit} className="btn-secondary">
          Edit Profile
        </button>
      </div>

      <div className="space-y-6">
        {/* Company Information */}
        <div>
          <h3 className="text-lg font-medium text-black mb-3">
            Company Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Company Name
              </label>
              <p className="text-black bg-primary-50 p-3 rounded-md">
                {profile.companyName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Contact Person
              </label>
              <p className="text-black bg-primary-50 p-3 rounded-md">
                {profile.contactPerson}
              </p>
            </div>
          </div>
        </div>

        {/* Company Website */}
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">
            Company Website
          </label>
          {profile.companyWebsite ? (
            <a
              href={profile.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-800 underline bg-primary-50 p-3 rounded-md block"
            >
              {profile.companyWebsite}
            </a>
          ) : (
            <p className="text-primary-500 bg-primary-50 p-3 rounded-md italic">
              No website provided
            </p>
          )}
        </div>

        {/* Profile Created */}
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">
            Profile Created
          </label>
          <p className="text-black bg-primary-50 p-3 rounded-md">
            {profile.createdAt.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

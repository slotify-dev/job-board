import { useNavigate } from 'react-router-dom';
import { useMyApplications } from '../hooks/useApplications';
import { Layout } from '../../../shared/components/layout';
import type { ApplicationWithJob } from '../types/application.types';

export const MyApplicationsPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useMyApplications();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: 'Under Review',
        className: 'bg-yellow-100 text-yellow-800',
      },
      under_review: {
        label: 'Under Review',
        className: 'bg-yellow-100 text-yellow-800',
      },
      interview: { label: 'Interview', className: 'bg-blue-100 text-blue-800' },
      hired: { label: 'Hired', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status.charAt(0).toUpperCase() + status.slice(1),
      className: 'bg-gray-100 text-gray-800',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  const handleViewJob = (jobId: number) => {
    // Note: We need to find the job UUID, but for now we'll use the numeric ID
    // In a real app, you'd store the job UUID in the application
    navigate(`/jobs/${jobId}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-primary-600">Loading your applications...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="card max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold text-black mb-4">
              Error Loading Applications
            </h1>
            <p className="text-primary-600 mb-4">
              We&apos;re having trouble loading your applications. Please try
              again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const applications = data?.applications || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            My Applications
          </h1>
          <p className="text-primary-600">
            Track the status of your job applications
          </p>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <div className="card max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-black mb-4">
                No Applications Yet
              </h3>
              <p className="text-primary-600 mb-6">
                You haven&apos;t applied to any jobs yet. Start browsing to find
                your dream position!
              </p>
              <button onClick={() => navigate('/')} className="btn-primary">
                Browse Jobs
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application: ApplicationWithJob) => (
              <div
                key={application.uuid}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <h3
                        className="text-lg font-semibold text-black hover:text-primary-700 cursor-pointer"
                        onClick={() => handleViewJob(application.jobId)}
                      >
                        {application.jobTitle}
                      </h3>
                      {getStatusBadge(application.status)}
                    </div>
                    <p className="text-primary-600 mb-2">
                      {application.companyName}
                    </p>
                    <p className="text-sm text-primary-500">
                      Applied on {formatDate(application.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewJob(application.jobId)}
                      className="px-4 py-2 border border-primary-300 text-primary-700 rounded-md hover:bg-primary-50 transition-colors"
                    >
                      View Job
                    </button>
                    {application.resumeUrl && (
                      <a
                        href={application.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-primary-300 text-primary-700 rounded-md hover:bg-primary-50 transition-colors"
                      >
                        View Resume
                      </a>
                    )}
                  </div>
                </div>

                {/* Cover Letter Preview */}
                {application.coverLetter && (
                  <div className="mt-4 pt-4 border-t border-primary-200">
                    <h4 className="text-sm font-medium text-black mb-2">
                      Cover Letter:
                    </h4>
                    <p className="text-sm text-primary-600 line-clamp-2">
                      {application.coverLetter}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {applications.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <p className="text-2xl font-bold text-black">
                {applications.length}
              </p>
              <p className="text-sm text-primary-600">Total Applied</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {
                  applications.filter((app) =>
                    ['pending', 'under_review'].includes(app.status),
                  ).length
                }
              </p>
              <p className="text-sm text-primary-600">Under Review</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-bold text-blue-600">
                {
                  applications.filter((app) => app.status === 'interview')
                    .length
                }
              </p>
              <p className="text-sm text-primary-600">Interviews</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-bold text-green-600">
                {applications.filter((app) => app.status === 'hired').length}
              </p>
              <p className="text-sm text-primary-600">Hired</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

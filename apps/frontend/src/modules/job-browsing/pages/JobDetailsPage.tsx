import { useParams, useNavigate } from 'react-router-dom';
import { useJob } from '../hooks/useJobs';
import { useAuth } from '../../auth/hooks/useAuth';

export const JobDetailsPage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const { data, isLoading, error } = useJob(uuid!);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    if (user?.role !== 'job_seeker') {
      window.alert('Only job seekers can apply for jobs.');
      return;
    }

    // TODO: Implement apply functionality
    window.alert('Apply functionality will be implemented soon!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-primary-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.success || !data?.job) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="card max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Job Not Found</h1>
          <p className="text-primary-600 mb-4">
            The job you&apos;re looking for doesn&apos;t exist or is no longer
            available.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Browse All Jobs
          </button>
        </div>
      </div>
    );
  }

  const { job } = data;

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-primary-600 hover:text-black transition-colors flex items-center gap-2"
        >
          ← Back to Jobs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card">
              {/* Job Header */}
              <div className="border-b border-primary-200 pb-6 mb-6">
                <h1 className="text-3xl font-bold text-black mb-3">
                  {job.title}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-primary-600">
                  <p className="font-medium">
                    {job.companyName || 'Company Name Not Available'}
                  </p>
                  {job.location && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <p>{job.location}</p>
                    </>
                  )}
                  <span className="hidden sm:inline">•</span>
                  <p>Posted {formatDate(job.createdAt)}</p>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <h2 className="text-xl font-semibold text-black mb-4">
                  Job Description
                </h2>
                <div className="prose max-w-none text-primary-700">
                  <p className="whitespace-pre-wrap">{job.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <h3 className="font-medium text-black mb-2">Status</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      job.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {job.status === 'active' ? 'Currently Hiring' : job.status}
                  </span>
                </div>

                {/* Company */}
                <div>
                  <h3 className="font-medium text-black mb-2">Company</h3>
                  <p className="text-primary-600">
                    {job.companyName || 'Not specified'}
                  </p>
                </div>

                {/* Location */}
                {job.location && (
                  <div>
                    <h3 className="font-medium text-black mb-2">Location</h3>
                    <p className="text-primary-600">{job.location}</p>
                  </div>
                )}

                {/* Posted Date */}
                <div>
                  <h3 className="font-medium text-black mb-2">Posted</h3>
                  <p className="text-primary-600">
                    {formatDate(job.createdAt)}
                  </p>
                </div>

                {/* Apply Button - Only show for active jobs */}
                {job.status === 'active' && (
                  <div className="pt-4 border-t border-primary-200">
                    <button
                      onClick={handleApply}
                      className="btn-primary w-full"
                    >
                      {isAuthenticated
                        ? user?.role === 'job_seeker'
                          ? 'Apply Now'
                          : 'Login as Job Seeker to Apply'
                        : 'Login to Apply'}
                    </button>
                    {!isAuthenticated && (
                      <p className="text-sm text-primary-500 mt-2 text-center">
                        You need to login to apply for this position
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

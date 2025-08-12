import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJob } from '../hooks/useJobs';
import { useAuth } from '../../auth/hooks/useAuth';
import { Layout } from '../../../shared/components/layout';
import { BlockRenderer } from '../../../shared/components/editor';
import { JobApplicationForm } from '../components/JobApplicationForm';

export const JobDetailsPage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'description' | 'apply'>(
    'description',
  );

  const { data, isLoading, error } = useJob(uuid!);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const handleApplyTabClick = () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    if (user?.role !== 'job_seeker') {
      // Show modern notification instead of alert
      return;
    }

    setActiveTab('apply');
  };

  const handleApplicationSuccess = () => {
    // Application success is now handled by the form component
    // Don't automatically switch tabs - let user stay on Apply tab to see success message
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-primary-600">Loading job details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !data?.success || !data?.job) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="card max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold text-black mb-4">
              Job Not Found
            </h1>
            <p className="text-primary-600 mb-4">
              The job you&apos;re looking for doesn&apos;t exist or is no longer
              available.
            </p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Browse All Jobs
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const { job } = data;

  return (
    <Layout>
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

              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'description'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Job Description
                </button>
                {job.status === 'active' && (
                  <button
                    onClick={handleApplyTabClick}
                    className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'apply'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Apply Now
                  </button>
                )}
              </div>

              {/* Tab Content */}
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <BlockRenderer data={job.description} />
                </div>
              )}

              {activeTab === 'apply' && job.status === 'active' && (
                <div>
                  {isAuthenticated && user?.role === 'job_seeker' ? (
                    <JobApplicationForm
                      jobUuid={job.uuid}
                      jobTitle={job.title}
                      companyName={job.companyName || 'Company'}
                      onSuccess={handleApplicationSuccess}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">
                        {!isAuthenticated
                          ? 'Please log in to apply for this position'
                          : 'Only job seekers can apply for jobs'}
                      </p>
                      {!isAuthenticated && (
                        <button
                          onClick={() => navigate('/auth/login')}
                          className="btn-primary"
                        >
                          Log In
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
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

                {/* Quick Apply Button - Only show for active jobs */}
                {job.status === 'active' && (
                  <div className="pt-4 border-t border-primary-200">
                    <button
                      onClick={handleApplyTabClick}
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
    </Layout>
  );
};

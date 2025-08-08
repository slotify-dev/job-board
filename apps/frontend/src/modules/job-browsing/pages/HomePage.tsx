import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import { JobCard } from '../components/JobCard';
import { JobFilters } from '../components/JobFilters';
import { Pagination } from '../components/Pagination';
import { Layout } from '../../../shared/components/layout';
import type { JobListQuery } from '../types/job.types';

export const HomePage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<JobListQuery>({
    page: 1,
    limit: 12,
    status: 'active',
  });

  const { data, isLoading, error } = useJobs(filters);

  const handleFiltersChange = (newFilters: Partial<JobListQuery>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJobClick = (jobUuid: string) => {
    navigate(`/jobs/${jobUuid}`);
  };

  const totalPages = data ? Math.ceil(data.total / (filters.limit || 12)) : 0;

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="card max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold text-black mb-4">
              Error Loading Jobs
            </h1>
            <p className="text-primary-600 mb-4">
              We&apos;re having trouble loading job listings. Please try again
              later.
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-primary-600">
            Discover opportunities that match your skills and aspirations
          </p>
        </div>

        {/* Filters */}
        <JobFilters
          onFiltersChange={handleFiltersChange}
          isLoading={isLoading}
        />

        {/* Results Summary */}
        {data && (
          <div className="mb-6">
            <p className="text-primary-600">
              Showing {data.jobs.length} of {data.total} jobs
              {filters.search && <span> for &quot;{filters.search}&quot;</span>}
              {filters.location && <span> in {filters.location}</span>}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-primary-600">Loading jobs...</p>
          </div>
        )}

        {/* Job Listings */}
        {data && data.jobs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data.jobs.map((job) => (
                <JobCard
                  key={job.uuid}
                  job={job}
                  onClick={() => handleJobClick(job.uuid)}
                />
              ))}
            </div>

            <Pagination
              currentPage={filters.page || 1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </>
        )}

        {/* No Results */}
        {data && data.jobs.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="card max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-black mb-4">
                No Jobs Found
              </h3>
              <p className="text-primary-600 mb-4">
                We couldn&apos;t find any jobs matching your criteria. Try
                adjusting your filters.
              </p>
              <button
                onClick={() => handleFiltersChange({})}
                className="btn-primary"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

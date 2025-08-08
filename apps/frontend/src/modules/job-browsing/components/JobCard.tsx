import type { Job } from '../types/job.types';

interface JobCardProps {
  job: Job;
  onClick?: () => void;
}

export const JobCard = ({ job, onClick }: JobCardProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div
      className="card hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-black">{job.title}</h3>
        <span className="text-sm text-primary-500">
          {formatDate(job.createdAt)}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-primary-600 font-medium">
          {job.companyName || 'Company Name Not Available'}
        </p>
        {job.location && (
          <p className="text-primary-500 text-sm">{job.location}</p>
        )}
      </div>

      <div className="mb-4">
        <p className="text-primary-700 line-clamp-3">
          {job.description.length > 150
            ? `${job.description.substring(0, 150)}...`
            : job.description}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            job.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {job.status}
        </span>
        <button className="text-black font-medium hover:text-primary-700 transition-colors">
          View Details →
        </button>
      </div>
    </div>
  );
};

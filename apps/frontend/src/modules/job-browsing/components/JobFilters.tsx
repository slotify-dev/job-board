import React, { useState } from 'react';

interface JobFiltersProps {
  onFiltersChange: (filters: { search?: string; location?: string }) => void;
  isLoading?: boolean;
}

export const JobFilters = ({ onFiltersChange, isLoading }: JobFiltersProps) => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({
      search: search.trim() || undefined,
      location: location.trim() || undefined,
    });
  };

  const handleReset = () => {
    setSearch('');
    setLocation('');
    onFiltersChange({});
  };

  return (
    <div className="card mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-black mb-2"
            >
              Search Keywords
            </label>
            <input
              id="search"
              type="text"
              className="input-field w-full"
              placeholder="Job title, skills, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-black mb-2"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              className="input-field w-full"
              placeholder="City, state, or remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search Jobs'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary"
            disabled={isLoading}
          >
            Clear Filters
          </button>
        </div>
      </form>
    </div>
  );
};

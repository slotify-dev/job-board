import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployerJobs } from '../hooks/useEmployerJobs';
import type { JobFormData } from '../types/employer.types';

interface PostJobFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function PostJobForm({ onCancel, onSuccess }: PostJobFormProps) {
  const navigate = useNavigate();
  const { createJob } = useEmployerJobs();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    location: '',
    requirements: '',
  });
  const [errors, setErrors] = useState<Partial<JobFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<JobFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Job title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    } else if (formData.description.trim().length < 50) {
      newErrors.description = 'Job description must be at least 50 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = 'Requirements are required';
    } else if (formData.requirements.trim().length < 20) {
      newErrors.requirements = 'Requirements must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await createJob({
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        requirements: formData.requirements.trim(),
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/employer/dashboard');
      }
    } catch {
      // Error is handled in the hook
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof JobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/employer/dashboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black mb-2">Post a New Job</h2>
          <p className="text-primary-600">
            Fill in the details to create a new job posting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-black mb-2"
            >
              Job Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${
                errors.title ? 'border-red-300' : 'border-primary-300'
              }`}
              placeholder="e.g. Senior Software Engineer"
              disabled={loading}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-black mb-2"
            >
              Location *
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${
                errors.location ? 'border-red-300' : 'border-primary-300'
              }`}
              placeholder="e.g. San Francisco, CA or Remote"
              disabled={loading}
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-black mb-2"
            >
              Job Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={6}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${
                errors.description ? 'border-red-300' : 'border-primary-300'
              }`}
              placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
              disabled={loading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-sm text-primary-500">
              {formData.description.length}/50 characters minimum
            </p>
          </div>

          <div>
            <label
              htmlFor="requirements"
              className="block text-sm font-medium text-black mb-2"
            >
              Requirements *
            </label>
            <textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) =>
                handleInputChange('requirements', e.target.value)
              }
              rows={4}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${
                errors.requirements ? 'border-red-300' : 'border-primary-300'
              }`}
              placeholder="List the required skills, experience, and qualifications..."
              disabled={loading}
            />
            {errors.requirements && (
              <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>
            )}
            <p className="mt-1 text-sm text-primary-500">
              {formData.requirements.length}/20 characters minimum
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting Job...' : 'Post Job'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

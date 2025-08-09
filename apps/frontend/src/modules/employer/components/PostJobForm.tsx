import React, { useState, useCallback } from 'react';

import { useNavigate } from 'react-router-dom';
import { useEmployerJobs } from '../hooks/useEmployerJobs';
import type { OutputData, JobStatus } from '../../../shared/types/editorTypes';
import { BlockEditorWrapper } from './BlockEditorWrapper';

interface PostJobFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function PostJobForm({ onCancel, onSuccess }: PostJobFormProps) {
  const navigate = useNavigate();
  const { createJob } = useEmployerJobs();
  const [loading, setLoading] = useState(false);

  // ✅ Keep state separate to avoid full re-renders
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState<OutputData | null>(null);
  const [status, setStatus] = useState<JobStatus>('active');

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    location?: string;
  }>({});

  // ✅ Validation
  const validateForm = useCallback((): boolean => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = 'Job title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Job title must be at least 3 characters';
    }

    if (
      !description ||
      !description.blocks ||
      description.blocks.length === 0
    ) {
      newErrors.description = 'Job description is required';
    } else {
      const hasContent = description.blocks.some((block) => {
        return (
          block.type !== 'paragraph' ||
          (block.data &&
            typeof (block.data as Record<string, unknown>).text === 'string' &&
            ((block.data as Record<string, unknown>).text as string).trim())
        );
      });
      if (!hasContent) {
        newErrors.description = 'Please provide a meaningful job description';
      }
    }

    if (!location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, location, description]);

  // ✅ Callbacks so they don't change every render
  const handleEditorChange = useCallback(
    (data: OutputData) => {
      setDescription(data);
      if (errors.description) {
        setErrors((prev) => ({ ...prev, description: undefined }));
      }
    },
    [errors.description],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      try {
        setLoading(true);
        await createJob({
          title: title.trim(),
          description,
          location: location.trim(),
          status,
        });

        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/employer/dashboard');
        }
      } finally {
        setLoading(false);
      }
    },
    [
      title,
      location,
      description,
      status,
      validateForm,
      createJob,
      onSuccess,
      navigate,
    ],
  );

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/employer/dashboard');
    }
  }, [onCancel, navigate]);

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
          {/* Title */}
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
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title)
                  setErrors((prev) => ({ ...prev, title: undefined }));
              }}
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

          {/* Location */}
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
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (errors.location)
                  setErrors((prev) => ({ ...prev, location: undefined }));
              }}
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Job Description *
            </label>
            <BlockEditorWrapper
              readOnly={loading}
              value={description}
              onChange={handleEditorChange}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-sm text-primary-500">
              Use the rich text editor to create a detailed job description with
              formatting, lists, and more.
            </p>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-black mb-2"
            >
              Job Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as JobStatus)}
              className="w-full px-3 py-2 border border-primary-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              disabled={loading}
            >
              <option value="active">Active - Accepting applications</option>
              <option value="draft">Draft - Not visible to candidates</option>
              <option value="reviewing">
                Reviewing - Currently reviewing applications
              </option>
              <option value="closed">
                Closed - No longer accepting applications
              </option>
            </select>
            <p className="mt-1 text-sm text-primary-500">
              Choose the current status of this job posting
            </p>
          </div>

          {/* Actions */}
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

import React, { useState } from 'react';
import { useApplyToJob } from '../hooks/useApplications';
import type { CreateApplicationRequest } from '../types/application.types';

interface JobApplicationModalProps {
  jobUuid: string;
  jobTitle: string;
  companyName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const JobApplicationModal = ({
  jobUuid,
  jobTitle,
  companyName,
  isOpen,
  onClose,
  onSuccess,
}: JobApplicationModalProps) => {
  const [formData, setFormData] = useState<CreateApplicationRequest>({
    resumeUrl: '',
    coverLetter: '',
  });

  const applyMutation = useApplyToJob();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.resumeUrl.trim()) {
      window.alert('Please provide a resume URL');
      return;
    }

    try {
      await applyMutation.mutateAsync({
        jobUuid,
        applicationData: {
          resumeUrl: formData.resumeUrl.trim(),
          coverLetter: formData.coverLetter?.trim() || undefined,
        },
      });

      // Reset form
      setFormData({ resumeUrl: '', coverLetter: '' });

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }

      // Close modal
      onClose();
    } catch (error) {
      console.error('Application failed:', error);
      window.alert('Failed to submit application. Please try again.');
    }
  };

  const handleChange =
    (field: keyof CreateApplicationRequest) =>
    (
      e: React.ChangeEvent<
        window.HTMLInputElement | window.HTMLTextAreaElement
      >,
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-black mb-1">
                Apply for Position
              </h2>
              <p className="text-primary-600">
                {jobTitle} at {companyName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-primary-500 hover:text-black transition-colors"
              disabled={applyMutation.isPending}
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Resume URL */}
            <div>
              <label
                htmlFor="resumeUrl"
                className="block text-sm font-medium text-black mb-2"
              >
                Resume URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="resumeUrl"
                value={formData.resumeUrl}
                onChange={handleChange('resumeUrl')}
                placeholder="https://example.com/your-resume.pdf"
                className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
                disabled={applyMutation.isPending}
              />
              <p className="text-xs text-primary-500 mt-1">
                Please provide a link to your resume (Google Drive, Dropbox,
                etc.)
              </p>
            </div>

            {/* Cover Letter */}
            <div>
              <label
                htmlFor="coverLetter"
                className="block text-sm font-medium text-black mb-2"
              >
                Cover Letter (Optional)
              </label>
              <textarea
                id="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange('coverLetter')}
                placeholder="Tell us why you're interested in this position..."
                rows={6}
                maxLength={2000}
                className="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                disabled={applyMutation.isPending}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-primary-500">
                  Optional but recommended
                </p>
                <span className="text-xs text-primary-400">
                  {formData.coverLetter?.length || 0}/2000
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-primary-300 text-primary-700 rounded-md hover:bg-primary-50 transition-colors"
                disabled={applyMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary"
                disabled={applyMutation.isPending}
              >
                {applyMutation.isPending
                  ? 'Submitting...'
                  : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

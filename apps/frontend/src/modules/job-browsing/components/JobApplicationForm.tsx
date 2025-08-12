import React, { useState, useRef } from 'react';
import { useApplyToJob, useMyApplications } from '../hooks/useApplications';

interface JobApplicationFormProps {
  jobUuid: string;
  jobTitle: string;
  companyName: string;
  onSuccess?: () => void;
}

interface ApplicationFormData {
  resumeFile: File | null;
  resumeUrl: string;
  coverLetter: string;
}

export const JobApplicationForm = ({
  jobUuid,
  jobTitle,
  companyName,
}: Omit<JobApplicationFormProps, 'onSuccess'>) => {
  const { data: myApplications } = useMyApplications();

  // Check if user has already applied to this job
  const hasAlreadyApplied = myApplications?.applications?.some(
    (app) => app.jobUuid === jobUuid,
  );
  const [formData, setFormData] = useState<ApplicationFormData>({
    resumeFile: null,
    resumeUrl: '',
    coverLetter: '',
  });
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    persistent?: boolean;
  } | null>(null);
  const [isApplicationSubmitted, setIsApplicationSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const applyMutation = useApplyToJob();

  const showNotification = (
    type: 'success' | 'error' | 'info',
    message: string,
    persistent = false,
  ) => {
    setNotification({ type, message, persistent });
    if (!persistent) {
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      showNotification('error', 'Please select a PDF, DOC, or DOCX file');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'File size must be less than 5MB');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFormData((prev) => ({ ...prev, resumeFile: file }));
    showNotification('info', `Selected: ${file.name}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (uploadMethod === 'file' && !formData.resumeFile) {
      showNotification('error', 'Please select a resume file');
      return;
    }

    if (uploadMethod === 'url' && !formData.resumeUrl.trim()) {
      showNotification('error', 'Please provide a resume URL');
      return;
    }

    try {
      const applicationFormData = new FormData();

      if (uploadMethod === 'file' && formData.resumeFile) {
        applicationFormData.append('resume', formData.resumeFile);
      } else if (uploadMethod === 'url' && formData.resumeUrl) {
        applicationFormData.append('resumeUrl', formData.resumeUrl.trim());
      }

      if (formData.coverLetter.trim()) {
        applicationFormData.append('coverLetter', formData.coverLetter.trim());
      }

      await applyMutation.mutateAsync({
        jobUuid,
        applicationData: applicationFormData,
      });

      // Reset form
      setFormData({ resumeFile: null, resumeUrl: '', coverLetter: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';

      setIsApplicationSubmitted(true);
      showNotification(
        'success',
        'Application submitted successfully! Your application has been sent to the employer and you should hear back soon.',
        true,
      );

      // Don't call onSuccess to avoid switching tabs automatically
    } catch (error) {
      console.error('Application failed:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to submit application. Please try again.';
      showNotification('error', errorMessage);
    }
  };

  // Show already applied message if user has applied
  if (hasAlreadyApplied) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Application Already Submitted
          </h3>
          <p className="text-gray-600 mb-4">
            You have already applied to this position. You can track your
            application status in your dashboard.
          </p>
          <a href="/my-applications" className="btn-primary">
            View My Applications
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Apply for Position
        </h2>
        <p className="text-gray-600">
          {jobTitle} at {companyName}
        </p>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`mb-4 p-4 rounded-md flex items-start gap-3 ${
            notification.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : notification.type === 'error'
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          <div className="flex-shrink-0">
            {notification.type === 'success' && (
              <svg
                className="w-5 h-5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {notification.type === 'error' && (
              <svg
                className="w-5 h-5 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {notification.type === 'info' && (
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium">{notification.message}</p>
            {notification.persistent && notification.type === 'success' && (
              <p className="text-sm mt-1 opacity-80">
                You can continue browsing or return to the job listings.
              </p>
            )}
          </div>
          {notification.persistent && (
            <button
              onClick={() => setNotification(null)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Resume Upload Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Resume <span className="text-red-500">*</span>
          </label>

          <div className="flex gap-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="uploadMethod"
                value="file"
                checked={uploadMethod === 'file'}
                onChange={(e) => setUploadMethod(e.target.value as 'file')}
                className="mr-2"
              />
              Upload File (PDF, DOC, DOCX)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="uploadMethod"
                value="url"
                checked={uploadMethod === 'url'}
                onChange={(e) => setUploadMethod(e.target.value as 'url')}
                className="mr-2"
              />
              Provide URL
            </label>
          </div>

          {/* File Upload */}
          {uploadMethod === 'file' && (
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={applyMutation.isPending}
              />
              <p className="text-xs text-gray-500">
                Supported formats: PDF, DOC, DOCX (Max size: 5MB)
              </p>
              {formData.resumeFile && (
                <p className="text-sm text-green-600">
                  ✓ {formData.resumeFile.name} (
                  {(formData.resumeFile.size / 1024 / 1024).toFixed(2)}MB)
                </p>
              )}
            </div>
          )}

          {/* URL Input */}
          {uploadMethod === 'url' && (
            <div className="space-y-2">
              <input
                type="url"
                value={formData.resumeUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    resumeUrl: e.target.value,
                  }))
                }
                placeholder="https://example.com/your-resume.pdf"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={applyMutation.isPending}
              />
              <p className="text-xs text-gray-500">
                Link to your resume (Google Drive, Dropbox, etc.)
              </p>
            </div>
          )}
        </div>

        {/* Cover Letter */}
        <div>
          <label
            htmlFor="coverLetter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Cover Letter (Optional)
          </label>
          <textarea
            id="coverLetter"
            value={formData.coverLetter}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, coverLetter: e.target.value }))
            }
            placeholder="Tell us why you're interested in this position..."
            rows={6}
            maxLength={2000}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={applyMutation.isPending}
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500">Optional but recommended</p>
            <span className="text-xs text-gray-400">
              {formData.coverLetter.length}/2000
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          {isApplicationSubmitted ? (
            <div className="w-full bg-green-100 text-green-800 py-3 px-4 rounded-md text-center font-medium border border-green-200">
              ✓ Application Successfully Submitted!
            </div>
          ) : (
            <button
              type="submit"
              disabled={applyMutation.isPending}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

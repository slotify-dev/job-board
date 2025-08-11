import React, { useState, useRef } from 'react';
import { useApplyToJob } from '../hooks/useApplications';

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
  onSuccess,
}: JobApplicationFormProps) => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    resumeFile: null,
    resumeUrl: '',
    coverLetter: '',
  });
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const applyMutation = useApplyToJob();

  const showNotification = (
    type: 'success' | 'error' | 'info',
    message: string,
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
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

      showNotification('success', 'Application submitted successfully!');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Application failed:', error);
      showNotification(
        'error',
        'Failed to submit application. Please try again.',
      );
    }
  };

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
          className={`mb-4 p-4 rounded-md ${
            notification.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : notification.type === 'error'
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          {notification.message}
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
          <button
            type="submit"
            disabled={applyMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

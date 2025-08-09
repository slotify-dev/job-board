import React, { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { UpdateJobSeekerProfileRequest } from '../types/profile.types';
import { toast } from 'sonner';

interface ProfileEditFormProps {
  onCancel: () => void;
  onSaved: () => void;
}

export function ProfileEditForm({ onCancel, onSaved }: ProfileEditFormProps) {
  const { profile, updateProfile, loading } = useProfile();
  const [formData, setFormData] = useState<UpdateJobSeekerProfileRequest>({
    fullName: '',
    contactInfo: '',
    resumeUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        contactInfo: profile.contactInfo || '',
        resumeUrl: profile.resumeUrl || '',
      });
    }
  }, [profile]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length > 255) {
      newErrors.fullName = 'Full name must be less than 255 characters';
    }

    if (formData.contactInfo && formData.contactInfo.length > 1000) {
      newErrors.contactInfo =
        'Contact information must be less than 1000 characters';
    }

    if (formData.resumeUrl) {
      try {
        new URL(formData.resumeUrl);
      } catch {
        newErrors.resumeUrl = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
      onSaved();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update profile',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">
          {profile ? 'Edit Profile' : 'Create Profile'}
        </h2>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-primary-700 mb-2"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={`input ${errors.fullName ? 'border-red-500' : ''}`}
            placeholder="Enter your full name"
            required
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>

        {/* Contact Information */}
        <div>
          <label
            htmlFor="contactInfo"
            className="block text-sm font-medium text-primary-700 mb-2"
          >
            Contact Information
          </label>
          <textarea
            id="contactInfo"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleInputChange}
            rows={4}
            className={`input ${errors.contactInfo ? 'border-red-500' : ''}`}
            placeholder="Phone number, address, or other contact details..."
          />
          <p className="mt-1 text-sm text-primary-500">
            Add your phone number, address, or other contact information
          </p>
          {errors.contactInfo && (
            <p className="mt-1 text-sm text-red-500">{errors.contactInfo}</p>
          )}
        </div>

        {/* Resume URL */}
        <div>
          <label
            htmlFor="resumeUrl"
            className="block text-sm font-medium text-primary-700 mb-2"
          >
            Resume URL
          </label>
          <input
            type="url"
            id="resumeUrl"
            name="resumeUrl"
            value={formData.resumeUrl}
            onChange={handleInputChange}
            className={`input ${errors.resumeUrl ? 'border-red-500' : ''}`}
            placeholder="https://drive.google.com/..."
          />
          <p className="mt-1 text-sm text-primary-500">
            Link to your resume (Google Drive, Dropbox, personal website, etc.)
          </p>
          {errors.resumeUrl && (
            <p className="mt-1 text-sm text-red-500">{errors.resumeUrl}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-primary-200">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </span>
            ) : (
              'Save Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

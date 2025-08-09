import type { UpdateJobSeekerProfileRequest } from '../types/profile.types';
import React, { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { toast } from 'sonner';

// Using File from DOM lib types

interface ProfileEditFormProps {
  onCancel: () => void;
  onSaved: () => void;
}

export function ProfileEditForm({ onCancel, onSaved }: ProfileEditFormProps) {
  const { profile, updateProfile, loading } = useProfile();
  const [formData, setFormData] = useState<UpdateJobSeekerProfileRequest>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    resumeUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // eslint-disable-next-line no-undef
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
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

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && formData.phone.length > 50) {
      newErrors.phone = 'Phone number must be less than 50 characters';
    }

    if (formData.address && formData.address.length > 1000) {
      newErrors.address = 'Address must be less than 1000 characters';
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        resumeFile: 'File size must be less than 5MB',
      }));
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        resumeFile: 'Please upload a PDF, DOC, or DOCX file',
      }));
      return;
    }

    setSelectedFile(file);
    // Clear resume URL when file is selected
    setFormData((prev) => ({ ...prev, resumeUrl: '' }));
    // Clear any previous errors
    setErrors((prev) => ({
      ...prev,
      resumeFile: '',
      resumeUrl: '',
    }));
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
      <h2 className="text-xl font-semibold text-black mb-6">
        {profile ? 'Edit Your Profile' : 'Create Your Profile'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-medium text-black mb-3">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
                placeholder="Enter your full name"
                required
                disabled={isSubmitting}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email address"
                required
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-medium text-black mb-3">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="+1 (555) 123-4567"
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className={`input-field ${errors.address ? 'border-red-500' : ''}`}
                placeholder="123 Main St, City, State 12345"
                disabled={isSubmitting}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Resume Section */}
        <div>
          <h3 className="text-lg font-medium text-black mb-3">Resume</h3>
          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Upload Resume
              </label>
              <input
                type="file"
                id="resumeFile"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="input-field"
                disabled={isSubmitting}
              />
              <p className="text-primary-500 text-sm mt-1">
                Upload your resume as PDF, DOC, or DOCX (max 5MB)
              </p>
              {selectedFile && (
                <p className="text-green-600 text-sm mt-1">
                  Selected: {selectedFile.name}
                </p>
              )}
              {errors.resumeFile && (
                <p className="text-red-500 text-sm mt-1">{errors.resumeFile}</p>
              )}
            </div>

            {/* OR divider */}
            <div className="flex items-center">
              <div className="flex-1 border-t border-primary-200"></div>
              <span className="px-3 text-sm text-primary-500">OR</span>
              <div className="flex-1 border-t border-primary-200"></div>
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Resume URL
              </label>
              <input
                type="url"
                id="resumeUrl"
                name="resumeUrl"
                value={formData.resumeUrl}
                onChange={handleInputChange}
                className={`input-field ${errors.resumeUrl ? 'border-red-500' : ''}`}
                placeholder="https://drive.google.com/..."
                disabled={isSubmitting}
              />
              <p className="text-primary-500 text-sm mt-1">
                Link to your resume (Google Drive, Dropbox, etc.)
              </p>
              {errors.resumeUrl && (
                <p className="text-red-500 text-sm mt-1">{errors.resumeUrl}</p>
              )}
            </div>
          </div>
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

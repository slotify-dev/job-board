import React, { useState } from 'react';
import type {
  EmployerProfile,
  UpdateEmployerProfileRequest,
} from '../types/profile.types';

interface EmployerProfileEditFormProps {
  profile: EmployerProfile | null;
  onSave: (updates: UpdateEmployerProfileRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function EmployerProfileEditForm({
  profile,
  onSave,
  onCancel,
  loading = false,
}: EmployerProfileEditFormProps) {
  const [formData, setFormData] = useState<UpdateEmployerProfileRequest>({
    companyName: profile?.companyName || '',
    contactPerson: profile?.contactPerson || '',
    companyWebsite: profile?.companyWebsite || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName?.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.contactPerson?.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }

    if (formData.companyWebsite && formData.companyWebsite.trim()) {
      const websitePattern = /^https?:\/\/.+/;
      if (!websitePattern.test(formData.companyWebsite)) {
        newErrors.companyWebsite =
          'Please enter a valid URL (starting with http:// or https://)';
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

    try {
      // Clean up empty website field
      const updates = {
        ...formData,
        companyWebsite: formData.companyWebsite?.trim() || undefined,
      };
      await onSave(updates);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleChange =
    (field: keyof UpdateEmployerProfileRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: '',
        }));
      }
    };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-black mb-6">
        {profile ? 'Edit Company Profile' : 'Create Company Profile'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <div>
          <h3 className="text-lg font-medium text-black mb-3">
            Company Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.companyName || ''}
                onChange={handleChange('companyName')}
                className={`input ${errors.companyName ? 'border-red-500' : ''}`}
                placeholder="Enter your company name"
                disabled={loading}
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.companyName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Contact Person <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.contactPerson || ''}
                onChange={handleChange('contactPerson')}
                className={`input ${errors.contactPerson ? 'border-red-500' : ''}`}
                placeholder="Enter contact person name"
                disabled={loading}
              />
              {errors.contactPerson && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contactPerson}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Company Website */}
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">
            Company Website
          </label>
          <input
            type="url"
            value={formData.companyWebsite || ''}
            onChange={handleChange('companyWebsite')}
            className={`input ${errors.companyWebsite ? 'border-red-500' : ''}`}
            placeholder="https://www.company.com"
            disabled={loading}
          />
          {errors.companyWebsite && (
            <p className="text-red-500 text-sm mt-1">{errors.companyWebsite}</p>
          )}
          <p className="text-primary-600 text-sm mt-1">
            Optional: Enter your company website URL
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

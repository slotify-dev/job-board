import React, { useState } from 'react';
import type { ApplicationStatus } from '../types/application-review.types';
import { APPLICATION_STATUS_LABELS } from '../types/application-review.types';

interface ApplicationStatusDropdownProps {
  currentStatus: ApplicationStatus;
  applicationId: string;
  onStatusChange: (
    applicationId: string,
    status: ApplicationStatus,
  ) => Promise<void>;
  disabled?: boolean;
}

const STATUS_OPTIONS: ApplicationStatus[] = [
  'pending',
  'reviewing',
  'interviewed',
  'accepted',
  'rejected',
];

export function ApplicationStatusDropdown({
  currentStatus,
  applicationId,
  onStatusChange,
  disabled = false,
}: ApplicationStatusDropdownProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newStatus = e.target.value as ApplicationStatus;

    if (newStatus === currentStatus) return;

    try {
      setIsUpdating(true);
      await onStatusChange(applicationId, newStatus);
    } catch {
      // Error is handled in the hook
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={handleStatusChange}
      disabled={disabled || isUpdating}
      className="text-sm border border-primary-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {APPLICATION_STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}

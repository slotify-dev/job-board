import type { ApplicationStatus } from '../types/application-review.types';
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
} from '../types/application-review.types';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function ApplicationStatusBadge({
  status,
  className = '',
}: ApplicationStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${APPLICATION_STATUS_COLORS[status]} ${className}`}
    >
      {APPLICATION_STATUS_LABELS[status]}
    </span>
  );
}

import React from 'react';
import { getFOStatusColor } from '@/utils/statusHelpers';

interface FOStatusBadgeProps {
  status: string | undefined | null;
  className?: string;
}

/**
 * Reusable component for displaying FO (Fiber Optic) status badges.
 * Uses getFOStatusColor from statusHelpers for consistent styling.
 * 
 * @param status FO status value (active, inactive, maintenance)
 * @param className Additional CSS classes
 * @returns JSX element for FO status badge
 */
export default function FOStatusBadge({ status, className = '' }: FOStatusBadgeProps): React.ReactElement {
  const statusConfig = getFOStatusColor(status);

  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} ${className}`}>
      {statusConfig.label}
    </span>
  );
}


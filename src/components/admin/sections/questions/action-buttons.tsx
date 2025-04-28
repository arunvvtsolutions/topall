import React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';

interface ActionButtonsProps {
  usageHistory?: boolean;
  isTablet: boolean;
  onDelete: (e: React.SyntheticEvent) => void;
  onHistory: (e: React.SyntheticEvent) => void;
  onReport: (e: React.SyntheticEvent) => void;
  showDelete?: boolean;
  published?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isTablet,
  usageHistory,
  onDelete,
  onHistory,
  onReport,
  showDelete = true,
  published
}) => (
  <>
    {usageHistory && (
      <Button
        variant="default"
        size="sm"
        className="border border-default-200 text-xs font-semibold text-ButtonC hover:bg-ButtonC/5"
        data-test-id="usage-history-btn"
        onClick={(e) => onHistory(e)}
      >
        <Icon icon={'ri:history-fill'} className="mr-2 text-base text-primary" />
        {isTablet ? 'Usage History' : 'Usage'}
      </Button>
    )}

    {showDelete && (
      <Button
        variant="default"
        size="sm"
        disabled={published}
        className="border border-default-200 text-xs font-semibold text-ButtonC hover:bg-ButtonC/5"
        data-test-id="delete-btn"
        onClick={(e) => onDelete(e)}
      >
        <Icon icon={'mdi:trash-can-outline'} className="mr-2 text-base text-destructive" />
        Delete
      </Button>
    )}
    <Button
      variant="default"
      size="sm"
      className="bg-destructive/15 text-xs font-semibold text-destructive hover:bg-destructive/20"
      data-test-id="report-btn"
      onClick={(e) => onReport(e)}
    >
      <Icon icon={'material-symbols:error-circle-rounded-outline'} className="mr-2 text-base text-destructive" />
      Report
    </Button>
  </>
);

export default ActionButtons;

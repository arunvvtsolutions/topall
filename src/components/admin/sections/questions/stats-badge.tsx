import { Badge } from '@/components/ui/badge';
import React from 'react';

interface StatsBadgeProps {
  attemptBy?: string | null;
  correctAttempt?: string | null;
  questionId: number;
  difficulty?: string | number;
  isTablet?: boolean;
}

const StatsBadge = ({ questionId, attemptBy, correctAttempt, difficulty, isTablet }: StatsBadgeProps) => {
  return (
    <div className="item-center flex flex-nowrap gap-2">
      {attemptBy && (
        <Badge color="primary" rounded="md">
          Attempted by 58%
        </Badge>
      )}

      {correctAttempt && (
        <Badge color="success" rounded="md">
          Correct by 19%
        </Badge>
      )}
      <Badge color="primary" rounded="md">
        {questionId}
      </Badge>
      {difficulty && (
        <Badge color={difficulty === '1' ? 'success' : difficulty === '2' ? 'warning' : 'destructive'} rounded="md">
          {isTablet
            ? difficulty === '1'
              ? 'Easy'
              : difficulty === '2'
                ? 'Medium'
                : 'Hard'
            : difficulty === '1'
              ? 'E'
              : difficulty === '2'
                ? 'M'
                : 'H'}
        </Badge>
      )}
    </div>
  );
};

export default StatsBadge;

'use client';
import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { cp } from 'fs';
import { RadialProgress } from '@/components/common/circle-progress-bar';
import { Icon } from '@/components/ui/icon';
import StatusUpIcon from '@/components/icons/status-up';
import MarkProgress from './mark-progress';

interface ScoreCardProps {
  score?: number;
  total?: number;
  className?: string;
  percentage?: number;
  color: 'success' | 'warning' | 'destructive' | 'primary';
}

const colorMappings = {
  success: { icon: 'heroicons-outline:check-circle', label: 'Correct' },
  warning: { icon: 'heroicons-outline:minus-circle', label: 'Left' },
  destructive: { icon: 'heroicons-outline:x-circle', label: 'Wrong' },
  primary: { icon: 'fluent:circle-warning-20-regular', label: 'Accuracy' }
};

export function ScoreCard({ score, total, percentage, className, color }: ScoreCardProps) {
  // const percentage = (score && total && Math.round((score / total) * 100)) || 0;
  const { icon, label } = colorMappings[color] || colorMappings.primary;
  return (
    <Card className={cn('w-full overflow-hidden rounded-xl border border-borderad shadow-none', className)}>
      <div className={`h-3 rounded-t-lg bg-${color}`} />
      <div className="space-y-3 px-2 py-3">
        <div className="flex items-center justify-center gap-2">
          <Icon icon={icon} className={`text-${color} text-xl`} />
          {color === 'primary' && <StatusUpIcon />}
          <span className="text-sm font-medium text-B2CAgrayn md:text-base">{label}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex items-center justify-center">
            <MarkProgress value={Number(percentage?.toFixed(0)) || 0} color={color} size="sm" />
          </div>
          {/* Score fraction */}
          <div className="flex items-center justify-center text-3xl font-medium">
            <span className={`text-${color} text-sm font-semibold md:text-base`}>{score}</span>
            <span className="text-sm text-B2Cgray md:text-base">/{total}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

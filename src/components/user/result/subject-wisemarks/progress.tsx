import * as React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressDemoProps {
  value: any;
  className?: string;
}

export function ProgressSubject({ value, className }: ProgressDemoProps) {
  return <Progress value={value} color="primary" className={className} />;
}

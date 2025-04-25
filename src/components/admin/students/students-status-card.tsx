import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import { Icon } from '@/components/ui/icon';
import { chartOptions, getStatusColors } from './student-utils';
import { useMemo } from 'react';

// Lazy load ApexCharts without SSR
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface StatCardProps {
  title: string;
  count: string;
  change: string;
  timeframe: string;
  percentage: number;
  status: number;
}

export function StudentStatusCard({ title, count, change, timeframe, percentage, status }: StatCardProps) {
  const isActive = Boolean(status); // Ensure status is treated as boolean
  const { barColor, trackColor, changeColor } = getStatusColors(isActive);

  // Memoized chart options
  const dynamicChartOptions: ApexOptions = useMemo(
    () => ({
      ...chartOptions,
      plotOptions: {
        radialBar: {
          ...chartOptions.plotOptions?.radialBar,
          track: {
            ...chartOptions.plotOptions?.radialBar?.track,
            background: trackColor
          }
        }
      },
      fill: { colors: [barColor] }
    }),
    [barColor, trackColor]
  );

  return (
    <Card className="!p-4">
      <CardContent className="!p-0">
        <div className="grid grid-cols-[2fr_1.5fr]">
          <div className="py-2">
            <h1 className="text-sm font-normal text-[#222222] lg:text-base">{title}</h1>
            <h1 className="mt-1 text-sm font-bold text-[#222222] md:text-base lg:text-lg">{count}</h1>
            <div className="mt-1 flex items-center text-xs font-normal text-[#222222] lg:text-sm">
              <Icon icon="uil:chart-down" className={cn('mr-1', changeColor)} />
              <span className={cn(changeColor)}>{change}</span>
              <span className="ml-2 truncate">{timeframe}</span>
            </div>
          </div>
          <div className="flex">
            <ReactApexChart options={dynamicChartOptions} series={[percentage]} type="radialBar" height={100} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

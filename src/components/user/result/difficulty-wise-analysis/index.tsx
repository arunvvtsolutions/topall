'use client';
import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { Props as ChartProps } from 'react-apexcharts';
import dynamic from 'next/dynamic';
import { ChartDataProps } from './difficulty-wise-chart-props';
import StudentCard from '@/components/common/analysis-card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMediaQuery } from '@/hooks/use-media-query';
import OESubjectDropdown from '../../test/online-exammination/oe-exam-subject-dropdown';
import { useDispatch, useSelector } from '@/store';
import { getDifficultyStats, getOverallResult } from '@/store/slice/user/overall-result';
import { useParams, useSearchParams } from 'next/navigation';
import SelectDropdown from '@/components/common/Select';
import { GenericType } from '@/types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const tabs = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
];

export default function DifficultyPerformance() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const testTypeId = searchParams.get('testTypeId') as string;
  const attemptId = searchParams.get('attemptId') as string;
  const studentId = useParams().studentId as string;
  const testId = useParams().testId as string;
  const overallData = useSelector((state) => state.overAllResult.overallResult);
  const difficultyData = useSelector((state) => state.overAllResult.difficultyStats);
  const examDetail = useSelector((state) => state.onlineExamination.examDetails);
  const selectedStream = useSelector((state) => state.stream.stream);
  const isXs = useMediaQuery('(max-width: 425px)');
  const [chartData, setChartData] = useState<ChartProps | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('easy');
  const [dropdownValues, setDropdownValues] = useState<{ id: number; name: string; label: string }[]>([]);
  const [selectedDropdown, setSelectedDropdown] = useState<GenericType | null>(null);

  // Fetch Difficulty Stats
  useEffect(() => {
    const getData = async () => {
      if (studentId && testId && selectedStream && testTypeId) {
        await dispatch(getDifficultyStats(studentId, testTypeId, testId, selectedStream.id, attemptId));
      }
    };

    getData();
  }, [dispatch, selectedStream, testId, testTypeId, attemptId]);

  // Populate Dropdown Values from overallData
  useEffect(() => {
    if (overallData) {
      const subjects = overallData.subjects.map((item) => ({
        id: Number(item.id),
        name: item.name,
        label: item.name
      }));
      setDropdownValues([...subjects]);
      setSelectedDropdown(subjects[0] || null);
    }
  }, [overallData]);

  // // Update Chart Data Based on Selected Subject and Tab
  useEffect(() => {
    if (!difficultyData || !ChartDataProps.options || !selectedDropdown) return;

    const selectedSubjectData = difficultyData.find((item) => item.subjectDetails.id === String(selectedDropdown.id));

    const selectedData = selectedSubjectData?.[`${selectedTab}Stats`] || {
      correct: 0,
      wrong: 0,
      left: 0
    };

    const updatedSeries = [selectedData.correct, selectedData.wrong, selectedData.left];
    const isAllZero = updatedSeries.every((val) => val === 0);

    if (isAllZero) {
      setChartData({
        type: 'donut',
        series: [1],
        options: {
          chart: {
            type: 'donut',
            width: '100%'
          },
          labels: ['No Data'],
          colors: ['#D3D3D3'], // light gray
          dataLabels: { enabled: false },
          legend: { show: false },
          plotOptions: {
            pie: {
              expandOnClick: false,
              startAngle: 0,
              donut: { size: '75%' }
            }
          },
          tooltip: { enabled: false },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: { width: '100%' }
              }
            }
          ]
        }
      });
    } else {
      setChartData({
        ...ChartDataProps,
        series: updatedSeries,
        options: {
          ...ChartDataProps.options,
          labels: ['Correct', 'Wrong', 'Left'],
          chart: {
            ...ChartDataProps.options.chart,
            width: '100%'
          }
        }
      });
    }
  }, [difficultyData, selectedTab, selectedDropdown]);

  const changeDropdownSelect = (value: any) => {
    setSelectedDropdown(value);
  };

  return (
    <StudentCard
      className="mx-auto w-full rounded-lg bg-white p-6 pt-2 shadow-none"
      dataTestId="difficulty-wise-performance"
      title="Difficulty Performance"
      actions={
        <SelectDropdown
          name="select-subjects"
          onChange={changeDropdownSelect}
          value={selectedDropdown}
          data={dropdownValues || []}
          placeholder="Select Standard"
          width="w-full"
          text="text-[#4B4B4B]"
          size="md"
        />
      }
    >
      <Separator className="mt-4" />

      {/* Tabs */}
      <Tabs
        defaultValue="easy"
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="my-4 rounded-lg border border-[#10101026] p-2"
      >
        <ScrollArea className="w-full">
          <TabsList className="flex flex-nowrap justify-between gap-2">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={` ${!isXs ? 'px-6' : 'px-3'} rounded-lg text-sm font-medium text-[#222222] data-[state=active]:bg-[#000080] data-[state=active]:text-white sm:px-6 md:text-base`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
      </Tabs>

      {/* Chart + Legend */}
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        {/* Chart Container */}
        <div className="relative flex justify-center">
          {chartData && (
            <div className="relative w-[250px] sm:max-w-sm md:max-w-md">
              <ReactApexChart {...chartData} />
              {chartData?.options?.labels?.[0] !== 'No Data' ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#222222] sm:text-base md:text-lg">100%</span>
                </div>
              ):(
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#222222] sm:text-base md:text-lg">0%</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Legend Section */}
        <div className="space-y-4">
          {['Correct', 'Wrong', 'Left'].map((label, index) => {
            const colors = ['#00A86B', '#FF4747', '#FFAD43'];
            const selectedSubjectData = difficultyData.find((item) => item.subjectDetails.id === String(selectedDropdown?.id));
            const selectedData = selectedSubjectData?.[`${selectedTab}Stats`] || { correct: 0, wrong: 0, left: 0 };
            const values = [selectedData.correct, selectedData.wrong, selectedData.left];

            return (
              <div key={label}>
                <div className="mx-3 flex items-center gap-3">
                  <div className={`size-2 rounded-full sm:size-3`} style={{ backgroundColor: colors[index] }}></div>
                  <span className="text-sm font-medium text-[#6F6F6F] sm:text-base">{label}</span>
                  <div className="ml-auto">
                    <span className="text-base font-medium text-[#222222] sm:text-lg">{values[index]}</span>
                    <span className="text-xs text-[#6F6F6F] sm:text-sm">/{values.reduce((a, b) => a + b, 0)}</span>
                  </div>
                </div>
                {index < 2 && <Separator />}
              </div>
            );
          })}
        </div>
      </div>
    </StudentCard>
  );
}

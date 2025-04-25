import SelectDropdown from '@/components/common/Select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { targetYearScores } from '@/schemas/onboard/onboard-schema';
import React from 'react';

interface TargetYearAndScoresProps {
  targets: { targetYear: string | null; targetScore: string };
  setTargets: (value: { targetYear: string | null; targetScore: string }) => void;
}

const TargetYearAndScores = ({ targets, setTargets }: TargetYearAndScoresProps) => {
  const date = new Date();
  const year = date.getFullYear() + 1;
  const targetYearOptions = [
    { id: year, name: `${year}` },
    { id: year + 1, name: `${year + 1}` },
    { id: year + 2, name: `${year + 2}` },
    { id: year + 3, name: `${year + 3}` }
  ];

  //   const [targets, setTargets] = React.useState({
  //     targetYear: '',
  //     targetScore: ''
  //   });

  const handleTargetChange = (field: 'targetYear' | 'targetScore', value: string) => {
    console.log('field', field, value);
    setTargets({ ...targets, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-base font-medium text-B2CAgrayn lg:text-xl">
        <Icon icon="fluent:task-list-square-16-regular" className="font-medium" />
        <h1 className="text-inherit">Set your Targets</h1>
      </div>
      <Separator />

      <div className="grid-cols grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <div className="space-y-4">
          <div className="rounded-md bg-[#ECEFFB] p-4 text-center"></div>
          <div className="grid grid-cols-2 gap-4">
            <SelectDropdown
              name="year-selector"
              onChange={(item) => handleTargetChange('targetYear', item.name)}
              value={targetYearOptions.find((item) => item.id === Number(targets.targetYear)) || null}
              data={targetYearOptions}
              placeholder="Year"
              width="w-full"
              text="text-primary"
              size="md"
              disabled={false}
            />

            <div className="flex items-center rounded-md border border-borderad">
              <Input
                name="targetScore"
                value={targets.targetScore}
                type="text"
                size="md"
                className="rounded-md border-none text-sm font-medium text-primary lg:text-base"
                autoComplete="off"
                onChange={(e) => handleTargetChange('targetScore', e.target.value)}
              />
              <span className="flex h-full basis-2/12 items-center justify-center border-l border-borderad px-2 text-sm font-medium text-B2Cgray lg:font-semibold">
                720
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetYearAndScores;

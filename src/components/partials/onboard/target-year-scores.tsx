import SelectDropdown from '@/components/common/Select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { targetYearScores } from '@/schemas/onboard/onboard-schema';
import { preventAlphabets } from '@/utils';
import React, { memo, useCallback } from 'react';

const TargetYearAndScores = ({ form, streams }: any) => {
  const date = new Date();
  const year = date.getFullYear() + 1;
  const targetYearOptions = [
    { id: year, name: `${year}` },
    { id: year + 1, name: `${year + 1}` },
    { id: year + 2, name: `${year + 2}` },
    { id: year + 3, name: `${year + 3}` }
  ];

  // console.log('getValues', getValues('currentExam'));
  const updateTarget = useCallback(
    (streamId: number, field: 'targetYear' | 'targetScore', value: string) => {
      const currentTargets = form.getValues('targets');
      const updatedTargets = currentTargets.map((target: targetYearScores) => {
        return (Number(target.id) === Number(streamId) && streamId && target.id) ? { ...target, [field]: value } : target;
      });
      form.setValue('targets', updatedTargets);
    },
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-base font-medium text-B2CAgrayn lg:text-xl">
        <Icon icon="fluent:task-list-square-16-regular" className="font-medium" />
        <h1 className="text-inherit">Set your Targets</h1>
      </div>
      <Separator />

      <div className="grid-cols grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {form.getValues('currentExam').map((item: any) => {
          const stream = streams.find((s: any) => s.id === item.streamId);
          if (!stream) return null;
          const targetIndex = form.getValues('targets').findIndex((target: targetYearScores) => target.id === item.streamId);

          return (
            <div key={`${item.streamId}${item.standardId}`} className="space-y-4">
              <h4 className="rounded-md bg-[#ECEFFB] py-2 text-center">{stream.name}</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`targets.${targetIndex}.targetYear`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-B2Cgray">Target Year*</FormLabel>
                      <FormControl>
                        <SelectDropdown
                          name="year-selector"
                          onChange={(item) => field.onChange(item.id)}
                          value={targetYearOptions.find((item) => item.id === field.value) || null}
                          data={targetYearOptions}
                          placeholder="Year"
                          width="w-full"
                          text="text-primary"
                          size="md"
                          disabled={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`targets.${targetIndex}.targetScore`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-B2Cgray">Target Score*</FormLabel>
                      <FormControl>
                        <div className="flex items-center rounded-md border border-borderad">
                          <Input
                            type="text"
                            size="md"
                            className="rounded-md border-none text-sm font-medium text-primary lg:text-base"
                            autoComplete="off"
                            {...{
                              ...field
                            }}
                            onKeyPress={preventAlphabets}
                            onChange={(e) => {
                              if (Number(e.target.value) <= item.maxScore) {
                                field.onChange(e);
                                updateTarget(item.streamId, 'targetScore', e.target.value);
                              }
                            }}
                          />
                          <span className="flex h-full basis-2/12 items-center justify-center border-l border-borderad px-2 text-sm font-medium text-B2Cgray lg:font-semibold">
                            {stream.total_score}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(TargetYearAndScores);

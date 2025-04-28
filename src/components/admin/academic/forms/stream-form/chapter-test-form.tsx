'use client';
import { FloatingLabelInput } from '@/components/common/floating-label-input';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ChapterFormValues } from '@/schemas/admin/academic/streamSchemas';
import { DialogTitle, FormFields } from '@/types/enum';
import React, { memo, useEffect, useReducer, useState } from 'react';

const levels = [
  { id: 1, name: 'Level 1' },
  { id: 2, name: 'Level 2' },
  { id: 3, name: 'Level 3' },
  { id: 4, name: 'Level 4' },
  { id: 5, name: 'Level 5' },
  { id: 6, name: 'Previous Year' }
];

interface IChapterTestFormProps {
  initialData: ChapterFormValues[];
  isView: boolean;
  isShowForm: boolean;
  selectedLevel: string | null;
  formValues: ChapterFormValues;
  disabledButton: boolean;
  difficultyValidation: string;
  onChangeValues: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeLevel: (level: string) => void;
  onFormUpdate: (data: any) => void;
  setDifficultyValidation: (data: string) => void;
}

const ChapterTestForm = ({
  initialData,
  selectedLevel,
  onChangeLevel,
  isView,
  isShowForm,
  formValues,
  disabledButton,
  difficultyValidation,
  onChangeValues,
  onFormUpdate,
  setDifficultyValidation
}: IChapterTestFormProps) => {
  return (
    <div className={`${isShowForm ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-60'} space-y-4 pb-4`}>
      <div className="flex flex-wrap gap-2">
        {levels.map((level) => (
          <Button
            key={level.id}
            type="button"
            size="sm"
            data-test-id="level-button"
            variant="default"
            className={cn(
              'gap-2 px-4 text-default',
              level.name === selectedLevel
                ? 'bg-success hover:bg-success/90 hover:ring-success'
                : 'border border-borderad text-B2CAgrayn hover:bg-secondaryBtn/90 hover:ring-B2Cgray'
            )}
            onClick={() => onChangeLevel(level.name)}
          >
            {initialData.some((d) => d.name === level.name) && (
              <Icon icon={'subway:tick'} className={level.name === selectedLevel ? 'text-default' : 'text-success'} />
            )}
            {level.name}
          </Button>
        ))}
      </div>

      <div className={`${isView ? 'pointer-events-none' : 'pointer-events-auto'} space-y-4`}>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-B2CAgray">{FormFields.PROMOTION_PERCENTAGE}</Label>
          <Input
            name="acceptPercentage"
            type="text"
            placeholder="Enter Level Promotion Percentage"
            color="secondary"
            className="text-primary"
            size="md"
            data-test-id="accept-percentage-input"
            autoComplete="off"
            value={formValues.acceptPercentage}
            onChange={(e) => onChangeValues(e)}
          />
        </div>

        <div className="grid-cols grid w-full gap-2 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-B2CAgray">{FormFields.QUESTION_COUNT}</Label>
            <Input
              name="totalQues"
              type="text"
              placeholder="Enter Question Count"
              color="secondary"
              className="text-primary"
              size="md"
              data-test-id="total-ques-input"
              autoComplete="off"
              value={formValues.totalQues}
              onChange={(e) => onChangeValues(e)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-B2CAgray">{FormFields.TIME_PER_QUESTION}</Label>
            <Input
              name="timePerQues"
              type="text"
              placeholder="Enter Time Per Question"
              color="secondary"
              className="text-primary"
              size="md"
              data-test-id="time-ques-input"
              autoComplete="off"
              value={formValues.timePerQues}
              onChange={(e) => onChangeValues(e)}
            />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-B2CAgray">{FormFields.QUESTION_PERCENTAGE}</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <FloatingLabelInput
              label=""
              name="ePercentage"
              floatingLabel="Easy"
              value={formValues.ePercentage}
              onChange={(e) => {
                onChangeValues(e);
                setDifficultyValidation('');
              }}
              autoComplete="off"
              borderColor="border-success text-success text-sm"
              placeholder=""
            />

            <FloatingLabelInput
              label=""
              name="mPercentage"
              floatingLabel="Medium"
              value={formValues.mPercentage}
              onChange={(e) => {
                onChangeValues(e);
                setDifficultyValidation('');
              }}
              autoComplete="off"
              disabled={isView}
              borderColor="border-warning text-warning text-sm"
              placeholder=""
            />

            <FloatingLabelInput
              label=""
              name="hPercentage"
              floatingLabel="Hard"
              autoComplete="off"
              value={formValues.hPercentage}
              onChange={(e) => {
                onChangeValues(e);
                setDifficultyValidation('');
              }}
              disabled={isView}
              borderColor="border-destructive text-destructive text-sm"
              placeholder=""
            />
            {difficultyValidation && (
              <p className="text-[14px] font-semibold text-red-500 lg:text-nowrap">{difficultyValidation}</p>
            )}
          </div>
        </div>
      </div>

      {!isView && (
        <div className="flex items-center justify-end">
          <Button
            type="button"
            size="sm"
            variant="default"
            className={cn(
              'px-4 text-default',
              'rounded-full bg-primary/10 text-sm text-primary hover:bg-primary/15 hover:ring-primary'
            )}
            onClick={onFormUpdate}
            disabled={disabledButton}
          >
            Update
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChapterTestForm;

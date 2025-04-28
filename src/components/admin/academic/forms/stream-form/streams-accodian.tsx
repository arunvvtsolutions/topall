import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@/components/ui/icon';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import GenerateTestForm from './generate-test-form';
import ChapterTestForm from './chapter-test-form';
import ConceptTestForm from './concept-test-form';
import { Separator } from '@/components/ui/separator';
import { UseFormReturn } from 'react-hook-form';
import { ChapterFormValues, StreamFormValues } from '@/schemas/admin/academic/streamSchemas';
import { useChapterFormState } from './useChapterForm';

const STREAMS_DETAILS_DATA = [
  { value: 'generate-test', title: 'Generate Test' },
  { value: 'chapter-test', title: 'Chapter Test' },
  { value: 'concept-test', title: 'Concept Test' }
];

export const INITIAL_VALUES: ChapterFormValues = {
  ePercentage: '',
  mPercentage: '',
  hPercentage: '',
  totalQues: '',
  timePerQues: '',
  acceptPercentage: ''
};

interface StreamsAccodianProps {
  form: UseFormReturn<StreamFormValues>;
  loading: boolean;
  isView: boolean;
  initialData?: any;
}

const StreamsAccodian = ({ form, loading, isView, initialData }: StreamsAccodianProps) => {
  const chapterWiseData = form.watch('chapterWiseTest') || [];
  const conceptTestData = form.watch('conceptWiseTest') || {};
  const [activeStreams, setActiveStreams] = React.useState<string[]>([]);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [difficultyValidation, setDifficultyValidation] = useState("")

  // Update useEffect to initialize activeStreams only once
  useEffect(() => {
    if (!isInitialized) {
      const streams = [];
      if (chapterWiseData.length > 0) streams.push('chapter-test');
      if (conceptTestData && Object.values(conceptTestData).every((v) => v !== '')) {
        streams.push('concept-test');
      }
      setActiveStreams(streams);
      setIsInitialized(true);
    }
  }, [chapterWiseData, conceptTestData, isInitialized]);

  const { selectedLevel, formValues, setSelectedLevel, setFormValues } = useChapterFormState(chapterWiseData, initialData);

  // Check if form values are complete
  const isFormComplete = useMemo(() => Object.values(formValues).every((value) => value !== ''), [formValues]);

  // Update chapter test values
  const handleUpdateValues = useCallback(() => {
    if (!selectedLevel) return;
    const findIndex = chapterWiseData.findIndex((item) => item.name === selectedLevel);
    if (Number(formValues.ePercentage) + Number(formValues.mPercentage) + Number(formValues.hPercentage) > 100){
      setDifficultyValidation("Total of Easy Medium and Hard cannot be more than 100");
      return
    }
    if (findIndex !== -1) {
      const updatedData = [...chapterWiseData];
        updatedData[findIndex] = formValues;
      form.setValue('chapterWiseTest', updatedData);
    } else {
      form.setValue('chapterWiseTest', [
        ...chapterWiseData,
        {
          ...formValues,
          name: selectedLevel,
          isPreviousYear: selectedLevel === 'Previous Year'
        }
      ]);
    }
  }, [chapterWiseData, form, formValues, selectedLevel]);

  // Handle input changes
  const handleChangeValues = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.name;
      const newValue = e.target.value.replace(/[^0-9]/g, '');
      setFormValues((prev) => ({ ...prev, [name]: newValue }));
    },
    [setFormValues]
  );

  // Handle checkbox toggle for test types
  const handleCheckDetails = useCallback(
    (value: string) => {
      setActiveStreams((prev) => {
        if (prev.includes(value)) {
          // Remove the test type
          if (value === 'chapter-test') {
            form.setValue('chapterWiseTest', []);
            setFormValues(INITIAL_VALUES);
            setSelectedLevel(null);
          } else if (value === 'concept-test') {
            form.setValue('conceptWiseTest', {
              topicWiseTimePerQuestion: '',
              topicWiseTotalQuestion: ''
            });
          }
          return prev.filter((v) => v !== value);
        } else {
          // Add the test type
          return [...prev, value];
        }
      });
    },
    [form, setFormValues, setSelectedLevel]
  );

  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="generate-test">
      {STREAMS_DETAILS_DATA.map((item) => (
        <AccordionItem key={item.value} value={item.value} className="rounded-md border border-borderad bg-white text-[#4B4B4B]">
          <AccordionTrigger className="p-2">
            <div className="flex items-center gap-2">
              {item.value !== 'generate-test' && (
                <Checkbox
                  id={item.value}
                  checked={activeStreams.includes(item.value)}
                  onClick={(event) => event.stopPropagation()}
                  onCheckedChange={() => handleCheckDetails(item.value)}
                  color="primary"
                />
              )}

              <label className="text-sm font-semibold tracking-wide text-B2CAgrayn">{item.title}</label>
            </div>
            <Icon
              icon={'eva:arrow-down-fill'}
              className="easy-in-out shrink-0 text-xl text-primary transition-transform duration-200"
            />
          </AccordionTrigger>
          <AccordionContent className="space-y-2 px-2 lg:px-4">
            <Separator orientation="horizontal" className="bg-borderad" />

            {item.value === 'generate-test' && <GenerateTestForm form={form} loading={loading} isView={isView} />}

            {item.value === 'chapter-test' && (
              <ChapterTestForm
                initialData={chapterWiseData}
                selectedLevel={selectedLevel}
                onChangeLevel={setSelectedLevel}
                formValues={formValues}
                onFormUpdate={handleUpdateValues}
                onChangeValues={handleChangeValues}
                isView={isView}
                disabledButton={!isFormComplete}
                isShowForm={activeStreams.includes('chapter-test')}
                difficultyValidation={difficultyValidation}
                setDifficultyValidation={setDifficultyValidation}
              />
            )}
            {item.value === 'concept-test' && (
              <ConceptTestForm
                form={form}
                loading={loading}
                isView={isView}
                isShowForm={activeStreams.includes('concept-test')}
              />
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default StreamsAccodian;

import { ChapterFormValues } from '@/schemas/admin/academic/streamSchemas';
import React, { useEffect } from 'react';
import { INITIAL_VALUES } from './streams-accodian';

// Custom hook to manage chapter form state
export function useChapterFormState(chapterWiseData: ChapterFormValues[], initialData: any) {
  const [selectedLevel, setSelectedLevel] = React.useState<string | null>(null);
  const [formValues, setFormValues] = React.useState<ChapterFormValues>(INITIAL_VALUES);

  // Initialize selected level from initial data
  useEffect(() => {
    if (chapterWiseData.length > 0 && initialData && !selectedLevel) {
      setFormValues(chapterWiseData[0]);
      setSelectedLevel(chapterWiseData[0]?.name || '');
    }
  }, [chapterWiseData, initialData, selectedLevel]);

  // Update form values when selected level changes
  useEffect(() => {
    if (selectedLevel) {
      const formObj = chapterWiseData.find((v) => v.name === selectedLevel);
      setFormValues(formObj || INITIAL_VALUES);
    } else {
      setFormValues(INITIAL_VALUES);
    }
  }, [selectedLevel, chapterWiseData]);

  return { selectedLevel, formValues, setSelectedLevel, setFormValues };
}

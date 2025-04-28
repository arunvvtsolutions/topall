'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MainDialog } from '@/components/common/MainDialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icon } from '@/components/ui/icon';
import { useEffect, useState } from 'react';
import { type ChapterWiseFormValues, chapterWiseSchema } from '../schemas';
import { useSelector } from '@/store';
import { getLevelList } from '@/utils/api/user/chapter-wise-test';
import { TosterMessages } from '@/types/enum';
import type { GenericType } from '@/types';
import { createChapterTestPlan } from '@/utils/api/packages';

export default function ChapterWiseForm({
  name = 'Enter Test Type',
  onClose,
  testTypeId,
  planId,
  streamId,
  viewMode = false,
  existingPlan = null
}: {
  name: string;
  onClose: () => void;
  testTypeId: number;
  planId: number;
  streamId: number;
  viewMode?: boolean;
  existingPlan?: any;
}) {
  const { chapterData } = useSelector((state) => state.packagePlan);
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const [levelList, setLevelList] = useState<GenericType[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [levelsError, setLevelsError] = useState<string | null>(null);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);

  const form = useForm<ChapterWiseFormValues>({
    resolver: zodResolver(chapterWiseSchema),
    defaultValues: {
      usageRestriction: 'unlimited',
      accessType: 'allChapterLevelAccess',
      levels: [],
      subjects: []
    },
    mode: 'onChange'
  });

  // Set form values based on existing plan when in view mode
  useEffect(() => {
    if (viewMode && existingPlan) {
      // Set usage restriction
      const usageRestriction =
        existingPlan.limit === null ? 'limited' : existingPlan.limit === 'unlimited' ? 'unlimited' : 'limited';
      form.setValue('usageRestriction', usageRestriction);

      // If limited, determine the access type and set appropriate values
      if (usageRestriction === 'limited') {
        if (existingPlan.chapterLevel && existingPlan.chapterLevel.length > 0) {
          // This is "All Chapter Level Access" type
          form.setValue('accessType', 'allChapterLevelAccess');
          form.setValue('levels', existingPlan.chapterLevel);
        } else if (existingPlan.chapterSelected && existingPlan.chapterSelected.length > 0) {
          // This is "Select Chapters for All level access" type
          form.setValue('accessType', 'selectChaptersForAllLevelAccess');
          form.setValue('subjects', existingPlan.chapterSelected);
          setSelectedChapters(existingPlan.chapterSelected);
        }
      }
    }
  }, [viewMode, existingPlan, form]);

  const usageRestriction = form.watch('usageRestriction');
  const accessType = form.watch('accessType');
  const levels = form.watch('levels');
  const subjects = form.watch('subjects');

  // Watch for changes in form values to clear validation errors
  useEffect(() => {
    if (usageRestriction === 'unlimited') {
      setLevelsError(null);
      setSubjectsError(null);
    } else if (accessType === 'allChapterLevelAccess') {
      if (levels && levels.length > 0) {
        setLevelsError(null);
      }
    } else if (accessType === 'selectChaptersForAllLevelAccess') {
      if (subjects && subjects.length > 0) {
        setSubjectsError(null);
      }
    }
  }, [usageRestriction, accessType, levels, subjects]);

  // Watch for changes in accessType to reset fields
  useEffect(() => {
    if (!viewMode) {
      if (accessType === 'allChapterLevelAccess') {
        // Clear selected chapters when switching to allChapterLevelAccess
        setSelectedChapters([]);
        setSubjectsError(null);

        // Reset all chapter fields in the form
        if (chapterData && chapterData.length > 0) {
          form.setValue('subjects', []);
        }
      } else if (accessType === 'selectChaptersForAllLevelAccess') {
        // Clear selected levels when switching to selectChaptersForAllLevelAccess
        form.setValue('levels', []);
        setLevelsError(null);
      }
    }
  }, [accessType, form, chapterData, viewMode]);

  // Reset form when switching from limited to unlimited
  useEffect(() => {
    if (usageRestriction === 'unlimited' && !viewMode) {
      form.setValue('levels', []);
      form.setValue('subjects', []);
      setSelectedChapters([]);
      setLevelsError(null);
      setSubjectsError(null);
    }
  }, [usageRestriction, form, viewMode]);

  // Function to update selected chapters
  const updateSelectedChapters = (chapterId: number, isSelected: boolean) => {
    if (viewMode) return;

    if (isSelected) {
      setSelectedChapters((prev) => [...prev, chapterId]);
    } else {
      setSelectedChapters((prev) => prev.filter((id) => id !== chapterId));
    }
  };

  async function onSubmit(data: ChapterWiseFormValues) {
    if (viewMode) {
      // In view mode, just close the modal
      onClose();
      return;
    }

    // Additional validation before submission
    let hasError = false;

    if (data.usageRestriction === 'limited') {
      if (data.accessType === 'allChapterLevelAccess' && (!data.levels || data.levels.length === 0)) {
        setLevelsError('Please select at least one level');
        hasError = true;
      }

      if (data.accessType === 'selectChaptersForAllLevelAccess' && (!data.subjects || data.subjects.length === 0)) {
        setSubjectsError('Please select at least one chapter');
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }

    setLoading(true);
    // Initialize the payload with the required fields
    const payload = {
      testTypeId,
      packagePlanId: planId,
      levelIds: data.levels || [],
      chapterIds: data.subjects || []
    };

    // Handle different scenarios based on usage restriction
    if (data.usageRestriction === 'unlimited') {
      // Scenario 1: Unlimited - both levelIds and chapterIds can be empty
    } else if (data.usageRestriction === 'limited') {
      if (data.accessType === 'allChapterLevelAccess') {
        // Scenario 2a: Limited with allChapterLevelAccess
        payload.levelIds = data.levels || [];
      } else if (data.accessType === 'selectChaptersForAllLevelAccess') {
        // Scenario 2b: Limited with selectChaptersForAllLevelAccess
        payload.chapterIds = data.subjects || [];
      }
    }

    try {
      const response = await createChapterTestPlan(payload);
      toast.success('Chapter-wise test plan created successfully');
    } catch (error) {
      console.error('Error creating plan:', error);
      toast.error('Failed to create chapter-wise test plan');
    } finally {
      setLoading(false);
      onClose();
    }
  }

  const fetchLevelList = async (streamId: number) => {
    try {
      const response = await getLevelList(streamId);
      setLevelList(response);
    } catch (error) {
      toast.error(TosterMessages.ADMIN_COMMON_ERROR);
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchLevelList(streamId);
  }, [streamId]);

  return (
    <MainDialog
      isOpen={true}
      onOpenChange={onClose}
      title={viewMode ? 'View Usage Restriction' : 'Set Usage Restriction'}
      size="default"
    >
      <div className="p-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormLabel className="text-base font-medium text-[#4B4B4B]">Test Type</FormLabel>

              {/* Test Type Input & Radio Buttons */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:space-x-6">
                {/* Test Type Input */}
                <FormItem className="flex-1">
                  <FormControl>
                    <Input value={name} className="text-sm font-normal text-[#4B4B4B]" readOnly />
                  </FormControl>
                </FormItem>

                {/* Radio Buttons for Usage Restriction */}
                <FormField
                  control={form.control}
                  name="usageRestriction"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-4">
                      <FormControl>
                        <RadioGroup
                          onValueChange={!viewMode ? field.onChange : undefined}
                          value={field.value}
                          className="flex space-x-4"
                          disabled={viewMode}
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem
                                color="primary"
                                value="limited"
                                id="r-limited"
                                checked={field.value === 'limited'}
                                disabled={viewMode || loading}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0 cursor-pointer text-base font-medium text-[#4B4B4B]" htmlFor="r-limited">
                              Limited
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem
                                color="primary"
                                value="unlimited"
                                id="r-unlimited"
                                checked={field.value === 'unlimited'}
                                disabled={viewMode || loading}
                              />
                            </FormControl>
                            <FormLabel
                              className="!mt-0 cursor-pointer text-base font-medium text-[#4B4B4B]"
                              htmlFor="r-unlimited"
                            >
                              Unlimited
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Conditional Fields for Limited Access */}
              {usageRestriction === 'limited' && (
                <div className="space-y-4">
                  {/* Access Type Radio Buttons */}
                  <FormField
                    control={form.control}
                    name="accessType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={!viewMode ? field.onChange : undefined}
                            value={field.value}
                            className="flex flex-wrap gap-6"
                            disabled={viewMode || loading}
                          >
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem
                                  color="primary"
                                  value="allChapterLevelAccess"
                                  id="r-all-chapter"
                                  checked={field.value === 'allChapterLevelAccess'}
                                  disabled={viewMode || loading}
                                />
                              </FormControl>
                              <FormLabel
                                className="!mt-0 cursor-pointer text-base font-medium text-[#4B4B4B]"
                                htmlFor="r-all-chapter"
                              >
                                All Chapter Level Access
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem
                                  color="primary"
                                  value="selectChaptersForAllLevelAccess"
                                  id="r-select-chapters"
                                  checked={field.value === 'selectChaptersForAllLevelAccess'}
                                  disabled={viewMode || loading}
                                />
                              </FormControl>
                              <FormLabel
                                className="!mt-0 cursor-pointer text-base font-medium text-[#4B4B4B]"
                                htmlFor="r-select-chapters"
                              >
                                Select Chapters for All level access
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Show Level Checkboxes if "All Chapter Level Access" is selected */}
                  {accessType === 'allChapterLevelAccess' && (
                    <FormField
                      control={form.control}
                      name="levels"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-wrap gap-4 rounded-md bg-[#0000800A] p-4">
                            {levelList.map((level) => (
                              <FormField
                                key={level.id}
                                control={form.control}
                                name="levels"
                                render={({ field: levelField }) => {
                                  // Ensure field.value is an array
                                  const value = Array.isArray(levelField.value) ? levelField.value : [];

                                  return (
                                    <FormItem key={level.id} className="flex items-center space-x-2">
                                      <FormControl>
                                        <Checkbox
                                          color="primary"
                                          checked={value.includes(level.id)}
                                          onCheckedChange={(checked) => {
                                            if (viewMode) return;

                                            const updated = checked
                                              ? [...value, level.id]
                                              : value.filter((id) => id !== level.id);

                                            levelField.onChange(updated);
                                          }}
                                          disabled={viewMode || loading}
                                        />
                                      </FormControl>
                                      <FormLabel className="!mt-0 text-sm font-normal text-[#4B4B4B]">{level.name}</FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          {levelsError && <p className="mt-2 text-sm font-medium text-destructive">{levelsError}</p>}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Show Subject Accordions if "Select Chapters for All level access" is selected */}
                  {accessType === 'selectChaptersForAllLevelAccess' && (
                    <div className="space-y-2">
                      <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem} className="rounded-md">
                        {chapterData.map((chapter: any) => (
                          <AccordionItem key={chapter.id} value={chapter.name} className="">
                            <AccordionTrigger className="border-none px-4 py-3 text-[#4B4B4B]">
                              <span>{chapter.name}</span>
                              <Icon
                                icon="eva:arrow-down-fill"
                                className="easy-in-out shrink-0 text-xl text-[#4B4B4B] transition-transform duration-200"
                              />
                            </AccordionTrigger>
                            <AccordionContent>
                              <ScrollArea
                                className={`${chapter.chapters.length > 1 ? 'h-[150px]' : 'h-auto'} scrollbar-thumb-primary border-t border-[#E2E8F0] bg-[#FBFBFD] px-4 text-primary`}
                                type="scroll"
                                style={chapter.chapters.length > 1 ? { height: '150px' } : { height: 'auto' }}
                              >
                                {chapter.chapters.map((subChapter: any) => (
                                  <FormField
                                    key={subChapter.id}
                                    control={form.control}
                                    name="subjects"
                                    render={({ field }) => {
                                      const values: number[] = field.value || [];
                                      const isChecked = values.includes(subChapter.id);

                                      return (
                                        <FormItem className="flex items-center space-x-2 py-2">
                                          <FormControl>
                                            <Checkbox
                                              color="primary"
                                              className="size-4"
                                              checked={isChecked}
                                              onCheckedChange={(checked) => {
                                                if (viewMode) return;

                                                const updated = checked
                                                  ? [...values, subChapter.id]
                                                  : values.filter((id) => id !== subChapter.id);

                                                field.onChange(updated);
                                                updateSelectedChapters(subChapter.id, checked ? true : false);
                                              }}
                                              disabled={viewMode || loading}
                                            />
                                          </FormControl>
                                          <FormLabel className="!mt-0 text-sm font-normal text-[#4B4B4B]">
                                            {subChapter.name}
                                          </FormLabel>
                                        </FormItem>
                                      );
                                    }}
                                  />
                                ))}
                              </ScrollArea>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                      {subjectsError && <div className="text-sm font-medium text-destructive">{subjectsError}</div>}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Button
                type={viewMode ? 'button' : 'submit'}
                variant="default"
                color="primary"
                size="md"
                className="text-sm font-normal"
                onClick={viewMode ? onClose : undefined}
                disabled={loading}
              >
                {viewMode ? 'Close' : 'Add'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </MainDialog>
  );
}

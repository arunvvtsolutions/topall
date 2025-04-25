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
import { conceptWiseFormSchema, type ConceptWiseFormValues } from '../schemas';
import { useSelector } from '@/store';
import { createConceptTestPlan } from '@/utils/api/packages';

export default function ConceptWiseForm({
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
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
  const [conceptCount, setConceptCount] = useState<number>(1);
  const [existingPlanData, setExistingPlanData] = useState<any>(null);
  const { chapterData } = useSelector((state) => state.packagePlan);
  const [loading, setLoading] = useState<boolean>(false);
  const [countError, setCountError] = useState<string | null>(null);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);

  const form = useForm<ConceptWiseFormValues>({
    resolver: zodResolver(conceptWiseFormSchema),
    defaultValues: {
      usageRestriction: 'unlimited',
      accessType: 'conceptCountForAllChapters',
      count: '',
      subjects: []
    },
    mode: 'onChange'
  });

  // Set form values based on existing plan when in view mode
  useEffect(() => {
    if (viewMode && existingPlan) {
      setExistingPlanData(existingPlan);

      // Set usage restriction
      const usageRestriction =
        existingPlan.limit === null ? 'limited' : existingPlan.limit === 'unlimited' ? 'unlimited' : 'limited';
      form.setValue('usageRestriction', usageRestriction);

      // If limited, determine the access type and set appropriate values
      if (usageRestriction === 'limited') {
        if (existingPlan.conceptCount > 0) {
          // This is "Concept Count for All Chapters" type
          form.setValue('accessType', 'conceptCountForAllChapters');
          form.setValue('count', existingPlan.conceptCount.toString());
          setConceptCount(existingPlan.conceptCount);
        } else if (existingPlan.conceptSelectedChapter && existingPlan.conceptSelectedChapter.length > 0) {
          // This is "All Concepts for Selected Chapters" type
          form.setValue('accessType', 'allConceptsForSelectedChapters');
          form.setValue('subjects', existingPlan.conceptSelectedChapter);
          setSelectedChapters(existingPlan.conceptSelectedChapter);
        }
      }
    }
  }, [viewMode, existingPlan, form]);

  const usageRestriction = form.watch('usageRestriction');
  const accessType = form.watch('accessType');
  const count = form.watch('count');
  const subjects = form.watch('subjects');

  // Watch for changes in form values to clear validation errors
  useEffect(() => {
    if (usageRestriction === 'unlimited') {
      setCountError(null);
      setSubjectsError(null);
    } else if (accessType === 'conceptCountForAllChapters') {
      if (count && !isNaN(Number(count)) && Number(count) > 0) {
        setCountError(null);
      }
    } else if (accessType === 'allConceptsForSelectedChapters') {
      if (subjects && subjects.length > 0) {
        setSubjectsError(null);
      }
    }
  }, [usageRestriction, accessType, count, subjects]);

  // Reset fields when switching access types
  useEffect(() => {
    if (!viewMode) {
      if (accessType === 'conceptCountForAllChapters') {
        // Clear selected chapters when switching to concept count
        setSelectedChapters([]);
        setSubjectsError(null);

        // Reset all chapter fields in the form
        if (chapterData && chapterData.length > 0) {
          form.setValue('subjects', []);
        }
      } else if (accessType === 'allConceptsForSelectedChapters') {
        // Reset concept count when switching to selected chapters
        setConceptCount(1);
        setCountError(null);
        form.setValue('count', '');
      }
    }
  }, [accessType, form, chapterData, viewMode]);

  // Reset form when switching from limited to unlimited
  useEffect(() => {
    if (usageRestriction === 'unlimited' && !viewMode) {
      form.setValue('count', '');
      form.setValue('subjects', []);
      setSelectedChapters([]);
      setConceptCount(1);
      setCountError(null);
      setSubjectsError(null);
    }
  }, [usageRestriction, form, viewMode]);

  async function onSubmit(data: ConceptWiseFormValues) {
    if (viewMode) {
      // In view mode, just close the modal
      onClose();
      return;
    }

    // Additional validation before submission
    let hasError = false;

    if (data.usageRestriction === 'limited') {
      if (data.accessType === 'conceptCountForAllChapters') {
        if (!data.count || isNaN(Number(data.count)) || Number(data.count) <= 0) {
          setCountError('Please enter a valid concept count greater than 0');
          hasError = true;
        }
      }

      if (data.accessType === 'allConceptsForSelectedChapters' && (!data.subjects || data.subjects.length === 0)) {
        setSubjectsError('Please select at least one chapter');
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }

    setLoading(true);

    // Initialize the payload
    const payload = {
      testTypeId,
      packagePlanId: planId,
      count: 0,
      chapterIds: [] as number[]
    };

    // Handle different scenarios based on usage restriction
    if (data.usageRestriction === 'unlimited') {
      // Scenario 1: Unlimited - count is 0 and chapterIds is empty array
    } else if (data.usageRestriction === 'limited') {
      if (data.accessType === 'allConceptsForSelectedChapters') {
        payload.chapterIds = data.subjects || [];
      } else if (data.accessType === 'conceptCountForAllChapters') {
        // Scenario 3: Limited with conceptCountForAllChapters
        payload.count = conceptCount;
      }
    }

    try {
      const response = await createConceptTestPlan(payload);
      toast.success('Concept-wise test plan created successfully');
      onClose();
    } catch (error) {
      console.error('Error creating plan:', error);
      toast.error('Failed to create concept-wise test plan');
    } finally {
      setLoading(false);
    }
  }

  // Function to update selected chapters
  const updateSelectedChapters = (chapterId: number, isSelected: boolean) => {
    if (viewMode) return;

    if (isSelected) {
      setSelectedChapters((prev) => [...prev, chapterId]);
    } else {
      setSelectedChapters((prev) => prev.filter((id) => id !== chapterId));
    }
  };

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
                          disabled={viewMode || loading}
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
                  {/* Access Type Radio Buttons - Updated with new options */}
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
                                  value="conceptCountForAllChapters"
                                  id="r-concept-count"
                                  checked={field.value === 'conceptCountForAllChapters'}
                                  disabled={viewMode || loading}
                                />
                              </FormControl>
                              <FormLabel
                                className="!mt-0 cursor-pointer text-base font-medium text-[#4B4B4B]"
                                htmlFor="r-concept-count"
                              >
                                Concept Count for All Chapters
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem
                                  color="primary"
                                  value="allConceptsForSelectedChapters"
                                  id="r-all-concepts"
                                  checked={field.value === 'allConceptsForSelectedChapters'}
                                  disabled={viewMode || loading}
                                />
                              </FormControl>
                              <FormLabel
                                className="!mt-0 cursor-pointer text-base font-medium text-[#4B4B4B]"
                                htmlFor="r-all-concepts"
                              >
                                All Concepts for Selected Chapters
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Show Concept Count Input if "Concept Count for All Chapters" is selected */}
                  {accessType === 'conceptCountForAllChapters' && (
                    <FormField
                      control={form.control}
                      name="count"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium text-[#4B4B4B]">Number of Concepts</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              value={field.value}
                              onChange={(e) => {
                                if (viewMode) return;

                                field.onChange(e.target.value);
                                const numValue = Number.parseInt(e.target.value) || 1;
                                setConceptCount(numValue);
                              }}
                              placeholder="Enter concept count"
                              className="w-full"
                              readOnly={viewMode || loading}
                            />
                          </FormControl>
                          {countError && <p className="mt-2 text-sm font-medium text-destructive">{countError}</p>}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Show Subject Accordions only if "All Concepts for Selected Chapters" is selected */}
                  {accessType === 'allConceptsForSelectedChapters' && (
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
                                      // Ensure field.value is an array
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
                disabled={loading}
                onClick={viewMode ? onClose : undefined}
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

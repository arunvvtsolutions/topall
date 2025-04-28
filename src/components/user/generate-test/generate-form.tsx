'use client';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { MainDialog } from '@/components/common/MainDialog';
import { generateSchema } from '@/schemas/generate/generate-schema';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import type { GenerateTestProps } from '@/types/exams';
import { Errors } from '@/types/enum';
import { useSession } from 'next-auth/react';
import { generateTest, getExamPreData } from '@/utils/api/generate-test';
import { useDispatch, useSelector } from '@/store';
import { getSubjects } from '@/store/slice/admin/academic';
import { getChapterList } from '@/utils/api/exams';
import { HttpStatusCode } from 'axios';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { MultiSelect } from '@/components/common/MultiSelect';
import type { GenericType } from '@/types';
import { Icon } from '@/components/ui/icon';

interface SubjectModal {
  title: string;
  open: boolean;
  onClose: () => void;
}

interface SyllabusProps {
  subjectId: number;
  subjectName: string;
  chapterIds: { id: number; chapterName: string }[];
}

export interface GeneateTestProps {
  name: string;
  subjects: string[];
  chapters: string[] | any;
  easy: number;
  medium: number;
  hard: number;
  level: string;
  questions: number;
  time: number;
}

interface IExamBaseDetailsProps {
  subjects: {
    id: number;
    name: string;
    chapters: {
      id: number;
      name: string;
    }[];
  }[];
  questionSlots: string[];
  timeSlots: string[];
  cwlMarks: number[];
  questionTypes: string[];
}

const getDifficultyColors = (difficulty: string) => {
  if (difficulty.toLowerCase() === 'easy') {
    return {
      trackColor: 'bg-[#00A86B3D]',
      rangeColor: 'bg-[#00A86B]',
      thumbColor: 'border-[#00A86B]'
    };
  }
  if (difficulty.toLowerCase() === 'medium') {
    return {
      trackColor: 'bg-[#FFAD433D]',
      rangeColor: 'bg-[#FFAD43]',
      thumbColor: 'border-[#FFAD43]'
    };
  }
  if (difficulty.toLowerCase() === 'hard') {
    return {
      trackColor: 'bg-[#FF47473D]',
      rangeColor: 'bg-[#FF4747]',
      thumbColor: 'border-[#FF4747]'
    };
  }
};

const GenerateFormModal: React.FC<SubjectModal> = ({ open, title, onClose }) => {
  const { data } = useSession();
  const dispatch = useDispatch();

  const subjects = useSelector((state) => state.user.subjects);

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<Record<string, string[] | any>>({});
  const [difficulty, setDifficulty] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [chaptersList, setChaptersList] = useState<SyllabusProps[]>([]);
  const [chapters, setChapters] = useState<Record<string, { id: number; chapterName: string }[]>>({});
  const [examDetails, setExamDetails] = useState<IExamBaseDetailsProps>();
  const [isSubmited, setIsSubmitted] = useState(false);
  const [expand, setExpand] = useState('');
  const [sliderLockInfo, setSliderLockInfo] = useState({
    isLocked: false,
    total: 0
  });

  const form = useForm<GeneateTestProps>({
    resolver: zodResolver(generateSchema()),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      name: '',
      subjects: [],
      chapters: {},
      easy: 0,
      medium: 0,
      hard: 0,
      questions: 0,
      time: 0,
      level: '0'
    }
  });

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = form;

  // Watch all difficulty values to update total and validation
  const easyValue = watch('easy');
  const mediumValue = watch('medium');
  const hardValue = watch('hard');

  // Calculate total whenever any difficulty value changes
  useEffect(() => {
    const total = (easyValue || 0) + (mediumValue || 0) + (hardValue || 0);

    // Update level with the current total
    setValue('level', String(total));

    // Check if we need to lock sliders based on total
    setSliderLockInfo({
      isLocked: total >= 100,
      total: total
    });

    // Only set form error if the form has been submitted
    if (isSubmited) {
      if (total !== 100) {
        form.setError('level', {
          message: total > 100 ? 'Total difficulty cannot exceed 100%' : 'Total difficulty should be exactly 100%'
        });
      } else {
        form.clearErrors('level');
      }
    }
  }, [easyValue, mediumValue, hardValue, setValue, form, isSubmited]);

  // Update the handleLevelSelect function to properly handle slider changes
  const handleLevelSelect = (type: 'easy' | 'medium' | 'hard', newValue: number | string) => {
    const newValueNum = Number(newValue);

    // Get current values for all difficulty levels
    const currentValues = {
      easy: type === 'easy' ? newValueNum : form.getValues('easy') || 0,
      medium: type === 'medium' ? newValueNum : form.getValues('medium') || 0,
      hard: type === 'hard' ? newValueNum : form.getValues('hard') || 0
    };

    // Calculate what the new total would be
    const newTotal = currentValues.easy + currentValues.medium + currentValues.hard;

    // If increasing a value would exceed 100, adjust it to exactly reach 100
    if (newTotal > 100) {
      const excess = newTotal - 100;
      setValue(type, Math.max(0, newValueNum - excess), { shouldValidate: isSubmited });
    } else {
      // Otherwise, allow the change
      setValue(type, newValueNum, { shouldValidate: isSubmited });
    }
  };

  const handleQuestionCountSelect = (count: number) => {
    setQuestionCount(count);
    setValue('questions', count, { shouldValidate: true });
  };

  const handleTimeSelect = (timeValue: number) => {
    setTime(timeValue);
    setValue('time', timeValue, { shouldValidate: true });
  };

  // Update the onSubmit function to validate before submission
  const onSubmit = async (formData: GeneateTestProps) => {
    try {
      setIsSubmitted(true);

      // Check if total equals 100 before proceeding
      const total = (formData.easy || 0) + (formData.medium || 0) + (formData.hard || 0);
      if (total !== 100) {
        form.setError('level', {
          message: total > 100 ? 'Total difficulty cannot exceed 100%' : 'Total difficulty must equal exactly 100%'
        });
        return;
      }

      setLoading(true);
      if (!data?.user) return;
      const payload: GenerateTestProps = {
        difficulty: [Number(form.getValues('easy')), Number(form.getValues('medium')), Number(form.getValues('hard'))],
        minutesPerSubject: formData.time,
        questionPerSubject: formData.questions,
        questionTypes: ['0'],
        standardId: data?.user?.standard?.[0]?.standard?.id,
        streamId: data.user.currentExams[0].id,
        studentId: data.user.id,
        syllabus: chaptersList.map((c) => ({ ...c, chapterIds: c.chapterIds.map((id) => id.id) })),
        testName: formData.name,
        cwlMarks: [4, 1, 0]
      };
      const result = await generateTest(payload);
      if (result.status === HttpStatusCode.Created) toast.success('Exam Generated Succesfully!');
      else toast.error(Errors.SOMETHING_WENT_WRONG);
      onClose();
    } catch (error) {
      toast.error(Errors.SOMETHING_WENT_WRONG);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSelect = async (subjectIds: number[]) => {
    try {
      setSelectedSubjects(subjectIds);

      const currentSelectedChapters = form.getValues('chapters');
      const updatedChapters = { ...chapters };
      let newlyAddedSubject: GenericType | null = null;

      const addedSubjects = subjects.filter(
        (sub) => subjectIds.includes(sub.id) && !chaptersList.some((c) => c.subjectId === sub.id)
      );

      if (addedSubjects.length) {
        newlyAddedSubject = addedSubjects[0];
        setValue('subjects', [...form.getValues('subjects'), newlyAddedSubject?.name], { shouldValidate: true });
        setChaptersList((prev) => [
          ...prev,
          ...addedSubjects.map((s) => ({ subjectId: s.id, subjectName: s.name, chapterIds: [] }))
        ]);
      } else {
        setChaptersList((prev) => prev.filter((c) => subjectIds.includes(c.subjectId)));
        Object.keys(currentSelectedChapters).forEach((subjectName) => {
          if (!subjectIds.includes(chaptersList.find((c) => c.subjectName === subjectName)?.subjectId || -1)) {
            delete currentSelectedChapters[subjectName];
            delete updatedChapters[subjectName];
            setValue('subjects', [...form.getValues('subjects').filter((s) => s !== subjectName)], {
              shouldValidate: true
            });
          }
        });
      }

      setSelectedChapters(currentSelectedChapters);

      if (newlyAddedSubject) {
        setValue('chapters', { ...currentSelectedChapters, [newlyAddedSubject.name]: [] }, { shouldValidate: true });
        const fetchedChapters = await getChapterList({
          subjectId: newlyAddedSubject.id,
          standardId: data?.user?.standard?.[0]?.standard?.id
        });

        updatedChapters[newlyAddedSubject.name] = fetchedChapters.map((chapter: any) => ({
          id: chapter.chapterId,
          chapterName: chapter.chapterName
        }));
      }

      //       if (newlyAddedSubject) {
      //         setValue('chapters', { ...currentSelectedChapters, [newlyAddedSubject.name]: [] }, { shouldValidate: true });
      //         const fetchedChapters = await getChapterList({
      //           subjectId: newlyAddedSubject.id,
      //           standardId: data?.user?.standard?.[0]?.standard?.id
      //         });

      //         updatedChapters[newlyAddedSubject.name] = fetchedChapters.map((chapter: any) => ({
      // =======
      //     } else {
      //       setValue('chapters', { ...currentSelectedChapters, [subject]: [] }, { shouldValidate: true });
      //       const chapters = await getChapterList({ subjectId, standardId: data?.user.standard?.[0]?.standard?.id });
      //       updatedChapters = {
      //         ...updatedChapters,
      //         [subject]: chapters.map((chapter: any) => ({
      // >>>>>>> a0ed110 (TOPC-976: Initial commit for result apge)
      //           id: chapter.chapterId,
      //           chapterName: chapter.chapterName
      //         }));
      //       }

      setChapters(updatedChapters);
    } catch (error) {
      console.error('Error handling subject selection:', error);
    }
  };

  const handleChapterSelect = (subjectId: number, subject: string, chapterName: string, chapterId: number) => {
    try {
      setChaptersList((prev) =>
        prev.map((chapter) => {
          if (chapter.subjectId !== subjectId) return chapter;

          const chapterExists = chapter.chapterIds.some((c) => c.id === chapterId);
          const updatedChapterIds = chapterExists
            ? chapter.chapterIds.filter((c) => c.id !== chapterId)
            : [...chapter.chapterIds, { id: chapterId, chapterName }];

          return {
            ...chapter,
            chapterIds: updatedChapterIds
          };
        })
      );

      setSelectedChapters((prev) => {
        const updated = { ...prev };
        if (!updated[subject]) updated[subject] = [];
        updated[subject] = updated[subject].includes(chapterName)
          ? updated[subject].filter((c: any) => c !== chapterName)
          : [...updated[subject], chapterName];
        setValue('chapters', updated, { shouldValidate: true });
        return updated;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectAllChapters = (subjectId: number, subject: string, isChecked: boolean) => {
    const newChaptersList = chaptersList.map((chapter) => {
      if (chapter.subjectId === subjectId) {
        return {
          ...chapter,
          chapterIds: isChecked ? (chapters[subject as any] as any) : []
        };
      }
      return chapter;
    });
    setChaptersList(newChaptersList);
    setSelectedChapters((prev) => {
      const updated = {
        ...prev,
        ...form.getValues('chapters'),
        [subject]: isChecked ? [...chapters[subject].map((c) => c.chapterName)] : []
      };
      setValue('chapters', updated, { shouldValidate: true });
      return updated;
    });
  };

  useEffect(() => {
    const getData = async () => {
      dispatch(getSubjects());
      const standardId = data?.user?.standard?.[0]?.standard?.id || 0;
      const streamId = data?.user?.currentExams[0]?.id || 0;
      const preData = await getExamPreData(streamId, standardId);
      setExamDetails(preData);
      setIsLoading(false);
    };
    getData();
  }, []);

  return (
    <MainDialog className={'text-[20px] lg:!text-[24px]'} title={title} isOpen={open} onOpenChange={onClose} size="md">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border-t-[rgba(111, 111, 111, 1)] grid w-full gap-6 border-t pt-2 md:pt-4">
            {/* Section Name and Choose Subject in Flex */}
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              {/* Name Input Field */}
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full flex-1 sm:w-auto">
                    <FormLabel className="text-[14px] !font-normal !text-[#6F6F6F] lg:text-[16px]">
                      Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Enter Test Name"
                        className="h-[40px] rounded-[8px] text-primary md:h-[56px]"
                        disabled={loading}
                        {...field}
                        size={24}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subject Selection */}
              <FormField
                control={control}
                name="subjects"
                render={({ field, fieldState }) => (
                  <FormItem className="w-full flex-1 sm:w-auto">
                    <FormLabel className="text-[14px] !font-normal !text-[#6F6F6F] lg:text-[16px]">
                      Choose Subject<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={subjects as any}
                        onValueChange={(value) => {
                          handleSubjectSelect(value);
                        }}
                        defaultValue={selectedSubjects}
                        placeholder="Select Subject"
                        variant="default"
                        color="secondary"
                        maxCount={2}
                        disabled={loading}
                        className="h-[40px] rounded-[8px] text-primary md:h-[56px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Chapter Selection */}
            <FormField
              control={control}
              name="chapters"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-[14px] !font-normal !text-[#6F6F6F] lg:text-[16px]">
                    Select Chapters<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div>
                      {chaptersList.length === 0 && (
                        <div className="flex min-h-[83px] w-full items-center justify-center rounded-[8px] border p-2 sm:w-auto">
                          <div className="text-[14px] text-[#6F6F6F]">Please select a subject to enable chapters</div>
                        </div>
                      )}
                      <Accordion type="single" collapsible>
                        {chaptersList.map((subject) => (
                          <AccordionItem key={subject.subjectId} value={`${subject.subjectName}`}>
                            <AccordionTrigger
                              className="h-[56px]"
                              onClick={() => setExpand((prev) => (prev === subject.subjectName ? '' : subject.subjectName))}
                            >
                              <div className="flex w-full items-center justify-between">
                                <p className="flex flex-nowrap items-center gap-1 text-sm font-[400] !text-[#6F6F6F] lg:text-lg">
                                  {subject.subjectName}{' '}
                                  <span>
                                    <Icon
                                      icon="oui:arrow-down"
                                      className={cn(
                                        'mt-1',
                                        expand === subject.subjectName
                                          ? 'rotate-180 transition-transform duration-300'
                                          : 'rotate-360 transition-transform duration-300'
                                      )}
                                    />
                                  </span>
                                </p>
                                <div className="flex items-center lg:text-lg">
                                  <Checkbox
                                    checked={
                                      selectedChapters[subject.subjectName]?.length === chapters[subject.subjectName]?.length &&
                                      chapters[subject.subjectName]?.length > 0
                                    }
                                    onCheckedChange={(isChecked) =>
                                      handleSelectAllChapters(subject.subjectId, subject.subjectName, Boolean(isChecked))
                                    }
                                    className={`h-4 w-4 rounded border ${
                                      chapters[subject.subjectName]?.length &&
                                      chapters[subject.subjectName]?.length === selectedChapters[subject.subjectName]?.length
                                        ? '!border-primary'
                                        : '!border-[#6F6F6F]'
                                    } bg-transparent`}
                                  />
                                  <span
                                    className={`ml-2 text-sm font-[400] lg:text-lg ${
                                      chapters[subject.subjectName]?.length &&
                                      chapters[subject.subjectName]?.length === selectedChapters[subject.subjectName]?.length
                                        ? 'text-primary'
                                        : 'text-[#6F6F6F]'
                                    }`}
                                  >
                                    Select All
                                  </span>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 pt-0">
                              <div className="border-t pt-4">
                                {chapters[subject.subjectName]?.length > 0 ? (
                                  chapters[subject.subjectName]?.map((chapter: any) => (
                                    <Button
                                      key={chapter.id}
                                      type="button"
                                      onClick={() =>
                                        handleChapterSelect(
                                          subject.subjectId,
                                          subject.subjectName,
                                          chapter.chapterName,
                                          chapter.id
                                        )
                                      }
                                      className="mb-2 mr-2 border !px-[16px] !py-[8px] text-[14px] font-normal"
                                      style={{
                                        backgroundColor: selectedChapters[subject.subjectName]?.some(
                                          (c: any) => c === chapter.chapterName
                                        )
                                          ? '#00A86B'
                                          : 'white',
                                        color: selectedChapters[subject.subjectName]?.some((c: any) => c === chapter.chapterName)
                                          ? 'white'
                                          : '#6F6F6F'
                                      }}
                                    >
                                      {chapter.chapterName}
                                    </Button>
                                  ))
                                ) : (
                                  <p className="text-center text-[16px] font-[600]">No Data Found</p>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </FormControl>
                  {isSubmited && <FormMessage />}
                </FormItem>
              )}
            />
            {/* Difficulty Level */}
            <FormField
              control={control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] !font-normal !text-[#6F6F6F] lg:text-[16px]">
                    Level of Difficulty<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="grid w-full grid-cols-1 gap-[16px] rounded-[8px] border bg-[#fff] lg:grid-cols-3 lg:!border-none lg:bg-inherit">
                      {['easy', 'medium', 'hard'].map((level) => (
                        <Card
                          key={level}
                          className={cn(
                            'border-[0] !px-[18px] py-[10px] shadow-none lg:!h-auto lg:!border lg:!pb-[36px] lg:!pt-[16px]',
                            level === 'hard' ? 'h-[100px]' : 'h-[70px]'
                          )}
                        >
                          <div className="flex justify-between">
                            <p className="text-[14px] font-[400] text-[#6F6F6F]">
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </p>
                          </div>
                          <Slider
                            defaultValue={[Number(form.getValues(level as any))]}
                            value={[Number(form.getValues(level as any))]}
                            // Only disable if total is 100% AND we're not currently on this difficulty level
                            disabled={sliderLockInfo.isLocked && form.getValues(level as any) === 0}
                            color="red"
                            max={100}
                            step={5}
                            className="mt-[15px]"
                            showLabel
                            trackClassName={getDifficultyColors(level)?.trackColor}
                            rangeClassName={getDifficultyColors(level)?.rangeColor}
                            thumbClassName={cn('bg-[#fff] border-[1px] border-[solid]', getDifficultyColors(level)?.thumbColor)}
                            onValueChange={(value) => {
                              setDifficulty(level);
                              handleLevelSelect(level as 'easy' | 'medium' | 'hard', value[0]);
                            }}
                          />
                        </Card>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Question Count */}
            <FormField
              control={control}
              name="questions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] !font-normal !text-[#6F6F6F] lg:text-[16px]">
                    Number of Questions Per Subject<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="mt-4 flex flex-wrap gap-[16px] sm:flex-row sm:gap-[24px]">
                      {examDetails?.questionSlots?.map((count) => (
                        <Button
                          key={count}
                          type="button"
                          onClick={() => handleQuestionCountSelect(Number(count))}
                          className="h-[36px] border !px-2.5 !py-1.5 text-[14px] font-normal md:!px-[16px] md:!py-[8px]"
                          style={{
                            backgroundColor: questionCount === Number(count) ? '#00A86B' : 'white',
                            color: questionCount === Number(count) ? 'white' : 'rgba(111, 111, 111, 1)'
                          }}
                        >
                          {count} Ques
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Time */}
            <FormField
              control={control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] !font-normal !text-[#6F6F6F] lg:text-[16px]">
                    Test Time Per Subject<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="mt-4 flex flex-wrap gap-[16px] sm:flex-row sm:gap-[24px]">
                      {examDetails?.timeSlots?.map((timeValue) => (
                        <Button
                          key={timeValue}
                          type="button"
                          onClick={() => handleTimeSelect(Number(timeValue))}
                          className="h-[36px] border !px-2.5 !py-1.5 text-[14px] font-normal md:!px-[16px] md:!py-[8px]"
                          style={{
                            backgroundColor: time === Number(timeValue) ? '#00A86B' : 'white',
                            color: time === Number(timeValue) ? 'white' : 'rgba(111, 111, 111, 1)'
                          }}
                        >
                          {timeValue} Mins
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-4 flex justify-end">
            <Button
              disabled={loading}
              onClick={() => setIsSubmitted(true)}
              className="h-[36px] w-[100px] text-base md:h-[48px] md:w-[160px]"
              style={{
                backgroundColor: loading ? '#6f6f6f' : '#00A86B',
                color: loading ? 'white' : 'white'
              }}
              type="submit"
            >
              {loading && (
                <div className="animate-spin">
                  <Loader2 className="w-5" />
                </div>
              )}
              Create Test
            </Button>
          </div>
        </form>
      </Form>
    </MainDialog>
  );
};

export default GenerateFormModal;

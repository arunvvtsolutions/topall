'use client';
import React, { useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { DialogTitle, FormType, TosterMessages } from '@/types/enum';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormFields } from '@/types/enum';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getSubjects } from '@/store/slice/admin/academic';
import { useDispatch, useSelector } from '@/store';
import { MainDialog } from '@/components/common/MainDialog';
import { GenericType } from '@/types';
import { getAllFaculty, getSectionsByExamId } from '@/store/slice/exam/sections';
import { sectionSchema } from '@/schemas/exam/sectionSchemas';
import { useParams } from 'next/navigation';
import { HttpStatus } from '@/types/constants';
import { FloatingLabelInput } from '@/components/common/floating-label-input';
import { createSection, updateSection } from '@/utils/api/section';
import SelectDropdown from '@/components/common/Select';
import { Icon } from '@/components/ui/icon';
import InfoIcon from './info-icon';

interface SubjectModal {
  title: string;
  open: boolean;
  type: string;
  initialData: any | null;
  onClose: () => void;
  testDetails?: any | null;
  overallTotal?: number | undefined | any;
  marks?: number | null | any;
  row?: any;
}
export interface SectionFormValues {
  examId: string;
  maxAttempts: number;
  name: string;
  cMark: number;
  wMark: number;
  lMark: number;
  totalQuestions: number;
  questionType: number;
  staffId: number;
  subjectId: number;
}

const SectionFormModal: React.FC<SubjectModal> = ({
  open,
  initialData,
  type = FormType.EDIT,
  title,
  onClose,
  testDetails,
  overallTotal,
  marks,
  row
}) => {
  const dispatch = useDispatch();
  const faculties = useSelector((state) => state.examSections.faculties || []);
  const { examId } = useParams() || {};
  const [loading, setLoading] = useState(false);
  const [maxAttempts, setMaxAttempts] = useState<number>(initialData?.maxAttempts || 0);
  const [totalQuestions, setTotalQuestions] = useState<number>(initialData?.totalQuestions || 0);
  const [cMark, setCMark] = useState<number>(initialData?.cMark || 0);
  const [isExceeding, setIsExceeding] = useState<boolean>(false);
  const [questionType, setQuestionType] = useState<GenericType>({ id: 0, name: '' });
  const [selectedSubject, setSelectedSubject] = useState<GenericType>({ id: 0, name: '' });
  const [selectedFaculty, setSelectedFaculty] = useState<GenericType>({ id: 1, name: 'Admin' });
  const [isQuestionCountLess, setIsQuestionCountLess] = useState<boolean>(false);
  const examIdString = String(examId);
  const defaultValues = initialData
    ? {
        examId: initialData.examId || '',
        maxAttempts: initialData.maxAttempts?.toString() || '',
        name: initialData.name || '',
        cMark: initialData.cMark?.toString() || '',
        wMark: initialData.wMark?.toString() || '',
        lMark: initialData.lMark?.toString() || '',
        totalQuestions: initialData.totalQuestions?.toString() || '',
        questionType: initialData.questionType || 0,
        staffId: initialData.staffs?.id || 0,
        subjectId: initialData.subjectId || 0
      }
    : {
        examId: '',
        maxAttempts: '',
        name: '',
        cMark: '',
        wMark: '',
        lMark: '',
        totalQuestions: '',
        questionType: 0,
        staffId: 1,
        subjectId: 0
      };

  // Initialize form with default values
  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues
  });

  const streamData = useMemo(() => {
    return [
      { id: 1, name: 'Admin' },
      ...faculties
        .filter((faculty) => faculty.id !== 1)
        .map((faculty: any) => ({
          id: faculty.id,
          name: faculty.name
        }))
    ];
  }, [faculties]);

  useEffect(() => {
    if (open) {
      dispatch(getSubjects());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (selectedSubject.id) {
      dispatch(getAllFaculty(String(selectedSubject.id || initialData?.subjectId)));
    }
  }, [selectedSubject.id, initialData?.subjectId, dispatch]);

  useEffect(() => {
    if (marks) {
      const newTotal = maxAttempts * cMark;

      const adjustedOverallTotal =
        type === FormType.EDIT
          ? (overallTotal || 0) - (initialData?.maxAttempts || 0) * (initialData?.cMark || 0)
          : overallTotal || 0;

      if (newTotal + adjustedOverallTotal > marks) {
        setIsExceeding(true);
      } else {
        setIsExceeding(false);
      }
    } else {
      console.warn('marks or related data is undefined.');
    }
    if (row?.questionList?.length && totalQuestions) {
      setIsQuestionCountLess(totalQuestions < row.questionList.length);
    }
  }, [maxAttempts, cMark, initialData, overallTotal, type, marks, totalQuestions]);

  useEffect(() => {
    if (initialData?.subjectId && testDetails.stream_subjects.length > 0) {
      const matchedSubject = testDetails.stream_subjects.find((subject: any) => subject.subject_id === initialData.subjectId);
      if (matchedSubject) {
        setSelectedSubject({ id: matchedSubject.subject_id, name: matchedSubject.subjectName });
      }
    }
  }, [initialData, testDetails.stream_subjects]);

  useEffect(() => {
    if (initialData?.questionType !== undefined) {
      const matchedType = { id: initialData.questionType, name: initialData.questionType === 0 ? 'MCQ' : 'Integer' };
      setQuestionType(matchedType);
      form.setValue('questionType', initialData.questionType);
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData?.staffs?.id && streamData.length > 0) {
      const matchedFaculty = streamData.find((faculty: any) => faculty.id === initialData.staffs.id);
      if (matchedFaculty && matchedFaculty.id !== selectedFaculty.id) {
        setSelectedFaculty({ id: matchedFaculty.id, name: matchedFaculty.name });
      }
    }
  }, [initialData?.staffs?.id, streamData]);

  useEffect(() => {
    if (testDetails) {
      if (!initialData) {
        form.setValue('cMark', testDetails.c_marks?.toString() || '');
        form.setValue('wMark', testDetails.w_marks?.toString() || '');
        form.setValue('lMark', testDetails.l_marks?.toString() || '');
      }
      setCMark(testDetails.c_marks);
    }
  }, [testDetails, form]);

  const subjectSelectionHandler = (selectedSubject: GenericType) => {
    setSelectedSubject(selectedSubject);
    form.setValue('subjectId', selectedSubject.id);
    form.trigger('subjectId');
  };
  const questionSelectionHandler = (selectedType: GenericType) => {
    setQuestionType(selectedType);
    form.setValue('questionType', selectedType.id);
    form.trigger('questionType');
  };
  const facultySelectionHandler = (selectedFaculty: GenericType) => {
    setSelectedFaculty(selectedFaculty);
    form.setValue('staffId', selectedFaculty.id);
    form.trigger('staffId');
  };

  // Handle submit logic
  const onSubmit = async (data: SectionFormValues) => {
    try {
      setLoading(true);

      const sectionData: Record<string, any> = {
        examId: examIdString,
        maxAttempts: Number(data.maxAttempts) || 0,
        name: data.name,
        cMark: Number(data.cMark) || 0,
        wMark: Number(data.wMark) || 0,
        lMark: Number(data.lMark) || 0,
        totalQuestions: Number(data.totalQuestions) || 0,
        questionType: data.questionType,
        staffId: data.staffId
      };

      // Conditionally add `subjectId` for creation
      if (!initialData && data.subjectId) {
        sectionData.subjectId = data.subjectId;
      }

      let response;

      // Determine if this is a create or update operation
      if (initialData) {
        // Prepare updated section data
        const updatedSectionData = {
          ...sectionData,
          sectionId: initialData.id
        };

        // Call update API
        response = await updateSection(updatedSectionData);
      } else {
        // Call create API
        response = await createSection(sectionData);
      }

      // Handle response
      if (response?.statusCode === HttpStatus.CONFLICT) {
        toast.error(response?.message || 'Failed to process the request.');
        return;
      } else if (response?.statusCode === HttpStatus.OK || HttpStatus.CREATED) {
        const successMessage = initialData
          ? TosterMessages.ADMIN_SECTION_UPDATE_SUCCESS
          : TosterMessages.ADMIN_SECTION_CREATE_SUCCESS;
        toast.success(successMessage);
        if (!initialData) {
          form.reset(defaultValues);
          setSelectedSubject({ id: 0, name: '' });
          setQuestionType({ id: 0, name: '' });
          setSelectedFaculty({ id: 1, name: 'Admin' });
          form.setValue('cMark', testDetails.c_marks?.toString() || '');
          form.setValue('wMark', testDetails.w_marks?.toString() || '');
          form.setValue('lMark', testDetails.l_marks?.toString() || '');
        }
        dispatch(getSectionsByExamId(examIdString));
      } else {
        toast.error(response?.message || 'Failed to process the request.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(initialData ? TosterMessages.ADMIN_SECTION_UPDATE_FAIL : TosterMessages.ADMIN_SECTION_CREATE_FAIL);
    } finally {
      setLoading(false);
      onClose();
    }
  };
  const handleModalClose = () => {
    // Reset form fields
    if (!initialData) {
      // Reset form fields only in create mode
      form.reset(defaultValues);

      // Reset local states
      setSelectedSubject({ id: 0, name: '' });
      setQuestionType({ id: 0, name: '' });
      setSelectedFaculty({ id: 1, name: 'Admin' });

      // Reset additional state affected by testDetails
      form.setValue('cMark', testDetails.c_marks?.toString() || '');
      form.setValue('wMark', testDetails.w_marks?.toString() || '');
      form.setValue('lMark', testDetails.l_marks?.toString() || '');
    }

    // Call the onClose prop to close the modal
    onClose();
  };

  const questionTypeMap: Record<number, FormFields> = {
    0: FormFields.MCQ,
    1: FormFields.INTEGER,
  };
  
  // Safely map question_types to dropdown options
  const questionTypeOptions =
    (testDetails?.question_types as number[] | undefined)
      ?.filter((typeId): typeId is 0 | 1 => typeId in questionTypeMap)
      .map((typeId) => ({
        id: typeId,
        name: questionTypeMap[typeId],
      })) || [];

  return (
    <MainDialog title={title} isOpen={open} onOpenChange={handleModalClose} size="default">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid w-full gap-4">
            <div className="grid w-full gap-4 sm:grid-cols-1 lg:grid-cols-2">
              {/* Subject Selection */}
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium !text-[rgba(75,75,75,1)]">{DialogTitle.SUB}</FormLabel>
                    <FormControl>
                      <SelectDropdown
                        data={testDetails.stream_subjects
                          .filter((active: any) => active.is_active === true)
                          .map((subject: any) => ({
                            id: subject.subject_id,
                            name: subject.subjectName
                          }))}
                        value={selectedSubject}
                        onChange={(selected) => subjectSelectionHandler(selected)}
                        placeholder="Select Subject"
                        name={field.name}
                        size="default"
                        width="100%"
                        disabled={loading || type === FormType.VIEW || type === FormType.EDIT}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Section Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium !text-[rgba(75,75,75,1)]">{FormFields.SECTION_NAME}</FormLabel>
                    <FormControl>
                      <Input
                        autoFocus={false}
                        autoComplete="off"
                        readOnly={type === FormType.VIEW}
                        disabled={loading}
                        placeholder=""
                        color="secondary"
                        className="h-[35px] text-primary"
                        size="md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Additional Fields like Max Attempts, Question Type, etc. */}
              <FormField
                control={form.control}
                name="totalQuestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium !text-[rgba(75,75,75,1)]">{FormFields.NO_QUES}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder=""
                        color="secondary"
                        className="text-primary"
                        size="md"
                        data-test-id="total-marks-input"
                        autoComplete="off"
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setTotalQuestions(Number(value));
                          field.onChange(value);
                        }}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxAttempts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium !text-[rgba(75,75,75,1)]">{FormFields.MAX_ATTEM}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder=""
                        color="secondary"
                        className="text-primary"
                        size="md"
                        data-test-id="total-marks-input"
                        autoComplete="off"
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setMaxAttempts(Number(value));
                          field.onChange(value);
                        }}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Question Type */}
              <FormField
                control={form.control}
                name="questionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium !text-[rgba(75,75,75,1)]">{FormFields.QUES_TYPE}</FormLabel>
                    <FormControl>
                      <SelectDropdown
                       data={questionTypeOptions}
                        value={questionType}
                        onChange={(selectedOption) => {
                          questionSelectionHandler(selectedOption);
                        }}
                        placeholder="Select Question Type"
                        name={field.name}
                        size="default"
                        width="100%"
                        disabled={loading || type === FormType.VIEW}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="staffId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium !text-[rgba(75,75,75,1)]">{FormFields.ASSIGN_FACULTY}</FormLabel>
                    <FormControl>
                      <SelectDropdown
                        data={streamData}
                        value={selectedFaculty}
                        onChange={(selectedFaculty) => facultySelectionHandler(selectedFaculty)}
                        placeholder="Select Faculty"
                        name="faculty"
                        size="default"
                        width="100%"
                        disabled={loading || type === FormType.VIEW}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-3 flex w-full flex-col">
              <div className="mb-4 flex w-full">
                <h2 className="!text-[rgba(34, 34, 34, 1)] text-sm font-medium">{DialogTitle.MARKS}</h2>
              </div>
              <div className="grid w-full grid-cols-3 space-x-2">
                {/* Correct Marks */}
                <FormField
                  control={form.control}
                  name="cMark"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          label="Your Name"
                          floatingLabel="Correct"
                          value={field.value ? String(field.value) : ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, '');
                            setCMark(Number(value));
                            field.onChange(value);
                          }}
                          borderColor="border-[#00A86B] text-[#00A86B]"
                          placeholder=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Wrong Marks */}
                <FormField
                  control={form.control}
                  name="wMark"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          label="Your Name"
                          floatingLabel="Wrong"
                          value={field.value ? String(field.value) : ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, '');
                            field.onChange(value);
                          }}
                          borderColor="border-[#FF4747] text-[#FF4747]"
                          placeholder=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Left Marks */}
                <FormField
                  control={form.control}
                  name="lMark"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          label="Your Name"
                          floatingLabel="Left"
                          value={field.value ? String(field.value) : ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, '');
                            field.onChange(value);
                          }}
                          borderColor="border-[#FFA126] text-[#FFA126]"
                          placeholder=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {isExceeding && (
                <div className="mt-5 flex items-center gap-2">
                  <InfoIcon className="rotate-180 text-[#E31717]" />
                  <h3 className="m-0 text-[#E31717]">Total section marks exceed the total exam marks.</h3>
                </div>
              )}

              {isQuestionCountLess && (
                <div className="mt-5 flex items-center gap-2">
                  <InfoIcon className="rotate-180 text-[#E31717]" />
                  <h3 className="m-0 text-[#E31717]">Please delete some questions and try again.</h3>
                </div>
              )}
            </div>
          </div>
          {/* Submit Button */}
          <div className={`relative ${isExceeding || isQuestionCountLess ? 'pointer-events-none' : ''}`}>
            {isExceeding || (isQuestionCountLess && <div className="absolute inset-0 z-10 bg-white/30"></div>)}
            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                size="default"
                variant="default"
                color="primary"
                data-testid="testtype-submit-btn"
                className="h-auto py-2"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {type === FormType.EDIT ? FormType.UPDATE : FormType.ADD}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </MainDialog>
  );
};

export default SectionFormModal;

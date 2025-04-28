'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ButtonNames, DialogTitle, FormFields, FormType, TosterMessages } from '@/types/enum';
import { MainDialog } from '@/components/common/MainDialog';
import { useDispatch, useSelector } from '@/store';
import { type CreateTestFormData, createTestSchema } from '@/schemas/admin/academic/create-test-schema';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import SelectDropdown from '@/components/common/Select';
import { getStandards, getStreams, getTesttype } from '@/store/slice/admin/academic';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/common/MultiSelect';
import { getPackages, getStandardSelectors } from '@/store/slice/admin/selectors';
import { createTest, updateTest } from '@/utils/api/examination';
import { toast } from 'sonner';
import { LucideLoader } from '@/components/common/LucideLoader';
import type { GenericType, Standard, Testtype } from '@/types';
import { HttpStatus } from '@/types/constants';
import moment from 'moment';
import { getSectionsByExamId } from '@/store/slice/exam/sections';
import { useRouter } from 'next/navigation';

interface CreateTestModalProps {
  isOpen: boolean;
  type: FormType | null;
  onClose: () => void;
  initialData?: any | null;
  getExamsList: () => Promise<void>;
}

const CreateTestModal: React.FC<CreateTestModalProps> = ({ isOpen, type, onClose, initialData, getExamsList }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { sections } = useSelector((state) => state.examSections);
  const { streams, standards, testTypes, packages } = useSelector((state) => state.selectors);
  const { testtype, standards: stds } = useSelector((state) => state.academic);
  const [loading, setLoading] = useState<boolean>(false);
  const [testTypeData, setTestTypeData] = useState<GenericType[]>([]);
  const [standardData, setStandardData] = useState<GenericType[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [totalMarks, setTotalMarks] = useState(0);
  const [marks, setMarks] =useState(Number(initialData?.marks || 0));
  useEffect(() => {
    if (sections?.length) {
      const total = sections.reduce((sum, section) => sum + Number(section.totalMark || 0), 0);
      setTotalMarks(total);
    }
  }, [sections]);

  const action = initialData ? ButtonNames.UPDATE_TEST : ButtonNames.CREATE_TEST;
  const title = initialData && type === FormType.EDIT ? DialogTitle.EDIT_TEST : DialogTitle.CREATE_TEST;

  // Setting default values
  const defaultValues = initialData
    ? {
        id: Number(initialData.testId),
        name: initialData.name,
        allowResume: initialData.allowResume,
        allowRetake: initialData.allowRetake,
        showSyllabus: initialData.showSyllabus,
        instantResult: initialData.instantResult,
        duration: String(initialData.duration),
        packageId: initialData.packageId.split(',').map(Number),
        testTypeId: initialData.testTypeId,
        standardId: initialData.standardId,
        startTime: initialData?.startTime ? new Date(initialData.startTime).toLocaleString('sv-SE').slice(0, 16) : '',
        endTime: initialData?.endTime ? new Date(initialData.endTime).toLocaleString('sv-SE').slice(0, 16) : '',
        streamId: initialData.streamId,
        marks: String(initialData.marks)
      }
    : {
        name: '',
        allowResume: true,
        allowRetake: true,
        showSyllabus: true,
        instantResult: true,
        duration: '',
        packageId: [],
        testTypeId: 0,
        standardId: 0,
        startTime: '',
        endTime: '',
        streamId: 0,
        marks: ''
      };

  const form = useForm<CreateTestFormData>({
    resolver: zodResolver(createTestSchema({ isEdit: !!initialData, startDate: startDate })),
    defaultValues
  });

  // Handle Form Submit
  const onSubmit = async (data: CreateTestFormData) => {
    setLoading(true);

    try {
      const formData = {
        ...data,
        startTime: data.startTime ? moment(data.startTime).toISOString() : '',
        endTime: data.endTime ? moment(data.endTime).toISOString() : '',
        duration: data.duration ? Number(data.duration) : 0,
        marks: data.marks ? Number(data.marks) : 0,
        userId: 1
      };

      if (initialData) {
        // Update test logic
        const { streamId, testTypeId, standardId, ...updatedFormData } = formData;
        const res = await updateTest(initialData.testId, updatedFormData);
        if (res && res.statusCode !== HttpStatus.OK) {
          toast.error(TosterMessages.ADMIN_EXAM_UPDATE_FAIL);
          onClose();
        } else {
          toast.success(TosterMessages.ADMIN_EXAM_UPDATE_SUCCESS);
          onClose();
          getExamsList();
        }
      } else {
        // Create new test logic
        const res = await createTest(formData);
        if (res && res.statusCode !== HttpStatus.CREATED) {
          toast.error(TosterMessages.ADMIN_EXAM_CREATE_FAIL);
          onClose();
        } else {
          toast.success(TosterMessages.ADMIN_EXAM_CREATE_SUCCESS);
          router.push(`/admin/exams/${res.testId}/sections`);
          onClose();
          getExamsList();
        }
      }
    } catch (error) {
      console.log('error', error);
      toast.error(TosterMessages.ADMIN_EXAM_COMMON_ERROR);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const streamId = form.watch('streamId');

  // Stream Change Handler
  const streamChangeHandler = (item: any, field: any) => {
    field.onChange(item.id);
    if (item.id === 0) {
      setStandardData([]);
      setTestTypeData([]);
      form.setValue('testTypeId', 0);
      form.setValue('standardId', 0);
    } else {
      setStandardData(
        stds
          .filter((std: Standard) => std.is_active && std.streams.id === item.id)
          .map((std: Standard) => ({ id: std.id, name: std.name }))
      );

      setTestTypeData(
        testtype
          .filter((tt: Testtype) => tt.is_active && tt.stream_id !== null && tt.stream_id === item.id)
          .map((tt: Testtype) => ({ id: tt.id, name: tt.test_type_list.name }))
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const actions = [
        dispatch(getStandardSelectors()),
        dispatch(getStreams()),
        dispatch(getTesttype()),
        dispatch(getPackages()),
        dispatch(getStandards())
      ];

      await Promise.all(actions);
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    setTestTypeData(testTypes);
    setStandardData(standards);
  }, [testTypes, standards]);

  useEffect(() => {
    if (initialData && initialData.testId) dispatch(getSectionsByExamId(initialData.testId));
  }, [initialData]);

  useEffect(() => {
    if (form.getValues('startTime')) setStartDate(new Date(form.getValues('startTime')));
  }, [form.getValues('startTime')]);

  const isMarkExceeding = totalMarks > marks;
  return (
    <MainDialog isOpen={isOpen} onOpenChange={onClose} title={title} size="md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="streamId"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>
                          <Label htmlFor="streamId" className="text-sm font-medium">
                            {FormFields.STREAM}
                            <span className="text-red-500">*</span>
                          </Label>
                        </FormLabel>
                        <FormControl>
                          <SelectDropdown
                            data={[{ id: 0, name: 'Select Stream' }, ...streams]}
                            onChange={(item) => streamChangeHandler(item, field)}
                            placeholder="Select Stream"
                            value={streams?.find((item) => item.id === field.value) || null}
                            name="stream-selector"
                            width="w-full"
                            size="md"
                            disabled={type === FormType.EDIT || loading}
                            placeholderColor="text-[#4B4B4B]"
                            primaryIcon={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="testTypeId"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>
                          <Label htmlFor="testType" className="text-sm font-medium">
                            {FormFields.SUB_TEST}
                            <span className="text-red-500">*</span>
                          </Label>
                        </FormLabel>
                        <FormControl>
                          <SelectDropdown
                            data={
                              streamId === 0
                                ? [{ id: 0, name: 'Select Stream First' }]
                                : [{ id: 0, name: 'Select Test Type' }, ...testTypeData]
                            }
                            onChange={(item) => field.onChange(item.id)}
                            placeholder={'Select Test Type'}
                            value={testTypeData?.find((item) => item.id === field.value) || null}
                            name="test-type-selector"
                            width="w-full"
                            size="md"
                            disabled={type === FormType.EDIT || loading}
                            placeholderColor="text-[#4B4B4B]"
                            primaryIcon={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="standardId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-B2CAgray">
                        <Label htmlFor="testType" className="text-sm font-medium">
                          {FormFields.STANDARD}
                          <span className="text-red-500">*</span>
                        </Label>
                      </FormLabel>
                      <FormControl>
                        <SelectDropdown
                          data={
                            streamId === 0
                              ? [{ id: 0, name: 'Select Stream First' }]
                              : [{ id: 0, name: 'Select Standard' }, ...standardData]
                          }
                          onChange={(item) => field.onChange(item.id)}
                          placeholder={'Select Standard'}
                          value={standardData?.find((item) => item.id === field.value) || null}
                          name="standard-selector"
                          width="w-full"
                          size="md"
                          disabled={type === FormType.EDIT || loading}
                          placeholderColor="text-[#4B4B4B]"
                          primaryIcon={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mb-3">
                      <Label htmlFor="name" className="text-sm font-medium">
                        {FormFields.Name}
                        <span className="text-red-500">*</span>
                      </Label>
                      <FormControl>
                        <Input
                          disabled={loading}
                          type="text"
                          placeholder="Enter Test Name"
                          color="secondary"
                          className="text-primary placeholder-[#4B4B4B]"
                          size="md"
                          data-test-id="test-name-input"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label htmlFor="startTime" className="text-sm font-medium">
                          {FormFields.START_TIME}
                          <span className="text-red-500">*</span>
                        </Label>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          id="startTime"
                          {...field}
                          onClick={(e) => e.currentTarget.showPicker()}
                          className={`h-11 w-full rounded-sm border-border text-sm ${field.value ? 'text-[#000080]' : 'text-[#4B4B4B]'} [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:w-6`}
                          placeholder="Select date and time"
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Label htmlFor="endTime" className="text-sm font-medium">
                          {FormFields.END_TIME}
                          <span className="text-red-500">*</span>
                        </Label>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          id="endTime"
                          {...field}
                          onClick={(e) => e.currentTarget.showPicker()}
                          className={`h-11 w-full rounded-sm border-border text-sm ${field.value ? 'text-[#000080]' : 'text-[#4B4B4B]'} [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:w-6`}
                          placeholder="Select date and time"
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="mb-3">
                      <FormLabel className="text-sm font-semibold text-B2CAgray">
                        <Label htmlFor="duration" className="text-sm font-medium">
                          {FormFields.DURATION}
                          <span className="text-red-500">*</span>
                        </Label>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Duration"
                          color="secondary"
                          className="text-primary placeholder-[#4B4B4B]"
                          size="md"
                          data-test-id="total-duration-input"
                          autoComplete="off"
                          value={field.value}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            field.onChange(value);
                          }}
                          // disabled={loading || sections?.totalQuestions > 0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="marks"
                  render={({ field }) => (
                    <FormItem className="mb-3">
                      <FormLabel className="text-sm font-semibold text-B2CAgray">
                        <Label htmlFor="marks" className="text-sm font-medium">
                          {FormFields.MARKS}
                          <span className="text-red-500">*</span>
                        </Label>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Total Marks"
                          color="secondary"
                          className="text-primary placeholder-[#4B4B4B]"
                          size="md"
                          data-test-id="total-marks-input"
                          autoComplete="off"
                          value={field.value}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            field.onChange(value);
                            const numericValue = Number(value);
                            setMarks(numericValue);
                          }}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="packageId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-B2CAgray">
                        <Label htmlFor="testType" className="text-sm font-medium">
                          {FormFields.ASSIGN_TEST_TO_PACKAGE}
                          <span className="text-red-500">*</span>
                        </Label>
                      </FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={packages}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Select Package"
                          variant="default"
                          color="secondary"
                          maxCount={1}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className={`w-full p-2 ${form.formState.errors.packageId ? 'self-center' : 'self-end'}`}>
                <div className="grid grid-cols-2 items-center gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <FormField
                    control={form.control}
                    name="allowResume"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center p-0">
                          <FormControl>
                            <Controller
                              name="allowResume"
                              control={form.control}
                              render={({ field }) => (
                                <Switch
                                  id="allow-resume-switch"
                                  checked={field.value}
                                  onCheckedChange={(checked) => field.onChange(checked)}
                                  className="data-[state=checked]:bg-Active"
                                  disabled={loading}
                                />
                              )}
                            />
                          </FormControl>
                          <FormLabel className="ml-2 text-sm font-medium">{FormFields.RESUME}</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allowRetake"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormControl>
                            <Controller
                              name="allowRetake"
                              control={form.control}
                              render={({ field }) => (
                                <Switch
                                  id="allow-retake-switch"
                                  checked={field.value}
                                  onCheckedChange={(checked) => field.onChange(checked)}
                                  className="data-[state=checked]:bg-Active"
                                  disabled={loading}
                                />
                              )}
                            />
                          </FormControl>
                          <FormLabel className="ml-2 text-sm font-medium">{FormFields.RETAKE}</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instantResult"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormControl>
                            <Controller
                              name="instantResult"
                              control={form.control}
                              render={({ field }) => (
                                <Switch
                                  id="instant-result-switch"
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked ? true : false);
                                  }}
                                  className="data-[state=checked]:bg-Active"
                                  disabled={loading}
                                />
                              )}
                            />
                          </FormControl>
                          <FormLabel className="ml-2 text-sm font-medium">{FormFields.INSTANT_RESULT}</FormLabel>
                        </div>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="showSyllabus"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <FormControl>
                            <Controller
                              name="showSyllabus"
                              control={form.control}
                              render={({ field }) => (
                                <Switch
                                  id="show-syllabus-switch"
                                  checked={field.value}
                                  onCheckedChange={(checked) => field.onChange(checked)}
                                  className="data-[state=checked]:bg-Active"
                                  disabled={loading}
                                />
                              )}
                            />
                          </FormControl>
                          <FormLabel className="ml-2 text-sm font-medium">{FormFields.SYLLABUS}</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            {initialData && isMarkExceeding && (
              <p className="mb-2 text-sm text-red-500">
                Total marks cannot be less than the assigned marks. Kindly reduce the questions in the section and try again.
              </p>
            )}
            <div className="flex justify-end">
              <Button
                type="submit"
                size="md"
                variant="default"
                color="success"
                data-testid={initialData ? 'update-test-button' : 'create-test-button'}
                disabled={loading || (initialData && isMarkExceeding)}
                area-label={initialData ? 'update-test-button' : 'create-test-button'}
                className="text-md"
              >
                {loading && <LucideLoader />}
                {action}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </MainDialog>
  );
};

export default CreateTestModal;

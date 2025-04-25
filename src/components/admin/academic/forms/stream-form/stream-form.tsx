'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { DialogTitle, FormType } from '@/types/enum';
import { toast } from 'sonner';
import { LucideLoader } from '@/components/common/LucideLoader';
import { Switch } from '@/components/ui/switch';
import FileUpload from '@/components/common/FileUpload';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormFields } from '@/types/enum';
import { TosterMessages } from '@/types/enum';
import { MainDialog } from '@/components/common/MainDialog';
import { Button } from '@/components/ui/button';
import { steamSchema, StreamFormValues } from '@/schemas/admin/academic/streamSchemas';
import { MultiSelect } from '@/components/common/MultiSelect';
import { addStream, imageUpload, updateStream } from '@/utils/api/academic';
import { HttpStatus } from '@/types/constants';
import { useDispatch, useSelector } from '@/store';
import { getStreams } from '@/store/slice/admin/academic';
import StreamsAccodian from './streams-accodian';
import { convertToString } from '@/utils';

interface StreamModal {
  isOpen: boolean;
  type: FormType | null;
  initialData: any | null;
  onClose: () => void;
}

const StreamFormModal: React.FC<StreamModal> = ({ isOpen, initialData, type = FormType.EDIT, onClose }) => {
  const dispatch = useDispatch();
  const { subjects } = useSelector((state) => state.selectors);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const action = initialData ? FormType.UPDATE : FormType.ADD;
  const isView = type === FormType.VIEW;
  const title =
    initialData && type === FormType.EDIT
      ? DialogTitle.EDIT_STREAM
      : type === FormType.ADD
        ? DialogTitle.ADD_STREAM
        : DialogTitle.STREAM;

  const initialSubjectIds =
    (initialData &&
      initialData?.stream_subjects.filter((subject: any) => subject.is_active).map((subject: any) => subject.subject_id)) ||
    [];

  //default values
  const defaultValues = initialData
    ? {
        id: initialData?.id,
        name: initialData?.name,
        description: initialData?.description,
        imageFile: initialData?.image_file,
        questionTypes: initialData?.question_types,
        totalScore: String(initialData?.total_score),
        totalDuration: String(initialData?.total_duration),
        generateTest: {
          timeSlot: initialData?.generateTest.timeSlot,
          questionSlot: initialData?.generateTest.questionSlot,
          correctMarks: String(initialData?.generateTest.correctMarks),
          wrongMarks: String(initialData?.generateTest.wrongMarks),
          leftMarks: String(initialData?.generateTest.leftMarks)
        },
        subjectIds: initialSubjectIds,
        is_active: initialData?.is_active,
        chapterWiseTest: initialData?.chapterWiseTest.map((item: any) => ({
          ...item,
          ePercentage: convertToString(item.ePercentage),
          mPercentage: convertToString(item.mPercentage),
          hPercentage: convertToString(item.hPercentage),
          totalQues: convertToString(item.totalQues),
          timePerQues: convertToString(item.timePerQues),
          acceptPercentage: convertToString(item.acceptPercentage)
        })),
        conceptWiseTest: {
          topicWiseTimePerQuestion: convertToString(initialData?.conceptWiseTest.topicWiseTimePerQuestion),
          topicWiseTotalQuestion: convertToString(initialData?.conceptWiseTest.topicWiseTotalQuestion)
        }
      }
    : {
        name: '',
        description: '',
        imageFile: '',
        questionTypes: [],
        totalScore: '',
        totalDuration: '',
        subjectIds: [],
        generateTest: {
          timeSlot: [],
          questionSlot: [],
          correctMarks: '',
          wrongMarks: '',
          leftMarks: ''
        },
        chapterWiseTest: [],
        conceptWiseTest: {
          topicWiseTimePerQuestion: '',
          topicWiseTotalQuestion: ''
        }
      };

  // useForm
  const form = useForm<StreamFormValues>({
    resolver: zodResolver(steamSchema),
    defaultValues
  });

  // Handle submit
  const onSubmit = async (data: StreamFormValues) => {
    setLoading(true);
    try {
      // Setting the image path
      let imagePath = data?.imageFile || '';
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await imageUpload(formData);
        if (response && response?.data?.path) {
          imagePath = response?.data?.path;
        } else {
          toast.error(TosterMessages.ADMIN_IMG_UPLAOD_FAIL);
          return;
        }
      }

      // Remove 'id' from payload
      const { id, ...restData } = data;

      //payload
      const payload = {
        ...restData,
        imageFile: imagePath || '',
        totalScore: Number(data.totalScore) ?? 0,
        totalDuration: Number(data.totalDuration) ?? 0,
        generateTest: {
          ...data.generateTest,
          correctMarks: Number(data.generateTest.correctMarks) ?? 0,
          wrongMarks: Number(data.generateTest.wrongMarks) ?? 0,
          leftMarks: Number(data.generateTest.leftMarks) ?? 0
        },
        conceptWiseTest: {
          topicWiseTimePerQuestion: Number(data.conceptWiseTest.topicWiseTimePerQuestion) ?? 0,
          topicWiseTotalQuestion: Number(data.conceptWiseTest.topicWiseTotalQuestion) ?? 0
        },
        chapterWiseTest: data.chapterWiseTest.map((item) => ({
          ...item,
          ...(initialData && { id: item.id ? Number(item.id) : 0 }),
          ePercentage: Number(item.ePercentage) ?? 0,
          mPercentage: Number(item.mPercentage) ?? 0,
          hPercentage: Number(item.hPercentage) ?? 0,
          totalQues: Number(item.totalQues) ?? 0,
          timePerQues: Number(item.timePerQues) ?? 0,
          acceptPercentage: Number(item.acceptPercentage) ?? 0
        }))
      };

      if (initialData) {
        //update API call
        const updateRes = await updateStream(id ?? 0,payload);
        if (updateRes?.statusCode === HttpStatus.CONFLICT) {
          toast.error(updateRes?.message || 'failed');
          return;
        }
        dispatch(getStreams());
        toast.success(TosterMessages.ADMIN_STREAM_UPDATE_SUCCESS);
      } else {
        //create API call here
        const addRes = await addStream(payload);
        if (addRes?.statusCode !== HttpStatus.CREATED) {
          toast.error(addRes?.message || 'failed');
          return;
        }
        dispatch(getStreams());
        toast.success(TosterMessages.ADMIN_STREAM_ADD_SUCCESS);
      }

      form.reset();
      onClose();
    } catch (error: any) {
      console.log('Error:', error);
      toast.error(TosterMessages.ADMIN_SUB_UPDATE_FAIL);
    } finally {
      setLoading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (file: File | null, error?: string | null) => {
    if (error) {
      setFileError(error);
      setFile(null);
    } else {
      setFileError(null);
      setFile(file);
    }
  };

  return (
    <MainDialog isOpen={isOpen} onOpenChange={onClose} size="lg0" title="" className="!pt-1">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex h-full flex-col gap-4 lg:flex-row">
            {/* Add Stream */}
            <div className={`${isView ? 'pointer-events-none' : 'pointer-events-auto'} flex basis-7/12 flex-col px-2`}>
              <div className="flex w-full">
                <h2 className="text-lg font-medium">{title}</h2>
              </div>

              <div className="grid w-full grid-cols-1 gap-4 2xl:grid-cols-3">
                {/* FileUpload Component */}
                <div className="row-span-2 flex w-full items-center justify-center sm:justify-start">
                  <FileUpload
                    multiple={true}
                    fileChange={handleFileChange}
                    width="120px"
                    height="120px"
                    image={form?.formState.defaultValues?.imageFile || initialData?.image_file}
                    iconType={initialData ? 'fluent-emoji-high-contrast:pencil' : 'bitcoin-icons:plus-filled'}
                    iconFontSize={initialData ? '15px' : '18px'}
                    showIcon={!isView}
                  />
                </div>

                {/* Form Fields */}
                <div className="col-span-full sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="mb-3">
                        <FormLabel className="text-sm font-semibold text-B2CAgray">{FormFields.STREAM}</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Enter Stream Name"
                            color="secondary"
                            className="text-primary"
                            size="md"
                            data-test-id="subject-input"
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-full sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-B2CAgray">{FormFields.DESC}</FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={loading}
                            placeholder="Enter Description"
                            color="secondary"
                            className="text-primary"
                            data-test-id="subject-description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid-cols mt-4 grid w-full gap-2">
                <FormField
                  control={form.control}
                  name="subjectIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-B2CAgray">{FormFields.SUB}</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={subjects}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Select Subject"
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

                <FormField
                  control={form.control}
                  name="questionTypes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-B2CAgray">{FormFields.QUES_TYPE}</FormLabel>
                      <MultiSelect
                        options={[
                          { id: 0, name: 'MCQ' },
                          { id: 1, name: 'Integer' }
                        ]}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        placeholder="Select Question Type"
                        variant="default"
                        color="secondary"
                        maxCount={1}
                        disabled={loading}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid-cols mt-4 grid w-full gap-2 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="totalDuration"
                    render={({ field }) => (
                      <FormItem className="mb-3">
                        <FormLabel className="text-sm font-semibold text-B2CAgray">{FormFields.TOTAL_TIME}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter Total Time"
                            color="secondary"
                            className="text-primary"
                            size="md"
                            data-test-id="total-time-input"
                            autoComplete="off"
                            value={field.value}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              field.onChange(value);
                            }}
                            disabled={loading}
                            // {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalScore"
                    render={({ field }) => (
                      <FormItem className="mb-3">
                        <FormLabel className="text-sm font-semibold text-B2CAgray">{FormFields.TOTAL_MARKS}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter Total Score"
                            color="secondary"
                            className="text-primary"
                            size="md"
                            data-test-id="total-marks-input"
                            autoComplete="off"
                            value={field.value}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              field.onChange(value);
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

              {/* Marks */}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center">
                  {/* Add other form fields here */}
                  {type === FormType.EDIT && (
                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between gap-1 !space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              aria-readonly={!field.value}
                              className="data-[state=checked]:bg-[#0F9D58]"
                            />
                          </FormControl>
                          <FormLabel className="font-normal text-B2CAgray">
                            Stream Status {field.value ? '(Active)' : '(Inactive)'}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Stream Details */}
            <div className="flex w-full flex-col justify-between">
              <div className="h-full basis-full space-y-2 bg-[#FBFBFD] px-2">
                <h1 className="text-lg font-medium text-B2CAgray">Stream Details</h1>
                <StreamsAccodian form={form} initialData={initialData} loading={loading} isView={isView} />
              </div>

              <div className="flex items-center justify-end">
                {!isView && (
                  <Button
                    type="submit"
                    size="md"
                    variant="default"
                    color="primary"
                    className="gap-1 !px-10 text-sm"
                    disabled={!!fileError || loading}
                    data-testid={initialData ? 'update-subject-button' : 'add-subject-button'}
                  >
                    {loading && <LucideLoader />}
                    {action}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </MainDialog>
  );
};

export default StreamFormModal;

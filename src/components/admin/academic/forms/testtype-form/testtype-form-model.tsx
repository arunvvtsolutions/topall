'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from '@/store';
import { toast } from 'sonner';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { MainDialog } from '@/components/common/MainDialog';
import FileUpload from '@/components/common/FileUpload';
import SelectDropdown from '@/components/common/Select';
import { TestFormValues, testtypeSchema } from '@/schemas/admin/academic/testtypeSchemas';
import Apipoint, { DialogTitle, FormFields, FormType, TosterMessages } from '@/types/enum';
import { GenericType, Testtype } from '@/types';
import { addTesttype, fetchTestTypeItems, imageUpload, updateTesttype } from '@/utils/api/academic';
import { getTesttype } from '@/store/slice/admin/academic';
import { HttpStatus } from '@/types/constants';

interface TestTypeModalProps {
  open: boolean;
  type: FormType | null;
  initialData?: Testtype | null;
  onClose: () => void;
  stream?: GenericType[];
  clearDropdown?: () => void;
}

const TestTypeFormModal: React.FC<TestTypeModalProps> = ({ open, stream, initialData, type = FormType.EDIT, onClose }) => {
  console.log('initialData', initialData);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [testTypeItems, setTestTypeItems] = useState<any>([]);

  const action = initialData ? FormType.UPDATE : FormType.ADD;
  const isView = type === FormType.VIEW;
  const titles =
    initialData && type === FormType.EDIT
      ? DialogTitle.EDIT_TESTTYPE
      : type === FormType.ADD
        ? DialogTitle.ADD_TESTTYPE
        : DialogTitle.TESTTYPE;

  const defaultValues = initialData
    ? {
        id: initialData?.id,
        imageUrl: initialData?.image_file ?? '',
        isActive: initialData?.is_active ?? false,
        stream: initialData?.stream_id ?? 1,
        testTypeListId: initialData?.test_type_list.id ?? 0,
        description: initialData?.description ?? ''
      }
    : {
        stream: 0,
        testTypeListId: 0,
        description: '',
        imageUrl: ''
      };

  const form = useForm<TestFormValues>({
    resolver: zodResolver(testtypeSchema),
    defaultValues
  });

  const onSubmit = async (data: TestFormValues) => {
    setLoading(true);
    try {
      let imagePath = data?.imageUrl || '';
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await imageUpload(formData);
        if (response && response?.data?.path) {
          imagePath = response.data.path;
        } else {
          toast.error(TosterMessages.ADMIN_IMG_UPLAOD_FAIL);
        }
      }

      const payload = {
        ...data,
        imageUrl: imagePath || ''
      };

      if (initialData) {
        //update API call
        const updateRes = await updateTesttype(payload);
        if (updateRes?.statusCode === HttpStatus.CONFLICT) {
          toast.error(updateRes?.message || 'failed');
          return;
        }
        dispatch(getTesttype());
        toast.success(TosterMessages.ADMIN_TESTTYPE_UPDATE_SUCCESS);
      } else {
        //create API call here
        const addRes = await addTesttype(payload);
        if (addRes?.statusCode === HttpStatus.CONFLICT) {
          toast.error(addRes?.message || 'failed');
          return;
        }
        dispatch(getTesttype());
        toast.success(TosterMessages.ADMIN_TESTYPE_ADD_SUCCESS);
      }

      form.reset();
      onClose();
    } catch (error: any) {
      console.log('Error:', error);
      toast.error(TosterMessages.ADMIN_TEST_UPDATE_FAIL);
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

  useEffect(() => {
    const getTestTypeItems = async () => {
      try {
        const response = await fetchTestTypeItems();
        if (response) setTestTypeItems(response.filter((item: any) => !['gt', 'cwt', 'conwt'].includes(item.short_name)));
      } catch (error) {
        console.log('errror', error);
        toast.error('Failed to fetch test type items');
      }
    };
    getTestTypeItems();
  }, []);

  return (
    <MainDialog title={titles} isOpen={open} onOpenChange={onClose} size="default">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-4">
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-[1fr,3fr]">
              <div className="flex w-full items-center justify-center">
                <FormItem>
                  <FormControl>
                    <FileUpload
                      multiple={true}
                      fileChange={handleFileChange}
                      width="120px"
                      height="120px"
                      image={form?.formState.defaultValues?.imageUrl || initialData?.image_file}
                      iconType={initialData ? 'fluent-emoji-high-contrast:pencil' : 'bitcoin-icons:plus-filled'}
                      iconFontSize={initialData ? '15px' : '18px'}
                      showIcon={!isView}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="stream"
                  render={({ field }) => (
                    <FormItem className="mb-2">
                      <FormLabel className="font-semibold text-B2CAgray">{FormFields.STREAM}</FormLabel>
                      <FormControl>
                        <SelectDropdown
                          name="stream"
                          onChange={(item) => field.onChange(item.id)}
                          value={stream?.find((item) => item.id === field.value) || null}
                          data={stream || []}
                          placeholder="Select Stream"
                          width="w-full"
                          text="text-[#4B4B4B]"
                          size="md"
                          placeholderColor="text-secondary"
                          disabled={loading || type === FormType.VIEW || type === FormType.EDIT}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="testTypeListId"
                  render={({ field }) => (
                    <FormItem className="mb-2">
                      <FormLabel className="font-semibold text-B2CAgray">{FormFields.TESTTYPE}</FormLabel>
                      <FormControl>
                        <SelectDropdown
                          name="stream"
                          onChange={(item) => field.onChange(item.id)}
                          value={testTypeItems?.find((item: any) => item.id === field.value) || null}
                          data={testTypeItems || []}
                          placeholder="Select Test Type"
                          width="w-full"
                          text="text-[#4B4B4B]"
                          size="md"
                          placeholderColor="text-primary"
                          disabled={loading || type === FormType.VIEW || type === FormType.EDIT}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-B2CAgray">{FormFields.DESC}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={loading || type === FormType.VIEW}
                      placeholder="Enter Description"
                      color="secondary"
                      className="text-xs text-primary"
                      data-test-id="testtype-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === FormType.EDIT && (
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between gap-1 !space-y-0">
                    <div className="flex items-center">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loading}
                          className="data-[state=checked]:bg-[#0F9D58]"
                        />
                      </FormControl>
                      <FormLabel className="ml-3 text-sm font-normal text-[#6F6F6F]">
                        Test Type Status {field.value ? '(Active)' : '(Inactive)'}
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            )}
          </div>

          {type !== FormType.VIEW && (
            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                disabled={!!fileError || loading}
                size="default"
                variant="default"
                color="primary"
                data-testid="testtype-submit-btn"
                className="h-auto py-2"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {type === FormType.EDIT ? 'Update' : 'Add'}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </MainDialog>
  );
};

export default TestTypeFormModal;

'use client';
import { API_BASE_URL } from '@/config';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { SubjectFormValues, subjectSchema } from '@/schemas/admin/academic/subjectSchemas';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import Apipoint, { FormType } from '@/types/enum';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import FileUpload from '@/components/common/FileUpload';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormFields } from '@/types/enum';
import { TosterMessages } from '@/types/enum';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getSubjects } from '@/store/slice/admin/academic';
import { useDispatch } from '@/store';
import { MainDialog } from '@/components/common/MainDialog';
import axios from 'axios';
import { addSubject, imageUpload, updateSubject } from '@/utils/api/academic';

interface SubjectModal {
  title: string;
  open: boolean;
  type: string;
  initialData: any | null;
  onClose: () => void;
}

const SubjectFormModal: React.FC<SubjectModal> = ({ open, initialData, type = FormType.EDIT, title, onClose }) => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState<boolean>(initialData?.is_active || false);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);  
  const action = initialData ? FormType.UPDATE : FormType.ADD;

  //Default Values
  const defaultValues = initialData
    ? initialData
    : {
        name: '',
        description: '',
        image: null
      };

  // useForm
  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues
  });

  // Handle submit
  const onSubmit = async (data: SubjectFormValues) => {
    try {
      setLoading(true);

      // Setting the image path
      let imagePath = initialData?.image_file || '';
      if (data.image) {
        const formData = new FormData();
        formData.append('file', data.image);
        const response = await imageUpload(formData);
        if (response) {
          imagePath = response.data.path;
        } else {
          toast.error(TosterMessages.ADMIN_IMG_UPLAOD_FAIL);
        }
      }

      // Creating a subject object for API
      const subjectData: any = {
        name: String(data.name),
        description: data.description,
        imageFile: String(imagePath)
      };

      // Managing the subject status
      if (data.is_active !== undefined) {
        subjectData.is_active = data.is_active;
      }

      // Update Subject API
      if (initialData) {
        const updateRes = await updateSubject(initialData.id, subjectData);
        if (updateRes.statusCode === 409) {
          toast.error(TosterMessages.ADMIN_SUB_NAME_CONFLICT);
        } else if (updateRes.statusCode === 200) {
          toast.success(TosterMessages.ADMIN_SUB_UPDATE_SUCCESS);
          dispatch(getSubjects());
        } else {
          toast.error(TosterMessages.ADMIN_SUB_UPDATE_FAIL);
        }

        // Add Subject API
      } else {
        const addRes = await addSubject(subjectData);
        if (addRes.statusCode === 409) {
          toast.error(TosterMessages.ADMIN_SUB_NAME_CONFLICT);
        } else if (addRes.statusCode !== 201) {
          toast.error(TosterMessages.ADMIN_SUB_ADD_FAIL);
        } else {
          toast.success(TosterMessages.ADMIN_SUB_ADD_SUCCESS);
          dispatch(getSubjects());
        }
      }
      form.reset();
    } catch (error: any) {
      console.log('Error:', error);
      toast.error(TosterMessages.ADMIN_SUB_UPDATE_FAIL);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  // Handle file input change
  const handleFileChange = async (file: File | null, error?: string | null) => {
    if (error) {
      setFileError(error);
    } else if (file) {
      form.setValue('image', file);
      setFileError(null);
    } else {
      toast.error('File is not selected');
    }
  };

  // Handle Switch Change
  const handleSwitchChange = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    form.setValue('is_active', newChecked);
  };

  return (
    <MainDialog title={title} isOpen={open} onOpenChange={onClose} size="default">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-6">
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-[1fr,3fr]">
              <div className="flex w-full items-center justify-center">
                {/* File Upload Component */}
                <FileUpload
                  multiple={true}
                  fileChange={handleFileChange}
                  width="120px"
                  height="120px"
                  image={initialData?.image_file}
                  iconType={initialData ? 'fluent-emoji-high-contrast:pencil' : 'bitcoin-icons:plus-filled'}
                  iconFontSize={initialData ? '15px' : '18px'}
                  showIcon={type !== FormType.VIEW}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mb-3">
                      <FormLabel className="text-sm font-semibold !text-[#4B4B4B]">{FormFields.SUB}</FormLabel>
                      <FormControl>
                        <Input
                          autoFocus={false}
                          readOnly={type === FormType.VIEW}
                          disabled={loading}
                          placeholder="Enter Subject Name"
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

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold !text-[#4B4B4B]">{FormFields.DESC}</FormLabel>
                      <FormControl>
                        <Textarea
                          readOnly={type === FormType.VIEW}
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

                {type === FormType.EDIT && (
                  <div className="mt-4 flex items-center">
                    <Switch
                      checked={form.getValues('is_active')}
                      onClick={handleSwitchChange}
                      className="data-[state=checked]:bg-[#0F9D58]"
                    />
                    <h4 className="ml-3 text-sm text-[#6F6F6F]">
                      {FormFields.SUB_STAT} <span>( {checked ? `${FormFields.ACTIVE}` : `${FormFields.INACTIVE}`} )</span>
                    </h4>
                  </div>
                )}
              </div>
            </div>
            {type !== FormType.VIEW && (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="default"
                  variant="default"
                  color="primary"
                  data-testid="subject-btn"
                  disabled={!!fileError || loading}
                  className="h-auto py-2"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {action}
                </Button>
              </div>
            )}
          </div>
        </form>
      </Form>
    </MainDialog>
  );
};

export default SubjectFormModal;

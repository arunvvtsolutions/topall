import Apipoint, { FormType, TosterMessages } from '@/types/enum';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { stanardSchema, StandardFormValues } from '@/schemas/admin/academic/standardSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormFields } from '@/types/enum';

import FileUpload from '@/components/common/FileUpload';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import SelectDropdown from '@/components/common/Select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { MainDialog } from '@/components/common/MainDialog';
import { createStandard, updateStandard } from '@/utils/api/academic';
import { getStandards, getSyllabusLink } from '@/store/slice/admin/academic';
import { useDispatch } from '@/store';
import { GenericType } from '@/types';

interface StandardModalProps {
  title: string;
  open: boolean;
  type: any;
  initialData?: any | null;
  onClose: () => void;
  stream?: GenericType[];
  clearDropdown?: () => void;
}

const StandardFormModal: React.FC<StandardModalProps> = ({ title, open, type, initialData, onClose, stream, clearDropdown }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [checked, setChecked] = useState<any>(initialData?.is_active || false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<GenericType>(initialData?.streams || { id: 0, value: '' });
  const [fileError, setFileError] = useState<string | null>(null);

  const action = initialData ? FormType.UPDATE : FormType.ADD;

  // Default Values
  const defaultValues = initialData
    ? {
        ...initialData,
        stream: initialData.streams?.id
      }
    : {
        is_active: false,
        stream: 0,
        name: '',
        description: '',
        image: null
      };

  // useForm
  const form = useForm<StandardFormValues>({
    resolver: zodResolver(stanardSchema),
    defaultValues
  });

  // API For Getting The Image Path
  const imageUpload = async (file: any) => {
    try {
      return await axios.post(`${API_BASE_URL}/${Apipoint.uploadImage}`, file);
    } catch (error) {
      toast.error(TosterMessages.ADMIN_IMG_UPLAOD_FAIL);
    }
  };

  // Handle Form Submit
  const onSubmit = async (data: any) => {
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

      // Creating a standard object for API
      const standardData: any = {
        name: data.name,
        description: data.description,
        imageUrl: imagePath
      };

      // Add `stream` only if it's not an update
      if (!initialData) {
        standardData.stream = data.stream;
      }

      // Managing the standard status
      if (initialData) {
        if (data.is_active !== undefined) {
          standardData.isActive = data.is_active;
        }
      }

      if (initialData) {
        const response = await updateStandard(initialData.id, standardData);
        if (response.statusCode === 409) {
          toast.error(TosterMessages.ADMIN_STD_NAME_CONFLICT);
        } else if (response.statusCode !== 200) {
          toast.error(TosterMessages.ADMIN_STD_UPDATE_FAIL);
        } else {
          toast.success(TosterMessages.ADMIN_STD_UPDATE_SUCCESS);
          dispatch(getStandards());
        }
      } else {
        const response = await createStandard(standardData);
        if (response.statusCode === 409) {
          toast.error(TosterMessages.ADMIN_STD_NAME_CONFLICT);
        } else if (response.statusCode !== 200) {
          toast.error(TosterMessages.ADMIN_STD_CREATE_FAIL);
        } else {
          toast.success(TosterMessages.ADMIN_STD_CREATE_SUCCESS);
          await dispatch(getStandards());
          await dispatch(getSyllabusLink());
        }
      }
    } catch (error: any) {
      toast.error(TosterMessages.ADMIN_COMMON_ERROR);
    } finally {
      setLoading(false);
      onClose();
      clearDropdown && clearDropdown();
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

  // Handle Dropdown Selection
  const selectionHandler = (item: any) => {
    setSelected(item);
    form.setValue('stream', item.id);
    form.trigger('stream');
  };

  const handleSwitchChange = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    form.setValue('is_active', newChecked);
  };

  return (
    <MainDialog title={title} isOpen={open} onOpenChange={onClose} size="default">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-0 sm:gap-4">
            <div className="grid w-full grid-cols-1 gap-0 sm:grid-cols-[1fr,3fr] sm:gap-4">
              <div className="flex w-full items-center justify-center">
                {/* File Upload Component */}
                <FileUpload
                  multiple={false}
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
                  name="stream"
                  render={({ field }) => (
                    <FormItem className="mb-2">
                      <FormLabel className="text-sm font-semibold !text-[#4B4B4B]">{FormFields.STREAM}</FormLabel>
                      <FormControl>
                        <SelectDropdown
                          name="stream"
                          onChange={selectionHandler}
                          value={selected}
                          data={stream || []}
                          placeholder="Select Stream"
                          width="w-full"
                          text='text-[#4B4B4B]'
                          size="md"
                          disabled={loading || type === FormType.VIEW || type === FormType.EDIT}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mb-2">
                      <FormLabel className="text-sm font-semibold !text-[#4B4B4B]">{FormFields.STANDARD}</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          readOnly={type === FormType.VIEW}
                          placeholder="Enter standard"
                          color="secondary"
                       
                          className="focus:outline-non text-primary"
                          size="md"
                          data-test-id="standard-input"
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
            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold !text-[#4B4B4B]">{FormFields.DESC}</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        readOnly={type === FormType.VIEW}
                        placeholder="Enter Description"
                        color="secondary"
                        className="text-primary"
                        data-test-id="standard-description"
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
                    disabled={loading}
                  />
                  <h4 className="ml-3 text-sm font-normal text-[#6F6F6F]">
                    {FormFields.SUB_STAT} <span>( {checked ? `${FormFields.ACTIVE}` : `${FormFields.INACTIVE}`} )</span>
                  </h4>
                </div>
              )}
            </div>
          </div>

          {type !== FormType.VIEW && (
            <div className="mt-3 flex justify-end">
              <Button
                disabled={!!fileError || loading}
                type="submit"
                size="default"
                variant="default"
                color="primary"
                data-testid="subject-btn"
                className="h-auto py-2"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {action}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </MainDialog>
  );
};

export default StandardFormModal;

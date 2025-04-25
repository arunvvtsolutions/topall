'use client';

import { MainDialog } from '@/components/common/MainDialog';
import { ButtonNames, DialogTitle, FormType, TosterMessages } from '@/types/enum';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type CarouselFormValues, carouselSchema } from './carousel-schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import ImageUpload from './image-upload';
import { MultiSelect } from '@/components/common/MultiSelect';
import { imageUpload } from '@/utils/api/academic';
import { GenericType } from '@/types';
import { createCarousel, updateCarousel } from '@/utils/api/carousels';
import { HttpStatus } from '@/types/constants';
import { useDispatch, useSelector } from '@/store';
import { getStandards } from '@/store/slice/admin/academic';
import { LucideLoader } from '@/components/common/LucideLoader';

interface FileWithPreview extends File {
  preview?: string;
}

interface CarouselFormProps {
  isOpen: boolean;
  type: FormType | null;
  initialData: any | null;
  onClose: () => void;
  stream: GenericType | null;
}
const CarouselForm: React.FC<CarouselFormProps> = ({ isOpen, initialData, type, onClose, stream }) => {
  const dispatch = useDispatch();
  const { standards } = useSelector((state) => state.academic);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const buttonName = type === FormType.ADD ? ButtonNames.CREATE_CAROUSEL : ButtonNames.EDIT_CAROUSEL;
  const title = type === FormType.ADD ? DialogTitle.CREATE_CAROUSEL : DialogTitle.EDIT_CAROUSEL;

  const defaultValues = initialData
    ? {
        ...initialData,
        desktopImage: initialData.desktopImage ? initialData.desktopImage : undefined,
        phoneImage: initialData.phoneImage ? initialData.phoneImage : undefined,
        standard: initialData.standardList ? initialData.standardList.map((item: any) => item.id) : []
      }
    : {
        title: '',
        link: '',
        description: '',
        standard: [],
        desktopImage: undefined,
        phoneImage: undefined
      };

  const filteredStandards = standards.filter((standard: any) => standard.streams.id === stream?.id);

  // Initialize the form
  const form = useForm<CarouselFormValues>({
    resolver: zodResolver(carouselSchema),
    mode: 'onTouched',
    defaultValues
  });

  // Image Remove Handler
  const removeImage = (type: 'desktop' | 'phone') => {
    const fieldName = type === 'desktop' ? 'desktopImage' : 'phoneImage';
    const currentFile = form.getValues(fieldName) as FileWithPreview | undefined;

    if (currentFile?.preview) {
      URL.revokeObjectURL(currentFile.preview);
    }

    form.setValue(fieldName, undefined);
    form.trigger(fieldName);
  };

  const onSubmit = async (data: CarouselFormValues) => {
    setLoading(true);

    try {
      // Preserve existing images if they are unchanged
      let desktopImage = initialData?.desktopImage || '';
      let phoneImage = initialData?.phoneImage || '';

      const uploadImage = async (image: File | string) => {
        if (typeof image === 'string') {
          return image;
        }

        const formData = new FormData();
        formData.append('file', image);
        try {
          const response = await imageUpload(formData);
          if (response.status !== HttpStatus.CREATED) {
            toast.error(TosterMessages.ADMIN_IMG_UPLOAD_FAIL);
          }
          return response?.data?.path || null;
        } catch (error) {
          toast.error(TosterMessages.ADMIN_IMG_UPLOAD_FAIL);
          console.log(error);
          return null;
        }
      };

      // Upload only if a new file is selected
      if (data.desktopImage instanceof File) {
        const desktopImagePath = await uploadImage(data.desktopImage);
        if (desktopImagePath) desktopImage = desktopImagePath;
      }

      if (data.phoneImage instanceof File) {
        const phoneImagePath = await uploadImage(data.phoneImage);
        if (phoneImagePath) phoneImage = phoneImagePath;
      }

      const payload = {
        title: data.title,
        link: data.link,
        description: data.description,
        standardList: data.standard,
        desktopImage,
        phoneImage,
        streamId: stream?.id
      };

      if (initialData) {
        const updated = await updateCarousel(payload, initialData.id);
        if (updated.statusCode !== HttpStatus.OK) {
          toast.error(TosterMessages.ADMIN_CAROUSEL_UPDATE_FAIL);
        } else {
          toast.success(TosterMessages.ADMIN_CAROUSEL_UPDATE_SUCCESS);
        }
      } else {
        const created = await createCarousel(payload);
        if (created.statusCode !== HttpStatus.CREATED) {
          toast.error(TosterMessages.ADMIN_CAROUSEL_CREATE_FAIL);
        } else {
          toast.success(TosterMessages.ADMIN_CAROUSEL_CREATE_SUCCESS);
        }
      }
    } catch (error) {
      toast.error(TosterMessages.ADMIN_CAROUSEL_CREATE_FAIL);
      console.log(error);
    } finally {
      form.reset();
      onClose();
    }
  };

  useEffect(() => {
    dispatch(getStandards());
  }, []);

  return (
    <MainDialog
      isOpen={isOpen}
      onOpenChange={onClose}
      title={title}
      secondaryTitle="Select and upload the files"
      image={true}
      imagePath="/images/icon/Group 2.svg"
      className="!h-full !overflow-hidden"
    >
      <ScrollArea className="pr-[5px]">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-2"
          >
            {/* Desktop Image Upload */}
            <FormField
              control={form.control}
              name="desktopImage"
              render={({ field }) => (
                <FormItem>
                  <ImageUpload
                    name="desktopImage"
                    label="Desktop Image"
                    form={form}
                    inputRef={desktopInputRef}
                    onRemove={() => removeImage('desktop')}
                    initialImage={initialData?.desktopImage}
                    disabled={loading}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Image Upload */}
            <FormField
              control={form.control}
              name="phoneImage"
              render={({ field }) => (
                <FormItem>
                  <ImageUpload
                    name="phoneImage"
                    label="Phone Image"
                    form={form}
                    inputRef={phoneInputRef}
                    onRemove={() => removeImage('phone')}
                    initialImage={initialData?.phoneImage}
                    disabled={loading}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Stream */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormItem>
                <FormLabel className="text-sm font-semibold text-[#4B4B4B]">Stream</FormLabel>
                <FormControl>
                  <Input
                    value={stream?.name}
                    size="md"
                    className="rounded-md border-[#E2E8F0] text-sm font-normal text-primary"
                    disabled={loading}
                  />
                </FormControl>
              </FormItem>

              {/* Standard Selecter */}
              <FormField
                control={form.control}
                name="standard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#4B4B4B]">Standard</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={filteredStandards.map((standard) => ({
                          name: standard.name,
                          id: standard.id
                        }))}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        placeholder="Select Stadard"
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

            {/* Title */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#4B4B4B]">Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Title"
                        {...field}
                        className="text-xs font-normal text-primary placeholder:text-xs placeholder:text-[#4B4B4B]"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Link */}
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#4B4B4B]">Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Link"
                        {...field}
                        className="text-xs font-normal text-primary placeholder:text-xs placeholder:text-[#4B4B4B]"
                        onChange={(e) => {
                          field.onChange(e);
                          form.trigger('link');
                        }}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#4B4B4B]">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter Description"
                        rows={4}
                        className="border border-borderad text-xs font-normal text-primary placeholder:text-xs placeholder:text-[#4B4B4B] focus:border-borderad focus:ring-0"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="default"
                color="primary"
                size="md"
                disabled={loading}
                className="rounded-lg text-sm font-normal"
              >
                {type === FormType.ADD && !loading ? (
                  <Plus className="mr-2 h-4 w-4" />
                ) : (
                  loading && <LucideLoader className="mr-2 h-4 w-4" />
                )}
                {buttonName}
              </Button>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </MainDialog>
  );
};

export default CarouselForm;

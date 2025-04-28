'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SubjectFormValues, subjectSchema } from '@/schemas/admin/academic/subjectSchemas';
import Button from '@/components/common/Button';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { FormType } from '@/types/enum';
import { LucideLoader } from '@/components/common/LucideLoader';

interface SubjectFormProps {
  initialData: any | null;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({ initialData }) => {
  //   const { toast } = useToast();
  const [, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // const toastMessage = initialData ? 'Product updated.' : 'Product created.';
  const action = initialData ? FormType.UPDATE : FormType.ADD;

  //default values
  const defaultValues = initialData
    ? initialData
    : {
        subject: '',
        description: '',
        image: null
      };

  //useForm
  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues
  });

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      form.setValue('image', file);
    }
  };

  //submit funtionality here
  const onSubmit = async (data: SubjectFormValues) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('subject', data.name);
      formData.append('description', data.description);

      if (data.image) {
        formData.append('image', data.image);
      }

      if (initialData) {
        //edit API call here
        // await axios.post(`/endpoint/${initialData._id}`, formData);
      } else {
        //create API call here
        // const res = await axios.post(`/endpoint/`, formData);
        // console.log('formData', formData);
        // console.log(Object.fromEntries(formData));
      }
      //   toast({
      //     variant: 'destructive',
      //     title: 'Uh oh! Something went wrong.',
      //     description: 'There was a problem with your request.'
      //   });
    } catch (error: any) {
      //   toast({
      //     variant: 'destructive',
      //     title: 'Uh oh! Something went wrong.',
      //     description: 'There was a problem with your request.'
      //   });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8 bg-background p-3">
        <div className="gap-8 md:grid md:grid-cols-2">
          <div className="space-y-2">
            <FormLabel className="font-semibold text-[#4B4B4B]">Upload Image</FormLabel>
            <input
              type="file"
              accept="image/*"
              disabled={loading}
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20"
            />
            {imagePreview && (
              <Image src={imagePreview} alt="Preview" className="mt-4 h-20 w-20 object-cover" width={100} height={100} />
            )}
          </div>

          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-[#4B4B4B]">Subject</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter Subject Name"
                      color="secondary"
                      className="text-primary"
                      size="md"
                      data-test-id="subject"
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
                  <FormLabel className="font-semibold text-[#4B4B4B]">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Enter Description Name"
                      color="secondary"
                      className="text-primary"
                      data-test-id="subject-desc"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button
          text={action}
          disabled={loading}
          startIcon={loading && <LucideLoader />}
          variant="default"
          color="primary"
          type="submit"
          size="md"
        />
      </form>
    </Form>
  );
};

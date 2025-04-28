'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { MainDialog } from '@/components/common/MainDialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import SelectDropdown from '@/components/common/Select';
import FilePreview from './file-preview';
import { formSchema, type FormValues } from './form-schema';
import FileDropArea from './file-drop-area';
import { UploadedFile } from '@/types';
import { standardData } from '../../carousel/mock-data';

// Define types
interface FileUploadProps {
  title: string;
  secondaryTitle: string;
  open: boolean;
  onClose: () => void;
}

const FileUploadModal = ({ title, secondaryTitle, open, onClose }: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileName: '',
      standard: 0,
      files: undefined
    }
  });

  // Simulate file upload progress
  const simulateUpload = (fileId: string) => {
    let interval: NodeJS.Timeout;

    interval = setInterval(() => {
      setUploadedFiles((currentFiles) => {
        const fileIndex = currentFiles.findIndex((f) => f.id === fileId);
        if (fileIndex === -1) {
          clearInterval(interval);
          return currentFiles;
        }

        const file = currentFiles[fileIndex];
        const fileSize = file.file.size;

        // Calculate a realistic chunk size (5-10% of file size)
        const chunkSize = Math.floor(Math.random() * (fileSize * 0.05)) + fileSize * 0.05;
        const newUploadedSize = Math.min(file.uploadedSize + chunkSize, fileSize);
        const newProgress = Math.floor((newUploadedSize / fileSize) * 100);

        // Check if upload is complete
        if (newProgress >= 100) {
          clearInterval(interval);
          return currentFiles.map((f) =>
            f.id === fileId ? { ...f, progress: 100, uploadedSize: fileSize, status: 'completed' } : f
          );
        }

        return currentFiles.map((f) => (f.id === fileId ? { ...f, progress: newProgress, uploadedSize: newUploadedSize } : f));
      });
    }, 100);
  };

  // Add file to state and start upload
  const addFile = (file: File) => {
    const uploadedFile: UploadedFile = {
      id: crypto.randomUUID(),
      file,
      progress: 0,
      uploadedSize: 0,
      status: 'uploading'
    };

    setUploadedFiles([uploadedFile]);
    form.setValue('files', file, { shouldValidate: true });
    form.trigger('files');

    simulateUpload(uploadedFile.id);
  };

  // Remove file
  const removeFile = () => {
    setUploadedFiles([]);
    form.setValue('files', undefined, { shouldValidate: true });
    form.setError('files', { message: 'File is required' });
  };

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    console.log('Uploaded files:', uploadedFiles);

    // Reset form and state
    form.reset();
    setUploadedFiles([]);
    onClose();
  };

  return (
    <MainDialog
      image={true}
      imagePath="/images/icon/Group 2.svg"
      title={title}
      secondaryTitle={secondaryTitle}
      isOpen={open}
      onOpenChange={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="fileName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-[#4B4B4B]">File Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter File Name"
                      {...field}
                      className="rounded-lg text-xs font-normal text-primary placeholder:text-xs placeholder:text-[#4B4B4B]"
                      size="md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="standard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-[#4B4B4B]">Standard</FormLabel>
                  <FormControl>
                    <SelectDropdown
                      name="standard"
                      onChange={(item) => field.onChange(item.id)}
                      value={standardData.find((item) => item.id === field.value) || null}
                      data={standardData || []}
                      placeholder="Select Standard"
                      size="md"
                      width="w-full"
                      fontsize="text-xs"
                      placeholderColor="text-[#4B4B4B]"
                      primaryIcon={false}
                      placeholderSize="text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="files"
              render={() => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormControl>
                    <FileDropArea uploadedFiles={uploadedFiles} addFile={addFile} acceptedFileTypes=".pdf" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-3">
              {uploadedFiles.map((file) => (
                <FilePreview key={file.id} file={file} removeFile={removeFile} />
              ))}
            </div>
          )}

          <div className="flex items-center justify-end">
            <Button
              variant="default"
              color="primary"
              type="submit"
              className="mt-4"
              disabled={uploadedFiles.some((file) => file.status === 'uploading')}
            >
              <Icon icon="hugeicons:upload-01" className="mr-2 size-5" />
              Upload File
            </Button>
          </div>
        </form>
      </Form>
    </MainDialog>
  );
};

export default FileUploadModal;

import React, { useRef, useState } from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, AlertTriangle, X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import Image from 'next/image';

interface FileWithPreview extends File {
  preview?: string;
}

interface ImageUploadProps {
  name: 'desktopImage' | 'phoneImage';
  label: string;
  form: UseFormReturn<any>;
  inputRef: React.RefObject<HTMLInputElement>;
  onRemove: () => void;
  initialImage?: string;
  disabled: boolean
}

const ImageUpload: React.FC<ImageUploadProps> = ({ name, label, form, inputRef, onRemove, initialImage, disabled }) => {
  const newFileRef = useRef<FileWithPreview | null>(null);

  // Image File Change Handler
  const handleFileChange = (file: FileWithPreview) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Invalid file type. Please upload JPEG, PNG, or WEBP.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('File size should be less than 50MB.');
      return;
    }

    file.preview = URL.createObjectURL(file);

    // Check if an image is already uploaded
    if (form.watch(name)) {
      newFileRef.current = file;
      return;
    }

    form.setValue(name, file, { shouldValidate: true });
    form.trigger(name);
  };

  // Image Input Change Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0] as FileWithPreview);
    }
  };

  // Image Upload Area Click Handler
  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  // Image Drag Over Handler
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-primary');
  };

  // Image Drag Leave Handler
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-primary');
  };

  // Image Drop Handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-primary');

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0] as FileWithPreview);
    }
  };

  const handleRemove = () => {
    form.setValue(name, undefined, { shouldValidate: true });
    onRemove();
  };

  const value = form.watch(name) as FileWithPreview | undefined;
  const previewUrl = value?.preview || initialImage || null;

  return (
    <FormItem>
      <FormLabel className="text-sm font-semibold text-[#4B4B4B]">{label}</FormLabel>
      <FormControl>
        <div
          className={`relative cursor-pointer rounded-md border border-dashed text-center transition-colors ${
            value ? 'bg-muted/50 p-2' : 'p-8 hover:bg-muted/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={value ? undefined : handleBrowseClick}
        >
          {value ? (
            <div className="flex h-full w-full flex-col items-center">
              {previewUrl ? (
                <div className="relative h-[200px] w-full overflow-hidden rounded-md">
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              ) : (
                <Upload className="mb-2 h-10 w-10 text-muted-foreground" />
              )}

              <Button
                type="button"
                variant="default"
                size="sm"
                color="destructive"
                className="mt-2 hover:bg-destructive hover:text-white"
                onClick={handleRemove}
                disabled={disabled}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Image src="/images/icon/Group 2.svg" alt="upload-icon" width={30} height={30} className="mb-1 md:mb-3" />
              <p className="text-sm font-medium text-[#292D32] md:text-base">Choose a file or drag & drop it here</p>
              <p className="mt-1 text-xs text-[#6F6F6F] md:text-sm">JPEG, PNG, WEBP up to 50MB</p>
              <Button
                variant="default"
                color="secondary"
                className="mt-2 rounded-lg border border-borderad bg-inherit text-xs font-medium text-[#6F6F6F] md:mt-5 md:text-sm"
                size="md"
                type="button"
              >
                Browse file
              </Button>
            </div>
          )}
          <input ref={inputRef} type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp" onChange={handleInputChange} />
        </div>
      </FormControl>
    </FormItem>
  );
};

export default ImageUpload;

'use client';

import { useRef } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { UploadedFile } from '@/types';
import { toast } from 'sonner';

interface FileDropAreaProps {
  uploadedFiles: UploadedFile[];
  addFile: (file: File) => void;
  acceptedFileTypes?: string;
}

const FileDropArea = ({ uploadedFiles, addFile, acceptedFileTypes = '.pdf' }: FileDropAreaProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Common file selection handler
  const handleFileSelection = (fileList: FileList) => {
    if (uploadedFiles.length > 0) {
      toast.error('Only one file is allowed. Please remove the existing file first.');
      return;
    }

    if (fileList.length === 0) return;

    const file = fileList[0];
    addFile(file);
  };

  // Handle file drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length > 0) {
      handleFileSelection(e.dataTransfer.files);
    }
  };

  // Handle file selection from input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files?.length > 0) {
      handleFileSelection(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div
      className="cursor-pointer rounded-md border-2 border-dashed p-6 text-center transition-colors hover:bg-gray-50"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
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
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept={acceptedFileTypes} />
      </div>
    </div>
  );
};

export default FileDropArea;

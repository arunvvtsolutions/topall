'use client';
import React, { useRef, useState } from 'react';
import { Input } from '../ui/input';
import { Icon } from '../ui/icon';
import Image from 'next/image';

interface FileUploadProps {
  fileChange: (file: File | null, error?: string | null) => void;
  maxFileSize?: number;
  multiple?: boolean;
  errorMessage?: string;
  successMessage?: string;
  height?: string | number;
  width?: string | number;
  iconFontSize?: string | number;
  image?: string | null;
  iconType?: any;
  showIcon?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  fileChange,
  errorMessage = 'Invalid file. Only images are allowed.',
  successMessage = 'File uploaded successfully!',
  height = '80px',
  width = '80px',
  iconFontSize = '20px',
  image = null,
  iconType = 'bitcoin-icons:plus-filled',
  maxFileSize = 2000000, 
  multiple = false,
  showIcon
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(image);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {

      if (!file.type.startsWith('image/')) {
        setError(errorMessage);
        fileChange(null, errorMessage);
        return;
      }

      // Validate file size
      if (file.size > maxFileSize) {
        setError(`File size exceeds the limit of ${maxFileSize / 1000000} MB`);
        fileChange(null, errorMessage);
        return;
      }

      setError(null); 
      fileChange(file);

      // Create a FileReader to read the selected file as a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file); 
    }
  };

  return (
    <div>
      <div
        className="relative flex cursor-pointer items-center justify-center rounded-lg border border-[rgba(16,16,16,0.2)] bg-white"
        style={{ height, width }}
        onClick={() => fileInputRef.current?.click()} 
      >
        {/* Hidden file input */}
        <Input
          type="file"
          accept="image/*" 
          disabled={!showIcon}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />

        {/* Conditional rendering: Show image if provided, else show the icon */}
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt="Subject image"
            width={500} 
            height={500} 
            className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-lg object-cover"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="absolute left-1/2 top-1/2 flex h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-xl border bg-primary">
            <Icon icon="bxs:cloud-upload" color="background" fontSize={'80px'} />
          </div>
        )}

        {showIcon && (
          <div className="absolute bottom-0 right-0 z-50 flex h-[21%] w-[21%] translate-x-1/2 translate-y-1/2 transform items-center justify-center rounded-full border border-gray-500 bg-white">
            <Icon icon={iconType} fontSize={iconFontSize} color="#0D068E" />
          </div>
        )}
      </div>

      {/* Display error message */}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FileUpload;

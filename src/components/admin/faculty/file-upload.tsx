import { Icon } from '@/components/ui/icon';
import React, { useState, DragEvent, ChangeEvent, useEffect } from 'react';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  initialImage?: string; 
  onDelete?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, initialImage , onDelete}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialImage || null); 

  useEffect(() => {
    if (initialImage) {
      setPreview(initialImage);
    }
  }, [initialImage]);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      updateFile(file);
    }
  };

  const updateFile = (file: File) => {

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed!');
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file)); 
    onFileSelect(file);
  };
  
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateFile(file);
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
    setPreview(null);
    onFileSelect(null);
    onDelete?.();
  };

  return (
    <div
    className={`relative border-dashed rounded-[0.5rem] border-2 p-4 ${
      isDragging ? 'border-blue-500' : 'border-gray-300'
    }`}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
  >
    <input type="file" onChange={handleFileSelect} style={{ display: 'none' }} id="fileInput" />
    <label htmlFor="fileInput" className="cursor-pointer">
      <div className="flex flex-col items-center justify-center">
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-md shadow-md" />
          </div>
        ) : (
          <>
            <Icon icon={'garden:upload-stroke-16'} className="w-6 h-6 mb-2" />
            <p className="text-[#292D32] text-base mb-6">Choose a file or drag & drop it here</p>
            <button
              type="button"
              className="mt-2 px-4 py-2 text-sm border bg-white text-[#6F6F6F] rounded-[0.5rem]"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              Browse file
            </button>
          </>
        )}
      </div>
    </label>
  
    {/* ✅ Delete Button at Bottom-Right */}
    {preview && (
      <button
        type="button"
        className="absolute bottom-2 right-2 flex gap-2 items-center bg-[#FF47471F] text-[#FF4747] text-sm px-2 py-1 rounded-[6px] "
        onClick={handleDelete}
      >
      <Icon icon={'material-symbols-light:delete-outline-rounded'} className='h-5 w-5'/>  Delete
      </button>
    )}
  </div>
  
  );
};

export default FileUpload;

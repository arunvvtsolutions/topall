import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { UploadedFile } from '@/types';
import { CircleX, Loader } from 'lucide-react';
import Image from 'next/image';

interface FilePreviewProps {
  file: UploadedFile;
  removeFile: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, removeFile }) => (
  <div className="rounded-md bg-[#EEF1F7] p-5">
    <div className="flex items-center gap-3">
      <div className="ml-2 flex size-10 items-center justify-center rounded-md text-xs font-medium">
        <Image src="/images/icon/pdf.svg" width={40} height={40} alt="pdf-image" className="mr-3" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="max-w-[150px] truncate text-sm font-medium text-[#222222] sm:max-w-full md:text-base">{file.file.name}</p>
          <CircleX className="size-5 cursor-pointer" onClick={removeFile} />
        </div>

        <div className="mt-1 flex items-center justify-start text-xs font-normal text-[#6F6F6F] md:text-sm">
          <span>
            {(file.uploadedSize / 1024).toFixed(1)} KB of {(file.file.size / 1024).toFixed(1)} KB •{' '}
          </span>

          <div className="ml-2 flex items-center">
            {file.status === 'uploading' ? (
              <Loader className="h-4 w-4 text-[#375EF9]" />
            ) : (
              <Icon icon="ix:success-filled" className="size-5 text-[#00A86B]" />
            )}
            <span className="ml-2 text-sm font-normal text-[#222222]">
              {file.status === 'uploading' ? 'Uploading...' : 'Completed'}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-4">
      <div className="h-1.5 w-full rounded-full bg-gray-200">
        <div
          className={cn('h-1.5 rounded-full', file.status === 'completed' ? 'bg-green-500' : 'bg-blue-500')}
          style={{ width: `${file.progress}%` }}
        ></div>
      </div>
    </div>
  </div>
);

export default FilePreview;

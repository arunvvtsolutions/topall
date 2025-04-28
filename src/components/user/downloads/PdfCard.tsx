import PdfIcon from '@/components/icons/Pdf';
import { Icon } from '@/components/ui/icon';
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DownloadsConstants } from '@/types/enum';

interface SyllabusProps {
  id: number;
  name: string;
  date: string;
  fileSize: string;
  file: string;
  description: string;
}

const PdfCard = ({ data, setPdfPreview }: { data: SyllabusProps; setPdfPreview: (show: boolean) => void }) => {
  return (
    <div className="flex items-start justify-between gap-[16px] rounded-[8px] border-[0.5px] bg-[#fff] px-[16px] py-[16px] lg:py-[24px]">
      <div className="flex gap-[17px]">
        <PdfIcon />
        <div>
          <p className="font[500] text-nowrap text-[16px] leading-[19.36px] text-[#222222]">{data.name}</p>
          <div className="mt-[4px] flex items-start justify-start gap-2 text-[14px] font-[400] leading-[16.94px] text-[#6F6F6F] sm:flex-col md:flex-row">
            <p
              title={data.date}
              className="overflow-hidden text-ellipsis whitespace-nowrap text-nowrap lg:max-w-[100px] xl:max-w-max"
            >
              {data.date}
            </p>{' '}
            <span className="flex items-center justify-start text-nowrap">
              <Icon icon="radix-icons:dot-filled" /> {data.fileSize}
            </span>
          </div>
        </div>
      </div>
      <Popover>
        <PopoverTrigger>
          <Icon icon="qlementine-icons:menu-dots-16" className="text-xl" />
        </PopoverTrigger>
        <PopoverContent align="end" className="max-w-auto w-auto p-0">
          <div
            className="flex cursor-pointer items-center justify-start gap-2 border-b-[0.5px] px-[12px] py-[8px] hover:bg-[#0D068E0A]"
            onClick={() => setPdfPreview(true)}
          >
            <Icon icon="fluent:eye-28-filled" />{' '}
            <p className="text-[12px] font-[400] leading-[22px]">{DownloadsConstants.PREVIEW}</p>
          </div>
          <div className="flex cursor-pointer items-center justify-start gap-2 border-b-[0.5px] px-[12px] py-[8px] hover:bg-[#0D068E0A]">
            <Icon icon="material-symbols-light:download" />{' '}
            <p className="text-[12px] font-[400] leading-[22px]">{DownloadsConstants.DOWNLOADS}</p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PdfCard;

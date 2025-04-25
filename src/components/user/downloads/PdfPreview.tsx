import { MainSheet } from '@/components/common/MainSheet';
import PdfIcon from '@/components/icons/Pdf';
import { Icon } from '@/components/ui/icon';
import { DownloadsConstants } from '@/types/enum';
import React, { useEffect, useState } from 'react';

const PdfPreview = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <MainSheet
      open
      setOpen={setOpen}
      side={isMobile ? 'bottom' : 'right'}
      title={
        <div className="flex w-full items-center justify-start border-b pb-[24px] lg:justify-center">
          <span className="flex items-center justify-center gap-2 text-center text-[16px] font-[500] leading-[29.04px] text-[#222222]">
            <Icon
              width="24px"
              height="24px"
              icon="proicons:folder"
              color="#222222"
              fontSize=""
              className="h-[24px] w-[24px] text-[24px]"
            />
            {DownloadsConstants.FILE_PREVIEW}
          </span>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center overflow-y-auto pb-[12px] lg:pb-[24px]">
        <div className="flex w-full flex-col items-center justify-center border-b py-[24px] lg:py-[64px]">
          <PdfIcon width="70" height="70" />
          <p className="mt-[32px] text-[16px] font-[500] leading-[19.36px] lg:mt-[64px]">NEET Syllabus for the year 2025</p>
          <p className="mt-[10px] flex items-center justify-start gap-2 text-nowrap text-[14px] font-[400] leading-[16.94px] text-[#6F6F6F]">
            11-01-2025 9:00 PM{' '}
            <span className="flex items-center justify-start text-nowrap">
              <Icon icon="radix-icons:dot-filled" /> 163 Kb
            </span>
          </p>
        </div>
        <div className="flex flex-col items-start justify-center border-b py-[16px] lg:py-[32px]">
          <h3 className="text-[14px] font-[500] leading-[16.94px] text-[#000]">File Description</h3>
          <p className="mt-[12px] text-[12px] font-[400] text-[#6F6F6F] lg:mt-[24px]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum recusandae ipsa ipsum earum temporibus? Fugit qui
            molestias repudiandae quibusdam laudantium quidem vitae. Aliquid inventore officia eos repellendus distinctio amet
            esse. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum, commodi. Saepe amet soluta vel quibusdam
            doloribus esse debitis molestiae mollitia, placeat voluptatem, quam omnis eligendi corporis ipsam error, ducimus
            vitae.
          </p>
        </div>
        <button className="mt-[12px] flex w-full items-center justify-center rounded-[8px] border-[1px] border-[#10101026] border-[solid] py-[6px] lg:mt-[24px]">
          <Icon icon="material-symbols-light:download" /> <p className="text-[14px] font-[400] leading-[22px]">Download</p>
        </button>
      </div>
    </MainSheet>
  );
};

export default PdfPreview;

'use client';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import React, { useEffect, useRef, useState } from 'react';
import StackedAvatar from './stack-avatar';
import DotProgressBar from './dot-progress';
import { Copy } from 'lucide-react';
import { ReferAndEarnTitles, TosterMessages } from '@/types/enum';
import { toast } from 'sonner';
import { useSelector } from '@/store';
import { fetchStudentReferralInfo } from '@/utils/api/user/refer-and-earn';
import { API_BASE_URL, SHARABLE_URL } from '@/config';
import { calculateDaysLeft } from '@/utils/date-formatter';

type StudentReferralInfo = {
  studentId: number;
  referalCode: string;
  referralLevel: number;
  referralUsed: number;
  expiryDays: number | null;
};

const users = [
  { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
  { src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2' },
  { src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' },
  { src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1' }
];

const steps = [
  { label: ReferAndEarnTitles.REFER_MESSAGE, completed: true },
  { label: ReferAndEarnTitles.REFER_MESSAGE2, completed: true },
  { label: ReferAndEarnTitles.REFER_MESSAGE3, completed: false }
];
const ReferAndEarn = () => {
  const studentId = useSelector((state) => state.user.userId);
  // console.log('id', studentId);
  const [referralCode, setReferralCode] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [studentInfo, setStudentInfo] = useState<StudentReferralInfo | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      toast.success('Copied to clipboard!');
    }
  };

  const getStudentReferralInfo = async () => {
    try {
      const response = await fetchStudentReferralInfo(studentId!);
      setStudentInfo(response);
      setReferralCode(response.referalCode);
    } catch (error) {
      console.log('error', error);
      toast.error(TosterMessages.ADMIN_COMMON_ERROR);
    }
  };

  useEffect(() => {
    if (studentId) {
      setIsReady(true);
    }
  }, [studentId]);

  useEffect(() => {
    if (isReady) {
      getStudentReferralInfo();
    }
  }, [isReady]);

  const handleShare = (platform: string) => {
    const referralUrl = `${SHARABLE_URL}`;
    const message = `Hey! Use my referral code to get free tests to practice on TopAll. \n\nUse my CODE: ${referralCode} \n\nSignup on TopAll using this link: ${referralUrl}?ref=${referralCode} \n\nRedeem here: ${referralUrl}?ref=${referralCode}`;

    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        break;

      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`;
        break;

      case 'gmail':
        shareUrl = `mailto:?subject=Join%20Now%20Using%20My%20Referral%20Code!&body=${encodeURIComponent(message)}`;
        break;

      case 'instagram':
        toast.info('Instagram does not support direct URL sharing. Copy the link and share manually.');
        return;

      default:
        return;
    }

    window.open(shareUrl, '_blank');
  };

  return (
    <div className="rounded-[1rem] border bg-white p-5 md:p-14">
      <div className="flex flex-col border-b pb-4 md:flex-row md:justify-between md:pb-8">
        <div className="mb-2 md:mb-0">
          <h2 className="mb:2 text-center text-2xl font-semibold text-B2CAgrayn md:mb-4 md:text-[40px]">
            {String(studentInfo?.referralLevel || 0).padStart(2, '0')}
          </h2>
          <h3 className="text-center text-sm font-semibold text-B2Cgray md:text-center md:text-[1rem]">
            {ReferAndEarnTitles.REFERRAL_LEVEL}
          </h3>
        </div>
        <div className="mb-2 md:mb-0">
          <h2 className="mb:2 text-center text-2xl font-semibold text-B2CAgrayn md:mb-4 md:text-[40px]">
            {String(studentInfo?.referralUsed || 0).padStart(2, '0')}
          </h2>
          <h3 className="text-center text-sm font-semibold text-B2Cgray md:text-center md:text-[1rem]">
            {ReferAndEarnTitles.REFERRAL_USED}
          </h3>
        </div>
        <div className="mb-2 md:mb-0">
          <h2 className="mb:2 text-center text-2xl font-semibold text-B2CAgrayn md:mb-4 md:text-[40px]">
            {calculateDaysLeft(studentInfo?.expiryDays)}
          </h2>
          <h3 className="text-center text-sm font-semibold text-B2Cgray md:text-center md:text-[1rem]">
            {ReferAndEarnTitles.BENEFITED_DAYS}
          </h3>
        </div>
      </div>
      <div className="mt-4 md:mt-12">
        <h2 className="mb-2 text-xl font-semibold text-B2CAgrayn md:mb-4 md:text-[1.5rem]">{ReferAndEarnTitles.REFER_EARN}</h2>
        <h4 className="mb-4 max-w-[970px] text-sm text-B2Cgray md:mb-8 md:text-[1rem]">{ReferAndEarnTitles.REFER_DISCRIPTION}</h4>
        <div className="relative mb-3 h-[300px] overflow-hidden rounded-[8px] bg-[#E8F4C7] p-4 md:mb-6 md:p-8">
          <div className="z-15 mb-3 md:mb-8">
            <StackedAvatar avatars={users} size={40} overlapX={8} />
          </div>

          <DotProgressBar steps={steps} />
          {/* Second Circle */}
          <div className="absolute bottom-0 right-0 z-10 h-0 w-[367px] translate-x-1/2 rounded-full bg-[#C0CD9E] md:bottom-[50px] md:h-[367px]"></div>
          {/* First Circle */}
          <div className="absolute right-10 top-0 h-0 w-[428px] translate-x-1/2 rounded-full bg-[#D8E4B7] md:-top-[130px] md:h-[428px]"></div>
        </div>

        <div className="mb-3 md:mb-6">
          <h2 className="mb-2 text-sm text-B2Cgray md:mb-4 md:text-base">{ReferAndEarnTitles.REFERRAL_LINK}</h2>
          <div className="relative w-full">
            {/* Input Field */}
            <Input
              ref={inputRef}
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              autoComplete="off"
              placeholder="Referral Link"
              className="h-11 pr-12 text-base text-[#6F6F6F]"
              readOnly
            />

            {/* Copy Icon */}
            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <Icon icon="bxs:copy" />
            </button>
          </div>
        </div>
        <h2 className="mb-2 text-sm text-B2Cgray md:mb-4 md:text-base">{ReferAndEarnTitles.SOCIAL_MEDIA}</h2>
        <div className="flex flex-row gap-2 md:flex-row md:gap-6">
          <Button
            className="h-11 gap-3 bg-[#25D366] text-base text-white hover:bg-[#1da851]"
            onClick={() => handleShare('whatsapp')}
          >
            <span className="md:mr-1">
              <Icon icon="ic:outline-whatsapp" className="text-2xl text-white" />
            </span>
            <span className="hidden md:block">{ReferAndEarnTitles.WHATSAPP}</span>
          </Button>
          <Button
            className="h-11 gap-3 bg-[#0866FF] text-base text-white transition-colors duration-200 hover:bg-[#0654dc]"
            onClick={() => handleShare('facebook')}
          >
            <span className="md:mr-1">
              <Icon icon="ic:twotone-facebook" className="text-2xl text-white" />
            </span>
            <span className="hidden md:block">{ReferAndEarnTitles.FACEBOOK}</span>
          </Button>

          {/* <div
            className="relative inline-block rounded-lg bg-gradient-to-r from-[#FEBA1D] via-[#F2010A] to-[#B901B4] p-[2px]"
            onClick={() => handleShare('instagram')}
          >
            <Button className="relative h-full w-full rounded-md p-2 text-base text-black">
              <span className="md:pr-5">
                <Icon icon="skill-icons:instagram" className="text-2xl text-white" />
              </span>
              <span className="hidden md:block">{ReferAndEarnTitles.INSTAGRAM}</span>
            </Button>
          </div> */}
          <Button
            className="h-11 gap-3 bg-B2CAgrayn text-base text-white transition-colors duration-200 hover:bg-gray-600"
            onClick={() => handleShare('gmail')}
          >
            <span className="md:mr-1">
              <Icon icon="skill-icons:gmail-dark" className="text-2xl text-white" />
            </span>
            <span className="hidden md:block">{ReferAndEarnTitles.GMAIL}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReferAndEarn;

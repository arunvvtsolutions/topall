import React from 'react';
import FooterContent from './footer-content';
// import { Link } from "@/components/navigation"
import Image from 'next/image';
import { Icon } from '@/components/ui/icon';
import Link from 'next/link';

const Footer = async () => {
  return (
    <FooterContent>
      <div className="hidden justify-between text-default-600 md:flex">
        <div className="text-center text-sm ltr:md:text-start rtl:md:text-right">
          COPYRIGHT &copy; {new Date().getFullYear()} DashCode, All rights Reserved
        </div>
        <div className="text-center text-sm ltr:md:text-right rtl:md:text-end">
          Hand-crafted & Made by{' '}
          <a href="https://codeshaper.net" target="_blank" className="font-semibold text-primary">
            Codeshaper
          </a>
        </div>
      </div>
      <div className="flex items-center justify-around md:hidden">
        <Link href="/app/chat" className="text-default-600">
          <div>
            <span className="relative mb-1 flex cursor-pointer flex-col items-center justify-center rounded-full text-[20px]">
              <Icon icon="heroicons-outline:mail" />
              <span className="absolute -top-2 right-[5px] z-[99] flex h-4 w-4 flex-col items-center justify-center rounded-full bg-red-500 text-[8px] font-semibold text-white lg:top-0">
                10
              </span>
            </span>
            <span className="block text-xs text-default-600">Messages</span>
          </div>
        </Link>
        <Link
          href="profile"
          className="footer-bg relative z-[-1] -mt-[40px] flex h-[65px] w-[65px] items-center justify-center rounded-full bg-card bg-no-repeat backdrop-blur-[40px] backdrop-filter dark:bg-default-300"
        >
          <div className="custom-dropshadow relative left-[0px] top-[0px] h-[50px] w-[50px] rounded-full">
            <Image
              src="/images/avatar/av-1.jpg"
              alt="dashcode"
              width={50}
              height={50}
              className="h-full w-full rounded-full border-2"
            />
          </div>
        </Link>
        <Link href="notifications">
          <div>
            <span className="relative mb-1 flex cursor-pointer flex-col items-center justify-center rounded-full text-[20px]">
              <Icon icon="heroicons-outline:bell" />
              <span className="absolute -top-2 right-[17px] z-[99] flex h-4 w-4 flex-col items-center justify-center rounded-full bg-red-500 text-[8px] font-semibold text-white lg:top-0">
                2
              </span>
            </span>
            <span className="block text-xs text-default-600">Notifications</span>
          </div>
        </Link>
      </div>
    </FooterContent>
  );
};

export default Footer;

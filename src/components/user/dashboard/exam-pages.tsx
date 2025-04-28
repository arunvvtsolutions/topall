'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '@/store';
import { getTestTypeByStreamId } from '@/store/slice/user/testType';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { links } from './utils';



const ExamLinkPages = () => {
  const dispatch = useDispatch();
  const { stream } = useSelector((state) => state.stream);
  const { testTypes } = useSelector((state) => state.testTypes);

  useEffect(() => {
    if (stream?.id) {
      dispatch(getTestTypeByStreamId(stream.id));
    }
  }, [stream?.id]);

  const matchedLinks = links.filter((link) => testTypes?.some((type) => type?.test_type_list?.short_name === link.short_name));

  return (
    <div>
      <h3 className="mb-4 text-base font-medium text-B2CAgrayn lg:text-xl">Activities</h3>

      <div className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent flex gap-5 overflow-x-auto pb-2">
        {matchedLinks.map((link) => (
          <Link key={link.href} href={link.href} passHref>
            <Card className="flex size-full min-w-[300px] max-w-xs flex-col items-center border border-borderad py-4 shadow-none">
              <CardContent className="mb-2 flex flex-col items-center gap-2 px-4 py-0 lg:flex-row">
                <div className="self-center justify-self-center">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary lg:size-12">
                    <img src={`/images/icon/sidebar-icons/outline/${link.icon}`} alt={link.label} className="size-6 lg:size-8" />
                  </div>
                </div>
                <div className="basis-full space-y-1 text-center lg:text-left">
                  <h3 className="text-sm font-medium capitalize text-B2CAgrayn lg:text-base">{link.label}</h3>
                  <p className="text-xs font-normal text-B2Cgray lg:text-sm">{link.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExamLinkPages;

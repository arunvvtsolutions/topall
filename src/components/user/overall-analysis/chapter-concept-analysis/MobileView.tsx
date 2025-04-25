import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Icon } from '@/components/ui/icon';
import React, { Fragment, useState } from 'react';
import { AnsweredTypes } from '@/types/enum';
import { getTextColor } from '../utils';

const MobileView = ({ subject }: any) => {
  const [expand, setExpand] = useState<string | null>(null);
  return (
    <div className="w-full md:hidden">
      <h3 className="my-[24px] text-center text-[16px] font-[600] leading-[19px]">
        `${subject.subject} Chapter Wise & Concept Wise Analysis`
      </h3>
      <div className="w-full">
        <Accordion type="single" collapsible className="w-full">
          {subject?.chapters?.map((row: any, index: any) => {
            return (
              <AccordionItem value={`${index}`} key={index}>
                <AccordionTrigger
                  className="flex flex-col px-[16px] pb-[17px] pt-[24px]"
                  onClick={() => setExpand(expand === row.chapterId ? null : row.chapterId)}
                >
                  <div className="flex w-full items-center justify-between">
                    <h5 className="text-[12px] font-[600] leading-[14.52px]">
                      {index + 1}. {row.chapterName}
                    </h5>{' '}
                    <Icon
                      icon="eva:arrow-down-fill"
                      color="#000080"
                      className={`transform transition-transform duration-300 ease-in-out ${expand === index ? 'rotate-180' : ''}`}
                    />
                  </div>
                  <div className="mt-[16px] grid w-full grid-cols-4 flex-nowrap justify-between gap-1">
                    <div className="">
                      <p className="text-[12px] font-[500] leading-[14.52px] text-[#5F6365]">Correct</p>
                      <p className={`${getTextColor(AnsweredTypes.CORRECT)} mt-[8px] text-[14px] font-[600]`}>
                        {row.correctQues.length}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-[12px] font-[500] leading-[14.52px] text-[#5F6365]">Wrong</p>
                      <p className={`${getTextColor(AnsweredTypes.WRONG)} mt-[8px] text-[14px] font-[600]`}>
                        {row.wrongQues.length}
                      </p>
                    </div>{' '}
                    <div className="">
                      <p className="text-[12px] font-[500] leading-[14.52px] text-[#5F6365]">Left</p>
                      <p className={`${getTextColor(AnsweredTypes.LEFT)} mt-[8px] text-[14px] font-[600]`}>
                        {row.leftQues.length}
                      </p>
                    </div>{' '}
                    <div className="">
                      <p className="text-[12px] font-[500] leading-[14.52px] text-[#5F6365]">Percentage</p>
                      <p className={`${getTextColor('average')} mt-[8px] text-[14px] font-[600]`}>{Math.round(row.average)}%</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2 p-[16px]">
                  {row.topics.map((t: any, i: number) => {
                    return (
                      <Fragment key={`topics-${i}`}>
                        <div className="flex w-full items-center justify-between">
                          <h5 className="text-[12px] font-[600] leading-[14.52px] text-[#303030]">
                            {index! + 1}.{i + 1}. {t.topic}
                          </h5>
                        </div>
                        <div className="mt-[8px] grid w-full grid-cols-4 flex-nowrap justify-between gap-1">
                          <div className="flex w-full items-center justify-center">
                            <p className={`${getTextColor(AnsweredTypes.CORRECT)} mt-[3px] text-[14px] font-[600]`}>
                              {t.correctQues.length}
                            </p>
                          </div>
                          <div className="flex w-full items-center justify-center">
                            <p className={`${getTextColor(AnsweredTypes.WRONG)} mt-[3px] text-[14px] font-[600]`}>
                              {t.wrongQues.length}
                            </p>
                          </div>{' '}
                          <div className="flex w-full items-center justify-center">
                            <p className={`${getTextColor(AnsweredTypes.LEFT)} mt-[3px] text-[14px] font-[600]`}>
                              {t.leftQues.length}
                            </p>
                          </div>{' '}
                          <div className="flex w-full items-center justify-center">
                            <p className={`${getTextColor('average')} mt-[3px] text-[14px] font-[600]`}>
                              {Math.round(t.average)}%
                            </p>
                          </div>
                        </div>
                      </Fragment>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};

export default MobileView;

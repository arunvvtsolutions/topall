'use client';

import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import ChapterIcon from './chapter-icon';
import { ReusableProgressBar } from '@/components/common/indicator-progress';

type Topic = {
  topicName: string;
  updatedMarkPercentage: number;
  topicId: number;
  topicQuesCount: number;
};

type Chapter = {
  chapterId: number;
  chapterName: string;
  topics: Topic[];
};

type AccordionComponentProps = {
  chapters: Chapter[];
  onStart: (topicId: number, chapterId: number, topicQuesCount: number) => void;
  isTopicLoading: number | null;
};

const ChapterAccordion: React.FC<AccordionComponentProps> = ({ chapters, onStart, isTopicLoading }) => {
  const defaultOpenAccordion = chapters[0]?.chapterName;

  return (
    <Accordion type="single" collapsible defaultValue={defaultOpenAccordion}>
      {chapters.map((chapter) => (
        <AccordionItem key={chapter.chapterName} value={chapter.chapterName} className="bg-white">
          <AccordionTrigger className="h-[2.5rem] px-[1rem] py-0 md:h-[3.5rem] md:px-[1.5rem]">
            {/* <div className="flex w-full items-center justify-between"> */}
            <h4 className="text-base font-normal text-B2Cgray md:text-[1.25rem]">
              {chapter.chapterName.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}
            </h4>
            {/* ✅ Icon rotates when accordion is open */}
            <Icon
              icon="uiw:down"
              className="text-[#6F6F6F] transition-transform duration-200 data-[state=open]:rotate-180 sm:text-[18px]"
            />
            {/* </div> */}
          </AccordionTrigger>
          <AccordionContent className="max-h-[17.1875rem] overflow-y-auto bg-white pb-4 pl-4 pr-3 md:pb-6 md:pl-6 [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-thumb]:bg-[#00A86B] dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-[#F2F2F2] dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-1">
            <div className="grid grid-cols-1 gap-5 border-t pt-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {chapter.topics.map((topic, index) => (
                <Card key={index} className="w-full rounded-md border sm:w-auto">
                  <CardHeader className="p-3 pb-1 pt-1.5 md:p-4 md:pb-1.5 md:pt-2.5">
                    <CardTitle className="flex items-center space-x-2 text-base font-medium">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0000800A] md:h-10 md:w-10">
                        <ChapterIcon />
                      </div>
                      <span className="text-sm font-normal capitalize text-B2CAgrayn md:text-base">
                        {topic.topicName.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pb-4 pt-0 md:pb-6">
                    <div className="flex items-center justify-between">
                      <ReusableProgressBar
                        value={topic.updatedMarkPercentage}
                        showValue={true}
                        isStripe={false}
                        isAnimate={true}
                      />
                      <Button
                        color="success"
                        className="ml-2 flex h-auto max-w-[6.25rem] items-center justify-between rounded-[0.5rem] !px-2 py-1 text-xs font-medium md:!px-3 md:py-1.5 md:text-sm"
                        onClick={() => onStart(topic.topicId, chapter.chapterId, topic.topicQuesCount)}
                        disabled={isTopicLoading === topic.topicId}
                      >
                        {isTopicLoading === topic.topicId ? 'Starting...' : 'Start Test'}
                        <span className="ml-1">
                          <Icon icon="oui:arrow-right" className="text-white" />
                        </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ChapterAccordion;

'use client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AnsweredTypes } from '@/types/enum';
import React, { Fragment, useMemo, useState } from 'react';
import BreadCrumb, { BreadCrumbType } from '@/components/common/breadcrumb';
import { getTextColor } from '../utils';

const tableTitles = ['S.No', 'CHAPTER NAME', 'CORRECT', 'WRONG', 'LEFT', 'AVERAGE %', ''];

const DesktopView = ({ subject }: any) => {
  const [expand, setExpand] = useState<string | null>(null); // Store expanded row's chapterId

  const breadcrumbItems = useMemo<BreadCrumbType[]>(() => {
    if (!subject?.subject) return [];

    return [
      { title: 'Overall Analysis', link: '/overall-analysis' },
      { title: `${subject.subject} Chapter Wise & Concept Wise Analysis`, link: '' }
    ];
  }, [subject?.subject]);

  return (
    <div className="hidden h-full md:block">
      <div className="p-5">{breadcrumbItems.length > 0 && <BreadCrumb items={breadcrumbItems} title="" />}</div>
      <div className="grid h-full grid-cols-1 gap-4">
        <Card className="w-full rounded-[14px] border !p-0 shadow-sm">
          <CardContent className="!p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {tableTitles.map((title, index) => (
                    <TableHead
                      key={index}
                      className={`${getTextColor(title)} text-[12px] font-[600] leading-[18px] ${title === 'CHAPTER NAME' ? 'text-left !font-[500]' : `text-center`}`}
                    >
                      {title}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {subject?.chapters?.map((row: any, index: number) => (
                  <Fragment key={row.chapterId}>
                    {/* Main Chapter Row */}
                    <TableRow
                      className="cursor-pointer"
                      onClick={() => setExpand(expand === row.chapterId ? null : row.chapterId)}
                    >
                      <TableCell className="text-center text-[14px] font-[400] leading-[20px]">{index + 1}</TableCell>
                      <TableCell className="max-w-[250px] text-[14px] font-[400] leading-[20px]">{row.chapter}</TableCell>
                      <TableCell
                        className={`text-center text-[14px] font-[600] leading-[20px] underline ${getTextColor(AnsweredTypes.CORRECT)}`}
                      >
                        {row.correctQues.length}
                      </TableCell>
                      <TableCell
                        className={`text-center text-[14px] font-[600] leading-[20px] underline ${getTextColor(AnsweredTypes.WRONG)}`}
                      >
                        {row.wrongQues.length}
                      </TableCell>
                      <TableCell
                        className={`text-center text-[14px] font-[600] leading-[20px] underline ${getTextColor(AnsweredTypes.LEFT)}`}
                      >
                        {row.leftQues.length}
                      </TableCell>
                      <TableCell
                        className={`text-center text-[14px] font-[600] leading-[20px] underline ${getTextColor('AVERAGE')}`}
                      >
                        {Math.round(row.average)}%
                      </TableCell>
                      <TableCell>
                        <Icon
                          className={`transform transition-transform duration-300 ease-in-out ${expand === row.chapterId ? 'rotate-180' : ''}`}
                          icon="oui:arrow-down"
                          color="#0D068E"
                        />
                      </TableCell>
                    </TableRow>

                    {/* Expanded Topics Row */}
                    {row.topics.map((t: any, i: number) => (
                      <TableRow
                        key={`topics-${t.topicId}`}
                        className={`bg-[#0000800A] ${expand === row.chapterId ? '' : 'hidden'}`}
                      >
                        <TableCell className="text-center text-[14px] font-[400] leading-[20px]">
                          {index + 1}.{i + 1}
                        </TableCell>
                        <TableCell className="max-w-[250px] text-[14px] font-[400] leading-[20px]">{t.topic}</TableCell>
                        <TableCell
                          className={`text-center text-[14px] font-[600] leading-[20px] underline ${getTextColor(AnsweredTypes.CORRECT)}`}
                        >
                          {t.correctQues.length}
                        </TableCell>
                        <TableCell
                          className={`text-center text-[14px] font-[600] leading-[20px] underline ${getTextColor(AnsweredTypes.WRONG)}`}
                        >
                          {t.wrongQues.length}
                        </TableCell>
                        <TableCell
                          className={`text-center text-[14px] font-[600] leading-[20px] underline ${getTextColor(AnsweredTypes.LEFT)}`}
                        >
                          {t.leftQues.length}
                        </TableCell>
                        <TableCell
                          className={`text-center text-[14px] font-[600] leading-[20px] underline ${getTextColor('AVERAGE')}`}
                        >
                          {Math.round(t.average)}%
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ))}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DesktopView;

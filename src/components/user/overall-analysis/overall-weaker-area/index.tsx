'use client';

import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AnalysisCard from '@/components/common/analysis-card';
import WeakerAreaCard from './weaker-area-card';
import { useDispatch, useSelector } from '@/store';
import { GenericType } from '@/types';
import { fetchWeakerAreaAnalysis } from '@/store/slice/user/overall-analysis';

export default function OverallWeakerAnalysis() {
  const dispatch = useDispatch();
  const { subjectWiseAnalysis, weakerAreas } = useSelector((state) => state.overAllAnallysis);
  const [subjects, setSubjects] = useState<GenericType[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<GenericType | null>(null);
  const { stream } = useSelector((state) => state.stream);
  const { userId } = useSelector((state) => state.userProfile);

  useEffect(() => {
    if (subjectWiseAnalysis?.length) {
      const subjectsList = subjectWiseAnalysis.map((subject) => ({
        id: Number(subject.subjectId),
        name: subject.subject
      }));

      setSubjects(subjectsList);
      setSelectedSubject(subjectsList[0]);
    }
  }, [subjectWiseAnalysis]);

  useEffect(() => {
    if (userId && stream?.id && selectedSubject?.id) {
      dispatch(fetchWeakerAreaAnalysis(userId, stream?.id, selectedSubject?.id));
    }
  }, [userId, stream, selectedSubject]);

  const handleSubjectChange = (value: string) => {
    const newSubject = subjects.find((subject) => subject.name === value);
    if (newSubject) {
      setSelectedSubject(newSubject);
    }
  };

  return (
    <AnalysisCard
      className="rounded-2xl bg-default p-6 pt-2 shadow-none"
      separatorClassName="mt-2 mb-0"
      title={'Overall Weaker Areas'}
      dataTestId={'Overall-Weaker-Areas'}
      actions={
        weakerAreas && weakerAreas.length > 0 ? (
          <div className="ml-2 flex gap-2">
            {selectedSubject && (
              <Select value={selectedSubject.name} onValueChange={handleSubjectChange}>
                <SelectTrigger className="mr-2 w-full border-[#10101026] bg-white text-[12px] font-medium text-[#000080] sm:w-[120px] sm:text-base md:text-base lg:text-base">
                  <SelectValue>{selectedSubject.name}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem
                      key={subject.id}
                      value={subject.name}
                      className="text-medium text-[12px] text-[#000080] hover:text-[#000080] sm:text-base md:text-base lg:text-base"
                    >
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ) : null
      }
    >
      <ScrollArea className="h-[21rem] space-y-6">
        {weakerAreas && weakerAreas.length > 0 ? (
          weakerAreas?.map((section, index) => <WeakerAreaCard key={index} section={section} />)
        ) : (
          <div className="flex h-72 w-full items-center justify-center text-base text-gray-600">
            <p>No data Found</p>
          </div>
        )}
      </ScrollArea>
    </AnalysisCard>
  );
}

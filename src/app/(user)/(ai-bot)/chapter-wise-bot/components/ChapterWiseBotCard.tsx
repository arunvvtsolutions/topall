import { Card } from '@/components/ui/card';
import { ArrowRight, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface IChapterDataProps {
  testId: number | null;
  chapterId: number;
  chapterName: string;
  subjectId: number;
  level: number | null;
  testTypeId: number;
  totalQuestion: number | null;
  totalMarks: number | null;
  totalTime: number | null;
  updatedLevel: number | null;
}

export const ChapterWiseBotCard = ({
  chapterInfo,
  subjectName,
  standardName,
  standardId,
  subjectId,
}: {
  chapterInfo: IChapterDataProps;
  subjectName: string;
  standardName: string | undefined;
  standardId : number | undefined;
  subjectId? : number | undefined
}) => {
    const router = useRouter();
  return (
    <Card onClick={() => {
        // router.push(`/chapter-bot/${subjectName}/${standardId}`)
        router.push(`/chapter-bot/${subjectId}/${chapterInfo.chapterId}`)
    }}  className="flex cursor-pointer items-start justify-between bg-transparent p-5 text-[#222222] transition-all hover:shadow-md">
      <div className="flex-1">
        <h3 className="text-[15px] font-semibold">{chapterInfo.chapterName}</h3>
        <p className="mt-1 text-[14px] font-medium text-[#5f5f5f]">
          Subject:<span> {subjectName.toUpperCase()}</span>
        </p>
        <p className="text-[14px] font-medium text-[#5f5f5f]">
          Class:<span> {standardName}</span>
        </p>
      </div>
      <ArrowRight className="mt-1 w-5 shrink-0 text-[#000080]" />
    </Card>
  );
};

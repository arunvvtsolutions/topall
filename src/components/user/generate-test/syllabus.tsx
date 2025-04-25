import { MainDialog } from '@/components/common/MainDialog';
import { getViewSyllabus } from '@/utils/api/generate-test';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

// Define the type for the props
interface SyllabusProps {
  isOpen: boolean; // Indicates if the dialog is open
  testId: number;
  onClose: () => void; // Callback function to close the dialog
}

// Mock syllabus data
const syllabusData = [
  {
    subject: 'Physics',
    chapters: ['Motion', 'Gravitation', 'Optics', 'Thermodynamics', 'Electromagnetism']
  },
  {
    subject: 'Chemistry',
    chapters: ['Periodic Table', 'Chemical Reactions', 'Organic Chemistry', 'Acids and Bases']
  },
  {
    subject: 'Mathematics',
    chapters: ['Algebra', 'Geometry', 'Calculus', 'Trigonometry', 'Statistics']
  }
];

interface ISyllabusProps {
  subjectId: number;
  subjectName: string;
  totalQuestionsCount: number;
  topicsAndChapters: {
    chapterId: number;
    chapterName: string;
    chapterWiseTopicQuesCount: number;
    topics: {
      id: number;
      name: string;
      topicQuesCount: number;
    }[];
  }[];
}

const Syllabus: React.FC<SyllabusProps> = ({ isOpen, testId, onClose }) => {
  const { data } = useSession();
  const [syllabus, setSyllabus] = useState<ISyllabusProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const result = await getViewSyllabus(testId);
      setSyllabus(result);
      setLoading(false);
    };
    data?.user && getData();
  }, [data?.user]);
  return (
    <div>
      <MainDialog className="!text-[20px]" title="Syllabus" isOpen={isOpen} onOpenChange={onClose}>
        <div className="border-t border-[rgba(16,16,16,0.15)] !pt-4">
          <div className="rounded-[6px] border-[1px] border-primary p-4">
            {loading ? (
              <div className="flex max-h-[300px] min-h-[150px] flex-wrap items-center justify-center gap-2 rounded-[8px] lg:top-[40%]">
                <div className="animate-spin">
                  <Loader2 className="w-5" />
                </div>
              </div>
            ) : !loading && syllabus.length === 0 ? (
              <div className="absolute left-[50%] top-[15%] flex max-h-[300px] flex-wrap items-center justify-center gap-2 rounded-[8px] lg:top-[40%]">
                <p className="text-center font-semibold text-[14]">No Data found</p>
              </div>
            ) : (
              syllabus.map((item, index) => (
                <div key={index} className="mb-4">
                  <h3 className="sm:text-md mb-2 text-base font-[500] text-[#222222] md:text-lg">{item.subjectName}</h3>
                  <div className="flex flex-wrap gap-4 lg:ml-4">
                    {item.topicsAndChapters.map((chapter, chapterIndex) => (
                      <span
                        key={chapterIndex}
                        className="relative pl-4 text-start text-base font-medium text-[#6F6F6F] before:absolute before:left-[-6px] before:top-[-3px] before:text-[30px] before:text-[#6F6F6F] before:content-['•'] sm:before:left-[-10px] sm:before:top-[-3px] lg:text-lg"
                      >
                        {chapter.chapterName}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </MainDialog>
    </div>
  );
};

export default Syllabus;

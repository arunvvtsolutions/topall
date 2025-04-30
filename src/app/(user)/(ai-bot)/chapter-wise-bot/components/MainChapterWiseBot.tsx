'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname, useRouter } from 'next/navigation';
import { RootState, useSelector } from '@/store';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { getChapterWiseTests } from '@/utils/api/user/chapter-wise-test';
import { toast } from 'sonner';
import { TosterMessages } from '@/types/enum';
import { ChapterWiseBotCard } from './ChapterWiseBotCard';
import { Loader2 } from 'lucide-react';
import { getStandards } from '@/utils/api/user/on-board';

interface Subject {
  id: number;
  name: string;
}

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
interface IStreamProps {
  id: number;
  name: string;
}

interface ICourseProps {
  id: number;
  name: string;
  image_file: string;
  description: string;
  is_active: boolean;
  sequence: number;
  streams: IStreamProps;
}

export function ChapterWiseBotTabs({ subjectName }: { subjectName: string }) {
  const { userId } = useSelector((state: RootState) => state.userProfile);
  const { standard, stream } = useSelector((state: RootState) => state.stream);
  const { subjects: userSubjects } = useSelector((state: RootState) => state.user);
  const [selectedSubject, setSelectedSubject] = useState(subjectName);
  const [chapterData, setChapterData] = useState<Record<string, IChapterDataProps[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [standardList, setStandardList] = useState<ICourseProps[]>([]);
  const [filteredStandard, setFilteredStandard] = useState<ICourseProps>();

  const router = useRouter();
  const pathname = usePathname();



  // Memoize subjects and their IDs
  const { normalizedSubjects, subjectIds } = useMemo(() => {
    const subjects = (userSubjects || []).map((sub: Subject) => sub.name.toLowerCase());
    const ids = subjects.reduce(
      (acc: any, subject: any) => {
        const match = userSubjects?.find((s: Subject) => s.name.toLowerCase() === subject);
        if (match) acc[subject] = match.id;
        return acc;
      },
      {} as Record<string, number>
    );
    return { normalizedSubjects: subjects, subjectIds: ids };
  }, [userSubjects]);



  console.log(standard, 'standard');
  console.log(chapterData, 'chapter data');
  



  
  const isInitialDataLoading = !userId || !stream || !standard;

  // Memoize the API request parameters to detect changes
  const requestParams = useMemo(
    () => ({
      streamId: stream?.id ?? null,
      standardId: standard?.id ?? null,
      studentId: userId ?? null
    }),
    [stream?.id, standard?.id, userId]
  );

  const dynamicSubjectName = useMemo(() => {
    const pathParts = pathname.split('/');
    return pathParts[pathParts.length - 1]; 
  }, [pathname]);

  // Memoize the data fetch state to prevent unnecessary fetches
  const shouldFetchData = useMemo(() => {
    if (!requestParams.streamId || !requestParams.standardId || !requestParams.studentId) return false;

    // Check if we have all subject data cached
    const hasAllData = normalizedSubjects.every((subject: any) => {
      const cachedData = chapterData[subject];
      if (!cachedData) return false;

      // Verify the cached data matches current parameters
      const firstItem = cachedData[0];
      return firstItem && firstItem.subjectId === subjectIds[subject];
    });

    return !hasAllData;
  }, [normalizedSubjects, chapterData, requestParams, subjectIds]);

  // Fetch data only when necessary
  useEffect(() => {
    if (!shouldFetchData || normalizedSubjects.length === 0) return;

    const subjectsToFetch = normalizedSubjects.filter((subject: string) => {
      const cachedData = chapterData[subject];
      if (!cachedData) return true;
      return false;
    });

    if (subjectsToFetch.length === 0) return;
    if (requestParams.streamId === null || requestParams.standardId === null || requestParams.studentId === null) {
      return;
    }
    setIsLoading(true);

    Promise.all(
      subjectsToFetch.map(async (subject: string) => {
        try {
          const subjectId = subjectIds[subject];
          if (!subjectId) return null;

          const response = await getChapterWiseTests({
            ...requestParams,
            subjectId
          });
          return { subject, data: response };
        } catch (error) {
          console.error(`Error fetching data for ${subject}:`, error);
          return null;
        }
      })
    ).then((results) => {
      const newData = results.reduce(
        (acc : any, result : any) => {
          if (result?.data) acc[result.subject] = result.data;
          return acc;
        },
        {} as Record<string, IChapterDataProps[]>
      );
      setChapterData((prev) => ({
        ...prev,
        ...newData
      }));
      setIsLoading(false);
    });
  }, [shouldFetchData, normalizedSubjects, requestParams, subjectIds]);

  // Handle tab change without triggering data fetch
  const handleTabChange = useCallback((subject: string) => {
    setSelectedSubject(subject);
    history.pushState({}, '', `/chapter-wise-bot/${subject}`);
  }, []);

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const res = await getStandards();
        if (res && standard?.id) {
          const filteredData = res.find((data: ICourseProps) => data.id === standard.id);
          setFilteredStandard(filteredData);
        }
      } catch (error) {
        console.error('Error fetching standards:', error);
      }  
    };
    fetchStandards();
  }, [standard?.id]);

  return (
    <div className="container mt-4">
      <h1 className="mb-1 text-[19px] font-bold">Chapter Wise Bot</h1>
      <p className="mb-4 text-[15px]">AI Assistance Specialized in Specific Chapter</p>
      <Tabs defaultValue={subjectName} className="">
        <TabsList className="flex justify-start gap-2">
          {normalizedSubjects.map((subject: string) => (
            <TabsTrigger
              className="rounded-lg px-5 py-1.5 text-[14px] data-[state=active]:bg-[#000080] data-[state=active]:text-white"
              key={subject}
              value={subject}
              onClick={() => handleTabChange(subject)}
            >
              {subject.charAt(0).toUpperCase() + subject.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {normalizedSubjects.map((subject: string) => (
          <TabsContent key={subject} value={subject}>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : chapterData[subject] && chapterData[subject].length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {chapterData[subject].map((chapterInfo) => (
                  // <ChapterWiseBotCard  standardId ={standard?.id}  standardName={standard?.name || 'N/A'}  subjectName ={subjectName} key={chapterInfo.chapterId || chapterInfo.chapterName} chapterInfo={chapterInfo} />
                  <ChapterWiseBotCard subjectId={chapterInfo.subjectId} standardId ={standard?.id}  standardName={standard?.name || 'N/A'}   subjectName={dynamicSubjectName} key={chapterInfo.chapterId || chapterInfo.chapterName} chapterInfo={chapterInfo} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                No chapters available for this subject
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

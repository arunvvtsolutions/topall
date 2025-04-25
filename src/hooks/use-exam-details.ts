import { getSingleTest } from '@/utils/api/exams';
import { useEffect, useState } from 'react';

const useExamDetails = (examId: number) => {
  const [examTitle, setExamTitle] = useState<string | null>(null);

  useEffect(() => {
    const fetchSingleExam = async () => {
      try {
        const response = await getSingleTest(examId);
        setExamTitle(response.name);
      } catch (error) {
        console.error('Failed to fetch exam title', error);
      }
    };

    if (examId) {
      fetchSingleExam();
    }
  }, [examId]);

  return examTitle;
};

export default useExamDetails;

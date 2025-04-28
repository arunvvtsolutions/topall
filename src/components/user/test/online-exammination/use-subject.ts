import { useDispatch, useSelector } from '@/store';
import { setSelectedSubjects } from '@/store/slice/onlineExamSlice';
import { useEffect, useMemo } from 'react';

interface Subject {
  id: number;
  name: string;
}

const useSubjects = () => {
  const dispatch = useDispatch();
  const sectionsData = useSelector((state) => state.onlineExamination.sectionsData);

  const subjects: Subject[] = useMemo(() => {
    const uniqueSubjects = new Map();

    sectionsData?.forEach((item) => {
      if (!uniqueSubjects.has(item.subjectId)) {
        uniqueSubjects.set(item.subjectId, {
          id: Number(item.subjectId),
          name: item.subjectName
        });
      }
    });

    return Array.from(uniqueSubjects.values());
  }, [sectionsData]);

  useEffect(() => {
    if (subjects.length > 0) {
      dispatch(setSelectedSubjects(subjects[0]));
    }
  }, [subjects, dispatch]);

  return subjects;
};

export default useSubjects;

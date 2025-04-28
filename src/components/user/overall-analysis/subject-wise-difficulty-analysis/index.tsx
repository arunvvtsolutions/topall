'use client';
import AnalysisCard from '@/components/common/analysis-card';
import SubjectDifficultyCard from './subject-difficulty-card';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useDispatch, useSelector } from '@/store';
import { useEffect } from 'react';
import { fetchDifficultyAnalysis } from '@/store/slice/user/overall-analysis';

const SubjectDifficultyAnalysis = () => {
  const dispatch = useDispatch();
  const { difficultyAnalysis } = useSelector((state) => state.overAllAnallysis);
  const { stream } = useSelector((state) => state.stream);
  const { userId } = useSelector((state) => state.userProfile);

  useEffect(() => {
    if (userId && stream?.id) {
      dispatch(fetchDifficultyAnalysis(userId, stream?.id));
    }
  }, [userId, stream]);

  const isLG = useMediaQuery('(min-width: 1440px)');
  const hasData = difficultyAnalysis && difficultyAnalysis.length > 0;

  return (
    <AnalysisCard
      title="Overall Subject-wise Difficulty Analysis"
      dataTestId="overall-subject-wise-difficulty-analysis"
      className="mx-auto w-full rounded-2xl bg-white p-6 pt-4 shadow"
      separatorClassName="mt-3"
    >
      {hasData ? (
        <div
          className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 ${
            isLG ? 'xl:grid-cols-4' : 'lg:grid-cols-2 xl:grid-cols-4'
          }`}
        >
          {difficultyAnalysis.map((subject) => (
            <SubjectDifficultyCard subject={subject} key={subject.subject_id} />
          ))}
        </div>
      ) : (
        <div className="flex h-72 w-full items-center justify-center text-base text-gray-600">
          <p>No data Found</p>
        </div>
      )}
    </AnalysisCard>
  );
};

export default SubjectDifficultyAnalysis;

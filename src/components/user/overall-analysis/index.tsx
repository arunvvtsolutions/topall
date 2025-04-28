import React from 'react';
import { HeadersTitle } from '@/types/enum';
import SubjectProficiencyAnalysis from './subject-proficiency';
import SubjectDifficultyAnalysis from './subject-wise-difficulty-analysis';
import OverallWeakerAnalysis from './overall-weaker-area';
import SubjectwisePerformance from './subjectwise-performance';
import SubjectAccuracy from './subject-accuracy';
import 'swiper/css';
import SubjectTimeAnalysis from './subject-time-analysis';

const OverAllAnalysis = () => {
  return (
    <div className="h-auto min-h-screen">
      <div>
        <h2 className="pb-4 text-base font-medium text-[#222222] mt-3 md:text-xl">{HeadersTitle.OVER_ALL_ANALYSIS}</h2>
      </div>
      <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-2 lg:gap-4">
        <div className="col-span-2">
          <SubjectwisePerformance />
        </div>
        <div className="col-span-1">
          <OverallWeakerAnalysis />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <SubjectProficiencyAnalysis />
        </div>

        <div className="col-span-2 lg:col-span-1">
          <SubjectTimeAnalysis />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <SubjectAccuracy />
        </div>
      </div>
      <div className="mt-6">
        <SubjectDifficultyAnalysis />
      </div>
    </div>
  );
};
export default OverAllAnalysis;

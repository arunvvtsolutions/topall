'use client';
import { Input } from '@/components/ui/input';
import React, { memo, useEffect, useState } from 'react';
import StarRating from './star-rating';
import { Icon } from '@/components/ui/icon';

interface Subject {
  id: number;
  name: string;
  star: number;
}

interface ExamCardProps {
  title: string;
  inputs: { label: string | number; placeholder: string; type?: string; icon: any }[];
  subjects: Subject[];
  onExamUpdate: (updatedExam: { streamName: string; targetYear: string; targetScore: string; subjects: Subject[] }) => void;
  ratingLabel?: string;
  targetYear?: string;
  targetScore?: string;
}

const ExamCard: React.FC<ExamCardProps> = ({
  title,
  inputs,
  subjects,
  onExamUpdate,
  ratingLabel = 'How good are you at',
  targetYear,
  targetScore
}) => {
  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear + 1, currentYear + 2, currentYear + 3];
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const [examState, setExamState] = useState(() => ({
    streamName: title,
    targetYear: targetYear || availableYears[0].toString(),
    targetScore: targetScore || '0',
    subjects: subjects?.map((sub) => ({ ...sub })) || []
  }));

  // Only update state when initial props change (NOT on every render)
  useEffect(() => {
    setExamState((prev) => ({
      ...prev,
      streamName: title,
      targetYear: prev.targetYear || targetYear || availableYears[0].toString(),
      targetScore: prev.targetScore || targetScore || '0',
      subjects: prev.subjects.length > 0 ? prev.subjects : subjects?.map((sub) => ({ ...sub })) || []
    }));
  }, [title, targetYear, targetScore, subjects]);

  const handleInputChange = (field: 'targetYear' | 'targetScore', value: string) => {
    setExamState((prev) => {
      const updatedState = { ...prev, [field]: value };
      return updatedState;
    });

    onExamUpdate({ ...examState, [field]: value });
  };

  const handleRatingChange = (subjectName: string, rating: number) => {
    setExamState((prev) => {
      const updatedSubjects = prev.subjects.map((sub) => (sub.name === subjectName ? { ...sub, star: rating } : sub));
      return { ...prev, subjects: updatedSubjects };
    });

    onExamUpdate({
      ...examState,
      subjects: examState.subjects.map((sub) => (sub.name === subjectName ? { ...sub, star: rating } : sub))
    });
  };

  const handleYearSelect = (year: string) => {
    handleInputChange('targetYear', year);
    setShowYearDropdown(false); // Close dropdown after selection
  };

  return (
    <div className="w-full rounded-bl-[0.5rem] rounded-br-[0.5rem] border">
      {/* Exam Title */}

      <div className="flex h-8 items-center justify-center bg-[#EBEFFB] md:h-16">
        {title && <h2 className="text-base font-medium text-B2CAgrayn md:text-[20px]">{title}</h2>}
      </div>

      {/* Exam Form */}
      <div className="p-3 md:p-6">
        {/* Dynamic Input Fields */}
        <div className="mb-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {inputs.map((input, index) => (
            <div key={index}>
              <h4 className="mb-2 text-B2Cgray">
                {input.label} <span className="text-red-500">*</span>
              </h4>

              <div className="relative flex w-full items-center rounded-sm border border-border bg-transparent">
                {input.label === 'Target Year' ? (
                  <>
                    <Input
                      type="text"
                      value={examState.targetYear}
                      readOnly
                      className="h-8 w-full border-none !bg-white px-2 text-xs font-medium text-primary placeholder:text-gray-400 focus:ring-0 md:h-12 md:px-3 md:text-lg"
                    />
                    <span className="mr-6 h-6 w-[1px] bg-gray-300"></span>
                    <span className="cursor-pointer pr-3 text-gray-500" onClick={() => setShowYearDropdown(!showYearDropdown)}>
                      <img src="/images/calendar.svg" alt="Calendar Icon" />
                    </span>

                    {showYearDropdown && (
                      <div className="absolute right-0 top-full z-10 w-32 border border-gray-300 bg-white shadow-md">
                        {availableYears.map((year) => (
                          <div
                            key={year}
                            className="cursor-pointer p-2 text-center hover:bg-gray-200"
                            onClick={() => handleYearSelect(year.toString())}
                          >
                            {year}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Input
                      type="text"
                      value={examState.targetScore}
                      className="h-8 w-full border-none bg-white px-2 text-xs font-medium text-primary placeholder:text-gray-400 focus:ring-0 md:h-12 md:px-3 md:text-lg"
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        handleInputChange('targetScore', value);
                      }}
                    />
                    {/* Right Separator (Only if Icon or Number Exists) */}
                    {input.icon !== undefined && <span className="mr-6 h-6 w-[1px] bg-gray-300"></span>}
                    {typeof input.icon === 'number' ? (
                      <span className="pr-3 text-[1rem] font-medium text-gray-500">{input.icon}</span>
                    ) : input.icon ? (
                      <span className="pr-3 text-gray-500">
                        {typeof input.icon === 'string' ? <Icon icon={input.icon} className="text-xl" /> : input.icon}
                      </span>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Star Ratings */}
        {subjects.length > 0 && (
          <>
            <h2 className="my-6 text-[1rem] text-primary">{ratingLabel}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {examState.subjects.map((subject, index) => (
                <StarRating
                  key={`${subject.id}-${index}`} // Ensures uniqueness even if IDs are duplicated
                  defaultRating={subject.star}
                  onChange={(rating) => handleRatingChange(subject.name, rating)}
                  label={subject.name}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default memo(ExamCard);

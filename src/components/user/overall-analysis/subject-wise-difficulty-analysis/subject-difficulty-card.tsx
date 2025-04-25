import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ButtonNames } from '@/types/enum';
import { DifficultyAnalysis } from '@/types/user/overall-analysis';
import React from 'react';

const SubjectDifficultyCard = ({ subject }: { subject: DifficultyAnalysis }) => {
  return (
    <Card className="w-full rounded-2xl border">
      <CardHeader className="px-4 pb-2">
        <CardTitle className="text-base font-semibold text-[#000080]">{subject.subject_name}</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {/* Header Row */}
        <div className="mb-3 grid grid-cols-4 items-center bg-[#00008008] px-4 py-2">
          <div className="flex justify-start">
            <Icon icon="humbleicons:chart" color="#000080" fontSize={20} />
          </div>
          <div className="text-center text-sm font-medium text-[#222222]">{ButtonNames.CORRECT}</div>
          <div className="text-center text-sm font-medium text-[#222222]">{ButtonNames.WRONG}</div>
          <div className="text-center text-sm font-medium text-[#222222]">{ButtonNames.LEFT}</div>
        </div>

        {/* Data Rows */}
        <div className="px-4">
          {subject.difficulty.map((item: any) => {
            const correct = Number(item.correct?.percentage) || 0;
            const wrong = Number(item.wrong?.percentage) || 0;
            const left = Number(item.left?.percentage) || 0;

            // Calculate the total percentage (prevent division by zero)
            const total = correct + wrong + left || 1;

            // Round values
            let roundedCorrect = Math.round((correct / total) * 100);
            let roundedWrong = Math.round((wrong / total) * 100);
            let roundedLeft = Math.round((left / total) * 100);

            // Calculate total after rounding
            let sum = roundedCorrect + roundedWrong + roundedLeft;

            // Fix rounding issues to ensure total = 100%
            if (sum !== 100) {
              let diff = 100 - sum; // Difference to fix

              // Adjust the largest value to absorb the difference
              if (Math.max(roundedCorrect, roundedWrong, roundedLeft) === roundedCorrect) {
                roundedCorrect += diff;
              } else if (Math.max(roundedCorrect, roundedWrong, roundedLeft) === roundedWrong) {
                roundedWrong += diff;
              } else {
                roundedLeft += diff; // This only happens when left is non-zero
              }
            }

            return (
              <div key={item.id} className="grid grid-cols-4 items-center py-2">
                <div className="text-sm font-medium text-[#222222]">{item.name}</div>
                <div className="text-center text-sm font-semibold text-[#00A86B]">{roundedCorrect}%</div>
                <div className="text-center text-sm font-semibold text-[#E31717CC]">{roundedWrong}%</div>
                <div className="text-center text-sm font-semibold text-[#FFAD43]">{left > 0 ? roundedLeft : 0}%</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectDifficultyCard;

import { AnsweredTypes } from '@/types/enum';

// Function to calculate accuracy
export const calculateAccuracy = (correct: number, wrong: number, left: number): number => {
  const total = correct + wrong + left;
  if (total === 0) return 0;

  return Number(((correct / total) * 100).toFixed(2).split('.')[0]);
};

// Function to calculate percentage
export const calculatePercentage = (correct: number, wrong: number, left: number) => {
  const total = correct + wrong + left;

  if (total === 0) {
    return { correct: 0, wrong: 0, left: 0 };
  }

  let correctPercentage = Math.round((correct / total) * 100);
  let wrongPercentage = Math.round((wrong / total) * 100);
  let leftPercentage = Math.round((left / total) * 100);

  let percentageSum = correctPercentage + wrongPercentage + leftPercentage;

  if (percentageSum !== 100) {
    const maxValue = Math.max(correctPercentage, wrongPercentage, leftPercentage);

    if (correctPercentage === maxValue) {
      correctPercentage += 100 - percentageSum;
    } else if (wrongPercentage === maxValue) {
      wrongPercentage += 100 - percentageSum;
    } else {
      leftPercentage += 100 - percentageSum;
    }
  }

  return { correct: correctPercentage, wrong: wrongPercentage, left: leftPercentage };
};

// Function to calculate subject accuracy
export const calculateSubjectAccuracy = (correct: number, wrong: number): number => {
  const attempted = correct + wrong;
  if (attempted === 0) return 0;

  return Math.round((correct / attempted) * 100);
};

// Function to get formated time
export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes} Min ${String(remainingSeconds).padStart(2, '0')} Sec`;
  }

  return `${remainingSeconds} Sec`;
}

// Function to get text color
export const getTextColor = (text: string) => {
  if (text.toLowerCase() === AnsweredTypes.CORRECT.toLowerCase()) return 'text-[#00A86B]';
  if (text.toLowerCase() === AnsweredTypes.LEFT.toLowerCase()) return 'text-[#FFAD43]';
  if (text.toLowerCase() === AnsweredTypes.WRONG.toLowerCase()) return 'text-[#E31717]';
  if (text.includes('AVERAGE')) return 'text-[#000080]';
  return 'text-[#222222]';
};

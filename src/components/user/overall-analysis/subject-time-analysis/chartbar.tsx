export const ChartBar = ({ correct, wrong, left }: { correct: number; wrong: number; left: number }) => {
  const total = correct + wrong + left;
  const correctPercentage = (correct / total) * 100;
  const wrongPercentage = (wrong / total) * 100;
  const leftPercentage = (left / total) * 100;

  return (
    <div className="relative flex h-[24px] w-full overflow-hidden rounded-sm">
      <div style={{ width: `${correctPercentage}%` }} className="relative z-20 rounded-l-sm bg-success"></div>
      <div style={{ width: `${wrongPercentage}%` }} className="relative z-10 bg-[#FF4747]"></div>
      <div style={{ width: `${leftPercentage}%` }} className="-z-1 relative rounded-r-sm bg-[#FFAD43]"></div>
    </div>
  );
};

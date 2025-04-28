import React from 'react';
interface MetricsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ label, value, icon }) => {
  return (
    <div className="flex items-center gap-3 rounded-3xl bg-[#00008005] p-6">
      <div className="flex aspect-square size-8 items-center justify-center rounded-full border border-[#0D068E] sm:size-10 md:size-12 lg:size-14">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-[#222222] sm:text-base md:text-base lg:text-lg">{label}</p>
        <p className="text-xs font-normal text-[#6F6F6F] sm:text-sm md:text-base">{value}</p>
      </div>
    </div>
  );
};

export default MetricsCard;

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Circle } from "lucide-react";

interface Step {
  label: string;
  completed: boolean;
}

interface DotProgressBarProps {
  steps: Step[];
}

const DotProgressBar: React.FC<DotProgressBarProps> = ({ steps }) => {
  return (
    <div className="flex flex-col items-start space-y-1 z-15">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start">
          {/* Dots & Line */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex items-center justify-center rounded-full border-1 transition-all",
                step.completed ? "bg-[#9DE654] border-black w-3 h-3" : "border-black w-4 h-4"
              )}
            >
              <Circle size={step.completed ? 12 : 15} />
            </div>

            {index !== steps.length - 1 && (
              <div className="w-[1.5px] h-14 bg-[#6F6F6F] mt-1"></div>
            )}
          </div>

          {/* Step Label */}
          <div className="ml-4 ">
            <p className={cn(step.completed ? "text-[#222222] font-normal text-xs" : "text-[#222222] font-bold text-xs")}>
              {step.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DotProgressBar;

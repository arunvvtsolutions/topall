import React from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipArrow,
} from "../ui/tooltip";

interface CustomTooltipProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  color?: string;
  delayDuration?: number;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  trigger,
  content,
  color = "default",
  delayDuration = 0,
}) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent className={`tooltip-${color}`}>
          {content}
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;

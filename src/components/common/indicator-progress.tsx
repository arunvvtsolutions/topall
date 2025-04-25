"use client";
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ReusableProgressBarProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  showValue?: boolean;
  isStripe?: boolean;
  isAnimate?: boolean;
}

const ReusableProgressBar: React.FC<ReusableProgressBarProps> = ({
  value = 0,
  showValue = false,
  isStripe = false,
  isAnimate = false,
  className,
  ...props
}) => {
  const getStyles = (value: number) => {
    if (value === 0) {
      return {
        filled: "rgba(111, 111, 111, 1)", // Gray for circle border when value is 0
        remaining: "rgba(111, 111, 111, 0.2)", // Light gray for bar when value is 0
      };
    }
    if (value < 30) {
      return {
        filled: "#FF4747", // Red for low progress
        remaining: "rgba(255, 71, 71, 0.24)", // Light red for empty bar
      };
    }
    if (value < 70) {
      return {
        filled: "#FFAD43", // Orange for medium progress
        remaining: "rgba(255, 173, 67, 0.24)", // Light orange for empty bar
      };
    }
    return {
      filled: "#00A86B", // Green for high progress
      remaining: "rgba(0, 168, 107, 0.24)", // Light green for empty bar
    };
  };

  const styles = getStyles(value);

  const stripeStyles = isStripe
    ? {
        backgroundImage: `linear-gradient(
          45deg,
          hsla(0, 0%, 100%, 0.15) 25%,
          transparent 0,
          transparent 50%,
          hsla(0, 0%, 100%, 0.15) 0,
          hsla(0, 0%, 100%, 0.15) 75%,
          transparent 0,
          transparent
        )`,
        backgroundSize: "0.857rem 0.857rem",
      }
    : {};

  return (
    <div className="relative w-[195px]">
      <ProgressPrimitive.Root
        className={cn(
          "relative overflow-hidden rounded-full h-[8px]",
          className
        )}
        style={{ backgroundColor: styles.remaining }}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full transition-all relative",
            { "animate-stripes": isAnimate }
          )}
          style={{
            backgroundColor: styles.filled,
            transform: `translateX(-${100 - value}%)`,
            ...stripeStyles,
          }}
        />
      </ProgressPrimitive.Root>

      {/* Circle at the end */}
      <div
        className={cn(
          "absolute h-4 w-4 rounded-full border-2 bg-white"
        )}
        style={{
          borderColor: styles.filled,
          top: "50%",
          left: value === 0 ? "0" : `calc(${value}% - 6px)`, 
          transform: value === 0 ? "translateY(-50%)" : "translate(-50%, -50%)", 
        }}
      />

      {/* Value positioned dynamically */}
      {showValue && (
        <div
          className="absolute text-[10px] font-[700] text-[#222222] top-3"
          style={{
            left: value === 0 ? "0" : `calc(${value}% - ${value < 10 ? "10px" : "15px"})`, 
          }}
        >
          {value}%
        </div>
      )}
    </div>
  );
};

ReusableProgressBar.displayName = "ReusableProgressBar";

export { ReusableProgressBar };

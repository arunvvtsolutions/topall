"use client";
import React from "react";

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  barColor?: string;
  trackColor?: string;
  innerBgColor?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 5,
  barColor = "#0D068E",
  trackColor = "#F2F2F2",
  innerBgColor = "rgba(13, 6, 142, 0.04)",
}) => {
  // Calculate the circle's radius (accounting for strokeWidth)
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  // Center coordinates of the circle
  const cx = size / 2;
  const cy = size / 2;

  // Convert the progress value into an angle (in degrees)
  // We subtract 90° so the progress starts from the top.
  const angle = (value / 100) * 360;
  const radians = ((angle - 90) * Math.PI) / 180;

  // Compute the endpoint of the progress arc (SVG coordinate system)
  const endX = cx + radius * Math.cos(radians);
  const endY = cy + radius * Math.sin(radians);

  // We'll use the strokeWidth as the indicator's size.
  const indicatorSize = strokeWidth;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* SVG containing the background and progress circles */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle (Track) */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={barColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>

      {/* Indicator Circle (positioned at the arc's end) */}
      {value > 0 && (
        <div
          style={{
            position: "absolute",
            left: endX - indicatorSize/.75 ,
            top: endY - indicatorSize/1,
            width: indicatorSize*2.5,
            height: indicatorSize*2.5,
            backgroundColor: barColor,
            borderRadius: "50%",
            zIndex: 20, // Ensure it appears above the inner circle
          }}
        />
      )}

      {/* Inner Circle with progress text */}
      <div
        className="absolute flex items-center justify-center rounded-full"
        style={{
          width: size * 0.75,
          height: size * 0.75,
          backgroundColor: innerBgColor,
          zIndex: 10, // Lower than the indicator so that the indicator remains visible
        }}
      >
        <span className="text-lg font-semibold" style={{ color: barColor }}>
          {value}%
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;

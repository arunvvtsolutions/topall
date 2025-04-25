import React from 'react';

interface InfoIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const InfoIcon: React.FC<InfoIconProps> = ({
  width = 24,
  height = 24,
  color = "currentColor",
  className = "",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
      className={className}
    >
      <path d="M12 8h.008M12 16v-5m10 1c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" />
    </svg>
  );
};

export default InfoIcon;

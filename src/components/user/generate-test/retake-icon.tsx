import React from 'react';

interface RetakeIconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}

const RetakeIcon: React.FC<RetakeIconProps> = ({
  width = 14,
  height = 15,
  color = 'white',
  strokeWidth = 1.5,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.68572 3.46372C8.17822 3.31206 7.61822 3.21289 6.99988 3.21289C4.20572 3.21289 1.94238 5.47622 1.94238 8.27039C1.94238 11.0704 4.20572 13.3337 6.99988 13.3337C9.79405 13.3337 12.0574 11.0704 12.0574 8.27622C12.0574 7.23789 11.7424 6.26956 11.2057 5.46456"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.40898 3.60268L7.72314 1.66602"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.40919 3.60352L7.44336 5.03852"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default RetakeIcon;

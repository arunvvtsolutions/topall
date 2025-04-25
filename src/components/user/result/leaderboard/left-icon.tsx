import React from "react";

interface LeftArrowProps {
  width?: number;
  height?: number;
  fill?: string;
}

const LeftArrow: React.FC<LeftArrowProps> = ({
  width = 8,
  height = 14,
  fill = "#000080",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 8 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.82031 12.9202L7.82031 6.69024L7.82031 1.08024C7.82031 0.120237 6.66031 -0.359763 5.98031 0.320237L0.800312 5.50024C-0.0296882 6.33024 -0.0296882 7.68024 0.800312 8.51024L2.77031 10.4802L5.98031 13.6902C6.66031 14.3602 7.82031 13.8802 7.82031 12.9202Z"
        fill={fill}
      />
    </svg>
  );
};

export default LeftArrow;

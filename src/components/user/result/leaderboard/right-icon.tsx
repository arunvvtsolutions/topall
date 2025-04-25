import React from "react";

interface RightArrowProps {
  width?: number;
  height?: number;
  fill?: string;
}

const RightArrow: React.FC<RightArrowProps> = ({
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
        d="M0.179688 12.9202L0.179688 6.69024L0.179688 1.08024C0.179688 0.120237 1.33969 -0.359763 2.01969 0.320237L7.19969 5.50024C8.02969 6.33024 8.02969 7.68024 7.19969 8.51024L5.22969 10.4802L2.01969 13.6902C1.33969 14.3602 0.179688 13.8802 0.179688 12.9202Z"
        fill={fill}
      />
    </svg>
  );
};

export default RightArrow;

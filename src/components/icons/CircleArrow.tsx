import React from "react";

const CircleArrow = ({ color = "#101010" }: { color?: string }) => {
  return (
    <>
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0.25"
          y="0.25"
          width="29.5"
          height="29.5"
          rx="14.75"
          stroke={color}
          strokeOpacity="0.2"
          strokeWidth="0.5"
        />
        <path
          d="M15.8786 15L12.1663 11.2877L13.2269 10.227L17.9999 15L13.2269 19.7729L12.1663 18.7123L15.8786 15Z"
          fill={color}
          fillOpacity="0.2"
        />
      </svg>
    </>
  );
};
export default CircleArrow;

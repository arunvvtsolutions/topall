import React from "react";

interface LeaderStarIconProps extends React.SVGProps<SVGSVGElement> {}

const LeaderStarIcon: React.FC<LeaderStarIconProps> = (props) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.60887 16.4617L6.69677 11.7586L6.76461 11.4653L6.53717 11.2681L2.88799 8.10439L7.71121 7.68571L8.01127 7.65966L8.12852 7.38223L10.0013 2.9511L11.8741 7.38223L11.9913 7.65966L12.2914 7.68571L17.1146 8.10439L13.4654 11.2681L13.238 11.4653L13.3058 11.7586L14.3937 16.4617L10.2596 13.9678L10.0013 13.812L9.74304 13.9678L5.60887 16.4617Z"
        fill="#DA8207"
        stroke="#FEEBB5"
      />
    </svg>
  );
};

export default LeaderStarIcon;

import React from 'react';

interface FileIconProps {
  height?: number;
  width?: number;
  name?: string;
}

const FileIcon: React.FC<FileIconProps> = ({ height = 14, width = 14, name = 'FileIcon' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby={name}
    >
      <path
        d="M12.8334 1.16699L8.05005 5.95033"
        stroke="#00A86B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.58325 3.59961V6.41711H10.4008"
        stroke="#00A86B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.41675 1.16699H5.25008C2.33341 1.16699 1.16675 2.33366 1.16675 5.25033V8.75033C1.16675 11.667 2.33341 12.8337 5.25008 12.8337H8.75008C11.6667 12.8337 12.8334 11.667 12.8334 8.75033V7.58366"
        stroke="#00A86B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FileIcon;

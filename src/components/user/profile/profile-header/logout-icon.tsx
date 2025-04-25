import React from 'react';

interface LogoutIconProps {
  width?: number;
  height?: number;
  fill?: string;
}

const LogoutIcon: React.FC<LogoutIconProps> = ({ width = 22, height = 22, fill = '#6F6F6F' }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.8 2H14.2C11 2 9 4 9 7.2V11.25H15.25C15.66 11.25 16 11.59 16 12C16 12.41 15.66 12.75 15.25 12.75H9V16.8C9 20 11 22 14.2 22H16.79C19.99 22 21.99 20 21.99 16.8V7.2C22 4 20 2 16.8 2Z"
        fill={fill}
      />
      <path
        d="M4.55945 11.25L6.62945 9.18C6.77945 9.03 6.84945 8.84 6.84945 8.65C6.84945 8.46 6.77945 8.26 6.62945 8.12C6.33945 7.83 5.85945 7.83 5.56945 8.12L2.21945 11.47C1.92945 11.76 1.92945 12.24 2.21945 12.53L5.56945 15.88C5.85945 16.17 6.33945 16.17 6.62945 15.88C6.91945 15.59 6.91945 15.11 6.62945 14.82L4.55945 12.75H8.99945V11.25H4.55945Z"
        fill={fill}
      />
    </svg>
  );
};

export default LogoutIcon;

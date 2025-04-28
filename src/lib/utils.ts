import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import moment from 'moment';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hexToRGB = (hex: any, alpha?: number): any => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } else {
    return `rgb(${r}, ${g}, ${b})`;
  }
};

//convert initial funtionality
export const getInitials = (name: string): string => {
  if (!name) return '';

  const nameParts = name
    .replace(/[^\w\s]/gi, '')
    .split(' ')
    .filter((n) => n !== '');
  let initials = '';

  if (nameParts.length > 1) initials = `${nameParts[0][0]}${nameParts[1][0]}`;
  else initials = `${nameParts[0][0]}${nameParts[0][1] || ''}`;

  return initials.toUpperCase();
};

//generate randam bg color
export const generateColor = (name: string) => {
  if (!name) return '#000000';
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

// Seperate Date and time
export const separateDateTime = (dateTime: string) => {
  const date = moment(dateTime).format('DD-MM-YYYY');
  const time = moment(dateTime).format('hh:mm A');

  return { date, time };
};

// format end date
export const formatTimestamp = (timestamp: string): string => {
  const formattedDate = moment.utc(timestamp).utcOffset('+05:30').format('dddd, MMMM DD YYYY, h:mmA');
  return formattedDate;
};

//capitalize first letter
export const capitalizeFirstLetter = (text: string) => {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatDateTimeParts = (isoString: string): { date: string; time: string } => {
  const date = new Date(isoString);

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };

  return {
    date: date.toLocaleDateString('en-US', dateOptions),
    time: date.toLocaleTimeString('en-US', timeOptions)
  };
};

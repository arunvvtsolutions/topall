import { getAdminMenus } from '@/lib/admin-menus';
import { ALL_INDIA_MOCK_TEST, CHAPTER_WISE_TEST, CONCEPT_WISE_TEST, GENERATE_TEST, PREVIOUS_YEAR_TEST } from '@/types/constants';

export const getCookie = (key: string) => {
  const cookie = document.cookie;
  return cookie
    .split(';')
    .find((x) => x.trim().startsWith(key))
    ?.split('=')[1];
};

export const setCookie = (key: string, value: string) => {
  document.cookie = `${key}=${value}`;
};

export const convertTime = (date = new Date()) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // Determine AM or PM
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert hours from 24-hour to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12;

  // Add leading zero to minutes and seconds if necessary
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  // Create time string
  return `${hours}:${formattedMinutes} ${ampm}`;
};

export const getUserDevice = () => {
  const userAgent = navigator.userAgent;
  // Check for common devices based on the user-agent string
  if (/iphone/i.test(userAgent)) {
    return 'iPhone';
  } else if (/ipad/i.test(userAgent)) {
    return 'iPad';
  } else if (/ipod/i.test(userAgent)) {
    return 'iPod';
  } else if (/android/i.test(userAgent)) {
    return 'Android';
  } else if (/windows phone/i.test(userAgent)) {
    return 'Windows Phone';
  } else if (/macintosh/i.test(userAgent)) {
    return 'Mac';
  } else if (/windows nt/i.test(userAgent)) {
    return 'Windows PC';
  } else if (/linux/i.test(userAgent)) {
    return 'Linux';
  } else {
    return 'Unknown Device';
  }
};

export const convertToString = (value: any) => (value === 0 ? '' : String(value));

export const haveRouteAccess = (role: string, pathname: string) => {
  return getAdminMenus(role).some((menu) => pathname.includes(menu.href) && menu.roles.includes(role));
}

// for converting the online exam time
export const convertToMinutesSeconds = (time: number): string => {
  const hours = Math.floor(time / 3600);
  const mins = Math.floor((time % 3600) / 60);
  const secs = time % 60;

  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const setLocalStorage = (key: string, data: string | null) => {
  if (typeof window === 'undefined') return;

  if (data) {
    localStorage.setItem(key, data);
  } else {
    localStorage.removeItem(key);
  }
};

export const getLocalStorageData = (key: string) => {
  if (typeof window === 'undefined') return null;

  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : null;
};

// Reusable function to handle test type redirection
export const getRedirectPath = (testTypeId: number) => {
  switch (testTypeId) {
    case ALL_INDIA_MOCK_TEST:
      return '/all-india-mock-test';
    case PREVIOUS_YEAR_TEST:
      return '/previous-year';
    case GENERATE_TEST:
      return '/generate-test';
    case CHAPTER_WISE_TEST:
      return '/chapter-wise-test';
    case CONCEPT_WISE_TEST:
      return '/concept-test';
    default:
      return '/dashboard';
  }
};

export const preventAlphabets = (event: any) => {
  const ALLOWED_CHARS_REGEXP = /[0-9\/]+/;
  if (!ALLOWED_CHARS_REGEXP.test(event.key)) {
    event.preventDefault();
  }
};

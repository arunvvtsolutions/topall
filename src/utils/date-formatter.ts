export const formatDateTime = (isoString: string, longFormat = false, shortYearFormat = false) => {
  const date = new Date(isoString);

  if (longFormat) {
    const dateParts = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).formatToParts(date);

    const formattedDate =
      `${dateParts.find((part) => part.type === 'weekday')?.value}, ` +
      `${dateParts.find((part) => part.type === 'month')?.value} ` +
      `${dateParts.find((part) => part.type === 'day')?.value} ` +
      `${dateParts.find((part) => part.type === 'year')?.value}`;

    return { formattedDate, formattedTime: null };
  }

  if (shortYearFormat) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);

    return { formattedDate, formattedTime };
  }

  const formattedDate = new Intl.DateTimeFormat('en-GB').format(date).replace(/\//g, '-');
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);

  return { formattedDate, formattedTime };
};

export const formatDateMonthDayYear = (isoString: string) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const calculateDaysLeft = (
  expiryDate: number | undefined | null,
  startDate?: string | undefined | null // Optional startDate parameter
): string => {
  if (!expiryDate) return '00'; // If expiryDays is null, return "00"

  const today = startDate ? new Date(startDate) : new Date();
  const expiry = new Date(expiryDate);

  // Calculate the difference in milliseconds
  const differenceInMs = expiry.getTime() - today.getTime();

  // Convert milliseconds to days
  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  return differenceInDays > 0 ? String(differenceInDays).padStart(2, '0') : '00';
};

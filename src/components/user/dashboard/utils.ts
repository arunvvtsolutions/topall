export function getInitials(fullName: string | undefined): string {
  if (!fullName) return 'U';
  const words = fullName.trim().split(' ').filter(Boolean);
  if (words.length === 1) {
    return words[0][0].toUpperCase();
  } else {
    return words[0][0].toUpperCase() + words[words.length - 1][0].toUpperCase();
  }
}

export function formatTime(seconds: number): string {
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    return `${mins} Min`;
  } else {
    return `${seconds} Sec`;
  }
}

export const links = [
  {
    href: '/all-india-mock-test',
    icon: 'award.svg',
    label: 'all india mock test',
    description: 'Practise subjects wise, chapter wise & full length tests.',
    short_name: 'aimt'
  },
  {
    href: '/previous-year',
    icon: 'calendar.svg',
    label: 'previous year test',
    description: 'Analyse your performance in previous year’s tests.',
    short_name: 'pyt'
  },
  {
    href: '/generate-test',
    icon: 'add-square.svg',
    label: 'generate test',
    description: 'Curated by experts to bring you to speed.',
    short_name: 'gt'
  },
  {
    href: '/concept-test',
    icon: 'lamp-charge.svg',
    label: 'concept wise test',
    description: 'Practise subjects wise, chapter wise & full length tests.',
    short_name: 'conwt'
  },
  {
    href: '/chapter-wise-test',
    icon: 'book.svg',
    label: 'chapter wise test',
    description: 'Practise subjects wise, chapter wise & full length tests.',
    short_name: 'cwt'
  }
];

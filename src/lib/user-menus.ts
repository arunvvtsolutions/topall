export function getStudentMenus(pathname: string) {
  //student
  const studentMenu = [
    {
      id: 'dashboard',
      href: '/dashboard',
      label: 'dashboard',
      active: pathname.includes('/dashboard'),
      icon: '/images/icon/sidebar-icons/outline/home-2.svg',
      filledIcon: '/images/icon/sidebar-icons/filled/home-2.svg',
      submenus: [],
      roles: ['student'],
      short_name: ''
    },
    {
      id: 'All India Mock Tests',
      href: '/all-india-mock-test',
      label: 'All India Mock Test',
      active: pathname.includes('/all-india-mock-test'),
      icon: '/images/icon/sidebar-icons/outline/award.svg',
      filledIcon: '/images/icon/sidebar-icons/filled/award.svg',
      submenus: [],
      roles: ['student'],
      short_name: 'aimt'
    },
    {
      id: 'previous-year',
      href: 'previous-year',
      label: 'Previous Year Test',
      active: pathname.includes('/previous-year'),
      icon: '/images/icon/sidebar-icons/outline/calendar.svg',
      filledIcon: '/images/icon/sidebar-icons/filled/calendar.svg',
      submenus: [],
      roles: ['student'],
      short_name: 'pyt'
    },
    {
      id: 'concept-test',
      href: 'concept-test',
      label: 'Concept Test',
      active: pathname.includes('/concept-test'),
      icon: '/images/icon/sidebar-icons/outline/lamp-charge.svg',
      filledIcon: '/images/icon/sidebar-icons/filled/lamp-charge.svg',
      submenus: [],
      roles: ['student'],
      short_name: 'conwt',
      isNew: true
    },
    {
      id: 'generate-test',
      href: 'generate-test',
      label: 'Generate Test',
      active: pathname.includes('/generate-test'),
      icon: '/images/icon/sidebar-icons/outline/add-square.svg',
      filledIcon: '/images/icon/sidebar-icons/filled/add-square.svg',
      submenus: [],
      roles: ['student'],
      short_name: 'gt'
    },
    {
      id: 'chapter-wise-test',
      href: 'chapter-wise-test',
      label: 'Chapter wise Test',
      active: pathname.includes('/chapter-wise-test'),
      icon: '/images/icon/sidebar-icons/outline/book.svg',
      filledIcon: '/images/icon/sidebar-icons/filled/book.svg',
      submenus: [],
      roles: ['student'],
      short_name: 'cwt'
    },
    {
      id: 'overall-analysis',
      href: 'overall-analysis',
      label: 'Overall Analysis',
      active: pathname.includes('/overall-analysis'),
      icon: '/images/icon/sidebar-icons/outline/status-up.svg',
      filledIcon: '/images/icon/sidebar-icons/filled/status-up.svg',
      submenus: [],
      roles: ['student'],
      short_name: ''
    },
    {
      id: 'bookmarks',
      href: 'bookmarks',
      label: 'Bookmarks',
      active: pathname.includes('/bookmarks'),
      icon: '/images/icon/sidebar-icons/outline/bookmark.svg',
      filledIcon: '/images/icon/sidebar-icons/filled/bookmark.svg',
      submenus: [],
      roles: ['student'],
      short_name: ''
    }
  ];

  return studentMenu;
}

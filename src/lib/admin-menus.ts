import { Roles } from '@/types/enum';

export function getAdminMenus(pathname: string) {
  //admin
  const adminMenu = [
    {
      id: 'admin-dashboard',
      href: '/admin/dashboard',
      label: 'dashboard',
      active: pathname.includes('/admin/dashboard'),
      icon: '/images/icon/sidebar-icons/outline/home-2.svg',
      filledIcon: '/images/icon/sidebar-icons/filled/home-2.svg',
      submenus: [],
      roles: ['admin']
    },
    {
      id: 'admin-exams',
      href: '/admin/exams',
      label: 'exams',
      active: pathname.includes('/admin/exams'),
      icon: '/images/icon/sidebar-icons/outline/book.svg',
      filledIcon: '/images/icon/sidebar-icons/filled/book.svg',
      submenus: [],
      roles: ['admin', Roles.FACULTY]
    },
    {
      id: 'admin-students',
      href: '/admin/students',
      label: 'students',
      active: pathname.includes('/admin/students'),
      icon: '/images/icon/sidebar-icons/outline/teacher.svg',
      filledIcon: '/images/icon/sidebar-icons/filled/teacher-1.svg',
      submenus: [],
      roles: ['admin']
    },
    {
      id: 'admin-academic',
      href: '/admin/academic',
      label: 'academic setup',
      active: pathname.includes('/admin/academic'),
      icon: '/images/icon/sidebar-icons/outline/setting-2.svg',
      filledIcon: '/images/icon/sidebar-icons/filled/setting-2-1.svg',
      submenus: [],
      roles: ['admin']
    },
    {
      id: 'admin-faculty',
      href: '/admin/faculty',
      label: 'faculty',
      active: pathname.includes('/admin/faculty'),
      icon: '/images/icon/sidebar-icons/outline/user.svg',
      filledIcon: '/images/icon/sidebar-icons/filled/user.svg',
      submenus: [],
      roles: ['admin']
    },
    {
      id: 'admin-carousel',
      href: '/admin/carousel',
      label: 'Carousel',
      active: pathname.includes('/admin/carousel'),
      icon: '/images/icon/sidebar-icons/outline/slider-horizontal.svg',
      filledIcon: '/images/icon/sidebar-icons/filled/slider-horizontal.svg',
      submenus: [],
      roles: ['admin']
    },
    // {
    //   id: 'admin-influencer',
    //   href: '/admin/influencer',
    //   label: 'Influencer',
    //   active: pathname.includes('/admin/influencer'),
    //   icon: '/images/icon/sidebar-icons/outline/profile-2user.svg',
    //   filledIcon: '/images/icon/sidebar-icons/filled/profile-2user.png',
    //   submenus: [],
    //   roles: ['admin']
    // },
    {
      id: 'admin-uploads',
      href: '/admin/uploads',
      label: 'uploads',
      active: pathname.includes('/admin/uploads'),
      icon: '/images/icon/sidebar-icons/outline/send-square.svg',
      filledIcon: '/images/icon/sidebar-icons/filled/send-square.svg',
      submenus: [],
      roles: ['admin']
    },
    // {
    //   id: 'admin-package',
    //   href: '/admin/packages',
    //   label: 'Packages',
    //   active: pathname.includes('/admin/packages'),
    //   icon: '/images/icon/sidebar-icons/outline/box.svg',
    //   filledIcon: '/images/icon/sidebar-icons/filled/box-1.svg',
    //   submenus: [],
    //   roles: ['admin']
    // },
    // {
    //   id: 'admin-subscriptions',
    //   href: '/admin/subscriptions',
    //   label: 'Subscriptions',
    //   active: pathname.includes('/admin/subscriptions'),
    //   icon: '/images/icon/sidebar-icons/outline/wallet.svg',
    //   filledIcon: '/images/icon/sidebar-icons/filled/wallet-1.svg',
    //   submenus: [],
    //   roles: ['admin']
    // },
    // {
    //   id: 'admin-coupons',
    //   href: '/admin/coupons',
    //   label: 'Coupons',
    //   active: pathname.includes('/admin/coupons'),
    //   icon: '/images/icon/sidebar-icons/outline/ticket.svg',
    //   filledIcon: '/images/icon/sidebar-icons/filled/ticket-1.svg',
    //   submenus: [],
    //   roles: ['admin']
    // },
    // {
    //   id: 'admin-referrals',
    //   href: '/admin/referrals',
    //   label: 'Referrals',
    //   active: pathname.includes('/admin/referrals'),
    //   icon: '/images/icon/sidebar-icons/outline/format-square.svg',
    //   filledIcon: '/images/icon/sidebar-icons/filled/format-square-1.svg',
    //   submenus: [],
    //   roles: ['admin']
    // },
    // {
    //   id: 'admin-purchase-history',
    //   href: '/admin/purchase-history',
    //   label: 'Purchase History',
    //   active: pathname.includes('/admin/purchase-history'),
    //   icon: '/images/icon/sidebar-icons/outline/shopping-cart.svg',
    //   filledIcon: '/images/icon/sidebar-icons/filled/shopping-cart-1.svg',
    //   submenus: [],
    //   roles: ['admin']
    // },
    {
      id: 'admin-monetization',
      href: '',
      label: 'Monetization',
      active: false,
      icon: '/images/icon/sidebar-icons/outline/box.svg',
      filledIcon: '/images/icon/sidebar-icons/filled/box-1.svg',
      roles: ['admin'],
      submenus: [
        {
          id: 'admin-package',
          href: '/admin/packages',
          label: 'Packages',
          icon: '',
          active: pathname.includes('/admin/packages'),
          children: []
        },
        {
          id: 'admin-subscriptions',
          href: '/admin/subscriptions',
          label: 'Subscriptions',
          icon: '',
          active: pathname.includes('/admin/subscriptions'),
          children: []
        },
        {
          id: 'admin-coupons',
          href: '/admin/coupons',
          label: 'Coupons',
          icon: '',
          active: pathname.includes('/admin/coupons'),
          children: []
        },
        {
          id: 'admin-referrals',
          href: '/admin/referrals',
          label: 'Referrals',
          active: pathname.includes('/admin/referrals'),
          icon: '/images/icon/sidebar-icons/outline/format-square.svg',
          // filledIcon: '/images/icon/sidebar-icons/filled/format-square-1.svg',
          children: []
        },
        {
          id: 'admin-influencer',
          href: '/admin/influencer',
          label: 'Influencer',
          active: pathname.includes('/admin/influencer'),
          icon: '/images/icon/sidebar-icons/outline/profile-2user.svg',
          children: []
        },
        {
          id: 'admin-purchase-history',
          href: '/admin/purchase-history',
          label: 'Purchase History',
          icon: '',
          active: pathname.includes('/admin/purchase-history'),
          children: []
        }
      ]
    }
  ];

  return adminMenu;
}

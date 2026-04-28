export const NAV_LINKS = [
  { href: '/',             label: 'Home' },
  { href: '/clusters',    label: 'Clusters' },
  { href: '/performance', label: 'Performance' },
  { href: '/debug',       label: 'Debug' },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];

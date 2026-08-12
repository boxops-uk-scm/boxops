/**
 * Shared fixture pieces.
 *
 * Every hover card names a person, so each of their stories would otherwise repeat the same
 * fifteen-field employee block. Typed loosely on purpose: each story asserts its own fixture
 * against its generated `rawResponse`, which is where the real checking happens — these are just
 * the values.
 */
export const ADA = {
  id: 'user-1',
  fullName: 'Ada Lovelace',
  unixName: 'alovelace',
  initials: 'AL',
  email: 'alovelace@boxops.co.uk',
  phoneNumber: '+44 20 7946 0958',
  avatarUrl: '/avatar-1.jpg',
  organization: 'Analytical Engines',
  jobTitle: 'Principal Engineer',
  reportsTo: { id: 'user-2', fullName: 'Charles Babbage' },
  location: 'London, UK',
  timezone: 'Europe/London',
  startedAt: '2021-03-01T09:00:00.000Z',
  status: 'AVAILABLE',
} as const;

export const GRACE = {
  ...ADA,
  id: 'user-3',
  fullName: 'Grace Hopper',
  unixName: 'ghopper',
  initials: 'GH',
  email: 'ghopper@boxops.co.uk',
  avatarUrl: '/avatar-2.jpg',
  jobTitle: 'Distinguished Engineer',
  organization: 'Compilers',
  status: 'BUSY',
} as const;

export const ALAN = {
  ...ADA,
  id: 'user-4',
  fullName: 'Alan Turing',
  unixName: 'aturing',
  initials: 'AT',
  email: 'aturing@boxops.co.uk',
  avatarUrl: '/avatar-3.jpg',
  jobTitle: 'Staff Engineer',
  organization: 'Cryptanalysis',
  status: 'AWAY',
} as const;

/**
 * Shared fixture pieces.
 *
 * Every hover card names a person, so each of their stories would otherwise repeat the same
 * fifteen-field employee block. Typed loosely on purpose: each story asserts its own fixture
 * against its generated `rawResponse`, which is where the real checking happens — these are just
 * the values.
 *
 * The reporting line is a **cycle**: Ada reports to Charles, Charles to Grace, Grace to Alan, and
 * Alan back to Ada. A manager's card is itself a card, so a visitor can walk upwards forever; any
 * chain that ended would need either a person nobody hard-coded or a card that fails to open. Four
 * people closing the loop keeps every step resolvable from records that are all written here.
 *
 * Nobody would draw this org chart, but the alternative — a root with no manager — hides the
 * recursive case, which is the one that breaks.
 */

/** Written out in full, so `reportsTo` points at somebody every field of whom is known. */
const COMMON = {
  phoneNumber: '+44 20 7946 0958',
  location: 'London, UK',
  timezone: 'Europe/London',
  startedAt: '2021-03-01T09:00:00.000Z',
} as const;

export const ADA = {
  ...COMMON,
  id: 'user-1',
  fullName: 'Ada Lovelace',
  unixName: 'alovelace',
  initials: 'AL',
  email: 'alovelace@boxops.co.uk',
  avatarUrl: '/avatar-1.jpg',
  organization: 'Analytical Engines',
  jobTitle: 'Principal Engineer',
  reportsTo: { id: 'user-2', fullName: 'Charles Babbage' },
  status: 'AVAILABLE',
} as const;

export const CHARLES = {
  ...COMMON,
  id: 'user-2',
  fullName: 'Charles Babbage',
  unixName: 'cbabbage',
  initials: 'CB',
  email: 'cbabbage@boxops.co.uk',
  avatarUrl: '/avatar-4.jpg',
  organization: 'Analytical Engines',
  jobTitle: 'Engineering Director',
  reportsTo: { id: 'user-3', fullName: 'Grace Hopper' },
  status: 'AWAY',
} as const;

export const GRACE = {
  ...COMMON,
  id: 'user-3',
  fullName: 'Grace Hopper',
  unixName: 'ghopper',
  initials: 'GH',
  email: 'ghopper@boxops.co.uk',
  avatarUrl: '/avatar-2.jpg',
  organization: 'Compilers',
  jobTitle: 'Distinguished Engineer',
  reportsTo: { id: 'user-4', fullName: 'Alan Turing' },
  status: 'BUSY',
} as const;

export const ALAN = {
  ...COMMON,
  id: 'user-4',
  fullName: 'Alan Turing',
  unixName: 'aturing',
  initials: 'AT',
  email: 'aturing@boxops.co.uk',
  avatarUrl: '/avatar-3.jpg',
  organization: 'Cryptanalysis',
  jobTitle: 'Staff Engineer',
  reportsTo: { id: 'user-1', fullName: 'Ada Lovelace' },
  status: 'AVAILABLE',
} as const;

export const EVERYONE = [ADA, CHARLES, GRACE, ALAN] as const;

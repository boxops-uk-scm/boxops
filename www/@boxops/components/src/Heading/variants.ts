import '../tokens.stylex';

import * as stylex from '@stylexjs/stylex';

export const variants = stylex.create({
  h1: {
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: '24px',
    letterSpacing: 0,
  },
  h2: {
    fontWeight: 600,
    fontSize: '18px',
    lineHeight: '24px',
    letterSpacing: 0,
  },
  h3: {
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '20px',
    letterSpacing: 0,
  },
  h4: {
    fontWeight: 'bold',
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: 0,
  },
  title: {
    fontWeight: 600,
    fontSize: '32px',
    lineHeight: '48px',
    letterSpacing: 0,
  },
  section: {
    fontWeight: 600,
    fontSize: '24px',
    lineHeight: '32px',
    letterSpacing: 0,
  },
  content: {
    fontWeight: 'bold',
    fontSize: '20px',
    lineHeight: '28px',
    letterSpacing: 0,
  },
  group: {
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: 0,
  },
});

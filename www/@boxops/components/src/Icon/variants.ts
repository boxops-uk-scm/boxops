import * as stylex from '@stylexjs/stylex';

export const variants = {
  size: stylex.create({
    inline: {
      width: '0.8em',
      height: '0.8em',
    },
    S: {
      width: '16px',
      height: '16px',
    },
    M: {
      width: '20px',
      height: '20px',
    },
    L: {
      width: '24px',
      height: '24px',
    },
    XL: {
      width: '32px',
      height: '32px',
    },
    XXL: {
      width: '48px',
      height: '48px',
    },
  }),
};

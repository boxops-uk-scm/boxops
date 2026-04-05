import * as stylex from '@stylexjs/stylex';

import { gap } from '../tokens.stylex';


export const variants = {
  gap: stylex.create({
    XXS: {
      gap: gap.XXS,
    },
    XS: {
      gap: gap.XS,
    },
    S: {
      gap: gap.S,
    },
    M: {
      gap: gap.M,
    },
    L: {
      gap: gap.L,
    },
    XL: {
      gap: gap.XL,
    },
    XXL: {
      gap: gap.XXL,
    },
  }),
  direction: stylex.create({
    row: {
      flexDirection: 'row',
    },
    column: {
      flexDirection: 'column',
    },
    rowReverse: {
      flexDirection: 'row-reverse',
    },
    columnReverse: {
      flexDirection: 'column-reverse',
    },
  }),
  alignItems: stylex.create({
    start: {
      alignItems: 'flex-start',
    },
    center: {
      alignItems: 'center',
    },
    end: {
      alignItems: 'flex-end',
    },
    baseline: {
      alignItems: 'baseline',
    },
    stretch: {
      alignItems: 'stretch',
    },
  }),
  justifyContent: stylex.create({
    start: {
      justifyContent: 'flex-start',
    },
    center: {
      justifyContent: 'center',
    },
    end: {
      justifyContent: 'flex-end',
    },
    spaceBetween: {
      justifyContent: 'space-between',
    },
    spaceEvenly: {
      justifyContent: 'space-evenly',
    },
    spaceAround: {
      justifyContent: 'space-around',
    },
  }),
};

import * as stylex from '@stylexjs/stylex';

import { vars } from './vars.stylex';

const baseStyles = stylex.create({
  base: {
    display: 'block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: vars.fill,
  },
});

export default function Dot() {
  return <div aria-hidden {...stylex.props(baseStyles.base)} />;
}

import { forwardRef } from 'react';

import Icon, { type Props } from '../Icon';

import Default from './Default';

const Dot = forwardRef<HTMLDivElement, Props>((props, ref) => (
  <Icon outline={Default} solid={Default} ref={ref} {...props} />
));

Dot.displayName = 'Dot';

export default Dot;

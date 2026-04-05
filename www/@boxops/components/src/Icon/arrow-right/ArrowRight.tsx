import { forwardRef } from 'react';

import Icon, { type Props } from '../Icon';

import Outline from './Outline';
import Solid from './Solid';

const ArrowRight = forwardRef<HTMLDivElement, Props>((props, ref) => (
  <Icon outline={Outline} solid={Solid} ref={ref} {...props} />
));

ArrowRight.displayName = 'ArrowRight';

export default ArrowRight;

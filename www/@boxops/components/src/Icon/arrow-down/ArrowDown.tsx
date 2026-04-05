import { forwardRef } from 'react';

import { Outline, Solid } from '../arrow-down-left';
import Icon, { type Props } from '../Icon';

const ArrowDown = forwardRef<HTMLDivElement, Props>((props, ref) => (
  <Icon outline={Outline} solid={Solid} ref={ref} {...props} />
));

ArrowDown.displayName = 'ArrowDown';

export default ArrowDown;

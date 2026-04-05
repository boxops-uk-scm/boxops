import { forwardRef } from 'react';

import Icon, { type Props } from '../Icon';

import Outline from './Outline';
import Solid from './Solid';

const PauseCircle = forwardRef<HTMLDivElement, Props>((props, ref) => (
  <Icon outline={Outline} solid={Solid} ref={ref} {...props} />
));

PauseCircle.displayName = 'PauseCircle';

export default PauseCircle;

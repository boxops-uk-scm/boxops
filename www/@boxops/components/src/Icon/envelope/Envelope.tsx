import { forwardRef } from 'react';

import Icon, { type Props } from '../Icon';

import Outline from './Outline';
import Solid from './Solid';

const Envelope = forwardRef<HTMLDivElement, Props>((props, ref) => (
  <Icon outline={Outline} solid={Solid} ref={ref} {...props} />
));

Envelope.displayName = 'Envelope';

export default Envelope;

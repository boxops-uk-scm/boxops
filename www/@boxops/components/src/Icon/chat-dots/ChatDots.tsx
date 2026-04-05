import { forwardRef } from 'react';

import Icon, { type Props } from '../Icon';

import Outline from './Outline';
import Solid from './Solid';

const ChatDots = forwardRef<HTMLDivElement, Props>((props, ref) => (
  <Icon outline={Outline} solid={Solid} ref={ref} {...props} />
));

ChatDots.displayName = 'ChatDots';

export default ChatDots;

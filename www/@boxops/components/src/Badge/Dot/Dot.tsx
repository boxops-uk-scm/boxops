import * as stylex from '@stylexjs/stylex';
import { forwardRef } from 'react';

import { styles } from './styles';

const Dot = forwardRef<HTMLDivElement, object>((_, ref) => <div ref={ref} {...stylex.props(styles.base)} />);

export default Dot;

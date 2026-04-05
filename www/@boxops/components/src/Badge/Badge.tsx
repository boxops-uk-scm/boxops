import * as stylex from '@stylexjs/stylex';
import { forwardRef } from 'react';

import Flexbox from '../Flexbox';
import Text from '../Text';

import { styles } from './styles';
import { variants } from './variants';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  color?: keyof typeof variants.color;
  xstyle?: stylex.StyleXStyles;
  startContent?: React.ReactNode;
}

const Badge = forwardRef<HTMLDivElement, Props>(({ label, startContent, color, xstyle }: Props, ref) => (
  <Flexbox
    ref={ref}
    justifyContent="center"
    alignItems="center"
    gap="XS"
    xstyle={[styles.base, color && variants.color[color], color && styles.dot, xstyle]}
  >
    {startContent}
    <Text as="small" xstyle={[Text.styles.unselectable, styles.label]}>
      {label}
    </Text>
  </Flexbox>
));

Badge.displayName = 'Badge';

export default Badge;

import { Tooltip as BaseTooltip } from '@base-ui/react';
import * as stylex from '@stylexjs/stylex';
import React from 'react';

import Text from '../Text';

import { styles } from './styles';

export interface Props {
  style?: stylex.StyleXStyles;
  label: React.ReactNode;
  trigger: React.ReactElement;
}

const Tooltip: React.FC<Props> = ({ label, trigger, style }) => (
  <BaseTooltip.Root>
    <BaseTooltip.Trigger render={trigger}></BaseTooltip.Trigger>
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner sideOffset={5}>
        <BaseTooltip.Popup {...stylex.props(styles.base, style)}>
          <Text xstyle={styles.label}>{label}</Text>
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  </BaseTooltip.Root>
);

Tooltip.displayName = 'Tooltip';

export default Tooltip;

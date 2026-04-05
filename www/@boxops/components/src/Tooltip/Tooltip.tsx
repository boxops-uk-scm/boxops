import { Tooltip as BaseTooltip } from '@base-ui/react';
import * as stylex from '@stylexjs/stylex';
import React from 'react';

import Text from '../Text';

import { styles } from './styles';

export interface Props {
  xstyle?: stylex.StyleXStyles;
  label: React.ReactNode;
  trigger: React.ReactElement;
  'aria-label': string;
  closeOnClick?: boolean;
  onOpenChangeComplete?: (open: boolean) => void;
}

const Tooltip: React.FC<Props> = ({
  label,
  trigger,
  xstyle,
  'aria-label': ariaLabel,
  closeOnClick,
  onOpenChangeComplete,
}) => (
  <BaseTooltip.Root onOpenChangeComplete={onOpenChangeComplete}>
    <BaseTooltip.Trigger aria-label={ariaLabel} render={trigger} closeOnClick={closeOnClick}></BaseTooltip.Trigger>
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner sideOffset={5}>
        <BaseTooltip.Popup {...stylex.props(styles.base, xstyle)}>
          <Text xstyle={styles.label}>{label}</Text>
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  </BaseTooltip.Root>
);

Tooltip.displayName = 'Tooltip';

export default Tooltip;

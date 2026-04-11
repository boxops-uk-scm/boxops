import { Tooltip as BaseTooltip } from '@base-ui/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Text } from '../Text';
import { backgroundColor, textColor } from '../tokens.stylex';
import * as bx from '../types';

import type { Side } from '@base-ui/utils';

const baseStyles = stylex.create({
  root: {
    display: 'contents',
  },
  base: {
    width: 'fit-content',
    borderRadius: '12px',
    padding: '4px 8px',
    backgroundColor: backgroundColor.tooltip,
    userSelect: 'none',
    zIndex: 200,
  },
  label: {
    fontSize: '15px',
    lineHeight: '1',
    color: textColor.tooltip,
  },
});

const Tooltip = Object.assign(
  React.memo(function Tooltip({
    label,
    'aria-label': ariaLabel,
    trigger,
    closeOnClick,
    onOpenChangeComplete,
    side = 'top',
    xstyle,
  }: Tooltip.Props) {
    const styles = [bx.useComponentStyle(baseStyles.base, xstyle)];

    return (
      <span {...stylex.props(baseStyles.root)}>
        <BaseTooltip.Root onOpenChangeComplete={onOpenChangeComplete}>
          <BaseTooltip.Trigger
            aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}
            render={trigger}
            closeOnClick={closeOnClick}
          ></BaseTooltip.Trigger>
          <BaseTooltip.Portal>
            <BaseTooltip.Positioner sideOffset={5} side={side}>
              <BaseTooltip.Popup {...stylex.props(styles)}>
                <Text xstyle={baseStyles.label}>{label}</Text>
              </BaseTooltip.Popup>
            </BaseTooltip.Positioner>
          </BaseTooltip.Portal>
        </BaseTooltip.Root>
      </span>
    );
  }),
  {
    styles: baseStyles,
  },
);

namespace Tooltip {
  export interface Props {
    xstyle?: stylex.StyleXStyles;
    label?: React.ReactNode;
    'aria-label'?: string;
    trigger: React.ReactElement;
    closeOnClick?: boolean;
    side?: Side;
    onOpenChangeComplete?: (open: boolean) => void;
  }
}

export default Tooltip;

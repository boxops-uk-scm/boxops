import { SSR as Phosphor } from '@phosphor-icons/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Flexbox } from '../Flexbox';
import { Heading } from '../Heading';
import { Icon } from '../Icon';
import { Spinner } from '../Spinner';
import { Text } from '../Text';
import { backgroundColor, iconColor, semanticColor } from '../tokens.stylex';
import * as bx from '../types';

// Longhand animation properties: StyleX drops the `animation` shorthand, which left the v2 source's
// indeterminate bar sitting motionless at the left edge.
const indeterminate = stylex.keyframes({
  from: { left: '-30%', right: '110%' },
  to: { left: '110%', right: '-30%' },
});

const baseStyles = stylex.create({
  base: {
    width: '100%',
  },
  track: {
    position: 'relative',
    height: '8px',
    borderRadius: '4px',
    flexGrow: 1,
    backgroundColor: backgroundColor.overlay,
  },
  indeterminate: {
    overflow: 'hidden',
    '::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height: '8px',
      borderRadius: '4px',
      backgroundColor: semanticColor.accent,
      animationName: indeterminate,
      animationDuration: '3s',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'ease-in-out',
    },
  },
  bar: (percent: number) => ({
    width: `${percent}%`,
    height: '8px',
    borderRadius: '4px',
  }),
  label: {
    lineHeight: '20px',
  },
});

const barStyles = stylex.create({
  'in-progress': { backgroundColor: semanticColor.accent },
  paused: { backgroundColor: iconColor.secondary },
  error: { backgroundColor: semanticColor.negative },
  complete: { backgroundColor: semanticColor.positive },
});

const iconStyles = stylex.create({
  paused: { color: iconColor.secondary },
  error: { color: semanticColor.negative },
  complete: { color: semanticColor.positive },
});

function StatusIcon({ status }: { status: Meter.Status }) {
  switch (status) {
    case 'error':
      return <Icon as={Phosphor.WarningIcon} weight="fill" variants={{ size: 'S' }} xstyle={iconStyles.error} />;
    case 'complete':
      return <Icon as={Phosphor.CheckCircleIcon} weight="fill" variants={{ size: 'S' }} xstyle={iconStyles.complete} />;
    case 'paused':
      return <Icon as={Phosphor.PauseCircleIcon} weight="fill" variants={{ size: 'S' }} xstyle={iconStyles.paused} />;
    case 'in-progress':
      return <Spinner variants={{ size: 'S', color: 'onLightMedia' }} />;
    default:
      return null;
  }
}

const Meter = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, Meter.Props>(function Meter(
      { status, value, label, xstyle, ...rest },
      ref,
    ) {
      const percent = Math.round(100 * Math.max(0, Math.min(1, value)));
      const isIndeterminate = status === 'indeterminate';

      return (
        <Flexbox
          variants={label ? { direction: 'column', gap: 'XS' } : { direction: 'row', gap: 'S', alignItems: 'center' }}
          xstyle={baseStyles.base}
        >
          <div
            ref={ref}
            role="progressbar"
            aria-valuenow={isIndeterminate ? undefined : percent}
            aria-valuemin={0}
            aria-valuemax={100}
            {...stylex.props(baseStyles.track, isIndeterminate && baseStyles.indeterminate, xstyle)}
            {...rest}
          >
            {!isIndeterminate && <div {...stylex.props(baseStyles.bar(percent), barStyles[status])} />}
          </div>
          <Flexbox variants={{ alignItems: 'center', gap: 'S' }}>
            <StatusIcon status={status} />
            {!isIndeterminate && <Heading as="h4">{percent}%</Heading>}
            {label && (
              <>
                {!isIndeterminate && <Text xstyle={baseStyles.label}>-</Text>}
                <Text as="small" variants={{ color: 'subtle' }} xstyle={baseStyles.label}>
                  {label}
                </Text>
              </>
            )}
          </Flexbox>
        </Flexbox>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace Meter {
  export type Status = 'indeterminate' | 'in-progress' | 'paused' | 'error' | 'complete';

  export interface Props extends Omit<bx.ComponentProps<'div'>, 'children'> {
    status: Status;
    /** Fraction between 0 and 1. Clamped, then rounded to a whole percent. */
    value: number;
    label?: React.ReactNode;
  }
}

export default Meter;

import * as stylex from '@stylexjs/stylex';
import { formatInTimeZone } from 'date-fns-tz';
import * as React from 'react';

import { Text } from '../Text';
import * as bx from '../types';

import type { PolyRefFunction } from 'react-polymorphed';

const forwardRef = React.forwardRef as PolyRefFunction;

const baseStyles = stylex.create({
  base: {},
});

const DEFAULT_FORMAT_STRING = 'EEE, MMM do yyyy, h:mm aa (xx)';

const DateTime = Object.assign(
  React.memo(
    forwardRef<DateTime.Default, DateTime.BaseProps, DateTime.OnlyAs>(function DateTime(
      { as: As = 'span', instant, formatString, timezone, xstyle, variants, ...rest },
      ref,
    ) {
      const state: DateTime.State = { variants, as: As, instant, formatString };

      const styles = [
        baseStyles.base,
        bx.usePolyComponentStyle<DateTime.Default, DateTime.State, DateTime.OnlyAs>(state, undefined, xstyle),
      ];

      timezone = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

      formatString = formatString || DEFAULT_FORMAT_STRING;

      // const europeLondon = formatInTimeZone(instant, 'Europe/London', DEFAULT_FORMAT_STRING);
      // const usPacific = formatInTimeZone(instant, 'US/Pacific', DEFAULT_FORMAT_STRING);
      // const usEastern = formatInTimeZone(instant, 'US/Eastern', DEFAULT_FORMAT_STRING);
      // const iso8601 = instant.toISOString();

      return (
        <Text ref={ref} xstyle={styles} {...rest}>
          {formatInTimeZone(instant, timezone, formatString)}
        </Text>
      );
    }),
  ),
  {
    variants: Text.variants,
    styles: baseStyles,
  },
);

namespace DateTime {
  export type Variants = Text.Variants;

  export interface State extends bx.VariantPolyComponentState<Variants> {
    instant: Date;
    formatString: string;
  }

  export interface BaseProps extends Omit<Text.BaseProps, 'children'> {
    instant: Date;
    formatString: string;
    timezone?: string;
  }

  export type Default = Text.Default;

  export type OnlyAs = Text.OnlyAs;

  export type Props<E extends React.ElementType = Default> = bx.VariantPolyComponentProps<E, Variants, State, BaseProps>;
}

export default DateTime;

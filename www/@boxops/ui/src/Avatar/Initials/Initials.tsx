import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Flexbox } from '../../Flexbox';
import { Text } from '../../Text';
import * as bx from '../../types';
import { getVariant, variants, type Variant } from '../variants';
import { vars } from '../vars.stylex';

const baseStyles = stylex.create({
  base: {
    backgroundColor: vars.backgroundColor,
    width: '100%',
    borderRadius: '50%',
  },
  // Inherits the avatar's size variant, which sets the font metrics.
  label: {
    fontSize: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
    userSelect: 'none',
  },
});

const Initials = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, Initials.Props>(function Initials(
      { initials, variant, xstyle, ...rest },
      ref,
    ) {
      const styles = [baseStyles.base, variants[variant ?? getVariant(initials)], xstyle];

      return (
        <Flexbox ref={ref} variants={{ alignItems: 'center', justifyContent: 'center' }} xstyle={styles} {...rest}>
          <Text xstyle={baseStyles.label}>{initials}</Text>
        </Flexbox>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace Initials {
  export interface Props extends Omit<bx.ComponentProps<'div'>, 'children'> {
    initials: string;
    /** Defaults to a tint derived from `initials`, so a person keeps the same colour. */
    variant?: Variant;
  }
}

export default Initials;

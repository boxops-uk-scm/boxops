import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Flexbox } from '../../Flexbox';
import { Icon as UIIcon } from '../../Icon';
import * as bx from '../../types';
import { getVariant, variants, type Variant } from '../variants';
import { vars } from '../vars.stylex';

import type * as Phosphor from '@phosphor-icons/react';

const baseStyles = stylex.create({
  base: {
    backgroundColor: vars.backgroundColor,
    width: '100%',
    borderRadius: '50%',
  },
  // The tint at full opacity, so the glyph reads as the saturated version of its own background.
  icon: {
    width: vars.iconSize,
    height: vars.iconSize,
    color: `oklch(from ${vars.backgroundColor} l c h / 100%)`,
  },
});

const AvatarIcon = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, AvatarIcon.Props>(function AvatarIcon(
      { icon, seed, variant, xstyle, ...rest },
      ref,
    ) {
      const styles = [baseStyles.base, variants[variant ?? getVariant(seed)], xstyle];

      return (
        <Flexbox ref={ref} variants={{ alignItems: 'center', justifyContent: 'center' }} xstyle={styles} {...rest}>
          <UIIcon as={icon} weight="fill" xstyle={baseStyles.icon} />
        </Flexbox>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace AvatarIcon {
  export interface Props extends Omit<bx.ComponentProps<'div'>, 'children'> {
    icon: React.FC<Phosphor.IconProps>;
    /** Seeds the fallback tint. Phosphor icons carry no stable name, so callers supply one. */
    seed?: string;
    variant?: Variant;
  }
}

export default AvatarIcon;

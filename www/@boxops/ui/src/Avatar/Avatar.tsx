import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Flexbox } from '../Flexbox';
import { StatusDot } from '../StatusDot';
import { backgroundColor } from '../tokens.stylex';
import * as bx from '../types';

import { vars } from './vars.stylex';

const variantStyles = {
  size: stylex.create({
    XS: { minWidth: '24px', height: '24px', fontWeight: 600, fontSize: '10px', lineHeight: '14px', outlineWidth: '2px', [vars.iconSize]: '16px' },
    S: { minWidth: '32px', height: '32px', fontWeight: 600, fontSize: '12px', lineHeight: '16px', outlineWidth: '2px', [vars.iconSize]: '16px' },
    M: { minWidth: '36px', height: '36px', fontWeight: 600, fontSize: '14px', lineHeight: '20px', outlineWidth: '2px', [vars.iconSize]: '20px' },
    L: { minWidth: '40px', height: '40px', fontWeight: 600, fontSize: '14px', lineHeight: '20px', outlineWidth: '2px', [vars.iconSize]: '24px' },
    XL: { minWidth: '48px', height: '48px', fontWeight: 600, fontSize: '14px', lineHeight: '20px', outlineWidth: '3px', [vars.iconSize]: '24px' },
    XXL: { minWidth: '60px', height: '60px', fontWeight: 700, fontSize: '16px', lineHeight: '24px', outlineWidth: '3px', [vars.iconSize]: '32px' },
    XXXL: { minWidth: '128px', height: '128px', fontWeight: 700, fontSize: '24px', lineHeight: '32px', outlineWidth: '4px', [vars.iconSize]: '64px' },
  }),
} as const satisfies bx.VariantStyles;

const baseStyles = stylex.create({
  base: {
    display: 'inline-flex',
    position: 'relative',
    borderRadius: '50%',
    marginLeft: '4px',
    marginRight: '4px',
    // The ring exists so overlapping avatars read as separate, so it is the ground they sit on
    // rather than literal white — otherwise it draws a white halo on a dark surface.
    outlineStyle: 'solid',
    outlineColor: backgroundColor.surface,
    '::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      pointerEvents: 'none',
      borderRadius: '50%',
      backgroundColor: vars.overlayColor,
      // Raised above the face. Generated content is a positioned descendant like the image wrapper
      // is, and positioned descendants paint in tree order — so without this the overlay sits
      // *under* the photograph and only shows through an avatar drawn from initials.
      zIndex: 1,
    },
  },
  darkenOnHover: {
    [vars.overlayColor]: {
      default: null,
      ':hover': backgroundColor.overlay,
    },
  },
  // Above the hover overlay: whether somebody is available is a fact about them, not part of the
  // picture, so it should not dim along with the face.
  status: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
});

/** The status dot is sized off the avatar, so the two never drift apart. */
const STATUS_DOT_SIZE = {
  XS: 'S',
  S: 'S',
  M: 'S',
  L: 'M',
  XL: 'L',
  XXL: 'L',
  XXXL: 'XL',
} as const satisfies Record<Avatar.Size, NonNullable<StatusDot.Variants['size']>>;

const STATUS_DOT_STATUS = {
  available: 'success',
  away: 'warning',
  busy: 'error',
  offline: 'neutral',
} as const satisfies Record<Avatar.Status, NonNullable<StatusDot.Variants['status']>>;

const Avatar = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, Avatar.Props>(function Avatar(
      { status, darkenOnHover, children, variants, xstyle, ...rest },
      ref,
    ) {
      const size = variants?.size ?? 'XS';
      const state: Avatar.State = { variants };

      const styles = [
        baseStyles.base,
        bx.useVariantStyle<Avatar.Variants>(variantStyles, variants, { size: 'XS' }),
        darkenOnHover && baseStyles.darkenOnHover,
        bx.useComponentStyleWithState<Avatar.State>(state, xstyle),
      ];

      return (
        <Flexbox ref={ref} xstyle={styles} {...rest}>
          {children}
          {status && (
            <StatusDot
              xstyle={baseStyles.status}
              variants={{ status: STATUS_DOT_STATUS[status], size: STATUS_DOT_SIZE[size] }}
            />
          )}
        </Flexbox>
      );
    }),
  ),
  {
    variants: variantStyles,
    styles: baseStyles,
  },
);

namespace Avatar {
  export type Variants = bx.Variants<typeof variantStyles>;

  export type Size = keyof typeof variantStyles.size;

  export type Status = 'available' | 'away' | 'busy' | 'offline';

  export type State = bx.VariantComponentState<Variants>;

  export interface Props extends bx.VariantComponentPropsWithState<'div', Variants, State> {
    /** Renders a dot in the bottom-right corner. Sized from the avatar's own size. */
    status?: Status;
    darkenOnHover?: boolean;
  }
}

export default Avatar;

import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Avatar, AvatarInitials } from '../Avatar';
import * as bx from '../types';

/**
 * How far each face is pulled over the one before it, per size.
 *
 * An `Avatar` carries 4px of margin on each side, so neighbours already sit 8px apart; the first
 * 8px of this only closes that gap and the remainder is the actual overlap — about a fifth of the
 * disc at every size. The v1 original instead gave each avatar a wrapper *narrower* than its
 * content, which overlapped them by a single pixel: enough to prove the mechanism, not enough to
 * read as a group. The ring around each avatar is what keeps overlapping faces separate, and it
 * only earns its keep if they genuinely overlap.
 */
const overlapStyles = stylex.create({
  XS: { marginInlineStart: '-13px' },
  S: { marginInlineStart: '-14px' },
  M: { marginInlineStart: '-15px' },
  L: { marginInlineStart: '-16px' },
  XL: { marginInlineStart: '-18px' },
  XXL: { marginInlineStart: '-20px' },
  XXXL: { marginInlineStart: '-34px' },
});

/**
 * Cancels the first avatar's pull, so the group starts where it would have anyway.
 *
 * Every child is shifted, including the first — the alternative is a `:first-child` exception,
 * which would make the offset depend on how the children happen to be nested. Paying it back once
 * on the container keeps the shift uniform.
 */
const variantStyles = {
  size: stylex.create({
    XS: { paddingInlineStart: '13px' },
    S: { paddingInlineStart: '14px' },
    M: { paddingInlineStart: '15px' },
    L: { paddingInlineStart: '16px' },
    XL: { paddingInlineStart: '18px' },
    XXL: { paddingInlineStart: '20px' },
    XXXL: { paddingInlineStart: '34px' },
  }),
} as const satisfies bx.VariantStyles;

const baseStyles = stylex.create({
  base: {
    display: 'flex',
    alignItems: 'center',
  },
  // Each face sits above the one after it, so the stack reads left-to-right: an avatar overlaps
  // its follower rather than being cut into by it.
  item: {
    display: 'inline-flex',
    position: 'relative',
  },
});

const AvatarGroup = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'span'>, AvatarGroup.Props>(function AvatarGroup(
      { max = 4, variants, children, xstyle, ...rest },
      ref,
    ) {
      const size = variants?.size ?? 'XS';

      // Only elements: a stray string between avatars would be counted as a person and hidden
      // behind the overflow chip.
      const avatars = React.Children.toArray(children).filter((child): child is AvatarGroup.Child =>
        React.isValidElement(child),
      );

      const visible = avatars.slice(0, max);
      const hidden = avatars.length - visible.length;

      const styles = [
        baseStyles.base,
        bx.useVariantStyle<AvatarGroup.Variants>(variantStyles, variants, { size: 'XS' }),
        bx.useComponentStyle(baseStyles.base, xstyle),
      ];

      return (
        <span ref={ref} {...stylex.props(styles)} {...rest}>
          {visible.map((child, index) => (
            // The overlap depends on every face being the same width, so the group imposes its own
            // size rather than trusting each caller to have set the same one.
            <span
              key={child.key ?? index}
              // Later children paint below earlier ones, which `position: relative` alone would
              // reverse — the stacking order here is the source order, not the reverse of it.
              style={{ zIndex: visible.length - index }}
              {...stylex.props(baseStyles.item, overlapStyles[size])}
            >
              {React.cloneElement(child, { variants: { ...child.props.variants, size } })}
            </span>
          ))}
          {hidden > 0 && (
            <span {...stylex.props(baseStyles.item, overlapStyles[size])}>
              <Avatar variants={{ size }}>
                {/* Not the hashed tint the initials would otherwise pick: a count is not a person,
                    and colouring it like one implies it stands for somebody in particular. */}
                <AvatarInitials initials={`+${hidden}`} variant="gray" />
              </Avatar>
            </span>
          )}
        </span>
      );
    }),
  ),
  {
    variants: variantStyles,
    styles: baseStyles,
  },
);

namespace AvatarGroup {
  export type Variants = bx.Variants<typeof variantStyles>;

  export type Size = keyof typeof variantStyles.size;

  /** Anything that takes an avatar's `size` variant — `Avatar` itself, or `EmployeeAvatar`. */
  export type Child = React.ReactElement<{ variants?: { size?: Size } }>;

  export interface Props extends bx.VariantComponentProps<'span', Variants> {
    /** Faces to show before the rest collapse into a `+N` chip. */
    max?: number;
  }
}

export default AvatarGroup;

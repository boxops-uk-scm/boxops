import { Checkbox as CheckboxBase, Field } from '@base-ui/react';
import { SSR as Phosphor } from '@phosphor-icons/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Icon } from '../Icon';
import { backgroundColor, dividerColor, fontFamily, gap, outlineColor, semanticColor, textColor } from '../tokens.stylex';
import * as bx from '../types';

import { vars } from './vars.stylex';

/**
 * The two sizes `TextInput` has, so a checkbox and a field on the same form agree about what
 * "compact" means. The font lands on the row and is inherited by the label; the geometry lands on
 * vars, because the elements that need it are further down.
 *
 * The offsets are half the difference between the line box and the control: (24 - 16) / 2 and
 * (20 - 14) / 2. They are spelled out rather than derived from `1lh`, which would say the same thing
 * in one line but is only supported from Safari 16.4 and Firefox 120.
 */
const variantStyles = {
  size: stylex.create({
    default: {
      [vars.controlSize]: '16px',
      [vars.controlOffset]: '4px',
      [vars.glyphSize]: '12px',
      fontSize: '16px',
      lineHeight: '24px',
    },
    compact: {
      [vars.controlSize]: '14px',
      [vars.controlOffset]: '3px',
      [vars.glyphSize]: '10px',
      fontSize: '14px',
      lineHeight: '20px',
    },
  }),
} as const satisfies bx.VariantStyles;

/**
 * The hover treatment, in the two forms the box takes.
 *
 * Both are `color-mix` against `vars.hover`, which is `0%` at rest — so the same declaration covers
 * hovered and not, and there is no second value to keep in step. The empty box moves its border to
 * the accent, which is where it is heading if you tick it. The filled one shifts 5% toward the page
 * ink, which is the blend `Button` uses for every hover it has: it darkens on a light ground and
 * lightens on a dark one, rather than always heading for black.
 */
const RESTING_BORDER = `color-mix(in srgb, ${semanticColor.accent} ${vars.hover}, ${dividerColor.subtle})`;
const TICKED = `color-mix(in srgb, ${textColor.primary} calc(${vars.hover} * 0.05), ${semanticColor.accent})`;

/** `Button`'s disabled blend: halfway into the surface the control sits on, so it fades rather than greys. */
const TICKED_DISABLED = `color-mix(in srgb, ${backgroundColor.surface} 50%, ${semanticColor.accent} 50%)`;

const baseStyles = stylex.create({
  /** `Field.Root` — the label row, with any description under it. */
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: gap.XXS,
    fontFamily: fontFamily.body,
    [vars.labelColor]: textColor.primary,
    [vars.descriptionColor]: textColor.subtle,
  },
  disabled: {
    [vars.labelColor]: textColor.disabled,
    [vars.descriptionColor]: textColor.disabled,
  },
  /**
   * `Field.Label` — a real `<label>` wrapped around the box and its text, which is what makes the
   * text a second place to click. Base UI notices the control is inside a label and leaves off the
   * `for`, so the two do not both fire and cancel each other out.
   */
  label: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: gap.S,
    color: vars.labelColor,
    fontSize: 'inherit',
    lineHeight: 'inherit',
    cursor: 'pointer',
    [vars.hover]: { default: '0%', ':hover': '100%' },
  },
  labelDisabled: {
    cursor: 'not-allowed',
    [vars.hover]: '0%',
  },
  labelText: {
    userSelect: 'none',
  },
  /** `Checkbox.Root` — a `<span role="checkbox">` with the real input hidden beside it. */
  control: {
    boxSizing: 'border-box',
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    inlineSize: vars.controlSize,
    blockSize: vars.controlSize,
    marginBlockStart: vars.controlOffset,
    padding: 0,
    // `TextInput`'s radius, which is the radius every framed control here draws.
    borderRadius: '4px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: RESTING_BORDER,
    backgroundColor: backgroundColor.input,
    cursor: 'pointer',
    // `Button`'s ring, offset clear of the box rather than inset like `TextInput`'s — 3px of inset
    // ring inside a 16px box would leave nothing but ring.
    ':focus-visible': {
      outline: `2px solid ${outlineColor.focus}`,
      outlineOffset: '2px',
    },
  },
  /**
   * A box with no label has nothing above it to notice the pointer, so it answers for itself. The
   * label's copy of this declaration is the one that matters everywhere else — see `vars.stylex.ts`.
   */
  controlStandalone: {
    [vars.hover]: { default: '0%', ':hover': '100%' },
  },
  controlTicked: {
    borderColor: TICKED,
    backgroundColor: TICKED,
  },
  /** Not `not-allowed` and not `pointer`: nothing is forbidden, there is just nothing to press. */
  controlReadOnly: {
    cursor: 'default',
    [vars.hover]: '0%',
  },
  controlDisabled: {
    cursor: 'not-allowed',
    backgroundColor: backgroundColor.secondary,
    borderColor: dividerColor.subtle,
    [vars.hover]: '0%',
  },
  controlTickedDisabled: {
    cursor: 'not-allowed',
    backgroundColor: TICKED_DISABLED,
    borderColor: TICKED_DISABLED,
    [vars.hover]: '0%',
  },
  /**
   * `Checkbox.Indicator`, which Base UI mounts only once there is something to indicate.
   *
   * White in both schemes, as `Button` paints its own content on a solid accent: the fill is the
   * accent in either scheme, so the ink over it does not flip with the page.
   */
  indicator: {
    display: 'flex',
    color: 'white',
  },
  glyph: {
    inlineSize: vars.glyphSize,
    blockSize: vars.glyphSize,
  },
  /**
   * `Field.Description` — indented past the box so it reads as a second line of the label rather
   * than as a separate remark about the row.
   */
  description: {
    paddingInlineStart: `calc(${vars.controlSize} + ${gap.S})`,
    marginTop: 0,
    marginBottom: 0,
    fontSize: '14px',
    lineHeight: '20px',
    color: vars.descriptionColor,
  },
});

/**
 * A box that is ticked, not ticked, or neither.
 *
 * Built on Base UI's `Checkbox`, which renders a `<span role="checkbox">` with a real `<input>`
 * hidden beside it — so keyboard behaviour, form submission and the `aria-checked="mixed"` an
 * indeterminate box needs come from the primitive rather than from us.
 *
 * The root is a `Field.Root`, as `TextInput`'s is, and for the same reason: it is what makes the
 * label and the description belong to this box rather than merely sit near it. Base UI also offers
 * `Field.Item`, which is the part meant for one control inside a group — but it *requires* a
 * `Field.Root` above it and throws without one, so a component that has to work on its own cannot be
 * built out of it.
 *
 * What that costs is nesting: a `Field.Root` inside somebody else's does not inherit its `disabled`.
 * A `Fieldset` does reach through — Base UI's field root reads the fieldset context — which is why
 * `RadioGroup` disables its choices with one, and why `<Fieldset.Root disabled>` is the way to
 * switch off a set of these at once.
 */
const Checkbox = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'span'>, Checkbox.Props>(function Checkbox(
      { label, description, name, disabled, variants, xstyle, ...rest },
      ref,
    ) {
      const sizeStyle = bx.useVariantStyle<Checkbox.Variants>(variantStyles, variants, { size: 'default' });

      // Rendered once and placed by the branch below, so the box is the same element whether or not
      // it ends up inside a label.
      const control = (
        <CheckboxBase.Root
          ref={ref}
          {...rest}
          // Painted from Base UI's state rather than from our props. `disabled` is the reason: it
          // reaches a box from the field around it, from a `CheckboxGroup`, and from a `Fieldset`
          // above either, and only the primitive has counted all of them.
          render={(controlProps, state) => {
            const ticked = state.checked || state.indeterminate;

            return (
              <span
                {...controlProps}
                {...stylex.props(
                  baseStyles.control,
                  label === undefined && baseStyles.controlStandalone,
                  ticked && baseStyles.controlTicked,
                  state.readOnly && baseStyles.controlReadOnly,
                  state.disabled && (ticked ? baseStyles.controlTickedDisabled : baseStyles.controlDisabled),
                )}
              />
            );
          }}
        >
          <CheckboxBase.Indicator
            // The glyph is chosen in here rather than passed as children because which glyph it is
            // depends on the state this render function is handed: a dash for a box standing in for
            // a part-ticked group, a tick for a box that is simply ticked.
            render={(indicatorProps, state) => (
              <span {...indicatorProps} {...stylex.props(baseStyles.indicator)}>
                <Icon
                  as={state.indeterminate ? Phosphor.MinusIcon : Phosphor.CheckIcon}
                  weight="bold"
                  xstyle={baseStyles.glyph}
                />
              </span>
            )}
          />
        </CheckboxBase.Root>
      );

      return (
        <Field.Root
          name={name}
          disabled={disabled}
          // Rendered through the field's own state because the label and the description grey for a
          // condition that lands on the box beside them, and no selector reads sideways. The state
          // is also the fuller answer than the prop: it has already taken in a `Fieldset` above.
          render={(fieldProps, fieldState) => (
            <div {...fieldProps} {...stylex.props(baseStyles.base, sizeStyle, fieldState.disabled && baseStyles.disabled, xstyle)}>
              {label === undefined ? (
                control
              ) : (
                <Field.Label {...stylex.props(baseStyles.label, fieldState.disabled && baseStyles.labelDisabled)}>
                  {control}
                  <span {...stylex.props(baseStyles.labelText)}>{label}</span>
                </Field.Label>
              )}
              {description !== undefined && (
                <Field.Description {...stylex.props(baseStyles.description)}>{description}</Field.Description>
              )}
            </div>
          )}
        />
      );
    }),
  ),
  {
    variants: variantStyles,
    styles: baseStyles,
  },
);

namespace Checkbox {
  export type Variants = bx.Variants<typeof variantStyles>;

  export type Size = keyof typeof variantStyles.size;

  export interface Props extends Omit<bx.VariantComponentProps<'span', Variants>, 'children' | 'defaultValue' | 'onChange'> {
    /** Rendered beside the box, in a `<label>` wrapped around both — so the text is clickable too. */
    label?: React.ReactNode;
    /** A second line under the label, indented to it, and in the control's `aria-describedby`. */
    description?: React.ReactNode;
    /** Identifies the box when a form is submitted. Set on the field, which the control reads it from. */
    name?: string;
    /** What this box contributes to a surrounding `CheckboxGroup`'s value. */
    value?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: CheckboxBase.Root.Props['onCheckedChange'];
    /**
     * Neither ticked nor unticked — the dash, for a box that stands for a partly ticked group. It
     * outranks `checked`, and is the caller's to clear when the group settles either way.
     */
    indeterminate?: boolean;
    disabled?: boolean;
    /** Shown as it is and not pressable, for a value that is settled elsewhere. */
    readOnly?: boolean;
    required?: boolean;
    /** Reaches the hidden `<input>`, for the cases that need the real form control. */
    inputRef?: React.Ref<HTMLInputElement>;
  }
}

export default Checkbox;

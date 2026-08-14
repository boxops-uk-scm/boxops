import { Field, Radio as RadioBase } from '@base-ui/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { backgroundColor, dividerColor, fontFamily, gap, outlineColor, semanticColor, textColor } from '../tokens.stylex';
import * as bx from '../types';

import { vars } from './vars.stylex';

/**
 * `Checkbox`'s sizes, with a smaller glyph. A tick fills the box it sits in; a dot has to leave a
 * ring of the fill around it or the button reads as a filled circle with a hole in it. 6px inside
 * 16px leaves 4px of ring on each side, which is the proportion the rest of the ramp keeps.
 */
const variantStyles = {
  size: stylex.create({
    default: {
      [vars.controlSize]: '16px',
      [vars.controlOffset]: '4px',
      [vars.glyphSize]: '6px',
      fontSize: '16px',
      lineHeight: '24px',
    },
    compact: {
      [vars.controlSize]: '14px',
      [vars.controlOffset]: '3px',
      [vars.glyphSize]: '5px',
      fontSize: '14px',
      lineHeight: '20px',
    },
  }),
} as const satisfies bx.VariantStyles;

/** Both blends are `Checkbox`'s, which explains them — a radio that hovered differently would be a bug. */
const RESTING_BORDER = `color-mix(in srgb, ${semanticColor.accent} ${vars.hover}, ${dividerColor.subtle})`;
const SELECTED = `color-mix(in srgb, ${textColor.primary} calc(${vars.hover} * 0.05), ${semanticColor.accent})`;
const SELECTED_DISABLED = `color-mix(in srgb, ${backgroundColor.surface} 50%, ${semanticColor.accent} 50%)`;

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
  /** `Field.Label` — a real `<label>` around the button and its text, so the text is clickable too. */
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
  /**
   * `Radio.Root` — a `<span role="radio">` with the real input hidden beside it.
   *
   * Identical to `Checkbox`'s box but for the radius, which is the whole difference between the two
   * controls as far as anybody looking at them is concerned: square means you may pick several,
   * round means the group will pick one.
   */
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
    borderRadius: '50%',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: RESTING_BORDER,
    backgroundColor: backgroundColor.input,
    cursor: 'pointer',
    ':focus-visible': {
      outline: `2px solid ${outlineColor.focus}`,
      outlineOffset: '2px',
    },
  },
  /** A button with no label has nothing above it to notice the pointer, so it answers for itself. */
  controlStandalone: {
    [vars.hover]: { default: '0%', ':hover': '100%' },
  },
  controlSelected: {
    borderColor: SELECTED,
    backgroundColor: SELECTED,
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
  controlSelectedDisabled: {
    cursor: 'not-allowed',
    backgroundColor: SELECTED_DISABLED,
    borderColor: SELECTED_DISABLED,
    [vars.hover]: '0%',
  },
  /**
   * `Radio.Indicator`, which Base UI mounts only once the button is the selected one.
   *
   * White in both schemes, as `Button` paints its own content on a solid accent: the fill is the
   * accent either way, so the dot over it does not flip with the page.
   */
  indicator: {
    inlineSize: vars.glyphSize,
    blockSize: vars.glyphSize,
    borderRadius: '50%',
    backgroundColor: 'white',
  },
  /** Indented past the button, so it reads as a second line of the label rather than a separate remark. */
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
 * One of the choices in a `RadioGroup`.
 *
 * Built on Base UI's `Radio`, which renders a `<span role="radio">` with a real `<input>` hidden
 * beside it. It holds no state of its own: which button is selected, what the field is called on
 * submit, and the arrow-key roving that a radio group is expected to have all live on the group, and
 * a `Radio` outside one is inert. That is the primitive's design and it is the right one — "exactly
 * one of these" is a fact about the set, not about any member of it.
 *
 * Structurally this is `Checkbox`: a `Field.Root` for a root — see the note there for why that part
 * and not `Field.Item` — a `<label>` wrapped around the button, and a description indented to the
 * label above it. Disabling the whole group still reaches every button in it twice over: through the
 * radio group's own context, and through the `Fieldset` the group draws around them.
 */
const Radio = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'span'>, Radio.Props>(function Radio(
      { label, description, disabled, variants, xstyle, ...rest },
      ref,
    ) {
      const sizeStyle = bx.useVariantStyle<Radio.Variants>(variantStyles, variants, { size: 'default' });

      // Rendered once and placed by the branch below, so the button is the same element whether or
      // not it ends up inside a label.
      const control = (
        <RadioBase.Root
          ref={ref}
          {...rest}
          // Painted from Base UI's state rather than from our props. `disabled` is the reason: it
          // reaches a button from the field around it, from the radio group, and from the fieldset
          // that group draws, and only the primitive has counted all three.
          render={(controlProps, state) => (
            <span
              {...controlProps}
              {...stylex.props(
                baseStyles.control,
                label === undefined && baseStyles.controlStandalone,
                state.checked && baseStyles.controlSelected,
                state.readOnly && baseStyles.controlReadOnly,
                state.disabled && (state.checked ? baseStyles.controlSelectedDisabled : baseStyles.controlDisabled),
              )}
            />
          )}
        >
          <RadioBase.Indicator {...stylex.props(baseStyles.indicator)} />
        </RadioBase.Root>
      );

      return (
        <Field.Root
          disabled={disabled}
          // Rendered through the field's own state, which is the more complete answer than the prop:
          // it has already taken the `Fieldset` the group draws into account, so a button in a
          // disabled group greys its label without being told twice.
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

namespace Radio {
  export type Variants = bx.Variants<typeof variantStyles>;

  export type Size = keyof typeof variantStyles.size;

  export interface Props extends Omit<bx.VariantComponentProps<'span', Variants>, 'children' | 'defaultValue' | 'value'> {
    /**
     * What the group's value becomes when this button is picked, and how it knows it is the picked
     * one. Required, because a radio with nothing to say is not a choice.
     */
    value: string;
    /** Rendered beside the button, in a `<label>` wrapped around both — so the text is clickable too. */
    label?: React.ReactNode;
    /** A second line under the label, indented to it, and in the control's `aria-describedby`. */
    description?: React.ReactNode;
    /** Disables this one choice. To disable all of them, disable the group. */
    disabled?: boolean;
    /** Shown as it is and not pressable, for a choice that is settled elsewhere. */
    readOnly?: boolean;
    required?: boolean;
    /** Reaches the hidden `<input>`, for the cases that need the real form control. */
    inputRef?: React.Ref<HTMLInputElement>;
  }
}

export default Radio;

import { Fieldset, RadioGroup as RadioGroupBase } from '@base-ui/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { fontFamily, gap, textColor } from '../tokens.stylex';
import * as bx from '../types';

/**
 * Which way the choices run.
 *
 * Vertical is the default and is what a set of choices should nearly always be: one under another is
 * scannable at any length, and each label is free to wrap. Horizontal is for two or three short ones
 * — it wraps rather than overflowing, but a row that has wrapped is a row that should have been a
 * column.
 */
const variantStyles = {
  orientation: stylex.create({
    vertical: {
      flexDirection: 'column',
      gap: gap.S,
    },
    horizontal: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: gap.M,
    },
  }),
} as const satisfies bx.VariantStyles;

const baseStyles = stylex.create({
  /**
   * `Fieldset.Root`, which renders a real `<fieldset>` — stripped of the border, padding and margin
   * the UA gives it, and of the `min-inline-size: min-content` that stops one shrinking below its
   * longest label.
   */
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: gap.S,
    fontFamily: fontFamily.body,
    borderWidth: 0,
    borderStyle: 'none',
    padding: 0,
    margin: 0,
    minInlineSize: 0,
  },
  /**
   * `Fieldset.Legend` — a `<div>` rather than a `<legend>`, tied to the fieldset by
   * `aria-labelledby`. Base UI renders it that way on purpose: `<legend>` is laid out by rules of its
   * own that no other label here obeys, and the association does not need the element.
   *
   * `TextInput`'s label, to the pixel: a group of choices asks its question in the same voice a
   * field asks its own.
   */
  legend: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 600,
    color: textColor.primary,
  },
  legendDisabled: {
    color: textColor.disabled,
  },
  group: {
    display: 'flex',
  },
});

/**
 * A set of choices, exactly one of which is picked.
 *
 * The group is where a radio's state actually lives: Base UI's `RadioGroup` holds the selected
 * value, gives the buttons the one name they submit under, and does the roving-tabindex arrow-key
 * walk that a radio group is expected to have — so a `Radio` outside one is inert by design.
 *
 * The label is a `Fieldset` legend rather than a `<label>`, because there is no single control for a
 * label to point at. That is the reason a bare `<label>` over a set of radios is a common bug: it
 * names one of them, or nothing.
 *
 * Size is set on each `Radio` rather than here. The group has no say in it — a radio reads its
 * geometry from its own row — and pretending otherwise would give callers a prop that silently lost
 * to the one underneath it.
 */
const RadioGroup = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, RadioGroup.Props>(function RadioGroup(
      { label, disabled, variants, xstyle, children, ...rest },
      ref,
    ) {
      const orientationStyle = bx.useVariantStyle<RadioGroup.Variants>(variantStyles, variants, { orientation: 'vertical' });

      return (
        // The fieldset is given the disabled state as well as the group, and not only because it
        // greys the legend: Base UI's `Field.Root` reads the fieldset context, so this is what
        // reaches the field each `Radio` renders around itself and greys the labels with it.
        <Fieldset.Root disabled={disabled} {...stylex.props(baseStyles.base, xstyle)}>
          {label !== undefined && (
            <Fieldset.Legend {...stylex.props(baseStyles.legend, disabled === true && baseStyles.legendDisabled)}>
              {label}
            </Fieldset.Legend>
          )}
          <RadioGroupBase ref={ref} disabled={disabled} {...rest} {...stylex.props(baseStyles.group, orientationStyle)}>
            {children}
          </RadioGroupBase>
        </Fieldset.Root>
      );
    }),
  ),
  {
    variants: variantStyles,
    styles: baseStyles,
  },
);

namespace RadioGroup {
  export type Variants = bx.Variants<typeof variantStyles>;

  export type Orientation = keyof typeof variantStyles.orientation;

  export interface Props extends Omit<bx.VariantComponentProps<'div', Variants>, 'defaultValue' | 'onChange' | 'value'> {
    /** The question the choices answer, rendered as the fieldset's legend. */
    label?: React.ReactNode;
    /** Identifies the group when a form is submitted. */
    name?: string;
    /** The selected `Radio`'s value. Leave it out and pass `defaultValue` for an uncontrolled group. */
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string, eventDetails: RadioGroupBase.ChangeEventDetails) => void;
    /** Disables every choice in the group, and greys the legend with them. */
    disabled?: boolean;
    /** Shows the selection without letting it be changed. */
    readOnly?: boolean;
    /** A choice must be made before the surrounding form will submit. */
    required?: boolean;
    /** Reaches the hidden `<input>` the group submits through. */
    inputRef?: React.Ref<HTMLInputElement>;
  }
}

export default RadioGroup;

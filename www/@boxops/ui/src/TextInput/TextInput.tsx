import { Field, Input } from '@base-ui/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import * as bx from '../types';

/**
 * Empty on purpose — this is a scaffold. Every slot the component renders has a style object here
 * so that filling them in later is an edit rather than a restructure, and so the shape of the
 * component is legible before it has any appearance at all.
 */
const variantStyles = {
  size: stylex.create({
    default: {},
    compact: {},
  }),
} as const satisfies bx.VariantStyles;

const baseStyles = stylex.create({
  /** `Field.Root` — the label, the control and any message, stacked. */
  base: {},
  /** `Field.Label`. */
  label: {},
  /**
   * The frame around the control: border, background, focus ring.
   *
   * Not the `<input>` itself. Leading and trailing content sit inside the frame beside the input,
   * so the input is transparent and borderless and this row draws what the eye reads as the field.
   */
  row: {},
  /** The `<input>`, which fills whatever the row leaves it. */
  control: {},
  /** Leading and trailing content — an icon, a unit, a clear button. */
  startContent: {},
  endContent: {},
  /** `Field.Description`: the standing hint, shown whether or not the value is valid. */
  description: {},
  /** `Field.Error`: replaces nothing, sits below, and only appears once the field is invalid. */
  error: {},
});

/**
 * A single-line text field: a label, a control, and a message when something is wrong with it.
 *
 * Built on Base UI's `Input`, which is a plain `<input>` that participates in a surrounding
 * `Field` — so validity, disabled state and the label's `for` are wired by the primitive rather
 * than by us threading ids around. The state it exposes (`focused`, `filled`, `touched`, `dirty`,
 * `valid`, `disabled`) is what the styles will key off, and is passed to the content render
 * functions so a caller can react to it too.
 *
 * The `Field.Root` is rendered here rather than left to the caller. It is what makes the label and
 * the message belong to this control, and a field without one is a bare input that this component
 * would have nothing to add to.
 */
const TextInput = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'input'>, TextInput.Props>(function TextInput(
      {
        label,
        description,
        error,
        name,
        disabled,
        invalid,
        validate,
        validationMode,
        startContent,
        endContent,
        variants,
        xstyle,
        ...rest
      },
      ref,
    ) {
      const rootStyles = [
        baseStyles.base,
        bx.useVariantStyle<TextInput.Variants>(variantStyles, variants, { size: 'default' }),
        xstyle,
      ];

      return (
        <Field.Root
          name={name}
          disabled={disabled}
          invalid={invalid}
          validate={validate}
          validationMode={validationMode}
          {...stylex.props(rootStyles)}
        >
          {label && <Field.Label {...stylex.props(baseStyles.label)}>{label}</Field.Label>}
          <div {...stylex.props(baseStyles.row)}>
            <Input
              ref={ref}
              {...rest}
              render={(props, state) => {
                const inputState: TextInput.State = { ...state, variants };

                return (
                  <>
                    {startContent && (
                      <span {...stylex.props(baseStyles.startContent)}>
                        {bx.useRenderFunction(startContent, inputState)}
                      </span>
                    )}
                    <input {...props} {...stylex.props(baseStyles.control)} />
                    {endContent && (
                      <span {...stylex.props(baseStyles.endContent)}>
                        {bx.useRenderFunction(endContent, inputState)}
                      </span>
                    )}
                  </>
                );
              }}
            />
          </div>
          {description && <Field.Description {...stylex.props(baseStyles.description)}>{description}</Field.Description>}
          {error && <Field.Error {...stylex.props(baseStyles.error)}>{error}</Field.Error>}
        </Field.Root>
      );
    }),
  ),
  {
    variants: variantStyles,
    styles: baseStyles,
  },
);

namespace TextInput {
  export type Variants = bx.Variants<typeof variantStyles>;

  export type Size = keyof typeof variantStyles.size;

  /**
   * Base UI's own control state, plus our variants — what the styles and the content slots key off.
   *
   * Taken from the primitive rather than restated, so a field it starts tracking arrives here
   * without an edit. Today that is `disabled`, `touched`, `dirty`, `valid`, `filled` and `focused`;
   * note there is no `invalid` — validity is `valid`, which is `null` until the field is validated.
   */
  export interface State extends Input.State, bx.VariantComponentState<Variants> {}

  export interface Props extends Omit<bx.ComponentProps<'input'>, 'children' | 'size'> {
    label?: React.ReactNode;
    /** Standing hint, shown regardless of validity. */
    description?: React.ReactNode;
    /**
     * Shown only once the field is invalid. A string uses it as the message for every failure; pass
     * a `Field.Error` yourself when different failures need different wording.
     */
    error?: React.ReactNode;
    /** Identifies the field on submit, and takes precedence over `name` on the control. */
    name?: string;
    disabled?: boolean;
    /** Forces the invalid state, for validity owned outside the component. */
    invalid?: boolean;
    validate?: Field.Root.Props['validate'];
    validationMode?: Field.Root.Props['validationMode'];
    /** Rendered inside the frame, before the input — an icon, a currency symbol. */
    startContent?: bx.RenderFunction<State>;
    /** Rendered inside the frame, after the input — a unit, a clear button, a spinner. */
    endContent?: bx.RenderFunction<State>;
    variants?: Variants;
  }
}

export default TextInput;

import { Field, Input } from '@base-ui/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { backgroundColor, dividerColor, fontFamily, gap, padding, semanticColor, textColor } from '../tokens.stylex';
import * as bx from '../types';

import { vars } from './vars.stylex';

/**
 * Applied to the frame rather than the root: the size of a field is the size of the box you type
 * in. The control inherits its font from here, so one declaration moves both the padding and the
 * text rather than leaving them to drift apart.
 */
const variantStyles = {
  size: stylex.create({
    default: {
      padding: padding.S,
      fontSize: '16px',
      lineHeight: '24px',
    },
    compact: {
      padding: `${padding.XS} ${padding.S}`,
      fontSize: '14px',
      lineHeight: '20px',
    },
  }),
} as const satisfies bx.VariantStyles;

const baseStyles = stylex.create({
  /** `Field.Root` — the label, the control and any message, stacked. */
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: gap.XS,
    fontFamily: fontFamily.body,
    [vars.labelColor]: textColor.primary,
    [vars.messageColor]: textColor.subtle,
  },
  label: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 600,
    color: vars.labelColor,
  },
  /**
   * The frame around the control: border, background, focus ring.
   *
   * Deliberately the same frame `RichTextArea` draws — same 1px subtle border, same surface, same
   * radius, and the same 3px inset accent ring on focus — because the two are the same control at
   * different lengths and nothing about a single line justifies a different box.
   *
   * The one difference is which pseudo-class raises the ring. The editor is itself the focusable
   * element, so it uses `:focus`; here the focusable element is the `<input>` nested inside, so the
   * frame keys off `:focus-within`. That is also the better behaviour: focus a clear button passed
   * as `endContent` and the frame stays lit, because the focus is still inside the field.
   */
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: gap.S,
    color: vars.color,
    backgroundColor: vars.backgroundColor,
    borderRadius: '4px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: vars.borderColor,
    [vars.color]: textColor.primary,
    [vars.backgroundColor]: backgroundColor.surface,
    [vars.placeholderColor]: textColor.secondary,
    [vars.borderColor]: {
      default: dividerColor.subtle,
      ':focus-within': semanticColor.accent,
    },
    boxShadow: {
      default: null,
      ':focus-within': `inset 0 0 0 3px ${semanticColor.accentSubtle}`,
    },
    outline: {
      default: null,
      ':focus-within': 'none',
    },
  },
  /** Invalid only once the field has been validated — `valid` is `null` until then. */
  rowInvalid: {
    [vars.borderColor]: {
      default: semanticColor.negative,
      ':focus-within': semanticColor.negative,
    },
    boxShadow: {
      default: null,
      ':focus-within': `inset 0 0 0 3px ${semanticColor.negativeSubtle}`,
    },
  },
  rowDisabled: {
    [vars.color]: textColor.disabled,
    [vars.placeholderColor]: textColor.disabled,
    [vars.backgroundColor]: backgroundColor.secondary,
    cursor: 'not-allowed',
  },
  /** The `<input>`, which fills whatever the row leaves it. */
  control: {
    flexGrow: 1,
    // Without this a flex item refuses to shrink below its content, so a long value pushes the
    // frame wider than whatever is holding it.
    minWidth: 0,
    appearance: 'none',
    borderStyle: 'none',
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
    color: 'inherit',
    // Longhands: the `font` shorthand is one of the ones StyleX drops on the floor.
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    fontWeight: 'inherit',
    outline: 'none',
    cursor: 'inherit',
    '::placeholder': {
      color: vars.placeholderColor,
    },
    ':disabled': {
      // Safari paints its own washed-out ink on a disabled control, which ignores `color`.
      WebkitTextFillColor: vars.color,
      cursor: 'not-allowed',
    },
  },
  /** Leading and trailing content — an icon, a unit, a clear button. */
  startContent: {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    color: textColor.secondary,
  },
  endContent: {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    color: textColor.secondary,
  },
  /** `Field.Description`: the standing hint, shown whether or not the value is valid. */
  description: {
    fontSize: '14px',
    lineHeight: '20px',
    color: vars.messageColor,
  },
  /** `Field.Error`: replaces nothing, sits below, and only appears once the field is invalid. */
  error: {
    fontSize: '14px',
    lineHeight: '20px',
    color: semanticColor.negative,
  },
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
      const sizeStyle = bx.useVariantStyle<TextInput.Variants>(variantStyles, variants, { size: 'default' });

      return (
        <Field.Root
          name={name}
          disabled={disabled}
          invalid={invalid}
          validate={validate}
          validationMode={validationMode}
          {...stylex.props(baseStyles.base, xstyle)}
          // Rendered through the root's own state because the frame reacts to conditions CSS cannot
          // see from where it sits: `disabled` and `invalid` land on the `<input>`, and no selector
          // reaches from a child back up to the box drawn around it. Focus is the exception and
          // stays in CSS, since `:focus-within` does read downwards.
          render={(rootProps, state) => (
            <div {...rootProps}>
              {label && <Field.Label {...stylex.props(baseStyles.label)}>{label}</Field.Label>}
              <div
                {...stylex.props(
                  baseStyles.row,
                  sizeStyle,
                  state.valid === false && baseStyles.rowInvalid,
                  state.disabled && baseStyles.rowDisabled,
                )}
              >
                <Input
                  ref={ref}
                  {...rest}
                  render={(props, controlState) => {
                    const inputState: TextInput.State = { ...controlState, variants };

                    return (
                      <>
                        {startContent && (
                          <span {...stylex.props(baseStyles.startContent)}>{bx.useRenderFunction(startContent, inputState)}</span>
                        )}
                        <input {...props} {...stylex.props(baseStyles.control)} />
                        {endContent && (
                          <span {...stylex.props(baseStyles.endContent)}>{bx.useRenderFunction(endContent, inputState)}</span>
                        )}
                      </>
                    );
                  }}
                />
              </div>
              {description && <Field.Description {...stylex.props(baseStyles.description)}>{description}</Field.Description>}
              {error && <Field.Error {...stylex.props(baseStyles.error)}>{error}</Field.Error>}
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

import { Field, Input } from '@base-ui/react';
import { SSR as Phosphor, type IconProps } from '@phosphor-icons/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Icon } from '../Icon';
import { backgroundColor, dividerColor, fontFamily, gap, padding, semanticColor, textColor } from '../tokens.stylex';
import * as bx from '../types';

import { vars } from './vars.stylex';

/** The same glyphs `Banner` uses, so a state looks the same wherever it is reported. */
const STATUS_ICON = {
  error: Phosphor.XCircleIcon,
  warning: Phosphor.WarningIcon,
  success: Phosphor.CheckCircleIcon,
} as const satisfies Record<TextInput.Status, React.FC<IconProps>>;

/**
 * The frame's border and the icon inside it take the bold hue — they sit on the input's own ground,
 * where the bold hue is what carries. The message below takes the tint-and-ink pairing `Banner`
 * uses, because it sits on the tint. The glyph is not repeated in the message: it is already on the
 * field an inch above, saying the same thing.
 */
const statusStyles = stylex.create({
  error: {
    [vars.borderColor]: { default: semanticColor.negative, ':focus-within': semanticColor.negative },
    boxShadow: { default: null, ':focus-within': `inset 0 0 0 3px ${semanticColor.negativeSubtle}` },
  },
  warning: {
    [vars.borderColor]: { default: semanticColor.warning, ':focus-within': semanticColor.warning },
    boxShadow: { default: null, ':focus-within': `inset 0 0 0 3px ${semanticColor.warningSubtle}` },
  },
  success: {
    [vars.borderColor]: { default: semanticColor.positive, ':focus-within': semanticColor.positive },
    boxShadow: { default: null, ':focus-within': `inset 0 0 0 3px ${semanticColor.positiveSubtle}` },
  },
});

const statusIconStyles = stylex.create({
  error: { color: semanticColor.negative },
  warning: { color: semanticColor.warning },
  success: { color: semanticColor.positive },
});

/**
 * The tint, made opaque.
 *
 * `Banner`'s subtle tints are 20% alpha, which is right for a banner — it sits in flow with the
 * page behind it and is meant to read as part of it. This message floats over whatever follows the
 * field, and at 20% the label underneath shows straight through the text. Painting the same tint as
 * a gradient layer over an opaque ground gives the identical colour with nothing behind it.
 *
 * Longhands, because `background` is one of the shorthands StyleX silently drops.
 */
const messageStyles = stylex.create({
  error: {
    color: semanticColor.negativeInk,
    backgroundColor: backgroundColor.surface,
    backgroundImage: `linear-gradient(${semanticColor.negativeSubtle}, ${semanticColor.negativeSubtle})`,
  },
  warning: {
    color: semanticColor.warningInk,
    backgroundColor: backgroundColor.surface,
    backgroundImage: `linear-gradient(${semanticColor.warningSubtle}, ${semanticColor.warningSubtle})`,
  },
  success: {
    color: semanticColor.positiveInk,
    backgroundColor: backgroundColor.surface,
    backgroundImage: `linear-gradient(${semanticColor.positiveSubtle}, ${semanticColor.positiveSubtle})`,
  },
});

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
    // Anchors the message, which is positioned against this box and therefore inherits its width.
    position: 'relative',
    color: vars.color,
    backgroundColor: vars.backgroundColor,
    borderRadius: '4px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: vars.borderColor,
    [vars.color]: textColor.primary,
    [vars.backgroundColor]: backgroundColor.input,
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
  /**
   * The message, floating under the frame.
   *
   * Out of flow on purpose: a field that grows a line of text when it goes wrong shoves everything
   * below it down the page, which is how a form ends up jumping under the pointer at the moment
   * somebody is trying to fix it. `left: 0; right: 0` against the frame — rather than a width —
   * ties it to the field's own measure however wide that turns out to be.
   *
   * Appearance is `Banner`'s: the same tint, the same ink, the same 12px radius and padding. No
   * shadow, for the same reason — `Banner` has none — so it reads as attached to the field rather
   * than as a separate floating surface.
   */
  message: {
    position: 'absolute',
    // Offset by the frame's own border on all three sides: an absolutely positioned child is laid
    // out against the padding box, so `0` would come up one border-width short at each edge and
    // leave the message narrower than the field it belongs to. The extra pixel at the top lands it
    // exactly on the frame's outer edge, so the two meet with no seam.
    top: 'calc(100% + 1px)',
    left: '-1px',
    right: '-1px',
    zIndex: 10,
    paddingTop: padding.XS,
    paddingBottom: padding.XS,
    paddingLeft: '12px',
    paddingRight: '12px',
    // Square where it meets the field and rounded to the field's own radius where it does not, so
    // the two read as one shape that grew downwards rather than as a separate card that happens to
    // be nearby. This is the one place the appearance departs from `Banner`, which is rounded all
    // round because nothing is ever attached to it.
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
    fontSize: '14px',
    lineHeight: '20px',
    textAlign: 'start',
  },
  statusIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
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
        message,
        status,
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
          render={(rootProps, state) => {
            // A caller's `status` wins; failing that, a field that has been validated and failed is
            // an error. `valid` is `null` until validation has run, so this cannot fire on an
            // untouched field.
            const effectiveStatus = status ?? (state.valid === false ? 'error' : undefined);

            return (
              <div {...rootProps}>
                {label && <Field.Label {...stylex.props(baseStyles.label)}>{label}</Field.Label>}
                <div
                  {...stylex.props(
                    baseStyles.row,
                    sizeStyle,
                    effectiveStatus && statusStyles[effectiveStatus],
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
                            <span {...stylex.props(baseStyles.startContent)}>
                              {bx.useRenderFunction(startContent, inputState)}
                            </span>
                          )}
                          <input {...props} {...stylex.props(baseStyles.control)} />
                          {endContent && (
                            <span {...stylex.props(baseStyles.endContent)}>{bx.useRenderFunction(endContent, inputState)}</span>
                          )}
                        </>
                      );
                    }}
                  />
                  {effectiveStatus && (
                    <span {...stylex.props(baseStyles.statusIcon)}>
                      <Icon as={STATUS_ICON[effectiveStatus]} weight="fill" xstyle={statusIconStyles[effectiveStatus]} />
                    </span>
                  )}
                  {effectiveStatus === 'error' ? (
                    // `Field.Error` decides its own visibility from validity and registers itself as
                    // the control's description. `match` forces it open for an error the caller is
                    // asserting rather than one validation found; passing no children lets it fall
                    // back to the validation message it already holds.
                    <Field.Error
                      match={status === 'error' ? true : undefined}
                      role="alert"
                      {...stylex.props(baseStyles.message, messageStyles.error)}
                      // Rendered around its own children rather than given new ones: passing
                      // children to `Field.Error` replaces the message validation produced, so a
                      // field with no `message` of its own would come out empty.
                      render={({ children, ...errorProps }) => <div {...errorProps}>{message ?? children}</div>}
                    />
                  ) : (
                    effectiveStatus &&
                    message && (
                      // Not an error, so not `Field.Error` — but still a description of the control,
                      // which is what puts it in `aria-describedby` beside any `description`.
                      <Field.Description
                        role="status"
                        // A description is a `<p>` by default, whose UA margin would sit it further
                        // from the field than the error variant sits.
                        render={<div />}
                        {...stylex.props(baseStyles.message, messageStyles[effectiveStatus])}
                      >
                        {message}
                      </Field.Description>
                    )
                  )}
                </div>
                {description && <Field.Description {...stylex.props(baseStyles.description)}>{description}</Field.Description>}
              </div>
            );
          }}
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

  export type Status = 'error' | 'warning' | 'success';

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
    /** Standing hint, in flow beneath the field, shown regardless of validity. */
    description?: React.ReactNode;
    /**
     * Which treatment the frame, the trailing icon and the message take.
     *
     * Omitted, a field that fails validation reports itself as an error anyway. Set it to say
     * something validation cannot know — that a value is unusual, or that a check has passed.
     */
    status?: Status;
    /**
     * What the floating message says. Left out on an error, the message validation produced is
     * used; a warning or a success has nothing to fall back on, so without this nothing is shown.
     */
    message?: React.ReactNode;
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

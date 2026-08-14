import { Field, Select as SelectBase } from '@base-ui/react';
import { SSR as Phosphor, type IconProps } from '@phosphor-icons/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Card } from '../Card';
import { Icon, IconContextProvider } from '../Icon';
import { usePortalContainer } from '../PortalContainer';
import { Text } from '../Text';
import {
  backgroundColor,
  borderRadius,
  colorScheme,
  dividerColor,
  fontFamily,
  gap,
  padding,
  scrollbarColor,
  semanticColor,
  textColor,
} from '../tokens.stylex';
import * as bx from '../types';

import { vars } from './vars.stylex';

/** `TextInput`'s glyphs, so a field reports a state the same way whichever kind of field it is. */
const STATUS_ICON = {
  error: Phosphor.XCircleIcon,
  warning: Phosphor.WarningIcon,
  success: Phosphor.CheckCircleIcon,
} as const satisfies Record<Select.Status, React.FC<IconProps>>;

/** `TextInput`'s treatment, restated: bold hue on the frame, and the ring under it in the same hue. */
const statusStyles = stylex.create({
  error: {
    [vars.borderColor]: { default: semanticColor.negative, ':focus-visible': semanticColor.negative },
    boxShadow: { default: null, ':focus-visible': `inset 0 0 0 3px ${semanticColor.negativeSubtle}` },
  },
  warning: {
    [vars.borderColor]: { default: semanticColor.warning, ':focus-visible': semanticColor.warning },
    boxShadow: { default: null, ':focus-visible': `inset 0 0 0 3px ${semanticColor.warningSubtle}` },
  },
  success: {
    [vars.borderColor]: { default: semanticColor.positive, ':focus-visible': semanticColor.positive },
    boxShadow: { default: null, ':focus-visible': `inset 0 0 0 3px ${semanticColor.positiveSubtle}` },
  },
});

const statusIconStyles = stylex.create({
  error: { color: semanticColor.negative },
  warning: { color: semanticColor.warning },
  success: { color: semanticColor.positive },
});

/** `TextInput`'s message: the tint made opaque, because it floats over whatever follows the field. */
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
 * `TextInput`'s two sizes, to the pixel, so a select and a field on the same form line up.
 *
 * Applied twice — to the field and again to the popup — because the popup is portalled out of the
 * field's subtree, so nothing about it can be inherited. That is also why the list cannot simply say
 * `font-size: inherit`: by the time it renders it is a child of the portal container, which knows
 * nothing about which select opened it.
 */
const variantStyles = {
  size: stylex.create({
    default: {
      fontSize: '16px',
      lineHeight: '24px',
    },
    compact: {
      fontSize: '14px',
      lineHeight: '20px',
    },
  }),
} as const satisfies bx.VariantStyles;

/** Trigger padding, which is the one thing the two sizes do not share with their font. */
const triggerSizeStyles = stylex.create({
  default: { padding: padding.S },
  compact: { padding: `${padding.XS} ${padding.S}` },
});

const baseStyles = stylex.create({
  /** `Field.Root` — the label, the trigger and any description, stacked. */
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: gap.XS,
    fontFamily: fontFamily.body,
    [vars.labelColor]: textColor.primary,
    [vars.messageColor]: textColor.subtle,
  },
  /**
   * `Field.Label`, rendered as a `<div>` rather than the `<label>` it would default to.
   *
   * A `<label>` names a labelable element, and the trigger is a `<button>`, which is not one — so
   * the `for` would point at nothing and the label's own click behaviour would fight the button's.
   * Base UI's `nativeLabel={false}` is exactly this case: it drops the `for`, names the trigger
   * through `aria-labelledby` instead, and moves focus itself when the label is clicked.
   */
  label: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 600,
    color: vars.labelColor,
  },
  /**
   * The box the message is positioned against, and nothing else.
   *
   * It exists because the message cannot live inside the trigger: a `<button>` takes phrasing
   * content, and the message is a block with a `role` of its own. So the frame is drawn by the
   * button and the anchoring by this wrapper, which is exactly the button's border box.
   */
  frame: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  /**
   * `Select.Trigger` — the field as it reads when closed.
   *
   * Deliberately `TextInput`'s frame: the same 1px subtle border, the same input ground, the same
   * 4px radius and the same 3px inset accent ring. A select is a field whose value happens to be
   * chosen rather than typed, and nothing about that justifies a different box.
   *
   * The one addition is the hover, which `TextInput` has no use for — its frame is not a control,
   * this one is. It takes the accent, which is where the border is heading anyway the moment the
   * field is focused or the list is open.
   */
  trigger: {
    display: 'flex',
    alignItems: 'center',
    gap: gap.S,
    width: '100%',
    cursor: 'pointer',
    textAlign: 'start',
    color: vars.color,
    backgroundColor: vars.backgroundColor,
    borderRadius: '4px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: vars.borderColor,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    [vars.color]: textColor.primary,
    [vars.backgroundColor]: backgroundColor.input,
    [vars.placeholderColor]: textColor.secondary,
    [vars.borderColor]: {
      default: dividerColor.subtle,
      ':enabled:hover': semanticColor.accent,
      ':focus-visible': semanticColor.accent,
    },
    boxShadow: {
      default: null,
      ':focus-visible': `inset 0 0 0 3px ${semanticColor.accentSubtle}`,
    },
    outline: {
      default: null,
      ':focus-visible': 'none',
    },
  },
  /**
   * Open, the frame stays lit even though focus has moved into the list.
   *
   * Not a pseudo-class, because there is none for it: the trigger is only `:focus-visible` while it
   * holds focus, and while the popup is open it does not. Base UI reports it as state instead.
   */
  triggerOpen: {
    [vars.borderColor]: semanticColor.accent,
    boxShadow: `inset 0 0 0 3px ${semanticColor.accentSubtle}`,
  },
  triggerDisabled: {
    [vars.color]: textColor.disabled,
    [vars.placeholderColor]: textColor.disabled,
    [vars.backgroundColor]: backgroundColor.secondary,
    [vars.borderColor]: dividerColor.subtle,
    cursor: 'not-allowed',
  },
  /** Nothing to choose from, but nothing forbidden either — so the frame stays, and the caret goes. */
  triggerReadOnly: {
    cursor: 'default',
    [vars.borderColor]: dividerColor.subtle,
  },
  /**
   * `Select.Value`. Takes the row's free width so the caret sits at the trailing edge whatever the
   * value's length, and clips rather than wraps — a field that grows a second line when a long
   * option is picked moves everything under it.
   */
  value: {
    flexGrow: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: vars.color,
  },
  valuePlaceholder: {
    color: vars.placeholderColor,
  },
  /** Held open whether or not there is a state to report, so a form's carets stay in one column. */
  statusSlot: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    inlineSize: '20px',
  },
  caret: {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    color: textColor.secondary,
  },
  /**
   * `Field.Description`: the standing hint, in flow, shown whether or not the value is valid.
   *
   * Margins reset because it is a `<p>`, and the UA gives one a blank line above and below — which
   * here is a 16px hole between the field and its own hint, on top of the 4px the stack already
   * asked for.
   */
  description: {
    marginTop: 0,
    marginBottom: 0,
    fontSize: '14px',
    lineHeight: '20px',
    color: vars.messageColor,
  },
  /**
   * The message, floating under the frame — out of flow for `TextInput`'s reason: a field that grows
   * a line when it goes wrong shoves the rest of the form down at the moment somebody is fixing it.
   * Square where it meets the field and rounded where it does not, so the two read as one shape.
   */
  message: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: padding.XS,
    paddingBottom: padding.XS,
    paddingLeft: '12px',
    paddingRight: '12px',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
    fontSize: '14px',
    lineHeight: '20px',
    textAlign: 'start',
  },
  /** Stacking belongs on the positioner — the popup is `position: static`, so a z-index there is inert. */
  positioner: {
    zIndex: 100,
  },
  /**
   * The list's surface, which is `Card` — the same one every other menu here opens onto.
   *
   * `--anchor-width` and `--available-height` are the positioner's own vars: the list is at least as
   * wide as the field it belongs to, and never taller than the room between the field and the edge
   * of the window, at which point it scrolls instead of being clipped.
   *
   * The family is declared here rather than inherited, because there is nothing to inherit it from:
   * the popup is portalled, so its parent is the portal container and not the field. Everything the
   * field's own subtree gets for free has to be handed to the popup by hand — the size variant is
   * applied here for the same reason, and the row text goes through `Text` so it is rendered exactly
   * as every other menu row in the system is.
   *
   * And a surface that scrolls owns a scrollbar: `scrollbarColor` themes it where that is supported,
   * `colorScheme` gets a correctly-schemed native one everywhere else. `SideNav` and `Sitemap` set
   * the same pair for the same reason.
   */
  popup: {
    minWidth: 'var(--anchor-width)',
    maxHeight: 'var(--available-height)',
    overflowY: 'auto',
    padding: padding.XS,
    gap: 0,
    fontFamily: fontFamily.body,
    colorScheme: colorScheme.ui,
    scrollbarColor: scrollbarColor.subtle,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: gap.XXS,
  },
  /**
   * A row, in `SideNav`'s language — the same padding, the same 8px radius, the same 5%-toward-the-
   * ink hover, and the same accent tint when it is the selected one. A menu row is a menu row.
   *
   * The hover keys off Base UI's `highlighted` rather than off `:hover`, because the pointer is not
   * the only thing that highlights a row: arrowing down one does too, and both should look the same.
   */
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: gap.S,
    cursor: 'pointer',
    userSelect: 'none',
    paddingLeft: padding.S,
    paddingRight: padding.S,
    paddingTop: padding.XS,
    paddingBottom: padding.XS,
    borderRadius: borderRadius.button,
    color: textColor.primary,
    outline: 'none',
  },
  itemHighlighted: {
    backgroundColor: `oklch(from ${textColor.primary} l c h / 5%)`,
  },
  itemSelected: {
    color: semanticColor.accent,
    backgroundColor: semanticColor.accentSelected,
  },
  itemSelectedHighlighted: {
    backgroundColor: semanticColor.accentSelectedHover,
  },
  itemDisabled: {
    color: textColor.disabled,
    cursor: 'not-allowed',
  },
  /** The label and, under it, whatever the option needs to explain about itself. */
  itemBody: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minWidth: 0,
  },
  itemText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  /**
   * The label's own ink is the row's — `Text` sets none, so it inherits, which is what carries the
   * accent onto the selected row and the grey onto a disabled one. The size is inherited too, from
   * the size variant on the popup: `Text` states 16/24 outright, and a compact select wants 14/20.
   */
  itemLabel: {
    fontSize: 'inherit',
    lineHeight: 'inherit',
  },
  /** `Text`'s `small` is already 14/20, in both sizes — as `TextInput`'s description is. */
  itemDescription: {
    color: textColor.subtle,
  },
  itemDescriptionDisabled: {
    color: textColor.disabled,
  },
  /**
   * Kept mounted and hidden rather than mounted on selection, so every label in the list starts at
   * the same x and the popup does not change width when the selection moves.
   */
  itemIndicator: {
    display: 'inline-flex',
    flexShrink: 0,
    color: semanticColor.accent,
  },
  itemIndicatorHidden: {
    visibility: 'hidden',
  },
  itemIcon: {
    display: 'inline-flex',
    flexShrink: 0,
  },
  /** A group's heading. Not an option, so it takes the quieter ink and does not sit on a row. */
  groupLabel: {
    paddingLeft: padding.S,
    paddingRight: padding.S,
    paddingTop: padding.XS,
    paddingBottom: padding.XS,
  },
  groupLabelText: {
    fontWeight: 600,
    color: textColor.secondary,
  },
});

/** Base UI's own test, restated on our shape: a list of groups is a list whose first entry has items. */
function isGrouped(options: Select.Options): options is readonly Select.Group[] {
  return options.length > 0 && 'items' in options[0];
}

/**
 * A field whose value is chosen from a list.
 *
 * Built on Base UI's `Select`, which is a `<button>` trigger, a portalled popup and a hidden
 * `<input>` for the form — so the listbox roles, the typeahead, the arrow-key navigation and the
 * scroll locking come from the primitive rather than from us.
 *
 * The options arrive as data rather than as children, which is the one place this departs from the
 * primitive's own shape. Two reasons. The trigger has to render the *label* of the selected value
 * and only knows how if it is handed the same list — as children, every caller would have to pass
 * `items` a second time to get "Staging" instead of `staging` in the closed field. And an option is
 * a small enough thing — a value, a label, sometimes a line of explanation — that composing one out
 * of four parts buys nothing. `Sitemap` takes its routes the same way, for the same reason.
 *
 * The popup goes through `usePortalContainer`, not `document.body`, so it opens inside whatever
 * theme scope the field is in. A select that renders its list in the wrong colour scheme is what
 * happens without it, and the design-system page — two themes on one screen — is where that shows.
 */
const Select = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'button'>, Select.Props>(function Select(
      {
        label,
        description,
        message,
        status,
        placeholder,
        options,
        name,
        disabled,
        readOnly,
        required,
        value,
        defaultValue,
        onValueChange,
        open,
        defaultOpen,
        onOpenChange,
        inputRef,
        variants,
        xstyle,
        ...rest
      },
      ref,
    ) {
      const portalContainer = usePortalContainer();
      const size = variants?.size ?? 'default';
      const sizeStyle = bx.useVariantStyle<Select.Variants>(variantStyles, variants, { size: 'default' });

      const renderOption = (option: Select.Option) => (
        <SelectBase.Item
          key={String(option.value)}
          value={option.value}
          disabled={option.disabled}
          // What typeahead matches against. Taken from the text content otherwise, which here would
          // also sweep up the description and match on a word the reader never saw as the label.
          label={option.label}
          render={({ children, ...itemProps }, itemState) => (
            <div
              {...itemProps}
              {...stylex.props(
                baseStyles.item,
                itemState.highlighted && baseStyles.itemHighlighted,
                itemState.selected && baseStyles.itemSelected,
                itemState.selected && itemState.highlighted && baseStyles.itemSelectedHighlighted,
                itemState.disabled && baseStyles.itemDisabled,
              )}
            >
              {/* An option's glyph fills when it is the chosen one, which is how `Toggle` marks a
                  pressed button: the accent alone is a colour the eye has to compare against the
                  rows above and below, where a filled glyph reads on its own. Set through the icon
                  context rather than on the icon, so it reaches whatever the caller passed without
                  the caller having to know. The tick keeps its own `bold` — `CheckIcon` filled is a
                  check cut out of a square, which is a different glyph rather than a heavier one. */}
              <IconContextProvider weight={itemState.selected ? 'fill' : 'regular'}>{children}</IconContextProvider>
            </div>
          )}
        >
          {option.icon && (
            <span {...stylex.props(baseStyles.itemIcon)}>
              <Icon as={option.icon} variants={{ size: 'S' }} />
            </span>
          )}
          <span {...stylex.props(baseStyles.itemBody)}>
            {/* `Text` inside the part rather than as the part: `Text` computes its own class and a
                `className` handed to it would replace that, taking the family and the smoothing with
                it. Nested is how `SideNav` writes a row's label too. */}
            <SelectBase.ItemText {...stylex.props(baseStyles.itemText)}>
              <Text xstyle={baseStyles.itemLabel}>{option.label}</Text>
            </SelectBase.ItemText>
            {option.description !== undefined && (
              <Text as="small" xstyle={[baseStyles.itemDescription, option.disabled && baseStyles.itemDescriptionDisabled]}>
                {option.description}
              </Text>
            )}
          </span>
          <SelectBase.ItemIndicator
            keepMounted
            render={(indicatorProps, indicatorState) => (
              <span
                {...indicatorProps}
                {...stylex.props(baseStyles.itemIndicator, !indicatorState.selected && baseStyles.itemIndicatorHidden)}
              />
            )}
          >
            <Icon as={Phosphor.CheckIcon} weight="bold" variants={{ size: 'S' }} />
          </SelectBase.ItemIndicator>
        </SelectBase.Item>
      );

      return (
        <Field.Root
          name={name}
          disabled={disabled}
          {...stylex.props(baseStyles.base, sizeStyle, xstyle)}
          render={(fieldProps, fieldState) => {
            // A caller's `status` wins; failing that, a field that has been validated and failed is
            // an error. `valid` is `null` until validation has run, so this cannot fire untouched.
            const effectiveStatus = status ?? (fieldState.valid === false ? 'error' : undefined);

            return (
              <div {...fieldProps}>
                {label !== undefined && (
                  <Field.Label nativeLabel={false} render={<div />} {...stylex.props(baseStyles.label)}>
                    {label}
                  </Field.Label>
                )}
                <SelectBase.Root
                  // The same list the popup is built from, so the closed field can name the value it
                  // is holding. Without it the trigger falls back to printing the raw value.
                  items={options}
                  value={value}
                  defaultValue={defaultValue}
                  onValueChange={onValueChange}
                  open={open}
                  defaultOpen={defaultOpen}
                  onOpenChange={onOpenChange}
                  readOnly={readOnly}
                  required={required}
                  inputRef={inputRef}
                >
                  <div {...stylex.props(baseStyles.frame)}>
                    <SelectBase.Trigger
                      ref={ref}
                      {...rest}
                      render={(triggerProps, triggerState) => (
                        <button
                          {...triggerProps}
                          {...stylex.props(
                            baseStyles.trigger,
                            triggerSizeStyles[size],
                            triggerState.open && baseStyles.triggerOpen,
                            effectiveStatus && statusStyles[effectiveStatus],
                            triggerState.readOnly && baseStyles.triggerReadOnly,
                            triggerState.disabled && baseStyles.triggerDisabled,
                          )}
                        />
                      )}
                    >
                      <SelectBase.Value
                        placeholder={placeholder}
                        render={(valueProps, valueState) => (
                          <span
                            {...valueProps}
                            {...stylex.props(baseStyles.value, valueState.placeholder && baseStyles.valuePlaceholder)}
                          />
                        )}
                      />
                      <span {...stylex.props(baseStyles.statusSlot)}>
                        {effectiveStatus && (
                          <Icon as={STATUS_ICON[effectiveStatus]} weight="fill" xstyle={statusIconStyles[effectiveStatus]} />
                        )}
                      </span>
                      {/* Dropped when the value cannot be changed: the caret is a promise that
                          pressing this opens something, and read-only means it does not. */}
                      {readOnly !== true && (
                        <SelectBase.Icon {...stylex.props(baseStyles.caret)}>
                          <Icon as={Phosphor.CaretDownIcon} variants={{ size: 'S' }} />
                        </SelectBase.Icon>
                      )}
                    </SelectBase.Trigger>
                    {effectiveStatus === 'error' ? (
                      // `Field.Error` decides its own visibility from validity. `match` forces it
                      // open for an error the caller is asserting rather than one validation found;
                      // passing no children lets it fall back to the message validation produced.
                      <Field.Error
                        match={status === 'error' ? true : undefined}
                        role="alert"
                        {...stylex.props(baseStyles.message, messageStyles.error)}
                        render={({ children, ...errorProps }) => <div {...errorProps}>{message ?? children}</div>}
                      />
                    ) : (
                      effectiveStatus &&
                      message !== undefined && (
                        <Field.Description
                          role="status"
                          render={<div />}
                          {...stylex.props(baseStyles.message, messageStyles[effectiveStatus])}
                        >
                          {message}
                        </Field.Description>
                      )
                    )}
                  </div>
                  <SelectBase.Portal container={portalContainer}>
                    <SelectBase.Positioner
                      sideOffset={4}
                      // Off, so the list opens under the field like every other menu here. On — the
                      // primitive's default — the popup lies over the trigger with the selected row
                      // on top of the value, which is the native macOS behaviour and is startling
                      // beside a set of dropdowns that all do the other thing.
                      alignItemWithTrigger={false}
                      {...stylex.props(baseStyles.positioner)}
                    >
                      <SelectBase.Popup>
                        {/* `StyleXStyles` types `colorScheme` as a literal union and a token
                            reference reads as `string`, so a style that sets it from a var does not
                            satisfy a typed `xstyle`. Asserted at this boundary rather than widening
                            the token — `Sitemap` does the same, and says so at more length. */}
                        <Card xstyle={[baseStyles.popup as stylex.StyleXStyles, sizeStyle]}>
                          <SelectBase.List {...stylex.props(baseStyles.list)}>
                            {isGrouped(options)
                              ? options.map((group, index) => (
                                  <SelectBase.Group key={index}>
                                    <SelectBase.GroupLabel {...stylex.props(baseStyles.groupLabel)}>
                                      <Text as="small" xstyle={baseStyles.groupLabelText}>
                                        {group.label}
                                      </Text>
                                    </SelectBase.GroupLabel>
                                    {group.items.map(renderOption)}
                                  </SelectBase.Group>
                                ))
                              : options.map(renderOption)}
                          </SelectBase.List>
                        </Card>
                      </SelectBase.Popup>
                    </SelectBase.Positioner>
                  </SelectBase.Portal>
                </SelectBase.Root>
                {description !== undefined && (
                  <Field.Description {...stylex.props(baseStyles.description)}>{description}</Field.Description>
                )}
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

namespace Select {
  export type Variants = bx.Variants<typeof variantStyles>;

  export type Size = keyof typeof variantStyles.size;

  export type Status = 'error' | 'warning' | 'success';

  export interface Option {
    /** Submitted with the form, and what `value` on the select is matched against. */
    value: string;
    /** Shown in the row, in the closed field once picked, and matched by typeahead. */
    label: string;
    /** A second line under the label, for an option whose name does not say enough. */
    description?: React.ReactNode;
    /** Drawn before the label, at `Icon`'s `S`. */
    icon?: Icon.Props['as'];
    disabled?: boolean;
  }

  /**
   * A heading and the options under it. Declared as a type alias rather than an interface on
   * purpose: Base UI's `items` asks for an index signature, which only an alias gets implicitly.
   */
  export type Group = {
    label: React.ReactNode;
    items: readonly Option[];
  };

  /** Flat or grouped, not both — which is the same rule Base UI applies to `items`. */
  export type Options = readonly Option[] | readonly Group[];

  export interface Props extends Omit<bx.VariantComponentProps<'button', Variants>, 'children' | 'defaultValue' | 'value'> {
    /** Rendered above the field, and given to the trigger as its accessible name. */
    label?: React.ReactNode;
    /** Standing hint, in flow beneath the field, shown regardless of validity. */
    description?: React.ReactNode;
    /**
     * Which treatment the frame, the trailing icon and the message take.
     *
     * Omitted, a field that fails validation reports itself as an error anyway. Set it to say
     * something validation cannot know.
     */
    status?: Status;
    /** What the floating message says. Left out on an error, validation's own message is used. */
    message?: React.ReactNode;
    /** Shown in the closed field until something is picked. */
    placeholder?: React.ReactNode;
    /** What there is to choose from. A list of options, or a list of groups of them. */
    options: Options;
    /** Identifies the field on submit, and takes precedence over `name` on the control. */
    name?: string;
    disabled?: boolean;
    /** Shows the value without letting it be changed — the caret goes with the ability to change it. */
    readOnly?: boolean;
    required?: boolean;
    /** The chosen option's value. Leave it out and pass `defaultValue` for an uncontrolled field. */
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string | null, eventDetails: SelectBase.Root.ChangeEventDetails) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, eventDetails: SelectBase.Root.ChangeEventDetails) => void;
    /** Reaches the hidden `<input>` the form submits through. */
    inputRef?: React.Ref<HTMLInputElement>;
  }
}

export default Select;

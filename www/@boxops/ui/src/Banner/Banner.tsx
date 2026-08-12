import { Collapsible } from '@base-ui/react';
import { SSR as Phosphor, type IconProps } from '@phosphor-icons/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Button } from '../Button';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { TextPair } from '../TextPair';
import { gap, padding, semanticColor } from '../tokens.stylex';
import * as bx from '../types';

const variantStyles = {
  status: stylex.create({
    // `info` maps to the accent blue rather than `semanticColor.info` (purple). That is the v1
    // behaviour, preserved verbatim — Toast carries the same quirk.
    info: { color: semanticColor.accent, backgroundColor: semanticColor.accentSubtle },
    warning: { color: semanticColor.warning, backgroundColor: semanticColor.warningSubtle },
    error: { color: semanticColor.negative, backgroundColor: semanticColor.negativeSubtle },
    success: { color: semanticColor.positive, backgroundColor: semanticColor.positiveSubtle },
  }),
} as const satisfies bx.VariantStyles;

const baseStyles = stylex.create({
  base: {
    width: '100%',
    padding: 0,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap.S,
    paddingTop: padding.XS,
    paddingBottom: padding.XS,
    paddingLeft: '12px',
    paddingRight: '12px',
    borderRadius: '12px',
  },
  headerOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingBottom: padding.S,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: padding.S,
  },
  spacer: {
    flexGrow: 1,
  },
});

const STATUS_ICON = {
  info: Phosphor.InfoIcon,
  warning: Phosphor.WarningIcon,
  error: Phosphor.XCircleIcon,
  success: Phosphor.CheckCircleIcon,
} as const satisfies Record<NonNullable<Banner.Variants['status']>, React.FC<IconProps>>;

const Banner = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, Banner.Props>(function Banner(
      { title, description, endContent, children, isOpen, onOpenChange, isDismissed, onDismiss, variants, xstyle, ...rest },
      ref,
    ) {
      if (isDismissed) {
        return null;
      }

      const status = variants?.status ?? 'info';
      const state: Banner.State = { variants };

      const styles = [baseStyles.base, bx.useComponentStyleWithState<Banner.State>(state, xstyle)];

      return (
        <Card ref={ref} role="status" xstyle={styles} {...rest}>
          <Collapsible.Root open={isOpen} onOpenChange={onOpenChange}>
            <div
              {...stylex.props(
                baseStyles.header,
                bx.useVariantStyle<Banner.Variants>(variantStyles, variants, { status: 'info' }),
                isOpen && !!children && baseStyles.headerOpen,
              )}
            >
              <Icon as={STATUS_ICON[status]} weight="fill" />
              <TextPair variant="h3" description={description}>
                {title}
              </TextPair>
              <span {...stylex.props(baseStyles.spacer)} />
              {endContent}
              {children && (
                <Collapsible.Trigger
                  render={
                    <Button
                      aria-label={isOpen ? 'Collapse' : 'Expand'}
                      variants={{ appearance: 'flat', size: 'compact' }}
                      startContent={<Icon as={isOpen ? Phosphor.CaretUpIcon : Phosphor.CaretDownIcon} />}
                    />
                  }
                />
              )}
              {onDismiss && (
                <Button
                  aria-label="Dismiss"
                  onClick={onDismiss}
                  variants={{ appearance: 'flat', size: 'compact' }}
                  // Outline, not fill: `Button` defaults its icons to `fill`, and a solid X reads as heavy.
                  startContent={<Icon as={Phosphor.XIcon} weight="regular" />}
                />
              )}
            </div>
            {children && (
              <Collapsible.Panel>
                <div {...stylex.props(baseStyles.content)}>{children}</div>
              </Collapsible.Panel>
            )}
          </Collapsible.Root>
        </Card>
      );
    }),
  ),
  {
    variants: variantStyles,
    styles: baseStyles,
  },
);

namespace Banner {
  export type Variants = bx.Variants<typeof variantStyles>;

  export type State = bx.VariantComponentState<Variants>;

  export interface Props extends Omit<bx.VariantComponentPropsWithState<'div', Variants, State>, 'title'> {
    title?: string;
    description?: string;
    /** Rendered before the expand/dismiss controls. */
    endContent?: React.ReactNode;
    /** Present children to make the banner expandable. */
    children?: React.ReactNode;
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    isDismissed?: boolean;
    /** Omit to render a banner that cannot be dismissed. */
    onDismiss?: () => void;
  }
}

export default Banner;

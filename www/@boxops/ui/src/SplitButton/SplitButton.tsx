import { Popover } from '@base-ui/react';
import { CaretDown } from '@phosphor-icons/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Button } from '../Button';
import { ButtonGroup } from '../ButtonGroup';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { gap } from '../tokens.stylex';

const baseStyles = stylex.create({
  popup: {
    zIndex: 100,
  },
  menu: {
    // Base UI Positioner exposes the anchor width via the `--anchor-width` CSS var
    // (equivalent to Radix's `--radix-popper-anchor-width` used by the v1 source).
    minWidth: 'var(--anchor-width)',
    width: 'fit-content',
    padding: 0,
    gap: gap.XXS,
  },
});

const SplitButton = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, SplitButton.Props>(function SplitButton(
      { open, onOpenChange, children, variants, disabled, xstyle, ...props },
      ref,
    ) {
      const anchorRef = React.useRef<HTMLDivElement | null>(null);
      const setRefs = React.useCallback(
        (node: HTMLDivElement | null) => {
          anchorRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        },
        [ref],
      );

      return (
        <Popover.Root open={open} onOpenChange={onOpenChange}>
          <ButtonGroup ref={setRefs}>
            <Button variants={variants} disabled={disabled} xstyle={xstyle} {...props} />
            <Popover.Trigger
              disabled={disabled}
              render={
                <Button
                  aria-label="More options"
                  variants={variants}
                  disabled={disabled}
                  endContent={<Icon as={CaretDown} variants={{ size: 'S' }} />}
                />
              }
            />
          </ButtonGroup>
          <Popover.Portal>
            <Popover.Positioner anchor={anchorRef} sideOffset={5} align="end">
              <Popover.Popup {...stylex.props(baseStyles.popup)}>
                <Card xstyle={baseStyles.menu}>{children}</Card>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace SplitButton {
  export interface Props extends Button.Props {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
  }
}

export default SplitButton;

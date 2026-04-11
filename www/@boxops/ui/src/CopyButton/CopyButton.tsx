import { SSR as Phosphor } from '@phosphor-icons/react';
import * as React from 'react';

import { Button } from '../Button';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import * as bx from '../types';

const Component = React.memo(
  React.forwardRef<React.ComponentRef<'button'>, Component.Props>(function Component(
    { clipboardValue, tooltip, tooltipAfterCopy, xstyle, variants, onClick, ...rest },
    ref,
  ) {
    const [hasCopied, setHasCopied] = React.useState(false);
    const resetTimerRef = React.useRef<number | null>(null);

    const clearResetTimer = () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };

    const scheduleReset = () => {
      clearResetTimer();
      resetTimerRef.current = window.setTimeout(() => {
        setHasCopied(false);
        resetTimerRef.current = null;
      }, 1500);
    };

    React.useEffect(() => {
      return () => clearResetTimer();
    }, []);

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
      onClick?.(event);
      if (event.defaultPrevented) return;

      try {
        await navigator.clipboard.writeText(clipboardValue);
        setHasCopied(true);
        scheduleReset();
      } catch {
        setHasCopied(false);
      }
    };

    const tooltipLabel = hasCopied ? tooltipAfterCopy || 'Copied!' : tooltip || 'Copy to clipboard';

    return (
      <Tooltip
        aria-label="Copy to clipboard"
        closeOnClick={false}
        onOpenChangeComplete={(open: boolean) => {
          if (!open) {
            setHasCopied(false);
          }
        }}
        trigger={
          <Button
            ref={ref}
            startContent={(props) => <Icon as={Phosphor.CopyIcon} {...props} />}
            onClick={handleClick}
            variants={variants}
            xstyle={xstyle}
            {...rest}
          />
        }
        label={tooltipLabel}
      />
    );
  }),
);

namespace Component {
  export type Variants = bx.Variants<typeof Button.variants>;

  export type State = bx.VariantComponentState<Variants>;

  export interface Props extends bx.VariantComponentPropsWithState<'button', Variants, State> {
    clipboardValue: string;
    tooltip?: React.ReactNode;
    tooltipAfterCopy?: React.ReactNode;
  }
}

export default Component;

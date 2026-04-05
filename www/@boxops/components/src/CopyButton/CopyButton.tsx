import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';

import Button from '../Button';
import Icon from '../Icon';
import Tooltip from '../Tooltip';

import { styles } from './styles';

export interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  clipboardValue: string;
  variant?: Button.Variant;
  xstyle?: stylex.StyleXStyles;
  tooltip?: React.ReactNode;
  tooltipAfterCopy?: React.ReactNode;
}

const CopyButton: React.FC<Props> = ({
  clipboardValue,
  variant = 'default',
  xstyle,
  tooltip,
  tooltipAfterCopy,
  onClick,
  ...rest
}) => {
  const [hasCopied, setHasCopied] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

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

  useEffect(() => {
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
          startContent={<Icon.Copy size="S" />}
          onClick={handleClick}
          variant={variant}
          xstyle={[styles.base, xstyle]}
          {...rest}
        />
      }
      label={tooltipLabel}
    />
  );
};

CopyButton.displayName = 'CopyButton';

export default CopyButton;

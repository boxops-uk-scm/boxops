import * as React from 'react';

import Banner from './Banner';

/** `Banner` owning its own open and dismissed state, which is how most callers want it. */
const UncontrolledBanner = React.memo(
  React.forwardRef<React.ComponentRef<'div'>, UncontrolledBanner.Props>(function UncontrolledBanner(
    { defaultOpen = false, isDismissable = true, ...props },
    ref,
  ) {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    const [isDismissed, setIsDismissed] = React.useState(false);

    const dismiss = React.useCallback(() => setIsDismissed(true), []);

    return (
      <Banner
        ref={ref}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isDismissed={isDismissed}
        onDismiss={isDismissable ? dismiss : undefined}
        {...props}
      />
    );
  }),
);

namespace UncontrolledBanner {
  export interface Props
    extends Omit<Banner.Props, 'isOpen' | 'onOpenChange' | 'isDismissed' | 'onDismiss'> {
    defaultOpen?: boolean;
    isDismissable?: boolean;
  }
}

export default UncontrolledBanner;

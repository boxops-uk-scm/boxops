import * as React from 'react';

import SplitButton from './SplitButton';

const UncontrolledSplitButton = React.memo(
  React.forwardRef<React.ComponentRef<'div'>, UncontrolledSplitButton.Props>(function UncontrolledSplitButton(
    { children, ...props },
    ref,
  ) {
    const [open, setOpen] = React.useState(false);

    return (
      <SplitButton ref={ref} open={open} onOpenChange={setOpen} {...props}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement<{ onClick?: React.MouseEventHandler<HTMLButtonElement> }>(child)) {
            return React.cloneElement(child, {
              onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
                setOpen(false);
                child.props.onClick?.(event);
              },
            });
          }

          return child;
        })}
      </SplitButton>
    );
  }),
);

namespace UncontrolledSplitButton {
  export interface Props extends Omit<SplitButton.Props, 'open' | 'onOpenChange'> {}
}

export default UncontrolledSplitButton;

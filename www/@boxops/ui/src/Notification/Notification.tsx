import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { StatusDot } from '../StatusDot';
import { gap } from '../tokens.stylex';
import * as bx from '../types';

const baseStyles = stylex.create({
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexGrow: 1,
    gap: gap.S,
  },
  message: {
    maxWidth: '240px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
  },
});

const Notification = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, Notification.Props>(function Notification(
      { avatar, isSeen = false, children, xstyle, ...rest },
      ref,
    ) {
      return (
        <div ref={ref} {...stylex.props(baseStyles.base, xstyle)} {...rest}>
          {!isSeen && <StatusDot variants={{ status: 'info', size: 'S' }} />}
          {avatar}
          <span {...stylex.props(baseStyles.message)}>{children}</span>
        </div>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace Notification {
  export interface Props extends bx.ComponentProps<'div'> {
    avatar?: React.ReactNode;
    /** Unseen notifications get a leading dot. */
    isSeen?: boolean;
  }
}

export default Notification;

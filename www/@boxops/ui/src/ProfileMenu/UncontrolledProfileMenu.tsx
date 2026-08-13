import * as React from 'react';

import ProfileMenu from './ProfileMenu';

/** Keeps the status itself, for a caller with nowhere else to put it — a story, or a demo. */
const UncontrolledProfileMenu = React.memo(
  React.forwardRef<React.ComponentRef<'div'>, UncontrolledProfileMenu.Props>(function UncontrolledProfileMenu(
    { defaultStatus = 'available', ...props },
    ref,
  ) {
    const [status, setStatus] = React.useState<ProfileMenu.Status>(defaultStatus);

    return <ProfileMenu ref={ref} status={status} onStatusChange={setStatus} {...props} />;
  }),
);

namespace UncontrolledProfileMenu {
  export interface Props extends Omit<ProfileMenu.Props, 'status' | 'onStatusChange'> {
    defaultStatus?: ProfileMenu.Status;
  }
}

export default UncontrolledProfileMenu;

import { SSR as Phosphor } from '@phosphor-icons/react';
import * as stylex from '@stylexjs/stylex';
import { formatDistanceToNow, isBefore, lightFormat } from 'date-fns';
import * as React from 'react';

import { Button } from '../Button';
import { Heading } from '../Heading';
import { Icon } from '../Icon';
import { TextPair } from '../TextPair';
import { gap } from '../tokens.stylex';
import * as bx from '../types';

const baseStyles = stylex.create({
  base: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: gap.XS,
    minWidth: '350px',
    flexGrow: 1,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  spacer: {
    flexGrow: 1,
  },
});

/** `now` is a parameter so the caller controls the instant — see the note in `MeetingMenu`. */
function formatRelativeStart(startTime: Date, now: Date) {
  const distance = formatDistanceToNow(startTime);
  return isBefore(startTime, now) ? `Started ${distance} ago` : `Starts in ${distance}`;
}

const MeetingMenuItem = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, MeetingMenuItem.Props>(function MeetingMenuItem(
      { meetingName, meetingRoom, startTime, endTime, participants, now, onJoin, xstyle, ...rest },
      ref,
    ) {
      const description = `${lightFormat(startTime, 'h:mm a')} - ${lightFormat(endTime, 'h:mm a')} | ${formatRelativeStart(startTime, now ?? new Date())}`;

      return (
        <div ref={ref} {...stylex.props(baseStyles.base, xstyle)} {...rest}>
          <Heading as="h4">{meetingName}</Heading>
          <TextPair description={description}>{meetingRoom}</TextPair>
          <div {...stylex.props(baseStyles.row)}>
            {participants}
            <div {...stylex.props(baseStyles.spacer)} />
            <Button
              aria-label="Join meeting"
              onClick={onJoin}
              variants={{ appearance: 'flat' }}
              startContent={<Icon as={Phosphor.VideoCameraIcon} />}
            />
          </div>
        </div>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace MeetingMenuItem {
  export interface Props extends Omit<bx.ComponentProps<'div'>, 'children'> {
    meetingName: string;
    meetingRoom: string;
    startTime: Date;
    endTime: Date;
    participants?: React.ReactNode;
    /** The instant to measure "starts in" against. Defaults to now; pass it under SSR. */
    now?: Date;
    onJoin?: () => void;
  }
}

export default MeetingMenuItem;

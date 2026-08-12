import * as stylex from '@stylexjs/stylex';
import { format } from 'date-fns';
import * as React from 'react';

import { Button } from '../Button';
import { Card } from '../Card';
import { Heading } from '../Heading';
import { Text } from '../Text';
import { gap, textColor } from '../tokens.stylex';
import * as bx from '../types';

const baseStyles = stylex.create({
  header: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  // `textColor.secondary` is the opaque mid-grey recovered for exactly this: a quiet section label
  // on a card, where alpha-blended `subtle` would muddy against the card tint.
  sectionLabel: {
    color: textColor.secondary,
  },
  meetings: {
    display: 'flex',
    flexDirection: 'column',
    gap: gap.XS,
    maxHeight: '200px',
    overflowY: 'auto',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
  },
});

const MeetingMenu = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, MeetingMenu.Props>(function MeetingMenu(
      { inProgress, upcoming, date, onSeeAll, xstyle, ...rest },
      ref,
    ) {
      // Taken as a prop rather than read from the clock inside render: under SSR the server and the
      // client would format different instants and React would report a hydration mismatch.
      const heading = React.useMemo(() => format(date ?? new Date(), 'EEEE, LLLL dd'), [date]);

      return (
        <Card ref={ref} xstyle={xstyle} {...rest}>
          <div {...stylex.props(baseStyles.header)}>
            <Heading as="h2">{heading}</Heading>
          </div>
          <Text as="b" xstyle={baseStyles.sectionLabel}>
            In progress
          </Text>
          <div {...stylex.props(baseStyles.meetings)}>{inProgress}</div>
          <Text as="b" xstyle={baseStyles.sectionLabel}>
            Up coming
          </Text>
          <div {...stylex.props(baseStyles.meetings)}>{upcoming}</div>
          <div {...stylex.props(baseStyles.footer)}>
            <Button
              onClick={onSeeAll}
              variants={{ appearance: 'flat', size: 'compact' }}
              label="See all in calendar"
            />
          </div>
        </Card>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace MeetingMenu {
  export interface Props extends Omit<bx.ComponentProps<'div'>, 'children'> {
    inProgress: React.ReactNode;
    upcoming: React.ReactNode;
    /** The day to title the menu with. Defaults to today; pass it explicitly under SSR. */
    date?: Date;
    onSeeAll?: () => void;
  }
}

export default MeetingMenu;

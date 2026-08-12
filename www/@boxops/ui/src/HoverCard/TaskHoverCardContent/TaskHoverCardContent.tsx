import { SSR as Phosphor } from '@phosphor-icons/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';

import { Badge } from '../../Badge';
import { Flexbox } from '../../Flexbox';
import { Heading } from '../../Heading';
import { Icon } from '../../Icon';
import { Link } from '../../Link';
import EmployeeLink from '../../Link/EmployeeLink/EmployeeLink';
import { MetadataList } from '../../MetadataList';
import { vars as metadataListVars } from '../../MetadataList/vars.stylex';
import { Text } from '../../Text';
import { iconColor } from '../../tokens.stylex';
import * as bx from '../../types';

import type { TaskHoverCardContent_fragment$key } from '@repo/relay-artifacts/src/__generated__/TaskHoverCardContent_fragment.graphql';

const fragment = graphql`
  fragment TaskHoverCardContent_fragment on EntTask {
    number
    title
    status
    priority
    tags
    owner {
      ...EmployeeLink_fragment
    }
  }
`;

const baseStyles = stylex.create({
  base: {
    maxWidth: '450px',
    minWidth: '320px',
  },
  metadata: {
    [metadataListVars.columns]: 1,
  },
  metadataIcon: {
    color: iconColor.secondary,
  },
});

// Keyed lookups rather than switch statements: Relay widens every enum with '%future added value',
// so an exhaustive switch cannot be written against one anyway.
const STATUS = {
  OPEN: { label: 'Open', color: 'blue' },
  IN_PROGRESS: { label: 'In Progress', color: 'green' },
  BLOCKED: { label: 'Blocked', color: 'red' },
  CLOSED: { label: 'Closed', color: 'gray' },
} as const satisfies Record<string, { label: string; color: NonNullable<Badge.Variants['color']> }>;

const PRIORITY = {
  CRITICAL: { label: 'Critical', color: 'red' },
  HIGH: { label: 'High', color: 'orange' },
  MEDIUM: { label: 'Medium', color: 'yellow' },
  LOW: { label: 'Low', color: 'green' },
} as const satisfies Record<string, { label: string; color: NonNullable<Badge.Variants['color']> }>;

const TaskHoverCardContent = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, TaskHoverCardContent.Props>(function TaskHoverCardContent(
      { fragmentRef, xstyle, ...rest },
      ref,
    ) {
      const task = useFragment(fragment, fragmentRef);
      const status = STATUS[task.status as keyof typeof STATUS];
      const priority = PRIORITY[task.priority as keyof typeof PRIORITY];

      return (
        <Flexbox ref={ref} variants={{ direction: 'column', gap: 'M' }} xstyle={[baseStyles.base, xstyle]} {...rest}>
          <Flexbox variants={{ direction: 'column', gap: 'XS' }}>
            <Flexbox variants={{ alignItems: 'center', gap: 'XS' }}>
              <Icon as={Phosphor.CheckSquareIcon} weight="fill" variants={{ size: 'S' }} xstyle={baseStyles.metadataIcon} />
              <Text as="small" variants={{ color: 'subtle' }}>
                T{task.number}
              </Text>
            </Flexbox>
            <Heading as="h1">
              <Link href={`/task/${task.number}`}>{task.title}</Link>
            </Heading>
          </Flexbox>
          <MetadataList variants={{ size: 'compact' }} xstyle={baseStyles.metadata}>
            <Icon as={Phosphor.SignpostIcon} xstyle={baseStyles.metadataIcon} />
            <Flexbox variants={{ gap: 'XS' }}>
              {status && <Badge label={status.label} variants={{ color: status.color }} />}
              {priority && <Badge label={priority.label} variants={{ color: priority.color }} />}
            </Flexbox>
            <Icon as={Phosphor.UsersThreeIcon} xstyle={baseStyles.metadataIcon} />
            {task.owner ? (
              <Flexbox variants={{ gap: 'S', alignItems: 'center' }}>
                <Text>Owned by</Text>
                <EmployeeLink fragmentRef={task.owner} />
              </Flexbox>
            ) : (
              <Text variants={{ color: 'subtle' }}>Unowned</Text>
            )}
            <Icon as={Phosphor.TagIcon} xstyle={baseStyles.metadataIcon} />
            <Flexbox variants={{ direction: 'column', gap: 'XS' }}>
              <Flexbox variants={{ gap: 'XS' }}>
                {task.tags?.slice(0, 2).map((tag) => <Badge key={tag} label={tag} />)}
              </Flexbox>
              {(task.tags?.length ?? 0) > 2 && (
                <Text as="small">
                  <Link href={`/task/${task.number}/tags`}>See more tags</Link>
                </Text>
              )}
            </Flexbox>
          </MetadataList>
        </Flexbox>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace TaskHoverCardContent {
  export interface Props extends Omit<bx.ComponentProps<'div'>, 'children'> {
    fragmentRef: TaskHoverCardContent_fragment$key;
  }
}

export default TaskHoverCardContent;

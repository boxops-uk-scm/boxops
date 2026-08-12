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
import { MetadataList } from '../../MetadataList';
import { vars as metadataListVars } from '../../MetadataList/vars.stylex';
import { Text } from '../../Text';
import { iconColor } from '../../tokens.stylex';
import * as bx from '../../types';
import EmployeeReference from '../EmployeeReference/EmployeeReference';

import type { DiffHoverCardContent_fragment$key } from '@repo/relay-artifacts/src/__generated__/DiffHoverCardContent_fragment.graphql';

const fragment = graphql`
  fragment DiffHoverCardContent_fragment on EntDiff {
    number
    title
    status
    tags
    significantLines
    projects
    author {
      ...EmployeeReference_fragment
    }
    comments {
      id
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

const STATUS = {
  OPEN: { label: 'Open', color: 'blue' },
  MERGED: { label: 'Merged', color: 'green' },
  CLOSED: { label: 'Closed', color: 'gray' },
} as const satisfies Record<string, { label: string; color: NonNullable<Badge.Variants['color']> }>;

/** "a", "a and b", "a, b and c" — the v2 source spelled this out inline. */
function joinWithAnd(nodes: React.ReactNode[]): React.ReactNode {
  if (nodes.length === 0) return null;
  if (nodes.length === 1) return nodes[0];

  return nodes.map((node, index) => (
    <React.Fragment key={index}>
      {index > 0 && (index === nodes.length - 1 ? ' and ' : ', ')}
      {node}
    </React.Fragment>
  ));
}

const DiffHoverCardContent = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, DiffHoverCardContent.Props>(function DiffHoverCardContent(
      { fragmentRef, xstyle, ...rest },
      ref,
    ) {
      const diff = useFragment(fragment, fragmentRef);
      const status = STATUS[diff.status as keyof typeof STATUS];

      return (
        <Flexbox ref={ref} variants={{ direction: 'column', gap: 'M' }} xstyle={[baseStyles.base, xstyle]} {...rest}>
          <Flexbox variants={{ direction: 'column', gap: 'XS' }}>
            <Flexbox variants={{ alignItems: 'center', gap: 'XS' }}>
              <Icon as={Phosphor.GitDiffIcon} weight="fill" variants={{ size: 'S' }} xstyle={baseStyles.metadataIcon} />
              <Text as="small" variants={{ color: 'subtle' }}>
                D{diff.number}
              </Text>
            </Flexbox>
            <Heading as="h1">
              <Link href={`/diff/${diff.number}`}>{diff.title}</Link>
            </Heading>
          </Flexbox>
          <MetadataList variants={{ size: 'compact' }} xstyle={baseStyles.metadata}>
            <Icon as={Phosphor.UserCircleIcon} xstyle={baseStyles.metadataIcon} />
            {diff.author ? <EmployeeReference fragmentRef={diff.author} /> : <Text variants={{ color: 'subtle' }}>Unknown author</Text>}
            <Icon as={Phosphor.ChatDotsIcon} xstyle={baseStyles.metadataIcon} />
            <Text>{diff.comments.length} comments</Text>
            <Icon as={Phosphor.ListNumbersIcon} xstyle={baseStyles.metadataIcon} />
            <Text>{diff.significantLines} significant lines</Text>
            <Icon as={Phosphor.PackageIcon} xstyle={baseStyles.metadataIcon} />
            <Text>
              Affects{' '}
              {joinWithAnd(diff.projects.map((project) => <Link key={project} href={`/project/${project}`}>{project}</Link>))}
            </Text>
            <Icon as={Phosphor.SignpostIcon} xstyle={baseStyles.metadataIcon} />
            <Flexbox variants={{ direction: 'column', gap: 'XS' }}>
              <Flexbox variants={{ gap: 'XS' }}>
                {status && <Badge label={status.label} variants={{ color: status.color }} />}
                {diff.tags?.slice(0, 2).map((tag) => <Badge key={tag} label={tag} />)}
              </Flexbox>
              {(diff.tags?.length ?? 0) > 2 && (
                <Text as="small">
                  <Link href={`/diff/${diff.number}/tags`}>See more tags</Link>
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

namespace DiffHoverCardContent {
  export interface Props extends Omit<bx.ComponentProps<'div'>, 'children'> {
    fragmentRef: DiffHoverCardContent_fragment$key;
  }
}

export default DiffHoverCardContent;

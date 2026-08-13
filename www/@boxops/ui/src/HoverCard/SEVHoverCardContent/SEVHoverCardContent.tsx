import { SSR as Phosphor } from '@phosphor-icons/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';

import { Badge } from '../../Badge';
import { DateTime } from '../../DateTime';
import { Flexbox } from '../../Flexbox';
import { Heading } from '../../Heading';
import { Icon } from '../../Icon';
import { LineClamp } from '../../LineClamp';
import { Link } from '../../Link';
import EmployeeLink from '../../Link/EmployeeLink/EmployeeLink';
import { MetadataList } from '../../MetadataList';
import { vars as metadataListVars } from '../../MetadataList/vars.stylex';
import { Text } from '../../Text';
import { iconColor } from '../../tokens.stylex';
import * as bx from '../../types';

import type { SEVHoverCardContent_fragment$key } from '@repo/relay-artifacts/src/__generated__/SEVHoverCardContent_fragment.graphql';

const fragment = graphql`
  fragment SEVHoverCardContent_fragment on EntSEV {
    number
    title
    stack
    severity
    tags
    description
    createdAt
    coordinator {
      ...EmployeeLink_fragment
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

// SEV 0 is the most severe, so the labels invert the usual reading of the enum.
const SEVERITY = {
  CRITICAL: { label: 'SEV 0', color: 'purple' },
  HIGH: { label: 'SEV 1', color: 'red' },
  MEDIUM: { label: 'SEV 2', color: 'orange' },
  LOW: { label: 'SEV 3', color: 'yellow' },
} as const satisfies Record<string, { label: string; color: NonNullable<Badge.Variants['color']> }>;

const SEVHoverCardContent = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, SEVHoverCardContent.Props>(function SEVHoverCardContent(
      { fragmentRef, xstyle, ...rest },
      ref,
    ) {
      const sev = useFragment(fragment, fragmentRef);
      const severity = SEVERITY[sev.severity as keyof typeof SEVERITY];

      return (
        <Flexbox ref={ref} variants={{ direction: 'column', gap: 'M' }} xstyle={[baseStyles.base, xstyle]} {...rest}>
          <Flexbox variants={{ direction: 'column', gap: 'XS' }}>
            <Flexbox variants={{ alignItems: 'center', gap: 'XS' }}>
              <Icon as={Phosphor.FlameIcon} weight="fill" variants={{ size: 'S' }} xstyle={baseStyles.metadataIcon} />
              <Text as="small" variants={{ color: 'subtle' }}>
                S{sev.number}
              </Text>
            </Flexbox>
            <Flexbox variants={{ gap: 'S', alignItems: 'center' }}>
              {severity && <Badge label={severity.label} variants={{ color: severity.color }} />}
              <Heading as="h1" xstyle={[LineClamp.styles.base, LineClamp.styles.clamp(1)]}>
                <Link href={`/sev/${sev.number}`}>{sev.title}</Link>
              </Heading>
            </Flexbox>
          </Flexbox>
          <MetadataList variants={{ size: 'compact' }} xstyle={baseStyles.metadata}>
            <Icon as={Phosphor.StackIcon} xstyle={baseStyles.metadataIcon} />
            <Text>{sev.stack ? <><Link href={`/stack/${sev.stack}`}>{sev.stack}</Link> Stack</> : 'Unassigned'}</Text>
            <Icon as={Phosphor.UserCircleIcon} xstyle={baseStyles.metadataIcon} />
            {sev.coordinator ? (
              <Flexbox variants={{ gap: 'S', alignItems: 'center' }}>
                <Text>Coordinated by</Text>
                <EmployeeLink fragmentRef={sev.coordinator} />
              </Flexbox>
            ) : (
              <Text variants={{ color: 'subtle' }}>No coordinator</Text>
            )}
            <Icon as={Phosphor.ChatDotsIcon} xstyle={baseStyles.metadataIcon} />
            <Text>{sev.comments.length} comments</Text>
            <Icon as={Phosphor.ClockIcon} xstyle={baseStyles.metadataIcon} />
            <Text>
              Created on <DateTime instant={new Date(sev.createdAt)} formatString="MMM d, yyyy" />
            </Text>
            <Icon as={Phosphor.SignpostIcon} xstyle={baseStyles.metadataIcon} />
            <Flexbox variants={{ gap: 'XS' }}>{sev.tags?.slice(0, 3).map((tag) => <Badge key={tag} label={tag} />)}</Flexbox>
            <Icon as={Phosphor.ArticleIcon} xstyle={baseStyles.metadataIcon} />
            <Text xstyle={[LineClamp.styles.base, LineClamp.styles.clamp(5)]}>{sev.description}</Text>
          </MetadataList>
        </Flexbox>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace SEVHoverCardContent {
  export interface Props extends Omit<bx.ComponentProps<'div'>, 'children'> {
    fragmentRef: SEVHoverCardContent_fragment$key;
  }
}

export default SEVHoverCardContent;

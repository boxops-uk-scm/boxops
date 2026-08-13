import { SSR as Phosphor } from '@phosphor-icons/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';

import { Button } from '../../Button';
import { Flexbox } from '../../Flexbox';
import { Heading } from '../../Heading';
import { Icon } from '../../Icon';
import { LineClamp } from '../../LineClamp';
import { Link } from '../../Link';
import { MetadataList } from '../../MetadataList';
import { vars as metadataListVars } from '../../MetadataList/vars.stylex';
import { Text } from '../../Text';
import { iconColor } from '../../tokens.stylex';
import * as bx from '../../types';

import type { OncallHoverCardContent_fragment$key } from '@repo/relay-artifacts/src/__generated__/OncallHoverCardContent_fragment.graphql';

const fragment = graphql`
  fragment OncallHoverCardContent_fragment on EntOncall {
    id
    name
    shortName
    products
    description
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
  grow: {
    flexGrow: 1,
  },
});

const OncallHoverCardContent = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'div'>, OncallHoverCardContent.Props>(function OncallHoverCardContent(
      { fragmentRef, xstyle, ...rest },
      ref,
    ) {
      const oncall = useFragment(fragment, fragmentRef);

      return (
        <Flexbox ref={ref} variants={{ direction: 'column', gap: 'M' }} xstyle={[baseStyles.base, xstyle]} {...rest}>
          <Flexbox variants={{ direction: 'column', gap: 'XS' }}>
            <Flexbox variants={{ alignItems: 'center', gap: 'XS' }}>
              <Icon as={Phosphor.UserSoundIcon} weight="fill" variants={{ size: 'S' }} xstyle={baseStyles.metadataIcon} />
              <Text as="small" variants={{ color: 'subtle' }}>
                {oncall.shortName}
              </Text>
            </Flexbox>
            <Heading as="h1">
              <Link href={`/oncall/${oncall.id}`}>{oncall.name}</Link>
            </Heading>
          </Flexbox>
          <MetadataList variants={{ size: 'compact' }} xstyle={baseStyles.metadata}>
            <Icon as={Phosphor.ListNumbersIcon} xstyle={baseStyles.metadataIcon} />
            {/* A list in the schema. The v2 source rendered the array straight into a `Text`, which
                concatenates the entries with no separator at all; each is a product you can open. */}
            <Text>
              {oncall.products.map((product, index) => (
                <React.Fragment key={product}>
                  {index > 0 && ', '}
                  <Link href={`/product/${product}`}>{product}</Link>
                </React.Fragment>
              ))}
            </Text>
            <Icon as={Phosphor.MegaphoneIcon} xstyle={baseStyles.metadataIcon} />
            <Text xstyle={[LineClamp.styles.base, LineClamp.styles.clamp(2)]}>{oncall.description}</Text>
          </MetadataList>
          <Flexbox variants={{ gap: 'S' }}>
            <Button label="File a task" xstyle={baseStyles.grow} startContent={<Icon as={Phosphor.CheckSquareIcon} />} />
            <Button aria-label="Message" startContent={<Icon as={Phosphor.ChatDotsIcon} />} />
            <Button aria-label="Call" startContent={<Icon as={Phosphor.PhoneIcon} />} />
          </Flexbox>
        </Flexbox>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace OncallHoverCardContent {
  export interface Props extends Omit<bx.ComponentProps<'div'>, 'children'> {
    fragmentRef: OncallHoverCardContent_fragment$key;
  }
}

export default OncallHoverCardContent;

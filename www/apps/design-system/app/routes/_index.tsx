import { Badge, Button, Dot, Heading, Icon, Spinner, Text, ButtonGroup, Tooltip, CopyButton, Toggle } from '@boxops/ui';
import {
  backgroundColor,
  dividerColor,
  iconColor,
  nonsemanticBackgroundColor,
  nonsemanticTextColor,
  outlineColor,
  semanticColor,
  textColor,
} from '@boxops/ui/tokens.stylex';
import { SSR as Phosphor } from '@phosphor-icons/react';
import * as stylex from '@stylexjs/stylex';
import React from 'react';

export function meta() {
  return [{ title: 'Text' }];
}

export default function IndexRoute() {
  return (
    <main {...stylex.props(styles.main)}>
      <Heading isContent>Colors</Heading>
      <Heading isContent as="h2">
        Semantic Colors
      </Heading>
      <section {...stylex.props(styles.grid)}>
        {
          Object.entries(semanticColor)
            .filter(([_, value]) => typeof value === 'string')
            .filter(([key, _]) => key !== '__varGroupHash__')
            .map(([key, value]) => <Swatch key={key} label={key} color={value} />) as React.ReactNode
        }
      </section>
      <Heading isContent as="h2">
        Outline Colors
      </Heading>
      <section {...stylex.props(styles.grid)}>
        {
          Object.entries(outlineColor)
            .filter(([_, value]) => typeof value === 'string')
            .filter(([key, _]) => key !== '__varGroupHash__')
            .map(([key, value]) => <Swatch key={key} label={key} color={value} />) as React.ReactNode
        }
      </section>
      <Heading isContent as="h2">
        Background Colors
      </Heading>
      <section {...stylex.props(styles.grid)}>
        {
          Object.entries(backgroundColor)
            .filter(([_, value]) => typeof value === 'string')
            .filter(([key, _]) => key !== '__varGroupHash__')
            .map(([key, value]) => <Swatch key={key} label={key} color={value} />) as React.ReactNode
        }
      </section>
      <Heading isContent as="h2">
        Non-semantic Background Colors
      </Heading>
      <section {...stylex.props(styles.grid)}>
        {
          Object.entries(nonsemanticBackgroundColor)
            .filter(([_, value]) => typeof value === 'string')
            .filter(([key, _]) => key !== '__varGroupHash__')
            .map(([key, value]) => <Swatch key={key} label={key} color={value} />) as React.ReactNode
        }
      </section>
      <Heading isContent as="h2">
        Text Colors
      </Heading>
      <section {...stylex.props(styles.grid)}>
        {
          Object.entries(textColor)
            .filter(([_, value]) => typeof value === 'string')
            .filter(([key, _]) => key !== '__varGroupHash__')
            .map(([key, value]) => <Swatch key={key} label={key} color={value} />) as React.ReactNode
        }
      </section>
      <Heading isContent as="h2">
        Non-semantic Text Colors
      </Heading>
      <section {...stylex.props(styles.grid)}>
        {
          Object.entries(nonsemanticTextColor)
            .filter(([_, value]) => typeof value === 'string')
            .filter(([key, _]) => key !== '__varGroupHash__')
            .map(([key, value]) => <Swatch key={key} label={key} color={value} />) as React.ReactNode
        }
      </section>
      <Heading isContent as="h2">
        Divider Colors
      </Heading>
      <section {...stylex.props(styles.grid)}>
        {
          Object.entries(dividerColor)
            .filter(([_, value]) => typeof value === 'string')
            .filter(([key, _]) => key !== '__varGroupHash__')
            .map(([key, value]) => <Swatch key={key} label={key} color={value} />) as React.ReactNode
        }
      </section>
      <Heading isContent as="h2">
        Icon Colors
      </Heading>
      <section {...stylex.props(styles.grid)}>
        {
          Object.entries(iconColor)
            .filter(([_, value]) => typeof value === 'string')
            .filter(([key, _]) => key !== '__varGroupHash__')
            .map(([key, value]) => <Swatch key={key} label={key} color={value} />) as React.ReactNode
        }
      </section>
      <Heading isContent>Text</Heading>
      <section {...stylex.props(styles.twoColumnGrid)}>
        <Heading as="h2" xstyle={styles.rightAlign}>
          span
        </Heading>
        <Text as="span">Lorem ipsum doler sit amet</Text>
        <Heading as="h2" xstyle={styles.rightAlign}>
          p
        </Heading>
        <Text as="p">Lorem ipsum doler sit amet</Text>
        <Heading as="h2" xstyle={styles.rightAlign}>
          small
        </Heading>
        <Text as="small">Lorem ipsum doler sit amet</Text>
        <Heading as="h2" xstyle={styles.rightAlign}>
          b
        </Heading>
        <Text as="b">Lorem ipsum doler sit amet</Text>
        <Heading as="h2" xstyle={styles.rightAlign}>
          i
        </Heading>
        <Text as="i">Lorem ipsum doler sit amet</Text>
        <Heading as="h2" xstyle={styles.rightAlign}>
          u
        </Heading>
        <Text as="u">Lorem ipsum doler sit amet</Text>
        <Heading as="h2" xstyle={styles.rightAlign}>
          s
        </Heading>
        <Text as="s">Lorem ipsum doler sit amet</Text>
        <Heading as="h2" xstyle={styles.rightAlign}>
          code
        </Heading>
        <Text as="code">Lorem ipsum doler sit amet</Text>
      </section>
      <Heading isContent>Headings</Heading>
      <section {...stylex.props(styles.content)}>
        <Heading as="h1">H1</Heading>
        <Heading as="h2">H2</Heading>
        <Heading as="h3">H3</Heading>
        <Heading as="h4">H4</Heading>
      </section>
      <section {...stylex.props(styles.content)}>
        <Heading as="h1" isContent>
          Title
        </Heading>
        <Heading as="h2" isContent>
          Section heading
        </Heading>
        <Heading as="h3" isContent>
          Content heading
        </Heading>
        <Heading as="h4" isContent>
          Group heading
        </Heading>
      </section>
      <Heading isContent>Icon</Heading>
      <section {...stylex.props(styles.iconGrid)}>
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="thin" variants={{ size: 'inline' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="thin" variants={{ size: 'S' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="thin" variants={{ size: 'M' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="thin" variants={{ size: 'L' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="thin" variants={{ size: 'XL' }} />
      </section>
      <section {...stylex.props(styles.iconGrid)}>
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="light" variants={{ size: 'inline' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="light" variants={{ size: 'S' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="light" variants={{ size: 'M' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="light" variants={{ size: 'L' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="light" variants={{ size: 'XL' }} />
      </section>
      <section {...stylex.props(styles.iconGrid)}>
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="regular" variants={{ size: 'inline' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="regular" variants={{ size: 'S' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="regular" variants={{ size: 'M' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="regular" variants={{ size: 'L' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="regular" variants={{ size: 'XL' }} />
      </section>
      <section {...stylex.props(styles.iconGrid)}>
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="bold" variants={{ size: 'inline' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="bold" variants={{ size: 'S' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="bold" variants={{ size: 'M' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="bold" variants={{ size: 'L' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="bold" variants={{ size: 'XL' }} />
      </section>
      <section {...stylex.props(styles.iconGrid)}>
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'inline' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'S' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'M' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'L' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'XL' }} />
      </section>
      <section {...stylex.props(styles.iconGrid, styles.darkMedia)}>
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'inline', color: 'onDarkMedia' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'S', color: 'onDarkMedia' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'M', color: 'onDarkMedia' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'L', color: 'onDarkMedia' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'XL', color: 'onDarkMedia' }} />
      </section>
      <section {...stylex.props(styles.iconGrid)}>
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'inline', color: 'secondary' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'S', color: 'secondary' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'M', color: 'secondary' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'L', color: 'secondary' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'XL', color: 'secondary' }} />
      </section>
      <section {...stylex.props(styles.iconGrid)}>
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'inline', color: 'disabled' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'S', color: 'disabled' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'M', color: 'disabled' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'L', color: 'disabled' }} />
        <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'XL', color: 'disabled' }} />
      </section>
      <Heading isContent>Badge</Heading>
      <section {...stylex.props(styles.grid)}>
        <Badge label="gray" variants={{ color: 'gray' }} />
        <Badge label="blue" variants={{ color: 'blue' }} />
        <Badge label="green" variants={{ color: 'green' }} />
        <Badge label="yellow" variants={{ color: 'yellow' }} />
        <Badge label="orange" variants={{ color: 'orange' }} />
        <Badge label="red" variants={{ color: 'red' }} />
        <Badge label="magenta" variants={{ color: 'magenta' }} />
        <Badge label="purple" variants={{ color: 'purple' }} />
        <Badge label="teal" variants={{ color: 'teal' }} />
        <Badge label="cyan" variants={{ color: 'cyan' }} />
      </section>
      <section {...stylex.props(styles.grid)}>
        <Badge startContent={<Dot />} label="gray" variants={{ color: 'gray' }} />
        <Badge startContent={<Dot />} label="blue" variants={{ color: 'blue' }} />
        <Badge startContent={<Dot />} label="green" variants={{ color: 'green' }} />
        <Badge startContent={<Dot />} label="yellow" variants={{ color: 'yellow' }} />
        <Badge startContent={<Dot />} label="orange" variants={{ color: 'orange' }} />
        <Badge startContent={<Dot />} label="red" variants={{ color: 'red' }} />
        <Badge startContent={<Dot />} label="magenta" variants={{ color: 'magenta' }} />
        <Badge startContent={<Dot />} label="purple" variants={{ color: 'purple' }} />
        <Badge startContent={<Dot />} label="teal" variants={{ color: 'teal' }} />
        <Badge startContent={<Dot />} label="cyan" variants={{ color: 'cyan' }} />
      </section>
      <Heading isContent>Spinner</Heading>
      <section {...stylex.props(styles.grid)}>
        <Spinner variants={{ size: 'S', color: 'onLightMedia' }} />
        <Spinner variants={{ size: 'M', color: 'onLightMedia' }} />
        <Spinner variants={{ size: 'L', color: 'onLightMedia' }} />
        <Spinner variants={{ size: 'XL', color: 'onLightMedia' }} />
      </section>
      <section {...stylex.props(styles.grid, styles.darkMedia)}>
        <Spinner variants={{ size: 'S', color: 'onDarkMedia' }} />
        <Spinner variants={{ size: 'M', color: 'onDarkMedia' }} />
        <Spinner variants={{ size: 'L', color: 'onDarkMedia' }} />
        <Spinner variants={{ size: 'XL', color: 'onDarkMedia' }} />
      </section>
      <Heading isContent>Button</Heading>
      <section {...stylex.props(styles.grid)}>
        <Button label="Button" variants={{ size: 'compact', appearance: 'default' }} />
        <Button label="Button" variants={{ size: 'compact', appearance: 'flat' }} />
        <Button label="Button" variants={{ size: 'compact', appearance: 'primary' }} />
        <Button label="Button" variants={{ size: 'compact', appearance: 'negative' }} />
        <Button label="Button" variants={{ size: 'compact', appearance: 'positive' }} />
      </section>
      <section {...stylex.props(styles.grid)}>
        <Button label="Button" disabled variants={{ appearance: 'default' }} />
        <Button label="Button" disabled variants={{ appearance: 'flat' }} />
        <Button label="Button" disabled variants={{ appearance: 'primary' }} />
        <Button label="Button" disabled variants={{ appearance: 'negative' }} />
        <Button label="Button" disabled variants={{ appearance: 'positive' }} />
      </section>
      <section {...stylex.props(styles.grid)}>
        <Button
          startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />}
          variants={{ appearance: 'default' }}
        />
        <Button startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />} variants={{ appearance: 'flat' }} />
        <Button
          startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />}
          variants={{ appearance: 'primary' }}
        />
        <Button
          startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />}
          variants={{ appearance: 'negative' }}
        />
        <Button
          startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />}
          variants={{ appearance: 'positive' }}
        />
      </section>
      <section {...stylex.props(styles.grid)}>
        <Button
          startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />}
          label="Button"
          variants={{ appearance: 'default' }}
        />
        <Button
          startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />}
          label="Button"
          variants={{ appearance: 'flat' }}
        />
        <Button
          startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />}
          label="Button"
          variants={{ appearance: 'primary' }}
        />
        <Button
          startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />}
          label="Button"
          variants={{ appearance: 'negative' }}
        />
        <Button
          startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />}
          label="Button"
          variants={{ appearance: 'positive' }}
        />
      </section>
      <section {...stylex.props(styles.grid)}>
        <Button
          endContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />}
          label="Button"
          variants={{ appearance: 'default' }}
        />
        <Button
          endContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />}
          label="Button"
          variants={{ appearance: 'flat' }}
        />
        <Button
          endContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />}
          label="Button"
          variants={{ appearance: 'primary' }}
        />
        <Button
          endContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />}
          label="Button"
          variants={{ appearance: 'negative' }}
        />
        <Button
          endContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />}
          label="Button"
          variants={{ appearance: 'positive' }}
        />
      </section>
      <section {...stylex.props(styles.grid)}>
        <Button endContent={<Badge label="99" />} label="Button" variants={{ appearance: 'default' }} />
        <Button endContent={<Badge label="99" />} label="Button" variants={{ appearance: 'flat' }} />
        <Button endContent={<Badge label="99" />} label="Button" variants={{ appearance: 'primary' }} />
        <Button endContent={<Badge label="99" />} label="Button" variants={{ appearance: 'negative' }} />
        <Button endContent={<Badge label="99" />} label="Button" variants={{ appearance: 'positive' }} />
      </section>
      <section {...stylex.props(styles.grid)}>
        <Button label="Button" variants={{ appearance: 'default' }} />
        <Button label="Button" variants={{ appearance: 'flat' }} />
        <Button label="Button" variants={{ appearance: 'primary' }} />
        <Button label="Button" variants={{ appearance: 'negative' }} />
        <Button label="Button" variants={{ appearance: 'positive' }} />
      </section>
      <section {...stylex.props(styles.grid)}>
        <Button loading label="Button" variants={{ appearance: 'default' }} />
        <Button loading label="Button" variants={{ appearance: 'flat' }} />
        <Button loading label="Button" variants={{ appearance: 'primary' }} />
        <Button loading label="Button" variants={{ appearance: 'negative' }} />
        <Button loading label="Button" variants={{ appearance: 'positive' }} />
      </section>
      <section {...stylex.props(styles.grid)}>
        <Button loading disabled label="Button" variants={{ appearance: 'default' }} />
        <Button loading disabled label="Button" variants={{ appearance: 'flat' }} />
        <Button loading disabled label="Button" variants={{ appearance: 'primary' }} />
        <Button loading disabled label="Button" variants={{ appearance: 'negative' }} />
        <Button loading disabled label="Button" variants={{ appearance: 'positive' }} />
      </section>
      <section {...stylex.props(styles.grid)}>
        <Button
          startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />}
          endContent={<Badge label="99" />}
          label="Button"
          disabled
          variants={{ appearance: 'default' }}
        />
        <Button
          startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />}
          endContent={<Badge label="99" />}
          label="Button"
          disabled
          variants={{ appearance: 'flat' }}
        />
        <Button
          startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />}
          endContent={<Badge label="99" />}
          label="Button"
          disabled
          variants={{ appearance: 'primary' }}
        />
        <Button
          startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />}
          endContent={<Badge label="99" />}
          label="Button"
          disabled
          variants={{ appearance: 'negative' }}
        />
        <Button
          startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />}
          endContent={<Badge label="99" />}
          label="Button"
          disabled
          variants={{ appearance: 'positive' }}
        />
      </section>
      <Heading isContent>Button Group</Heading>
      <section {...stylex.props(styles.grid)}>
        <ButtonGroup>
          <Button label="Edit" startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />} />
          <Button label="Duplicate" startContent={(props) => <Icon as={Phosphor.CopyIcon} {...props} />} />
          <Button label="Download" startContent={(props) => <Icon as={Phosphor.DownloadSimpleIcon} {...props} />} />
        </ButtonGroup>
      </section>
      <Heading isContent>Tooltip</Heading>
      <section {...stylex.props(styles.content, styles.alignCenter)}>
        <div {...stylex.props(styles.threeColumnGrid)}>
          <span />
          <Tooltip
            side="top"
            label="Tooltip showing above"
            trigger={
              <Button
                variants={{ appearance: 'flat' }}
                startContent={({ variants, ...props }) => (
                  <Icon as={Phosphor.InfoIcon} {...props} weight="fill" variants={{ ...variants, color: 'secondary' }} />
                )}
              />
            }
          />
          <span />
          <Tooltip
            side="left"
            label="Tooltip showing to the left"
            trigger={
              <Button
                variants={{ appearance: 'flat' }}
                startContent={({ variants, ...props }) => (
                  <Icon as={Phosphor.InfoIcon} {...props} weight="fill" variants={{ ...variants, color: 'secondary' }} />
                )}
              />
            }
          />
          <span />
          <Tooltip
            side="right"
            label="Tooltip showing to the right"
            trigger={
              <Button
                variants={{ appearance: 'flat' }}
                startContent={({ variants, ...props }) => (
                  <Icon as={Phosphor.InfoIcon} {...props} weight="fill" variants={{ ...variants, color: 'secondary' }} />
                )}
              />
            }
          />
          <span />
          <Tooltip
            side="bottom"
            label="Tooltip showing below"
            trigger={
              <Button
                variants={{ appearance: 'flat' }}
                startContent={({ variants, ...props }) => (
                  <Icon as={Phosphor.InfoIcon} {...props} weight="fill" variants={{ ...variants, color: 'secondary' }} />
                )}
              />
            }
          />
          <span />
        </div>
      </section>
      <Heading isContent>Copy Button</Heading>
      <section {...stylex.props(styles.content, styles.alignCenter)}>
        <CopyButton clipboardValue="Text to copy" />
      </section>
      <Heading isContent>Toggle</Heading>
      <section {...stylex.props(styles.grid, styles.alignCenter)}>
        <Toggle label="Edit" startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />} />
        <Toggle defaultPressed label="Edit" startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />} />
        <Toggle disabled label="Edit" startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />} />
        <Toggle
          defaultPressed
          disabled
          label="Edit"
          startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />}
        />
        <Toggle loading label="Edit" startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />} />
        <Toggle loading disabled label="Edit" startContent={(props) => <Icon as={Phosphor.PencilSimpleIcon} {...props} />} />
      </section>
    </main>
  );
}

function Swatch({ label, color }: { label: string; color: string }) {
  return (
    <div {...stylex.props(styles.swatchContainer)}>
      <div {...stylex.props(styles.swatch(color))} />
      <Text as="small">{label}</Text>
    </div>
  );
}

export const links = () => [];

const styles = stylex.create({
  main: {
    inlineSize: '100%',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '1rem',
    justifyItems: 'center',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: '1rem',
  },
  threeColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '1rem',
    justifyItems: 'center',
  },
  swatch: (color: string) => ({
    backgroundColor: color,
    width: '100%',
    height: '50px',
  }),
  swatchContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    width: '100%',
  },
  alignCenter: {
    alignItems: 'center',
  },
  rightAlign: {
    textAlign: 'right',
  },
  iconGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(3rem, 1fr))',
    gap: '1rem',
    height: '50px',
  },
  darkMedia: {
    backgroundColor: backgroundColor.tooltip,
  },
});

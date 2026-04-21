import {
  Badge,
  Button,
  Dot,
  Heading,
  Icon,
  Spinner,
  Text,
  ButtonGroup,
  Tooltip,
  CopyButton,
  Toggle,
  Card,
  CardHeader,
  CardFooter,
  MetadataLabel,
  MetadataList,
} from '@boxops/ui';
import {
  backgroundColor,
  dividerColor,
  gap,
  iconColor,
  nonsemanticBackgroundColor,
  nonsemanticTextColor,
  outlineColor,
  padding,
  semanticColor,
  textColor,
} from '@boxops/ui/tokens.stylex';
import { SSR as Phosphor } from '@phosphor-icons/react';
import * as stylex from '@stylexjs/stylex';
import React from 'react';

export function meta() {
  return [{ title: 'Text' }];
}

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

  twoColumnGridSection: {
    display: 'grid',
    gridTemplateColumns: 'max-content 1fr',
    gap: '1rem',
  },
  subgridHeading: {
    gridColumn: '1 / -1',
  },
  twoColumnSubgrid: {
    gridColumn: '1 / -1',
    display: 'grid',
    gridTemplateColumns: 'subgrid',
    gap: '1rem',
    alignItems: 'center',
  },
  componentStage: {
    backgroundImage: 'url(https://boxops-static.s3.eu-north-1.amazonaws.com/public/checkboard.svg)',
    backgroundSize: '64px',
    borderColor: dividerColor.subtle,
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: '8px',
    padding: '12px',
  },
  slot: {
    padding: padding.XS,
    borderRadius: '4px',
    borderWidth: '1px',
    borderStyle: 'dashed',
    borderColor: 'oklch(0% 0 0 / 30%)',
    backgroundImage:
      "url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuXzk1dG14IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iOS41IiBoZWlnaHQ9IjkuNSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PGxpbmUgeDE9IjAiIHk9IjAiIHgyPSIwIiB5Mj0iOS41IiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+IDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybl85NXRteCkiIG9wYWNpdHk9IjAuMyIvPjwvc3ZnPg==')",
    width: '100%',
    height: '300px',
  },
});

export default function IndexRoute() {
  return (
    <main {...stylex.props(styles.main)}>
      <Heading isContent as="h1">
        Colors
      </Heading>
      <section {...stylex.props(styles.twoColumnGridSection)}>
        <div {...stylex.props(styles.subgridHeading)}>
          <Heading isContent as="h2">
            Semantic Colors
          </Heading>
        </div>
        <div {...stylex.props(styles.twoColumnSubgrid, styles.componentStage)}>
          {
            Object.entries(semanticColor)
              .filter(([_, value]) => typeof value === 'string')
              .filter(([key, _]) => key !== '__varGroupHash__')
              .flatMap(([key, value]) => [
                <Text key={`${key}-label`} as="small">
                  {key}
                </Text>,
                <div key={`${key}-swatch`} {...stylex.props(styles.swatch(value as string))} />,
              ]) as React.ReactNode
          }
        </div>
        <div {...stylex.props(styles.subgridHeading)}>
          <Heading isContent as="h2">
            Outline Colors
          </Heading>
        </div>
        <div {...stylex.props(styles.twoColumnSubgrid, styles.componentStage)}>
          {
            Object.entries(outlineColor)
              .filter(([_, value]) => typeof value === 'string')
              .filter(([key, _]) => key !== '__varGroupHash__')
              .flatMap(([key, value]) => [
                <Text key={`${key}-label`} as="small">
                  {key}
                </Text>,
                <div key={`${key}-swatch`} {...stylex.props(styles.swatch(value as string))} />,
              ]) as React.ReactNode
          }
        </div>
        <div {...stylex.props(styles.subgridHeading)}>
          <Heading isContent as="h2">
            Background Colors
          </Heading>
        </div>
        <div {...stylex.props(styles.twoColumnSubgrid, styles.componentStage)}>
          {
            Object.entries(backgroundColor)
              .filter(([_, value]) => typeof value === 'string')
              .filter(([key, _]) => key !== '__varGroupHash__')
              .flatMap(([key, value]) => [
                <Text key={`${key}-label`} as="small">
                  {key}
                </Text>,
                <div key={`${key}-swatch`} {...stylex.props(styles.swatch(value as string))} />,
              ]) as React.ReactNode
          }
        </div>
        <div {...stylex.props(styles.subgridHeading)}>
          <Heading isContent as="h2">
            Non-semantic Background Colors
          </Heading>
        </div>
        <div {...stylex.props(styles.twoColumnSubgrid, styles.componentStage)}>
          {
            Object.entries(nonsemanticBackgroundColor)
              .filter(([_, value]) => typeof value === 'string')
              .filter(([key, _]) => key !== '__varGroupHash__')
              .flatMap(([key, value]) => [
                <Text key={`${key}-label`} as="small">
                  {key}
                </Text>,
                <div key={`${key}-swatch`} {...stylex.props(styles.swatch(value as string))} />,
              ]) as React.ReactNode
          }
        </div>
        <div {...stylex.props(styles.subgridHeading)}>
          <Heading isContent as="h2">
            Text Colors
          </Heading>
        </div>
        <div {...stylex.props(styles.twoColumnSubgrid, styles.componentStage)}>
          {
            Object.entries(textColor)
              .filter(([_, value]) => typeof value === 'string')
              .filter(([key, _]) => key !== '__varGroupHash__')
              .flatMap(([key, value]) => [
                <Text key={`${key}-label`} as="small">
                  {key}
                </Text>,
                <div key={`${key}-swatch`} {...stylex.props(styles.swatch(value as string))} />,
              ]) as React.ReactNode
          }
        </div>
        <div {...stylex.props(styles.subgridHeading)}>
          <Heading isContent as="h2">
            Non-semantic Text Colors
          </Heading>
        </div>
        <div {...stylex.props(styles.twoColumnSubgrid, styles.componentStage)}>
          {
            Object.entries(nonsemanticTextColor)
              .filter(([_, value]) => typeof value === 'string')
              .filter(([key, _]) => key !== '__varGroupHash__')
              .flatMap(([key, value]) => [
                <Text key={`${key}-label`} as="small">
                  {key}
                </Text>,
                <div key={`${key}-swatch`} {...stylex.props(styles.swatch(value as string))} />,
              ]) as React.ReactNode
          }
        </div>
        <div {...stylex.props(styles.subgridHeading)}>
          <Heading isContent as="h2">
            Divider Colors
          </Heading>
        </div>
        <div {...stylex.props(styles.twoColumnSubgrid, styles.componentStage)}>
          {
            Object.entries(dividerColor)
              .filter(([_, value]) => typeof value === 'string')
              .filter(([key, _]) => key !== '__varGroupHash__')
              .flatMap(([key, value]) => [
                <Text key={`${key}-label`} as="small">
                  {key}
                </Text>,
                <div key={`${key}-swatch`} {...stylex.props(styles.swatch(value as string))} />,
              ]) as React.ReactNode
          }
        </div>
        <div {...stylex.props(styles.subgridHeading)}>
          <Heading isContent as="h2">
            Icon Colors
          </Heading>
        </div>
        <div {...stylex.props(styles.twoColumnSubgrid, styles.componentStage)}>
          {
            Object.entries(iconColor)
              .filter(([_, value]) => typeof value === 'string')
              .filter(([key, _]) => key !== '__varGroupHash__')
              .flatMap(([key, value]) => [
                <Text key={`${key}-label`} as="small">
                  {key}
                </Text>,
                <div key={`${key}-swatch`} {...stylex.props(styles.swatch(value as string))} />,
              ]) as React.ReactNode
          }
        </div>
      </section>
      <Heading isContent as="h1">
        Typography
      </Heading>
      <section {...stylex.props(styles.twoColumnGridSection)}>
        <div {...stylex.props(styles.subgridHeading)}>
          <Heading as="h2" isContent>
            Text
          </Heading>
        </div>
        <section {...stylex.props(styles.twoColumnSubgrid, styles.componentStage)}>
          <Text>span</Text>
          <Text as="span">Lorem ipsum doler sit amet</Text>
          <Text>p</Text>
          <Text as="p">Lorem ipsum doler sit amet</Text>
          <Text>small</Text>
          <Text as="small">Lorem ipsum doler sit amet</Text>
          <Text>b</Text>
          <Text as="b">Lorem ipsum doler sit amet</Text>
          <Text>i</Text>
          <Text as="i">Lorem ipsum doler sit amet</Text>
          <Text>u</Text>
          <Text as="u">Lorem ipsum doler sit amet</Text>
          <Text>s</Text>
          <Text as="s">Lorem ipsum doler sit amet</Text>
          <Text>code</Text>
          <Text as="code">Lorem ipsum doler sit amet</Text>
        </section>
        <div {...stylex.props(styles.subgridHeading)}>
          <Heading as="h2" isContent>
            Headings
          </Heading>
        </div>
        <section {...stylex.props(styles.twoColumnSubgrid, styles.componentStage)}>
          <Text>H1</Text>
          <Heading as="h1">Lorem ipsum doler sit amet</Heading>
          <Text>H2</Text>
          <Heading as="h2">Lorem ipsum doler sit amet</Heading>
          <Text>H3</Text>
          <Heading as="h3">Lorem ipsum doler sit amet</Heading>
          <Text>H4</Text>
          <Heading as="h4">Lorem ipsum doler sit amet</Heading>
          <Text>Title</Text>
          <Heading isContent as="h1">
            Lorem ipsum doler sit amet
          </Heading>
          <Text>Section heading</Text>
          <Heading isContent as="h2">
            Lorem ipsum doler sit amet
          </Heading>
          <Text>Content heading</Text>
          <Heading isContent as="h3">
            Lorem ipsum doler sit amet
          </Heading>
          <Text>Group heading</Text>
          <Heading isContent as="h4">
            Lorem ipsum doler sit amet
          </Heading>
        </section>
      </section>
      <Heading isContent>Icon</Heading>
      <section {...stylex.props(styles.componentStage)}>
        <div {...stylex.props(styles.iconGrid)}>
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="thin" variants={{ size: 'inline' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="thin" variants={{ size: 'S' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="thin" variants={{ size: 'M' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="thin" variants={{ size: 'L' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="thin" variants={{ size: 'XL' }} />
        </div>
        <div {...stylex.props(styles.iconGrid)}>
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="light" variants={{ size: 'inline' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="light" variants={{ size: 'S' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="light" variants={{ size: 'M' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="light" variants={{ size: 'L' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="light" variants={{ size: 'XL' }} />
        </div>
        <div {...stylex.props(styles.iconGrid)}>
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="regular" variants={{ size: 'inline' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="regular" variants={{ size: 'S' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="regular" variants={{ size: 'M' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="regular" variants={{ size: 'L' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="regular" variants={{ size: 'XL' }} />
        </div>
        <div {...stylex.props(styles.iconGrid)}>
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="bold" variants={{ size: 'inline' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="bold" variants={{ size: 'S' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="bold" variants={{ size: 'M' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="bold" variants={{ size: 'L' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="bold" variants={{ size: 'XL' }} />
        </div>
        <div {...stylex.props(styles.iconGrid)}>
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'inline' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'S' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'M' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'L' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'XL' }} />
        </div>
        <div {...stylex.props(styles.iconGrid, styles.darkMedia)}>
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'inline', color: 'onDarkMedia' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'S', color: 'onDarkMedia' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'M', color: 'onDarkMedia' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'L', color: 'onDarkMedia' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'XL', color: 'onDarkMedia' }} />
        </div>
        <div {...stylex.props(styles.iconGrid)}>
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'inline', color: 'secondary' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'S', color: 'secondary' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'M', color: 'secondary' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'L', color: 'secondary' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'XL', color: 'secondary' }} />
        </div>
        <div {...stylex.props(styles.iconGrid)}>
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'inline', color: 'disabled' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'S', color: 'disabled' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'M', color: 'disabled' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'L', color: 'disabled' }} />
          <Icon as={Phosphor.FlagBannerFoldIcon} weight="fill" variants={{ size: 'XL', color: 'disabled' }} />
        </div>
      </section>
      <Heading isContent>Badge</Heading>
      <section {...stylex.props(styles.grid, styles.componentStage)}>
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
      <section {...stylex.props(styles.grid, styles.componentStage)}>
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
      <section {...stylex.props(styles.grid, styles.componentStage)}>
        <Button label="Button" variants={{ size: 'compact', appearance: 'default' }} />
        <Button label="Button" variants={{ size: 'compact', appearance: 'flat' }} />
        <Button label="Button" variants={{ size: 'compact', appearance: 'primary' }} />
        <Button label="Button" variants={{ size: 'compact', appearance: 'negative' }} />
        <Button label="Button" variants={{ size: 'compact', appearance: 'positive' }} />
      </section>
      <section {...stylex.props(styles.grid, styles.componentStage)}>
        <Button label="Button" disabled variants={{ appearance: 'default' }} />
        <Button label="Button" disabled variants={{ appearance: 'flat' }} />
        <Button label="Button" disabled variants={{ appearance: 'primary' }} />
        <Button label="Button" disabled variants={{ appearance: 'negative' }} />
        <Button label="Button" disabled variants={{ appearance: 'positive' }} />
      </section>
      <section {...stylex.props(styles.grid, styles.componentStage)}>
        <Button startContent={<Icon as={Phosphor.PencilSimpleIcon} />} variants={{ appearance: 'default' }} />
        <Button startContent={<Icon as={Phosphor.PencilSimpleIcon} />} variants={{ appearance: 'flat' }} />
        <Button startContent={<Icon as={Phosphor.PencilSimpleIcon} />} variants={{ appearance: 'primary' }} />
        <Button startContent={<Icon as={Phosphor.PencilSimpleIcon} />} variants={{ appearance: 'negative' }} />
        <Button startContent={<Icon as={Phosphor.PencilSimpleIcon} />} variants={{ appearance: 'positive' }} />
      </section>
      <section {...stylex.props(styles.grid, styles.componentStage)}>
        <Button startContent={<Icon as={Phosphor.PencilSimpleIcon} />} label="Button" variants={{ appearance: 'default' }} />
        <Button startContent={<Icon as={Phosphor.PencilSimpleIcon} />} label="Button" variants={{ appearance: 'flat' }} />
        <Button startContent={<Icon as={Phosphor.PencilSimpleIcon} />} label="Button" variants={{ appearance: 'primary' }} />
        <Button startContent={<Icon as={Phosphor.PencilSimpleIcon} />} label="Button" variants={{ appearance: 'negative' }} />
        <Button startContent={<Icon as={Phosphor.PencilSimpleIcon} />} label="Button" variants={{ appearance: 'positive' }} />
      </section>
      <section {...stylex.props(styles.grid, styles.componentStage)}>
        <Button endContent={<Icon as={Phosphor.PencilSimpleIcon} />} label="Button" variants={{ appearance: 'default' }} />
        <Button endContent={<Icon as={Phosphor.PencilSimpleIcon} />} label="Button" variants={{ appearance: 'flat' }} />
        <Button endContent={<Icon as={Phosphor.PencilSimpleIcon} />} label="Button" variants={{ appearance: 'primary' }} />
        <Button endContent={<Icon as={Phosphor.PencilSimpleIcon} />} label="Button" variants={{ appearance: 'negative' }} />
        <Button endContent={<Icon as={Phosphor.PencilSimpleIcon} />} label="Button" variants={{ appearance: 'positive' }} />
      </section>
      <section {...stylex.props(styles.grid, styles.componentStage)}>
        <Button endContent={<Badge label="99" />} label="Button" variants={{ appearance: 'default' }} />
        <Button endContent={<Badge label="99" />} label="Button" variants={{ appearance: 'flat' }} />
        <Button endContent={<Badge label="99" />} label="Button" variants={{ appearance: 'primary' }} />
        <Button endContent={<Badge label="99" />} label="Button" variants={{ appearance: 'negative' }} />
        <Button endContent={<Badge label="99" />} label="Button" variants={{ appearance: 'positive' }} />
      </section>
      <section {...stylex.props(styles.grid, styles.componentStage)}>
        <Button label="Button" variants={{ appearance: 'default' }} />
        <Button label="Button" variants={{ appearance: 'flat' }} />
        <Button label="Button" variants={{ appearance: 'primary' }} />
        <Button label="Button" variants={{ appearance: 'negative' }} />
        <Button label="Button" variants={{ appearance: 'positive' }} />
      </section>
      <section {...stylex.props(styles.grid, styles.componentStage)}>
        <Button loading label="Button" variants={{ appearance: 'default' }} />
        <Button loading label="Button" variants={{ appearance: 'flat' }} />
        <Button loading label="Button" variants={{ appearance: 'primary' }} />
        <Button loading label="Button" variants={{ appearance: 'negative' }} />
        <Button loading label="Button" variants={{ appearance: 'positive' }} />
      </section>
      <section {...stylex.props(styles.grid, styles.componentStage)}>
        <Button loading disabled label="Button" variants={{ appearance: 'default' }} />
        <Button loading disabled label="Button" variants={{ appearance: 'flat' }} />
        <Button loading disabled label="Button" variants={{ appearance: 'primary' }} />
        <Button loading disabled label="Button" variants={{ appearance: 'negative' }} />
        <Button loading disabled label="Button" variants={{ appearance: 'positive' }} />
      </section>
      <section {...stylex.props(styles.grid, styles.componentStage)}>
        <Button
          startContent={<Icon as={Phosphor.PencilSimpleIcon} />}
          endContent={<Badge label="99" />}
          label="Button"
          disabled
          variants={{ appearance: 'default' }}
        />
        <Button
          startContent={<Icon as={Phosphor.PencilSimpleIcon} />}
          endContent={<Badge label="99" />}
          label="Button"
          disabled
          variants={{ appearance: 'flat' }}
        />
        <Button
          startContent={<Icon as={Phosphor.PencilSimpleIcon} />}
          endContent={<Badge label="99" />}
          label="Button"
          disabled
          variants={{ appearance: 'primary' }}
        />
        <Button
          startContent={<Icon as={Phosphor.PencilSimpleIcon} />}
          endContent={<Badge label="99" />}
          label="Button"
          disabled
          variants={{ appearance: 'negative' }}
        />
        <Button
          startContent={<Icon as={Phosphor.PencilSimpleIcon} />}
          endContent={<Badge label="99" />}
          label="Button"
          disabled
          variants={{ appearance: 'positive' }}
        />
      </section>
      <Heading isContent>Tooltip</Heading>
      <section {...stylex.props(styles.content, styles.alignCenter, styles.componentStage)}>
        <div {...stylex.props(styles.threeColumnGrid)}>
          <span />
          <Tooltip
            side="top"
            label="Tooltip showing above"
            trigger={
              <Button
                variants={{ appearance: 'flat' }}
                startContent={<Icon as={Phosphor.InfoIcon} weight="fill" variants={{ color: 'secondary' }} />}
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
                startContent={<Icon as={Phosphor.InfoIcon} weight="fill" variants={{ color: 'secondary' }} />}
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
                startContent={<Icon as={Phosphor.InfoIcon} weight="fill" variants={{ color: 'secondary' }} />}
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
                startContent={<Icon as={Phosphor.InfoIcon} weight="fill" variants={{ color: 'secondary' }} />}
              />
            }
          />
          <span />
        </div>
      </section>
      <Heading isContent>Copy Button</Heading>
      <section {...stylex.props(styles.content, styles.alignCenter, styles.componentStage)}>
        <CopyButton clipboardValue="Text to copy" />
      </section>
      <Heading isContent>Toggle</Heading>
      <section {...stylex.props(styles.grid, styles.alignCenter, styles.componentStage)}>
        <Toggle label="Edit" startContent={<Icon as={Phosphor.PencilSimpleIcon} />} />
        <Toggle defaultPressed label="Edit" startContent={<Icon as={Phosphor.PencilSimpleIcon} />} />
        <Toggle variants={{ appearance: 'flat' }} label="Edit" startContent={<Icon as={Phosphor.PencilSimpleIcon} />} />
        <Toggle
          variants={{ appearance: 'flat' }}
          defaultPressed
          label="Edit"
          startContent={<Icon as={Phosphor.PencilSimpleIcon} />}
        />
        <Toggle disabled label="Edit" startContent={<Icon as={Phosphor.PencilSimpleIcon} />} />
        <Toggle defaultPressed disabled label="Edit" startContent={<Icon as={Phosphor.PencilSimpleIcon} />} />
        <Toggle loading label="Edit" startContent={<Icon as={Phosphor.PencilSimpleIcon} />} />
        <Toggle loading disabled label="Edit" startContent={<Icon as={Phosphor.PencilSimpleIcon} />} />
      </section>
      <Heading isContent>Button Group</Heading>
      <section {...stylex.props(styles.grid, styles.componentStage)}>
        <ButtonGroup>
          <Button label="Edit" startContent={<Icon as={Phosphor.PencilSimpleIcon} />} />
          <Button label="Duplicate" startContent={<Icon as={Phosphor.CopyIcon} />} />
          <Button label="Download" startContent={<Icon as={Phosphor.DownloadSimpleIcon} />} />
        </ButtonGroup>
      </section>
      <section {...stylex.props(styles.grid, styles.componentStage)}>
        <ButtonGroup>
          <Toggle label="Edit" startContent={<Icon as={Phosphor.PencilSimpleIcon} />} />
          <Toggle label="Duplicate" startContent={<Icon as={Phosphor.CopyIcon} />} />
          <Toggle label="Download" startContent={<Icon as={Phosphor.DownloadSimpleIcon} />} />
        </ButtonGroup>
      </section>
      <Heading isContent>Card</Heading>
      <section {...stylex.props(styles.content, styles.componentStage)}>
        <Card>
          <div {...stylex.props(styles.slot)} />
        </Card>
        <Card>
          <CardHeader title="Title" />
          <div {...stylex.props(styles.slot)} />
        </Card>
        <Card>
          <CardHeader title="Title" subtitle="Subtitle" />
          <div {...stylex.props(styles.slot)} />
        </Card>
        <Card>
          <CardHeader
            startContent={<Icon as={Phosphor.GitDiffIcon} variants={{ size: 'XL' }} />}
            title="Title"
            subtitle="Subtitle"
          />
          <div {...stylex.props(styles.slot)} />
        </Card>
        <Card>
          <CardHeader
            startContent={<Icon as={Phosphor.GitDiffIcon} variants={{ size: 'XL' }} />}
            title="Title"
            subtitle="Subtitle"
            endContent={
              <ButtonGroup>
                <Button variants={{ size: 'compact' }} startContent={<Icon as={Phosphor.LinkSimpleIcon} weight="bold" />} />
                <Button variants={{ size: 'compact' }} startContent={<Icon as={Phosphor.CopyIcon} />} />
                <Button variants={{ size: 'compact' }} startContent={<Icon as={Phosphor.PencilSimpleIcon} />} />
                <Button variants={{ size: 'compact' }} startContent={<Icon as={Phosphor.DotsThreeIcon} weight="bold" />} />
              </ButtonGroup>
            }
          />
          <div {...stylex.props(styles.slot)} />
        </Card>
        <Card>
          <div {...stylex.props(styles.slot)} />
          <CardFooter primaryButton={({ buttonProps }) => <Button label="Done" {...buttonProps} />} />
        </Card>
        <Card>
          <div {...stylex.props(styles.slot)} />
          <CardFooter
            primaryButton={({ buttonProps }) => <Button label="Confirm" {...buttonProps} />}
            secondaryButton={({ buttonProps }) => <Button label="Cancel" {...buttonProps} />}
          />
        </Card>
        <Card>
          <div {...stylex.props(styles.slot)} />
          <CardFooter
            startContent={<Button variants={{ size: 'compact' }} label="Undo" />}
            primaryButton={({ buttonProps }) => <Button label="Confirm" {...buttonProps} />}
            secondaryButton={({ buttonProps }) => <Button label="Cancel" {...buttonProps} />}
          />
        </Card>
        <Card>
          <div {...stylex.props(styles.slot)} />
          <CardFooter
            variants={{ layout: 'stretch' }}
            primaryButton={({ buttonProps }) => <Button label="Done" {...buttonProps} />}
          />
        </Card>
        <Card>
          <div {...stylex.props(styles.slot)} />
          <CardFooter
            variants={{ layout: 'stretch' }}
            primaryButton={({ buttonProps }) => <Button label="Confirm" {...buttonProps} />}
            secondaryButton={({ buttonProps }) => <Button label="Cancel" {...buttonProps} />}
          />
        </Card>
      </section>
      <Heading isContent>Metadata List</Heading>
      <section {...stylex.props(styles.componentStage)}>
        <MetadataList title="H4 heading text" subtitle="Description text">
          <MetadataLabel helpMessage="Help message">Metadata label</MetadataLabel>
          <Text>Text value</Text>
          <MetadataLabel>Metadata label</MetadataLabel>
          <div style={{ display: 'flex', gap: gap.S }}>
            <Badge label="Label" />
            <Badge label="Label" />
            <Badge label="Label" />
          </div>
        </MetadataList>
      </section>
    </main>
  );
}

export const links = () => [];

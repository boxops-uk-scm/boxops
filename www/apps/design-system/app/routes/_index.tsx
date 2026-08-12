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
  Divider,
  StatusDot,
  Flexbox,
  Glimmer,
  LineClamp,
  Logo,
  TextPair,
  Toast,
  UncontrolledSplitButton,
  SplitButtonMenuItem,
  RichTextArea,
  SideNav,
  PortalContainerProvider,
  Link,
  List,
  ListItem,
  Avatar,
  AvatarImage,
  AvatarInitials,
  AvatarIcon,
  Meter,
  UncontrolledBanner,
  ToolsMenu,
  AvatarGroup,
  Sitemap,
  ProfileMenu,
  UncontrolledProfileMenu,
} from '@boxops/ui';
import { vars as metadataListVars } from '@boxops/ui/MetadataList/vars.stylex';
import { palette } from '@boxops/ui/palette.stylex';
import { darkTheme, lightTheme } from '@boxops/ui/themes.stylex';
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

import { DiffHoverCardStory } from '../stories/DiffHoverCardStory';
import { EmployeeAvatarStory } from '../stories/EmployeeAvatarStory';
import { EmployeeHoverCardStory } from '../stories/EmployeeHoverCardStory';
import { EmployeeLinkStory } from '../stories/EmployeeLinkStory';
import { MeetingMenuStory } from '../stories/MeetingMenuStory';
import { NotificationStory } from '../stories/NotificationStory';
import { OncallHoverCardStory } from '../stories/OncallHoverCardStory';
import { SEVHoverCardStory } from '../stories/SEVHoverCardStory';
import { TaskHoverCardStory } from '../stories/TaskHoverCardStory';

export function meta() {
  return [{ title: 'Text' }];
}

const styles = stylex.create({
  // Two independently themed panes sharing one scroll position, so any component can be compared
  // across schemes by looking straight across. Falls back to stacking when there is no room.
  split: {
    display: 'grid',
    gridTemplateColumns: {
      default: '1fr 1fr',
      '@media (max-width: 900px)': '1fr',
    },
    alignItems: 'start',
    minBlockSize: '100dvb',
  },
  pane: {
    inlineSize: '100%',
    // Without this a grid item's automatic minimum is its content, so one wide component in either
    // pane stops both from shrinking and forces the page to scroll sideways.
    minInlineSize: 0,
    minBlockSize: '100dvb',
    backgroundColor: backgroundColor.surface,
    // `Text` inherits its colour, so the pane establishes the body ink for each scheme.
    color: textColor.primary,
    borderInlineEndWidth: {
      default: '1px',
      '@media (max-width: 900px)': '0',
    },
    borderInlineEndStyle: 'solid',
    borderInlineEndColor: dividerColor.subtle,
  },
  paneLabel: {
    position: 'sticky',
    insetBlockStart: 0,
    zIndex: 10,
    paddingBlock: padding.S,
    paddingInline: '2rem',
    backgroundColor: backgroundColor.navbar,
    borderBlockEndWidth: '1px',
    borderBlockEndStyle: 'solid',
    borderBlockEndColor: dividerColor.subtle,
  },
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
  // Stands in for dark media (a photo, a video, a scrim), so it is a fixed ink rather than a token.
  // It previously used `backgroundColor.tooltip`, which correctly flips to white in dark mode —
  // leaving the "on dark media" row as white icons on a white ground.
  darkMedia: {
    backgroundColor: palette.gray1000,
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
  metadataList: {
    [metadataListVars.columns]: {
      default: 2,
      // Doubled from the original 800px because the page is now two panes: the query measures the
      // viewport, but the grid only ever gets half of it, so it stayed at two columns well past the
      // width where they fit and pushed the page into a horizontal scroll.
      '@media (max-width: 1600px)': 1,
    },
  },
  wrapRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  // Vertical dividers stretch to their container, so give them one with a height.
  verticalDividerStage: {
    height: '48px',
  },
  flexboxStage: {
    minHeight: '72px',
    padding: padding.XS,
    borderRadius: '4px',
    borderWidth: '1px',
    borderStyle: 'dashed',
    borderColor: dividerColor.subtle,
  },
  // Intrinsically sized rather than fixed-height, so `alignItems: stretch` and
  // `baseline` are both visible against the other alignments.
  flexboxItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '48px',
    padding: padding.XS,
    borderRadius: '4px',
    backgroundColor: nonsemanticBackgroundColor.blue,
  },
  // Applied to the `Text` inside each item, since `Text` sets its own font size.
  flexboxItemS: {
    fontSize: '12px',
    lineHeight: '16px',
  },
  flexboxItemM: {
    fontSize: '20px',
    lineHeight: '28px',
  },
  flexboxItemL: {
    fontSize: '32px',
    lineHeight: '44px',
  },
  // Glimmer renders a span with no intrinsic size — callers give it the shape they are standing in for.
  glimmerLine: {
    display: 'block',
    width: '100%',
    height: '1rem',
    borderRadius: '4px',
  },
  glimmerLineShort: {
    display: 'block',
    width: '60%',
    height: '1rem',
    borderRadius: '4px',
  },
  glimmerBlock: {
    display: 'block',
    width: '100%',
    height: '80px',
    borderRadius: '8px',
  },
  glimmerCircle: {
    display: 'block',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    alignSelf: 'flex-start',
  },
  clamped: {
    maxWidth: '48ch',
  },
  toastBody: {
    padding: padding.M,
  },
  richTextArea: {
    width: '100%',
    minHeight: '120px',
  },
  sideNavStage: {
    display: 'flex',
    height: '420px',
    overflow: 'hidden',
  },
  sideNav: {
    width: '240px',
  },
  // Sized for the sitemap the logo now reveals: wide enough for several columns, and capped so it
  // stays inside its pane on this split-screen page. The sitemap scrolls itself past that.
  sideNavOverview: {
    maxWidth: 'min(620px, 90vw)',
  },
  avatarRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  menuRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  meterStage: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '420px',
  },
  listStage: {
    maxWidth: '380px',
  },
});

// Fixed instants so the meeting menu renders identically on server and client.
// Generated faces, so the image path is exercised with real photographs rather than a flat SVG.
// Served from the app's `public/` directory.
const AVATAR_IMAGES = ['/avatar-1.jpg', '/avatar-2.jpg', '/avatar-3.jpg'];

const TOOLS_MENU_ITEMS: readonly ToolsMenu.Item[] = [
  { label: 'Home', icon: Phosphor.HouseIcon },
  { label: 'Calendar', icon: Phosphor.CalendarIcon },
  { label: 'Search', icon: Phosphor.MagnifyingGlassIcon },
  { label: 'Tasks', icon: Phosphor.ClipboardTextIcon },
  { label: 'Diffs', icon: Phosphor.GitDiffIcon },
  { label: 'SEVs', icon: Phosphor.FlameIcon },
  { type: 'divider' },
  { label: 'Create URL', icon: Phosphor.LinkSimpleIcon },
  { label: 'Shortcuts', icon: Phosphor.ArrowSquareOutIcon, hasSubmenu: true },
  { label: 'Recently opened', icon: Phosphor.ClockIcon, hasSubmenu: true },
];

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

const sideNavRoutes: readonly SideNav.Route[] = [
  { type: 'page', path: '/overview', title: 'Overview' },
  {
    type: 'group',
    label: 'Primitives',
    children: [
      { type: 'page', path: '/primitives/text', title: 'Text' },
      { type: 'page', path: '/primitives/icon', title: 'Icon' },
      { type: 'page', path: '/primitives/divider', title: 'Divider' },
    ],
  },
  {
    type: 'group',
    label: 'Controls',
    children: [
      { type: 'page', path: '/controls/button', title: 'Button' },
      { type: 'page', path: '/controls/toggle', title: 'Toggle' },
      { type: 'page', path: '/controls/split-button', title: 'Split Button' },
    ],
  },
  { type: 'page', path: '/internal', title: 'Internal', hideFromNav: true },
];

function DemoContent({ idPrefix }: { idPrefix: string }) {
  return (
    <>
      <section aria-labelledby={`${idPrefix}-colors-heading`}>
        <Heading id={`${idPrefix}-colors-heading`} isContent as="h1">
          Colors
        </Heading>
        <section {...stylex.props(styles.twoColumnGridSection)}>
          <div {...stylex.props(styles.subgridHeading)}>
            <Heading id={`${idPrefix}-semantic-colors-heading`} isContent as="h2">
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
            <Heading id={`${idPrefix}-outline-colors-heading`} isContent as="h2">
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
            <Heading id={`${idPrefix}-background-colors-heading`} isContent as="h2">
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
            <Heading id={`${idPrefix}-nonsemantic-background-colors-heading`} isContent as="h2">
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
            <Heading id={`${idPrefix}-text-colors-heading`} isContent as="h2">
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
            <Heading id={`${idPrefix}-nonsemantic-text-colors-heading`} isContent as="h2">
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
            <Heading id={`${idPrefix}-divider-colors-heading`} isContent as="h2">
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
            <Heading id={`${idPrefix}-icon-colors-heading`} isContent as="h2">
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
      </section>
      <Heading id={`${idPrefix}-typography-heading`} isContent as="h1">
        Typography
      </Heading>
      <section {...stylex.props(styles.twoColumnGridSection)}>
        <div {...stylex.props(styles.subgridHeading)}>
          <Heading id={`${idPrefix}-text-heading`} as="h2" isContent>
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
          <Heading id={`${idPrefix}-headings-heading`} as="h2" isContent>
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
          <Heading id={`${idPrefix}-title-heading`} isContent as="h1">
            Lorem ipsum doler sit amet
          </Heading>
          <Text>Section heading</Text>
          <Heading id={`${idPrefix}-section-heading`} isContent as="h2">
            Lorem ipsum doler sit amet
          </Heading>
          <Text>Content heading</Text>
          <Heading id={`${idPrefix}-content-heading`} isContent as="h3">
            Lorem ipsum doler sit amet
          </Heading>
          <Text>Group heading</Text>
          <Heading id={`${idPrefix}-group-heading`} isContent as="h4">
            Lorem ipsum doler sit amet
          </Heading>
        </section>
      </section>
      <Heading id={`${idPrefix}-icon-heading`} isContent>
        Icon
      </Heading>
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
      <Heading id={`${idPrefix}-badge-heading`} isContent>
        Badge
      </Heading>
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
      <Heading id={`${idPrefix}-button-heading`} isContent>
        Button
      </Heading>
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
        <MetadataList title="H4 heading text" subtitle="Description text" xstyle={styles.metadataList}>
          <MetadataLabel helpMessage="Help message">Metadata label</MetadataLabel>
          <Text>Text value</Text>
          <MetadataLabel>Metadata label</MetadataLabel>
          <div style={{ display: 'flex', gap: gap.S }}>
            <Badge variants={{ color: 'red' }} label="Label" />
            <Badge variants={{ color: 'green' }} label="Label" />
            <Badge variants={{ color: 'cyan' }} label="Label" />
          </div>
          <MetadataLabel>Metadata label</MetadataLabel>
          <Text>Text value</Text>
          <MetadataLabel>Metadata label</MetadataLabel>
          <Text>Text value</Text>
          <MetadataLabel>Metadata label</MetadataLabel>
          <Text>Text value</Text>
          <MetadataLabel>Metadata label</MetadataLabel>
          <Text>Text value</Text>
        </MetadataList>
      </section>
      <Heading isContent>Divider</Heading>
      <section {...stylex.props(styles.twoColumnGrid, styles.alignCenter, styles.componentStage)}>
        <Text as="small">horizontal / subtle</Text>
        <Divider variants={{ orientation: 'horizontal', color: 'subtle' }} />
        <Text as="small">horizontal / strong</Text>
        <Divider variants={{ orientation: 'horizontal', color: 'strong' }} />
        <Text as="small">vertical / subtle</Text>
        <div {...stylex.props(styles.verticalDividerStage)}>
          <Divider variants={{ orientation: 'vertical', color: 'subtle' }} />
        </div>
        <Text as="small">vertical / strong</Text>
        <div {...stylex.props(styles.verticalDividerStage)}>
          <Divider variants={{ orientation: 'vertical', color: 'strong' }} />
        </div>
      </section>
      <Heading isContent>Status Dot</Heading>
      <section {...stylex.props(styles.twoColumnGrid, styles.alignCenter, styles.componentStage)}>
        {(['neutral', 'info', 'success', 'warning', 'error'] as const).map((status) => (
          <React.Fragment key={status}>
            <Text as="small">{status}</Text>
            <div {...stylex.props(styles.row)}>
              <StatusDot variants={{ status, size: 'S' }} />
              <StatusDot variants={{ status, size: 'M' }} />
              <StatusDot variants={{ status, size: 'L' }} />
              <StatusDot variants={{ status, size: 'XL' }} />
            </div>
          </React.Fragment>
        ))}
      </section>
      <Heading isContent>Flexbox</Heading>
      <section {...stylex.props(styles.twoColumnGridSection)}>
        <div {...stylex.props(styles.subgridHeading)}>
          <Heading as="h2" isContent>
            Direction
          </Heading>
        </div>
        <section {...stylex.props(styles.twoColumnSubgrid, styles.componentStage)}>
          {(['row', 'column', 'rowReverse', 'columnReverse'] as const).map((direction) => (
            <React.Fragment key={direction}>
              <Text as="small">{direction}</Text>
              <Flexbox variants={{ direction, gap: 'S' }} xstyle={styles.flexboxStage}>
                <div {...stylex.props(styles.flexboxItem)}>
                  <Text xstyle={styles.flexboxItemS}>A</Text>
                </div>
                <div {...stylex.props(styles.flexboxItem)}>
                  <Text xstyle={styles.flexboxItemM}>B</Text>
                </div>
                <div {...stylex.props(styles.flexboxItem)}>
                  <Text xstyle={styles.flexboxItemL}>C</Text>
                </div>
              </Flexbox>
            </React.Fragment>
          ))}
        </section>
        <div {...stylex.props(styles.subgridHeading)}>
          <Heading as="h2" isContent>
            Align Items
          </Heading>
        </div>
        <section {...stylex.props(styles.twoColumnSubgrid, styles.componentStage)}>
          {(['start', 'center', 'end', 'baseline', 'stretch'] as const).map((alignItems) => (
            <React.Fragment key={alignItems}>
              <Text as="small">{alignItems}</Text>
              <Flexbox variants={{ alignItems, gap: 'S' }} xstyle={styles.flexboxStage}>
                <div {...stylex.props(styles.flexboxItem)}>
                  <Text xstyle={styles.flexboxItemS}>A</Text>
                </div>
                <div {...stylex.props(styles.flexboxItem)}>
                  <Text xstyle={styles.flexboxItemM}>B</Text>
                </div>
                <div {...stylex.props(styles.flexboxItem)}>
                  <Text xstyle={styles.flexboxItemL}>C</Text>
                </div>
              </Flexbox>
            </React.Fragment>
          ))}
        </section>
        <div {...stylex.props(styles.subgridHeading)}>
          <Heading as="h2" isContent>
            Justify Content
          </Heading>
        </div>
        <section {...stylex.props(styles.twoColumnSubgrid, styles.componentStage)}>
          {(['start', 'center', 'end', 'spaceBetween', 'spaceEvenly', 'spaceAround'] as const).map((justifyContent) => (
            <React.Fragment key={justifyContent}>
              <Text as="small">{justifyContent}</Text>
              <Flexbox variants={{ justifyContent, alignItems: 'center' }} xstyle={styles.flexboxStage}>
                <div {...stylex.props(styles.flexboxItem)}>
                  <Text xstyle={styles.flexboxItemM}>A</Text>
                </div>
                <div {...stylex.props(styles.flexboxItem)}>
                  <Text xstyle={styles.flexboxItemM}>B</Text>
                </div>
                <div {...stylex.props(styles.flexboxItem)}>
                  <Text xstyle={styles.flexboxItemM}>C</Text>
                </div>
              </Flexbox>
            </React.Fragment>
          ))}
        </section>
        <div {...stylex.props(styles.subgridHeading)}>
          <Heading as="h2" isContent>
            Gap
          </Heading>
        </div>
        <section {...stylex.props(styles.twoColumnSubgrid, styles.componentStage)}>
          {(['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'] as const).map((gapSize) => (
            <React.Fragment key={gapSize}>
              <Text as="small">{gapSize}</Text>
              <Flexbox variants={{ gap: gapSize, alignItems: 'center' }} xstyle={styles.flexboxStage}>
                <div {...stylex.props(styles.flexboxItem)}>
                  <Text xstyle={styles.flexboxItemM}>A</Text>
                </div>
                <div {...stylex.props(styles.flexboxItem)}>
                  <Text xstyle={styles.flexboxItemM}>B</Text>
                </div>
                <div {...stylex.props(styles.flexboxItem)}>
                  <Text xstyle={styles.flexboxItemM}>C</Text>
                </div>
              </Flexbox>
            </React.Fragment>
          ))}
        </section>
      </section>
      <Heading isContent>Glimmer</Heading>
      <section {...stylex.props(styles.content, styles.componentStage)}>
        <Glimmer xstyle={styles.glimmerLine} />
        <Glimmer xstyle={styles.glimmerLineShort} />
        <Glimmer xstyle={styles.glimmerBlock} />
        <Glimmer xstyle={styles.glimmerCircle} />
      </section>
      <Heading isContent>Line Clamp</Heading>
      <section {...stylex.props(styles.twoColumnGrid, styles.componentStage)}>
        <Text as="small">lines: 1</Text>
        <LineClamp lines={1} xstyle={styles.clamped}>
          <Text as="span">{lorem}</Text>
        </LineClamp>
        <Text as="small">lines: 2</Text>
        <LineClamp lines={2} xstyle={styles.clamped}>
          <Text as="span">{lorem}</Text>
        </LineClamp>
        <Text as="small">lines: 3</Text>
        <LineClamp lines={3} xstyle={styles.clamped}>
          <Text as="span">{lorem}</Text>
        </LineClamp>
      </section>
      <Heading isContent>Logo</Heading>
      <section {...stylex.props(styles.row, styles.componentStage)}>
        <Logo icon={Phosphor.CubeIcon} />
        <Logo icon={Phosphor.RocketLaunchIcon} />
        <Logo icon={Phosphor.PackageIcon} />
        <Logo icon={Phosphor.GitBranchIcon} />
      </section>
      <Heading isContent>Text Pair</Heading>
      <section {...stylex.props(styles.twoColumnGrid, styles.componentStage)}>
        <Text as="small">body</Text>
        <TextPair description="Descriptions clamp to two lines, so anything longer than that is truncated where it overflows.">
          Body title
        </TextPair>
        <Text as="small">h2</Text>
        <TextPair
          variant="h2"
          description="Descriptions clamp to two lines, so anything longer than that is truncated where it overflows."
        >
          Heading 2 title
        </TextPair>
        <Text as="small">h3</Text>
        <TextPair
          variant="h3"
          description="Descriptions clamp to two lines, so anything longer than that is truncated where it overflows."
        >
          Heading 3 title
        </TextPair>
        <Text as="small">h4</Text>
        <TextPair
          variant="h4"
          description="Descriptions clamp to two lines, so anything longer than that is truncated where it overflows."
        >
          Heading 4 title
        </TextPair>
      </section>
      <Heading isContent>Toast</Heading>
      <section {...stylex.props(styles.wrapRow, styles.componentStage)}>
        <Toast variants={{ status: 'info' }}>
          <div {...stylex.props(styles.toastBody)}>
            <TextPair variant="h4" description="Your changes are syncing in the background.">
              Sync started
            </TextPair>
          </div>
        </Toast>
        <Toast variants={{ status: 'success' }}>
          <div {...stylex.props(styles.toastBody)}>
            <TextPair variant="h4" description="All 12 changes were published successfully.">
              Deploy complete
            </TextPair>
          </div>
        </Toast>
        <Toast variants={{ status: 'warning' }}>
          <div {...stylex.props(styles.toastBody)}>
            <TextPair variant="h4" description="Two records could not be matched and were skipped.">
              Partial import
            </TextPair>
          </div>
        </Toast>
        <Toast variants={{ status: 'error' }}>
          <div {...stylex.props(styles.toastBody)}>
            <TextPair variant="h4" description="The connection timed out before the upload finished.">
              Upload failed
            </TextPair>
          </div>
        </Toast>
      </section>
      <Heading isContent>Split Button</Heading>
      <section {...stylex.props(styles.wrapRow, styles.componentStage)}>
        <UncontrolledSplitButton label="Save" variants={{ appearance: 'default' }}>
          <SplitButtonMenuItem label="Save and close" />
          <SplitButtonMenuItem label="Save as draft" />
          <SplitButtonMenuItem label="Save a copy" />
        </UncontrolledSplitButton>
        <UncontrolledSplitButton label="Save" variants={{ appearance: 'flat' }}>
          <SplitButtonMenuItem label="Save and close" />
          <SplitButtonMenuItem label="Save as draft" />
          <SplitButtonMenuItem label="Save a copy" />
        </UncontrolledSplitButton>
        <UncontrolledSplitButton label="Save" variants={{ appearance: 'primary' }}>
          <SplitButtonMenuItem label="Save and close" />
          <SplitButtonMenuItem label="Save as draft" />
          <SplitButtonMenuItem label="Save a copy" />
        </UncontrolledSplitButton>
        <UncontrolledSplitButton label="Delete" variants={{ appearance: 'negative' }}>
          <SplitButtonMenuItem label="Delete permanently" />
          <SplitButtonMenuItem label="Move to trash" />
        </UncontrolledSplitButton>
        <UncontrolledSplitButton label="Approve" variants={{ appearance: 'positive' }}>
          <SplitButtonMenuItem label="Approve and merge" />
          <SplitButtonMenuItem label="Approve with comment" />
        </UncontrolledSplitButton>
      </section>
      <section {...stylex.props(styles.wrapRow, styles.componentStage)}>
        <UncontrolledSplitButton
          label="Save"
          startContent={<Icon as={Phosphor.FloppyDiskIcon} />}
          variants={{ size: 'compact', appearance: 'default' }}
        >
          <SplitButtonMenuItem label="Save and close" />
          <SplitButtonMenuItem label="Save as draft" />
        </UncontrolledSplitButton>
        <UncontrolledSplitButton label="Save" disabled variants={{ appearance: 'default' }}>
          <SplitButtonMenuItem label="Save and close" />
          <SplitButtonMenuItem label="Save as draft" />
        </UncontrolledSplitButton>
        <UncontrolledSplitButton label="Save" loading variants={{ appearance: 'primary' }}>
          <SplitButtonMenuItem label="Save and close" />
          <SplitButtonMenuItem label="Save as draft" />
        </UncontrolledSplitButton>
      </section>
      <Heading isContent>Rich Text Area</Heading>
      <section {...stylex.props(styles.content, styles.componentStage)}>
        <Text as="small" variants={{ color: 'subtle' }}>
          Select text inside the editor to reveal the formatting action bar.
        </Text>
        <RichTextArea xstyle={styles.richTextArea} />
      </section>
      <Heading isContent>Side Nav</Heading>
      <section {...stylex.props(styles.sideNavStage, styles.componentStage)}>
        <SideNav
          routes={sideNavRoutes}
          selectedPath="/controls/button"
          heading="Boxops"
          subheading="Design System"
          media={<Logo icon={Phosphor.CubeIcon} />}
          // The logo opens the map of the site — which is what a sitemap in a hover card is for,
          // and why `overview` exists.
          overview={<Sitemap routes={SITEMAP_ROUTES} xstyle={styles.sideNavOverview} />}
          xstyle={styles.sideNav}
        />
      </section>
      <Heading isContent>Link</Heading>
      <section {...stylex.props(styles.row, styles.componentStage)}>
        <Link href="#link-demo">A link to somewhere</Link>
        <Text as="small">
          Inline: <Link href="#link-demo">nested in a sentence</Link> and after.
        </Text>
      </section>
      <Heading isContent>Avatar</Heading>
      <section {...stylex.props(styles.avatarRow, styles.componentStage)}>
        {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const).map((size) => (
          <Avatar key={size} variants={{ size }}>
            <AvatarInitials initials="TB" />
          </Avatar>
        ))}
      </section>
      <section {...stylex.props(styles.avatarRow, styles.componentStage)}>
        {(['available', 'away', 'busy', 'offline'] as const).map((status) => (
          <Avatar key={status} status={status} variants={{ size: 'L' }}>
            <AvatarInitials initials={status.slice(0, 2).toUpperCase()} />
          </Avatar>
        ))}
        <Avatar variants={{ size: 'L' }}>
          <AvatarIcon icon={Phosphor.UsersIcon} seed="team" />
        </Avatar>
        {AVATAR_IMAGES.map((src, i) => (
          <Avatar key={src} variants={{ size: 'L' }}>
            <AvatarImage src={src} alt={`Generated portrait ${i + 1}`} />
          </Avatar>
        ))}
        <Avatar darkenOnHover variants={{ size: 'L' }}>
          <AvatarInitials initials="HV" />
        </Avatar>
      </section>
      <section {...stylex.props(styles.avatarRow, styles.componentStage)}>
        {(['S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const).map((size) => (
          <Avatar key={size} variants={{ size }}>
            <AvatarImage src={AVATAR_IMAGES[0]} alt="" />
          </Avatar>
        ))}
        <Avatar status="available" variants={{ size: 'XXL' }}>
          <AvatarImage src={AVATAR_IMAGES[1]} alt="" />
        </Avatar>
        <Avatar darkenOnHover variants={{ size: 'XXL' }}>
          <AvatarImage src={AVATAR_IMAGES[0]} alt="" />
        </Avatar>
        <Avatar variants={{ size: 'XXL' }}>
          <AvatarImage src={AVATAR_IMAGES[1]} alt="" />
        </Avatar>
      </section>
      <Heading isContent>List</Heading>
      <section {...stylex.props(styles.componentStage)}>
        <List variants={{ gap: 'XXS' }} xstyle={styles.listStage}>
          <ListItem
            label="Overview"
            description="Everything at a glance"
            startContent={<Icon as={Phosphor.HouseIcon} />}
          />
          <ListItem isSelected label="Diffs" description="12 awaiting review" startContent={<Icon as={Phosphor.GitDiffIcon} />} />
          <ListItem label="Tasks" startContent={<Icon as={Phosphor.ClipboardTextIcon} />} endContent={<Badge label="3" />} />
          <ListItem label="Archive" startContent={<Icon as={Phosphor.TrayIcon} />} />
        </List>
      </section>
      <Heading isContent>Meter</Heading>
      <section {...stylex.props(styles.meterStage, styles.componentStage)}>
        <Meter status="indeterminate" value={0} label="Preparing" />
        <Meter status="in-progress" value={0.42} label="Uploading" />
        <Meter status="paused" value={0.42} label="Paused" />
        <Meter status="error" value={0.68} label="Failed" />
        <Meter status="complete" value={1} label="Done" />
        <Meter status="in-progress" value={0.3} />
      </section>
      <Heading isContent>Banner</Heading>
      <section {...stylex.props(styles.content, styles.componentStage)}>
        {(['info', 'success', 'warning', 'error'] as const).map((status) => (
          <UncontrolledBanner
            key={status}
            variants={{ status }}
            title={`${status[0].toUpperCase()}${status.slice(1)} banner`}
            description="Supporting description for the banner."
          />
        ))}
        <UncontrolledBanner
          variants={{ status: 'info' }}
          title="Expandable banner"
          description="Has children, so it gets a caret."
        >
          <Text as="small">Revealed content lives here.</Text>
        </UncontrolledBanner>
      </section>
      <Heading isContent>Notification</Heading>
      <section {...stylex.props(styles.menuRow, styles.componentStage)}>
        <NotificationStory />
      </section>
      <Heading isContent>Tools Menu</Heading>
      <section {...stylex.props(styles.menuRow, styles.componentStage)}>
        <ToolsMenu items={TOOLS_MENU_ITEMS} />
      </section>
      <Heading isContent>Employee Avatar</Heading>
      <section {...stylex.props(styles.row, styles.componentStage)}>
        <EmployeeAvatarStory />
        <Text as="small" variants={{ color: 'subtle' }}>
          Hover the avatar — the card&rsquo;s data loads on demand, from its own query.
        </Text>
      </section>
      <Heading isContent>Employee Link</Heading>
      <section {...stylex.props(styles.row, styles.componentStage)}>
        <EmployeeLinkStory />
      </section>
      <Heading isContent>Employee Hover Card</Heading>
      <section {...stylex.props(styles.menuRow, styles.componentStage)}>
        <EmployeeHoverCardStory />
      </section>
      <Heading isContent>Task Hover Card</Heading>
      <section {...stylex.props(styles.menuRow, styles.componentStage)}>
        <TaskHoverCardStory />
      </section>
      <Heading isContent>Diff Hover Card</Heading>
      <section {...stylex.props(styles.menuRow, styles.componentStage)}>
        <DiffHoverCardStory />
      </section>
      <Heading isContent>SEV Hover Card</Heading>
      <section {...stylex.props(styles.menuRow, styles.componentStage)}>
        <SEVHoverCardStory />
      </section>
      <Heading isContent>Oncall Hover Card</Heading>
      <section {...stylex.props(styles.menuRow, styles.componentStage)}>
        <OncallHoverCardStory />
      </section>
      <Heading isContent>Meeting Menu</Heading>
      <section {...stylex.props(styles.menuRow, styles.componentStage)}>
        <MeetingMenuStory />
      </section>
      <Heading isContent>Avatar Group</Heading>
      <section {...stylex.props(styles.row, styles.componentStage)}>
        <Flexbox variants={{ direction: 'column', gap: 'M' }}>
          {(['XS', 'M', 'XL'] as const).map((size) => (
            <Flexbox key={size} variants={{ alignItems: 'center', gap: 'M' }}>
              <Text variants={{ color: 'subtle' }}>{size}</Text>
              <AvatarGroup variants={{ size }}>
                {TEAM_FACES.map((src) => (
                  <Avatar key={src}>
                    <AvatarImage src={src} alt="" />
                  </Avatar>
                ))}
              </AvatarGroup>
            </Flexbox>
          ))}
          {/* Seven people, four slots — the rest become a chip. */}
          <Flexbox variants={{ alignItems: 'center', gap: 'M' }}>
            <Text variants={{ color: 'subtle' }}>+N</Text>
            <AvatarGroup variants={{ size: 'M' }}>
              {[...TEAM_FACES, 'AL', 'GH', 'AT'].map((face) => (
                <Avatar key={face}>
                  {face.startsWith('/') ? <AvatarImage src={face} alt="" /> : <AvatarInitials initials={face} />}
                </Avatar>
              ))}
            </AvatarGroup>
          </Flexbox>
        </Flexbox>
      </section>
      <Heading isContent>Profile Menu</Heading>
      <section {...stylex.props(styles.menuRow, styles.componentStage)}>
        <UncontrolledProfileMenu
          name="Thomas Bates"
          statusMessage="Consolidating v1 and v2"
          defaultStatus="available"
          actions={PROFILE_ACTIONS}
          onEditStatus={() => {}}
          avatar={
            <Avatar variants={{ size: 'M' }} status="available">
              <AvatarImage src="/avatar-1.jpg" alt="" />
            </Avatar>
          }
        />
      </section>
      <Heading isContent>Sitemap</Heading>
      <section {...stylex.props(styles.row, styles.componentStage)}>
        <Sitemap routes={SITEMAP_ROUTES} />
      </section>
    </>
  );
}

/** Stands in for what a router would hand over. Plain data, which is the whole point. */
const SITEMAP_ROUTES: Sitemap.Route[] = [
  {
    type: 'group',
    label: 'Primitives',
    children: [
      { type: 'page', href: '/text', title: 'Text', description: 'Body copy, at every size the ramp defines.' },
      { type: 'page', href: '/icon', title: 'Icon', description: 'The Phosphor set, themed and sized by context.' },
      { type: 'page', href: '/button', title: 'Button', description: 'Four appearances, three sizes, a loading state.' },
      { type: 'page', href: '/badge', title: 'Badge', description: 'Short status, in nine non-semantic tints.' },
    ],
  },
  {
    type: 'group',
    label: 'Layout',
    children: [
      { type: 'page', href: '/flexbox', title: 'Flexbox', description: 'The layout primitive everything else composes.' },
      { type: 'page', href: '/card', title: 'Card', description: 'A surface, with an optional header and footer.' },
      { type: 'page', href: '/divider', title: 'Divider', description: 'A rule, horizontal or vertical.' },
    ],
  },
  {
    type: 'group',
    label: 'People',
    children: [
      { type: 'page', href: '/avatar', title: 'Avatar', description: 'A face, initials or an icon — with a status dot.' },
      { type: 'page', href: '/employee-link', title: 'Employee Link', description: 'A name and a face that reveal a card.' },
      { type: 'page', href: '/profile-menu', title: 'Profile Menu', description: 'Who is signed in, and where they can go.' },
    ],
  },
  // Loose pages: no group, so the map gives them one.
  { type: 'page', href: '/tokens', title: 'Tokens', description: 'Every design token, light against dark.' },
  { type: 'page', href: '/changelog', title: 'Changelog', description: 'What each consolidation batch brought over.' },
];

const PROFILE_ACTIONS: ProfileMenu.Props['actions'] = [
  { label: 'Available until 5:00 pm', icon: Phosphor.ClockIcon, endIcon: Phosphor.CaretRightIcon },
  { label: 'Status Tool', icon: Phosphor.BroadcastIcon, endIcon: Phosphor.ArrowSquareOutIcon },
  { label: 'Intern Profile', icon: Phosphor.UserCircleIcon, endIcon: Phosphor.ArrowSquareOutIcon },
  { label: 'Workplace Profile', icon: Phosphor.UserCircleIcon, endIcon: Phosphor.ArrowSquareOutIcon },
  { label: 'Status Settings', icon: Phosphor.GearIcon },
  'separator',
  { label: 'Dark Mode', icon: Phosphor.MoonIcon },
  { label: 'Do Not Disturb', icon: Phosphor.ProhibitInsetIcon },
];

const TEAM_FACES = ['/avatar-1.jpg', '/avatar-2.jpg', '/avatar-3.jpg', '/avatar-4.jpg'];

// The two panes are spelled out rather than shared through a component: `createTheme` brands each
// theme with its own symbol, so a single `theme` prop cannot be typed to accept both.
//
// Each pane is also its own portal container. Overlays portal to `<body>` by default, which puts
// them outside both panes — so a tooltip raised in the light pane would resolve its tokens against
// the document and come out dark-themed. Pointing them at the pane keeps them with their content.
export default function IndexRoute() {
  const [lightPane, setLightPane] = React.useState<HTMLDivElement | null>(null);
  const [darkPane, setDarkPane] = React.useState<HTMLDivElement | null>(null);

  return (
    <main {...stylex.props(styles.split)}>
      <div ref={setLightPane} {...stylex.props(styles.pane, lightTheme)}>
        <PortalContainerProvider value={lightPane}>
          <div {...stylex.props(styles.paneLabel)}>
            <Heading as="h2">Light</Heading>
          </div>
          <div {...stylex.props(styles.main)}>
            <DemoContent idPrefix="light" />
          </div>
        </PortalContainerProvider>
      </div>
      <div ref={setDarkPane} {...stylex.props(styles.pane, darkTheme)}>
        <PortalContainerProvider value={darkPane}>
          <div {...stylex.props(styles.paneLabel)}>
            <Heading as="h2">Dark</Heading>
          </div>
          <div {...stylex.props(styles.main)}>
            <DemoContent idPrefix="dark" />
          </div>
        </PortalContainerProvider>
      </div>
    </main>
  );
}

export const links = () => [];

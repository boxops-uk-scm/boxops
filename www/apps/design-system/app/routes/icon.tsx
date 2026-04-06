import { Icon } from '@boxops/components';
import * as stylex from '@stylexjs/stylex';

export function meta() {
  return [{ title: 'Icon' }];
}

const icon = [
  Icon.ArrowDown,
  Icon.ArrowDownLeft,
  Icon.ArrowDownRight,
  Icon.ArrowLeft,
  Icon.ArrowRight,
  Icon.ArrowUp,
  Icon.ArrowUpLeft,
  Icon.ArrowUpRight,
  Icon.Article,
  Icon.Bell,
  Icon.BookmarkSimple,
  Icon.Broadcast,
  Icon.Calendar,
  Icon.CaretDown,
  Icon.CaretLeft,
  Icon.CaretRight,
  Icon.CaretUp,
  Icon.ChatCircle,
  Icon.ChatDots,
  Icon.CheckCircle,
  Icon.CheckSquare,
  Icon.Circle,
  Icon.Clipboard,
  Icon.ClipboardText,
  Icon.Clock,
  Icon.Code,
  Icon.Copy,
  Icon.Diff,
  Icon.Dot,
  Icon.DotsNine,
  Icon.DotsThree,
  Icon.Download,
  Icon.Envelope,
  Icon.FileText,
  Icon.FlagBanner,
  Icon.Flame,
  Icon.Flask,
  Icon.Gear,
  Icon.Graph,
  Icon.Home,
  Icon.Info,
  Icon.LineSegment,
  Icon.LinkSimple,
  Icon.ListNumbers,
  Icon.MagnifyingGlass,
  Icon.MapPin,
  Icon.Megaphone,
  Icon.Microphone,
  Icon.MicrophoneSlash,
  Icon.Moon,
  Icon.Package,
  Icon.PauseCircle,
  Icon.PencilSimple,
  Icon.Phone,
  Icon.Polygon,
  Icon.ProhibitInset,
  Icon.PushPin,
  Icon.PuzzlePiece,
  Icon.Rectangle,
  Icon.Robot,
  Icon.Signpost,
  Icon.Stack,
  Icon.Star,
  Icon.SunHorizon,
  Icon.Tag,
  Icon.TextAlignCenter,
  Icon.TextAlignJustify,
  Icon.TextAlignLeft,
  Icon.TextAlignRight,
  Icon.Trash,
  Icon.Tray,
  Icon.TreeStructure,
  Icon.User,
  Icon.UserCircle,
  Icon.UserSound,
  Icon.UsersThree,
  Icon.VideoCamera,
  Icon.Warning,
  Icon.X,
  Icon.XCircle,
];

export default function IconRoute() {
  return (
    <main {...stylex.props(styles.main)}>
      <section {...stylex.props(styles.iconGrid)}>
        {icon.map((IconComponent, index) => (
          <IconComponent key={index} size="S" />
        ))}
      </section>
      <section {...stylex.props(styles.iconGrid)}>
        {icon.map((IconComponent, index) => (
          <IconComponent key={index} size="M" />
        ))}
      </section>
      <section {...stylex.props(styles.iconGrid)}>
        {icon.map((IconComponent, index) => (
          <IconComponent key={index} size="L" />
        ))}
      </section>
      <section {...stylex.props(styles.iconGrid)}>
        {icon.map((IconComponent, index) => (
          <IconComponent key={index} size="S" variant="solid" />
        ))}
      </section>
      <section {...stylex.props(styles.iconGrid)}>
        {icon.map((IconComponent, index) => (
          <IconComponent key={index} size="M" variant="solid" />
        ))}
      </section>
      <section {...stylex.props(styles.iconGrid)}>
        {icon.map((IconComponent, index) => (
          <IconComponent key={index} size="L" variant="solid" />
        ))}
      </section>
    </main>
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
  iconGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(3rem, 1fr))',
    gap: '1rem',
  },
});

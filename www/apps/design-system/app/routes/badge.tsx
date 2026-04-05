import { Badge } from '@boxops/components';
import * as stylex from '@stylexjs/stylex';

export function meta() {
  return [{ title: 'Badge' }];
}

export default function BadgeRoute() {
  return (
    <main {...stylex.props(styles.main)}>
      <section {...stylex.props(styles.section)}>
        <Badge label="Badge" color="gray" />
        <Badge label="Badge" color="blue" />
        <Badge label="Badge" color="green" />
        <Badge label="Badge" color="yellow" />
        <Badge label="Badge" color="orange" />
        <Badge label="Badge" color="red" />
        <Badge label="Badge" color="magenta" />
        <Badge label="Badge" color="purple" />
        <Badge label="Badge" color="teal" />
        <Badge label="Badge" color="cyan" />
      </section>
      <section {...stylex.props(styles.section)}>
        <Badge startContent={<Badge.Dot />} label="Badge" color="gray" />
        <Badge startContent={<Badge.Dot />} label="Badge" color="blue" />
        <Badge startContent={<Badge.Dot />} label="Badge" color="green" />
        <Badge startContent={<Badge.Dot />} label="Badge" color="yellow" />
        <Badge startContent={<Badge.Dot />} label="Badge" color="orange" />
        <Badge startContent={<Badge.Dot />} label="Badge" color="red" />
        <Badge startContent={<Badge.Dot />} label="Badge" color="magenta" />
        <Badge startContent={<Badge.Dot />} label="Badge" color="purple" />
        <Badge startContent={<Badge.Dot />} label="Badge" color="teal" />
        <Badge startContent={<Badge.Dot />} label="Badge" color="cyan" />
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
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
});

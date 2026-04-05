import { CopyButton } from '@boxops/components';
import * as stylex from '@stylexjs/stylex';

export function meta() {
  return [{ title: 'CopyButton' }];
}

export default function CopyButtonRoute() {
  return (
    <main {...stylex.props(styles.main)}>
      <section {...stylex.props(styles.section)}>
        <CopyButton clipboardValue="Hello, world!" />
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

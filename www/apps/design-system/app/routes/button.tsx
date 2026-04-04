import { Button } from '@boxops/components';
import * as stylex from '@stylexjs/stylex';

export function meta() {
  return [{ title: 'Button' }];
}

export default function ButtonRoute() {
  return (
    <main {...stylex.props(styles.main)}>
      <Button>Button</Button>
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
});

import { Heading } from '@boxops/components';
import * as stylex from '@stylexjs/stylex';

export function meta() {
  return [{ title: 'Heading' }];
}

export default function HeadingRoute() {
  return (
    <main {...stylex.props(styles.main)}>
      <section {...stylex.props(styles.section)}>
        <Heading as="h1">H1</Heading>
        <Heading as="h2">H2</Heading>
        <Heading as="h3">H3</Heading>
        <Heading as="h4">H4</Heading>
      </section>
      <section {...stylex.props(styles.section)}>
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

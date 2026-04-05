import { Text } from '@boxops/components';
import * as stylex from '@stylexjs/stylex';

export function meta() {
  return [{ title: 'Text' }];
}

export default function TextRoute() {
  return (
    <main {...stylex.props(styles.main)}>
      <Text as="span">Lorem ipsum doler sit amet</Text>
      <Text as="p">Lorem ipsum doler sit amet</Text>
      <Text as="small">Lorem ipsum doler sit amet</Text>
      <Text as="b">Lorem ipsum doler sit amet</Text>
      <Text>
        <Text as="b">Lorem ipsum doler sit amet</Text>
      </Text>
      <Text as="i">Lorem ipsum doler sit amet</Text>
      <Text as="u">Lorem ipsum doler sit amet</Text>
      <Text as="s">Lorem ipsum doler sit amet</Text>
      <Text as="code">Lorem ipsum doler sit amet</Text>
      <Text as="span" xstyle={Text.styles.unselectable}>
        Lorem ipsum doler sit amet
      </Text>
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

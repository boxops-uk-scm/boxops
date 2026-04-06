import { Heading, Text } from '@boxops/components';
import {
  semanticColor,
  outlineColor,
  backgroundColor,
  nonsemanticBackgroundColor,
  textColor,
  nonsemanticTextColor,
  dividerColor,
  iconColor,
} from '@boxops/components/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

export function meta() {
  return [{ title: 'Color' }];
}

export default function ColorRoute() {
  return (
    <main {...stylex.props(styles.main)}>
      <Heading>Semantic Colors</Heading>
      <section {...stylex.props(styles.section)}>
        {
          Object.entries(semanticColor)
            .filter(([_, value]) => typeof value === 'string')
            .filter(([key, _]) => key !== '__varGroupHash__')
            .map(([key, value]) => <Swatch key={key} label={key} color={value} />) as React.ReactNode
        }
      </section>
      <Heading>Outline Colors</Heading>
      <section {...stylex.props(styles.section)}>
        {
          Object.entries(outlineColor)
            .filter(([_, value]) => typeof value === 'string')
            .filter(([key, _]) => key !== '__varGroupHash__')
            .map(([key, value]) => <Swatch key={key} label={key} color={value} />) as React.ReactNode
        }
      </section>
      <Heading>Background Colors</Heading>
      <section {...stylex.props(styles.section)}>
        {
          Object.entries(backgroundColor)
            .filter(([_, value]) => typeof value === 'string')
            .filter(([key, _]) => key !== '__varGroupHash__')
            .map(([key, value]) => <Swatch key={key} label={key} color={value} />) as React.ReactNode
        }
      </section>
      <Heading>Non-semantic Background Colors</Heading>
      <section {...stylex.props(styles.section)}>
        {
          Object.entries(nonsemanticBackgroundColor)
            .filter(([_, value]) => typeof value === 'string')
            .filter(([key, _]) => key !== '__varGroupHash__')
            .map(([key, value]) => <Swatch key={key} label={key} color={value} />) as React.ReactNode
        }
      </section>
      <Heading>Text Colors</Heading>
      <section {...stylex.props(styles.section)}>
        {
          Object.entries(textColor)
            .filter(([_, value]) => typeof value === 'string')
            .filter(([key, _]) => key !== '__varGroupHash__')
            .map(([key, value]) => <Swatch key={key} label={key} color={value} />) as React.ReactNode
        }
      </section>
      <Heading>Non-semantic Text Colors</Heading>
      <section {...stylex.props(styles.section)}>
        {
          Object.entries(nonsemanticTextColor)
            .filter(([_, value]) => typeof value === 'string')
            .filter(([key, _]) => key !== '__varGroupHash__')
            .map(([key, value]) => <Swatch key={key} label={key} color={value} />) as React.ReactNode
        }
      </section>
      <Heading>Divider Colors</Heading>
      <section {...stylex.props(styles.section)}>
        {
          Object.entries(dividerColor)
            .filter(([_, value]) => typeof value === 'string')
            .filter(([key, _]) => key !== '__varGroupHash__')
            .map(([key, value]) => <Swatch key={key} label={key} color={value} />) as React.ReactNode
        }
      </section>
      <Heading>Icon Colors</Heading>
      <section {...stylex.props(styles.section)}>
        {
          Object.entries(iconColor)
            .filter(([_, value]) => typeof value === 'string')
            .filter(([key, _]) => key !== '__varGroupHash__')
            .map(([key, value]) => <Swatch key={key} label={key} color={value} />) as React.ReactNode
        }
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
  section: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '1rem',
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
  },
});

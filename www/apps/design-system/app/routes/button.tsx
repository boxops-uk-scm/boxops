import { Badge, Button, Icon } from '@boxops/components';
import { Flexbox, Text } from '@boxops/components';
import * as stylex from '@stylexjs/stylex';

export function meta() {
  return [{ title: 'Button' }];
}

export default function ButtonRoute() {
  return (
    <main {...stylex.props(styles.main)}>
      <section {...stylex.props(styles.section)}>
        <Flexbox direction="column" alignItems="center" gap="S">
          <Button label="Button" variant="default" />
          <Text>
            <Text as="small">Default</Text>
          </Text>
        </Flexbox>
        <Flexbox direction="column" alignItems="center" gap="S">
          <Button label="Button" variant="flat" />
          <Text>
            <Text as="small">Flat</Text>
          </Text>
        </Flexbox>
        <Flexbox direction="column" alignItems="center" gap="S">
          <Button label="Button" variant="primary" />
          <Text>
            <Text as="small">Primary</Text>
          </Text>
        </Flexbox>
        <Flexbox direction="column" alignItems="center" gap="S">
          <Button label="Button" variant="negative" />
          <Text>
            <Text as="small">Negative</Text>
          </Text>
        </Flexbox>
        <Flexbox direction="column" alignItems="center" gap="S">
          <Button label="Button" variant="positive" />
          <Text>
            <Text as="small">Positive</Text>
          </Text>
        </Flexbox>
      </section>
      <section {...stylex.props(styles.section)}>
        <Button label="Button" compact variant="default" />
        <Button label="Button" compact variant="flat" />
        <Button label="Button" compact variant="primary" />
        <Button label="Button" compact variant="negative" />
        <Button label="Button" compact variant="positive" />
      </section>
      <section {...stylex.props(styles.section)}>
        <Button label="Button" disabled variant="default" />
        <Button label="Button" disabled variant="flat" />
        <Button label="Button" disabled variant="primary" />
        <Button label="Button" disabled variant="negative" />
        <Button label="Button" disabled variant="positive" />
      </section>
      <section {...stylex.props(styles.section)}>
        <Button startContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />} variant="default" />
        <Button startContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />} variant="flat" />
        <Button startContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />} variant="primary" />
        <Button startContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />} variant="negative" />
        <Button startContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />} variant="positive" />
      </section>
      <section {...stylex.props(styles.section)}>
        <Button compact startContent={({ iconProps }) => <Icon.Copy {...iconProps} />} variant="default" />
        <Button compact startContent={({ iconProps }) => <Icon.Copy {...iconProps} />} variant="flat" />
        <Button compact startContent={({ iconProps }) => <Icon.Copy {...iconProps} />} variant="primary" />
        <Button compact startContent={({ iconProps }) => <Icon.Copy {...iconProps} />} variant="negative" />
        <Button compact startContent={({ iconProps }) => <Icon.Copy {...iconProps} />} variant="positive" />
      </section>
      <section {...stylex.props(styles.section)}>
        <Button
          startContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />}
          label="Button"
          variant="default"
        />
        <Button startContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />} label="Button" variant="flat" />
        <Button
          startContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />}
          label="Button"
          variant="primary"
        />
        <Button
          startContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />}
          label="Button"
          variant="negative"
        />
        <Button
          startContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />}
          label="Button"
          variant="positive"
        />
      </section>
      <section {...stylex.props(styles.section)}>
        <Button compact startContent={({ iconProps }) => <Icon.Copy {...iconProps} />} label="Copy" variant="default" />
        <Button compact startContent={({ iconProps }) => <Icon.Copy {...iconProps} />} label="Button" variant="flat" />
        <Button
          compact
          startContent={({ iconProps }) => <Icon.Copy {...iconProps} />}
          label="Button"
          variant="primary"
        />
        <Button
          compact
          startContent={({ iconProps }) => <Icon.Copy {...iconProps} />}
          label="Button"
          variant="negative"
        />
        <Button
          compact
          startContent={({ iconProps }) => <Icon.Copy {...iconProps} />}
          label="Button"
          variant="positive"
        />
      </section>
      <section {...stylex.props(styles.section)}>
        <Button endContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />} label="Button" variant="default" />
        <Button endContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />} label="Button" variant="flat" />
        <Button endContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />} label="Button" variant="primary" />
        <Button
          endContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />}
          label="Button"
          variant="negative"
        />
        <Button
          endContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />}
          label="Button"
          variant="positive"
        />
      </section>
      <section {...stylex.props(styles.section)}>
        <Button endContent={<Badge label="99" />} label="Button" variant="default" />
        <Button endContent={<Badge label="99" />} label="Button" variant="flat" />
        <Button endContent={<Badge label="99" />} label="Button" variant="primary" />
        <Button endContent={<Badge label="99" />} label="Button" variant="negative" />
        <Button endContent={<Badge label="99" />} label="Button" variant="positive" />
      </section>
      <section {...stylex.props(styles.section)}>
        <Button loading label="Button" variant="default" />
        <Button loading label="Button" variant="flat" />
        <Button loading label="Button" variant="primary" />
        <Button loading label="Button" variant="negative" />
        <Button loading label="Button" variant="positive" />
      </section>
      <section {...stylex.props(styles.section)}>
        <Button
          startContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />}
          endContent={<Badge label="99" />}
          label="Button"
          variant="default"
          disabled
        />
        <Button
          startContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />}
          endContent={<Badge label="99" />}
          label="Button"
          variant="flat"
          disabled
        />
        <Button
          startContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />}
          endContent={<Badge label="99" />}
          label="Button"
          variant="primary"
          disabled
        />
        <Button
          startContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />}
          endContent={<Badge label="99" />}
          label="Button"
          variant="negative"
          disabled
        />
        <Button
          startContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />}
          endContent={<Badge label="99" />}
          label="Button"
          variant="positive"
          disabled
        />
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
    flexDirection: 'row',
    gap: '1rem',
  },
});

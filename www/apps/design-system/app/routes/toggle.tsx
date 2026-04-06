import { Toggle, Icon } from '@boxops/components';
import { Flexbox, Text } from '@boxops/components';
import * as stylex from '@stylexjs/stylex';

export function meta() {
  return [{ title: 'Toggle' }];
}

export default function ToggleRoute() {
  return (
    <main {...stylex.props(styles.main)}>
      <section {...stylex.props(styles.section)}>
        <Flexbox direction="column" alignItems="center" gap="S">
          <Toggle label="Button" variant="default" value="1" />
          <Text>
            <Text as="small">Default</Text>
          </Text>
        </Flexbox>
        <Flexbox direction="column" alignItems="center" gap="S">
          <Toggle label="Button" variant="flat" value="2" />
          <Text>
            <Text as="small">Flat</Text>
          </Text>
        </Flexbox>
      </section>
      <section {...stylex.props(styles.section)}>
        <Toggle label="Button" compact variant="default" value="3" />
        <Toggle label="Button" compact variant="flat" value="4" />
      </section>
      <section {...stylex.props(styles.section)}>
        <Toggle label="Button" disabled variant="default" value="5" />
        <Toggle label="Button" disabled variant="flat" value="6" />
      </section>
      <section {...stylex.props(styles.section)}>
        <Toggle startContent={(iconProps) => <Icon.PencilSimple {...iconProps} />} variant="default" value="7" />
        <Toggle startContent={(iconProps) => <Icon.PencilSimple {...iconProps} />} variant="flat" value="8" />
      </section>
      <section {...stylex.props(styles.section)}>
        <Toggle compact startContent={(iconProps) => <Icon.Copy {...iconProps} />} variant="default" value="9" />
        <Toggle compact startContent={(iconProps) => <Icon.Copy {...iconProps} />} variant="flat" value="10" />
      </section>
      <section {...stylex.props(styles.section)}>
        <Toggle
          startContent={(iconProps) => <Icon.PencilSimple {...iconProps} />}
          label="Button"
          variant="default"
          value="11"
        />
        <Toggle
          startContent={(iconProps) => <Icon.PencilSimple {...iconProps} />}
          label="Button"
          variant="flat"
          value="12"
        />
      </section>
      <section {...stylex.props(styles.section)}>
        <Toggle
          compact
          startContent={(iconProps) => <Icon.Copy {...iconProps} />}
          label="Copy"
          variant="default"
          value="13"
        />
        <Toggle
          compact
          startContent={(iconProps) => <Icon.Copy {...iconProps} />}
          label="Button"
          variant="flat"
          value="14"
        />
      </section>
      <section {...stylex.props(styles.section)}>
        <Toggle
          endContent={(iconProps) => <Icon.PencilSimple {...iconProps} />}
          label="Button"
          variant="default"
          value="15"
        />
        <Toggle
          endContent={(iconProps) => <Icon.PencilSimple {...iconProps} />}
          label="Button"
          variant="flat"
          value="16"
        />
      </section>
      <section {...stylex.props(styles.section)}>
        <Toggle loading label="Button" variant="default" value="19" />
        <Toggle loading label="Button" variant="flat" value="20" />
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

import { Icon, Tooltip } from '@boxops/components';
import * as stylex from '@stylexjs/stylex';

import { iconColor } from '../../../../@boxops/components/src/tokens.stylex';

export function meta() {
  return [{ title: 'Tooltip' }];
}

export default function TooltipRoute() {
  return (
    <main {...stylex.props(styles.main)}>
      <section {...stylex.props(styles.section)}>
        <Tooltip
          aria-label="This is a tooltip"
          label="This is a tooltip"
          trigger={<Icon.Info variant="solid" xstyle={styles.icon} />}
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
    flexDirection: 'column',
    gap: '1rem',
  },
  icon: {
    fill: iconColor.secondary,
  },
});

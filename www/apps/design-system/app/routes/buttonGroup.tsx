import { Button, ButtonGroup, Icon } from '@boxops/components';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

export function meta() {
  return [{ title: 'ButtonGroup' }];
}

export default function ButtonGroupRoute() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const onClick = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
    }, 1500);
  };

  return (
    <main {...stylex.props(styles.main)}>
      <section {...stylex.props(styles.section)}>
        <ButtonGroup>
          <Button
            variant={editMode ? 'primary' : 'default'}
            onClick={() => setEditMode((em) => !em)}
            startContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />}
            endContent={<Icon.CaretDown variant="solid" size="S" />}
            label="Edit"
          />
          <Button startContent={({ iconProps }) => <Icon.Copy {...iconProps} />} label="Duplicate" />
          <Button
            onClick={onClick}
            loading={isDownloading}
            startContent={({ iconProps }) => <Icon.Download {...iconProps} />}
            label="Download"
          />
        </ButtonGroup>
      </section>
      <section {...stylex.props(styles.section)}>
        <ButtonGroup>
          <Button
            variant={editMode ? 'primary' : 'default'}
            onClick={() => setEditMode((em) => !em)}
            startContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />}
            endContent={<Icon.CaretDown variant="solid" size="S" />}
            label="Edit"
          />
          <Button
            onClick={onClick}
            loading={isDownloading}
            startContent={({ iconProps }) => <Icon.Download {...iconProps} />}
            label="Download"
          />
        </ButtonGroup>
      </section>
      <section {...stylex.props(styles.section)}>
        <ButtonGroup>
          <Button
            variant={editMode ? 'primary' : 'default'}
            onClick={() => setEditMode((em) => !em)}
            startContent={({ iconProps }) => <Icon.PencilSimple {...iconProps} />}
            endContent={<Icon.CaretDown variant="solid" size="S" />}
            label="Edit"
          />
        </ButtonGroup>
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

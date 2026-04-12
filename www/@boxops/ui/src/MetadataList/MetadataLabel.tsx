import { SSR as Phosphor } from '@phosphor-icons/react';
import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Icon } from '../Icon';
import { Text } from '../Text';
import { gap, textColor } from '../tokens.stylex';
import { Tooltip } from '../Tooltip';

const baseStyles = stylex.create({
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap.S,
  },
  label: {
    color: `oklch(from ${textColor.subtle} l c h / 60%)`,
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
});

function MetadataLabel({ children, helpMessage }: MetadataLabel.Props) {
  return (
    <div {...stylex.props(baseStyles.base)}>
      <Text xstyle={baseStyles.label}>{children}</Text>
      {helpMessage && (
        <Tooltip
          trigger={<Icon weight="fill" variants={{ color: 'secondary', size: 'S' }} as={Phosphor.InfoIcon} />}
          label={helpMessage}
        />
      )}
    </div>
  );
}

namespace MetadataLabel {
  export interface Props {
    children?: React.ReactNode;
    helpMessage?: string;
  }
}

export default MetadataLabel;

import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Text } from '../Text';
import { borderRadius, gap, outlineColor, padding, semanticColor, textColor } from '../tokens.stylex';
import * as bx from '../types';

const baseStyles = stylex.create({
  listItem: {
    listStyle: 'none',
  },
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: gap.S,
    width: '100%',
    appearance: 'none',
    borderStyle: 'none',
    cursor: 'pointer',
    textAlign: 'start',
    paddingLeft: padding.S,
    paddingRight: padding.S,
    paddingTop: padding.XS,
    paddingBottom: padding.XS,
    borderRadius: borderRadius.button,
    // The unselected label ink. `selected` below overrides it with the accent.
    color: textColor.primary,
    backgroundColor: {
      default: 'transparent',
      // Toward the foreground ink rather than literal black, so the hover darkens on a light
      // ground and lightens on a dark one instead of vanishing.
      ':hover': `oklch(from ${textColor.primary} l c h / 5%)`,
    },
    outlineWidth: '3px',
    outlineColor: outlineColor.focus,
    outlineStyle: {
      default: 'none',
      ':focus-visible': 'solid',
    },
  },
  // Matches Toggle's pressed treatment, via the shared selected-accent tokens.
  selected: {
    color: semanticColor.accent,
    fill: semanticColor.accent,
    backgroundColor: {
      default: semanticColor.accentSelected,
      ':hover': semanticColor.accentSelectedHover,
    },
  },
  unselectable: {
    userSelect: 'none',
  },
});

const Item = React.memo(function Item({ label, isSelected, onPrefetch, onSelect, xstyle }: Item.Props) {
  return (
    <li {...stylex.props(baseStyles.listItem)}>
      <button
        type="button"
        aria-current={isSelected ? 'page' : undefined}
        onMouseEnter={onPrefetch}
        onFocus={onPrefetch}
        onClick={onSelect}
        {...stylex.props(baseStyles.base, isSelected && baseStyles.selected, xstyle)}
      >
        {/* No colour variant: the label inherits the button's ink, which is `primary` when
            unselected and the accent when selected. Pinning `onLightMedia` here left every
            unselected item near-black on a dark ground. */}
        <Text xstyle={baseStyles.unselectable}>{label}</Text>
      </button>
    </li>
  );
});

namespace Item {
  export interface Props extends bx.BaseComponentProps {
    label: React.ReactNode;
    isSelected?: boolean;
    onPrefetch?: () => void;
    onSelect?: () => void;
  }
}

export default Item;

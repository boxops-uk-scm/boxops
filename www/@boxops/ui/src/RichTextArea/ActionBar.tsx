import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import * as Phosphor from '@phosphor-icons/react';
import * as HoverCard from '@radix-ui/react-hover-card';
import * as stylex from '@stylexjs/stylex';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, TextFormatType } from 'lexical';
import * as React from 'react';

import { ButtonGroup } from '../ButtonGroup';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { Toggle } from '../Toggle';
import { borderRadius } from '../tokens.stylex';

const styles = stylex.create({
  actionBar: {
    borderRadius: borderRadius.button,
    padding: '0px',
  },
  actionButtonGroup: {
    gap: 0,
  },
  action: {
    minWidth: '32px',
  },
});

export interface Props {
  isSelectionBold: boolean;
  isSelectionItalic: boolean;
  isSelectionStrikethrough: boolean;
  isSelectionUnderline: boolean;
  isSelectionCode: boolean;
  dismiss: () => void;
}

const ActionBar = React.memo(function ActionBar({
  isSelectionBold,
  isSelectionItalic,
  isSelectionStrikethrough,
  isSelectionUnderline,
  isSelectionCode,
  dismiss,
}: Props) {
  const [editor] = useLexicalComposerContext();

  const dispatchFormatTextCommand = React.useCallback(
    (format: TextFormatType) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
        }
      });
    },
    [editor],
  );

  const makeBold = React.useCallback(() => dispatchFormatTextCommand('bold'), [dispatchFormatTextCommand]);

  const makeItalic = React.useCallback(() => dispatchFormatTextCommand('italic'), [dispatchFormatTextCommand]);

  const makeUnderline = React.useCallback(() => dispatchFormatTextCommand('underline'), [dispatchFormatTextCommand]);

  const makeStrikethrough = React.useCallback(() => dispatchFormatTextCommand('strikethrough'), [dispatchFormatTextCommand]);

  const makeCode = React.useCallback(() => dispatchFormatTextCommand('code'), [dispatchFormatTextCommand]);

  return (
    <HoverCard.Content side="top" align="start" sideOffset={8} onPointerDownOutside={dismiss}>
      <Card xstyle={styles.actionBar}>
        <ButtonGroup xstyle={styles.actionButtonGroup}>
          <Toggle
            pressed={isSelectionBold}
            onPressedChange={makeBold}
            xstyle={styles.action}
            variants={{ appearance: 'flat' }}
            startContent={<Text as="b">B</Text>}
          />
          <Toggle
            pressed={isSelectionItalic}
            onPressedChange={makeItalic}
            xstyle={styles.action}
            variants={{ appearance: 'flat' }}
            startContent={<Text as="i">I</Text>}
          />
          <Toggle
            pressed={isSelectionUnderline}
            onPressedChange={makeUnderline}
            xstyle={styles.action}
            variants={{ appearance: 'flat' }}
            startContent={<Text as="u">U</Text>}
          />
          <Toggle
            pressed={isSelectionStrikethrough}
            onPressedChange={makeStrikethrough}
            xstyle={styles.action}
            variants={{ appearance: 'flat' }}
            startContent={<Text as="s">S</Text>}
          />
          <Toggle
            pressed={isSelectionCode}
            onPressedChange={makeCode}
            xstyle={styles.action}
            variants={{ appearance: 'flat' }}
            startContent={<Icon as={Phosphor.Code} />}
          />
          <Toggle xstyle={styles.action} variants={{ appearance: 'flat' }} startContent={<Icon as={Phosphor.LinkSimple} />} />
        </ButtonGroup>
      </Card>
    </HoverCard.Content>
  );
});

export default ActionBar;

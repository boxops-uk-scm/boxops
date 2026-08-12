import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { createDOMRange, createRectsFromDOMRange } from '@lexical/selection';
import * as HoverCard from '@radix-ui/react-hover-card';
import * as stylex from '@stylexjs/stylex';
import { $getSelection, $isRangeSelection, EditorState, LexicalEditor, TextNode } from 'lexical';
import * as React from 'react';

import { Text } from '../Text';
import { backgroundColor, dividerColor, gap, padding, semanticColor } from '../tokens.stylex';
import * as bx from '../types';

import ActionBar from './ActionBar';

const styles = stylex.create({
  base: {
    padding: padding.S,
    backgroundColor: backgroundColor.surface,
    borderRadius: '4px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: dividerColor.subtle,
    ':focus': {
      boxShadow: `inset 0 0 0 3px ${semanticColor.accentSubtle}`,
      borderColor: semanticColor.accent,
      outline: 'none',
    },
  },
  selection: (x: number, y: number, width: number, height: number) => ({
    position: 'absolute',
    left: x,
    top: y,
    width,
    height,
    pointerEvents: 'none',
  }),
  code: {
    padding: padding.XS,
    borderRadius: '4px',
    backgroundColor: backgroundColor.secondary,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: gap.S,
  },
});

const theme = {
  paragraph: stylex.props([Text.styles.base, styles.paragraph]).className,
  text: {
    bold: stylex.props(Text.styles.bold).className,
    italic: stylex.props(Text.styles.italic).className,
    underline: stylex.props(Text.styles.underline).className,
    strikethrough: stylex.props(Text.styles.strikethrough).className,
    code: stylex.props(Text.styles.code, styles.code).className,
  },
};

function onError(error: Error) {
  console.error(error);
}

function onChange(
  editor: LexicalEditor,
  setRects: (rects: DOMRect | undefined) => void,
  setIsSelectionBold: (isBold: boolean) => void,
  setIsSelectionItalic: (isItalic: boolean) => void,
  setIsSelectionUnderline: (isUnderline: boolean) => void,
  setIsSelectionStrikethrough: (isStrikethrough: boolean) => void,
  setIsSelectionCode: (isCode: boolean) => void,
  setIsActionBarOpen: (isOpen: boolean) => void,
) {
  editor.read(() => {
    const selection = $getSelection();

    if (!selection || !$isRangeSelection(selection) || selection.isCollapsed()) {
      setIsSelectionBold(false);
      setIsSelectionItalic(false);
      setIsSelectionUnderline(false);
      setIsSelectionStrikethrough(false);
      setIsSelectionCode(false);
      setIsActionBarOpen(false);
      return;
    }

    let isSelectionBold = true;
    let isSelectionItalic = true;
    let isSelectionUnderline = true;
    let isSelectionStrikethrough = true;
    let isSelectionCode = true;

    const nodes = selection.getNodes();
    for (const node of nodes) {
      if (node instanceof TextNode) {
        if (isSelectionBold && !node.hasFormat('bold')) {
          isSelectionBold = false;
        }

        if (isSelectionItalic && !node.hasFormat('italic')) {
          isSelectionItalic = false;
        }

        if (isSelectionUnderline && !node.hasFormat('underline')) {
          isSelectionUnderline = false;
        }

        if (isSelectionStrikethrough && !node.hasFormat('strikethrough')) {
          isSelectionStrikethrough = false;
        }

        if (isSelectionCode && !node.hasFormat('code')) {
          isSelectionCode = false;
        }

        if (!isSelectionBold && !isSelectionItalic && !isSelectionUnderline && !isSelectionStrikethrough && !isSelectionCode) {
          break;
        }
      }
    }

    setIsSelectionBold(isSelectionBold);
    setIsSelectionItalic(isSelectionItalic);
    setIsSelectionUnderline(isSelectionUnderline);
    setIsSelectionStrikethrough(isSelectionStrikethrough);
    setIsSelectionCode(isSelectionCode);
  });

  editor.read(() => {
    const selection = $getSelection();

    if (!selection || !$isRangeSelection(selection) || selection.isCollapsed()) {
      return undefined;
    }

    const anchor = selection.anchor;
    const focus = selection.focus;
    const selectionRange = createDOMRange(editor, anchor.getNode(), selection.anchor.offset, focus.getNode(), selection.focus.offset);

    if (!selectionRange) {
      return undefined;
    }

    const boundingBox = getBoundingBox(createRectsFromDOMRange(editor, selectionRange));

    if (boundingBox) {
      setIsActionBarOpen(true);
    }

    setRects(boundingBox);
  });
}

function getBoundingBox(rects: ClientRect[]): DOMRect | undefined {
  if (!rects.length) return undefined;

  let minX = rects[0].x;
  let minY = rects[0].y;
  let maxRight = rects[0].right;
  let maxBottom = rects[0].bottom;

  for (let i = 1; i < rects.length; i++) {
    const r = rects[i];

    if (r.x < minX) minX = r.x;
    if (r.y < minY) minY = r.y;
    if (r.right > maxRight) maxRight = r.right;
    if (r.bottom > maxBottom) maxBottom = r.bottom;
  }

  return new DOMRect(minX, minY, maxRight - minX, maxBottom - minY);
}

const RichTextArea = Object.assign(
  React.memo(function RichTextArea({ xstyle, ...rest }: RichTextArea.Props) {
    const [isActionBarOpen, setIsActionBarOpen] = React.useState(false);
    const [rect, setRect] = React.useState<DOMRect | undefined>(undefined);

    const [isSelectionBold, setIsSelectionBold] = React.useState(false);
    const [isSelectionItalic, setIsSelectionItalic] = React.useState(false);
    const [isSelectionUnderline, setIsSelectionUnderline] = React.useState(false);
    const [isSelectionStrikethrough, setIsSelectionStrikethrough] = React.useState(false);
    const [isSelectionCode, setIsSelectionCode] = React.useState(false);

    const initialConfig = {
      namespace: 'RichTextArea',
      theme,
      onError,
    };

    const updateRect = React.useCallback((_state: EditorState, editor: LexicalEditor) => {
      onChange(
        editor,
        setRect,
        setIsSelectionBold,
        setIsSelectionItalic,
        setIsSelectionUnderline,
        setIsSelectionStrikethrough,
        setIsSelectionCode,
        setIsActionBarOpen,
      );
    }, []);

    return (
      <HoverCard.Root open={isActionBarOpen}>
        <LexicalComposer initialConfig={initialConfig}>
          <RichTextPlugin
            contentEditable={<ContentEditable {...stylex.props(styles.base, xstyle)} {...rest} />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <OnChangePlugin onChange={updateRect} />
          {rect && (
            <HoverCard.Trigger asChild>
              <div {...stylex.props(styles.selection(rect.x, rect.y, rect.width, rect.height))} />
            </HoverCard.Trigger>
          )}
          <ActionBar
            isSelectionBold={isSelectionBold}
            isSelectionItalic={isSelectionItalic}
            isSelectionStrikethrough={isSelectionStrikethrough}
            isSelectionUnderline={isSelectionUnderline}
            isSelectionCode={isSelectionCode}
            dismiss={() => setIsActionBarOpen(false)}
          />
        </LexicalComposer>
      </HoverCard.Root>
    );
  }),
  {
    styles,
  },
);

namespace RichTextArea {
  export interface Props extends bx.BaseComponentProps {}
}

export default RichTextArea;

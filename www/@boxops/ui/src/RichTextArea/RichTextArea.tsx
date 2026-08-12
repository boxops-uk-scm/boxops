import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { createDOMRange, createRectsFromDOMRange } from '@lexical/selection';
import * as stylex from '@stylexjs/stylex';
import { $getSelection, $isRangeSelection, TextNode, type EditorState, type LexicalEditor } from 'lexical';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { usePortalContainer } from '../PortalContainer';
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
  actionBarLayer: {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 100,
  },
  actionBarAt: (top: number, left: number) => ({
    transform: `translate(${left}px, ${top}px)`,
  }),
  // Covers both the frame before the bar has been measured and the case where the selection has
  // been scrolled out of view — the bar should not linger at the viewport edge without its anchor.
  actionBarHidden: {
    visibility: 'hidden',
  },
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
  canOpen: boolean,
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

    // The rect is always refreshed so the anchor tracks the selection as it grows mid-drag; only
    // opening waits for the gesture to finish. See `SelectionGesture`.
    if (boundingBox && canOpen) {
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

/** Gap between the selection and the action bar, and the minimum inset kept from the viewport edge. */
const ACTION_BAR_OFFSET = 8;

interface Placement {
  top: number;
  left: number;
  /** False once the selection has been scrolled out of view, which hides the bar along with it. */
  isAnchorVisible: boolean;
}

/**
 * Renders the action bar in a portal, positioned over the selection.
 *
 * A popover primitive is deliberately not used here. Those dismiss themselves on outside press, and
 * every interaction this bar exists for — dragging out a selection, then reaching for the bar — is
 * an outside press, so the bar spent its life being closed by the very gesture that opened it.
 * A plain layer has no such opinions: it shows exactly while there is a selection to act on.
 */
function ActionBarLayer({ rect, ...actionBarProps }: ActionBarLayer.Props) {
  const portalContainer = usePortalContainer();
  const ref = React.useRef<React.ComponentRef<'div'>>(null);
  const [placement, setPlacement] = React.useState<Placement | undefined>(undefined);

  // Layout effect so the measured position is applied in the same frame the bar first paints.
  React.useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const { width, height } = ref.current.getBoundingClientRect();

    // Sits above the selection, flipping below when there is no room for it there.
    const above = rect.top - height - ACTION_BAR_OFFSET;
    const top = above < ACTION_BAR_OFFSET ? rect.bottom + ACTION_BAR_OFFSET : above;

    // Aligned to the start of the selection, pulled back in when that would overflow the viewport.
    const rightLimit = window.innerWidth - width - ACTION_BAR_OFFSET;
    const left = Math.max(ACTION_BAR_OFFSET, Math.min(rect.left, rightLimit));

    setPlacement({ top, left, isAnchorVisible: rect.bottom > 0 && rect.top < window.innerHeight });
  }, [rect]);

  return createPortal(
    <div
      ref={ref}
      // Swallowing the press keeps focus in the editor, so the selection the bar acts on survives
      // being clicked. `click` still fires, so the buttons work as normal.
      onMouseDown={(event) => event.preventDefault()}
      {...stylex.props(
        styles.actionBarLayer,
        placement && styles.actionBarAt(placement.top, placement.left),
        !placement?.isAnchorVisible && styles.actionBarHidden,
      )}
    >
      <ActionBar {...actionBarProps} />
    </div>,
    portalContainer ?? document.body,
  );
}

namespace ActionBarLayer {
  export interface Props extends ActionBar.Props {
    /** Viewport-relative bounding box of the current selection. */
    rect: DOMRect;
  }
}

/**
 * Keeps the action bar in step with the selection.
 *
 * The bar is held back until a pointer gesture finishes, so it does not skitter around under the
 * cursor while a selection is being dragged out, and it is re-synced while open so it stays pinned
 * to the selection as the page scrolls or resizes underneath it.
 */
function SelectionTracker({
  isDraggingRef,
  isActionBarOpen,
  onSync,
  onDismiss,
}: {
  isDraggingRef: React.RefObject<boolean>;
  isActionBarOpen: boolean;
  onSync: (editor: LexicalEditor) => void;
  onDismiss: () => void;
}) {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    const handlePointerDown = () => {
      isDraggingRef.current = true;
    };

    // The pointer is often released outside the editor, so the release is tracked on the window.
    const handlePointerUp = () => {
      if (!isDraggingRef.current) {
        return;
      }

      isDraggingRef.current = false;
      onSync(editor);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss();
      }
    };

    const unregisterRoot = editor.registerRootListener((rootElement, prevRootElement) => {
      prevRootElement?.removeEventListener('pointerdown', handlePointerDown);
      prevRootElement?.removeEventListener('blur', onDismiss);
      rootElement?.addEventListener('pointerdown', handlePointerDown);
      rootElement?.addEventListener('blur', onDismiss);
    });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unregisterRoot();
      editor.getRootElement()?.removeEventListener('pointerdown', handlePointerDown);
      editor.getRootElement()?.removeEventListener('blur', onDismiss);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor, isDraggingRef, onSync, onDismiss]);

  React.useEffect(() => {
    if (!isActionBarOpen) {
      return undefined;
    }

    const handleReposition = () => onSync(editor);

    // Capture, so scrolling of any ancestor container is caught, not just the page.
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);

    return () => {
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [editor, isActionBarOpen, onSync]);

  return null;
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

    const isDraggingRef = React.useRef(false);

    const syncSelection = React.useCallback((editor: LexicalEditor, canOpen: boolean) => {
      onChange(
        editor,
        setRect,
        setIsSelectionBold,
        setIsSelectionItalic,
        setIsSelectionUnderline,
        setIsSelectionStrikethrough,
        setIsSelectionCode,
        setIsActionBarOpen,
        canOpen,
      );
    }, []);

    const updateRect = React.useCallback(
      (_state: EditorState, editor: LexicalEditor) => syncSelection(editor, !isDraggingRef.current),
      [syncSelection],
    );

    const handleSync = React.useCallback((editor: LexicalEditor) => syncSelection(editor, true), [syncSelection]);

    const handleDismiss = React.useCallback(() => setIsActionBarOpen(false), []);

    return (
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={<ContentEditable {...stylex.props(styles.base, xstyle)} {...rest} />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={updateRect} />
        <SelectionTracker
          isDraggingRef={isDraggingRef}
          isActionBarOpen={isActionBarOpen}
          onSync={handleSync}
          onDismiss={handleDismiss}
        />
        {isActionBarOpen && rect !== undefined && (
          <ActionBarLayer
            rect={rect}
            isSelectionBold={isSelectionBold}
            isSelectionItalic={isSelectionItalic}
            isSelectionStrikethrough={isSelectionStrikethrough}
            isSelectionUnderline={isSelectionUnderline}
            isSelectionCode={isSelectionCode}
          />
        )}
      </LexicalComposer>
    );
  }),
  {
    styles,
  },
);

namespace RichTextArea {
  export type Props = bx.BaseComponentProps;
}

export default RichTextArea;

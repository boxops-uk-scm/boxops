import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Glimmer } from '../../Glimmer';
import { backgroundColor } from '../../tokens.stylex';
import * as bx from '../../types';

const baseStyles = stylex.create({
  // The image cannot draw its own edge: pseudo-elements do not render on replaced elements, and an
  // inset box-shadow paints below replaced content, so both are invisible on an `<img>`. Hence a
  // wrapper, which also gives the vignette something to attach to.
  wrapper: {
    display: 'block',
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
  },
  base: {
    display: 'block',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    objectPosition: '0px 0px',
  },
  // Shown until the image decodes. Borrows `Glimmer`'s shimmer rather than carrying a third copy of
  // it — the v2 source inlined its own, using the `background`/`animation` shorthands that StyleX
  // drops, so it rendered as a plain transparent circle.
  loading: {
    borderRadius: '50%',
  },
  /**
   * An inner edge, so a photograph whose border matches the page still reads as a distinct disc.
   *
   * Applied only once the image has actually decoded, and never for initials or an icon — those
   * draw their own tinted background and have a defined edge already. That makes it a property of
   * the loaded photograph rather than something a caller has to remember to ask for.
   */
  vignette: {
    '::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      pointerEvents: 'none',
      borderRadius: '50%',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: backgroundColor.overlay,
    },
  },
});

const Image = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'img'>, Image.Props>(function Image({ xstyle, onLoad, src, ...rest }, ref) {
      const [loadedSrc, setLoadedSrc] = React.useState<string | undefined>(undefined);
      const imageRef = React.useRef<HTMLImageElement | null>(null);

      const setRefs = React.useCallback(
        (node: HTMLImageElement | null) => {
          imageRef.current = node;

          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        },
        [ref],
      );

      // A server-rendered image is usually decoded while the HTML is still parsing, so its `load`
      // event fires before React hydrates and no handler is ever called. Asking the element whether
      // it is already complete covers that case; the handler below covers everything else.
      React.useEffect(() => {
        const image = imageRef.current;

        if (image?.complete && image.naturalWidth > 0) {
          setLoadedSrc(src);
        }
      }, [src]);

      // Keyed on the source, so swapping the image drops the vignette until the new one arrives
      // rather than leaving a ring around a half-painted photograph.
      const isLoaded = src != null && loadedSrc === src;

      const handleLoad = React.useCallback(
        (event: React.SyntheticEvent<HTMLImageElement>) => {
          // Recorded as the `src` prop, not the element's `currentSrc`: the latter is resolved to an
          // absolute URL, so comparing it against a relative prop would never match.
          setLoadedSrc(src);
          onLoad?.(event);
        },
        [onLoad, src],
      );

      return (
        <span {...stylex.props(baseStyles.wrapper, isLoaded && baseStyles.vignette)}>
          <img
            ref={setRefs}
            src={src}
            onLoad={handleLoad}
            {...stylex.props(baseStyles.base, !isLoaded && Glimmer.styles.base, !isLoaded && baseStyles.loading, xstyle)}
            {...rest}
          />
        </span>
      );
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace Image {
  export type Props = bx.ComponentProps<'img'>;
}

export default Image;

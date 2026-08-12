import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { Glimmer } from '../../Glimmer';
import * as bx from '../../types';

const baseStyles = stylex.create({
  base: {
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
});

const Image = Object.assign(
  React.memo(
    React.forwardRef<React.ComponentRef<'img'>, Image.Props>(function Image({ xstyle, onLoad, ...rest }, ref) {
      const [isLoaded, setIsLoaded] = React.useState(false);

      const handleLoad = React.useCallback(
        (event: React.SyntheticEvent<HTMLImageElement>) => {
          setIsLoaded(true);
          onLoad?.(event);
        },
        [onLoad],
      );

      const styles = [
        baseStyles.base,
        !isLoaded && Glimmer.styles.base,
        !isLoaded && baseStyles.loading,
        bx.useComponentStyle(undefined, xstyle),
      ];

      return <img ref={ref} onLoad={handleLoad} {...stylex.props(styles)} {...rest} />;
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

import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { textColor } from '../tokens.stylex';
import * as bx from '../types';

import type { PolyRefFunction } from 'react-polymorphed';

const forwardRef = React.forwardRef as PolyRefFunction;

const baseStyles = stylex.create({
  base: {
    textWrap: 'balance',
    lineHeight: '1.1',
    color: textColor.onLightMedia,
    fontFamily: '"Open Sans", sans-serif',
    marginTop: 0,
    marginBlockEnd: 0,
  },
  h1: {
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: '24px',
    letterSpacing: 0,
  },
  h2: {
    fontWeight: 600,
    fontSize: '18px',
    lineHeight: '24px',
    letterSpacing: 0,
  },
  h3: {
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '20px',
    letterSpacing: 0,
  },
  h4: {
    fontWeight: 'bold',
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: 0,
  },
  title: {
    fontWeight: 600,
    fontSize: '32px',
    lineHeight: '48px',
    letterSpacing: 0,
  },
  section: {
    fontWeight: 600,
    fontSize: '24px',
    lineHeight: '32px',
    letterSpacing: 0,
  },
  content: {
    fontWeight: 'bold',
    fontSize: '20px',
    lineHeight: '28px',
    letterSpacing: 0,
  },
  group: {
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: 0,
  },
});

const Heading = Object.assign(
  React.memo(
    forwardRef<Heading.Default, Heading.BaseProps, Heading.OnlyAs>(function Heading(
      { as: As = 'h1', isContent = false, xstyle, ...rest },
      ref,
    ) {
      const state: Heading.State = { as: As };

      const styles = [
        bx.usePolyComponentStyle<Heading.Default, Heading.State, Heading.OnlyAs>(state, baseStyles.base, xstyle, (as) => {
          switch (as) {
            case 'h1':
              return [isContent ? baseStyles.title : baseStyles.h1];
            case 'h2':
              return [isContent ? baseStyles.section : baseStyles.h2];
            case 'h3':
              return [isContent ? baseStyles.content : baseStyles.h3];
            case 'h4':
              return [isContent ? baseStyles.group : baseStyles.h4];
            default:
              return undefined;
          }
        }),
      ];

      return <As ref={ref} {...stylex.props(styles)} {...rest} />;
    }),
  ),
  {
    styles: baseStyles,
  },
);

namespace Heading {
  export type State = bx.PolyComponentState;

  export interface BaseProps extends bx.BasePolyComponentProps<State> {
    isContent?: boolean;
  }

  export type Default = 'h1';

  export type OnlyAs = 'h1' | 'h2' | 'h3' | 'h4';

  export type Props<E extends React.ElementType = Default> = bx.PolyComponentProps<E, State, BaseProps>;
}

export default Heading;

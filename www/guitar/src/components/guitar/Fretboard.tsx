/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import { FretSpan } from "../../music/Fingering";
import { FretboardPosition, type Fret, type StringNumber } from "../../music/Fretboard";
import SVGBase, { type SVGBaseProps } from "./SVGBase";
import * as stylex from "@stylexjs/stylex";

export default function Fretboard({ direction = 'horizontal', ...props }: FretboardProps & { direction?: 'horizontal' | 'vertical' }) {
  return direction === 'vertical'
    ? <VerticalFretboard {...props} />
    : <HorizontalFretboard {...props} />
}

export type FretboardProps = {
  fretSpan: FretSpan;
  showFretNumbers?: boolean;
  showDots?: boolean;
  xstyle?: stylex.StyleXStyles;
} & Omit<SVGBaseProps, | 'viewBox' | 'aspectRatio'>;

export type FretboardLayoutContextType = {
  direction: 'horizontal' | 'vertical';
  fretSpan: FretSpan;
  fretboardOrigin: { x: number, y: number };
  fretSize: { width: number, height: number };
  stringSpacing: number;
  fretSpacing: number;
  fretboardSize: { width: number, height: number };
  containerSize: { width: number, height: number };
  lowerEndpointOrigin: { x: number, y: number };
  aspectRatio: number;
};

const FretboardLayoutContext = createContext<FretboardLayoutContextType | null>(null);

export function useFretboardLayout(): FretboardLayoutContextType {
  const ctx = useContext(FretboardLayoutContext);
  if (!ctx) {
    throw new Error("useFretboardLayout must be used inside a FretboardLayoutContext.Provider");
  }
  return ctx;
}

export function useFretboardCoordinateTransform(): (fret: Fret, string: StringNumber) => { x: number, y: number } {
  const { direction, fretboardOrigin, fretSize } = useFretboardLayout();

  return (fret: Fret, string: StringNumber) => {
    if (direction === 'vertical') {
      return {
        x: fretboardOrigin.x + fretSize.width * (STRING_COUNT - string),
        y: fretboardOrigin.y + fretSize.height * fret,
      };
    }

    return {
      x: fretboardOrigin.x + fretSize.width * fret,
      y: fretboardOrigin.y + fretSize.height * (string - 1),
    };
  };
}

const FRET_COLOR_TRANSLUCENT = 'rgba(245, 73, 39, 0.5)';

const STRING_COUNT: number = 6;
const DOTTED_FRETS: Fret[] = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];

export function MuteMarker({ string }: { string: StringNumber }) {
  const { direction, fretSize, lowerEndpointOrigin, stringSpacing } = useFretboardLayout();

  const x = direction === 'vertical'
    ? lowerEndpointOrigin.x + fretSize.width * (STRING_COUNT - string)
    : lowerEndpointOrigin.x - 0.33 * fretSize.width;

  const y = direction === 'vertical'
    ? lowerEndpointOrigin.y - 0.33 * fretSize.height
    : lowerEndpointOrigin.y + fretSize.height * (string - 1);

  const size = 0.2 * stringSpacing;
  const strokeWidth = 0.05 * stringSpacing;

  return <>
    <line
      x1={x - size}
      y1={y - size}
      x2={x + size}
      y2={y + size}
      stroke="black"
      strokeWidth={strokeWidth}
    />
    <line
      x1={x - size}
      y1={y + size}
      x2={x + size}
      y2={y - size}
      stroke="black"
      strokeWidth={strokeWidth}
    />
  </>;
}

export function OpenStringMarker({ string }: { string: StringNumber }) {
  const { direction, fretSize, lowerEndpointOrigin, stringSpacing } = useFretboardLayout();

  const x = direction === 'vertical'
    ? lowerEndpointOrigin.x + fretSize.width * (STRING_COUNT - string)
    : lowerEndpointOrigin.x - 0.33 * fretSize.width;

  const y = direction === 'vertical'
    ? lowerEndpointOrigin.y - 0.33 * fretSize.height
    : lowerEndpointOrigin.y + fretSize.height * (string - 1);

  const radius = 0.2 * stringSpacing;
  const strokeWidth = 0.05 * stringSpacing;

  return (
    <circle
      cx={x}
      cy={y}
      r={radius}
      strokeWidth={strokeWidth}
      stroke='black'
      fill='transparent'
    />
  );
}

export function BarreMarker({
  fret,
  fromString,
  toString,
  label
}: {
  fret: Fret,
  fromString: StringNumber,
  toString: StringNumber,
  label?: string | number,
}) {
  const { fretSpan, stringSpacing } = useFretboardLayout();
  const transform = useFretboardCoordinateTransform();
  const start = transform(fret - 0.33, fromString);
  const end   = transform(fret - 0.33, toString);
  const strokeWidth = 2 * 0.35 * stringSpacing;

  if (!fretSpan.contains(new FretboardPosition(fromString, fret))) {
    return <></>;
  }

  return <>
    <line
      x1={start.x}
      y1={start.y}
      x2={end.x}
      y2={end.y}
      stroke={FRET_COLOR_TRANSLUCENT}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <FretMarker fret={fret} string={fromString} label={label} />
    <FretMarker fret={fret} string={toString}   label={label} />
  </>;
}

export function FretMarker({
  fret,
  string,
  label,
  fretStyle,
  textStyle
}: {
  fret: Fret;
  string: StringNumber;
  label?: string | number;
  fretStyle?: stylex.StyleXStyles;
  textStyle?: stylex.StyleXStyles;
}) {
  const { fretSpan, stringSpacing } = useFretboardLayout();
  const transform = useFretboardCoordinateTransform();
  const { x, y } = transform(fret - 0.33, string);

  if (fretSpan.contains(new FretboardPosition(string, fret))) {
    return <>
      <circle cx={x} cy={y} r={0.35 * stringSpacing} {...stylex.props(styles.fretMarker, fretStyle)} />
      {label !== undefined && (
        <text
          style={{ userSelect: 'none' }}
          x={x}
          y={y}
          fontWeight='bold'
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={0.4 * stringSpacing}
          {...stylex.props(styles.fretMarkerLabel, textStyle)}
        >
          {label}
        </text>
      )}
    </>;
  }

  return <></>
}

const styles = stylex.create({
  fretMarker: {
    fill: '#F54927',
  },
  fretMarkerLabel: {
    fill: 'white',
  }
});

function HorizontalFretboard({ fretSpan, children, showFretNumbers = false, showDots = false, xstyle, ...props }: FretboardProps) {
  fretSpan = fretSpan.clamp();

  const visibleFretSpan = fretSpan.withLowerEndpoint(
    lowerEndpoint => Math.max(0, lowerEndpoint - 1)
  );

  const fretAspectRatio = 3 / 2;

  const fretboardSizeFrets = {
    width:  visibleFretSpan.width(),
    height: STRING_COUNT - 1,
  };

  const containerWidthFrets = {
    width:  fretboardSizeFrets.width  + 2,
    height: fretboardSizeFrets.height + 2,
  };

  const aspectRatio = fretAspectRatio * containerWidthFrets.width / containerWidthFrets.height;

  const containerSize = {
    width:  1,
    height: 1 / aspectRatio,
  };

  const fretSize = {
    width:  containerSize.width  / containerWidthFrets.width,
    height: containerSize.height / containerWidthFrets.height,
  };

  const fretboardSize = {
    width:  fretSize.width  * fretboardSizeFrets.width,
    height: fretSize.height * fretboardSizeFrets.height,
  };

  const fretboardOrigin = {
    x: fretSize.width * (1 - visibleFretSpan.lowerEndpoint!),
    y: fretSize.height,
  };

  const lowerEndpointOrigin = {
    x: fretSize.width,
    y: fretSize.height,
  };

  const viewBox = `0 0 ${containerSize.width} ${containerSize.height}`;

  const strokeWidth = 0.03 * fretSize.height;

  return (
    <FretboardLayoutContext.Provider value={{
      direction: 'horizontal',
      fretSpan,
      fretboardOrigin,
      fretSize,
      stringSpacing: fretSize.height,
      fretSpacing: fretSize.width,
      fretboardSize,
      containerSize,
      aspectRatio,
      lowerEndpointOrigin,
    }}>
      <SVGBase viewBox={viewBox} aspectRatio={aspectRatio} {...props} xstyle={xstyle}>
        {Array.from({ length: fretboardSizeFrets.width + 1 }, (_, i) => {
          const fretNumber = visibleFretSpan.lowerEndpoint! + i;
          const stringSpacing = fretSize.height;
          const x = lowerEndpointOrigin.x + fretSize.width * i;
          const y1 = lowerEndpointOrigin.y - (fretNumber === 0 ? 0.01 * stringSpacing : 0);
          const y2 = lowerEndpointOrigin.y + fretboardSize.height + (fretNumber === 0 ? 0.01 * stringSpacing : 0);
          return <line key={i} x1={x} y1={y1} x2={x} y2={y2} stroke="#000" strokeWidth={fretNumber === 0 ? 3 * strokeWidth : strokeWidth} />;
        })}
        {Array.from({ length: STRING_COUNT }, (_, i) => {
          const y  = lowerEndpointOrigin.y + fretSize.height * i;
          const x1 = lowerEndpointOrigin.x;
          const x2 = lowerEndpointOrigin.x + fretboardSize.width;
          return <line key={i} x1={x1} y1={y} x2={x2} y2={y} stroke="#000" strokeWidth={strokeWidth} />;
        })}
        {
          showFretNumbers && Array.from({ length: fretboardSizeFrets.width + 1 }, (_, i) => {
            const fretNumber = visibleFretSpan.lowerEndpoint! + i;
            const x = lowerEndpointOrigin.x + fretSize.width * i;
            const y = lowerEndpointOrigin.y - 0.5 * fretSize.height;
            return (
              <text
                key={i}
                style={{ userSelect: 'none' }}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={0.4 * fretSize.height}
                fill="black"
              >
                {fretNumber}
              </text>
            );
          })
        }
        {
          showDots && DOTTED_FRETS.map(fret => {
            if (fret < visibleFretSpan.lowerEndpoint! || fret > visibleFretSpan.upperEndpoint!) {
              return null;
            }

            if (fret === 12 || fret === 24) {
              const x = lowerEndpointOrigin.x + fretSize.width * fret - (fretSize.width / 2);
              const y = lowerEndpointOrigin.y + fretboardSize.height / 2;
              const radius = 0.1 * fretSize.height;
              return (
                <g key={fret}>
                  <circle cx={x - 0.15 * fretSize.width} cy={y} r={radius} fill="#2a2a2a" />
                  <circle cx={x + 0.15 * fretSize.width} cy={y} r={radius} fill="#2a2a2a" />
                </g>
              );
            }

            return <circle
              key={fret}
              cx={lowerEndpointOrigin.x + fretSize.width * (fret - visibleFretSpan.lowerEndpoint!) - (fretSize.width / 2)}
              cy={lowerEndpointOrigin.y + fretboardSize.height / 2}
              r={0.1 * fretSize.height}
              fill="#2a2a2a"
            />
          })
        }
        {children}
      </SVGBase>
    </FretboardLayoutContext.Provider>
  );
}

function VerticalFretboard({ fretSpan, children, showFretNumbers = false, showDots = false, xstyle, ...props }: FretboardProps) {
  fretSpan = fretSpan.clamp();

  const visibleFretSpan = fretSpan.withLowerEndpoint(
    lowerEndpoint => Math.max(0, lowerEndpoint - 1)
  );

  const fretAspectRatio = 3 / 2;

  const fretboardSizeFrets = {
    width:  STRING_COUNT - 1,
    height: visibleFretSpan.width(),
  };

  const containerFrets = {
    width:  fretboardSizeFrets.width  + 2,
    height: fretboardSizeFrets.height + 2,
  };

  const aspectRatio = containerFrets.width / (fretAspectRatio * containerFrets.height);

  const containerSize = {
    width:  1,
    height: 1 / aspectRatio,
  };

  const fretSize = {
    width:  containerSize.width  / containerFrets.width,
    height: containerSize.height / containerFrets.height,
  };

  const fretboardSize = {
    width:  fretSize.width  * fretboardSizeFrets.width,
    height: fretSize.height * fretboardSizeFrets.height,
  };

  const fretboardOrigin = {
    x: fretSize.width,
    y: fretSize.height * (1 - visibleFretSpan.lowerEndpoint!),
  };

  const lowerEndpointOrigin = {
    x: fretSize.width,
    y: fretSize.height,
  };

  const viewBox = `0 0 ${containerSize.width} ${containerSize.height}`;

  const strokeWidth = 0.03 * fretSize.width;

  return (
    <FretboardLayoutContext.Provider value={{
      direction: 'vertical',
      fretSpan,
      fretboardOrigin,
      fretSize,
      stringSpacing: fretSize.width,
      fretSpacing: fretSize.width,
      fretboardSize,
      containerSize,
      aspectRatio,
      lowerEndpointOrigin,
    }}>
      <SVGBase viewBox={viewBox} aspectRatio={aspectRatio} xstyle={xstyle} {...props}>
        {Array.from({ length: fretboardSizeFrets.height + 1 }, (_, i) => {
          const fretNumber = visibleFretSpan.lowerEndpoint! + i;
          const stringSpacing = fretSize.height;
          const y  = lowerEndpointOrigin.y + fretSize.height * i;
          const x1 = lowerEndpointOrigin.x - (fretNumber === 0 ? 0.01 * stringSpacing : 0);
          const x2 = lowerEndpointOrigin.x + fretboardSize.width + (fretNumber === 0 ? 0.01 * stringSpacing : 0);
          return <line key={i} x1={x1} y1={y} x2={x2} y2={y} stroke="#000" strokeWidth={fretNumber === 0 ? 3 * strokeWidth : strokeWidth} />;
        })}
        {Array.from({ length: STRING_COUNT }, (_, i) => {
          const x  = lowerEndpointOrigin.x + fretSize.width * i;
          const y1 = lowerEndpointOrigin.y;
          const y2 = lowerEndpointOrigin.y + fretboardSize.height;
          return <line key={i} x1={x} y1={y1} x2={x} y2={y2} stroke="#000" strokeWidth={strokeWidth} />;
        })}
        {
          showFretNumbers && Array.from({ length: fretboardSizeFrets.height + 1 }, (_, i) => {
            const fretNumber = visibleFretSpan.lowerEndpoint! + i;
            const x = lowerEndpointOrigin.x + fretboardSize.width + 0.5 * fretSize.width;
            const y = lowerEndpointOrigin.y + fretSize.height * i;
            return (
              <text
                key={i}
                style={{ userSelect: 'none' }}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={0.4 * fretSize.width}
                fill="black"
              >
                {fretNumber}
              </text>
            );
          })
        }
        {
          showDots && DOTTED_FRETS.map(fret => {
            if (fret < visibleFretSpan.lowerEndpoint! || fret > visibleFretSpan.upperEndpoint!) {
              return null;
            }

            if (fret === 12 || fret === 24) {
              const x = lowerEndpointOrigin.x + fretboardSize.width / 2;
              const y = lowerEndpointOrigin.y + fretSize.height * fret - (fretSize.height / 2);
              const radius = 0.1 * fretSize.width;
              return (
                <g key={fret}>
                  <circle cx={x} cy={y - 0.15 * fretSize.height} r={radius} fill="black" />
                  <circle cx={x} cy={y + 0.15 * fretSize.height} r={radius} fill="black" />
                </g>
              );
            }

            return <circle
              key={fret}
              cx={lowerEndpointOrigin.x + fretboardSize.width / 2}
              cy={lowerEndpointOrigin.y + fretSize.height * (fret - visibleFretSpan.lowerEndpoint!) - (fretSize.height / 2)}
              r={0.1 * fretSize.width}
              fill="#2a2a2a"
            />
          })
        }
        {children}
      </SVGBase>
    </FretboardLayoutContext.Provider>
  );
}
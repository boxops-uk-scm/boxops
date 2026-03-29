/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import { FretSpan } from "../../music/Fingering";
import { FretboardPosition, type Fret, type StringNumber } from "../../music/Fretboard";
import SVGBase, { type SVGBaseProps } from "./SVGBase";

export default function Fretboard(props: FretboardProps & { direction?: 'horizontal' | 'vertical' }) {
  const direction = props.direction ?? 'horizontal';
  if (direction === 'horizontal') {
    return <HorizontalFretboard {...props} />
  } else {
    return <VerticalFretboard {...props} />
  }
}

export type FretboardProps = {
  fretSpan: FretSpan;
} & Omit<SVGBaseProps, | 'viewBox' | 'aspectRatio'>;

const FRET_ASPECT_RATIO = 3/2;
const STRING_COUNT = 6;

export type FretboardLayoutContextType = {
  fretSpan: FretSpan;
  toCoordinates: (position: { fret: number, string: number }) => { x: number, y: number };
};

const FretboardLayoutContext = createContext<FretboardLayoutContextType | null>(null);

export function useFretboardLayout(): FretboardLayoutContextType {
  const ctx = useContext(FretboardLayoutContext);
  if (!ctx) {
    throw new Error("useFretboardLayout must be used inside a FretboardLayoutContext.Provider");
  }
  return ctx;
}

export function FretMarker({
  position,
  label
}: {
  position: FretboardPosition;
  label?: string | number;
}) {
  const { toCoordinates } = useFretboardLayout();
  const { x, y } = toCoordinates({ 
    fret: position.fret - 0.33, 
    string: position.string 
  }); 

  return <>
    { position.fret > 0
      ? <circle cx={x} cy={y} r={0.035} fill="#F54927" />
      : <circle cx={x} cy={y} r={label !== undefined ? 0.035 : 0.015} stroke="black" fill='transparent' strokeWidth={0.004} />
    }
    {label && (
      <text x={x} y={y} fontSize={0.04} fontWeight={400} fill="white" fontFamily="'DejaVu Sans', sans-serif" textAnchor="middle" alignmentBaseline="central" style={{ userSelect: 'none' }}>
        {label}
      </text>
    )}
  </>;
}

export function BarreMarker({
  fret,
  fromString,
  toString,
  showNumbers = false,
}: {
  fret: Fret,
  fromString: StringNumber,
  toString: StringNumber,
  showNumbers?: boolean,
}) {
  const { toCoordinates } = useFretboardLayout();
  const start = toCoordinates({ fret: fret - 0.33, string: fromString });
  const end = toCoordinates({ fret: fret - 0.33, string: toString });

  if (isNaN(start.x) || isNaN(start.y) || isNaN(end.x) || isNaN(end.y)) {
    console.error("Found the NaN!", { fret, fromString, toString, start, end });
  }

  return <>
    <line 
      x1={start.x} 
      y1={start.y} 
      x2={end.x} 
      y2={end.y} 
      stroke="rgba(245, 73, 39, 0.5)" 
      strokeWidth={0.07} 
      strokeLinecap="round" 
    />
    <FretMarker position={new FretboardPosition(fromString, fret)} label={showNumbers ? fret : undefined} />
    <FretMarker position={new FretboardPosition(toString, fret)} label={showNumbers ? fret : undefined} />
  </>;
}

export function MutedMarker({
  string,
}: {
  string: StringNumber;
}) {
  const { toCoordinates } = useFretboardLayout();
  const { x, y } = toCoordinates({ 
    fret: -0.33, 
    string 
  });

  return <>
    <line 
      x1={x - 0.015} 
      y1={y - 0.015} 
      x2={x + 0.015} 
      y2={y + 0.015} 
      stroke="black" 
      strokeWidth={0.004} 
    />
    <line 
      x1={x - 0.015} 
      y1={y + 0.015} 
      x2={x + 0.015} 
      y2={y - 0.015} 
      stroke="black" 
      strokeWidth={0.004} 
    />
  </>
}

function VerticalFretboard({ fretSpan, children, ...props }: FretboardProps) {
  fretSpan = fretSpan.clamp();

  const aspectRatio = STRING_COUNT / (FRET_ASPECT_RATIO * (fretSpan.width() + 1));
  const fretboardHeight = 1;
  const fretboardWidth = fretboardHeight * aspectRatio;
  const fretWidth = fretboardWidth / (STRING_COUNT + 1);
  const fretHeight = fretboardHeight / (fretSpan.width() + 1);
  const padding = 0.025;
  const width = fretboardWidth + 2 * padding;
  const height = fretboardHeight + 2 * padding;
  const viewBox = `0 0 ${width} ${height}`;
  const y1 = fretSpan.lowerEndpoint === 0 ? padding + fretHeight : padding;

  return (
    <FretboardLayoutContext.Provider value={{
      fretSpan,
      toCoordinates: (position) => {
        const { fret, string } = position;
        const x = padding + fretboardWidth * (STRING_COUNT - string + 1) / (STRING_COUNT + 1);
        const y = padding + fretboardHeight * (fret - fretSpan.lowerEndpoint! + 1) / (fretSpan.width() + 1);
        return { x, y };
      }
    }}>
      <SVGBase 
        viewBox={viewBox} 
        aspectRatio={aspectRatio} 
        {...props}>
        {/* <rect x={padding + fretWidth} y={padding + fretHeight} width={fretboardWidth - 2 * fretWidth} height={fretboardHeight - 2 * fretHeight} fill="white" /> */}
        {
          Array.from({ length: fretSpan.width() }, (_, i) => {
            const y = padding + fretboardHeight * (i + 1) / (fretSpan.width() + 1);
            const fretNumber = fretSpan.lowerEndpoint! + i;
            const strokeWidth = fretNumber === 0 ? 0.004 : 0.0015;
            return <line key={i} x1={padding + fretWidth - 0.00075} y1={y} x2={padding + fretboardWidth - fretWidth + 0.00075} y2={y} stroke="#000" strokeWidth={strokeWidth} />
          })
        }
        {
          Array.from({ length: 6 }, (_, i) => {
            const x = padding + fretboardWidth * (i + 1) / 7;
            return <line key={i} x1={x} y1={y1} x2={x} y2={padding + fretboardHeight - fretHeight} stroke="#000" strokeWidth={0.0015} />
          })
        }
        {children}
      </SVGBase>
    </FretboardLayoutContext.Provider>
  );
}

function HorizontalFretboard({ fretSpan, children, ...props }: FretboardProps) {
  fretSpan = fretSpan.clamp();

  const aspectRatio = FRET_ASPECT_RATIO * (fretSpan.width() + 1) / 6;
  const fretboardWidth = 1;
  const fretboardHeight = fretboardWidth / aspectRatio;
  const fretWidth = fretboardWidth / (fretSpan.width() + 1);
  const stringSpacing = fretboardHeight / 7; 
  const padding = 0.025;
  const width = fretboardWidth + 2 * padding;
  const height = fretboardHeight + 2 * padding;
  const viewBox = `0 0 ${width} ${height}`;
  const x1 = fretSpan.lowerEndpoint === 0 ? padding + fretWidth : padding;

  return (
    <FretboardLayoutContext.Provider value={{
      fretSpan,
      toCoordinates: (position) => {
        const { fret, string } = position;
        const x = padding + fretboardWidth * (fret - fretSpan.lowerEndpoint! + 1) / (fretSpan.width() + 1);
        const y = padding + fretboardHeight * string / 7;
        return { x, y };
      }
    }}>
      <SVGBase 
        viewBox={viewBox} 
        aspectRatio={width / height} 
        {...props}>
        {/* <rect 
          x={padding + fretWidth} 
          y={padding + stringSpacing} 
          width={fretboardWidth - 2 * fretWidth} 
          height={fretboardHeight - 2 * stringSpacing} 
          fill="white" 
        /> */}
        {
          Array.from({ length: fretSpan.width() }, (_, i) => {
            const x = padding + fretboardWidth * (i + 1) / (fretSpan.width() + 1);
            const fretNumber = fretSpan.lowerEndpoint! + i;
            const strokeWidth = fretNumber === 0 ? 0.004 : 0.0015;
            return <line key={i} x1={x} y1={padding + stringSpacing - 0.00075} x2={x} y2={padding + fretboardHeight - stringSpacing + 0.00075} stroke="#000" strokeWidth={strokeWidth} />
          })
        }
        {
          Array.from({ length: 6 }, (_, i) => {
            const y = padding + fretboardHeight * (i + 1) / 7;
            return <line key={i} x1={x1} y1={y} x2={padding + fretboardWidth - fretWidth} y2={y} stroke="#000" strokeWidth={0.0015} />
          })
        }
        {children}
      </SVGBase>
    </FretboardLayoutContext.Provider>
  );
}
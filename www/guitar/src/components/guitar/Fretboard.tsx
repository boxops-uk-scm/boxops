/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import { FretSpan } from "../../music/Fingering";
import { FretboardPosition, type Fret, type StringNumber } from "../../music/Fretboard";
import SVGBase, { type SVGBaseProps } from "./SVGBase";

export default function Fretboard(props: FretboardProps & { direction?: 'horizontal' | 'vertical' }) {
  const direction = props.direction ?? 'horizontal';

  return direction === 'vertical'
    ? <></>
    : <HorizontalFretboard {...props} />
}

export type FretboardProps = {
  fretSpan: FretSpan;
} & Omit<SVGBaseProps, | 'viewBox' | 'aspectRatio'>;

export type FretboardLayoutContextType = {
  fretSpan: FretSpan;
  fretboardOrigin: { x: number, y: number };
  fretSize: { width: number, height: number };
  fretboardSize: { width: number, height: number };
  containerSize: { width: number, height: number };
  aspectRatio: number;
  coordinateTransform: (fret: Fret, string: StringNumber) => { x: number, y: number };
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
  const { coordinateTransform } = useFretboardLayout();
  return coordinateTransform;
}

// export function BarreMarkerV1({
//   fret,
//   fromString,
//   toString,
//   showNumbers = false,
// }: {
//   fret: Fret,
//   fromString: StringNumber,
//   toString: StringNumber,
//   showNumbers?: boolean,
// }) {
//   const { toCoordinates } = useFretboardLayout();
//   const start = toCoordinates({ fret: fret - 0.33, string: fromString });
//   const end = toCoordinates({ fret: fret - 0.33, string: toString });

//   return <>
//     <line 
//       x1={start.x} 
//       y1={start.y} 
//       x2={end.x} 
//       y2={end.y} 
//       stroke="rgba(245, 73, 39, 0.5)" 
//       strokeWidth={0.07} 
//       strokeLinecap="round" 
//     />
//     <FretMarkerV1 position={new FretboardPosition(fromString, fret)} label={showNumbers ? fret : undefined} />
//     <FretMarkerV1 position={new FretboardPosition(toString, fret)} label={showNumbers ? fret : undefined} />
//   </>;
// }

// export function OpenStringMarkerV1({
//   string,
// }: {
//   string: StringNumber;
// }) {
//   const { toCoordinates } = useFretboardLayout();
//   const { x, y } = toCoordinates({ 
//     fret: -0.33, 
//     string
//   });

//   return <circle cx={x} cy={y} r={0.015} strokeWidth={0.004} stroke='black' fill='transparent' />;
// }

// export function MutedMarkerV1({
//   string,
// }: {
//   string: StringNumber;
// }) {
//   const { toCoordinates } = useFretboardLayout();
//   const { x, y } = toCoordinates({ 
//     fret: -0.33, 
//     string 
//   });

//   return <>
//     <line 
//       x1={x - 0.015} 
//       y1={y - 0.015} 
//       x2={x + 0.015} 
//       y2={y + 0.015} 
//       stroke="black" 
//       strokeWidth={0.004} 
//     />
//     <line 
//       x1={x - 0.015} 
//       y1={y + 0.015} 
//       x2={x + 0.015} 
//       y2={y - 0.015} 
//       stroke="black" 
//       strokeWidth={0.004} 
//     />
//   </>
// }

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
  const { coordinateTransform } = useFretboardLayout();
  const { fretSize } = useFretboardLayout();
  const start = coordinateTransform(fret - 0.33, fromString);
  const end = coordinateTransform(fret - 0.33, toString);

  const strokeWidth = 2 * 0.35 * fretSize.height;

  return <>
    <line 
      x1={start.x} 
      y1={start.y} 
      x2={end.x} 
      y2={end.y} 
      stroke="rgba(245, 73, 39, 0.5)" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
    />
    <FretMarker fret={fret} string={fromString} label={showNumbers ? fret : undefined} />
    <FretMarker fret={fret} string={toString} label={showNumbers ? fret : undefined} />
  </>;
}

export function FretMarker({
  fret,
  string,
  label
}: {
  fret: Fret;
  string: StringNumber;
  label?: string | number;
}) {
  const { fretSpan, fretSize } = useFretboardLayout();
  const transform = useFretboardCoordinateTransform();
  const { x, y } = transform(fret - 0.33, string);

  if (fretSpan.contains(new FretboardPosition(string, fret))) {
    return <>
      <circle cx={x} cy={y} r={0.35 * fretSize.height} fill="#F54927" />
      {label !== undefined && (
        <text style={{ userSelect: 'none' }} x={x} y={y} fontWeight='bold' textAnchor="middle" dominantBaseline="central" fontSize={0.4 * fretSize.height} fill="white">{label}</text>
      )}
    </>;
  }

  return <></>
}

function HorizontalFretboard({ fretSpan, children, ...props }: FretboardProps) {
  fretSpan = fretSpan.clamp();

  const stringCount = 6;
  const fretAspectRatio = 3/2;

  const fretboardSizeFrets = {
    width: fretSpan.width(),
    height: stringCount - 1,
  };

  const containerWidthFrets = {
    width: fretboardSizeFrets.width + 2,
    height: fretboardSizeFrets.height + 2,
  }
  
  const aspectRatio = fretAspectRatio * containerWidthFrets.width / containerWidthFrets.height;

  const containerSize = {
    width: 1,
    height: 1 / aspectRatio,
  };

  const fretSize = {
    width: containerSize.width / containerWidthFrets.width,
    height: containerSize.height / containerWidthFrets.height,
  }

  const fretboardSize = {
    width: fretSize.width * fretboardSizeFrets.width,
    height: fretSize.height * fretboardSizeFrets.height,
  }

  const fretboardOrigin = {
    x: fretSize.width * (1 - fretSpan.lowerEndpoint!),
    y: fretSize.height,
  }

  const lowerEndpointPosition = {
    x: fretSize.width,
    y: fretSize.height,
  };

  const viewBox = `0 0 ${containerSize.width} ${containerSize.height}`;

  return (
    <FretboardLayoutContext.Provider value={{
      fretSpan,
      fretboardOrigin,
      fretSize,
      fretboardSize,
      containerSize,
      aspectRatio,
      coordinateTransform: (fret: Fret, string: StringNumber) => {
        // In horizontal fretboard: frets are horizontal (X), strings are vertical (Y)
        const x = fretboardOrigin.x + fretSize.width * fret;
        const y = fretboardOrigin.y + fretSize.height * (string - 1);
        return { x, y };
      }
    }}>
      <SVGBase
        viewBox={viewBox} 
        aspectRatio={aspectRatio} 
        {...props}>
        {
          Array.from({ length: fretboardSizeFrets.width + 1 }, (_, i) => {
            const x = lowerEndpointPosition.x + fretSize.width * i;
            const y1 = lowerEndpointPosition.y - 0.001;
            const y2 = lowerEndpointPosition.y + fretboardSize.height + 0.001;
            const fretNumber = fretSpan.lowerEndpoint! + i;
            const strokeWidth = fretNumber === 0 ? 3 : 1;
            return <line vectorEffect='non-scaling-stroke' key={i} x1={x} y1={y1} x2={x} y2={y2} stroke="#000" strokeWidth={strokeWidth} />;
          })
        }
        {
          Array.from({ length: stringCount }, (_, i) => {
            const y = lowerEndpointPosition.y + fretSize.height * i;
            const x1 = lowerEndpointPosition.x - 0.001;
            const x2 = lowerEndpointPosition.x + fretboardSize.width + 0.001;
            return <line vectorEffect='non-scaling-stroke' key={i} x1={x1} y1={y} x2={x2} y2={y} stroke="#000" strokeWidth={1} />
          })
        }
        {children}
      </SVGBase>
    </FretboardLayoutContext.Provider>
  );
}
/* eslint-disable react-refresh/only-export-components */
import { Children, cloneElement, isValidElement, type CSSProperties } from "react";
import { FretboardPosition, FRETS, STRINGS, type Fret, type StringNumber } from "../music/Fretboard";
import { FretSpan } from "../music/Fingering";

export const FRETBOARD_WIDTH = 600;
export const FRETBOARD_HEIGHT = 200;

export const FRET_WIDTH = FRETBOARD_WIDTH / FRETS.length;
export const STRING_SPACING = FRETBOARD_HEIGHT / (STRINGS.length + 1);

export const OPEN_STRING_SPACE = FRET_WIDTH * 1.5; 
export const LOCAL_VIEWBOX_WIDTH = FRETBOARD_WIDTH + OPEN_STRING_SPACE;

export const NOTE_RADIUS = 8;
export const DOT_RADIUS = 3;

type Point = { x: number; y: number };

export function fretboardPositionToPoint(
  fretboardPosition: FretboardPosition,
  fretWidth = FRET_WIDTH,
  stringSpacing = STRING_SPACING
): Point {
  const x = fretboardPosition.fret * fretWidth - (fretWidth / 3);
  const y = fretboardPosition.string * stringSpacing;
  return { x, y };
}

export type FretSVGProps = { 
  fret: Fret;
  fretWidth?: number;
  stringSpacing?: number;
  fretboardHeight?: number;
};

export function FretSVG({ fret, fretWidth = FRET_WIDTH, stringSpacing = STRING_SPACING, fretboardHeight = FRETBOARD_HEIGHT }: FretSVGProps) {
  const x = fret * fretWidth;
  const yStart = stringSpacing;
  const yEnd = fretboardHeight - stringSpacing;

  return <line x1={x} y1={yStart} x2={x} y2={yEnd} style={{
    stroke: '#2a2a2a',
    strokeWidth: 1
  }} />;
}

export type StringSVGProps = { 
  string: StringNumber;
  fretWidth?: number;
  stringSpacing?: number;
  fretboardWidth?: number;
  frets?: { from?: number; to?: number };
};

export function StringSVG({ string, fretWidth = FRET_WIDTH, stringSpacing = STRING_SPACING, frets }: StringSVGProps) {
  const y = string * stringSpacing;
  const fromFret = frets?.from ?? 0;
  const toFret = frets?.to ?? (FRETS.length - 1);
  const startX = fromFret * fretWidth;
  const endX = toFret * fretWidth;
  
  return <line x1={startX} y1={y} x2={endX} y2={y} style={{
    stroke: '#2a2a2a',
    strokeWidth: 0.4
  }} />;
}

export type DotSVGProps = { 
  fret: 3 | 5 | 7 | 9 | 12 | 15 | 17 | 19 | 21 | 24;
  fretWidth?: number;
  fretboardHeight?: number;
};

export function DotSVG({ fret, fretWidth = FRET_WIDTH, fretboardHeight = FRETBOARD_HEIGHT }: DotSVGProps) {
  const x = fret * fretWidth - (fretWidth / 2);
  const y = fretboardHeight / 2;

  const style: CSSProperties = {
    fill: '#2a2a2a',
  }

  if (fret === 12 || fret === 24) {
    return (
      <g>
        <circle cx={x - 8} cy={y} r={DOT_RADIUS} style={style} />
        <circle cx={x + 8} cy={y} r={DOT_RADIUS} style={style} />
      </g>
    );
  }

  return <circle cx={x} cy={y} r={DOT_RADIUS} style={style} />;
}

export type FretNumberSVGProps = {
  fret: Fret;
  fretWidth?: number;
  fretboardHeight?: number;
};

export function FretNumberSVG({ fret, fretWidth = FRET_WIDTH }: FretNumberSVGProps) {
  const { x, y } = fretboardPositionToPoint({ fret, string: STRINGS.length + 1 } as FretboardPosition, fretWidth, STRING_SPACING);

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="10"
      fill="#666"
      fontWeight="normal"
    >
      {fret}
    </text>
  );
}

export type NoteSVGProps = {
  fretboardPosition: FretboardPosition;
  label?: string;
  isTonic?: boolean;
  subtle?: boolean;
  fretWidth?: number;
  stringSpacing?: number;
};

export function NoteSVG({ fretboardPosition, label, isTonic, subtle, fretWidth, stringSpacing }: NoteSVGProps) {
  const point = fretboardPositionToPoint(fretboardPosition, fretWidth, stringSpacing);
  
  const style: CSSProperties = {
    fill: isTonic ? (
      subtle ? '#696969' : '#d94c4c'
    ) : (
      subtle ? '#b7b7b7' : '#007bff'
    )
  };
  
  return (
    <g>
      <circle cx={point.x} cy={point.y} r={NOTE_RADIUS} style={style} />
      <text
        x={point.x-0.1}
        y={point.y+1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight='bold'
        fill="white"
        fontSize={NOTE_RADIUS}
      >
        {label}
      </text>
    </g>
  );
}

export type FretboardSVGProps = {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  children?: React.ReactNode;
  frets?: FretSpan;
  showDots?: boolean;
  showFretNumbers?: boolean;
};

export function FretboardSVG({ 
  x = 0, 
  y = 0, 
  width = "100%", 
  height = "100%", 
  children, 
  frets,
  showDots = true,
  showFretNumbers = false
}: FretboardSVGProps) {
  const fromFret = frets?.lowerEndpoint ?? FretSpan.fullFretboard.lowerEndpoint!;
  const toFret = frets?.upperEndpoint ?? FretSpan.fullFretboard.upperEndpoint!;
  const fretRange = toFret - fromFret;
  const openStringSpace = FRET_WIDTH * 1.5;
  const rightPadding = openStringSpace; 
  const effectiveFretboardWidth = fretRange * FRET_WIDTH;
  const totalViewboxWidth = effectiveFretboardWidth + openStringSpace + rightPadding;
  const topPadding = NOTE_RADIUS + 5;
  const bottomPadding = NOTE_RADIUS + 5 + (showFretNumbers ? 25 : 0);
  const viewboxHeight = topPadding + (STRINGS.length * STRING_SPACING) + bottomPadding;
  const viewboxOffsetX = fromFret * FRET_WIDTH;

  return (
    <svg 
      x={x} 
      y={y} 
      width={width} 
      height={height}
      viewBox={`${viewboxOffsetX - openStringSpace} -${topPadding} ${totalViewboxWidth} ${viewboxHeight}`}
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
    >
      <rect 
        x={fromFret * FRET_WIDTH}
        y={STRING_SPACING}
        width={effectiveFretboardWidth}
        height={FRETBOARD_HEIGHT - 2 * STRING_SPACING}
        style={{ fill: 'white' }}
      />
      {showDots && [3, 5, 7, 9, 12, 15, 17, 19, 21, 24].filter(fret => fret >= fromFret && fret <= toFret).map(fret => (
        <DotSVG
          key={fret} 
          fret={fret as DotSVGProps["fret"]}
          fretWidth={FRET_WIDTH}
          fretboardHeight={FRETBOARD_HEIGHT}
        />
      ))}
      {Array.from({ length: toFret - fromFret + 1 }, (_, i) => fromFret + i).map((fret) => (
        <FretSVG 
          key={fret} 
          fret={fret}
          fretWidth={FRET_WIDTH}
          stringSpacing={STRING_SPACING}
          fretboardHeight={FRETBOARD_HEIGHT}
        />
      ))}
      {STRINGS.map((string) => (
        <StringSVG 
          key={string} 
          string={string}
          fretWidth={FRET_WIDTH}
          stringSpacing={STRING_SPACING}
          frets={{ from: fromFret, to: toFret }}
        />
      ))}
      {showFretNumbers && Array.from({ length: toFret - fromFret + 1 }, (_, i) => fromFret + i)
        .filter(fret => fret > 0)
        .map((fret) => (
          <FretNumberSVG 
            key={fret} 
            fret={fret}
            fretWidth={FRET_WIDTH}
            fretboardHeight={FRETBOARD_HEIGHT}
          />
        ))}
      <g>
        {Children.map(children, (child) => {
          if (isValidElement(child) && child.type === NoteSVG) {
            return cloneElement(child as React.ReactElement<NoteSVGProps>, {
              fretWidth: FRET_WIDTH,
              stringSpacing: STRING_SPACING,
            });
          }
          return child;
        })}
      </g>
    </svg>
  );
}

export type NoteChartSVGProps = {
  title?: string;
  subtitle?: string;
  notes: NoteSVGProps[];
  frets?: FretSpan;
  showDots?: boolean;
  showFretNumbers?: boolean;
}

export function NoteChartSVG({ title, subtitle, notes, frets, showDots = true, showFretNumbers = false }: NoteChartSVGProps) {
  const fromFret = frets?.lowerEndpoint ?? FretSpan.fullFretboard.lowerEndpoint!;
  const toFret = frets?.upperEndpoint ?? FretSpan.fullFretboard.upperEndpoint!;
  const fretRange = toFret - fromFret;
  const titleSpace = title ? 40 : 0;
  const subtitleSpace = subtitle ? 30 : 0;
  const headerHeight = titleSpace + subtitleSpace;
  const openStringSpace = FRET_WIDTH * 1.5;
  const rightPadding = openStringSpace;
  const effectiveFretboardWidth = fretRange * FRET_WIDTH;
  const topPadding = NOTE_RADIUS + 5;
  const bottomPadding = NOTE_RADIUS + 5 + (showFretNumbers ? 25 : 0); // Extra space for fret numbers
  const viewboxHeight = topPadding + (STRINGS.length * STRING_SPACING) + bottomPadding;
  const canvasWidth = effectiveFretboardWidth + openStringSpace + rightPadding;
  const canvasHeight = viewboxHeight + headerHeight;

  return <svg viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} width="100%" height="100%">
    {title && (
      <text x={canvasWidth / 2} y={35} textAnchor="middle" fontSize="24" fontWeight="bold" fill="currentColor">
        {title}
      </text>
    )}
    {subtitle && (
      <text x={canvasWidth / 2} y={title ? 65 : 35} textAnchor="middle" fontSize="16" fill="currentColor">
        {subtitle}
      </text>
    )}
    <FretboardSVG 
      x={0} 
      y={headerHeight} 
      width={canvasWidth} 
      height={viewboxHeight}
      frets={frets}
      showDots={showDots}
      showFretNumbers={showFretNumbers}
    >
      {notes.filter(note => note.fretboardPosition.fret >= fromFret && note.fretboardPosition.fret <= toFret).map((noteProps, i) => (
        <NoteSVG key={i} {...noteProps} />
      ))}
    </FretboardSVG>
  </svg>;
}
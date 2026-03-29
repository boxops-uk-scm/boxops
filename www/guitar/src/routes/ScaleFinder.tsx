/* eslint-disable react-refresh/only-export-components */
import { createEntryPointRoute } from "../relay/createEntryPointRoute";
import * as stylex from '@stylexjs/stylex';
import { Navbar } from "../components/Navbar";
import { MajorScale } from "../music/MajorScale";
import { NoteChartSVG, type NoteSVGProps } from "../components/Fretboard";
import { Mode, type ModeName } from "../music/Mode";
import { ModalScale } from "../music/ModalScale";
import { useEffect, useState } from "react";
import { type DiatonicScale } from "../music/Scale";
import { NaturalPitchClass } from "../music/NaturalPitchClass";
import { Spelling } from "../music/Spelling";
import { Tuning } from "../music/Tuning";
import { FretSpan, type Fingering } from "../music/Fingering";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { Fret } from "../music/Fretboard";
import { NavbarSpacer } from "../components/NavbarSpacer";

const entryPointRoute = createEntryPointRoute({
  queries: {},
  getQueryVariables: () => {
    return {};
  },
  Component: ScaleFinder
})

type ScaleFinderProps = object;

function ScaleFinder(_props: ScaleFinderProps) {
  const [scale, setScale] = useState<DiatonicScale>(ModalScale.fromTonic(Spelling.c(), Mode.ionian(), Tuning.standard())!);

  const [compact, setCompact] = useState(typeof window !== 'undefined' ? window.innerWidth < 1200 : false);

  const [showFingerings, setShowFingerings] = useState(false);
  const [showNoteNames, setShowNoteNames] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setCompact(window.innerWidth < 1200);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [])

  const notesOnLowEString = scale.notes(6);

  const tonicsOnLowEString = notesOnLowEString
    .filter(note => note.spelling?.equiv(scale.tonic) ?? false);;

  let patterns = tonicsOnLowEString
    .map(note => scale.pattern(note.fretboardPosition.fret))
    .filter(pattern => Array.from(pattern.fretboardPositions()).every(position => FretSpan.fullFretboard.contains(position)));

  if (compact) {
    patterns = patterns
      .filter(pattern => !pattern.usesOpenStrings())
      .sort((a, b) => a.fretSpan().lowerEndpoint! - b.fretSpan().lowerEndpoint!)
      .slice(0, 1);
  }

  const highlightedFretboardPositions = patterns
    .map(pattern => pattern.fretboardPositions());

  const patternSpan = patterns
    .map(pattern => pattern.fretSpan())
    .reduce(FretSpan.compose, new FretSpan());

  const noteProps: NoteSVGProps[] = scale.notes().map((note, _index) => {
    const isHighlighted = highlightedFretboardPositions
      .some(positions => positions.has(note.fretboardPosition));

    const pattern = patterns.find(pattern => pattern.fretboardPositions().has(note.fretboardPosition));
    const finger = pattern?.fingerings.find((fingering: Fingering) => fingering.fretboardPosition.equiv(note.fretboardPosition))?.finger;

    return {
      fretboardPosition: note.fretboardPosition,
      isTonic: note.spelling?.equiv(scale.tonic),
      subtle: !isHighlighted,
      label: showFingerings && isHighlighted && finger ? finger.symbol('left') : showNoteNames ? note.spelling?.toString() : undefined,
    };
  });
  
  const subtitle = Array.from(scale.degrees.values()).join(' ');

  return (
    <main {...stylex.props(styles.main)}>
      <NavbarSpacer />
      <Navbar />
      <section {...stylex.props(styles.section)}>
        <ScaleGrid scale={scale} setScale={setScale} />
        <ScaleSelector scale={scale} setScale={setScale} />
        <div style={{ maxWidth: '1200px', height: '100%', width: '100%', userSelect: 'none' }}>
          <NoteChartSVG showFretNumbers notes={noteProps} title={scale.name} subtitle={subtitle} frets={
            compact ? patternSpan.withLowerEndpoint((le: Fret) => le - 2).withUpperEndpoint((ue: Fret) => ue + 2).clamp() : undefined
          }/>
        </div>
        <div {...stylex.props(styles.options)}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input type="checkbox" id="showFingerings" checked={showFingerings} onChange={(e) => setShowFingerings(e.target.checked)} />
            <label htmlFor="showFingerings">Show Fingerings</label>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input type="checkbox" id="showNoteNames" checked={showNoteNames} onChange={(e) => setShowNoteNames(e.target.checked)} />
            <label htmlFor="showNoteNames">Show Note Names</label>
          </div>
        </div>
      </section>
    </main>
  );
}

function ScaleSelector({ scale, setScale }: { scale: DiatonicScale, setScale: (scale: DiatonicScale) => void }) {
  const mode = scale instanceof ModalScale
    ? scale.mode
    : Mode.ionian();

  const parentScale = scale instanceof ModalScale
    ? scale.parentScale
    : scale;

  const parentScaleTonic = parentScale.tonic;
  const modalTonic = scale.tonic;

  const onChangeParentScaleTonic = (newParentTonic: Spelling) => {
    setScale(new ModalScale(MajorScale.fromTonic(newParentTonic, Tuning.standard()), mode));
  };

  const onChangeModalTonic = (newModalTonic: Spelling) => {
    const newParentTonic = ModalScale.fromTonic(newModalTonic, mode, Tuning.standard())!.parentScale.tonic;
    setScale(new ModalScale(MajorScale.fromTonic(newParentTonic, Tuning.standard()), mode));
  };
  
  return <div {...stylex.props(styles.scaleSelector)}>
    <div>Mode</div>
    <div>Modal Tonic</div>
    <div>Parent Tonic</div>
    <select {...stylex.props(styles.scaleSelect)} value={mode.name} onChange={(e) => {
      const newMode = new Mode(e.target.value as ModeName);
      setScale(new ModalScale(MajorScale.fromTonic(parentScaleTonic, Tuning.standard()), newMode));
    }}>
      {Mode.all().map(mode => <option key={mode.name} value={mode.name}>{mode.name}</option>)}
    </select>
    <select {...stylex.props(styles.scaleSelect)} value={modalTonic.toString()} onChange={(e) => {
      const newModalTonic = Spelling.fromString(e.target.value);
      if (newModalTonic) {
        onChangeModalTonic(newModalTonic);
      }
    }}>
      {Array.from(MajorScale.standardScales.values()).map(parentScale => new ModalScale(parentScale, mode)).map(modalScale => <option key={modalScale.tonic.toString()} value={modalScale.tonic.toString()}>{modalScale.tonic.toString()}</option>)}
    </select>
    <select {...stylex.props(styles.scaleSelect)} value={parentScaleTonic.toString()} onChange={(e) => {
      const newParentTonic = Spelling.fromString(e.target.value);
      if (newParentTonic) {
        onChangeParentScaleTonic(newParentTonic);
      }
    }}>
      {Array.from(MajorScale.standardScales.values()).map(scale => <option key={scale.tonic.toString()} value={scale.tonic.toString()}>{scale.tonic.toString()}</option>)}
    </select>
  </div>
}

function ScaleGrid({ scale, setScale, xstyle }: { scale: DiatonicScale, setScale: (scale: DiatonicScale) => void, xstyle?: StyleXStyles }) {
  return <div {...stylex.props(styles.scaleGrid, xstyle)}>
    <div></div>
    {
      Array
        .from(MajorScale.standardScales.entries())
        .sort((a, b) => NaturalPitchClass.all().indexOf(a[1].tonic.naturalPitchClass) - NaturalPitchClass.all().indexOf(b[1].tonic.naturalPitchClass))
        .map(([tonic, _]) => {
          const label = tonic.toString();
          const isSelected = scale instanceof ModalScale && scale.parentScale.tonic.equiv(tonic);
          return <div {...stylex.props(styles.scaleGridColumnHeader, isSelected && styles.selectedHeader)} key={label}>{label}</div>;
        })
    }
    {
      Mode
        .all()
        .flatMap(mode => {
          const isSelected = scale instanceof ModalScale && scale.mode.name === mode.name;
          return Array.from([
          <div {...stylex.props(styles.scaleGridRowHeader, isSelected && styles.selectedHeader)} key={mode.name}>{mode.name}</div>,
          ...Array
            .from(MajorScale.standardScales.values())
            .sort((a, b) => NaturalPitchClass.all().indexOf(a.tonic.naturalPitchClass) - NaturalPitchClass.all().indexOf(b.tonic.naturalPitchClass))
            .map((parentScale) => new ModalScale(parentScale, mode))
            .map((modalScale) => {
              const label = modalScale.tonic.toString();
              const isSelected = modalScale.equiv(scale);
              return <button {...stylex.props(styles.scaleButton, isSelected && styles.selectedScaleButton)} key={`${modalScale.name}-${label}`} onClick={() => {
                setScale(modalScale);
              }}>{label}</button>;
            }),
        ])
      })
    }
  </div>
}

export const loader = entryPointRoute.loader;
export default entryPointRoute.Component;

export const links = () => [];

const styles = stylex.create({
  options: {
    display: 'flex',
    gap: '1rem',
    fontSize: '1rem',
    userSelect: 'none',
    ['@media (max-width: 1200px) or (max-height: 800px)']: {
      justifyContent: 'center',
    },
  },
  main: {
    backgroundColor: '#f8f8f8',
    width: '100%',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: '2rem',
    paddingInline: '2rem',
  },
  header: {
    maxWidth: '1200px',
    marginInline: 'auto',
    padding: '2rem 0rem 0.5rem',
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  p: {
    maxWidth: '800px',
    marginInline: 'auto',
    padding: '0 1rem',
    fontSize: '1.25rem',
    textAlign: 'center',
    color: '#555',
  },
  section: {
    backgroundColor: '#f8f8f8',
    width: '100%',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    overflow: 'hidden',
  },
  scaleGrid: {
    maxWidth: '1600px',
    width: '100%',
    display: {
      default: 'grid',
      ['@media (max-width: 1200px) or (max-height: 1100px)']:  'none',
    },
    gap: '0.5rem',
    gridTemplateColumns: 'minmax(0, 1fr) repeat(12, 1fr)',
    userSelect: 'none',
  },
  scaleSelector: {
    display: {
      default: 'none',
      ['@media (max-width: 1200px) or (max-height: 1100px)']:  'grid',
    },
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.5rem',
    width: '100%',
    maxWidth: '800px',
    justifyContent: 'center',
    userSelect: 'none',
    fontWeight: 'bold',
  },
  scaleSelect: {
    fontSize: '1rem',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  scaleGridColumnHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  scaleGridRowHeader: {
    fontWeight: 'bold',
    textAlign: 'right',
  },
  scaleButton: {
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#eee',
    },
  },
  selectedScaleButton: {
    backgroundColor: '#d94c4c',
    color: '#fff',
    borderWidth: '0px',
    fontWeight: 'bold',
    ':hover': {
      backgroundColor: '#c43b3b',
    },
  },
  selectedHeader: {
    color: '#d94c4c',
  }
})
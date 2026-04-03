/* eslint-disable react-refresh/only-export-components */
import { createEntryPointRoute } from "../relay/createEntryPointRoute";
import * as stylex from "@stylexjs/stylex";

import './base.css';
import NavigationMenu from "../components/NavigationMenu";
import { ModalScale } from "../music/ModalScale";
import { useState } from "react";
import type { DiatonicScale } from "../music/Scale";
import { Spelling } from "../music/Spelling";
import { Mode } from "../music/Mode";
import { Tuning } from "../music/Tuning";
import { MajorScale } from "../music/MajorScale";
import { NaturalPitchClass } from "../music/NaturalPitchClass";
import { Fingering, FretSpan } from "../music/Fingering";
import Fretboard, { FretMarker } from "../components/guitar/Fretboard";

const entryPointRoute = createEntryPointRoute({
  queries: {},
  getQueryVariables: () => {
    return {};
  },
  Component: Scales
})

type ScalesProps = object;

function Scales(_: ScalesProps) {
  const [scale, setScale] = useState<DiatonicScale>(ModalScale.fromTonic(Spelling.c(), Mode.ionian(), Tuning.standard())!);
  const [showFingerings, setShowFingerings] = useState(false);
  const [showNoteNames, setShowNoteNames] = useState(true);

  // const mode = scale instanceof ModalScale
  //   ? scale.mode
  //   : Mode.ionian();

  // const parentScale = scale instanceof ModalScale
  //   ? scale.parentScale
  //   : scale;

  // const parentScaleTonic = parentScale.tonic;
  // const modalTonic = scale.tonic;

  // const onChangeParentScaleTonic = (newParentTonic: Spelling) => {
  //   setScale(new ModalScale(MajorScale.fromTonic(newParentTonic, Tuning.standard()), mode));
  // };

  // const onChangeModalTonic = (newModalTonic: Spelling) => {
  //   const newParentTonic = ModalScale.fromTonic(newModalTonic, mode, Tuning.standard())!.parentScale.tonic;
  //   setScale(new ModalScale(MajorScale.fromTonic(newParentTonic, Tuning.standard()), mode));
  // };

  const notesOnLowEString = scale.notes(6);

  const tonicsOnLowEString = notesOnLowEString
    .filter(note => note.spelling?.equiv(scale.tonic) ?? false);

  const patterns = tonicsOnLowEString
    .map(note => scale.pattern(note.fretboardPosition.fret))
    .filter(pattern => Array.from(pattern.fretboardPositions()).every(position => FretSpan.fullFretboard.contains(position)));

  // if (compact) {
  //   patterns = patterns
  //     .filter(pattern => !pattern.usesOpenStrings())
  //     .sort((a, b) => a.fretSpan().lowerEndpoint! - b.fretSpan().lowerEndpoint!)
  //     .slice(0, 1);
  // }

  const highlightedFretboardPositions = patterns
    .map(pattern => pattern.fretboardPositions());

  // const patternSpan = patterns
  //   .map(pattern => pattern.fretSpan())
  //   .reduce(FretSpan.compose, new FretSpan());

  const subtitle = Array.from(scale.degrees.values()).join(' ');

  return <>
    <NavigationMenu />
    <main {...stylex.props(styles.main)}>
      <section aria-label="Scale Selector" {...stylex.props(styles.scaleSelector)}>
        <section aria-label="Title" {...stylex.props(styles.info)}>
          <h1 {...stylex.props(styles.h1)}>Scale Finder</h1>
          <p {...stylex.props(styles.p)}>Select a scale from the grid below to view its notes and fingerings on the fretboard.</p>
        </section>
        <div></div>
        {
          Array
            .from(MajorScale.standardScales.entries())
            .sort((a, b) => NaturalPitchClass.all().indexOf(a[1].tonic.naturalPitchClass) - NaturalPitchClass.all().indexOf(b[1].tonic.naturalPitchClass))
            .map(([tonic, _]) => {
              const label = tonic.toString();
              // const isSelected = scale instanceof ModalScale && scale.parentScale.tonic.equiv(tonic);
              return <div {...stylex.props(styles.scaleSelectorColumnHeader)} key={label}>{label}</div>;
            })
        }
        {
          Mode
            .all()
            .flatMap(mode => {
              // const isSelected = scale instanceof ModalScale && scale.mode.name === mode.name;
              return Array.from([
              <div {...stylex.props(styles.scaleSelectorRowHeader)} key={mode.name}>{mode.name}</div>,
              ...Array
                .from(MajorScale.standardScales.values())
                .sort((a, b) => NaturalPitchClass.all().indexOf(a.tonic.naturalPitchClass) - NaturalPitchClass.all().indexOf(b.tonic.naturalPitchClass))
                .map((parentScale) => new ModalScale(parentScale, mode))
                .map((modalScale) => {
                  const label = modalScale.tonic.toString();
                  const isSelected = modalScale.equiv(scale);
                  return <button {...stylex.props(styles.button, isSelected && styles.selected)} key={`${modalScale.name}-${label}`} onClick={() => {
                    setScale(modalScale);
                  }}>{label}</button>;
                }),
            ])
          })
        }
        <section aria-label="Scale Information" {...stylex.props(styles.info)}>
          <h1 {...stylex.props(styles.h1)}>{scale.name}</h1>
          <p {...stylex.props(styles.p)}>{subtitle}</p>
        </section>
        <section aria-label="Fretboard" {...stylex.props(styles.fretboard)}>
          <Fretboard fretSpan={new FretSpan(0,16)} showDots showFretNumbers>
          {
            scale.notes().map((note, index) => {
              const isHighlighted = highlightedFretboardPositions
                .some(positions => positions.has(note.fretboardPosition));

              const pattern = patterns.find(pattern => pattern.fretboardPositions().has(note.fretboardPosition));
              const finger = pattern?.fingerings.find((fingering: Fingering) => fingering.fretboardPosition.equiv(note.fretboardPosition))?.finger;
              const isTonic = note.spelling?.equiv(scale.tonic) ?? false;
              // return {
              //   fretboardPosition: note.fretboardPosition,
              //   isTonic: note.spelling?.equiv(scale.tonic),
              //   subtle: !isHighlighted,
              //   label: showFingerings && isHighlighted && finger ? finger.symbol('left') : showNoteNames ? note.spelling?.toString() : undefined,
              // };

              return <FretMarker
                key={index}
                fret={note.fretboardPosition.fret}
                string={note.fretboardPosition.string}
                label={showFingerings && isHighlighted && finger ? (note.fretboardPosition.fret === 0 ? undefined : finger.symbol('left')) : showNoteNames ? note.spelling?.toString() : undefined}
                fretStyle={isTonic ? (isHighlighted ? styles.tonicMarker : styles.subtleTonicMarker) : isHighlighted ? styles.fretMarker : styles.subtleFretMarker}
                textStyle={!isHighlighted ? styles.subtleFretLabel : undefined}
              />
            })
          }
          </Fretboard>
        </section>
        <section aria-label="Scale Information" {...stylex.props(styles.settings)}>
          <button {...stylex.props(styles.button, showFingerings && styles.selected)} onClick={() => setShowFingerings(!showFingerings)}>
            Show Fingerings
          </button>
          <button {...stylex.props(styles.button, showNoteNames && styles.selected)} onClick={() => setShowNoteNames(!showNoteNames)}>
            Show Note Names
          </button>
        </section>
      </section>
    </main>
    <footer {...stylex.props(styles.footer)}>

    </footer>
  </>
}

export const loader = entryPointRoute.loader;
export default entryPointRoute.Component;

export const links = () => [];

const styles = stylex.create({
  tonicMarker: {
    fill: '#F54927',
  },
  fretMarker: {
    fill: '#111834',
  },
  subtleFretMarker: {
    fill: '#f8f8f8',
    stroke: 'rgb(189, 185, 173)',
    strokeWidth: '0.001',
    color: 'rgb(30, 29, 28)',
  },
  subtleTonicMarker: {
    fill: '#dfd9d0',
    stroke: 'rgb(122, 117, 103)',
    strokeWidth: '0.001',
  },
  subtleFretLabel: {
    fill: 'rgb(30, 29, 28)',
    fontWeight: 'normal',
  },
  main: {
    inlineSize: '100%',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  fretboard: {
    gridColumn: '2 / -1',
    backgroundColor: '#ECE6DE',
    borderRadius: '8px',
    borderStyle: 'solid',
    borderWidth: '1px',
    paddingLeft: '3%',
    borderColor: 'rgb(189, 185, 173)',
  },
  info: {
    gridColumn: '2 / -1',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  settings: {
    gridColumn: '2 / -1',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  scaleSelector: {
    maxWidth: '1600px',
    width: '100%',
    display: 'grid',
    gap: '0.5rem',
    gridTemplateColumns: 'minmax(0, 1fr) repeat(12, 1fr)',
    userSelect: 'none',
  },
  scaleSelectorColumnHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  scaleSelectorRowHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    fontWeight: 'bold',
  },
  button: {
    padding: '0.45rem 1rem',
    fontSize: '1rem',
    borderRadius: '4px',
    backgroundColor: '#f8f8f8',
    borderColor: 'rgb(189, 185, 173)',
    borderWidth: '1px',
    borderStyle: 'solid',
    cursor: 'pointer',
    userSelect: 'none',
    [':hover']: {
      backgroundColor: '#ECE6DE',
    }
  },
  selected: {
    backgroundColor: '#202953',
    color: 'white',
    borderWidth: 0,
    margin: '1px',
    [':hover']: {
      backgroundColor: '#111834',
    }
  },
  h1: {
    userSelect: 'none',
    margin: 0,
    padding: 0,
    lineHeight: '2.5rem',
  },
  p: {
    marginTop: '0.5rem',
    color: '#555',
    marginBottom: 0,
    lineHeight: '1.5rem',
  },
  footer: {

  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    height: '400px',
    borderColor: 'rgb(189, 185, 173)',
    color: 'rgb(30, 29, 28)',
    borderRadius: '8px',
    borderStyle: 'solid',
    borderWidth: '1px',
    padding: '1rem',
    userSelect: 'none',
  },
});
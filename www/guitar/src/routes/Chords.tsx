/* eslint-disable react-refresh/only-export-components */
import { createEntryPointRoute } from "../relay/createEntryPointRoute";
import * as stylex from "@stylexjs/stylex";

import './base.css';
import NavigationMenu from "../components/NavigationMenu";
import Fretboard, { BarreMarker, FretMarker, MuteMarker, OpenStringMarker } from "../components/guitar/Fretboard";
import { FretSpan } from "../music/Fingering";
import { useState, type ReactNode } from "react";

const entryPointRoute = createEntryPointRoute({
  queries: {},
  getQueryVariables: () => {
    return {};
  },
  Component: Chords
})

type ChordsProps = object;

function Chords(_: ChordsProps) {
  const [includeMajor, setIncludeMajor] = useState(false);
  const [includeMinor, setIncludeMinor] = useState(false);
  const [includeDominantSevenths, setIncludeDominantSevenths] = useState(false);
  const [includeMinorSevenths, setIncludeMinorSevenths] = useState(false);
  const [includeAugmented, setIncludeAugmented] = useState(false);
  const [includeDiminished, setIncludeDiminished] = useState(false);

  const anySelected = includeMajor
  || includeMinor
  || includeDominantSevenths
  || includeMinorSevenths
  || includeAugmented
  || includeDiminished;

  let filter = (_: Chord) => true;
  if (anySelected) {
    filter = (chord: Chord) => {
      if (includeMajor && chord.tonality === 'major') return true;
      if (includeMinor && chord.tonality === 'minor') return true;
      if (includeDominantSevenths && (chord.tonality === 'dominant7th' || chord.tonality === 'major7th' || chord.tonality === 'minor7th')) return true;
      if (includeMinorSevenths && chord.tonality === 'minor7th') return true;
      if (includeAugmented && chord.tonality === 'augmented') return true;
      if (includeDiminished && chord.tonality === 'diminished') return true;
      return false;
    }
  }

  return <>
    <NavigationMenu />
    <main {...stylex.props(styles.main)}>
      <section aria-label="Heading and description">
        <h1 {...stylex.props(styles.h1)}>Chord Library</h1>
        <p {...stylex.props(styles.p)}>Use the controls below to find chords.</p>
      </section>
      <section aria-label="Search controls" {...stylex.props(styles.searchControls)}>
        <button {...stylex.props(styles.button, includeMajor && styles.selected)} onClick={() => setIncludeMajor(!includeMajor)}>
          Major
        </button>
        <button {...stylex.props(styles.button, includeMinor && styles.selected)} onClick={() => setIncludeMinor(!includeMinor)}>
          Minor
        </button>
        <button {...stylex.props(styles.button, includeDominantSevenths && styles.selected)} onClick={() => setIncludeDominantSevenths(!includeDominantSevenths)}>
          Dominant 7th
        </button>
        <button {...stylex.props(styles.button, includeMinorSevenths && styles.selected)} onClick={() => setIncludeMinorSevenths(!includeMinorSevenths)}>
          Minor 7th
        </button>
        <button {...stylex.props(styles.button, includeAugmented && styles.selected)} onClick={() => setIncludeAugmented(!includeAugmented)}>
          Augmented
        </button>
        <button {...stylex.props(styles.button, includeDiminished && styles.selected)} onClick={() => setIncludeDiminished(!includeDiminished)}>
          Diminished
        </button>
      </section>
      <SearchResults filter={filter} />
    </main>
    <footer {...stylex.props(styles.footer)}>

    </footer>
  </>
}

function SearchResults({ filter }: { filter: (chord: Chord) => boolean }) {
  return <section aria-label="Search results" {...stylex.props(styles.searchResults)}>
    {chords.filter(filter).map((chord, index) => (
      <ChordDiagram key={index} chord={chord} />
    ))}
  </section>
}

function ChordDiagram({ chord }: { chord: Chord }) {
  return <div {...stylex.props(styles.card)}>
    <h3>{chord.name}</h3>
    <Fretboard fretSpan={chord.fretSpan} direction='vertical' xstyle={styles.diagram} showDots showFretNumbers>
      {chord.notes}
    </Fretboard>
  </div>
}

type Chord = {
  name: string;
  tonality?: 'major' | 'minor' | 'diminished' | 'augmented' | 'dominant7th' | 'major7th' | 'minor7th';
  fretSpan: FretSpan;
  notes: ReactNode;
}

const chords: Chord[] = [
  {
    name: 'Amaj',
    tonality: 'major',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <BarreMarker fret={2} fromString={2} toString={4} label={1}/>
      <OpenStringMarker string={5} />
      <OpenStringMarker string={1} />
      <MuteMarker string={6} />
    </>
  },
  {
    name: 'Bmaj',
    tonality: 'major',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <BarreMarker fret={2} fromString={1} toString={5} label={1}/>
      <BarreMarker fret={4} fromString={2} toString={4} label={3}/>
      <MuteMarker string={6} />
    </>
  },
  {
    name: 'Cmaj',
    tonality: 'major',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={6} />
      <FretMarker fret={3} string={5} label={3} />
      <FretMarker fret={2} string={4} label={2} />
      <OpenStringMarker string={3} />
      <FretMarker fret={1} string={2} label={1} />
      <OpenStringMarker string={1} />
    </>
  },
  {
    name: 'Dmaj',
    tonality: 'major',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={6} />
      <MuteMarker string={5} />
      <OpenStringMarker string={4} />
      <FretMarker fret={2} string={3} label={1} />
      <FretMarker fret={3} string={2} label={2} />
      <FretMarker fret={2} string={1} label={3} />
    </>
  },
  {
    name: 'Emaj',
    tonality: 'major',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <OpenStringMarker string={6} />
      <FretMarker fret={2} string={5} label={2} />
      <FretMarker fret={2} string={4} label={3} />
      <FretMarker fret={1} string={3} label={1} />
      <OpenStringMarker string={2} />
      <OpenStringMarker string={1} />
    </>
  },
  {
    name: 'Fmaj',
    tonality: 'major',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <BarreMarker fret={1} fromString={1} toString={6} label={1}/>
      <FretMarker fret={3} string={5} label={3} />
      <FretMarker fret={3} string={4} label={4} />
      <FretMarker fret={2} string={3} label={2} />
    </>
  },
  {
    name: 'Gmaj',
    tonality: 'major',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <FretMarker fret={3} string={6} label={2} />
      <FretMarker fret={2} string={5} label={1} />
      <OpenStringMarker string={4} />
      <OpenStringMarker string={3} />
      <OpenStringMarker string={2} />
      <FretMarker fret={3} string={1} label={3} />
    </>
  },
  {
    name: 'Amin',
    tonality: 'minor',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <FretMarker fret={2} string={4} label={2} />
      <FretMarker fret={2} string={3} label={3} />
      <FretMarker fret={1} string={2} label={1} />
      <OpenStringMarker string={5} />
      <OpenStringMarker string={1} />
      <MuteMarker string={6} />
    </>
  },
  {
    name: 'Bmin',
    tonality: 'minor',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <BarreMarker fret={2} fromString={1} toString={5} label={1}/>
      <FretMarker fret={4} string={4} label={3}/>
      <FretMarker fret={4} string={3} label={4}/>
      <FretMarker fret={3} string={2} label={2}/>
      <MuteMarker string={6} />
    </>
  },
  {
    name: 'Cmin',
    tonality: 'minor',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={1} />
      <OpenStringMarker string={3} />
      <FretMarker fret={1} string={4} label={1} />
      <FretMarker fret={1} string={2} label={2} />
      <FretMarker fret={3} string={5} label={4} />
      <MuteMarker string={6} />
    </>
  },
  {
    name: 'Dmin',
    tonality: 'minor',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={6} />
      <MuteMarker string={5} />
      <OpenStringMarker string={4} />
      <FretMarker fret={2} string={3} label={2} />
      <FretMarker fret={3} string={2} label={3} />
      <FretMarker fret={1} string={1} label={1} />
    </>
  },
  {
    name: 'Emin',
    tonality: 'minor',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <OpenStringMarker string={6} />
      <FretMarker fret={2} string={5} label={2} />
      <FretMarker fret={2} string={4} label={3} />
      <OpenStringMarker string={3} />
      <OpenStringMarker string={2} />
      <OpenStringMarker string={1} />
    </>
  },
  {
    name: 'Fmin',
    tonality: 'minor',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <BarreMarker fret={1} fromString={1} toString={6} label={1}/>
      <FretMarker fret={3} string={5} label={3} />
      <FretMarker fret={3} string={4} label={4} />
    </>
  },
  {
    name: 'Gmin',
    tonality: 'minor',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <BarreMarker fret={3} fromString={1} toString={6} label={1}/>
      <FretMarker fret={5} string={5} label={3} />
      <FretMarker fret={5} string={4} label={4} />
    </>
  },
  {
    name: 'A7',
    tonality: 'dominant7th',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <FretMarker fret={2} string={4} label={1} />
      <FretMarker fret={2} string={2} label={3} />
      <OpenStringMarker string={5} />
      <OpenStringMarker string={3} />
      <OpenStringMarker string={1} />
      <MuteMarker string={6} />
    </>
  },
  {
    name: 'B7',
    tonality: 'dominant7th',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={6} />
      <FretMarker fret={2} string={5} label={1} />
      <FretMarker fret={1} string={4} label={2} />
      <FretMarker fret={2} string={3} label={3} />
      <OpenStringMarker string={2} />
      <FretMarker fret={2} string={1} label={4} />
    </>
  },
  {
    name: 'C7',
    tonality: 'dominant7th',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={6} />
      <FretMarker fret={3} string={5} label={3} />
      <FretMarker fret={2} string={4} label={2} />
      <FretMarker fret={3} string={3} label={4} />
      <FretMarker fret={1} string={2} label={1} />
      <OpenStringMarker string={1} />
    </>
  },
  {
    name: 'D7',
    tonality: 'dominant7th',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={6} />
      <MuteMarker string={5} />
      <OpenStringMarker string={4} />
      <FretMarker fret={2} string={3} label={1} />
      <FretMarker fret={1} string={2} label={2} />
      <FretMarker fret={2} string={1} label={3} />
    </>
  },
  {
    name: 'E7',
    tonality: 'dominant7th',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <OpenStringMarker string={6} />
      <FretMarker fret={2} string={5} label={2} />
      <OpenStringMarker string={4} />
      <FretMarker fret={1} string={3} label={1} />
      <OpenStringMarker string={2} />
      <OpenStringMarker string={1} />
    </>
  },
  {
    name: 'F7',
    tonality: 'dominant7th',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <BarreMarker fret={1} fromString={1} toString={6} label={1}/>
      <FretMarker fret={3} string={5} label={3} />
      <FretMarker fret={2} string={3} label={2} />
    </>
  },
  {
    name: 'G7',
    tonality: 'dominant7th',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <FretMarker fret={3} string={6} label={3} />
      <FretMarker fret={2} string={5} label={2} />
      <OpenStringMarker string={4} />
      <OpenStringMarker string={3} />
      <OpenStringMarker string={2} />
      <FretMarker fret={1} string={1} label={1} />
    </>
  },
  {
    name: 'Amin7',
    tonality: 'minor7th',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={6} />
      <OpenStringMarker string={5} />
      <FretMarker string={4} fret={2} label={2} />
      <OpenStringMarker string={3} />
      <FretMarker string={2} fret={1} label={1} />
      <OpenStringMarker string={1} />
    </>
  },
  {
    name: 'Bmin7',
    tonality: 'minor7th',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={6} />
      <BarreMarker fromString={1} toString={5} fret={2} label={1}/>
      <FretMarker string={4} fret={4} label={3} />
      <FretMarker string={2} fret={3} label={2} />
    </>
  },
  {
    name: 'Cmin7',
    tonality: 'minor7th',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={6} />
      <BarreMarker fromString={2} toString={4} fret={1} label={1}/>
      <FretMarker string={5} fret={3} label={3} />
      <FretMarker string={3} fret={3} label={4} />
      <MuteMarker string={1} />
    </>
  },
  {
    name: 'Dmin7',
    tonality: 'minor7th',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={6} />
      <MuteMarker string={5} />
      <OpenStringMarker string={4} />
      <BarreMarker fromString={1} toString={2} fret={1} label={1}/>
      <FretMarker string={3} fret={2} label={2} />
    </>
  },
  {
    name: 'Emin7',
    tonality: 'minor7th',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <OpenStringMarker string={6} />
      <FretMarker string={5} fret={2} label={2} />
      <OpenStringMarker string={4} />
      <OpenStringMarker string={3} />
      <OpenStringMarker string={2} />
      <OpenStringMarker string={1} />
    </>
  },
  {
    name: 'Fmin7',
    tonality: 'minor7th',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <BarreMarker fromString={1} toString={6} fret={1} label={1}/>
      <FretMarker string={5} fret={3} label={3} />
    </>
  },
  {
    name: 'Gmin7',
    tonality: 'minor7th',
    fretSpan: new FretSpan(2, 6),
    notes: <>
      <BarreMarker fromString={1} toString={6} fret={3} label={1}/>
      <FretMarker string={5} fret={5} label={3} />
    </>
  },
  {
    name: 'Aaug',
    tonality: 'augmented',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={1} />
      <BarreMarker fromString={2} toString={3} fret={2} label={1}/>
      <FretMarker string={4} fret={3} label={2} />
      <FretMarker string={5} fret={4} label={3} />
      <MuteMarker string={6} />
    </>
  },
  {
    name: 'Baug',
    tonality: 'augmented',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={1} />
      <OpenStringMarker string={2} />
      <OpenStringMarker string={3} />
      <FretMarker string={4} fret={2} label={1} />
      <FretMarker string={5} fret={2} label={2} />
      <MuteMarker string={6} />
    </>
  },
  {
    name: 'Caug',
    tonality: 'augmented',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={1} />
      <BarreMarker fromString={2} toString={3} fret={1} label={1}/>
      <FretMarker string={4} fret={2} label={2} />
      <FretMarker string={5} fret={3} label={3} />
      <MuteMarker string={6} />
    </>
  },
  {
    name: 'Daug',
    tonality: 'augmented',
    fretSpan: new FretSpan(2, 6),
    notes: <>
      <MuteMarker string={1} />
      <BarreMarker fromString={2} toString={3} fret={3} label={1}/>
      <FretMarker string={4} fret={4} label={2} />
      <FretMarker string={5} fret={5} label={3} />
      <MuteMarker string={6} />
    </>
  },
  {
    name: 'Eaug',
    tonality: 'augmented',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={1} />
      <BarreMarker fromString={2} toString={3} fret={1} label={1}/>
      <FretMarker string={4} fret={2} label={2} />
      <FretMarker string={5} fret={3} label={3} />
      <MuteMarker string={6} />
    </>
  },
  {
    name: 'Faug',
    tonality: 'augmented',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={1} />
      <BarreMarker fromString={2} toString={3} fret={2} label={1}/>
      <FretMarker string={4} fret={3} label={2} />
      <FretMarker string={5} fret={4} label={3} />
      <MuteMarker string={6} />    
    </>
  },
  {
    name: 'Gaug',
    tonality: 'augmented',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={1} />
      <OpenStringMarker string={2} />
      <OpenStringMarker string={3} />
      <FretMarker string={4} fret={1} label={1} />
      <FretMarker string={5} fret={2} label={2} />
      <FretMarker string={6} fret={3} label={3} />
    </>
  },
  {
    name: 'Adim',
    tonality: 'diminished',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={1} />
      <BarreMarker fromString={2} toString={4} fret={1} label={1}/>
      <FretMarker string={3} fret={2} label={3} />
      <OpenStringMarker string={5} />
      <MuteMarker string={6} />
    </>
  },
  {
    name: 'Bdim',
    tonality: 'diminished',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={1} />
      <FretMarker string={2} fret={3} label={3} />
      <FretMarker string={3} fret={4} label={4} />
      <FretMarker string={4} fret={3} label={2} />
      <FretMarker string={5} fret={2} label={1} />
      <MuteMarker string={6} />
    </>
  },
  {
    name: 'Cdim',
    tonality: 'diminished',
    fretSpan: new FretSpan(2, 6),
    notes: <>
      <MuteMarker string={1} />
      <FretMarker string={2} fret={4} label={3} />
      <FretMarker string={3} fret={5} label={4} />
      <FretMarker string={4} fret={4} label={2} />
      <FretMarker string={5} fret={3} label={1} />
      <MuteMarker string={6} />
    </>
  },
  {
    name: 'Ddim',
    tonality: 'diminished',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <FretMarker string={1} fret={1} label={3} />
      <MuteMarker string={2} />
      <FretMarker string={3} fret={1} label={2} />
      <OpenStringMarker string={4} />
      <MuteMarker string={5} />
      <MuteMarker string={6} />
    </>
  },
  {
    name: 'Edim',
    tonality: 'diminished',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={1} />
      <MuteMarker string={2} />
      <OpenStringMarker string={3} />
      <FretMarker string={4} fret={2} label={3} />
      <FretMarker string={5} fret={1} label={1} />
      <OpenStringMarker string={6} />
      
    </>
  },
  {
    name: 'Fdim',
    tonality: 'diminished',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={1} />
      <OpenStringMarker string={2} />
      <FretMarker string={3} fret={1} label={1} />
      <FretMarker string={4} fret={3} label={3} />
      <MuteMarker string={5} />
      <MuteMarker string={6} />
    </>
  },
  {
    name: 'Gdim',
    tonality: 'diminished',
    fretSpan: new FretSpan(0, 5),
    notes: <>
      <MuteMarker string={1} />
      <FretMarker string={2} fret={2} label={1} />
      <FretMarker string={3} fret={3} label={2} />
      <FretMarker string={4} fret={5} label={4} />
      <MuteMarker string={5} />
      <MuteMarker string={6} />
    </>
  }
]

export const loader = entryPointRoute.loader;
export default entryPointRoute.Component;

export const links = () => [];

const styles = stylex.create({
  main: {
    inlineSize: '100%',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  searchControls: {
    display: 'flex',
    gap: '0.5rem',
  },
  button: {
    padding: '0.5rem 1rem',
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
  },
  p: {
    marginTop: '0.5rem',
    color: '#555',
    marginBottom: 0,
  },
  searchResults: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem',
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
  diagram: {
    height: '100%',
  }
});
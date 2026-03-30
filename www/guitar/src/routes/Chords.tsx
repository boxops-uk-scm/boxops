/* eslint-disable react-refresh/only-export-components */
import { createEntryPointRoute } from "../relay/createEntryPointRoute";
import * as stylex from "@stylexjs/stylex";

import './chords.css';
import Fretboard, { BarreMarker, FretMarker } from "../components/guitar/Fretboard";
import { FretSpan } from "../music/Fingering";
import { useState } from "react";

const entryPointRoute = createEntryPointRoute({
  queries: {},
  getQueryVariables: () => {
    return {};
  },
  Component: Chords
})

type ChordsProps = object;

function Chords(_: ChordsProps) {
  const [minFret, setMinFret] = useState(0);
  const [maxFret, setMaxFret] = useState(5);

  const fretSpan = new FretSpan(Math.min(minFret, maxFret), Math.max(minFret, maxFret));

  return <main {...stylex.props(styles.page)}>
    <Fretboard direction="vertical" xstyle={styles.vertical} fretSpan={fretSpan}>
      <BarreMarker fret={1} fromString={1} toString={6} showNumbers />
      <FretMarker fret={3} string={4} label={3} />
      <FretMarker fret={5} string={3} label={4} />
      <FretMarker fret={3} string={2} label={2} />
    </Fretboard>
    <Fretboard direction="horizontal" xstyle={styles.horizontal} fretSpan={fretSpan}>
      <BarreMarker fret={1} fromString={1} toString={6} showNumbers />
      <FretMarker fret={3} string={5} label={3} />
      <FretMarker fret={3} string={4} label={4} />
      <FretMarker fret={2} string={3} label={2} />
    </Fretboard>
    <button onClick={() => { setMinFret(f => Math.max(0, f - 1)) }}>-Min</button>
    <button onClick={() => { setMinFret(f => f + 1) }}>+Min</button>
    <button onClick={() => { setMaxFret(f => Math.max(0, f - 1)) }}>-Max</button>
    <button onClick={() => { setMaxFret(f => f + 1) }}>+Max</button>
  </main>
}


export const loader = entryPointRoute.loader;
export default entryPointRoute.Component;

export const links = () => [];

const styles = stylex.create({
  page: {
    width: '100%',
    height: '100%',
    minHeight: '100svh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vertical: {
    height: '300px',
  },
  horizontal: {
    width: '500px',
  }
});
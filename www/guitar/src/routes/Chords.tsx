/* eslint-disable react-refresh/only-export-components */
import { createEntryPointRoute } from "../relay/createEntryPointRoute";
import * as stylex from "@stylexjs/stylex";

import './chords.css';
import Fretboard, { BarreMarker, FretMarker, MutedMarker } from "../components/guitar/Fretboard";
import { FretSpan } from "../music/Fingering";
import { FretboardPosition } from "../music/Fretboard";

const entryPointRoute = createEntryPointRoute({
  queries: {},
  getQueryVariables: () => {
    return {};
  },
  Component: Chords
})

type ChordsProps = object;

function Chords(_: ChordsProps) {
  const fretSpan = new FretSpan(1, 5);

  return <main {...stylex.props(styles.page)}>
    <Fretboard direction="vertical" xstyle={styles.vertical} fretSpan={fretSpan}>
      <BarreMarker fret={1} fromString={1} toString={6} showNumbers />
      <FretMarker position={new FretboardPosition(4, 3)} label={3} />
      <FretMarker position={new FretboardPosition(5, 3)} label={4} />
      <FretMarker position={new FretboardPosition(3, 2)} label={2} />
    </Fretboard>
    <Fretboard direction="horizontal" xstyle={styles.horizontal} fretSpan={fretSpan}>
      <FretMarker position={new FretboardPosition(1, 0)} />
      <FretMarker position={new FretboardPosition(2, 1)} label={1} />
      <FretMarker position={new FretboardPosition(3, 0)} />
      <FretMarker position={new FretboardPosition(4, 2)} label={2} />
      <FretMarker position={new FretboardPosition(5, 3)} label={3} />
      <MutedMarker string={6} />
    </Fretboard>
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
  },
  vertical: {
    width: '300px',
  },
  horizontal: {
    height: '300px',
  }
});
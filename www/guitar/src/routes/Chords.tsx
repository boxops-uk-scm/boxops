/* eslint-disable react-refresh/only-export-components */
import { createEntryPointRoute } from "../relay/createEntryPointRoute";
import * as stylex from "@stylexjs/stylex";

import './chords.css';
import Fretboard, { BarreMarker, FretMarker, MuteMarker, OpenStringMarker } from "../components/guitar/Fretboard";
import { FretSpan } from "../music/Fingering";

const entryPointRoute = createEntryPointRoute({
  queries: {},
  getQueryVariables: () => {
    return {};
  },
  Component: Chords
})

type ChordsProps = object;

function Chords(_: ChordsProps) {
  const fretSpan = new FretSpan(0, 14);

  return <main {...stylex.props(styles.page)}>
    <Fretboard direction="vertical" xstyle={styles.vertical} fretSpan={fretSpan} showFretNumbers showDots>
      <BarreMarker fret={1} fromString={1} toString={6} label={1} />
      <FretMarker fret={3} string={5} label={3} />
      <FretMarker fret={3} string={4} label={4} />
      <FretMarker fret={2} string={3} label={2} />
    </Fretboard>
    <Fretboard direction="horizontal" xstyle={styles.horizontal} fretSpan={fretSpan} showFretNumbers showDots>
      <OpenStringMarker string={1} />
      <FretMarker fret={1} string={2} label={2} />
      <OpenStringMarker string={3} />
      <FretMarker fret={2} string={4} label={3} />
      <FretMarker fret={3} string={5} label={4} />
      <MuteMarker string={6} />
    </Fretboard>
    <Fretboard direction="vertical" xstyle={styles.vertical} fretSpan={fretSpan} showFretNumbers showDots>
      <OpenStringMarker string={1} />
      <FretMarker fret={1} string={2} label={2} />
      <OpenStringMarker string={3} />
      <FretMarker fret={2} string={4} label={3} />
      <FretMarker fret={3} string={5} label={4} />
      <MuteMarker string={6} />
    </Fretboard>
    <Fretboard direction="horizontal" xstyle={styles.horizontal} fretSpan={fretSpan} showFretNumbers showDots>
      <BarreMarker fret={1} fromString={1} toString={6} label={1} />
      <FretMarker fret={3} string={5} label={3} />
      <FretMarker fret={3} string={4} label={4} />
      <FretMarker fret={2} string={3} label={2} />
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
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignContent: 'center',
    justifyContent: 'center',
    gap: '32px',
  },
  vertical: {
    maxWidth: '50vw',
    maxHeight: '50vh',
  },
  horizontal: {
    maxWidth: '50vw',
    maxHeight: '50vh',
  }
});
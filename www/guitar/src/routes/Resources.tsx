/* eslint-disable react-refresh/only-export-components */
import { usePreloadedQuery, type PreloadedQuery } from "react-relay";
import { createEntryPointRoute } from "../relay/createEntryPointRoute";
import { graphql } from "relay-runtime";
import type { ResourcesQuery } from "./__generated__/ResourcesQuery.graphql";
import * as stylex from '@stylexjs/stylex';
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router";
import { MajorScale } from "../music/MajorScale";
import { NoteChartSVG, type NoteSVGProps } from "../components/Fretboard";
import { FretSpan, Pattern } from "../music/Fingering";
import { NavbarSpacer } from "../components/NavbarSpacer";

const viewerQuery = graphql`
  query ResourcesQuery {
    viewer {
      id
    }
  }
`;

const entryPointRoute = createEntryPointRoute({
  queries: {
    viewerQuery
  },
  getQueryVariables: () => {
    return {};
  },
  Component: ResourcesPage
})

type ResourcesPageProps = {
  viewerQuery: PreloadedQuery<ResourcesQuery>;
}

function ResourcesPage(props: ResourcesPageProps) {
  const _data = usePreloadedQuery(viewerQuery, props.viewerQuery);

  const navigate = useNavigate();

  const scale = MajorScale.a();

  const notesOnLowEString = scale.notes(6);

  const tonicsOnLowEString = notesOnLowEString
    .filter(note => note.spelling?.equiv(scale.tonic) ?? false);

  const patterns = tonicsOnLowEString
    .map(note => Pattern.ionianPattern(note.fretboardPosition.fret));

  const highlightedFretboardPositions = patterns
    .map(pattern => pattern.fretboardPositions());

  const noteProps: NoteSVGProps[] = scale.notes().map((note, _index) => ({
    fretboardPosition: note.fretboardPosition,
    isTonic: note.spelling?.equiv(scale.tonic),
    subtle: !highlightedFretboardPositions
      .some(positions => positions.has(note.fretboardPosition)),
  }));

  return (
    <>
      <main {...stylex.props(styles.main)}>
        <NavbarSpacer />
        <Navbar />
        <div {...stylex.props(styles.toolGrid)}>
          <div {...stylex.props(styles.tool)}>
            <NoteChartSVG notes={noteProps} frets={new FretSpan(2, 9)} />
            <button {...stylex.props(styles.button)} onClick={() => {
              navigate("/scale-finder");
            }}>
              Scales
            </button>
          </div>
          <div {...stylex.props(styles.tool)}>
            <ComingSoon />
            <button {...stylex.props(styles.button)} onClick={() => {
              navigate("/chords");
            }}>Chords</button>
          </div>
          <div {...stylex.props(styles.tool)}>
            <ComingSoon />
            <button {...stylex.props(styles.button)}>Arpeggios</button></div>
          <div {...stylex.props(styles.tool)}>
            <ComingSoon />
            <button {...stylex.props(styles.button)}>Circle of Fifths</button></div>
          <div {...stylex.props(styles.tool)}>
            <ComingSoon />
            <button {...stylex.props(styles.button)}>Metronome</button></div>
          <div {...stylex.props(styles.tool)}>
            <ComingSoon />
            <button {...stylex.props(styles.button)}>Tuner</button></div>
          <div {...stylex.props(styles.tool)}>
            <ComingSoon />
            <button {...stylex.props(styles.button)}>Jam Session</button></div>
          <div {...stylex.props(styles.tool)}>
            <ComingSoon />
            <button {...stylex.props(styles.button)}>Fretboard Trainer</button></div>
          <div {...stylex.props(styles.tool)}>
            <ComingSoon />
            <button {...stylex.props(styles.button)}>Tab Guide</button></div>
          <div {...stylex.props(styles.tool)}>
            <ComingSoon />
            <button {...stylex.props(styles.button)}>Glossary</button></div>
        </div>
      </main>
    </>
  );
}

function ComingSoon() {
  return <div style={{ display: 'flex', justifyContent: 'center', color: '#d0d0d0', alignItems: 'center', width: '100%', height: '100%', fontSize: '2rem' }}>Coming Soon..</div>;
}

export const loader = entryPointRoute.loader;
export default entryPointRoute.Component;

export const links = () => [];

const styles = stylex.create({
  main: {
    backgroundColor: '#f8f8f8',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: '2rem',
    paddingInline: '1rem',
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
  spacer: {
    minHeight: '16vh',
    transition: 'min-height 0.3s ease',
    ['@media (max-width: 1500px) and (min-width: 1200px)']: {
      minHeight: '8vh',
    },
    ['@media (max-width: 1200px)']: {
      minHeight: '0',
    }
  },
  toolGrid: {
    width: '100%',  
    maxWidth: '1200px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    ['@media (max-width: 1200px) and (min-width: 680px)']: {
      gridTemplateColumns: 'repeat(2, minmax(300px, 1fr))',
    },
    ['@media (max-width: 680px)']: {
      gridTemplateColumns: '1fr',
      maxWidth: '100%',
    }
  },
  button: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    color: 'black',
    borderWidth: '0',
    backgroundColor: 'transparent',
    padding: '0.8rem 1.2rem',
    borderRadius: '6px',
    userSelect: 'none',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'rgba(0,0,0,0.03)',
    },
    ':active': {
      backgroundColor: 'rgba(0,0,0,0.06)',
    },
  },
  tool: {
    minHeight: '400px',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'end',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
})
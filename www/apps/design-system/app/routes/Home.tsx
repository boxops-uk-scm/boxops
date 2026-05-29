import * as stylex from '@stylexjs/stylex';
import './home.css';

const blink = stylex.keyframes({
  '50%': {
    visibility: 'hidden',
  },
});

const styles = stylex.create({
  main: {
    width: 'min(100%, 1200px)',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '0 1rem',
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    userSelect: 'none',
    marginBottom: '6rem',
  },
  title: {
    margin: 0,
    fontSize: '6rem',
    color: '#fff',
    whiteSpace: 'nowrap',
  },
  caret: {
    backgroundColor: 'white',
    height: '4.5rem',
    width: '2ch',
    animationName: blink,
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'steps(1, start)',
  },
  console: {
    display: 'flex',
    flexDirection: 'column',
  },
  directory: {
    color: '#5d9eff',
  },
  user: {
    color: '#1ee894',
  },
  consoleText: {
    color: '#fff',
  },
  navbar: {
    display: 'flex',
    flexDirection: 'row',
    gap: '2rem',
    color: '#878787',
    marginBottom: '2rem',
    paddingTop: '2rem',
  },
  navItem: {
    cursor: 'pointer',
    ':hover': {
      color: '#fff',
    },
  },
  currentNavItem: {
    color: '#fff',
    textDecoration: 'underline',
    textDecorationColor: '#5d9eff',
    textUnderlineOffset: '0.4rem',
  },
  // linksSection: {
  //   display: 'grid',
  //   gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  //   gap: '2rem',
  //   width: '100%',
  // },
  // linkCard: {
  //   backgroundColor: '#191A1B',
  //   padding: '1.5rem',
  //   borderColor: '#2C2D2E',
  //   borderWidth: '2px',
  //   borderStyle: 'solid',
  //   borderRadius: '0.5rem',
  //   textDecoration: 'none',
  //   color: '#fff',
  //   display: 'flex',
  //   flexDirection: 'column',
  //   gap: '0.5rem',
  //   fontSize: '1.25rem',
  //   whiteSpace: 'nowrap',
  //   cursor: 'pointer',
  //   ':hover': {
  //     backgroundColor: '#252627',
  //   },
  // },
});

export function links() {
  return [
    {
      rel: 'stylesheet',
      href: 'https://use.typekit.net/cdq3ddb.css',
    },
  ];
}

export function meta() {
  return [
    {
      title: 'Tom Bates | Software Engineer',
    },
  ];
}

export default function Home() {
  return (
    <main {...stylex.props(styles.main)}>
      <nav {...stylex.props(styles.navbar)} aria-label="Primary">
        <span {...stylex.props(styles.currentNavItem)}>About</span>
        <span {...stylex.props(styles.navItem)}>Projects</span>
        <span {...stylex.props(styles.navItem)}>Skills</span>
        <span {...stylex.props(styles.navItem)}>Work Experience</span>
        <span {...stylex.props(styles.navItem)}>Contact</span>
      </nav>
      <section {...stylex.props(styles.titleSection)} aria-labelledby="title">
        <div {...stylex.props(styles.console)}>
          <span aria-hidden="true" {...stylex.props(styles.consoleText)}>
            <span {...stylex.props(styles.user)}>tombates</span>:<span {...stylex.props(styles.directory)}>~/boxops/www</span>${' '}
            whoami
          </span>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', alignItems: 'baseline' }}>
            <h1 id="title" {...stylex.props(styles.title)}>
              Tom Bates
            </h1>
            <div aria-hidden="true" {...stylex.props(styles.caret)} />
          </div>
        </div>
      </section>
    </main>
  );
}

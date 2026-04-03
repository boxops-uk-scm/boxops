import * as stylex from "@stylexjs/stylex";
import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';

export default function NavigationMenu() {
  return <BaseNavigationMenu.Root {...stylex.props(styles.root)}>
    <BaseNavigationMenu.List {...stylex.props(styles.list)}>
      <BaseNavigationMenu.Item>
        <BaseNavigationMenu.Link href="/" {...stylex.props(styles.trigger, styles.underline)}>Home</BaseNavigationMenu.Link>
      </BaseNavigationMenu.Item>
      <BaseNavigationMenu.Item>
        <BaseNavigationMenu.Link href="/about" {...stylex.props(styles.trigger, styles.underline)}>About</BaseNavigationMenu.Link>
      </BaseNavigationMenu.Item>
      <BaseNavigationMenu.Item>
        <BaseNavigationMenu.Link href="/lessons" {...stylex.props(styles.trigger, styles.underline)}>Lessons</BaseNavigationMenu.Link>
      </BaseNavigationMenu.Item>
      <BaseNavigationMenu.Item>
        <BaseNavigationMenu.Link href="/tutors" {...stylex.props(styles.trigger, styles.underline)}>Tutors</BaseNavigationMenu.Link>
      </BaseNavigationMenu.Item>
      <BaseNavigationMenu.Item>
        <BaseNavigationMenu.Link href="/services" {...stylex.props(styles.trigger, styles.underline)}>Services</BaseNavigationMenu.Link>
      </BaseNavigationMenu.Item>
      <BaseNavigationMenu.Item>
        <BaseNavigationMenu.Trigger {...stylex.props(styles.trigger, styles.underline)}>
          Resources
        </BaseNavigationMenu.Trigger>
        <BaseNavigationMenu.Content {...stylex.props(styles.content)}>
          <div {...stylex.props(styles.menu)}>
            <BaseNavigationMenu.Link aria-describedby="scales-description" href="/resources/scales" {...stylex.props(styles.menuItem, styles.sideline)}>
              Scales
              <span id='scales-description' {...stylex.props(styles.secondaryText)}>
                Explore every scale in every key across the entire fretboard
              </span>
            </BaseNavigationMenu.Link>
            <BaseNavigationMenu.Link aria-describedby="chords-description" href="/resources/chords" {...stylex.props(styles.menuItem, styles.sideline)}>
              Chords
              <span id='chords-description' {...stylex.props(styles.secondaryText)}>
                Discover how to play a wide range of chords
              </span>
            </BaseNavigationMenu.Link>
            <BaseNavigationMenu.Link aria-describedby="circle-of-fifths-description" href="/resources/circle-of-fifths" {...stylex.props(styles.menuItem, styles.sideline)}>
              Circle of Fifths
              <span id='circle-of-fifths-description' {...stylex.props(styles.secondaryText)}>
                Understand the relationships between keys and chords
              </span>
            </BaseNavigationMenu.Link>
            <BaseNavigationMenu.Link aria-describedby="metronome-description" href="/resources/metronome" {...stylex.props(styles.menuItem, styles.sideline)}>
              Metronome
              <span id='metronome-description' {...stylex.props(styles.secondaryText)}>
                Play along with an interactive metronome
              </span>
            </BaseNavigationMenu.Link>
            <BaseNavigationMenu.Link aria-describedby="tuner-description" href="/resources/tuner" {...stylex.props(styles.menuItem, styles.sideline)}>
              Tuner
              <span id='tuner-description' {...stylex.props(styles.secondaryText)}>
                Tune your guitar quickly and accurately
              </span>
            </BaseNavigationMenu.Link>
            <BaseNavigationMenu.Link aria-describedby="fretboard-trainer-description" href="/resources/fretboard-trainer" {...stylex.props(styles.menuItem, styles.sideline)}>
              Fretboard Trainer
              <span id='fretboard-trainer-description' {...stylex.props(styles.secondaryText)}>
                Learn the notes on the fretboard with interactive exercises
              </span>
            </BaseNavigationMenu.Link>
              <BaseNavigationMenu.Link aria-describedby="tab-guide-description" href="/resources/tab-guide" {...stylex.props(styles.menuItem, styles.sideline)}>
              Tab Guide
              <span id='tab-guide-description' {...stylex.props(styles.secondaryText)}>
                Learn how to read guitar tabs
              </span>
            </BaseNavigationMenu.Link>
            <BaseNavigationMenu.Link aria-describedby="mode-quiz-description" href="/resources/mode-quiz" {...stylex.props(styles.menuItem, styles.sideline)}>
              Mode Quiz
              <span id='mode-quiz-description' {...stylex.props(styles.secondaryText)}>
                Test your knowledge of musical modes
              </span>
            </BaseNavigationMenu.Link>
          </div>
        </BaseNavigationMenu.Content>
      </BaseNavigationMenu.Item>
      <BaseNavigationMenu.Item>
        <BaseNavigationMenu.Link href="/contact" {...stylex.props(styles.trigger, styles.underline)}>Contact</BaseNavigationMenu.Link>
      </BaseNavigationMenu.Item>
      <BaseNavigationMenu.Item {...stylex.props(styles.positionEnd)}>
          <BaseNavigationMenu.Link href="/login" {...stylex.props(styles.trigger, styles.linkEnd)}>Book</BaseNavigationMenu.Link>
      </BaseNavigationMenu.Item>
    </BaseNavigationMenu.List>
    <BaseNavigationMenu.Portal>
      <BaseNavigationMenu.Positioner
        {...stylex.props(styles.positioner)}
        sideOffset={10}
        collisionPadding={{ top: 5, bottom: 5, left: 20, right: 20 }}
        collisionAvoidance={{ side: 'none' }}
      >
        <BaseNavigationMenu.Popup {...stylex.props(styles.popup)}>
          <BaseNavigationMenu.Viewport {...stylex.props(styles.viewport)} />
        </BaseNavigationMenu.Popup>
      </BaseNavigationMenu.Positioner>
    </BaseNavigationMenu.Portal>
  </BaseNavigationMenu.Root>
}
const styles = stylex.create({
  indicator: {
    width: 0,
    height: '100%',
    backgroundColor: '#202953',
  },
  root: {
    position: 'sticky',
    top: 0,
    left: 0,
    right: 0,
    bottom: 'auto',
    zIndex: 1000,
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'relative',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    width: '100%',
    backgroundColor: '#ECE6DE',
    color: 'rgb(30, 29, 28)',
    borderBottomWidth: '1px',
    borderBottomColor: 'rgb(189, 185, 173)',
    borderBottomStyle: 'solid',
  },
  positionEnd: {
    marginInlineStart: '1rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    paddingRight: '2rem',
    display: 'flex',
    alignItems: 'center',
  },
  linkEnd: {
    fontWeight: 'normal',
    paddingTop: '0.75rem', 
    paddingBottom: '0.75rem',
    backgroundColor: '#202953',
    color: 'white',
    [':hover']: {
      backgroundColor: '#111834',
    }
  },
  underline: {
    ['::after']: {
      content: "",
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      bottom: '-1px',
      height: '2px',
      width: '50%',
      visibility: 'hidden',
      backgroundColor: '#202953',
      transition: 'width 0.2s ease',
    },
    [':hover::after']: {
      visibility: 'visible',
      width: '100%',
    }
  },
  sideline: {
    ['::after']: {
      content: "",
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '2px',
      height: '50%',
      visibility: 'hidden',
      backgroundColor: '#202953',
      transition: 'height 0.2s ease',
    },
    [':hover::after']: {
      visibility: 'visible',
      height: '100%',
    }
  },
  trigger: {
    position: 'relative',
    borderRadius: '6.5px',
    backgroundColor: 'inherit',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    gap: '0.375rem',
    fontWeight: 'bold',
    paddingTop: '2rem',
    paddingBottom: '2rem',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    margin: 0,
    borderWidth: 0,
    lineHeight: '1.5rem',
    userSelect: 'none',
    textDecoration: 'none',
  },
  content: {
    padding: '1rem',
  },
  positioner: {
    zIndex: 1000,
  },
  popup: {
    backgroundColor: '#f8f8f8',
    borderColor: 'rgb(189, 185, 173)',
    color: 'rgb(30, 29, 28)',
    borderRadius: '8px',
    borderStyle: 'solid',
    borderWidth: '1px'
  },
  boxShadow: {
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
  },
  viewport: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  menu: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
  },
  menuItem: {
    position: 'relative',
    color: 'inherit',
    textDecoration: 'none',
    width: '100%',
    height: '100%',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    padding: '0.5rem 0.875rem',
    borderRadius: '0.2rem',
    margin: 0,
    gap: '0.25rem',
    borderWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '1.5rem',
    userSelect: 'none',
    [':hover']: {

    }
  },
  secondaryText: {
    fontWeight: 'normal',
    fontSize: '1rem',
    color: 'rgb(30, 29, 28)',
    maxWidth: '28ch',
  }
});
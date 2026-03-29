import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

export function Experience() {
  const [index, setIndex] = useState(1);
  const [responses, setResponses] = useState<string[]>([]);

  function respond(response: string) {
    setResponses([...responses, response]);
    setIndex(prevIndex => prevIndex + 1);
  }

  return <section {...stylex.props(styles.section)}>
    { index === 1 && <Question1 respond={respond} /> }
    { index === 2 && <Question2 respond={respond} /> }
    { index === 3 && <Question3 respond={respond} /> }
    { index === 4 && <Question4 respond={respond} /> }
    { index === 5 && <Question5 respond={respond} /> }
    { index === 6 && <Question6 respond={respond} /> }
    { index === 7 && <Question7 respond={respond} /> }
    { index > 7 && (
      <div {...stylex.props(styles.gridContainer)}>
        <div {...stylex.props(styles.half)}>
          <strong>Join for <i>free</i> to get started with our online resources</strong>
          <div {...stylex.props(styles.answerGrid)}>
            <div {...stylex.props(styles.rowFull)}>
              <button {...stylex.props(styles.answerButton)} onClick={() => { alert('Sign up flow coming soon!'); }}>
                <img src="/google.svg" alt="" style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                <span {...stylex.props(styles.withIcon, styles.singleLine)}>Join with Google</span>
              </button>
            </div>
            <div {...stylex.props(styles.rowHalf)}>
              <button {...stylex.props(styles.answerButton)} onClick={() => { alert('Sign up flow coming soon!'); }}>
                <img src="/envelope_open.svg" alt="" style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                <span {...stylex.props(styles.withIcon, styles.singleLine)}>Join with Email</span>
              </button>
            </div>
            <div {...stylex.props(styles.rowHalf)}>
              <button {...stylex.props(styles.answerButton)} onClick={() => { alert('Sign up flow coming soon!'); }}>
                <img src="/facebook.svg" alt="" style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                <span {...stylex.props(styles.withIcon, styles.singleLine)}>Join with Facebook</span>
              </button>
            </div>
          </div>
        </div>
        <div {...stylex.props(styles.half)}>
          <strong>Book a lesson with one of our instructors</strong>
          <div {...stylex.props(styles.answerGrid)}>
            <div {...stylex.props(styles.rowFull)}>
              <button {...stylex.props(styles.answerButton)} onClick={() => { alert(JSON.stringify({
                experience: responses[0],
                skillLevel: responses[1],
                guitarType: responses[2],
                goals: responses[3],
                challenges: responses[4],
                musicPreference: responses[5],
                referralSource: responses[6],
              }, null, 2
              )); }}>
                <img src="/calendar.svg" alt="" style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                <span {...stylex.props(styles.withIcon, styles.singleLine)}>Book a lesson</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </section>
}

type QuestionProps = {
  respond: (response: string) => void;
}

function Question1({ respond }: QuestionProps) {
  return <>
    <strong>How much experience do you have with guitar?</strong>
    <div {...stylex.props(styles.answerGrid)}>
      <div {...stylex.props(styles.rowFull)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Total beginner'); }}>Total beginner</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Some experience'); }}>Some experience</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Advanced'); }}>Advanced</button>
      </div>
    </div>
  </>
}

function Question2({ respond }: QuestionProps) {
  return <>
    <strong>What is your current skill level?</strong>
    <div {...stylex.props(styles.answerGrid)}>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Never played before'); }}>Never played before</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Know a few chords'); }}>Know a few chords</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Some experience'); }}>Some experience</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Played for years'); }}>Played for years</button>
      </div>
    </div>
  </>
}

function Question3({ respond }: QuestionProps) {
  return <>
    <strong>What kind of guitar are you most interested in playing?</strong>
    <div {...stylex.props(styles.answerGrid)}>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Acoustic'); }}>Acoustic</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Electric'); }}>Electric</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Both'); }}>Both</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Not sure yet'); }}>Not sure yet</button>
      </div>
    </div>
  </>
}

function Question4({ respond }: QuestionProps) {
  return <>
    <strong>What do you want to work on next?</strong>
    <div {...stylex.props(styles.answerGrid)}>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Just learn the basics'); }}>Just learn the basics</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Get faster at learning songs'); }}>Get faster at learning songs</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Learn theory and scales'); }}>Learn theory and scales</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Improvise and solo'); }}>Improvise and solo</button>
      </div>
    </div>
  </>
}

function Question5({ respond }: QuestionProps) {
  return <>
    <strong>What feels hardest right now?</strong>
    <div {...stylex.props(styles.answerGrid)}>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Getting started'); }}>Getting started</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Knowing what to work on'); }}>Knowing what to work on</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Playing smoothly'); }}>Playing smoothly</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Sticking with it'); }}>Sticking with it</button>
      </div>
    </div>
  </>
}

function Question6({ respond }: QuestionProps) {
  return <>
    <strong>What kind of music do you enjoy playing the most?</strong>
    <div {...stylex.props(styles.answerGrid)}>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Rock'); }}>Rock</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Blues'); }}>Blues</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Acoustic/Folk'); }}>Acoustic/Folk</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Jazz'); }}>Jazz</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Country'); }}>Country</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Pop'); }}>Pop</button>
      </div>
    </div>
  </>
}

function Question7({ respond }: QuestionProps) {
  return <>
    <strong>How did you hear about us?</strong>
    <div {...stylex.props(styles.answerGrid)}>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Friend'); }}>Friend</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Social media'); }}>Social media</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Search engine'); }}>Search engine</button>
      </div>
      <div {...stylex.props(styles.rowHalf)}>
        <button {...stylex.props(styles.answerButton)} onClick={() => { respond('Other'); }}>Other</button>
      </div>
    </div>
  </>
}

const styles = stylex.create({
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    width: '100%',
    maxWidth: '1200px',
    ['@media (max-width: 1200px)']: {
      gridTemplateColumns: '1fr',
    },
  },
  section: {
    backgroundColor: '#f9d81f',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingInline: '2rem',
    paddingTop: '2rem',
    paddingBottom: '2rem',
    gap: '0.5rem',
  },
  answerButton: {
    userSelect: 'none',
    width: '100%',
    padding: '0.5rem 1.5rem',
    backgroundColor: '#fff',
    borderRadius: '4px',
    fontSize: '1rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'rgb(0, 0, 0, 0.7)',
    fontWeight: 'bold',
    height: '100%',
    [':hover']: {
      backgroundColor: '#f0f0f0',
    },
    [':active']: {
      backgroundColor: '#e0e0e0',
    }
  },
  singleLine: {
    textWrap: 'nowrap',
    wordBreak: 'keep-all',
  },
  withIcon: {
    lineHeight: 1,
    display: 'inline-flex',
    alignItems: 'center',
  },
  rowFull: {
    gridColumn: 'span 2',
  },
  rowHalf: {
    gridColumn: 'span 1',
  },
  answerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.5rem',
    width: '100%',
    maxWidth: '800px',
  },
  half: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  }
});
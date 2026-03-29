import * as stylex from '@stylexjs/stylex';

export default function Lessons() {
  return <section {...stylex.props(styles.section)}>
    <header {...stylex.props(styles.header)}>Unlock Your Inner Rock Star!</header>
    <p {...stylex.props(styles.p)}>Whether you're a complete beginner or an experienced player, we have lessons tailored to your needs. Our tutors are skilled at teaching students of all levels and can help you achieve your musical goals.</p>
    <div {...stylex.props(styles.gridContainer)}>
      <div {...stylex.props(styles.cardGrid)}>
        <article {...stylex.props(styles.card)}>
          <img src="/beginner.png" alt="Beginner" {...stylex.props(styles.cardImage)} />
          <span {...stylex.props(styles.cardHeader)}>Beginner</span>
          <p {...stylex.props(styles.cardContent)}>Our beginner lessons are designed for those who are new to the guitar. We cover the basics of playing, including chords, strumming patterns, and simple songs to get you started on your musical journey.</p>
          <span {...stylex.props(styles.spacer)} />
          <button {...stylex.props(styles.cardButton)}>Learn More</button>
        </article>
        <article {...stylex.props(styles.card)}>
          <img src="/intermediate.png" alt="Intermediate" {...stylex.props(styles.cardImage)} />
          <span {...stylex.props(styles.cardHeader)}>Intermediate</span>
          <p {...stylex.props(styles.cardContent)}>Our intermediate lessons are perfect for those who have a basic understanding of the guitar and want to take their skills to the next level. We focus on more complex chords, scales, and techniques to help you become a more versatile player.</p>
          <span {...stylex.props(styles.spacer)} />
          <button {...stylex.props(styles.cardButton)}>Learn More</button>
        </article>
        <article {...stylex.props(styles.card)}>
          <img src="/advanced.png" alt="Advanced" {...stylex.props(styles.cardImage)} />
          <span {...stylex.props(styles.cardHeader)}>Masterclass</span>
          <p {...stylex.props(styles.cardContent)}>Our advanced lessons are designed for experienced players who want to refine their skills and explore more complex musical concepts. We cover advanced techniques, improvisation, and music theory to help you reach your full potential as a guitarist.</p>
          <span {...stylex.props(styles.spacer)} />
          <button {...stylex.props(styles.cardButton)}>Learn More</button>
        </article>
      </div>
    </div>
  </section>
}

const styles = stylex.create({
  section: {
    backgroundColor: '#f8f8f8',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBlockEnd: '6rem',
    paddingInline: '1rem',
  },
  header: {
    maxWidth: '1200px',
    marginInline: 'auto',
    padding: '2rem 1rem 1rem',
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  p: {
    maxWidth: '600px',
    marginInline: 'auto',
    padding: '0 1rem 2rem',
    fontSize: '1.25rem',
    textAlign: 'center',
    color: '#555',
  },
  gridContainer: {
    maxWidth: '1200px',
    marginInline: 'auto',
    paddingInline: '1rem',
    ['@media (max-width: 1200px)']: {
      maxWidth: '600px',
    },
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem 1.5rem',
    ['@media (min-width: 1200px)']: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },
  cardImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    objectPosition: 'top',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
  cardHeader: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    padding: '1rem',
  },
  cardContent: {
    fontSize: '0.9rem',
    padding: '0 1rem 1rem',
    textAlign: 'center',
  },
  cardButton: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    userSelect: 'none',
    borderWidth: '0px',
    borderRadius: '4px',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    ':active': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    }
  },
  spacer: {
    flexGrow: 1,
  },
  card: {
    minWidth: '20rem',
    minHeight: '25rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '1rem',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
    ['@media (min-width: 1200px)']: {
      maxWidth: '100%',
    },
    [':hover']: {
      transform: 'translateY(-4px)',
      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 4px 8px',
    },
  },
});
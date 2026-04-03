/* eslint-disable react-refresh/only-export-components */
import { createEntryPointRoute } from "../relay/createEntryPointRoute";
import * as stylex from "@stylexjs/stylex";

import './base.css';
import NavigationMenu from "../components/NavigationMenu";
import { Mode } from "../music/Mode";
import { SortedSet } from "@thi.ng/sorted-map/sorted-set";
import type { Fret } from "../music/Fretboard";
import { MajorScale } from "../music/MajorScale";
import { ModalScale } from "../music/ModalScale";
import { useState } from "react";
import { type DiatonicScale, ScaleDegree } from "../music/Scale";
import { Spelling } from "../music/Spelling";
import { Accidental } from "../music/Accidental";
import { NaturalPitchClass } from "../music/NaturalPitchClass";
import Fretboard, { FretMarker } from "../components/guitar/Fretboard";
import { Pattern } from "../music/Fingering";
import { Arbitrary } from "../music/Arbitrary";

const entryPointRoute = createEntryPointRoute({
  queries: {},
  getQueryVariables: () => {
    return {};
  },
  Component: ModeQuiz
})

type ModeQuizProps = object;

type Question
  = { type: 'mode-pattern'; answer: Mode; scale: DiatonicScale; choices: Mode[] }
  | { type: 'mode-ordinal'; answer: Mode; choices: Mode[] }
  | { type: 'relative-major'; answer: MajorScale; relativeMinor: ModalScale; choices: MajorScale[] }
  | { type: 'relative-minor'; answer: ModalScale; relativeMajor: MajorScale; choices: ModalScale[] }
  | { type: 'scale-degree'; answer: Spelling; degree: ScaleDegree; scale: DiatonicScale; choices: Spelling[] }
  | { type: 'parent-scale'; answer: MajorScale; scale: ModalScale; choices: MajorScale[] }
  | { type: 'mode-fret'; answer: Mode; choices: Mode[]; key: DiatonicScale; fret: Fret };

function questionToString(question: Question): string {
  switch (question.type) {
    case 'mode-pattern':
      return `What mode does the following fingering pattern correspond to?`;
    case 'mode-ordinal':
      return `What mode is the ${question.answer.toDegreeOfParentScale().toOrdinalString()} degree of its parent scale?`;
    case 'relative-major':
      return `What is the relative major of ${question.relativeMinor.tonic.toString()} Minor?`;
    case 'relative-minor':
      return `What is the relative minor of ${question.relativeMajor.name}?`;
    case 'parent-scale':
      return `What is the parent scale of ${question.scale.name}?`;
    case 'scale-degree':
      return `What is the ${question.degree.toString()} of ${question.scale.name}?`;
    case 'mode-fret':
      return `In the key of ${question.key.name}, what mode shape should you play at fret ${question.fret}?`;
  }
}

function distinctRandom<T>(random: (_?: SortedSet<T>) => T, count: number, not?: SortedSet<T>): T[] {
  return Arbitrary.distinct(random, count, not);
}

function shuffle<T>(xs: T[]): T[] {
  return Arbitrary.shuffle(xs);
}

function zipWith3<T, U, V, R>(xs: T[], ys: U[], zs: V[], fn: (x: T, y: U, z: V) => R): R[] {
  const length = Math.min(xs.length, ys.length, zs.length);
  const result: R[] = [];
  for (let i = 0; i < length; i++) {
    result.push(fn(xs[i], ys[i], zs[i]));
  }
  return result;
}

const accidentals: Accidental[] = [
  Accidental.sharp(),
  Accidental.flat(),
  Accidental.none()
]
  
const spellings: Spelling[] = NaturalPitchClass.all().flatMap(natural =>
  accidentals.map(accidental => new Spelling(natural, accidental))
);

function randomSpelling(not?: SortedSet<Spelling>): Spelling {
  return Arbitrary.choice(spellings, not);
}

function ModeQuiz(_: ModeQuizProps) {
  const [questions] = useState(() => {    
    const modePatternQuestions = shuffle(distinctRandom(Mode.random, 5)).map(mode => {
      const choices = distinctRandom(Mode.random, 4, new SortedSet<Mode>([mode]));
      return {
        type: 'mode-pattern',
        answer: mode,
        choices: shuffle([mode, ...choices]),
      } as Question & { type: 'mode-pattern' };
    });

    const modeOrdinalQuestions = distinctRandom(Mode.random, 4).map(mode => {
      const choices = distinctRandom(Mode.random, 4, new SortedSet<Mode>([mode]));
      return {
        type: 'mode-ordinal',
        answer: mode,
        choices: shuffle([mode, ...choices]),
      } as Question & { type: 'mode-ordinal' };
    });

    const relativeMajorQuestions = distinctRandom(MajorScale.random, 3).map(scale => {
        const relativeMajor = scale;
        const relativeMinor = new ModalScale(relativeMajor, Mode.aeolian());
        const choices = distinctRandom(MajorScale.random, 4, new SortedSet<MajorScale>([relativeMajor]));
        return {
          type: 'relative-major',
          answer: relativeMajor,
          relativeMinor,
          choices: shuffle([relativeMajor, ...choices]),
        } as Question & { type: 'relative-major' }
      });

    // Don't ask about relative minors whose relative major is already an answer in the relative major questions
    const relativeMinorQuestions = distinctRandom(
      MajorScale.random,
      3,
      new SortedSet<MajorScale>(relativeMajorQuestions.map(q => q.answer))
    ).map(scale => {
      const relativeMinor = new ModalScale(scale, Mode.aeolian());
      const relativeMajor = scale;
      const choices = distinctRandom(
        MajorScale.random,
        4,
        new SortedSet<MajorScale>([relativeMajor, ...relativeMajorQuestions.map(q => q.answer)])
      );
      return {
        type: 'relative-minor',
        answer: relativeMinor,
        relativeMajor,
        choices: shuffle([relativeMinor, ...choices.map(major => new ModalScale(major, Mode.aeolian()))]),
      } as Question & { type: 'relative-minor' };
    });

    const scaleDegreeQuestions = zipWith3(
      distinctRandom(MajorScale.random, 6),
      distinctRandom(() => ScaleDegree.random(new SortedSet([ScaleDegree.tonic()])), 6),
      distinctRandom(Mode.random, 6),
      (parentScale, degree, mode) => {
        const modalScale = new ModalScale(parentScale, mode);
        const answer = modalScale.degrees.get(degree)!;
        const choices = distinctRandom(
          randomSpelling,
          4,
          new SortedSet<Spelling>([answer])
        );
        return {
          type: 'scale-degree',
          answer,
          degree,
          scale: modalScale,
          choices: shuffle([answer, ...choices]),
        } as Question & { type: 'scale-degree' };
      }
    );

    const modeFretQuestions = distinctRandom(MajorScale.random, 8)
      .map(key => {
      const parentScale = key;
      const scale = Arbitrary.boolean() ? parentScale : new ModalScale(parentScale, Mode.aeolian());
      const notesOnString6 = scale.notes(6).filter(
        note => note.fretboardPosition.fret <= 12 && note.fretboardPosition.fret >= 2
      )
      const answerNote = Arbitrary.choice(notesOnString6);
      const answerFret = answerNote.fretboardPosition.fret;
      const { 0: answerDegree } = Array.from(parentScale.degrees.entries()).find(([_, note]) => {
        return note.equiv(answerNote.spelling);
      })!;
      const answerMode = Mode.fromDegreeOfParentScale(answerDegree);
      const choices = distinctRandom(
        Mode.random,
        3,
        new SortedSet<Mode>([answerMode])
      );

      // if (scale instanceof ModalScale) {
      //   console.log(`The relative major of ${scale.name} is ${scale.parentScale.name}`);
      // }
      // console.log(`The notes of the parent scale (${parentScale.name}) are: ${Array.from(parentScale.degrees.values()).map(s => s.toString()).join(', ')}`);
      // console.log(`Fret ${answerFret} on string 6 (with ${scale.name} spellings) is ${answerNote.spelling!.toString()}`);
      // console.log(`${answerNote.spelling!.toString()} is the ${answerDegree.toString()} of the parent scale, so the mode is ${answerMode.name}`);
      // console.log();

      return {
        type: 'mode-fret',
        answer: answerMode,
        choices: shuffle([answerMode, ...choices]),
        key: scale,
        fret: answerFret,
      } as Question & { type: 'mode-fret' };
    });

    const allQuestions = [
      ...modeOrdinalQuestions,
      ...relativeMajorQuestions,
      ...relativeMinorQuestions,
      ...scaleDegreeQuestions,
      ...modePatternQuestions,
      ...modeFretQuestions,
    ];
    
    return allQuestions;
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  return <>
    <NavigationMenu />
    <main {...stylex.props(styles.main)}>
      <section aria-label="Heading and description">
        <h1 {...stylex.props(styles.h1)}>Mode Quiz</h1>
        <p {...stylex.props(styles.p)}>Test your knowledge of musical modes.</p>
      </section>
      <section aria-label="Quiz question and answer choices" {...stylex.props(styles.quiz)}>
        {currentQuestionIndex < questions.length && <>
          <h2 {...stylex.props(styles.h2)}>Question {currentQuestionIndex + 1}.</h2>
          <p style={{ minHeight: '3rem', textAlign: 'center', lineHeight: '1.5rem' }} {...stylex.props(styles.p)}>{questionToString(questions[currentQuestionIndex])}</p>
          {renderQuestion(questions[currentQuestionIndex],
          (isCorrect: boolean) => {
            if (isCorrect) {
              setCorrectAnswers(n => n + 1);
            }
            setCurrentQuestionIndex(n => n + 1);
          }
          )}
          
        </>}
        {currentQuestionIndex >= questions.length && <>
          <h1 {...stylex.props(styles.h1)}>You've completed the quiz!</h1>
          <p {...stylex.props(styles.p)}>You answered {correctAnswers} out of {questions.length} questions correctly.</p>
          <p {...stylex.props(styles.p)}>Refresh the page to try again.</p>
        </>}
      </section>
    </main>
    <footer {...stylex.props(styles.footer)}>

    </footer>
  </>
}

function renderQuestion(question: Question, onAnswer: (isCorrect: boolean) => void = () => {}) {
  switch (question?.type) {
    case 'mode-pattern':
      return <ModePatternQuestion question={question} onAnswer={onAnswer} />;
    case 'mode-ordinal':
    case 'relative-major':
    case 'relative-minor':
    case 'scale-degree':
    case 'parent-scale':
      return <AnswerButtons question={question} onAnswer={onAnswer} />;
    case 'mode-fret':
      return <ModeFretQuestion question={question} onAnswer={onAnswer} />;
    default:
      return null;
  }
}

function AnswerButtons({ question, onAnswer }: { question: Question, onAnswer: (isCorrect: boolean) => void }) {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  return <section aria-label="Answer choices" >
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
      {
        question.choices.map((choice, i) => {
          const isCorrectButton = isCorrect === null ? null : choice.equiv(question.answer);

          return <button
            disabled={isCorrect !== null}
            key={i}
            {...stylex.props(styles.button, isCorrectButton === true ? styles.correctButton : isCorrectButton === false ? styles.incorrectButton : undefined)}
            onClick={() => {
              if (choice.equiv(question.answer)) {
                setIsCorrect(true);
              } else {
                setIsCorrect(false);
              }
            }}
          >
            {choice.toString()}
          </button>
        })
      }
    </div>
    {
      isCorrect !== null && (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
        <p style={{ marginTop: '1rem' }}>
          {isCorrect ? 'Correct!' : `Incorrect. The correct answer is ${question.answer.toString()}.`}
        </p>
        <button
          {...stylex.props(styles.button)}
          onClick={() => {
            setIsCorrect(null);
            onAnswer(isCorrect!);
          }}
        >
          Next Question
        </button>
      </div>)
    }
  </section>
}

function ModePatternQuestion({ question, onAnswer }: { question: Extract<Question, { type: 'mode-pattern' }>, onAnswer: (isCorrect: boolean) => void }) {
  const pattern = Pattern.modePatterns.get(question.answer)!(6);

  const fretSpan = pattern
    .fretSpan()
    .withLowerEndpoint(le => le - 1)
    .withUpperEndpoint(ue => ue + 1)
    .clamp();

  return <>
    <Fretboard fretSpan={fretSpan} xstyle={styles.fingeringPattern}>
      {pattern.fingerings.map((fingering, i) => {
        return <FretMarker
          key={i}
          fret={fingering.fretboardPosition.fret}
          string={fingering.fretboardPosition.string}
          label={fingering.finger.symbol('left')}
          fretStyle={styles.fretMarker}
        />;
      })}
    </Fretboard>
    <AnswerButtons question={question} onAnswer={onAnswer} />
  </>
}

function ModeFretQuestion({ question, onAnswer }: { question: Extract<Question, { type: 'mode-fret' }>, onAnswer: (isCorrect: boolean) => void }) {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  return <div style={{ display: 'grid', maxWidth: '1000px', width: '100%', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
    {
      question.choices.map((choice, i) => {
        const pattern = Pattern.modePatterns.get(choice)!(question.fret);
        const fretSpan = pattern
          .fretSpan()
          .withLowerEndpoint(le => le - 1)
          .withUpperEndpoint(ue => ue + 1)
          .clamp();

        const isCorrectButton = isCorrect === null ? null : choice.equiv(question.answer);

        return <button
          disabled={isCorrect !== null}
          key={i}
          {...stylex.props(styles.button, styles.fullHeight, styles.fullWidth, isCorrectButton === true ? styles.correctButton : isCorrectButton === false ? styles.incorrectButton : undefined)}
          onClick={() => {
            if (choice.equiv(question.answer)) {
              setIsCorrect(true);
            } else {
              setIsCorrect(false);
            }
          }}
        >
          <Fretboard fretSpan={fretSpan} xstyle={styles.fullWidth} showFretNumbers>
            {pattern.fingerings.map((fingering, j) => {
              return <FretMarker
                key={j}
                fret={fingering.fretboardPosition.fret}
                string={fingering.fretboardPosition.string}
                label={fingering.finger.symbol('left')}
                fretStyle={styles.fretMarker}
              />;
            })}
          </Fretboard>
        </button>
      })
    }
    {
      isCorrect !== null && (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginTop: '2rem', gridColumn: 'span 2' }}>
        <p style={{ marginTop: '1rem' }}>
          {isCorrect ? 'Correct!' : `Incorrect. The correct answer is ${question.answer.toString()}.`}
        </p>
        <button
          {...stylex.props(styles.button)}
          onClick={() => {
            setIsCorrect(null);
            onAnswer(isCorrect!);
          }}
        >
          Next Question
        </button>
      </div>)
    }
  </div>;
}

export const loader = entryPointRoute.loader;
export default entryPointRoute.Component;

export const links = () => [];

const styles = stylex.create({
  fullHeight: {
    height: '100%',
  },
  fullWidth: {
    width: '100%',
    maxHeight: '280px',
  },
  fullSpan: {
    gridColumn: 'span 2',
  },
  main: {
    inlineSize: '100%',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  fingeringPattern: {
    height: '400px'
  },
  quiz: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
  correctButton: {
    color: '#000000',
    borderColor: '#4CAF50',
    borderWidth: '2px',
    [':hover']: { 
      backgroundColor: '#f8f8f8'
    }
  },
  incorrectButton: {
    borderColor: '#F44336',
    borderWidth: '2px',
    backgroundColor: '#ECE6DE'
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
  h2: {
    userSelect: 'none',
    margin: 0,
    padding: 0,
  },
  p: {
    marginTop: '0.5rem',
    color: '#555',
    marginBottom: 0,
  },
  footer: {

  },
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
});
import { describe, test } from 'vitest';
import fc from 'fast-check';
import { MajorScale } from './MajorScale';
import { ModalScale } from './ModalScale';
import { Mode } from './Mode';
import { ScaleDegree } from './Scale';
import { Tuning } from './Tuning';
import { Spelling } from './Spelling';
import { NaturalPitchClass } from './NaturalPitchClass';
import { Accidental } from './Accidental';
import { Interval } from './Interval';
import { SortedSet } from '@thi.ng/sorted-map';
import { areDisjoint } from './EnharmonicEquivalence';
import { FretboardPosition, FRETS, STRINGS, type Fret, type StringNumber } from './Fretboard';
import { fail } from 'assert';
import { Pattern, type Fingering } from './Fingering';

export const allNaturalPitchClasses: NaturalPitchClass[] = NaturalPitchClass.all();

export function arbitraryDistinctNaturalPitchClasses(constraints: fc.SubarrayConstraints): fc.Arbitrary<NaturalPitchClass[]> {
  return fc.subarray(allNaturalPitchClasses, constraints);
}

export const arbitraryNaturalPitchClass: fc.Arbitrary<NaturalPitchClass> = fc.constantFrom(...allNaturalPitchClasses);

export const allAccidentals: Accidental[] = [
  Accidental.sharp(),
  Accidental.flat(),
  Accidental.natural(),
  Accidental.none()
]

export function arbitraryDistinctAccidentals(constraints: fc.SubarrayConstraints): fc.Arbitrary<Accidental[]> {
  return fc.subarray(allAccidentals, constraints);
}

export const arbitraryAccidental: fc.Arbitrary<Accidental> = fc.constantFrom(...allAccidentals);

export const allSpellings: Spelling[] = allNaturalPitchClasses.flatMap(natural =>
  allAccidentals.map(accidental => new Spelling(natural, accidental))
);

export function arbitraryDistinctSpellings(constraints: fc.SubarrayConstraints): fc.Arbitrary<Spelling[]> {
  return fc.subarray(allSpellings, constraints);
}

export const arbitrarySpelling: fc.Arbitrary<Spelling> = fc.constantFrom(...allSpellings);

export const allModes: Mode[] = Mode.all();

export function arbitraryDistinctModes(constraints: fc.SubarrayConstraints): fc.Arbitrary<Mode[]> {
  return fc.subarray(allModes, constraints);
}

export const arbitraryMode: fc.Arbitrary<Mode> = fc.constantFrom(...allModes);

export const allScaleDegrees: ScaleDegree[] = ScaleDegree.all();

export function arbitraryDistinctScaleDegrees(constraints: fc.SubarrayConstraints): fc.Arbitrary<ScaleDegree[]> {
  return fc.subarray(allScaleDegrees, constraints);
}

export const arbitraryScaleDegree: fc.Arbitrary<ScaleDegree> = fc.constantFrom(...allScaleDegrees);

export const allMajorScales: MajorScale[] = Array.from(MajorScale.standardScales.values());

export function arbitraryDistinctMajorScales(constraints: fc.SubarrayConstraints): fc.Arbitrary<MajorScale[]> {
  return fc.subarray(allMajorScales, constraints);
}

export const arbitraryMajorScale: fc.Arbitrary<MajorScale> = fc.constantFrom(...allMajorScales);

export const allModalScales: ModalScale[] = allMajorScales.flatMap(majorScale =>
  allModes.map(mode => new ModalScale(majorScale, mode))
);

export function arbitraryDistinctModalScales(constraints: fc.SubarrayConstraints): fc.Arbitrary<ModalScale[]> {
  return fc.subarray(allModalScales, constraints);
}

export const arbitraryModalScale: fc.Arbitrary<ModalScale> = fc.constantFrom(...allModalScales);

export const allTunings: Tuning[] = [
  Tuning.standard(),
];

export function arbitraryDistinctTunings(constraints: fc.SubarrayConstraints): fc.Arbitrary<Tuning[]> {
  return fc.subarray(allTunings, constraints);
}

export const arbitraryTuning: fc.Arbitrary<Tuning> = fc.constantFrom(...allTunings);

export const arbitraryEnharmonicEquivalentSpellings: fc.Arbitrary<[Spelling, Spelling]> = arbitrarySpelling
  .chain(spelling1 => arbitrarySpelling
    .filter(spelling2 => spelling1.enharmonicEquiv(spelling2))
    .map(spelling2 => [spelling1, spelling2] as [Spelling, Spelling])
  );

export const allFretboardPositions: FretboardPosition[] = STRINGS.flatMap((string) =>
  FRETS.map((fret) => new FretboardPosition(string, fret))
);

export function arbitraryDistinctFretboardPositions(constraints: fc.SubarrayConstraints): fc.Arbitrary<FretboardPosition[]> {
  return fc.subarray(allFretboardPositions, constraints);
}

export const arbitraryFretboardPosition: fc.Arbitrary<FretboardPosition> = fc.constantFrom(...allFretboardPositions);

export const arbitraryInterval: fc.Arbitrary<Interval> = fc.integer({ min: -24, max: 24 }).map(semitones => new Interval(semitones));

export const arbitraryString = fc.constantFrom(...STRINGS);

export type ArbitraryFretConstraints = { min?: Fret, max?: Fret };

export function arbitraryFret(constraints?: ArbitraryFretConstraints): fc.Arbitrary<Fret> {
  const min = constraints?.min ?? Math.min(...FRETS);
  const max = constraints?.max ?? Math.max(...FRETS);
  return fc.integer({ min, max });
}

export const arbitraryModeAndPattern = arbitraryMode.chain(mode =>
  arbitraryFret({ min: 1, max: 15 }).map(from => ({
    mode,
    from,
    pattern: Pattern.modePatterns.get(mode)!(from),
  }))
);

function fingeringsOnString(pattern: Pattern, string: StringNumber): Fingering[] {
  return pattern.fingerings
    .filter(f => f.fretboardPosition.string === string)
    .sort((a, b) => a.fretboardPosition.fret - b.fretboardPosition.fret);
}
 
function modalScaleForPattern(
  tuning: Tuning,
  mode: Mode,
  from: number,
): ModalScale {
  const tonicSpellings = tuning.spellings(new FretboardPosition(6, from));
  return tonicSpellings
    .map(tonic => ModalScale.fromTonic(tonic, mode, tuning))
    .find(Boolean)!;
}

const FINGER_ORDER: Record<string, number> = {
  Thumb: 0,
  Index: 1,
  Middle: 2,
  Ring: 3,
  Pinky: 4,
};

describe('Music Theory Properties', () => {
  test('Property 1: Modal scales are composed of the same set of spellings as their parent scale', () => {
    fc.assert(fc.property(
      arbitraryMajorScale,
      arbitraryMode,
      (parentScale, mode) => {
        const modalScale = new ModalScale(parentScale, mode);
        const degreeSpellings = Array.from(modalScale.degrees.values());
        const pitchClassSet = new SortedSet(degreeSpellings);
        const expected = new SortedSet(parentScale.degrees.values());
        return !areDisjoint(pitchClassSet, expected);
      }
    ), { numRuns: 50 });
  });

  test('Property 2: All diatonic scales have exactly 7 degrees', () => {
    fc.assert(fc.property(
      arbitraryMajorScale,
      arbitraryMode,
      (parentScale, mode) => {
        const modalScale = new ModalScale(parentScale, mode);
        return modalScale.degrees.size === 7;
      }
    ), { numRuns: 50 });
  });

  test('Property 3: Enharmonic equivalence is symmetric and transitive', () => {
    fc.assert(fc.property(
      arbitrarySpelling,
      arbitrarySpelling,
      arbitrarySpelling,
      (a, b, c) => {
        // Symmetric: if a ≡ b, then b ≡ a
        const aEquivB = a.enharmonicEquiv(b);
        const bEquivA = b.enharmonicEquiv(a);
        const symmetric = aEquivB === bEquivA;
        
        // Transitive: if a ≡ b and b ≡ c, then a ≡ c
        let transitive = true;
        if (a.enharmonicEquiv(b) && b.enharmonicEquiv(c)) {
          transitive = a.enharmonicEquiv(c);
        }
        
        return symmetric && transitive;
      }
    ), { numRuns: 100 });
  }); 

  test('Property 4: Interval addition is commutative and associative', () => {
    fc.assert(fc.property(
      fc.integer({ min: -24, max: 24 }),
      fc.integer({ min: -24, max: 24 }),
      fc.integer({ min: -24, max: 24 }),
      (a, b, c) => {
        const intervalA = new Interval(a);
        const intervalB = new Interval(b);
        const intervalC = new Interval(c);
        
        // Commutativity: a + b = b + a
        const sum1 = intervalA.add(intervalB);
        const sum2 = intervalB.add(intervalA);
        const commutative = sum1.equiv(sum2);
        
        // Associativity: (a + b) + c = a + (b + c)
        const assoc1 = intervalA.add(intervalB).add(intervalC);
        const assoc2 = intervalA.add(intervalB.add(intervalC));
        const associative = assoc1.equiv(assoc2);
        
        return commutative && associative;
      }
      ), { numRuns: 100 })}); 

    test('Property 4a: Interval subtraction consistency with addition and negation', () => {
      fc.assert(fc.property(
        arbitraryInterval,
        arbitraryInterval,
        (a, b) => {
          // a - b = a + (-b)
          const subtraction = a.subtract(b);
          const additionWithNegation = a.add(b.negate());
          return subtraction.equiv(additionWithNegation);
        }
      ), { numRuns: 100 });
    });

    test('Property 4b: Interval identity properties with perfect unison', () => {
      fc.assert(fc.property(
        arbitraryInterval,
        (interval) => {
          const unison = Interval.perfectUnison();
          // Adding unison preserves the interval
          const withUnison = interval.add(unison);
          // Subtracting unison preserves the interval
          const minusUnison = interval.subtract(unison);
          return withUnison.equiv(interval) && minusUnison.equiv(interval);
        }
      ), { numRuns: 50 });
    });

    test('Property 4c: Interval double negation', () => {
      fc.assert(fc.property(
        arbitraryInterval,
        (interval) => {
          // -(-a) = a
          const doubleNegated = interval.negate().negate();
          return doubleNegated.equiv(interval);
        }
      ), { numRuns: 50 });
    });

    test('Property 4d: moduloOctave idempotence', () => {
      fc.assert(fc.property(
        arbitraryInterval,
        (interval) => {
          // moduloOctave(moduloOctave(x)) = moduloOctave(x)
          const firstModulo = interval.moduloOctave();
          const secondModulo = firstModulo.moduloOctave();
          return firstModulo.equiv(secondModulo);
        }
      ), { numRuns: 50 });
    });

    test('Property 7: Natural pitch class successor/predecessor are inverses', () => {
      fc.assert(fc.property(
        arbitraryNaturalPitchClass,
        (naturalClass) => {
          const successor = naturalClass.successor();
          const predecessor = naturalClass.predecessor();
          return successor.predecessor().equiv(naturalClass) && predecessor.successor().equiv(naturalClass);
        }
      ), { numRuns: 50 });
    });

    test('Property 7a: Mode successor/predecessor are inverses', () => {
      fc.assert(fc.property(
        arbitraryMode,
        (mode) => {
          const successor = mode.successor();
          const predecessor = mode.predecessor();
          return successor.predecessor().equiv(mode) && predecessor.successor().equiv(mode);
        }
      ), { numRuns: 50 });
    });

    test('Property 7b: Mode cyclic ordering (7 successors returns to start)', () => {
      fc.assert(fc.property(
        arbitraryMode,
        (mode) => {
          let current = mode;
          for (let i = 0; i < 7; i++) {
            current = current.successor();
          }
          return current.equiv(mode);
        }
      ), { numRuns: 50 });
    });

    test("Property 8: The tonic of the nth mode of a major scale is the nth degree of that scale", () => {
      fc.assert(fc.property(
        arbitraryMajorScale,
        arbitraryMode,
        (majorScale, mode) => {
          const modalScale = new ModalScale(majorScale, mode);
          const expectedTonic = majorScale.degrees.get(mode.toDegreeOfParentScale())!;
          return modalScale.tonic.enharmonicEquiv(expectedTonic);
        }
      ), { numRuns: 50 });
    });

    test("Property 9: The interval pattern of the nth mode is a rotation of the major scale's interval pattern", () => {
      fc.assert(fc.property(
        arbitraryMajorScale,
        arbitraryMode,
        (majorScale, mode) => {
          const modalScale = new ModalScale(majorScale, mode);

          const modalIntervals = Array.from(modalScale.degrees.entries()).map(([_, spelling]) =>
            spelling.intervalFromOctaveStart().semitones
          );

          const majorIntervals = Array.from(majorScale.degrees.entries()).map(([_, spelling]) =>
            spelling.intervalFromOctaveStart().semitones
          );
          
          const rotation = mode.toDegreeOfParentScale().toOrdinal() - 1;
          const rotatedMajorIntervals = majorIntervals.slice(rotation).concat(majorIntervals.slice(0, rotation));
          
          return modalIntervals.every((interval, index) => interval === rotatedMajorIntervals[index]);
        }
      ), { numRuns: 50 });
    });

    test("Property 10: RelativePitch add(Interval) is consistent with intervalTo and intervalFrom", () => {
      fc.assert(fc.property(
        arbitraryTuning,
        arbitraryFretboardPosition,
        arbitraryInterval,
        (tuning, position, interval) => {
          const relativePitch = tuning.relativePitch(position);
          const addedPitch = relativePitch.add(interval);
          const intervalToAdded = relativePitch.intervalTo(addedPitch);
          const intervalFromAdded = addedPitch.intervalFrom(relativePitch);
          
          return intervalToAdded.equiv(interval) && intervalFromAdded.equiv(interval);
        }
      ), { numRuns: 50 });
    });

    test("Property 11: All spellings of a given relative pitch are enharmonically equivalent", () => {
      fc.assert(fc.property(
        arbitraryTuning,
        arbitraryFretboardPosition,
        (tuning, position) => {
          const spellings = tuning.spellings(position);
          
          for (let i = 0; i < spellings.length; i++) {
            for (let j = i + 1; j < spellings.length; j++) {
              if (!spellings[i].enharmonicEquiv(spellings[j])) {
                fail(`Spellings ${spellings[i].toString()} and ${spellings[j].toString()} are not enharmonically equivalent`);
              }
            }
          }
          
          return true;
        }
      ), { numRuns: 50 });
    });

    test("Property 11a: Accidental-to-interval conversion consistency", () => {
      fc.assert(fc.property(
        arbitraryAccidental,
        (accidental) => {
          const interval = accidental.toInterval();
          // Verify interval is within expected range for accidentals
          return interval.semitones >= -1 && interval.semitones <= 1;
        }
      ), { numRuns: 50 });
    });
});

describe('Tuning Properties', () => {
  test('Property 11: Round-trip consistency between fretboard positions and relative pitches', () => {
    fc.assert(fc.property(
      arbitraryTuning,
      arbitraryFretboardPosition,
      (tuning, position) => {
        const relativePitch = tuning.relativePitch(position);
        const positions = tuning.fretboardPositions(relativePitch);
        return positions.some(p => p.equiv(position));
      }
    ), { numRuns: 100 });
  });

  test('Property 12: Every fretboard position has valid spellings', () => {
    fc.assert(fc.property(
      arbitraryTuning,
      arbitraryFretboardPosition,
      (tuning, position) => {
        const relativePitch = tuning.relativePitch(position);
        const spellingsFromPosition = tuning.spellings(position);
        const spellingsFromPitch = relativePitch.spellings();
        
        return spellingsFromPosition.length > 0 && spellingsFromPitch.length > 0;
      }
    ), { numRuns: 100 });
  });

  test('Property 13: Spelling-to-fretboard-position round-trip consistency', () => {
    fc.assert(fc.property(
      arbitraryTuning,
      arbitrarySpelling,
      (tuning, spelling) => {
        const positions = tuning.fretboardPositions(spelling);
        return positions.every(position => {
          const backToSpellings = tuning.spellings(position);
          return backToSpellings.every(s => s.enharmonicEquiv(spelling));
        });
      }
    ), { numRuns: 100 });
  });

  test('Property 14: Overloaded spellings methods are consistent', () => {
    fc.assert(fc.property(
      arbitraryTuning,
      arbitraryFretboardPosition,
      (tuning, position) => {
        const relativePitch = tuning.relativePitch(position);
        const spellingsFromPosition = tuning.spellings(position);
        const spellingsFromRelativePitch = tuning.spellings(relativePitch);
        
        return spellingsFromPosition.every(s1 => 
          spellingsFromRelativePitch.some(s2 => s1.equiv(s2))
        );
      }
    ), { numRuns: 100 });
  });

  test('Property 15: Overloaded fretboardPositions methods are consistent', () => {
    fc.assert(fc.property(
      arbitraryTuning,
      arbitraryFretboardPosition,
      (tuning, position) => {
        const relativePitch = tuning.relativePitch(position);
        const positionsFromRelativePitch = tuning.fretboardPositions(relativePitch);

        return positionsFromRelativePitch.some(p => p.equiv(position));
      }
    ), { numRuns: 100 });
  });

  test('Property 16: Valid fretboard positions always have relative pitches', () => {
    fc.assert(fc.property(
      arbitraryTuning,
      arbitraryFretboardPosition,
      (tuning, position) => {
        const relativePitch = tuning.relativePitch(position);
        return relativePitch !== null && relativePitch !== undefined;
      }
    ), { numRuns: 100 });
  });

  test('Property 17: Relative pitches always have some fretboard positions', () => {
    fc.assert(fc.property(
      arbitraryTuning,
      arbitraryFretboardPosition,
      (tuning, position) => {
        const relativePitch = tuning.relativePitch(position);
        const positions = tuning.fretboardPositions(relativePitch);
        return positions.length > 0;
      }
    ), { numRuns: 100 });
  });

  test('Property 18: Enharmonic spellings map to same relative pitch', () => {
    fc.assert(fc.property(
      arbitraryTuning,
      arbitraryEnharmonicEquivalentSpellings,
      (tuning, [spelling1, spelling2]) => {
        const relativePitches1 = tuning.relativePitches(spelling1);
        const relativePitches2 = tuning.relativePitches(spelling2);
        
        return relativePitches1.every(rp1 =>
          relativePitches2.some(rp2 => rp1.equiv(rp2))
        ) && relativePitches2.every(rp2 =>
          relativePitches1.some(rp1 => rp1.equiv(rp2))
        );
      }
    ), { numRuns: 50 });
  });

  test('Property 19: Spelling consistency across fretboard positions', () => {
    fc.assert(fc.property(
      arbitraryTuning,
      arbitrarySpelling,
      (tuning, spelling) => {
        const positions = tuning.fretboardPositions(spelling);
        
        return positions.every(position => {
          const spellingsAtPosition = tuning.spellings(position);
          return spellingsAtPosition.some(s => s.enharmonicEquiv(spelling));
        });
      }
    ), { numRuns: 100 });
  });

  test('Property 20: Fret progression increases relative pitch', () => {
    fc.assert(fc.property(
      arbitraryTuning,
      fc.constantFrom(...STRINGS),
      fc.integer({ min: 0, max: 15 }),
      (tuning, string, fret) => {
        const currentPosition = new FretboardPosition(string, fret);
        const nextPosition = new FretboardPosition(string, fret + 1);
        
        const currentPitch = tuning.relativePitch(currentPosition);
        const nextPitch = tuning.relativePitch(nextPosition);
        
        const intervalDifference = nextPitch.intervalFromMiddleC.subtract(currentPitch.intervalFromMiddleC);
        return intervalDifference.semitones === 1;
      }
    ), { numRuns: 100 });
  });

  test('Property 21: String progression increases relative pitch by open string interval', () => {
    fc.assert(fc.property(
      arbitraryTuning,
      arbitraryString.filter((string) => string < STRINGS.length - 1),
      arbitraryFret(),
      (tuning, string, fret) => {
        const currentPosition = new FretboardPosition(string, fret);
        const nextString = string + 1 as StringNumber;
        const nextPosition = new FretboardPosition(nextString, fret);
        
        const currentPitch = tuning.relativePitch(currentPosition);
        const nextPitch = tuning.relativePitch(nextPosition);
        
        const intervalDifference = nextPitch.intervalFromMiddleC.subtract(currentPitch.intervalFromMiddleC);
        const openStringInterval = tuning.relativePitch(new FretboardPosition(nextString, 0)).intervalFromMiddleC.subtract(
          tuning.relativePitch(new FretboardPosition(string, 0)).intervalFromMiddleC
        );

        return intervalDifference.equiv(openStringInterval);
      }
    ), { numRuns: 100 });
  });
});


describe('Implementation Properties', () => {
  test('Property 1: Accidental perfect hash', () => {
    fc.assert(fc.property(
      arbitraryAccidental,
      arbitraryAccidental,
      (acc1, acc2) => {
        const hash1 = acc1.hash();
        const hash2 = acc2.hash();
        if (acc1.equiv(acc2)) {
          return hash1 === hash2;
        } else {
          return hash1 !== hash2;
        }
      }
    ), { numRuns: 100 });
  });

  test('Property 2: Natural pitch class perfect hash', () => {
    fc.assert(fc.property(
      arbitraryNaturalPitchClass,
      arbitraryNaturalPitchClass,
      (npc1, npc2) => {
        const hash1 = npc1.hash();
        const hash2 = npc2.hash();
        if (npc1.equiv(npc2)) {
          return hash1 === hash2;
        } else {
          return hash1 !== hash2;
        }
      }
    ), { numRuns: 100 });
  });

  test('Property 3: Spelling perfect hash', () => {
    fc.assert(fc.property(
      arbitrarySpelling,
      arbitrarySpelling,
      (sp1, sp2) => {
        const hash1 = sp1.hash();
        const hash2 = sp2.hash();
        if (sp1.equiv(sp2)) {
          return hash1 === hash2;
        } else {
          return hash1 !== hash2;
        }
      }
    ), { numRuns: 100 });
  });

  // parentScale = arbitraryMajorScale
  // mode = arbitraryMode
  // modalScale = new ModalScale(parentScale, mode)
  // assert(ModalScale.fromTonic(modalScale.tonic, mode) === modalScale)
  test('Property 4: ModalScale.fromTonic is consistent with ModalScale constructor', () => {
    fc.assert(fc.property(
      arbitraryMajorScale,
      arbitraryMode,
      (parentScale, mode) => {
        const modalScale = new ModalScale(parentScale, mode);
        const fromTonic = ModalScale.fromTonic(modalScale.tonic, mode, parentScale.tuning)!;
        
        if (!modalScale.tonic.enharmonicEquiv(fromTonic.tonic)) {
          fail(`ModalScale.fromTonic produced a different modal scale than the constructor: ${modalScale.name} vs ${fromTonic.name}`);
        }

        return modalScale.tonic.enharmonicEquiv(fromTonic.tonic);
      }
    ), { numRuns: 50 });
  });
});

describe('Fingering Pattern — note correctness', () => {
  test('Property 1: Every position in the pattern belongs to the modal scale', () => {
    fc.assert(fc.property(
      arbitraryTuning,
      arbitraryMode,
      arbitraryFret({ min: 1, max: 13 }),
      (tuning, mode, from) => {
        const pattern = Pattern.modePatterns.get(mode)!(from);
        const modalScale = modalScaleForPattern(tuning, mode, from);

        return pattern.fingerings.every(fingering => {
          const spellings = tuning.spellings(fingering.fretboardPosition);
          return spellings.some(sp => 
            Array.from(modalScale.degrees.values()).some(scaleSp => sp.equiv(scaleSp))
          );
        });
      }
    ), { numRuns: 50 });
  });

  test('Property 2: The pattern covers all 7 scale degrees', () => {
    fc.assert(fc.property(
      arbitraryTuning,
      arbitraryMode,
      arbitraryFret({ min: 1, max: 13 }),
      (tuning, mode, from) => {
        const pattern = Pattern.modePatterns.get(mode)!(from);
        const modalScale = modalScaleForPattern(tuning, mode, from);
        const scaleSpellings = Array.from(modalScale.degrees.values());
 
        return scaleSpellings.every(scaleSp =>
          pattern.fingerings.some(fingering => {
            const spellings = tuning.spellings(fingering.fretboardPosition);
            return spellings.some(sp => sp.enharmonicEquiv(scaleSp));
          })
        );
      }
    ), { numRuns: 50 });
  });

  test('Property 3: Notes on each string ascend in pitch from low to high fret', () => {
    fc.assert(fc.property(
      arbitraryTuning,
      arbitraryMode,
      arbitraryFret({ min: 1, max: 13 }),
      (tuning, mode, from) => {
        const pattern = Pattern.modePatterns.get(mode)!(from);
 
        for (const string of STRINGS) {
          const fs = fingeringsOnString(pattern, string as StringNumber);
          for (let i = 0; i < fs.length - 1; i++) {
            const pitch1 = tuning.relativePitch(fs[i].fretboardPosition);
            const pitch2 = tuning.relativePitch(fs[i + 1].fretboardPosition);
            if (
              pitch1.intervalFromMiddleC.semitones
              >= pitch2.intervalFromMiddleC.semitones
            ) return false;
          }
        }
        return true;
      }
    ), { numRuns: 50 });
  });

  test('Property 4: Consecutive notes within a string are a half or whole step apart', () => {
    fc.assert(fc.property(
      arbitraryTuning,
      arbitraryMode,
      arbitraryFret({ min: 1, max: 13 }),
      (tuning, mode, from) => {
        const pattern = Pattern.modePatterns.get(mode)!(from);
 
        for (const string of STRINGS) {
          const fs = fingeringsOnString(pattern, string as StringNumber);
          for (let i = 0; i < fs.length - 1; i++) {
            const pitch1 = tuning.relativePitch(fs[i].fretboardPosition);
            const pitch2 = tuning.relativePitch(fs[i + 1].fretboardPosition);
            const gap =
              pitch2.intervalFromMiddleC.semitones
              - pitch1.intervalFromMiddleC.semitones;
            if (gap < 1 || gap > 2) return false;
          }
        }
        return true;
      }
    ), { numRuns: 50 });
  });
});
 
describe('Fingering Pattern — ergonomics', () => {
  test('Property 5: fretSpan() is non-negative', () => {
    fc.assert(fc.property(
      arbitraryModeAndPattern,
      ({ pattern }) => pattern.fretSpan() >= 0,
    ), { numRuns: 50 });
  });
 
  test('Property 6: fretSpan() is at most 4 frets', () => {
    fc.assert(fc.property(
      arbitraryModeAndPattern,
      ({ pattern }) => Math.abs(pattern.fretSpan()) <= 4,
    ), { numRuns: 50 });
  });
  
  test('Property 8: Every string is covered', () => {
    fc.assert(fc.property(
      arbitraryModeAndPattern,
      ({ pattern }) => {
        const usedStrings = new Set(
          pattern.fingerings.map(f => f.fretboardPosition.string)
        );
        return STRINGS.every(s => usedStrings.has(s));
      },
    ), { numRuns: 50 });
  });
 
  test('Property 9: All fret positions are on the neck (fret ≥ 0)', () => {
    fc.assert(fc.property(
      arbitraryModeAndPattern,
      ({ pattern }) => pattern.fingerings.every(f => f.fretboardPosition.fret >= 0),
    ), { numRuns: 50 });
  });
});

describe('Fingering Pattern — finger assignments', () => {
  test('Property 10: Fingers respect anatomical order within each string', () => {
    fc.assert(fc.property(
      arbitraryModalScale,
      arbitraryFret({ min: 1 }),
      (modalScale, from) => {
        const pattern = modalScale.pattern(from);
 
        for (const string of STRINGS) {
          const fs = fingeringsOnString(pattern, string as StringNumber);
          for (let i = 0; i < fs.length - 1; i++) {
            const o1 = FINGER_ORDER[fs[i].finger.name];
            const o2 = FINGER_ORDER[fs[i + 1].finger.name];
            if (o1 >= o2) return false;
          }
        }
        return true;
      }
    ), { numRuns: 50 });
  });
 
  test('Property 11: No finger is used twice on the same string', () => {
    fc.assert(fc.property(
      arbitraryModalScale,
      arbitraryFret({ min: 1 }),
      (modalScale, from) => {
        const pattern = modalScale.pattern(from);
 
        for (const string of STRINGS) {
          const fingers = pattern.fingerings
            .filter(f => f.fretboardPosition.string === string)
            .map(f => f.finger.name);
          if (new Set(fingers).size !== fingers.length) return false;
        }
        return true;
      }
    ), { numRuns: 50 });
  });
 
});
 
describe('Fingering Pattern — map completeness', () => { 
  test('Property 13: Patterns are consistent across enharmonically equivalent modal scales', () => {
    fc.assert(fc.property(
      arbitraryMode,
      arbitraryMajorScale,
      arbitraryMajorScale,
      arbitraryFret({ min: 1 }),
      (mode, parentA, parentB, from) => {
        const scaleA = new ModalScale(parentA, mode);
        const scaleB = new ModalScale(parentB, mode);
 
        if (!parentA.equiv(parentB)) return true;
 
        const patA = scaleA.pattern(from);
        const patB = scaleB.pattern(from);
 
        return patA.fingerings.every((fA, i) => {
          const fB = patB.fingerings[i];
          return (
            fA.fretboardPosition.string === fB.fretboardPosition.string &&
            fA.fretboardPosition.fret   === fB.fretboardPosition.fret   &&
            fA.finger.equiv(fB.finger)
          );
        });
      }
    ), { numRuns: 50 });
  });
 
  test('Property 14: fretboardPositions() returns the same set as fingerings', () => {
    fc.assert(fc.property(
      arbitraryModalScale,
      arbitraryFret({ min: 1 }),
      (modalScale, from) => {
        const pattern = modalScale.pattern(from);
        const fromFingerings = pattern.fingerings.map(f => f.fretboardPosition);
        const fromSet = pattern.fretboardPositions();
 
        return fromFingerings.every(pos =>
          Array.from(fromSet).some(p => p.equiv(pos))
        );
      }
    ), { numRuns: 50 });
  });

});

describe('Cross-Module Consistency Properties', () => {
  test('Property 1: RelativePitch octave calculation consistency', () => {
    fc.assert(fc.property(
      arbitraryTuning,
      arbitraryFretboardPosition,
      (tuning, position) => {
        const relativePitch = tuning.relativePitch(position);
        const octaveFromMethod = relativePitch.octave();
        const octaveFromInterval = Math.floor(relativePitch.intervalFromMiddleC.semitones / 12);
        
        return octaveFromMethod === octaveFromInterval;
      }
    ), { numRuns: 50 });
  });

  test('Property 2: Alternative interval calculation methods agree', () => {
    fc.assert(fc.property(
      arbitraryTuning,
      arbitraryFretboardPosition,
      arbitraryFretboardPosition,
      (tuning, position1, position2) => {
        const pitch1 = tuning.relativePitch(position1);
        const pitch2 = tuning.relativePitch(position2);
        
        const directInterval = pitch1.intervalTo(pitch2);
        const reverseInterval = pitch2.intervalFrom(pitch1);
        
        return directInterval.equiv(reverseInterval);
      }
    ), { numRuns: 50 });
  });

  test('Property 3: Spelling intervalFromOctaveStart consistency', () => {
    fc.assert(fc.property(
      arbitrarySpelling,
      (spelling) => {
        const naturalInterval = spelling.naturalPitchClass.intervalFromOctaveStart();
        const accidentalInterval = spelling.accidental.toInterval();
        const expectedInterval = naturalInterval.add(accidentalInterval);
        const actualInterval = spelling.intervalFromOctaveStart();
        
        return expectedInterval.equiv(actualInterval);
      }
    ), { numRuns: 100 });
  });

  test('Property 4: Cross-module enharmonic equivalence consistency', () => {
    fc.assert(fc.property(
      arbitraryTuning,
      arbitraryEnharmonicEquivalentSpellings,
      (tuning, [spelling1, spelling2]) => {
        const positions1 = tuning.fretboardPositions(spelling1);
        const positions2 = tuning.fretboardPositions(spelling2);
        
        const pitches1 = positions1.map(pos => tuning.relativePitch(pos));
        const pitches2 = positions2.map(pos => tuning.relativePitch(pos));
        
        return pitches1.every(p1 => 
          pitches2.some(p2 => p1.equiv(p2))
        ) && pitches2.every(p2 => 
          pitches1.some(p1 => p1.equiv(p2))
        );
      }
    ), { numRuns: 50 });
  });
});

describe('Spelling Simplification Properties', () => {
  test('Property 1: Spelling.simplify returns subset of input', () => {
    fc.assert(fc.property(
      arbitraryDistinctSpellings({ minLength: 1, maxLength: 5 }),
      (spellings) => {
        const simplified = Spelling.simplify(spellings);
        
        return simplified.every(simplified => 
          spellings.some(original => original.equiv(simplified))
        ) && simplified.length <= spellings.length;
      }
    ), { numRuns: 50 });
  });
});

describe('Edge Case and Boundary Properties', () => {
  test('Property 1: Extreme interval handling', () => {
    fc.assert(fc.property(
      fc.integer({ min: -120, max: 120 }),
      (seminotes) => {
        const interval = new Interval(seminotes);
        const modulo = interval.moduloOctave();
        
        return modulo.semitones >= 0 && modulo.semitones < 12;
      }
    ), { numRuns: 100 });
  });

  test('Property 2: Fretboard boundary validation', () => {
    fc.assert(fc.property(
      arbitraryTuning,
      arbitraryString,
      (tuning, string) => {
        const validFrets = FRETS.filter(fret => {
          const position = new FretboardPosition(string, fret);
          try {
            const pitch = tuning.relativePitch(position);
            return pitch !== null && pitch !== undefined;
          } catch {
            return false;
          }
        });
        
        return validFrets.length === FRETS.length;
      }
    ), { numRuns: 50 });
  });

  test('Property 3: Scale degree arithmetic consistency', () => {
    fc.assert(fc.property(
      arbitraryScaleDegree,
      fc.integer({ min: 1, max: 21 }),
      (degree, steps) => {
        let current = degree;
        
        for (let i = 0; i < steps; i++) {
          current = current.successor();
        }
        
        for (let i = 0; i < steps; i++) {
          current = current.predecessor();
        }
        
        return current.equiv(degree);
      }
    ), { numRuns: 50 });
  });

  test('Property 4: Mode arithmetic consistency', () => {
    fc.assert(fc.property(
      arbitraryMode,
      fc.integer({ min: 1, max: 21 }),
      (mode, steps) => {
        let current = mode;
        
        for (let i = 0; i < steps; i++) {
          current = current.successor();
        }
        
        for (let i = 0; i < steps; i++) {
          current = current.predecessor();
        }
        
        return current.equiv(mode);
      }
    ), { numRuns: 50 });
  });
});

describe('Performance and Ergonomic Properties', () => {
  test('Property 1: Fingering patterns respect hand span limitations', () => {
    fc.assert(fc.property(
      arbitraryModeAndPattern,
      ({ pattern }) => {
        for (const string of STRINGS) {
          const fingeringsOnString = pattern.fingerings
            .filter(f => f.fretboardPosition.string === string)
            .sort((a, b) => a.fretboardPosition.fret - b.fretboardPosition.fret);
          
          for (let i = 0; i < fingeringsOnString.length - 1; i++) {
            const fret1 = fingeringsOnString[i].fretboardPosition.fret;
            const fret2 = fingeringsOnString[i + 1].fretboardPosition.fret;
            const finger1 = fingeringsOnString[i].finger.name;
            const finger2 = fingeringsOnString[i + 1].finger.name;
            
            if (fret2 > fret1) {
              const order1 = FINGER_ORDER[finger1];
              const order2 = FINGER_ORDER[finger2];
              
              if (fret2 - fret1 > 2 && order2 < order1) {
                return false;
              }
            }
          }
        }
        
        return true;
      }
    ), { numRuns: 30 });
  });
});

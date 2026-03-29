import type { ICompare, IEquiv } from "@thi.ng/api";
import { Interval } from "./Interval";
import { Spelling } from "./Spelling";
import { Accidental } from "./Accidental";
import { NaturalPitchClass } from "./NaturalPitchClass";

export class RelativePitch implements ICompare<RelativePitch>, IEquiv {
  public readonly intervalFromMiddleC: Interval;

  public constructor(intervalFromMiddleC: Interval) {
    this.intervalFromMiddleC = intervalFromMiddleC;
  }

  public add(interval: Interval): RelativePitch {
    return new RelativePitch(this.intervalFromMiddleC.add(interval));
  }

  public compare(other: RelativePitch): number {
    return this.intervalFromMiddleC.semitones - other.intervalFromMiddleC.semitones;
  }

  public equiv(other: unknown): boolean {
    return other instanceof RelativePitch && this.intervalFromMiddleC.equiv(other.intervalFromMiddleC);
  }

  public intervalFromOctaveStart(): Interval {
    return this.intervalFromMiddleC.moduloOctave();
  }

  public octave(): number {
    return Math.floor(this.intervalFromMiddleC.semitones / 12);
  }

  public intervalTo(other: RelativePitch): Interval {
    return new Interval(other.intervalFromMiddleC.semitones - this.intervalFromMiddleC.semitones);
  }

  public intervalFrom(other: RelativePitch): Interval {
    return new Interval(this.intervalFromMiddleC.semitones - other.intervalFromMiddleC.semitones);
  }

  public spellings(): Spelling[] {
    const targetInterval = this.intervalFromOctaveStart();
    const spellings: Spelling[] = [];
    
    for (const naturalPitchClass of NaturalPitchClass.all()) {
      const naturalInterval = naturalPitchClass.intervalFromOctaveStart();
      if (naturalInterval.moduloOctave().equiv(targetInterval.moduloOctave())) {
        spellings.push(new Spelling(naturalPitchClass));
      }
      
      const sharpInterval = naturalInterval.add(Accidental.sharp().toInterval());
      if (sharpInterval.moduloOctave().equiv(targetInterval.moduloOctave())) {
        spellings.push(new Spelling(naturalPitchClass, Accidental.sharp()));
      }
      
      const flatInterval = naturalInterval.add(Accidental.flat().toInterval());
      if (flatInterval.moduloOctave().equiv(targetInterval.moduloOctave())) {
        spellings.push(new Spelling(naturalPitchClass, Accidental.flat()));
      }
    }
    
    return spellings;
  }
}
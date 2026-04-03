import type { ICompare, IEquiv } from "@thi.ng/api";
import type { Tuning } from "./Tuning";
import type { Fret, FretboardPosition, StringNumber } from "./Fretboard";
import type { Spelling } from "./Spelling";
import type { RelativePitch } from "./RelativePitch";
import type { SortedMap, SortedSet } from "@thi.ng/sorted-map";
import type { Pattern } from "./Fingering";
import { Arbitrary } from "./Arbitrary";

type ScaleDegreeName
  = 'Tonic'
  | 'Supertonic'
  | 'Mediant'
  | 'Subdominant'
  | 'Dominant'
  | 'Submediant'
  | 'Leading Tone';

export class ScaleDegree implements ICompare<ScaleDegree>, IEquiv {
  public readonly name: ScaleDegreeName;

  public constructor(name: ScaleDegreeName) {
    this.name = name;
  }
  
  compare(x: ScaleDegree): number {
    return this.toOrdinal() - x.toOrdinal();
  }

  public equiv(other: unknown): boolean {
    return other instanceof ScaleDegree && this.name === other.name;
  }

  public toOrdinal(): number {
    switch (this.name) {
      case 'Tonic': return 1;
      case 'Supertonic': return 2;
      case 'Mediant': return 3;
      case 'Subdominant': return 4;
      case 'Dominant': return 5;
      case 'Submediant': return 6;
      case 'Leading Tone': return 7;
    }
  }

  public static fromOrdinal(ordinal: number): ScaleDegree {
    switch (ordinal) {
      case 1: return ScaleDegree.tonic();
      case 2: return ScaleDegree.supertonic();
      case 3: return ScaleDegree.mediant();
      case 4: return ScaleDegree.subdominant();
      case 5: return ScaleDegree.dominant();
      case 6: return ScaleDegree.submediant();
      case 7: return ScaleDegree.leadingTone();
      default:
        throw new Error(`Invalid scale degree ordinal: ${ordinal}`);
    }
  }

  public successor(): ScaleDegree {
    const nextOrdinal = (this.toOrdinal() % 7) + 1;
    return ScaleDegree.fromOrdinal(nextOrdinal);
  }

  public predecessor(): ScaleDegree {
    const prevOrdinal = ((this.toOrdinal() + 5) % 7) + 1;
    return ScaleDegree.fromOrdinal(prevOrdinal);
  }

  public toString() {
    return this.name;
  }

  public toOrdinalString(): string {
    switch (this.name) {
      case 'Tonic': return '1st';
      case 'Supertonic': return '2nd';
      case 'Mediant': return '3rd';
      default: return `${this.toOrdinal()}th`;
    }
  }

  public static all(): ScaleDegree[] {
    return [
      ScaleDegree.tonic(),
      ScaleDegree.supertonic(),
      ScaleDegree.mediant(),
      ScaleDegree.subdominant(),
      ScaleDegree.dominant(),
      ScaleDegree.submediant(),
      ScaleDegree.leadingTone()
    ];
  }

  public static random(not?: SortedSet<ScaleDegree>): ScaleDegree {
    return Arbitrary.choice(ScaleDegree.all(), not);
  }
  
  public static tonic(): ScaleDegree {
    return new ScaleDegree('Tonic');
  }

  public static supertonic(): ScaleDegree {
    return new ScaleDegree('Supertonic');
  }

  public static mediant(): ScaleDegree {
    return new ScaleDegree('Mediant');
  }

  public static subdominant(): ScaleDegree {
    return new ScaleDegree('Subdominant');
  }

  public static dominant(): ScaleDegree {
    return new ScaleDegree('Dominant');
  }

  public static submediant(): ScaleDegree {
    return new ScaleDegree('Submediant');
  }

  public static leadingTone(): ScaleDegree {
    return new ScaleDegree('Leading Tone');
  }

  public static subtonic(): ScaleDegree {
    return new ScaleDegree('Leading Tone');
  }
}

export class Note implements ICompare<Note>, IEquiv {
  public readonly tuning: Tuning;
  public readonly fretboardPosition: FretboardPosition;
  public readonly spelling?: Spelling;

  public constructor(tuning: Tuning, fretboardPosition: FretboardPosition, spelling?: Spelling) {
    this.tuning = tuning;
    this.fretboardPosition = fretboardPosition;
    this.spelling = spelling;
  }

  public toString(): string {
    return JSON.stringify({
      fretboardPosition: this.fretboardPosition,
      spelling: this.spelling?.toString(),
    })
  }

  public spellings(): Spelling[] {
    return this.tuning.spellings(this.fretboardPosition);
  }

  public relativePitch(): RelativePitch {
    return this.tuning.relativePitch(this.fretboardPosition);
  }

  public compare(other: Note): number {
    return this.relativePitch().compare(other.relativePitch());
  }

  public equiv(other: unknown): boolean {
    return other instanceof Note && this.relativePitch().equiv(other.relativePitch());
  }

}

export interface Scale {
  tuning: Tuning;
  name: string;
  notes(string?: StringNumber): Note[];
  pattern: (from: Fret) => Pattern;
}

export interface DiatonicScale extends Scale {
  tonic: Spelling;
  degrees: SortedMap<ScaleDegree, Spelling>;
}
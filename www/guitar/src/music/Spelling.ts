import type { ICompare, IEquiv } from "@thi.ng/api";
import { NaturalPitchClass } from "./NaturalPitchClass";
import { Accidental } from "./Accidental";
import type { Interval } from "./Interval";
import { composeComparators, compareByKey } from "@thi.ng/compare";

export class Spelling implements ICompare<Spelling>, IEquiv {
  public readonly naturalPitchClass: NaturalPitchClass;
  public readonly accidental: Accidental;

  public constructor(naturalPitchClass: NaturalPitchClass, accidental: Accidental = Accidental.none()) {
    this.naturalPitchClass = naturalPitchClass;
    this.accidental = accidental;
  }

  public static fromString(s: string): Spelling | undefined {
    switch (s.length) {
      case 1: {
        const naturalPitchClass = NaturalPitchClass.fromString(s);
        return naturalPitchClass ? new Spelling(naturalPitchClass) : undefined;
      }
      case 2: {
        const naturalPitchClass = NaturalPitchClass.fromString(s[0]);
        const accidental = Accidental.fromString(s[1]);
        return naturalPitchClass && accidental ? new Spelling(naturalPitchClass, accidental) : undefined;
      }
      default:
        return undefined;
    }
  }

  public toString(): string {
    return `${this.naturalPitchClass.toString()}${this.accidental.toString()}`;
  }

  equiv(o: unknown): boolean {
    return o instanceof Spelling
      && this.naturalPitchClass.equiv(o.naturalPitchClass)
      && this.accidental.equiv(o.accidental);
  }

  public hash(): number {
    return 2**this.naturalPitchClass.hash() * 3**this.accidental.hash();
  }

  public intervalFromOctaveStart(): Interval {
    const naturalInterval = this.naturalPitchClass.intervalFromOctaveStart();
    return naturalInterval.add(this.accidental.toInterval());
  }

  public enharmonicEquiv(other: Spelling): boolean {
    return this.intervalFromOctaveStart().moduloOctave().equiv(other.intervalFromOctaveStart().moduloOctave());
  }

  public compare(other: Spelling): number {
    const comparator = composeComparators(
      compareByKey<Spelling, 'naturalPitchClass'>('naturalPitchClass'),
      compareByKey<Spelling, 'accidental'>('accidental'),
    );
    return comparator(this, other);
  }

  public static simplify(spellings: Spelling[]): Spelling[] {
    for (const spelling of spellings) {
      if (spelling.accidental.exact(Accidental.none())) {
        return [spelling];
      }
    }

    return spellings;
  }

  public static c(accidental?: Accidental): Spelling {
    return new Spelling(NaturalPitchClass.c(), accidental);
  }

  public static d(accidental?: Accidental): Spelling {
    return new Spelling(NaturalPitchClass.d(), accidental);
  }

  public static e(accidental?: Accidental): Spelling {
    return new Spelling(NaturalPitchClass.e(), accidental);
  }

  public static f(accidental?: Accidental): Spelling {
    return new Spelling(NaturalPitchClass.f(), accidental);
  }

  public static g(accidental?: Accidental): Spelling {
    return new Spelling(NaturalPitchClass.g(), accidental);
  }

  public static a(accidental?: Accidental): Spelling {
    return new Spelling(NaturalPitchClass.a(), accidental);
  }

  public static b(accidental?: Accidental): Spelling {
    return new Spelling(NaturalPitchClass.b(), accidental);
  }
}
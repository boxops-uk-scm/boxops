import { type ICompare, type IEquiv } from '@thi.ng/api'

export class Interval implements ICompare<Interval>, IEquiv {
  public readonly semitones: number;
  
  public constructor(semitones: number) {
    this.semitones = semitones;
  }

  public add(other: Interval): Interval {
    return new Interval(this.semitones + other.semitones);
  }

  public subtract(other: Interval): Interval {
    return new Interval(this.semitones - other.semitones);
  }

  public compare(other: Interval): number {
    return this.semitones - other.semitones;
  }

  public equiv(other: unknown): boolean {
    return other instanceof Interval && this.semitones === other.semitones;
  }

  public negate(): Interval {
    return new Interval(-this.semitones);
  }

  public moduloOctave(): Interval {
    const semitonesModOctave = ((this.semitones % 12) + 12) % 12;
    return new Interval(semitonesModOctave);
  }

  public static perfectUnison(): Interval {
    return new Interval(0);
  }

  public static minorSecond(): Interval {
    return new Interval(1);
  }

  public static majorSecond(): Interval {
    return new Interval(2);
  }

  public static minorThird(): Interval {
    return new Interval(3);
  }

  public static majorThird(): Interval {
    return new Interval(4);
  }

  public static perfectFourth(): Interval {
    return new Interval(5);
  }

  public static tritone(): Interval {
    return new Interval(6);
  }

  public static perfectFifth(): Interval {
    return new Interval(7);
  }

  public static minorSixth(): Interval {
    return new Interval(8);
  }

  public static majorSixth(): Interval {
    return new Interval(9);
  }

  public static minorSeventh(): Interval {
    return new Interval(10);
  }

  public static majorSeventh(): Interval {
    return new Interval(11);
  }

  public static perfectOctave(): Interval {
    return new Interval(12);
  }

  public static wholeStep(): Interval {
    return Interval.majorSecond();
  }

  public static halfStep(): Interval {
    return Interval.minorSecond();
  }
}
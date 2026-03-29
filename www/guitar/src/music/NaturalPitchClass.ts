import type { ICompare, IEquiv } from "@thi.ng/api";
import { Interval } from "./Interval";

export type NaturalPitchClassType = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

export class NaturalPitchClass implements ICompare<NaturalPitchClass>, IEquiv {
  public readonly type: NaturalPitchClassType;

  public constructor(type: NaturalPitchClassType) {
    this.type = type;
  }
  
  public equiv(other: unknown): boolean {
    return other instanceof NaturalPitchClass && this.type === other.type;
  }

  public compare(other: NaturalPitchClass): number {
    return this.hash() - other.hash();
  }

  public static fromString(s: string): NaturalPitchClass | undefined {
    switch (s) {
      case 'C': return NaturalPitchClass.c();
      case 'D': return NaturalPitchClass.d();
      case 'E': return NaturalPitchClass.e();
      case 'F': return NaturalPitchClass.f();
      case 'G': return NaturalPitchClass.g();
      case 'A': return NaturalPitchClass.a();
      case 'B': return NaturalPitchClass.b();
      default: return undefined;
    }
  }

  public toString(): string {
    return this.type;
  }

  public hash(): number {
    switch (this.type) {
      case 'C': return 1;
      case 'D': return 2;
      case 'E': return 3;
      case 'F': return 4;
      case 'G': return 5;
      case 'A': return 6;
      case 'B': return 7;
    }
  }

  public intervalFromOctaveStart(): Interval {
    switch (this.type) {
      case 'C': return Interval.perfectUnison();
      case 'D': return Interval.majorSecond();
      case 'E': return Interval.majorThird();
      case 'F': return Interval.perfectFourth();
      case 'G': return Interval.perfectFifth();
      case 'A': return Interval.majorSixth();
      case 'B': return Interval.majorSeventh();
    }
  }

  public static all(): NaturalPitchClass[] {
    return [
      NaturalPitchClass.c(),
      NaturalPitchClass.d(),
      NaturalPitchClass.e(),
      NaturalPitchClass.f(),
      NaturalPitchClass.g(),
      NaturalPitchClass.a(),
      NaturalPitchClass.b(),
    ];
  }

  public static octaveStart(): NaturalPitchClass {
    return NaturalPitchClass.c();
  }

  public static c(): NaturalPitchClass {
    return new NaturalPitchClass('C');
  }

  public static d(): NaturalPitchClass {
    return new NaturalPitchClass('D');
  }

  public static e(): NaturalPitchClass {
    return new NaturalPitchClass('E');
  }

  public static f(): NaturalPitchClass {
    return new NaturalPitchClass('F');
  }

  public static g(): NaturalPitchClass {
    return new NaturalPitchClass('G');
  }

  public static a(): NaturalPitchClass {
    return new NaturalPitchClass('A');
  }

  public static b(): NaturalPitchClass {
    return new NaturalPitchClass('B');
  }

  public predecessor(): NaturalPitchClass {
    switch (this.type) {
      case 'C': return NaturalPitchClass.b();
      case 'D': return NaturalPitchClass.c();
      case 'E': return NaturalPitchClass.d();
      case 'F': return NaturalPitchClass.e();
      case 'G': return NaturalPitchClass.f();
      case 'A': return NaturalPitchClass.g();
      case 'B': return NaturalPitchClass.a();
    }
  }

  public intervalToPredecessor(): Interval {
    switch (this.type) {
      case 'C': return Interval.halfStep();
      case 'D': return Interval.wholeStep();
      case 'E': return Interval.wholeStep();
      case 'F': return Interval.halfStep();
      case 'G': return Interval.wholeStep();
      case 'A': return Interval.wholeStep();
      case 'B': return Interval.wholeStep();
    }
  }

  public successor(): NaturalPitchClass {
    switch (this.type) {
      case 'C': return NaturalPitchClass.d();
      case 'D': return NaturalPitchClass.e();
      case 'E': return NaturalPitchClass.f();
      case 'F': return NaturalPitchClass.g();
      case 'G': return NaturalPitchClass.a();
      case 'A': return NaturalPitchClass.b();
      case 'B': return NaturalPitchClass.c();
    }
  }

  public intervalToSuccessor(): Interval {
    switch (this.type) {
      case 'C': return Interval.wholeStep();
      case 'D': return Interval.wholeStep();
      case 'E': return Interval.halfStep();
      case 'F': return Interval.wholeStep();
      case 'G': return Interval.wholeStep();
      case 'A': return Interval.wholeStep();
      case 'B': return Interval.halfStep();
    }
  }
}
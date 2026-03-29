import type { ICompare, IEquiv } from "@thi.ng/api";
import { Interval } from "./Interval";

type AccidentalType = 'sharp' | 'flat' | 'natural' | undefined;

export class Accidental implements ICompare<Accidental>, IEquiv {
  public readonly type: AccidentalType;

  constructor(type: AccidentalType) {
    this.type = type;
  }

  public static fromString(s: string): Accidental | undefined {
    switch (s) {
      case '♯':
        return Accidental.sharp();
      case '♭':
        return Accidental.flat();
      case '♮':
        return Accidental.natural();
      case '':
        return Accidental.none();
      default:
        return undefined;
    }
  }

  public toString(): string {
    switch (this.type) {
      case 'sharp':
        return '♯';
      case 'flat':
        return '♭';
      case 'natural':
        return '♮';
      default:
        return '';
    }
  }

  public static all(): Accidental[] {
    return [
      Accidental.flat(),
      Accidental.natural(),
      Accidental.sharp(),
    ];
  }

  public static sharp(): Accidental {
    return new Accidental('sharp');
  }

  public static flat(): Accidental {
    return new Accidental('flat');
  }

  public static natural(): Accidental {
    return new Accidental('natural');
  }

  public static none(): Accidental {
    return new Accidental(undefined);
  }

  public equiv(other: unknown): boolean {
    if (other instanceof Accidental) {
      return ((this.type === undefined || this.type === 'natural')
        && (other.type === undefined || other.type === 'natural'))
        || this.type === other.type
    }
    return false;
  }

  public compare(other: Accidental): number {
    return this.hash() - other.hash();
  }

  public hash(): number {
    switch (this.type) {
      case 'flat':
        return 1;
      case 'natural':
      case undefined:
        return 2;
      case 'sharp':
        return 3;
    }
  }

  public exact(other: unknown): boolean {
    return other instanceof Accidental && this.type === other.type;
  }

  public toInterval(): Interval {
    switch (this.type) {
      case 'sharp':
        return Interval.minorSecond();
      case 'flat':
        return Interval.minorSecond().negate();
      default:
        return Interval.perfectUnison();
    }
  }
}
import type { ICompare, IEquiv } from "@thi.ng/api";
import type { SortedSet } from "@thi.ng/sorted-map/sorted-set";

export const STRINGS = [1, 2, 3, 4, 5, 6] as const;

export type StringNumber = typeof STRINGS[number];

export const FRETS: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] as const;

export type Fret = number;

export class FretboardPosition implements ICompare<FretboardPosition>, IEquiv {
  public readonly string: StringNumber;
  public readonly fret: Fret;

  public constructor(string: StringNumber, fret: Fret) {
    this.string = string;
    this.fret = fret;
  }

  public compare(other: FretboardPosition): number {
    if (this.string < other.string) return -1;
    if (this.string > other.string) return 1;

    const a = this.fret;
    const b = other.fret;

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  public equiv(other: unknown): boolean {
    return other instanceof FretboardPosition
      && this.string === other.string
      && this.fret === other.fret;
  }

  public isOpenString(): boolean {
    return this.fret === 0;
  }

  public static random(string?: StringNumber, not?: SortedSet<FretboardPosition>): FretboardPosition {
    while (true) {
      const randomString = string ?? STRINGS[Math.floor(Math.random() * STRINGS.length)];
      const randomFret = FRETS[Math.floor(Math.random() * FRETS.length)];
      const position = new FretboardPosition(randomString, randomFret);
      if (!not || !not.has(position)) {
        return position;
      }
    }
  }

  public static open(string: StringNumber): FretboardPosition {
    return new FretboardPosition(string, 0);
  }

  public toString(): string {
    return `String ${this.string}, Fret ${this.fret}`;
  }
}
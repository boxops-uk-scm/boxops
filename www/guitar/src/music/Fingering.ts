import type { IEquiv } from "@thi.ng/api";
import { FretboardPosition, FRETS, type Fret } from "./Fretboard";
import { Mode } from "./Mode";
import { SortedMap, SortedSet } from "@thi.ng/sorted-map";

type FingerName = 'Thumb' | 'Index' | 'Middle' | 'Ring' | 'Pinky';

export class Finger implements IEquiv {
  public readonly name: FingerName;

  public constructor(name: FingerName) {
    this.name = name;
  }
  equiv(o: unknown): boolean {
    return o instanceof Finger && this.name === o.name;
  }

  public symbol(hand: 'left' | 'right'): string {
    switch (hand) {
      case 'left':
        switch (this.name) {
          case 'Thumb': return 'T';
          case 'Index': return '1';
          case 'Middle': return '2';
          case 'Ring': return '3';
          case 'Pinky': return '4';
        }
        break;
      case 'right':
        switch (this.name) {
          case 'Thumb': return 'p';
          case 'Index': return 'i';
          case 'Middle': return 'm';
          case 'Ring': return 'a';
          case 'Pinky': return 'c';
        }
        break;
    }
  }


  public static thumb(): Finger {
    return new Finger('Thumb');
  }

  public static index(): Finger {
    return new Finger('Index');
  }

  public static middle(): Finger {
    return new Finger('Middle');
  }

  public static ring(): Finger {
    return new Finger('Ring');
  }

  public static pinky(): Finger {
    return new Finger('Pinky');
  }
}

export class Fingering implements IEquiv {
  public readonly fretboardPosition: FretboardPosition;
  public readonly finger: Finger;

  public constructor(fretboardPosition: FretboardPosition, finger: Finger) {
    this.fretboardPosition = fretboardPosition;
    this.finger = finger;
  }

  equiv(o: unknown): boolean {
    return o instanceof Fingering &&
      this.fretboardPosition === o.fretboardPosition &&
      this.finger.equiv(o.finger);
  }

  public toString(): string {
    return `${this.finger.name} on ${this.fretboardPosition.toString()}`;
  }
}

export class FretSpan implements IEquiv {
  public readonly lowerEndpoint?: Fret;
  public readonly upperEndpoint?: Fret;

  public constructor(lowerEndpoint?: Fret, upperEndpoint?: Fret) {
    this.lowerEndpoint = lowerEndpoint;
    this.upperEndpoint = upperEndpoint;
  }

  equiv(o: unknown): boolean {
    return o instanceof FretSpan &&
      this.lowerEndpoint === o.lowerEndpoint &&
      this.upperEndpoint === o.upperEndpoint;
  }

  public static compose(left: FretSpan, right: FretSpan): FretSpan {
    return new FretSpan(
      left.lowerEndpoint !== undefined && right.lowerEndpoint !== undefined
        ? Math.min(left.lowerEndpoint, right.lowerEndpoint)
        : left.lowerEndpoint ?? right.lowerEndpoint,
      left.upperEndpoint !== undefined && right.upperEndpoint !== undefined
        ? Math.max(left.upperEndpoint, right.upperEndpoint)
        : left.upperEndpoint ?? right.upperEndpoint,
    );
  }

  public withLowerEndpoint(fret: Fret | undefined): FretSpan;
  public withLowerEndpoint(updater: (current: Fret) => Fret | undefined): FretSpan;
  public withLowerEndpoint(updater: Fret | undefined | ((current: Fret) => Fret | undefined)): FretSpan {
    const newLowerEndpoint = typeof updater === 'function'  ? this.lowerEndpoint !== undefined ? updater(this.lowerEndpoint) : undefined : updater;
    return new FretSpan(newLowerEndpoint, this.upperEndpoint);
  }

  public withUpperEndpoint(fret: Fret | undefined): FretSpan;
  public withUpperEndpoint(updater: (current: Fret) => Fret | undefined): FretSpan;
  public withUpperEndpoint(updater: Fret | undefined | ((current: Fret) => Fret | undefined)): FretSpan {
    const newUpperEndpoint = typeof updater === 'function'  ? (this.upperEndpoint !== undefined ? updater(this.upperEndpoint) : undefined) : updater;
    return new FretSpan(this.lowerEndpoint, newUpperEndpoint);
  }

  public clamp(): FretSpan {
    return new FretSpan(
      this.lowerEndpoint !== undefined ?
        Math.max(Math.min(this.lowerEndpoint, FretSpan.fullFretboard.upperEndpoint!), FretSpan.fullFretboard.lowerEndpoint!)
        : undefined,
      this.upperEndpoint !== undefined ?
        Math.max(Math.min(this.upperEndpoint, FretSpan.fullFretboard.upperEndpoint!), FretSpan.fullFretboard.lowerEndpoint!)
        : undefined,
    );
  }

  public width(): number {
    return (this.upperEndpoint ?? FretSpan.fullFretboard.upperEndpoint!) - (this.lowerEndpoint ?? FretSpan.fullFretboard.lowerEndpoint!);
  }

  public contains(fret: Fret): boolean;
  public contains(fretboardPosition: FretboardPosition): boolean;
  public contains(fretOrPosition: Fret | FretboardPosition): boolean {
    const fret = typeof fretOrPosition === 'number' ? fretOrPosition : fretOrPosition.fret;
    const lowerCheck = this.lowerEndpoint !== undefined ? fret >= this.lowerEndpoint : true;
    const upperCheck = this.upperEndpoint !== undefined ? fret <= this.upperEndpoint : true;
    return lowerCheck && upperCheck;
  }

  public static fullFretboard: FretSpan = new FretSpan(Math.min(...FRETS), Math.max(...FRETS));
}

export class Pattern {
  public readonly fingerings: Fingering[];

  public constructor(fingerings: Fingering[]) {
    this.fingerings = fingerings;
  }

  public fretSpan(): FretSpan {
    let lowestFret = undefined;
    let highestFret = undefined;
    
    for (const fingering of this.fingerings) {
      if (highestFret === undefined || fingering.fretboardPosition.fret > highestFret) {
        highestFret = fingering.fretboardPosition.fret;
      }
      if (lowestFret === undefined || fingering.fretboardPosition.fret < lowestFret) {
        lowestFret = fingering.fretboardPosition.fret;
      }
    }

    return new FretSpan(
      lowestFret,
      highestFret
    );
  }

  public fretboardPositions(): SortedSet<FretboardPosition> {
    return new SortedSet(this.fingerings.map(f => f.fretboardPosition));
  }

  public usesOpenStrings(): boolean {
    return this.fingerings.some(fingering => fingering.fretboardPosition.fret === 0);
  }

  public static readonly modePatterns: SortedMap<Mode, (from: Fret) => Pattern> = new SortedMap([
    [Mode.ionian(), Pattern.ionianPattern],
    [Mode.dorian(), Pattern.dorianPattern],
    [Mode.phrygian(), Pattern.phrygianPattern],
    [Mode.lydian(), Pattern.lydianPattern],
    [Mode.mixolydian(), Pattern.mixolydianPattern],
    [Mode.aeolian(), Pattern.aeolianPattern],
    [Mode.locrian(), Pattern.locrianPattern],
  ]);

  public static ionianPattern(from: Fret): Pattern {
    return new Pattern([
      new Fingering(new FretboardPosition(6, from),     Finger.middle()),
      new Fingering(new FretboardPosition(6, from + 2), Finger.pinky()),
      new Fingering(new FretboardPosition(5, from - 1), Finger.index()),
      new Fingering(new FretboardPosition(5, from),     Finger.middle()),
      new Fingering(new FretboardPosition(5, from + 2), Finger.pinky()),
      new Fingering(new FretboardPosition(4, from - 1), Finger.index()),
      new Fingering(new FretboardPosition(4, from + 1), Finger.ring()),
      new Fingering(new FretboardPosition(4, from + 2), Finger.pinky()),
      new Fingering(new FretboardPosition(3, from - 1), Finger.index()),
      new Fingering(new FretboardPosition(3, from + 1), Finger.ring()),
      new Fingering(new FretboardPosition(3, from + 2), Finger.pinky()),
      new Fingering(new FretboardPosition(2, from),     Finger.middle()),
      new Fingering(new FretboardPosition(2, from + 2), Finger.pinky()),
      new Fingering(new FretboardPosition(1, from - 1), Finger.index()),
      new Fingering(new FretboardPosition(1, from),     Finger.middle()),
    ]);
  }

  public static dorianPattern(from: Fret): Pattern {
    return new Pattern([
      new Fingering(new FretboardPosition(6, from),     Finger.index()),
      new Fingering(new FretboardPosition(6, from + 2), Finger.ring()),
      new Fingering(new FretboardPosition(6, from + 3), Finger.pinky()),
      new Fingering(new FretboardPosition(5, from),     Finger.index()),
      new Fingering(new FretboardPosition(5, from + 2), Finger.pinky()),
      new Fingering(new FretboardPosition(4, from - 1), Finger.index()),
      new Fingering(new FretboardPosition(4, from),     Finger.middle()),
      new Fingering(new FretboardPosition(4, from + 2), Finger.pinky()),
      new Fingering(new FretboardPosition(3, from - 1), Finger.index()),
      new Fingering(new FretboardPosition(3, from),     Finger.middle()),
      new Fingering(new FretboardPosition(3, from + 2), Finger.pinky()),
      new Fingering(new FretboardPosition(2, from),     Finger.index()),
      new Fingering(new FretboardPosition(2, from + 2), Finger.ring()),
      new Fingering(new FretboardPosition(2, from + 3), Finger.pinky()),
      new Fingering(new FretboardPosition(1, from),     Finger.index()),
    ]);
  }

  public static phrygianPattern(from: Fret): Pattern {
    return new Pattern([
      new Fingering(new FretboardPosition(6, from),     Finger.index()),
      new Fingering(new FretboardPosition(6, from + 1), Finger.middle()),
      new Fingering(new FretboardPosition(6, from + 3), Finger.pinky()),
      new Fingering(new FretboardPosition(5, from),     Finger.index()),
      new Fingering(new FretboardPosition(5, from + 2), Finger.ring()),
      new Fingering(new FretboardPosition(5, from + 3), Finger.pinky()),
      new Fingering(new FretboardPosition(4, from),     Finger.index()),
      new Fingering(new FretboardPosition(4, from + 2), Finger.ring()),
      new Fingering(new FretboardPosition(4, from + 3), Finger.pinky()),
      new Fingering(new FretboardPosition(3, from),     Finger.index()),
      new Fingering(new FretboardPosition(3, from + 2), Finger.ring()),
      new Fingering(new FretboardPosition(2, from),     Finger.index()),
      new Fingering(new FretboardPosition(2, from + 1), Finger.middle()),
      new Fingering(new FretboardPosition(2, from + 3), Finger.pinky()),
      new Fingering(new FretboardPosition(1, from),     Finger.index()),
    ]);
  }

  public static lydianPattern(from: Fret): Pattern {
    return new Pattern([
      new Fingering(new FretboardPosition(6, from),     Finger.middle()),
      new Fingering(new FretboardPosition(6, from + 2), Finger.pinky()),
      new Fingering(new FretboardPosition(5, from - 1), Finger.index()),
      new Fingering(new FretboardPosition(5, from + 1), Finger.ring()),
      new Fingering(new FretboardPosition(5, from + 2), Finger.pinky()),
      new Fingering(new FretboardPosition(4, from - 1), Finger.index()),
      new Fingering(new FretboardPosition(4, from + 1), Finger.ring()),
      new Fingering(new FretboardPosition(4, from + 2), Finger.pinky()),
      new Fingering(new FretboardPosition(3, from - 1), Finger.index()),
      new Fingering(new FretboardPosition(3, from + 1), Finger.ring()),
      new Fingering(new FretboardPosition(2, from - 1), Finger.index()),
      new Fingering(new FretboardPosition(2, from),     Finger.middle()),
      new Fingering(new FretboardPosition(2, from + 2), Finger.pinky()),
      new Fingering(new FretboardPosition(1, from - 1), Finger.index()),
      new Fingering(new FretboardPosition(1, from),     Finger.middle()),
    ])
  }

  public static mixolydianPattern(from: Fret): Pattern {
    return new Pattern([
      new Fingering(new FretboardPosition(6, from),     Finger.middle()),
      new Fingering(new FretboardPosition(6, from + 2), Finger.pinky()),
      new Fingering(new FretboardPosition(5, from - 1), Finger.index()),
      new Fingering(new FretboardPosition(5, from),     Finger.middle()),
      new Fingering(new FretboardPosition(5, from + 2), Finger.pinky()),
      new Fingering(new FretboardPosition(4, from - 1), Finger.index()),
      new Fingering(new FretboardPosition(4, from),     Finger.middle()),
      new Fingering(new FretboardPosition(4, from + 2), Finger.pinky()),
      new Fingering(new FretboardPosition(3, from - 1), Finger.index()),
      new Fingering(new FretboardPosition(3, from + 1), Finger.ring()),
      new Fingering(new FretboardPosition(3, from + 2), Finger.pinky()),
      new Fingering(new FretboardPosition(2, from),     Finger.index()),
      new Fingering(new FretboardPosition(2, from + 2), Finger.ring()),
      new Fingering(new FretboardPosition(2, from + 3), Finger.pinky()),
      new Fingering(new FretboardPosition(1, from),     Finger.index()),
    ]);
  }

  public static aeolianPattern(from: Fret): Pattern {
    return new Pattern([
      new Fingering(new FretboardPosition(6, from),     Finger.index()),
      new Fingering(new FretboardPosition(6, from + 2), Finger.ring()),
      new Fingering(new FretboardPosition(6, from + 3), Finger.pinky()),
      new Fingering(new FretboardPosition(5, from),     Finger.index()),
      new Fingering(new FretboardPosition(5, from + 2), Finger.ring()),
      new Fingering(new FretboardPosition(5, from + 3), Finger.pinky()),
      new Fingering(new FretboardPosition(4, from),     Finger.index()),
      new Fingering(new FretboardPosition(4, from + 2), Finger.pinky()),
      new Fingering(new FretboardPosition(3, from - 1), Finger.index()),
      new Fingering(new FretboardPosition(3, from),     Finger.middle()),
      new Fingering(new FretboardPosition(3, from + 2), Finger.pinky()),
      new Fingering(new FretboardPosition(2, from),     Finger.index()),
      new Fingering(new FretboardPosition(2, from + 1), Finger.middle()),
      new Fingering(new FretboardPosition(2, from + 3), Finger.pinky()),
      new Fingering(new FretboardPosition(1, from),     Finger.index()),
    ]);
  }

  public static locrianPattern(from: Fret): Pattern {
    return new Pattern([
      new Fingering(new FretboardPosition(6, from),     Finger.index()),
      new Fingering(new FretboardPosition(6, from + 1), Finger.middle()),
      new Fingering(new FretboardPosition(6, from + 3), Finger.pinky()),
      new Fingering(new FretboardPosition(5, from),     Finger.index()),
      new Fingering(new FretboardPosition(5, from + 1), Finger.middle()),
      new Fingering(new FretboardPosition(5, from + 3), Finger.pinky()),
      new Fingering(new FretboardPosition(4, from),     Finger.index()),
      new Fingering(new FretboardPosition(4, from + 2), Finger.ring()),
      new Fingering(new FretboardPosition(4, from + 3), Finger.pinky()),
      new Fingering(new FretboardPosition(3, from),     Finger.index()),
      new Fingering(new FretboardPosition(3, from + 2), Finger.ring()),
      new Fingering(new FretboardPosition(3, from + 3), Finger.pinky()),
      new Fingering(new FretboardPosition(2, from + 1), Finger.middle()),
      new Fingering(new FretboardPosition(2, from + 3), Finger.pinky()),
      new Fingering(new FretboardPosition(1, from),     Finger.index()),
    ]);
  }
}
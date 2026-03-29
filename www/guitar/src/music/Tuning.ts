import { FretboardPosition, type StringNumber, FRETS, STRINGS } from "./Fretboard";
import { Interval } from "./Interval";
import { RelativePitch } from "./RelativePitch";
import { SortedMap, SortedSet } from '@thi.ng/sorted-map';
import type { Spelling } from "./Spelling";
import type { IEquiv } from "@thi.ng/api/equiv";

const E2: RelativePitch = new RelativePitch(new Interval(-20));
const A2: RelativePitch = new RelativePitch(new Interval(-15));
const D3: RelativePitch = new RelativePitch(new Interval(-10));
const G3: RelativePitch = new RelativePitch(new Interval(-5));
const B3: RelativePitch = new RelativePitch(new Interval(-1));
const E4: RelativePitch = new RelativePitch(new Interval(+4));

export class Tuning implements IEquiv {
  private static _standard: Tuning;

  public readonly name?: string;

  private readonly relativePitchByFretboardPosition: SortedMap<FretboardPosition, RelativePitch>;
  private readonly fretboardPositionsByRelativePitch: SortedMap<RelativePitch, FretboardPosition[]>;

  private constructor(relativePitchByFretboardPosition: SortedMap<FretboardPosition, RelativePitch>, fretboardPositionsByRelativePitch: SortedMap<RelativePitch, FretboardPosition[]>, name?: string) {
    this.relativePitchByFretboardPosition = relativePitchByFretboardPosition;
    this.fretboardPositionsByRelativePitch = fretboardPositionsByRelativePitch;
    this.name = name;
  }

  equiv(o: unknown): boolean {
    if (o instanceof Tuning) {
      return this.openStringPitches().equiv(o.openStringPitches());
    }

    return false;
  }

  public relativePitch(fretboardPosition: FretboardPosition): RelativePitch {
    return this.relativePitchByFretboardPosition.get(fretboardPosition)!;
  }

  public relativePitches(spelling: Spelling): RelativePitch[] {
    const relativePitches: RelativePitch[] = [];
    for (const [relativePitch, _] of this.fretboardPositionsByRelativePitch) {
      if (new SortedSet(relativePitch.spellings()).has(spelling)) {
        relativePitches.push(relativePitch);
      }
    }
    return relativePitches;
  }

  public spellings(relativePitch: RelativePitch): Spelling[];
  public spellings(fretboardPosition: FretboardPosition): Spelling[];
  public spellings(arg: FretboardPosition | RelativePitch): Spelling[] {
    if (arg instanceof FretboardPosition) {
      const relativePitch = this.relativePitch(arg);
      return relativePitch.spellings();
    } else {
      const fretboardPositions = this.fretboardPositions(arg);
      const spellingsSet = new Set<Spelling>();
      for (const fretboardPosition of fretboardPositions) {
        const spellings = this.spellings(fretboardPosition);
        for (const spelling of spellings) {
          spellingsSet.add(spelling);
        }
      }
      return Array.from(spellingsSet);
    }
  }

  public fretboardPositions(relativePitch: RelativePitch): FretboardPosition[];
  public fretboardPositions(spelling: Spelling): FretboardPosition[];
  public fretboardPositions(arg: RelativePitch | Spelling): FretboardPosition[] {
    if (arg instanceof RelativePitch) {
      const positions = this.fretboardPositionsByRelativePitch.get(arg);
      return positions ?? [];
    } else {
      const positions: FretboardPosition[] = [];
      for (const [, relativePitch] of this.relativePitchByFretboardPosition) {
        if (new SortedSet(relativePitch.spellings()).has(arg)) {
          positions.push(...this.fretboardPositions(relativePitch));
        }
      }
      return positions;
    }
  }

  public pitchesOnString(string: StringNumber): RelativePitch[] {
    const pitches: RelativePitch[] = [];
    for (const fret of FRETS) {
      const fretboardPosition = new FretboardPosition(string, fret);
      pitches.push(this.relativePitch(fretboardPosition));
    }
    return pitches;
  }

  public openStringPitches(): SortedMap<StringNumber, RelativePitch> {
    const openStringPitches = new SortedMap<StringNumber, RelativePitch>();
    for (const string of STRINGS) {
      const fretboardPosition = new FretboardPosition(string, 0);
      openStringPitches.set(string, this.relativePitch(fretboardPosition));
    }
    return openStringPitches;
  }

  public static standard(): Tuning {
    if (this._standard) {
      return this._standard;
    }

    const relativePitchByFretboardPosition = new SortedMap<FretboardPosition, RelativePitch>();
    const fretboardPositionsByRelativePitch = new SortedMap<RelativePitch, FretboardPosition[]>();

    const openStringPitches: Record<StringNumber, RelativePitch> = { 1: E4, 2: B3, 3: G3, 4: D3, 5: A2, 6: E2};

    for (const string of STRINGS) {
      const openStringPitch = openStringPitches[string];

      for (const fret of FRETS) {
        const relativePitch: RelativePitch = openStringPitch.add(new Interval(fret));
        const fretboardPosition: FretboardPosition = new FretboardPosition(string, fret);
        relativePitchByFretboardPosition.set(fretboardPosition, relativePitch);
        if (!fretboardPositionsByRelativePitch.has(relativePitch)) {
          fretboardPositionsByRelativePitch.set(relativePitch, []);
        }
        fretboardPositionsByRelativePitch.get(relativePitch)!.push(fretboardPosition);
      }
    }

    this._standard = new Tuning(relativePitchByFretboardPosition, fretboardPositionsByRelativePitch, "Standard");
    return this._standard;
  }
}
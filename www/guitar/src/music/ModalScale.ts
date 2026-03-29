import type { IEquiv } from "@thi.ng/api";
import { Note, ScaleDegree, type DiatonicScale } from "./Scale";
import { MajorScale } from "./MajorScale";
import type { Mode } from "./Mode";
import { SortedMap } from "@thi.ng/sorted-map";
import { Tuning } from "./Tuning";
import { type Fret, type StringNumber } from "./Fretboard";
import { Spelling } from "./Spelling";
import { Pattern } from "./Fingering";
import { Accidental } from "./Accidental";

export class ModalScale implements DiatonicScale, IEquiv {
  public readonly parentScale: MajorScale;
  public readonly mode: Mode;
  public readonly tonic: Spelling;
  public readonly name: string;
  public readonly degrees: SortedMap<ScaleDegree, Spelling>;
  public readonly tuning: Tuning;
  public readonly pattern: (from: Fret) => Pattern;

  public constructor(parentScale: MajorScale, mode: Mode) {
    this.parentScale = parentScale;
    this.mode = mode;
    this.tonic = parentScale.degrees.get(mode.toDegreeOfParentScale())!;
    this.name = `${this.tonic.toString()} ${mode.name}`;
    this.tuning = parentScale.tuning;
    this.degrees = new SortedMap<ScaleDegree, Spelling>(
      Array.from(parentScale.degrees.entries()).map(([degree, spelling]) => {
        const degreeInParentScaleOrdinal = degree.toOrdinal();
        const modeDegreeOrdinal = mode.toDegreeOfParentScale().toOrdinal();
        const degreeInModalScaleOrdinal = ((degreeInParentScaleOrdinal - modeDegreeOrdinal + 7) % 7) + 1;
        return [ScaleDegree.fromOrdinal(degreeInModalScaleOrdinal), spelling] as [ScaleDegree, Spelling];
      })
    );
    this.pattern = Pattern.modePatterns.get(mode)!;
  }

  public static fromTonic(tonic: Spelling, mode: Mode, tuning: Tuning): ModalScale | undefined {
    const standardTonics: Spelling[] = [
      Spelling.c(),
      Spelling.d(Accidental.flat()),
      Spelling.d(),
      Spelling.e(Accidental.flat()),
      Spelling.e(),
      Spelling.f(),
      Spelling.f(Accidental.sharp()),
      Spelling.g(),
      Spelling.a(Accidental.flat()),
      Spelling.a(),
      Spelling.b(Accidental.flat()),
      Spelling.b(),
    ];

    const majorScales = standardTonics.map((standardTonic: Spelling) => MajorScale.fromTonic(standardTonic, tuning));

    for (const majorScale of majorScales) {
      const modalScale = new ModalScale(majorScale, mode);
      if (modalScale.tonic.equiv(tonic)) {
        return modalScale;
      }
    }

    return undefined;
  }

  equiv(o: unknown): boolean {
    return o instanceof ModalScale && this.parentScale.equiv(o.parentScale) && this.mode.equiv(o.mode);
  }

  notes(string?: StringNumber): Note[] {
    return this.parentScale.notes(string);
  }
}

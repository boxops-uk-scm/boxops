import type { IEquiv } from "@thi.ng/api";
import { ScaleDegree } from "./Scale";

export type ModeName
  = 'Ionian'
  | 'Dorian'
  | 'Phrygian'
  | 'Lydian'
  | 'Mixolydian'
  | 'Aeolian'
  | 'Locrian';

export class Mode implements IEquiv {
  public readonly name: ModeName;
  
  public constructor(name: ModeName) {
    this.name = name;
  }

  public equiv(other: unknown): boolean {
    return other instanceof Mode && this.name === other.name;
  }

  public successor(): Mode {
    switch (this.name) {
      case 'Ionian': return Mode.dorian();
      case 'Dorian': return Mode.phrygian();
      case 'Phrygian': return Mode.lydian();
      case 'Lydian': return Mode.mixolydian();
      case 'Mixolydian': return Mode.aeolian();
      case 'Aeolian': return Mode.locrian();
      case 'Locrian': return Mode.ionian();
    }
  }

  public predecessor(): Mode {
    switch (this.name) {
      case 'Ionian': return Mode.locrian();
      case 'Dorian': return Mode.ionian();
      case 'Phrygian': return Mode.dorian();
      case 'Lydian': return Mode.phrygian();
      case 'Mixolydian': return Mode.lydian();
      case 'Aeolian': return Mode.mixolydian();
      case 'Locrian': return Mode.aeolian();
    }
  }

  public toString() {
    return this.name;
  }

  public toDegreeOfParentScale(): ScaleDegree {
    switch (this.name) {
      case 'Ionian': return ScaleDegree.tonic();
      case 'Dorian': return ScaleDegree.supertonic();
      case 'Phrygian': return ScaleDegree.mediant();
      case 'Lydian': return ScaleDegree.subdominant();
      case 'Mixolydian': return ScaleDegree.dominant();
      case 'Aeolian': return ScaleDegree.submediant();
      case 'Locrian': return ScaleDegree.leadingTone();
    }
  }

  public static fromDegreeOfParentScale(degree: ScaleDegree): Mode {
    switch (degree.name) {
      case 'Tonic': return Mode.ionian();
      case 'Supertonic': return Mode.dorian();
      case 'Mediant': return Mode.phrygian();
      case 'Subdominant': return Mode.lydian();
      case 'Dominant': return Mode.mixolydian();
      case 'Submediant': return Mode.aeolian();
      case 'LeadingTone': return Mode.locrian();
    }
  }

  public static all(): Mode[] {
    return [
      Mode.ionian(),
      Mode.dorian(),
      Mode.phrygian(),
      Mode.lydian(),
      Mode.mixolydian(),
      Mode.aeolian(),
      Mode.locrian()
    ];
  }

  public static ionian(): Mode {
    return new Mode('Ionian');
  }

  public static dorian(): Mode {
    return new Mode('Dorian');
  }

  public static phrygian(): Mode {
    return new Mode('Phrygian');
  }

  public static lydian(): Mode {
    return new Mode('Lydian');
  }

  public static mixolydian(): Mode {
    return new Mode('Mixolydian');
  }

  public static aeolian(): Mode {
    return new Mode('Aeolian');
  }

  public static locrian(): Mode {
    return new Mode('Locrian');
  }
}

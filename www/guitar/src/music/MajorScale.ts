import { SortedMap, SortedSet } from "@thi.ng/sorted-map";
import { FretboardPosition, FRETS, STRINGS, type Fret, type StringNumber } from "./Fretboard";
import { Note, ScaleDegree, type DiatonicScale } from "./Scale";
import { Spelling } from "./Spelling";
import { Tuning } from "./Tuning";
import type { RelativePitch } from "./RelativePitch";
import { Interval } from "./Interval";
import { Accidental } from "./Accidental";
import type { NaturalPitchClass } from "./NaturalPitchClass";
import type { IEquiv } from "@thi.ng/api";
import { Pattern } from "./Fingering";

export class MajorScale implements DiatonicScale, IEquiv {
  public readonly tonic: Spelling;
  public readonly degrees: SortedMap<ScaleDegree, Spelling>;
  public readonly tuning: Tuning;
  public readonly name: string;
  public readonly pattern: (from: Fret) => Pattern;

  private readonly spellingsByIntervalFromOctaveStart: SortedMap<Interval, Spelling>;

  private constructor(
    tonic: Spelling,
    degrees: SortedMap<ScaleDegree, Spelling>,
    tuning: Tuning,
    name: string,
    spellingsByIntervalFromOctaveStart: SortedMap<Interval, Spelling>
  ) {
    this.tonic = tonic;
    this.degrees = degrees;
    this.tuning = tuning;
    this.name = name;
    this.spellingsByIntervalFromOctaveStart = spellingsByIntervalFromOctaveStart;
    this.pattern = Pattern.ionianPattern;
  }

  equiv(o: unknown): boolean {
    return o instanceof MajorScale && this.tonic.equiv(o.tonic);
  }


  public notes(onString?: StringNumber): Note[] {
    const notes: Note[] = [];
    for (const string of STRINGS) {
      for (const fret of FRETS) {
        const fretboardPosition: FretboardPosition = new FretboardPosition(string, fret);
        
        if (onString && string !== onString) {
          continue;
        }

        const relativePitch: RelativePitch = this.tuning.relativePitch(fretboardPosition);
        const intervalFromOctaveStart: Interval = relativePitch.intervalFromOctaveStart();
        const spelling = this.spellingsByIntervalFromOctaveStart.get(intervalFromOctaveStart);

        if (spelling) {
          notes.push(new Note(this.tuning, fretboardPosition, spelling));
        }
      }
    }
    
    return notes;
  }

  public static steps(): Interval[] {
    return [
      Interval.wholeStep(),
      Interval.wholeStep(),
      Interval.halfStep(),
      Interval.wholeStep(),
      Interval.wholeStep(),
      Interval.wholeStep(),
      Interval.halfStep()
    ];
  }

  public static fromTonic(tonic: Spelling, tuning: Tuning): MajorScale {
    const steps = MajorScale.steps();
    const degrees = new SortedMap<ScaleDegree, Spelling>();
    const spellingsByIntervalFromOctaveStart = new SortedMap<Interval, Spelling>();
    
    let currentNaturalPitchClass: NaturalPitchClass = tonic.naturalPitchClass;
    let currentAccidental: Accidental = tonic.accidental;
    let currentDegree: ScaleDegree = ScaleDegree.tonic();

    const tonicSpelling = new Spelling(currentNaturalPitchClass, currentAccidental);

    degrees.set(currentDegree, tonicSpelling);
    spellingsByIntervalFromOctaveStart.set(tonicSpelling.intervalFromOctaveStart(), tonicSpelling);

    for (const step of steps) {
      const intervalToNextNaturalPitchClass = currentNaturalPitchClass
        .intervalToSuccessor()
        .subtract(currentAccidental.toInterval());
      
      switch (intervalToNextNaturalPitchClass.subtract(step).semitones) {
        case 0:
          currentAccidental = Accidental.none();
          break;
        case 1:
          currentAccidental = Accidental.flat();
          break;
        case -1:
          currentAccidental = Accidental.sharp();
          break;
      }

      currentNaturalPitchClass = currentNaturalPitchClass.successor();
      currentDegree = currentDegree.successor();

      const spelling = new Spelling(currentNaturalPitchClass, currentAccidental);

      degrees.set(currentDegree, spelling);
      spellingsByIntervalFromOctaveStart.set(spelling.intervalFromOctaveStart(), spelling);
    }

    return new MajorScale(
      tonicSpelling,
      degrees,
      tuning,
      `${tonicSpelling} Major`,
      spellingsByIntervalFromOctaveStart
    );
  }

  public static readonly standardScales = new SortedMap<Spelling, MajorScale>(
    [
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
    ].map(spelling => [spelling, MajorScale.fromTonic(spelling, Tuning.standard())])
  );

  public static random(not?: SortedSet<MajorScale>): MajorScale {
    while (true) {
      const scale = Array.from(this.standardScales.values())[Math.floor(Math.random() * this.standardScales.size)];
      if (!not || !not.has(scale)) {
        return scale;
      }
    }
  }

  private static _getStandard(spelling: Spelling): MajorScale {
    return this.standardScales.get(spelling)!;
  }

  public static c(tuning?: Tuning): MajorScale {
    if (!tuning || tuning.equiv(Tuning.standard())) {
      return MajorScale._getStandard(Spelling.c());
    }
    return MajorScale.fromTonic(Spelling.c(), tuning);
  }

  public static dFlat(tuning?: Tuning): MajorScale {
    if (!tuning || tuning.equiv(Tuning.standard())) {
      return MajorScale._getStandard(Spelling.d(Accidental.flat()));
    }
    return MajorScale.fromTonic(Spelling.d(Accidental.flat()), tuning);
  }

  public static d(tuning?: Tuning): MajorScale {
    if (!tuning || tuning.equiv(Tuning.standard())) {
      return MajorScale._getStandard(Spelling.d());
    }
    return MajorScale.fromTonic(Spelling.d(), tuning);
  }

  public static eFlat(tuning?: Tuning): MajorScale {
    if (!tuning || tuning.equiv(Tuning.standard())) {
      return MajorScale._getStandard(Spelling.e(Accidental.flat()));
    }
    return MajorScale.fromTonic(Spelling.e(Accidental.flat()), tuning);
  }

  public static e(tuning?: Tuning): MajorScale {
    if (!tuning || tuning.equiv(Tuning.standard())) {
      return MajorScale._getStandard(Spelling.e());
    }
    return MajorScale.fromTonic(Spelling.e(), tuning);
  }

  public static f(tuning?: Tuning): MajorScale {
    if (!tuning || tuning.equiv(Tuning.standard())) {
      return MajorScale._getStandard(Spelling.f());
    }
    return MajorScale.fromTonic(Spelling.f(), tuning);
  }

  public static fSharp(tuning?: Tuning): MajorScale {
    if (!tuning || tuning.equiv(Tuning.standard())) {
      return MajorScale._getStandard(Spelling.f(Accidental.sharp()));
    }
    return MajorScale.fromTonic(Spelling.f(Accidental.sharp()), tuning);
  }

  public static g(tuning?: Tuning): MajorScale {
    if (!tuning || tuning.equiv(Tuning.standard())) {
      return MajorScale._getStandard(Spelling.g());
    }
    return MajorScale.fromTonic(Spelling.g(), tuning);
  }

  public static aFlat(tuning?: Tuning): MajorScale {
    if (!tuning || tuning.equiv(Tuning.standard())) {
      return MajorScale._getStandard(Spelling.a(Accidental.flat()));
    }
    return MajorScale.fromTonic(Spelling.a(Accidental.flat()), tuning);
  }

  public static a(tuning?: Tuning): MajorScale {
    if (!tuning || tuning.equiv(Tuning.standard())) {
      return MajorScale._getStandard(Spelling.a());
    }
    return MajorScale.fromTonic(Spelling.a(), tuning);
  }

  public static bFlat(tuning?: Tuning): MajorScale {
    if (!tuning || tuning.equiv(Tuning.standard())) {
      return MajorScale._getStandard(Spelling.b(Accidental.flat()));
    }
    return MajorScale.fromTonic(Spelling.b(Accidental.flat()), tuning);
  }

  public static b(tuning?: Tuning): MajorScale {
    if (!tuning || tuning.equiv(Tuning.standard())) {
      return MajorScale._getStandard(Spelling.b());
    }
    return MajorScale.fromTonic(Spelling.b(), tuning);
  }
}
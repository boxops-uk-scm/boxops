import { SortedSet } from "@thi.ng/sorted-map";
import { Spelling } from "./Spelling";
import type { IEquiv } from "@thi.ng/api";
import { FretboardPosition, type StringNumber } from "./Fretboard";
import { Tuning } from "./Tuning";

export function areDisjoint<T>(a: SortedSet<T>, b: SortedSet<T>): boolean {
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];

  for (const x of small) {
    if (large.has(x)) {
      return false;
    }
  }

  return true;
}

export class EnharmonicSpellingEquivalenceClass implements IEquiv {
  private readonly spellings: SortedSet<Spelling>;

  public constructor(...spellings: Spelling[]) {
    this.spellings = new SortedSet(spellings, {
      compare: (a: Spelling, b: Spelling) => {
        return a.hash() - b.hash();
      }
    });
  }

  equiv(o: unknown): boolean {
    return o instanceof EnharmonicSpellingEquivalenceClass && !areDisjoint(this.spellings, o.spellings);
  }

  public toString(): string {
    return Array.from(this.spellings.values()).join(" / ");
  }

  public static random(string?: StringNumber, not?: SortedSet<Spelling>): EnharmonicSpellingEquivalenceClass {
    while (true) {
      const fretboardPosition = FretboardPosition.random(string);
      const spellings = Tuning.standard().relativePitch(fretboardPosition).spellings();
      const equivalenceClass = new EnharmonicSpellingEquivalenceClass(...spellings);

      if (not && !areDisjoint(equivalenceClass.spellings, not)) {
        continue;
      }

      return equivalenceClass;
    }
  }

  public static distinctRandom(count: number, string?: StringNumber, not?: SortedSet<Spelling>): EnharmonicSpellingEquivalenceClass[] {
    const excluded = not ? new EnharmonicSpellingEquivalenceClass(...not.values()) : new EnharmonicSpellingEquivalenceClass();
    const classes: EnharmonicSpellingEquivalenceClass[] = [];

    for (let i = 0; i < count; i++) {
      const equivalenceClass = EnharmonicSpellingEquivalenceClass.random(string, excluded.spellings);
      classes.push(equivalenceClass);
      for (const spelling of equivalenceClass.spellings) {
        excluded.spellings.add(spelling);
      }
    }

    return classes;
  }
}
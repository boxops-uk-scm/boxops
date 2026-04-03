import { SortedSet } from "@thi.ng/sorted-map/sorted-set";

// Declare global seed for SSR consistency
declare global {
  interface Window {
    __ARBITRARY_SEED__?: number;
  }
}

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    
    this.seed = (a * this.seed + c) % m;
    return this.seed / m;
  }

  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }

  boolean(): boolean {
    return this.next() < 0.5;
  }
}

export class Arbitrary {
  private static rng: SeededRandom | null = null;
  private static currentSeed: number | null = null;

  /**
   * Set the seed for random generation (useful for SSR)
   */
  static setSeed(seed: number): void {
    if (typeof window !== 'undefined') {
      window.__ARBITRARY_SEED__ = seed;
    }
    this.currentSeed = seed;
    this.rng = new SeededRandom(seed);
  }

  /**
   * Get current seed value
   */
  static getSeed(): number {
    // If we haven't set a seed yet, generate one
    if (this.currentSeed === null) {
      const seed = typeof window !== 'undefined' && window.__ARBITRARY_SEED__ !== undefined 
        ? window.__ARBITRARY_SEED__
        : this.generateServerSeed();
      this.setSeed(seed);
    }
    return this.currentSeed!;
  }

  /**
   * Generate a server-side seed
   */
  private static generateServerSeed(): number {
    // Use a combination of timestamp and crypto for better randomness
    const timestamp = Date.now();
    const randomBytes = crypto.getRandomValues(new Uint32Array(1))[0];
    const seed = (timestamp + randomBytes) % (2**32);
    return seed;
  }

  /**
   * Get the RNG instance, initializing if needed
   */
  private static getRng(): SeededRandom {
    if (this.rng === null) {
      this.getSeed(); // This will initialize the RNG
    }
    return this.rng!;
  }

  /**
   * Choose a random element from an array, optionally excluding certain values
   */
  static choice<T>(array: T[], not?: SortedSet<T>): T {
    if (array.length === 0) {
      throw new Error("Cannot choose from empty array");
    }

    const maxAttempts = 1000;
    for (let i = 0; i < maxAttempts; i++) {
      const element = array[this.getRng().nextInt(array.length)];
      if (!not || !not.has(element)) {
        return element;
      }
    }

    throw new Error("Failed to generate choice after maximum attempts");
  }

  /**
   * Generate a random boolean
   */
  static boolean(): boolean {
    return this.getRng().boolean();
  }

  /**
   * Generate a random integer between 0 (inclusive) and max (exclusive)
   */
  static integer(max: number): number {
    return this.getRng().nextInt(max);
  }

  /**
   * Generate a random number between 0 and 1
   */
  static number(): number {
    return this.getRng().next();
  }

  /**
   * Shuffle an array in place using Fisher-Yates algorithm
   */
  static shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.getRng().nextInt(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Generate a list of distinct random values using a generator function
   */
  static distinct<T>(
    generator: (not?: SortedSet<T>) => T,
    count: number,
    not?: SortedSet<T>
  ): T[] {
    let result = new SortedSet<T>();
    while (result.size < count) {
      const existingAndExcluded = not ? new SortedSet<T>([...not, ...result]) : result;
      const item = generator(existingAndExcluded);
      result = result.add(item);
    }
    return this.shuffle(Array.from(result));
  }

  /**
   * Generate a random subset of an array by generating booleans and filtering
   */
  static subset<T>(array: T[]): T[] {
    const booleans = array.map(() => this.boolean());
    return array.filter((_, index) => booleans[index]);
  }

  /**
   * Choose multiple elements from an array without replacement
   */
  static sample<T>(array: T[], count: number): T[] {
    if (count > array.length) {
      throw new Error("Cannot sample more elements than available in array");
    }
    const shuffled = this.shuffle(array);
    return shuffled.slice(0, count);
  }

  /**
   * Generate an array of random booleans of specified length
   */
  static booleans(length: number): boolean[] {
    return Array.from({ length }, () => this.boolean());
  }

  /**
   * Choose a random element from an array with specified probabilities
   * Probabilities should sum to 1.0
   */
  static weightedChoice<T>(choices: T[], weights: number[]): T {
    if (choices.length !== weights.length) {
      throw new Error("Choices and weights arrays must have the same length");
    }
    
    const random = this.number();
    let sum = 0;
    
    for (let i = 0; i < choices.length; i++) {
      sum += weights[i];
      if (random <= sum) {
        return choices[i];
      }
    }
    
    // Fallback to last choice if weights don't sum to 1.0
    return choices[choices.length - 1];
  }
}

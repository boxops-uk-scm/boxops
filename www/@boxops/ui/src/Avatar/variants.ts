import * as stylex from '@stylexjs/stylex';

import { nonsemanticBackgroundColor } from '../tokens.stylex';

import { vars } from './vars.stylex';

/**
 * The tints an avatar falls back to when it has no image.
 *
 * Nine, not ten — the ramp also carries `orange`, but the variant a given name lands on is
 * `hash % count`, so adding one would re-colour every existing avatar. Left as the v2 set.
 */
export const variants = stylex.create({
  gray: { [vars.backgroundColor]: nonsemanticBackgroundColor.gray },
  blue: { [vars.backgroundColor]: nonsemanticBackgroundColor.blue },
  green: { [vars.backgroundColor]: nonsemanticBackgroundColor.green },
  yellow: { [vars.backgroundColor]: nonsemanticBackgroundColor.yellow },
  red: { [vars.backgroundColor]: nonsemanticBackgroundColor.red },
  pink: { [vars.backgroundColor]: nonsemanticBackgroundColor.pink },
  purple: { [vars.backgroundColor]: nonsemanticBackgroundColor.purple },
  teal: { [vars.backgroundColor]: nonsemanticBackgroundColor.teal },
  cyan: { [vars.backgroundColor]: nonsemanticBackgroundColor.cyan },
});

export type Variant = keyof typeof variants;

const VARIANT_NAMES = Object.keys(variants) as Variant[];

export function getHash(seed?: string): number {
  if (!seed) return 0;

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  return hash;
}

/** Picks a stable tint for a seed, so the same person always gets the same colour. */
export function getVariant(seed?: string): Variant {
  return VARIANT_NAMES[Math.abs(getHash(seed)) % VARIANT_NAMES.length];
}

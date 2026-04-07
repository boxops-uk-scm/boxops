import type { ComponentState, PolyComponentState, VariantDefs, VariantSelection, XStyleProp } from './types';
import type * as stylex from '@stylexjs/stylex';

export function useVariantStyles<V extends VariantDefs>(
  defs: V,
  selection: VariantSelection<V> | undefined,
  defaults?: VariantSelection<V>,
): stylex.StyleXStyles[] {
  const resolved = { ...defaults, ...selection } as VariantSelection<V>;
  return (Object.keys(defs) as (keyof V & string)[]).flatMap((axis) => {
    const value = resolved[axis];
    if (value === undefined) return [];
    const style = defs[axis][value as string];
    return style !== undefined ? [style] : [];
  });
}

export function useXStyle<State>(state: State, xstyle: XStyleProp<State> | undefined): stylex.StyleXStyles | undefined {
  if (xstyle === undefined) return undefined;
  return typeof xstyle === 'function' ? xstyle(state) : xstyle;
}

export function useComponentStyles<V extends VariantDefs, Extra extends object = Record<never, never>>(
  defs: V,
  state: ComponentState<V, Extra>,
  xstyle: XStyleProp<ComponentState<V, Extra>> | undefined,
  defaults?: VariantSelection<V>,
): stylex.StyleXStyles[] {
  const variantStyles = useVariantStyles(defs, state.variants, defaults);
  const xStyles = useXStyle(state, xstyle);
  return xStyles !== undefined ? [...variantStyles, xStyles] : variantStyles;
}

export function usePolyComponentStyles<V extends VariantDefs, Extra extends object = Record<never, never>>(
  defs: V,
  state: PolyComponentState<V, Extra>,
  xstyle: XStyleProp<PolyComponentState<V, Extra>> | undefined,
  defaults?: VariantSelection<V>,
): stylex.StyleXStyles[] {
  const variantStyles = useVariantStyles(defs, state.variants, defaults);
  const xStyles = useXStyle(state, xstyle);
  return xStyles !== undefined ? [...variantStyles, xStyles] : variantStyles;
}

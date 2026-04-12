import * as stylex from '@stylexjs/stylex';

import type React from 'react';
import type { AsProps, FastComponentPropsWithRef } from 'react-polymorphed';

export type VariantStyles = Record<string, Record<string, stylex.StyleXStyles>>;

export type Variants<VS extends VariantStyles> = {
  [K in keyof VS]?: keyof VS[K];
};

export interface VariantComponentState<V extends Variants<VariantStyles>> {
  variants?: V;
}

export interface PolyComponentState {
  as: React.ElementType;
}

export interface VariantPolyComponentState<V extends Variants<VariantStyles>>
  extends VariantComponentState<V>, PolyComponentState {}

export interface BaseComponentProps {
  xstyle?: stylex.StyleXStyles;
}

export interface BaseVariantComponentProps<V extends Variants<VariantStyles>> extends BaseComponentProps {
  variants?: V;
}

type XStyleWithState<S> = stylex.StyleXStyles | ((state: S) => stylex.StyleXStyles);

export interface BaseComponentPropsWithState<S> {
  xstyle?: XStyleWithState<S>;
}
export interface BaseVariantComponentPropsWithState<
  V extends Variants<VariantStyles>,
  S extends VariantComponentState<V>,
> extends BaseComponentPropsWithState<S> {
  variants?: V;
}

export interface BasePolyComponentProps<S extends PolyComponentState> extends BaseComponentPropsWithState<S> {
  as?: React.ElementType;
}

export interface BaseVariantPolyComponentProps<
  V extends Variants<VariantStyles>,
  S extends VariantPolyComponentState<V>,
> extends BaseVariantComponentPropsWithState<V, S> {
  as?: React.ElementType;
}

type OmittedKeys = 'className' | 'style';

export type ComponentProps<E extends React.ElementType> = BaseComponentProps & Omit<FastComponentPropsWithRef<E>, OmittedKeys>;

export type ComponentPropsWithState<E extends React.ElementType, S> = BaseComponentPropsWithState<S> &
  Omit<FastComponentPropsWithRef<E>, OmittedKeys>;

export type VariantComponentProps<E extends React.ElementType, V extends Variants<VariantStyles>> = BaseVariantComponentProps<V> &
  Omit<FastComponentPropsWithRef<E>, OmittedKeys>;

export type VariantComponentPropsWithState<
  E extends React.ElementType,
  V extends Variants<VariantStyles>,
  S extends VariantComponentState<V>,
> = BaseVariantComponentPropsWithState<V, S> & Omit<FastComponentPropsWithRef<E>, OmittedKeys>;

export type PolyComponentProps<
  E extends React.ElementType,
  S extends PolyComponentState,
  BaseProps extends BasePolyComponentProps<S>,
> = AsProps<E, BaseProps, Omit<FastComponentPropsWithRef<E>, OmittedKeys>>;

export type VariantPolyComponentProps<
  E extends React.ElementType,
  V extends Variants<VariantStyles>,
  S extends VariantPolyComponentState<V>,
  BaseProps extends BaseVariantPolyComponentProps<V, S>,
> = AsProps<E, BaseProps, Omit<FastComponentPropsWithRef<E>, OmittedKeys>>;

export type RenderFunction<P = unknown> = React.ReactNode | ((props: P) => React.ReactNode);

export type RenderFunctionWithState<S, P = unknown> = React.ReactNode | ((props: P, state: S) => React.ReactNode);

export function useRenderFunction<P>(renderProp: RenderFunction<P>, props: P): React.ReactNode {
  if (typeof renderProp === 'function') {
    return renderProp(props);
  }
  return renderProp;
}

export function useRenderFunctionWithState<S, P = unknown>(
  renderProp: RenderFunctionWithState<S, P>,
  props: P,
  state: S,
): React.ReactNode {
  if (typeof renderProp === 'function') {
    return renderProp(props, state);
  }
  return renderProp;
}

export function useComponentStyle(baseStyle: stylex.StyleXStyles, xstyle: stylex.StyleXStyles): stylex.StyleXStyles {
  return [baseStyle, xstyle];
}

export function useComponentStyleWithState<S>(state: S, xstyle?: XStyleWithState<S>): stylex.StyleXStyles {
  const userStyle = typeof xstyle === 'function' ? xstyle(state) : xstyle;
  return [userStyle];
}

export function usePolyComponentStyle<
  Default extends OnlyAs,
  S extends PolyComponentState,
  OnlyAs extends React.ElementType = Default,
>(
  state: S,
  baseStyle: stylex.StyleXStyles,
  xstyle?: XStyleWithState<S>,
  getElementStyle?: (as: OnlyAs) => stylex.StyleXStyles,
): stylex.StyleXStyles {
  const userStyle = typeof xstyle === 'function' ? xstyle(state) : xstyle;
  const elementStyle = getElementStyle ? getElementStyle(state.as as OnlyAs) : undefined;
  return [baseStyle, elementStyle, userStyle];
}

export function useVariantStyle<V extends Variants<VariantStyles>>(
  variantStyles: VariantStyles,
  variants?: V,
  defaults?: V,
): stylex.StyleXStyles {
  const resolvedVariants = { ...defaults, ...variants };
  return Object.keys(variantStyles).flatMap((axis) => {
    const value = resolvedVariants[axis];
    if (value === undefined) return undefined;
    return variantStyles[axis][value as string];
  });
}

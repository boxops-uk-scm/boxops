import type * as stylex from '@stylexjs/stylex';
import type React from 'react';
import type { AsProps, FastComponentPropsWithRef } from 'react-polymorphed';

export type VariantDefs = Record<string, Record<string, stylex.StyleXStyles>>;

export type VariantSelection<V extends VariantDefs> = {
  [K in keyof V]?: keyof V[K];
};

export type ComponentState<V extends VariantDefs, ExtraState extends object = Record<never, never>> = {
  variantSelection: VariantSelection<V>;
} & ExtraState;

export type PolyComponentState<
  V extends VariantDefs,
  ExtraState extends object = Record<never, never>,
> = ComponentState<V, ExtraState> & { as: React.ElementType };

export type XStyleProp<State> = stylex.StyleXStyles | ((state: State) => stylex.StyleXStyles);

type OmittedHTMLProps = 'className' | 'color' | 'style' | 'defaultValue' | 'defaultChecked';

export type BaseProps<V extends VariantDefs, State extends ComponentState<V, object>> = {
  variantSelection?: VariantSelection<V>;
  xstyle?: XStyleProp<State>;
};

export type ComponentProps<
  Tag extends React.ElementType,
  V extends VariantDefs,
  ExtraState extends object = Record<never, never>,
  OwnProps extends object = Record<never, never>,
> = OwnProps &
  BaseProps<V, ComponentState<V, ExtraState>> &
  Omit<
    FastComponentPropsWithRef<Tag>,
    keyof OwnProps | keyof BaseProps<V, ComponentState<V, ExtraState>> | OmittedHTMLProps
  >;

export type PolyBaseProps<
  V extends VariantDefs,
  ExtraState extends object = Record<never, never>,
  OwnProps extends object = Record<never, never>,
  OnlyAs extends React.ElementType = React.ElementType,
> = OwnProps &
  BaseProps<V, PolyComponentState<V, ExtraState>> & {
    as?: OnlyAs;
  };

export type PolyComponentProps<
  Tag extends React.ElementType,
  V extends VariantDefs,
  ExtraState extends object = Record<never, never>,
  OwnProps extends object = Record<never, never>,
  OnlyAs extends React.ElementType = React.ElementType,
> = AsProps<
  Tag,
  PolyBaseProps<V, ExtraState, OwnProps, OnlyAs>,
  Omit<FastComponentPropsWithRef<Tag>, keyof PolyBaseProps<V, ExtraState, OwnProps, OnlyAs> | OmittedHTMLProps>
>;

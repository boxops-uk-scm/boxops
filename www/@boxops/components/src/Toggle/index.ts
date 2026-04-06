import internal_button from '../Button';

import { styles } from './styles';
import * as internal from './Toggle';
import { variants } from './variants';

const Toggle = Object.assign(internal.default, {
  styles,
  variants,
});

namespace Toggle {
  export type Props = internal.Props;
  export type StateProps = internal.StateProps;
  export type ButtonProps = internal.ButtonProps;
  export type IconRenderProps = internal_button.IconRenderProps;
  export type Variant = keyof typeof variants;
}

export default Toggle;

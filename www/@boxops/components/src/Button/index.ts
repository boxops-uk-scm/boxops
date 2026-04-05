import * as internal from './Button';
import { styles } from './styles';
import { variants } from './variants';

const Button = Object.assign(internal.default, {
  styles,
  variants,
});

namespace Button {
  export type Props = internal.Props;
  export type RenderProps = internal.RenderProps;
}

export default Button;

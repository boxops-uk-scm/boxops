import * as internal from './Badge';
import * as internal_dot from './Dot';
import { styles } from './styles';
import { variants } from './variants';

const Badge = Object.assign(internal.default, {
  Dot: internal_dot.default,
  styles,
  variants,
});

namespace Badge {
  export type Props = internal.Props;
}

export default Badge;

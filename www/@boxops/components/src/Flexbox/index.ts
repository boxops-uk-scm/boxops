
import * as internal from './Flexbox';
import { styles } from './styles';
import { variants } from './variants';

const Flexbox = Object.assign(internal.default, {
  styles,
  variants,
});

namespace Flexbox {
  export type Props = internal.Props;
}

export default Flexbox;

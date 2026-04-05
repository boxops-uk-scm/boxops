export { default as OnDarkMedia } from './OnDarkMedia';
export { default as OnLightMedia } from './OnLightMedia';
import * as internal from './Spinner';
import { styles } from './styles';
import { variants } from './variants';

const Spinner = Object.assign(internal.default, {
  styles,
  variants,
});

namespace Spinner {
  export type Props = internal.Props;
  export type Size = internal.Props['size'];
  export type Variant = internal.Props['variant'];
}

export default Spinner;

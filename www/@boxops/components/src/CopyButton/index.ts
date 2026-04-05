import internal_button from '../Button';

import * as internal from './CopyButton';
import { styles } from './styles';

const CopyButton = Object.assign(internal.default, {
  styles,
  variants: internal_button.variants,
});

namespace CopyButton {
  export type Props = internal.Props;
  export type Variant = internal_button.Variant;
}

export default CopyButton;

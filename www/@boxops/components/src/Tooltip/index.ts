import { styles } from './styles';
import * as internal from './Tooltip';

const Component = Object.assign(internal.default, {
  styles,
});

namespace Component {
  export type Props = internal.Props;
}

export default Component;

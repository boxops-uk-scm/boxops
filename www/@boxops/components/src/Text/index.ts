import { styles } from './styles';
import * as internal from './Text';
import { variants } from './variants';

import type { ComponentPropsWithRef, ElementType } from 'react';
import type { AsProps } from 'react-polymorphed';

const Text = Object.assign(internal.default, {
  styles,
  variants,
});

namespace Text {
  export type Props<T extends ElementType> = AsProps<T, internal.Props, ComponentPropsWithRef<T>>;
}

export default Text;

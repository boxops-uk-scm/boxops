import * as React from 'react';

import type { SVGProps } from 'react';
const SvgSolid = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 256 256" {...props}>
    <path d="M232 128A104 104 0 1 1 128 24a104.13 104.13 0 0 1 104 104" />
  </svg>
);
export default SvgSolid;

import * as React from 'react';

import type { SVGProps } from 'react';
const SvgDot = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <circle cx={12} cy={12.28} r={2} />
  </svg>
);
export default SvgDot;

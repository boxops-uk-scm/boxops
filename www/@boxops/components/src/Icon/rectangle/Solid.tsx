import * as React from 'react';
import type { SVGProps } from 'react';
const SvgSolid = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 256 256" {...props}>
    <path d="M232 56v144a16 16 0 0 1-16 16H40a16 16 0 0 1-16-16V56a16 16 0 0 1 16-16h176a16 16 0 0 1 16 16" />
  </svg>
);
export default SvgSolid;

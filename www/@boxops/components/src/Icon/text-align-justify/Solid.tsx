import * as React from 'react';
import type { SVGProps } from 'react';
const SvgSolid = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 256 256" {...props}>
    <path d="M208 32H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16m-16 152H64a8 8 0 0 1 0-16h128a8 8 0 0 1 0 16m0-32H64a8 8 0 0 1 0-16h128a8 8 0 0 1 0 16m0-32H64a8 8 0 0 1 0-16h128a8 8 0 0 1 0 16m0-32H64a8 8 0 0 1 0-16h128a8 8 0 0 1 0 16" />
  </svg>
);
export default SvgSolid;

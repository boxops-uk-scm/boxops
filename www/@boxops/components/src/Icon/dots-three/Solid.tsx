import * as React from 'react';
import type { SVGProps } from 'react';
const SvgSolid = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 256 256" {...props}>
    <path d="M224 80H32a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16M60 140a12 12 0 1 1 12-12 12 12 0 0 1-12 12m68 0a12 12 0 1 1 12-12 12 12 0 0 1-12 12m68 0a12 12 0 1 1 12-12 12 12 0 0 1-12 12" />
  </svg>
);
export default SvgSolid;

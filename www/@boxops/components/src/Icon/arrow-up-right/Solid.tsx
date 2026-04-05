import * as React from 'react';
import type { SVGProps } from 'react';
const SvgSolid = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 256 256" {...props}>
    <path d="M200 64v104a8 8 0 0 1-13.66 5.66L140 127.31l-70.34 70.35a8 8 0 0 1-11.32-11.32L128.69 116 82.34 69.66A8 8 0 0 1 88 56h104a8 8 0 0 1 8 8" />
  </svg>
);
export default SvgSolid;

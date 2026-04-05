import * as React from 'react';
import type { SVGProps } from 'react';
const SvgOnDarkMedia = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <g>
      <path
        d="M12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7V2C6.48 2 2 6.48 2 12s4.48 10 10 10c2.38 0 4.57-.84 6.29-2.23l-2.14-2.14A6.93 6.93 0 0 1 12 19"
        className="on-dark-media_svg__cls-2"
      />
      <path
        d="M22 12c0-5.52-4.48-10-10-10v3a6.995 6.995 0 0 1 4.15 12.63l2.14 2.14A9.98 9.98 0 0 0 22 12"
        style={{
          opacity: 0.7,
          fill: '#fff',
        }}
      />
      <animateTransform
        attributeName="transform"
        dur="0.75s"
        repeatCount="indefinite"
        type="rotate"
        values="0 12 12;360 12 12"
      />
    </g>
  </svg>
);
export default SvgOnDarkMedia;

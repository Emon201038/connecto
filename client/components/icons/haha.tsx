import * as React from "react";
import { SVGProps } from "react";
const Haha = (props: SVGProps<SVGSVGElement>) => (
  <svg
    height={2500}
    width={2500}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 192 192"
    {...props}
  >
    <radialGradient
      id="a"
      cy="0%"
      gradientTransform="matrix(0 1 -1.26314 0 .5 -.5)"
      r="100%"
    >
      <stop offset={0} stopColor="#fce16b" />
      <stop offset={0.11} stopColor="#fce16b" />
      <stop offset={0.205} stopColor="#fce06a" />
      <stop offset={0.288} stopColor="#fcdf69" />
      <stop offset={0.36} stopColor="#fcdd68" />
      <stop offset={0.424} stopColor="#fbda66" />
      <stop offset={0.483} stopColor="#fbd764" />
      <stop offset={0.537} stopColor="#fbd361" />
      <stop offset={0.591} stopColor="#facf5e" />
      <stop offset={0.644} stopColor="#fac959" />
      <stop offset={0.701} stopColor="#f9c254" />
      <stop offset={0.763} stopColor="#f8bb4e" />
      <stop offset={0.832} stopColor="#f8b147" />
      <stop offset={0.91} stopColor="#f7a73d" />
      <stop offset={1} stopColor="#f69a31" />
    </radialGradient>
    <radialGradient
      id="b"
      cy="100%"
      gradientTransform="matrix(0 -1 1.136 0 -.636 1.5)"
      r="100%"
    >
      <stop offset={0} stopColor="#83370e" />
      <stop offset={0.226} stopColor="#83370e" />
      <stop offset={1} stopColor="#482213" />
    </radialGradient>
    <radialGradient
      id="c"
      cy="0%"
      gradientTransform="matrix(0 1 -.7355 0 .5 -.5)"
      r="100%"
    >
      <stop offset={0} stopColor="#f75b73" />
      <stop offset={1} stopColor="#c51f2d" />
    </radialGradient>
    <filter id="d" height="116.4%" width="112.8%" x="-6.4%" y="-8.2%">
      <feGaussianBlur in="SourceGraphic" stdDeviation={1} />
    </filter>
    <filter id="e" height="116.4%" width="112.8%" x="-6.4%" y="-8.2%">
      <feGaussianBlur in="SourceGraphic" stdDeviation={1} />
    </filter>
    <linearGradient id="f" x1="85.463%" y1="19.628%" y2="80.372%">
      <stop offset={0} stopColor="#222845" />
      <stop offset={0.086} stopColor="#222845" />
      <stop offset={0.166} stopColor="#232946" />
      <stop offset={0.239} stopColor="#232b48" />
      <stop offset={0.308} stopColor="#242d4a" />
      <stop offset={0.374} stopColor="#262f4c" />
      <stop offset={0.438} stopColor="#27314e" />
      <stop offset={0.5} stopColor="#283350" />
      <stop offset={0.562} stopColor="#293552" />
      <stop offset={0.626} stopColor="#2a3754" />
      <stop offset={0.692} stopColor="#2b3956" />
      <stop offset={0.761} stopColor="#2c3a58" />
      <stop offset={0.834} stopColor="#2c3b59" />
      <stop offset={0.914} stopColor="#2d3c5a" />
      <stop offset={1} stopColor="#2d3c5a" />
    </linearGradient>
    <g fill="none" fillRule="evenodd">
      <circle cx={96} cy={96} fill="url(#a)" r={96} />
      <path
        d="M96 166c38.66 0 64-31.34 64-70 0-.66-7-13-64-13S32 95.34 32 96c0 38.66 25.34 70 64 70z"
        fill="url(#b)"
      />
      <path
        d="M52.272 148.44C60.808 139.232 77.192 133 96 133s35.192 6.231 43.728 15.44C128.75 159.368 113.785 166 96 166s-32.75-6.633-43.728-17.56z"
        fill="url(#c)"
      />
      <path
        d="M143.907 39.169c-8.207 2.389-27.788 13.373-30.542 17.594s-.61 9.333 2.895 10.056c9.102 0 24.787 2.671 35.424 7.776 5.94 3.015 9.499-5.293 5.66-7.776-5.597-4.395-14.439-7.194-26.525-8.397.991-3.035 12.582-8.024 18.07-10.617 5.49-2.593 3.226-11.026-4.982-8.636z"
        fill="#fff3c5"
        filter="url(#d)"
        opacity={0.449}
      />
      <path
        d="M64.797 39.169C56.59 41.558 37.01 52.542 34.255 56.763s-.61 9.333 2.895 10.056c9.102 0 24.787 2.671 35.424 7.776 5.94 3.015 9.499-5.293 5.66-7.776-5.597-4.395-14.439-7.194-26.525-8.397.991-3.035 12.583-8.024 18.071-10.617 5.488-2.593 3.225-11.026-4.983-8.636z"
        fill="#fff3c5"
        filter="url(#e)"
        opacity={0.449}
        transform="matrix(-1 0 0 1 112.83 0)"
      />
      <g fill="url(#f)">
        <path d="M143.907 35.169c-8.207 2.389-27.788 13.373-30.542 17.594s-.61 9.333 2.895 10.056c9.102 0 24.787 2.671 35.424 7.776 5.94 3.015 9.499-5.293 5.66-7.776-5.597-4.395-14.439-7.194-26.525-8.397.991-3.035 12.582-8.024 18.07-10.617 5.49-2.593 3.226-11.026-4.982-8.636zM48.032 35.169c8.208 2.389 27.789 13.373 30.543 17.594s.61 9.333-2.896 10.056c-9.101 0-24.786 2.671-35.423 7.776-5.94 3.015-9.499-5.293-5.66-7.776 5.597-4.395 14.438-7.194 26.525-8.397-.992-3.035-12.583-8.024-18.071-10.617-5.489-2.593-3.225-11.026 4.982-8.636z" />
      </g>
    </g>
  </svg>
);
export default Haha;

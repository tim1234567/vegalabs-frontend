import { SvgIcon } from '@mui/material';
import * as React from 'react';

function SuccessIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16">
      <defs>
        <linearGradient x1="50%" y1="100%" x2="50%" y2="0%" id="SuccessIcon-a">
          <stop stopColor="#33A455" offset="0%" />
          <stop stopColor="#6BFF97" offset="100%" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <circle stroke="#0A0A0E" fill="url(#SuccessIcon-a)" cx="8" cy="8" r="6.5" />
        <path
          d="M7.119 11.725a.6.6 0 0 0 .533-.28l3.751-5.811a.676.676 0 0 0 .132-.38c0-.31-.225-.53-.542-.53-.216 0-.347.077-.482.288l-3.41 5.401-1.746-2.216a.524.524 0 0 0-.452-.233c-.318 0-.546.225-.546.533 0 .136.046.267.16.402l2.073 2.56c.148.181.309.266.529.266z"
          fill="#FFF"
          fillRule="nonzero"
        />
      </g>
    </SvgIcon>
  );
}

export { SuccessIcon };

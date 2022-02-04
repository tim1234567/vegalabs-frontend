import { SvgIcon } from '@mui/material';
import * as React from 'react';

function FailedIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16">
      <defs>
        <linearGradient x1="99.373%" y1="50.627%" x2=".627%" y2="50.627%" id="FailedIcon-a">
          <stop stopColor="#ED7FBD" offset="0%" />
          <stop stopColor="#EF349B" offset="100%" />
        </linearGradient>
      </defs>
      <g transform="translate(1 1)" fill="none" fillRule="evenodd">
        <circle stroke="#0A0A0E" fill="url(#FailedIcon-a)" cx="7" cy="7" r="6.5" />
        <path
          d="M6.943 11.041c-.519 0-.993-.392-.993-.948 0-.546.465-.947.993-.947.53 0 .994.392.994.947 0 .556-.474.948-.994.948z"
          fill="#FFF"
        />
        <path stroke="#FFF" strokeLinecap="round" strokeLinejoin="round" d="M6.943 3.267v4.75" />
      </g>
    </SvgIcon>
  );
}

export { FailedIcon };

import { SvgIcon } from '@mui/material';
import * as React from 'react';

function WaitingTxIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16">
      <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="WaitingTxIcon-a">
          <stop stopColor="#574CF2" offset="0%" />
          <stop stopColor="#4236D0" offset="100%" />
        </linearGradient>
      </defs>
      <g transform="translate(1 1)" fill="none" fillRule="evenodd">
        <circle stroke="#0A0A0E" fill="url(#WaitingTxIcon-a)" cx="7" cy="7" r="6.5" />
        <path
          stroke="#FFF"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.29 8.167h3.877V3.485"
        />
      </g>
    </SvgIcon>
  );
}

export { WaitingTxIcon };

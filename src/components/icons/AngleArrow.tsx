import { SvgIcon } from '@mui/material';
import * as React from 'react';

function AngleArrow(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 18 18">
      <g
        fill="none"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
        transform="translate(0,1)"
      >
        <path d="M7.872 13.592l5.2-5.201M13.073 8.391L7.872 3.19" />
      </g>
    </SvgIcon>
  );
}

export { AngleArrow };

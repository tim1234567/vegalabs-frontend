import { SvgIcon } from '@mui/material';
import * as React from 'react';

function WaitingIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 12 12">
      <g stroke="#FFF" fill="none" fillRule="evenodd">
        <circle cx="6" cy="6" r="5.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.676 7H7V2.987" />
      </g>
    </SvgIcon>
  );
}

export { WaitingIcon };

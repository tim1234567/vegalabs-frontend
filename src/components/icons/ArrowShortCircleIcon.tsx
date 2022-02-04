import { SvgIcon } from '@mui/material';
import * as React from 'react';

function ArrowShortCircleIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 28 28">
      <g fill="none" fillRule="evenodd">
        <rect
          strokeOpacity=".15"
          stroke="#FFF"
          fill="#0A0A0E"
          opacity=".4"
          width="28"
          height="28"
          rx="14"
        />
        <path fillOpacity=".01" fill="#13131B" d="M21 22V6H5v16z" />
        <path
          d="M10.31 13.963a.666.666 0 0 1 .223-.5l4.343-4.336a.674.674 0 0 1 .479-.208.626.626 0 0 1 .645.638c0 .093-.016.18-.049.26a.623.623 0 0 1-.138.212l-1.471 1.499-2.018 1.822c-.272.262-.409.462-.41.6-.002.138.13.344.395.62l2.033 1.828 1.47 1.492c.06.06.107.13.14.211.032.081.048.168.048.26a.614.614 0 0 1-.184.459.632.632 0 0 1-.461.18.674.674 0 0 1-.479-.208l-4.343-4.337a.697.697 0 0 1-.167-.232.65.65 0 0 1-.055-.26z"
          fill="#FFF"
          fillRule="nonzero"
        />
      </g>
    </SvgIcon>
  );
}

export { ArrowShortCircleIcon };

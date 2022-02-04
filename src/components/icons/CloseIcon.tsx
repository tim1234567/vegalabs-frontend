import * as React from 'react';
import cn from 'classnames';
import { SvgIcon } from '@mui/material';

import { makeStyles } from 'core/styles';

type Props = {
  withoutHover?: boolean;
};

function CloseIcon({ withoutHover, ...props }: Props & React.ComponentProps<typeof SvgIcon>) {
  const classes = useStyles();
  return (
    <SvgIcon
      {...props}
      viewBox="0 0 24 24"
      classes={{ root: cn(classes.root, { [classes.withoutHover]: withoutHover }) }}
    >
      <g fill="none" fillRule="evenodd">
        <path d="M0 0h24v24H0z" />
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.34 6.84l11.32 11.32M6.34 18.16L17.66 6.84" />
        </g>
      </g>
    </SvgIcon>
  );
}

const useStyles = makeStyles(() => ({
  root: {
    opacity: 0.5,

    '&:hover, &$withoutHover': {
      opacity: 1,
    },
  },

  withoutHover: {},
}));

export { CloseIcon };

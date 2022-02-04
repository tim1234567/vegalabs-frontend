import { Theme, alpha } from '@mui/material';
import { makeStyles as muiMakeStyles } from '@mui/styles';
import { Styles, WithStylesOptions } from '@mui/styles/withStyles';

export { useTheme, lighten, darken, styled } from '@mui/material/styles';

export * from './theme';
export * from './useBreakpointsMatch';

export { alpha };

// eslint-disable-next-line @typescript-eslint/ban-types
export function makeStyles<Props extends object = {}, ClassKey extends string = string>(
  styles: Styles<Theme, Props, ClassKey>,
  options?: Omit<WithStylesOptions<Theme>, 'withTheme'>,
) {
  return muiMakeStyles<Theme, Props, ClassKey>(styles, options);
}

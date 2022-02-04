import { useMediaQuery } from '@mui/material';
import { O } from 'ts-toolbelt';

import { useFromToQuery, Breakpoints } from './useFromToQuery';

export function useBreakpointsMatch(
  points: O.Optional<Breakpoints, 'from'> | O.Optional<Breakpoints, 'to'>,
): boolean {
  const query = useFromToQuery(points);
  const matched = useMediaQuery(query);

  return !!matched;
}

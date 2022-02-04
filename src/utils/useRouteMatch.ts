import { useRouter } from 'next/router';
import pathToRegexp from 'path-to-regexp';

type MaybeArray<T> = T | T[];
type Path = { getRoutePath(): string } | string;

export function useRouteMatch(path: MaybeArray<Path>, exact: boolean = true): boolean {
  const currentPath = useRouter();
  const regexpOptions = { end: exact, endsWith: ['?'] };

  const pathStrings = toPathStrings(path);
  const regexps = pathStrings.map(pathString => pathToRegexp(pathString, [], regexpOptions));
  return regexps.some(regexp => regexp.exec(currentPath.asPath));
}

function toPathStrings(path: MaybeArray<Path>): string[] {
  const paths = Array.isArray(path) ? path : [path];
  return paths.map(p => (typeof p === 'string' ? p : p.getRoutePath()));
}

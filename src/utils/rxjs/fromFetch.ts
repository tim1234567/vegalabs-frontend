import { Observable, ObservableInput } from 'rxjs';
// eslint-disable-next-line no-restricted-imports
import { fromFetch as rxFromFetch } from 'rxjs/fetch';
import { catchError } from 'rxjs/operators';

export function fromFetch<T>(
  input: string | Request,
  init: RequestInit & {
    selector: (response: Response) => ObservableInput<T>;
  },
): Observable<T>;
export function fromFetch(input: string | Request, init?: RequestInit): Observable<Response>;
export function fromFetch<T>(
  input: string | Request,
  init?: RequestInit & {
    selector?: (response: Response) => ObservableInput<T>;
  },
) {
  return rxFromFetch(input, init).pipe(
    catchError((error: Error | unknown) => {
      if (withMessage(error)) {
        // eslint-disable-next-line no-param-reassign
        error.message = `${error.message} [request: ${JSON.stringify(input)}]`;
      }
      throw error;
    }),
  );
}

function withMessage(value: any): value is { message: string } {
  return Boolean(
    value && typeof value === 'object' && 'message' in value && typeof value.message === 'string',
  );
}

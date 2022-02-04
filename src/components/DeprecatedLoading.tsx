import React from 'react';
import {
  CircularProgress,
  CircularProgressProps,
  LinearProgress,
  LinearProgressProps,
  Skeleton,
  SkeletonProps,
  Typography,
} from '@mui/material';

import { SubSet, MaybeArray } from 'utils/types';
import { toArray } from 'utils/array';
import { CommunicationState } from 'utils/react';
import { makeStyles } from 'core/styles';

interface IMeta {
  loaded: boolean;
  error?: string | null;
}

type ProgressVariant = 'linear' | 'circle' | 'skeleton';

type DefaultProgressVariant = SubSet<ProgressVariant, 'skeleton'>;
const defaultProgressVariant: DefaultProgressVariant = 'skeleton';

interface IProps<V extends ProgressVariant> {
  children?: React.ReactNode;
  meta?: MaybeArray<IMeta>;
  communication?: MaybeArray<CommunicationState<any, any>>;
  component?: React.ComponentType;
  loader?: React.ReactNode;
  progressVariant?: V;
  progressProps?: {
    linear: LinearProgressProps;
    circle: CircularProgressProps;
    skeleton: SkeletonProps;
  }[V];
  ignoreError?: boolean;
}

const useStyles = makeStyles({
  linearProgress: {
    flexGrow: 1,
  },
});

function communicationsToMetas(values: MaybeArray<CommunicationState<any, any>>): IMeta[] {
  return toArray(values).map<IMeta>(value => ({
    loaded: value.status !== 'pending',
    error: value.error,
  }));
}

export function DeprecatedLoading<T extends ProgressVariant = DefaultProgressVariant>(
  props: IProps<T>,
) {
  const classes = useStyles();
  const {
    children,
    loader,
    progressVariant = defaultProgressVariant,
    progressProps,
    component,
    ignoreError,
    meta = [],
    communication = [],
  } = props;
  const metas = [...toArray(meta), ...communicationsToMetas(communication)];

  const loaded = metas.every(value => value.loaded);
  const { error } = metas.find(value => value.error) || { error: null };

  const Wrapper = component || React.Fragment;

  const needToShowError = !!error && !ignoreError;

  return (
    <>
      {!loaded && (
        <Wrapper>
          {loader ||
            {
              // eslint-disable-next-line react/no-unstable-nested-components
              linear: () => (
                <LinearProgress
                  className={classes.linearProgress}
                  {...(progressProps as LinearProgressProps)}
                />
              ),
              // eslint-disable-next-line react/no-unstable-nested-components
              circle: () => <CircularProgress {...(progressProps as CircularProgressProps)} />,
              // eslint-disable-next-line react/no-unstable-nested-components
              skeleton: () => <Skeleton {...(progressProps as SkeletonProps)} />,
            }[progressVariant]()}
        </Wrapper>
      )}
      {loaded && needToShowError && (
        <Wrapper>
          <Typography color="error">{error}</Typography>
        </Wrapper>
      )}
      {loaded && !needToShowError && children}
    </>
  );
}

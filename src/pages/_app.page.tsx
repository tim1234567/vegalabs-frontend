import 'reflect-metadata';
import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Fraction } from '@akropolis-web/primitives';
import { Container } from 'typedi';

import { ErrorBoundary, CssBaseline, ThemeProvider, NoSsr } from 'components';
import { BaseLayout } from 'components/BaseLayout';
import { GlobalTxStatusesProvider } from 'services/transactions';
import { ContainerProvider } from 'core/di';
import { theme } from 'core/styles';
import { AuthProvider } from 'services/auth';

if (typeof window === 'object') {
  (window as any).Fraction = Fraction;
}

function App({ Component, pageProps }: AppProps) {
  const container = Container.of();

  useEffect(() => {
    (window as any).diContainer = container;
  }, [container]);

  return (
    <>
      <Head>
        <title>Vegalabs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ErrorBoundary>
        <NoSsr>
          <GlobalTxStatusesProvider>
            <ThemeProvider theme={theme}>
              <ContainerProvider value={container}>
                <AuthProvider>
                  <CssBaseline />
                  <BaseLayout>
                    <Component {...pageProps} />
                  </BaseLayout>
                </AuthProvider>
              </ContainerProvider>
            </ThemeProvider>
          </GlobalTxStatusesProvider>
        </NoSsr>
      </ErrorBoundary>
    </>
  );
}

// eslint-disable-next-line import/no-default-export
export default App;

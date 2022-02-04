import React, { useCallback, useState } from 'react';

import { Box, ThemeProvider } from 'components';
import { adminTheme } from 'core/styles';

import { GeneratedContractCard } from './GeneratedContractCard';
import { RulesListCard } from './RulesListCard';

function LandingPage() {
  const [generated, setGenerated] = useState(false);
  const onGenerateClick = useCallback(() => setGenerated(true), []);
  const onBack = useCallback(() => setGenerated(false), []);

  return (
    <ThemeProvider theme={adminTheme}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        {generated ? (
          <GeneratedContractCard onBackClick={onBack} />
        ) : (
          <RulesListCard onGenerateClick={onGenerateClick} />
        )}
      </Box>
    </ThemeProvider>
  );
}

// eslint-disable-next-line import/no-default-export
export default LandingPage;

import React from 'react';
import Typography from '@mui/material/Typography';

import { Box, Card } from 'components';
import { OpenShortPositionForm, PositionsList } from 'features/trading';
import { TransactionFlow } from 'services/transactions';
import { MintTokens } from 'features/testToken';

function TradingPage() {
  return (
    <Box sx={{ mt: 7.75, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 0, right: -16, transform: 'translateX(100%)' }}>
          <MintTokens />
        </Box>
        <Card
          variant="outlined"
          sx={{
            p: '22px',
            width: 366,
            minHeight: 370,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <TransactionFlow network="polygon">
            {({ sendTransaction }) => <OpenShortPositionForm sendTransaction={sendTransaction} />}
          </TransactionFlow>
        </Card>
      </Box>

      <Typography
        sx={{ color: '#8B8B8B', fontSize: '15px', mt: 1.25, lineHeight: 1.16, textAlign: 'center' }}
      >
        Powered by Polygon and Chainlink
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontSize: '21px',
          mt: 4.25,
          mb: 1,
          fontWeight: 'normal',
          lineHeight: 1.16,
          textAlign: 'center',
        }}
      >
        Open positions
      </Typography>
      <PositionsList />
    </Box>
  );
}

// eslint-disable-next-line import/no-default-export
export default TradingPage;

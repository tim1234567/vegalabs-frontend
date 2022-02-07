import React from 'react';

import { Typography, Button, Card, Box } from 'components';

export function GeneratedContractCard({ onBackClick }: { onBackClick: () => void }) {
  return (
    <Card variant="outlined" sx={{ maxWidth: '662px', padding: '30px 52px 60px', border: 'none' }}>
      <Typography variant="h4" sx={{ fontSize: '36px' }}>
        Almost done!
      </Typography>
      <Typography
        sx={{
          mt: 1.5,
          mb: 1.5,
          fontWeight: 'normal',
          fontSize: '16px',
          lineHeight: 1.16,
        }}
      >
        Paste the following code into every function to enable Vegalabs for your contract:
      </Typography>
      <Typography
        sx={{
          display: 'inline-block',
          background: '#828282',
          borderRadius: '6px',
          fontFamily: 'monospace',
          color: 'white',
          fontSize: '10px',
          lineHeight: 1.36,
          padding: '10px 14px',
          whiteSpace: 'pre',
        }}
      >
        {`import "vegalabs.checker1.sol";
require(vegalabs.verify_short_position(oldAmount, newAmount, collateralAmount, leverage));`}
      </Typography>
      <Box sx={{ mt: 3.5, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ textTransform: 'none', minWidth: '100px' }}
          onClick={onBackClick}
        >
          Back
        </Button>
      </Box>
    </Card>
  );
}

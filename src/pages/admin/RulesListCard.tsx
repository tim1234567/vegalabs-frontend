import React from 'react';

import { Typography, Card, Box, Button } from 'components';

import { rulesGroups } from './constants';
import { RulesGroupComponent } from './RulesGroupComponent';

export function RulesListCard({ onGenerateClick }: { onGenerateClick: () => void }) {
  return (
    <Card variant="outlined" sx={{ maxWidth: '662px', padding: '30px 52px 60px', border: 'none' }}>
      <Typography variant="h4" sx={{ fontSize: '36px' }}>
        Customer onboarding
      </Typography>
      <Typography
        sx={{
          color: '#BFBFBF',
          fontWeight: 'normal',
          fontSize: '20px',
          lineHeight: 1.16,
          mb: 3,
        }}
      >
        Choose verification rules that are relevant to your smart contract.
      </Typography>
      {rulesGroups.map(group => (
        <RulesGroupComponent key={group.title} group={group} />
      ))}
      <Box sx={{ mt: 3.5, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ textTransform: 'none' }}
          onClick={onGenerateClick}
        >
          Generate Vegalabs contract
        </Button>
      </Box>
    </Card>
  );
}

import React from 'react';

import { Typography, Box, Checkbox, FormControlLabel } from 'components';

import { Rule, RulesGroup } from './constants';

export function RulesGroupComponent({ group }: { group: RulesGroup }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography sx={{ fontSize: '24px', lineHeight: 1.16 }}>{group.title}</Typography>
      {group.rules.map(rule => (
        <RuleComponent key={rule.title} rule={rule} />
      ))}
    </Box>
  );
}
function RuleComponent({ rule }: { rule: Rule }) {
  return (
    <Box sx={{ position: 'relative' }}>
      <FormControlLabel
        sx={{ m: 0 }}
        control={
          <Checkbox
            size="small"
            sx={{ position: 'absolute', top: -2, left: -34 }}
            inputProps={{ 'aria-label': rule.title }}
            disabled={rule.disabled}
          />
        }
        label={
          <>
            <Typography sx={{ mt: 1, fontSize: '16px', lineHeight: 1.16 }}>{rule.title}</Typography>
            <Typography sx={{ fontSize: '16px', lineHeight: 1.16, color: '#BFBFBF' }}>
              {rule.subtitle}
            </Typography>
          </>
        }
      />
    </Box>
  );
}

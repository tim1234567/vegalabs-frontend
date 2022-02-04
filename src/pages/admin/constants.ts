export interface RulesGroup {
  title: string;
  rules: Rule[];
}

export interface Rule {
  title: string;
  subtitle: string;
  disabled?: boolean;
}

export const rulesGroups: RulesGroup[] = [
  {
    title: 'Margin trading rules',
    rules: [
      {
        title: 'Slippage < equity',
        subtitle: 'Slippage should always be less than equity on opening a new position.',
        disabled: false,
      },
      {
        title: 'Limit asset allocation for leverage to 5%',
        subtitle:
          'Traders can’t use margin for new positions in an asset, if existing orders already use 5% of total funds.',
        disabled: true,
      },
    ],
  },
  {
    title: 'Portfolio management rules',
    rules: [
      {
        title: 'Limit position concentration to 2% per asset',
        subtitle: 'No more than 2% of a portfolio can be used for a single asset.',
        disabled: true,
      },
      {
        title: 'Restrict asset’s trading volume to 2% of avg. daily volume',
        subtitle:
          'No more than 2% of asset’s total volume across all exchanges can be traded daily.',
        disabled: true,
      },
      {
        title: 'Limit portfolio rebalance to 5% per hour',
        subtitle: 'Changing portfolio on more than 5% is prohibited.',
        disabled: true,
      },
    ],
  },
  {
    title: 'Lending rules',
    rules: [
      {
        title: 'Collateral tokens always mint the exact quantity of native tokens',
        subtitle: 'E.g., borrow of 1 wETH mints only 1 crwETH token.',
        disabled: true,
      },
      {
        title: 'Burn of a native token frees the exact quantity of collateral token',
        subtitle: 'E.g., burn of 1 crwETH frees exact 1 wETH token.',
        disabled: true,
      },
    ],
  },
  {
    title: 'Simulation rules',
    rules: [
      {
        title: 'Simulate CFMM (constant function market maker) output',
        subtitle:
          'It compares output of your CFMM contract with simulated output. E.g., contract’s output should be equal to “x*y=k”.',
        disabled: true,
      },
      {
        title: 'Simulate custom output',
        subtitle: 'Verify smart contract’s output with a custom simulator.',
        disabled: true,
      },
    ],
  },
];

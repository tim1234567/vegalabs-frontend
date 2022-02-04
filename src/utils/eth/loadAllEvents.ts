import { EventLog } from 'web3-core';

import { getErrorMsg } from '../getErrorMsg';

export async function loadAllEvents(
  contract: {
    getPastEvents: (
      method: string,
      options: { fromBlock: number; toBlock: number | 'latest'; filter?: Record<string, string> },
    ) => Promise<EventLog[]>;
  },
  method: string,
  fromBlock: number,
  toBlock: number,
  filter?: Record<string, string>,
): Promise<EventLog[]> {
  try {
    return await contract.getPastEvents(method, {
      fromBlock,
      toBlock,
      filter,
    });
  } catch (error) {
    const errorMessage = getErrorMsg(error);
    if (
      errorMessage.includes('query returned more than 10000 results') ||
      errorMessage.includes('query timeout exceeded')
    ) {
      const halfBlock = fromBlock + Math.round((toBlock - fromBlock) / 2);

      const eventsData = await Promise.all([
        loadAllEvents(contract, method, fromBlock, halfBlock, filter),
        loadAllEvents(contract, method, halfBlock, toBlock, filter),
      ]);

      return eventsData.flat();
    }
    throw error;
  }
}

import Web3 from 'web3';

// TODO maybe need to memoize
export function getBlockDate(web3: Web3, block: number): Promise<Date> {
  return web3.eth.getBlock(block).then(blockTime => new Date(Number(blockTime.timestamp) * 1000));
}

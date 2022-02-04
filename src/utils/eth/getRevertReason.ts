import Web3 from 'web3';
import { TransactionConfig, TransactionReceipt } from 'web3-core';
import { hexToAscii } from 'web3-utils';

import { getErrorMsg } from 'utils/getErrorMsg';

export async function getRevertReason(receipt: TransactionReceipt, web3: Web3) {
  try {
    if (receipt.status) {
      console.warn('Trying to get revert reason for successful transaction');
      return;
    }
    const tx = await web3.eth.getTransaction(receipt.transactionHash);
    if (!tx) {
      return;
    }
    const code = await web3.eth.call(tx as TransactionConfig, receipt.blockNumber);
    const reason = hexToAscii(code);
    return reason;
  } catch (error) {
    return getErrorMsg(error);
  }
}

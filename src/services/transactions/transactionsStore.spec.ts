import { TransactionReceipt } from 'web3-core';

import { getValue } from 'core/store';
import { loading, success } from 'utils/remoteData';

import { TransactionsStore } from './TransactionsStore';
import { TransactionPayload } from './types';

const receiptMock: TransactionReceipt = 'ReceiptMock' as unknown as TransactionReceipt;

describe('addTxStatus', () => {
  let transactionsStore: TransactionsStore;

  beforeEach(() => {
    transactionsStore = new TransactionsStore();
    transactionsStore.addTxStatus('1', { txHash: '1', result: loading });
    transactionsStore.addTxStatus('2', { txHash: '2', result: loading });
  });

  it('should create new status record and keep old statuses', () => {
    const prevValue = getValue(transactionsStore.txStatuses);
    const args = ['3', { txHash: '3', result: loading }] as const;

    transactionsStore.addTxStatus(...args);
    expect({
      prevValue,
      args,
      result: getValue(transactionsStore.txStatuses),
    }).toMatchSnapshot();
  });

  it('should replace status for existing transaction ID', () => {
    const prevValue = getValue(transactionsStore.txStatuses);
    const args = ['1', { txHash: '111', result: success(receiptMock) }] as const;

    transactionsStore.addTxStatus(...args);
    expect({
      prevValue,
      args,
      result: getValue(transactionsStore.txStatuses),
    }).toMatchSnapshot();
  });
});

describe('updateTxStatus', () => {
  let transactionsStore: TransactionsStore;

  beforeEach(() => {
    transactionsStore = new TransactionsStore();
    transactionsStore.addTxStatus('1', { txHash: '1', result: loading });
    transactionsStore.addTxStatus('2', { txHash: '2', result: loading });
  });

  it('should partially update status for existing transaction ID', () => {
    const prevValue = getValue(transactionsStore.txStatuses);
    const args = ['1', { txHash: '111' }] as const;

    transactionsStore.updateTxStatus(...args);
    expect({
      prevValue,
      args,
      result: getValue(transactionsStore.txStatuses),
    }).toMatchSnapshot();
  });

  it('should not change statuses if they do not contain the transaction ID', () => {
    const prevValue = getValue(transactionsStore.txStatuses);
    const args = ['3', { txHash: '3' }] as const;

    transactionsStore.updateTxStatus(...args);
    expect({
      prevValue,
      args,
      result: getValue(transactionsStore.txStatuses),
    }).toMatchSnapshot();
  });
});

describe('addTransactionPayload', () => {
  let transactionsStore: TransactionsStore;

  beforeEach(() => {
    transactionsStore = new TransactionsStore();
    transactionsStore.addTransactionPayload('1', 'txPayload' as unknown as TransactionPayload);
    transactionsStore.addTransactionPayload('2', 'txPayload' as unknown as TransactionPayload);
  });

  it('should create new payload record and keep old payloads', () => {
    const prevValue = getValue(transactionsStore.transactionPayloads);
    const args = ['3', 'txPayload' as unknown as TransactionPayload] as const;

    transactionsStore.addTransactionPayload(...args);
    expect({
      prevValue,
      args,
      result: getValue(transactionsStore.transactionPayloads),
    }).toMatchSnapshot();
  });

  it('should replace payload for existing transaction ID', () => {
    const prevValue = getValue(transactionsStore.transactionPayloads);
    const args = [
      '1',
      {
        txStatusContent: { title: { long: '111', short: '1' }, network: 'polygon' },
      },
    ] as const;

    transactionsStore.addTransactionPayload(...args);
    expect({
      prevValue,
      args,
      result: getValue(transactionsStore.transactionPayloads),
    }).toMatchSnapshot();
  });
});

describe('switchStatusLocation', () => {
  let transactionsStore: TransactionsStore;

  beforeEach(() => {
    transactionsStore = new TransactionsStore();
    transactionsStore.displayStatusInline('1');
    transactionsStore.displayStatusInline('2');
    transactionsStore.displayStatusGlobal('3');
    transactionsStore.displayStatusGlobal('4');
  });

  it('should keep old statuses if switched status is not found', () => {
    const prevValue = {
      inlineStatuses: getValue(transactionsStore.inlineStatuses),
      globalStatuses: getValue(transactionsStore.globalStatuses),
    };
    const args = '5';
    transactionsStore.switchStatusLocation(args);

    expect({
      prevValue,
      args,
      result: {
        inlineStatuses: getValue(transactionsStore.inlineStatuses),
        globalStatuses: getValue(transactionsStore.globalStatuses),
      },
    }).toMatchSnapshot();
  });

  it('should move status from inline to global', () => {
    const prevValue = {
      inlineStatuses: getValue(transactionsStore.inlineStatuses),
      globalStatuses: getValue(transactionsStore.globalStatuses),
    };
    const args = '2';
    transactionsStore.switchStatusLocation(args);

    expect({
      prevValue,
      args,
      result: {
        inlineStatuses: getValue(transactionsStore.inlineStatuses),
        globalStatuses: getValue(transactionsStore.globalStatuses),
      },
    }).toMatchSnapshot();
  });

  it('should move status from global to inline', () => {
    const prevValue = {
      inlineStatuses: getValue(transactionsStore.inlineStatuses),
      globalStatuses: getValue(transactionsStore.globalStatuses),
    };
    const args = '3';
    transactionsStore.switchStatusLocation(args);

    expect({
      prevValue,
      args,
      result: {
        inlineStatuses: getValue(transactionsStore.inlineStatuses),
        globalStatuses: getValue(transactionsStore.globalStatuses),
      },
    }).toMatchSnapshot();
  });
});

describe('displayStatusInline', () => {
  let transactionsStore: TransactionsStore;

  beforeEach(() => {
    transactionsStore = new TransactionsStore();
    transactionsStore.displayStatusInline('1');
    transactionsStore.displayStatusInline('2');
  });

  it('should add new status id into inlineStatuses queue and keep old statuses', () => {
    const prevValue = getValue(transactionsStore.inlineStatuses);
    const args = '3';
    transactionsStore.displayStatusInline(args);

    expect({
      prevValue,
      args,
      result: getValue(transactionsStore.inlineStatuses),
    }).toMatchSnapshot();
  });

  it('should not duplicate items in inlineStatuses', () => {
    const prevValue = getValue(transactionsStore.inlineStatuses);
    const args = '2';
    transactionsStore.displayStatusInline(args);

    expect({
      prevValue,
      args,
      result: getValue(transactionsStore.inlineStatuses),
    }).toMatchSnapshot();
  });

  it('should remove status from globalStatuses if it exists there', () => {
    const args = '3';

    transactionsStore.displayStatusGlobal(args);
    const prevValue = getValue(transactionsStore.globalStatuses);
    transactionsStore.displayStatusInline(args);

    expect({
      prevValue,
      args,
      result: getValue(transactionsStore.globalStatuses),
    }).toMatchSnapshot();
  });
});

describe('displayStatusGlobal', () => {
  let transactionsStore: TransactionsStore;

  beforeEach(() => {
    transactionsStore = new TransactionsStore();
    transactionsStore.displayStatusGlobal('1');
    transactionsStore.displayStatusGlobal('2');
  });

  it('should add new status id into globalStatuses queue and keep old statuses', () => {
    const prevValue = getValue(transactionsStore.globalStatuses);
    const args = '3';

    transactionsStore.displayStatusGlobal(args);
    expect({
      prevValue,
      args,
      result: getValue(transactionsStore.globalStatuses),
    }).toMatchSnapshot();
  });

  it('should not duplicate items in globalStatuses', () => {
    const prevValue = getValue(transactionsStore.globalStatuses);
    const args = '2';

    transactionsStore.displayStatusGlobal(args);
    expect({
      prevValue,
      args,
      result: getValue(transactionsStore.globalStatuses),
    }).toMatchSnapshot();
  });

  it('should remove status from inlineStatuses if it exists there', () => {
    const args = '3';
    transactionsStore.displayStatusInline(args);
    const prevValue = getValue(transactionsStore.inlineStatuses);
    transactionsStore.displayStatusGlobal(args);

    expect({
      prevValue,
      args,
      result: getValue(transactionsStore.inlineStatuses),
    }).toMatchSnapshot();
  });
});

describe('hideStatus', () => {
  let transactionsStore: TransactionsStore;

  beforeEach(() => {
    transactionsStore = new TransactionsStore();
    transactionsStore.displayStatusGlobal('1');
    transactionsStore.displayStatusGlobal('2');
    transactionsStore.displayStatusInline('3');
    transactionsStore.addTransactionPayload('1', 'txPayload' as unknown as TransactionPayload);
    transactionsStore.addTransactionPayload('2', 'txPayload' as unknown as TransactionPayload);
    transactionsStore.addTransactionPayload('3', 'txPayload' as unknown as TransactionPayload);
    transactionsStore.addTxStatus('1', { txHash: '1', result: success(receiptMock) });
    transactionsStore.addTxStatus('2', { txHash: '2', result: success(receiptMock) });
    transactionsStore.addTxStatus('3', { txHash: '3', result: success(receiptMock) });
  });

  it('should remove tx ID from globalStatuses', () => {
    const prevValue = getValue(transactionsStore.globalStatuses);
    const args = '2';

    transactionsStore.hideStatus(args);
    expect({
      prevValue,
      args,
      result: getValue(transactionsStore.globalStatuses),
    }).toMatchSnapshot();
  });

  it('should remove tx ID from inlineStatuses', () => {
    const prevValue = getValue(transactionsStore.inlineStatuses);
    const args = '3';

    transactionsStore.hideStatus('3');
    expect({
      prevValue,
      args,
      result: getValue(transactionsStore.inlineStatuses),
    }).toMatchSnapshot();
  });

  it('should remove tx status', () => {
    const prevValue = getValue(transactionsStore.txStatuses);
    const args = '2';

    transactionsStore.hideStatus(args);
    expect({
      prevValue,
      args,
      result: getValue(transactionsStore.txStatuses),
    }).toMatchSnapshot();
  });

  it('should remove tx payload', () => {
    const prevValue = getValue(transactionsStore.transactionPayloads);
    const args = '2';

    transactionsStore.hideStatus(args);
    expect({
      prevValue,
      args,
      result: getValue(transactionsStore.transactionPayloads),
    }).toMatchSnapshot();
  });
});

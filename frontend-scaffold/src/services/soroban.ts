import {
  Contract,
  Memo,
  MemoType,
  nativeToScVal,
  Operation,
  scValToNative,
  SorobanRpc,
  TimeoutInfinite,
  Transaction,
  TransactionBuilder,
  xdr,
} from '@stellar/stellar-sdk';

import { env } from '../helpers/env';

export const BASE_FEE = '100';

export const SendTxStatus: {
  [index: string]: SorobanRpc.Api.SendTransactionStatus;
} = {
  Pending: 'PENDING',
  Duplicate: 'DUPLICATE',
  Retry: 'TRY_AGAIN_LATER',
  Error: 'ERROR',
};

/**
 * Get a SorobanRpc.Server instance configured for the network
 * @param sorobanRpcUrl - The Soroban RPC URL
 * @returns Configured SorobanRpc.Server instance
 */
export const getServer = (sorobanRpcUrl: string): SorobanRpc.Server => {
  return new SorobanRpc.Server(sorobanRpcUrl, {
    allowHttp: sorobanRpcUrl.startsWith('http://'),
  });
};

/**
 * Build a transaction with the given operation
 * @param publicKey - The account public key
 * @param operation - The operation to add
 * @param server - The SorobanRpc.Server instance
 * @param networkPassphrase - The network passphrase
 * @returns Built Transaction
 */
export const buildTransaction = async (
  publicKey: string,
  operation: Operation,
  server: SorobanRpc.Server,
  networkPassphrase: string
): Promise<Transaction<Memo<MemoType>, Operation[]>> => {
  const source = await server.getAccount(publicKey);
  const txBuilder = new TransactionBuilder(source, {
    fee: BASE_FEE,
    networkPassphrase,
  });

  return txBuilder.addOperation(operation).setTimeout(TimeoutInfinite).build();
};

/**
 * Simulate a transaction and return the prepared transaction
 * @param tx - The transaction to simulate
 * @param server - The SorobanRpc.Server instance
 * @returns Prepared transaction XDR string
 */
export const simulateTransaction = async (
  tx: Transaction<Memo<MemoType>, Operation[]>,
  server: SorobanRpc.Server
): Promise<string> => {
  const response = await server.simulateTransaction(tx);

  if (
    SorobanRpc.Api.isSimulationError(response) ||
    SorobanRpc.Api.isSimulationRestore(response)
  ) {
    throw new Error(`Simulation failed: ${JSON.stringify(response)}`);
  }

  if (
    SorobanRpc.Api.isSimulationSuccess(response) &&
    response.error === undefined
  ) {
    const preparedTx = SorobanRpc.assembleTransaction(tx, response).build();
    return preparedTx.toXDR();
  }

  throw new Error('Failed to simulate transaction');
};

/**
 * Submit a signed transaction to the network and wait for confirmation
 * @param signedXdr - The signed transaction XDR
 * @param networkPassphrase - The network passphrase
 * @param server - The SorobanRpc.Server instance
 * @returns Transaction result XDR
 */
export const submitTransaction = async (
  signedXdr: string,
  networkPassphrase: string,
  server: SorobanRpc.Server
): Promise<string> => {
  const tx = TransactionBuilder.fromXDR(signedXdr, networkPassphrase);

  const sendResponse = await server.sendTransaction(tx);

  if (sendResponse.errorResult) {
    throw new Error(`Failed to submit transaction: ${sendResponse.errorResult.toString()}`);
  }

  if (sendResponse.status === SendTxStatus.Pending) {
    let txResponse = await server.getTransaction(sendResponse.hash);

    // Poll for transaction completion
    while (
      txResponse.status === SorobanRpc.Api.GetTransactionStatus.NOT_FOUND
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // eslint-disable-next-line no-await-in-loop
      txResponse = await server.getTransaction(sendResponse.hash);
    }

    if (txResponse.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
      return txResponse.resultXdr.toXDR('base64');
    }

    if (txResponse.status === SorobanRpc.Api.GetTransactionStatus.FAILED) {
      throw new Error('Transaction failed');
    }
  }

  throw new Error(
    `Unexpected transaction status: ${sendResponse.status}`
  );
};

/**
 * Call a contract method in read-only mode
 * @param contractId - The contract ID
 * @param method - The method name
 * @param args - The method arguments (as xdr.ScVal)
 * @param server - The SorobanRpc.Server instance
 * @param networkPassphrase - The network passphrase
 * @returns Decoded result
 */
export const callContractRead = async <ReturnType = any>(
  contractId: string,
  method: string,
  args: xdr.ScVal[],
  server: SorobanRpc.Server,
  networkPassphrase: string
): Promise<ReturnType> => {
  // Get the account with the highest sequence number (typically doesn't matter for read-only calls)
  const dummyAccount = await server.getAccount(contractId);

  const contract = new Contract(contractId);
  const tx = new TransactionBuilder(dummyAccount, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(TimeoutInfinite)
    .build();

  const response = await server.simulateTransaction(tx);

  if (
    SorobanRpc.Api.isSimulationSuccess(response) &&
    response.result !== undefined
  ) {
    return scValToNative(response.result.retval) as ReturnType;
  }

  throw new Error(`Failed to call contract method: ${method}`);
};

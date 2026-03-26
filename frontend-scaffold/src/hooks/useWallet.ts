import { useMemo } from 'react';
import {
  StellarWalletsKit,
  WalletNetwork,
  FREIGHTER_ID,
  FreighterModule,
  AlbedoModule,
  xBullModule,
} from '@creit.tech/stellar-wallets-kit';
import { useWalletStore } from '../store/walletStore';

const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: FREIGHTER_ID,
  modules: [new FreighterModule(), new AlbedoModule(), new xBullModule()],
});

export const useWallet = () => {
  const {
    publicKey,
    connected,
    connecting,
    error,
    network,
    connect,
    disconnect,
    setConnecting,
    setError,
  } = useWalletStore();

  const actions = useMemo(() => ({
    connect: () => {
      setConnecting(true);
      setError(null);
      kit.openModal({
        onWalletSelected: async (option) => {
          try {
            kit.setWallet(option.id);
            const { address } = await kit.getAddress();
            connect(address);
          } catch (err) {
            console.error('Wallet connection failed:', err);
            setError(err instanceof Error ? err.message : 'Failed to connect wallet');
          }
        },
      });
    },

    disconnect: () => {
      disconnect();
    },

    signTransaction: async (xdr: string): Promise<string> => {
      const { signedTxXdr } = await kit.signTransaction(xdr, {
        address: publicKey ?? undefined,
      });
      return signedTxXdr;
    },
  }), [publicKey, connect, disconnect, setConnecting, setError]);

  return { publicKey, connected, connecting, error, network, ...actions };
};

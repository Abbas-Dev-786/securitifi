import { useState, useCallback } from 'react';
import { useContracts } from './useContracts';
import { useWeb3 } from '../contexts/Web3Context';
import { parseEther } from 'ethers';
import { toast } from 'react-toastify';

export interface Transfer {
  id: string;
  from: string;
  to: string;
  propertyId: number;
  amount: string;
  destinationChain: string;
  status: 'pending' | 'confirmed' | 'failed';
  txHash: string;
  timestamp: number;
}

export const useCCIPBridge = () => {
  const { ccipBridge, isReady } = useContracts();
  const { wallet } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  const lockAndSend = useCallback(async (
    recipient: string,
    propertyId: number,
    amount: string,
    destinationChain: string
  ) => {
    if (!ccipBridge || !isReady) {
      throw new Error('CCIP Bridge not initialized');
    }

    setLoading(true);
    try {
      const amountWei = parseEther(amount);
      const tx = await ccipBridge.lockAndSend(
        recipient,
        propertyId,
        amountWei,
        destinationChain
      );
      
      toast.info('Cross-chain transfer initiated. Waiting for confirmation...');
      const receipt = await tx.wait();
      
      // Create transfer record
      const newTransfer: Transfer = {
        id: receipt.hash,
        from: wallet.address || '',
        to: recipient,
        propertyId,
        amount,
        destinationChain,
        status: 'pending',
        txHash: receipt.hash,
        timestamp: Date.now()
      };
      
      setTransfers(prev => [newTransfer, ...prev]);
      toast.success('Cross-chain transfer initiated successfully!');
      
      return receipt.hash;
    } catch (error: any) {
      console.error('Failed to initiate cross-chain transfer:', error);
      toast.error(error.reason || error.message || 'Failed to initiate transfer');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [ccipBridge, isReady, wallet.address]);

  const getTransferStatus = useCallback(async (txHash: string) => {
    // Mock implementation - would query CCIP explorer or contract events
    return new Promise<'pending' | 'confirmed' | 'failed'>((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.2 ? 'confirmed' : 'pending');
      }, 1000);
    });
  }, []);

  const updateTransferStatus = useCallback(async (transferId: string) => {
    const status = await getTransferStatus(transferId);
    setTransfers(prev => 
      prev.map(transfer => 
        transfer.id === transferId 
          ? { ...transfer, status }
          : transfer
      )
    );
  }, [getTransferStatus]);

  return {
    lockAndSend,
    getTransferStatus,
    updateTransferStatus,
    transfers,
    loading
  };
};
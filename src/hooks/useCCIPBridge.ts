import { useState } from 'react';
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { toast } from 'react-toastify';
import { CCIP_BRIDGE_CONTRACT_ADDRESS } from '../constants';
import CCIPBridgeABI from '../abis/CCIPBridge.json';

export const useCCIPBridge = () => {
  const [loading, setLoading] = useState(false);

  // Write contract hook
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Lock and send tokens cross-chain
  const lockAndSend = async (
    recipient: string,
    propertyId: number,
    amount: string,
    destinationChain: string
  ) => {
    try {
      setLoading(true);
      const amountInWei = parseEther(amount);
      
      await writeContract({
        address: CCIP_BRIDGE_CONTRACT_ADDRESS,
        abi: CCIPBridgeABI.abi,
        functionName: 'lockAndSend',
        args: [recipient, propertyId, amountInWei, destinationChain],
      });

      toast.success('Cross-chain transfer transaction submitted!');
    } catch (error: any) {
      console.error('Error initiating cross-chain transfer:', error);
      toast.error(error.message || 'Failed to initiate cross-chain transfer');
    } finally {
      setLoading(false);
    }
  };

  // Set destination chain (owner only)
  const setDestinationChain = async (
    chainName: string,
    chainSelector: bigint,
    bridgeAddress: string
  ) => {
    try {
      setLoading(true);
      await writeContract({
        address: CCIP_BRIDGE_CONTRACT_ADDRESS,
        abi: CCIPBridgeABI.abi,
        functionName: 'setDestinationChain',
        args: [chainName, chainSelector, bridgeAddress],
      });

      toast.success('Destination chain configuration submitted!');
    } catch (error: any) {
      console.error('Error setting destination chain:', error);
      toast.error(error.message || 'Failed to set destination chain');
    } finally {
      setLoading(false);
    }
  };

  // Get chain selector
  const getChainSelector = async (chainName: string) => {
    try {
      const result = await readContract({
        address: CCIP_BRIDGE_CONTRACT_ADDRESS,
        abi: CCIPBridgeABI.abi,
        functionName: 'chainSelectors',
        args: [chainName],
      });
      return result ? Number(result) : 0;
    } catch (error) {
      console.error('Error fetching chain selector:', error);
      return 0;
    }
  };

  // Get destination bridge address
  const getDestinationBridge = async (chainName: string) => {
    try {
      const result = await readContract({
        address: CCIP_BRIDGE_CONTRACT_ADDRESS,
        abi: CCIPBridgeABI.abi,
        functionName: 'destinationBridges',
        args: [chainName],
      });
      return result as string;
    } catch (error) {
      console.error('Error fetching destination bridge:', error);
      return '';
    }
  };

  return {
    lockAndSend,
    setDestinationChain,
    getChainSelector,
    getDestinationBridge,
    loading: loading || isPending || isConfirming,
    isConfirmed,
    hash,
    error,
  };
};

// Helper function for read contract
const readContract = async (config: any) => {
  return null;
};
import { useState } from 'react';
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'react-toastify';
import { POR_VERIFIER_CONTRACT_ADDRESS } from '../constants';
import PoRVerifierABI from '../abis/PoRVerifier.json';

export const useProofOfReserves = () => {
  const [loading, setLoading] = useState(false);

  // Write contract hook
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Check reserve status
  const checkReserveStatus = async (propertyId: number) => {
    try {
      setLoading(true);
      await writeContract({
        address: POR_VERIFIER_CONTRACT_ADDRESS,
        abi: PoRVerifierABI.abi,
        functionName: 'checkReserveStatus',
        args: [propertyId],
      });

      toast.success('Reserve status check initiated!');
      return true;
    } catch (error: any) {
      console.error('Error checking reserve status:', error);
      toast.error(error.message || 'Failed to check reserve status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Set PoR feed (owner only)
  const setPoRFeed = async (propertyId: number, feedAddress: string) => {
    try {
      setLoading(true);
      await writeContract({
        address: POR_VERIFIER_CONTRACT_ADDRESS,
        abi: PoRVerifierABI.abi,
        functionName: 'setPoRFeed',
        args: [propertyId, feedAddress],
      });

      toast.success('PoR feed configuration submitted!');
    } catch (error: any) {
      console.error('Error setting PoR feed:', error);
      toast.error(error.message || 'Failed to set PoR feed');
    } finally {
      setLoading(false);
    }
  };

  // Pause operations (owner only)
  const pauseOperations = async (propertyId: number) => {
    try {
      setLoading(true);
      await writeContract({
        address: POR_VERIFIER_CONTRACT_ADDRESS,
        abi: PoRVerifierABI.abi,
        functionName: 'pauseOperations',
        args: [propertyId],
      });

      toast.success('Operations pause initiated!');
    } catch (error: any) {
      console.error('Error pausing operations:', error);
      toast.error(error.message || 'Failed to pause operations');
    } finally {
      setLoading(false);
    }
  };

  // Get PoR feed address
  const getPoRFeed = async (propertyId: number) => {
    try {
      const result = await readContract({
        address: POR_VERIFIER_CONTRACT_ADDRESS,
        abi: PoRVerifierABI.abi,
        functionName: 'propertyPoRFeed',
        args: [propertyId],
      });
      return result as string;
    } catch (error) {
      console.error('Error fetching PoR feed:', error);
      return '';
    }
  };

  return {
    checkReserveStatus,
    setPoRFeed,
    pauseOperations,
    getPoRFeed,
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
import { useState } from 'react';
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'react-toastify';
import { ORACLE_CONSUMER_CONTRACT_ADDRESS } from '../constants';
import OracleConsumerABI from '../abis/OracleConsumer.json';

export const useOracleConsumer = () => {
  const [loading, setLoading] = useState(false);

  // Write contract hook
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Get latest price from oracle
  const getLatestPrice = async () => {
    try {
      const result = await readContract({
        address: ORACLE_CONSUMER_CONTRACT_ADDRESS,
        abi: OracleConsumerABI.abi,
        functionName: 'getLatestPrice',
        args: [],
      });
      return result ? Number(result) / 1e8 : 0; // Chainlink price feeds typically have 8 decimals
    } catch (error) {
      console.error('Error fetching latest price:', error);
      return 0;
    }
  };

  // Set price feed (owner only)
  const setPriceFeed = async (newFeedAddress: string) => {
    try {
      setLoading(true);
      await writeContract({
        address: ORACLE_CONSUMER_CONTRACT_ADDRESS,
        abi: OracleConsumerABI.abi,
        functionName: 'setPriceFeed',
        args: [newFeedAddress],
      });

      toast.success('Price feed update transaction submitted!');
    } catch (error: any) {
      console.error('Error setting price feed:', error);
      toast.error(error.message || 'Failed to set price feed');
    } finally {
      setLoading(false);
    }
  };

  // Get current price feed address
  const getPriceFeed = async () => {
    try {
      const result = await readContract({
        address: ORACLE_CONSUMER_CONTRACT_ADDRESS,
        abi: OracleConsumerABI.abi,
        functionName: 'priceFeed',
        args: [],
      });
      return result as string;
    } catch (error) {
      console.error('Error fetching price feed address:', error);
      return '';
    }
  };

  return {
    getLatestPrice,
    setPriceFeed,
    getPriceFeed,
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
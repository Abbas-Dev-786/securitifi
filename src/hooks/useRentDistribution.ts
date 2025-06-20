import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { readContract as wagmiReadContract } from 'wagmi/actions';
import { parseEther, formatEther } from 'viem';
import { toast } from 'react-toastify';
import { RENT_DISTRIBUTION_VAULT_CONTRACT_ADDRESS } from '../constants';
import RentDistributionABI from '../abis/RentDistributionVault.json';

export const useRentDistribution = () => {
  const [loading, setLoading] = useState(false);

  // Write contract hook
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Deposit rent
  const depositRent = async (propertyId: number, amount: string) => {
    try {
      setLoading(true);
      const amountInWei = parseEther(amount);
      
      await writeContract({
        address: RENT_DISTRIBUTION_VAULT_CONTRACT_ADDRESS,
        abi: RentDistributionABI.abi,
        functionName: 'depositRent',
        args: [propertyId, amountInWei],
      });

      toast.success('Rent deposit transaction submitted!');
    } catch (error: any) {
      console.error('Error depositing rent:', error);
      toast.error(error.message || 'Failed to deposit rent');
    } finally {
      setLoading(false);
    }
  };

  // Get rent pool balance
  const getRentPool = async (propertyId: number) => {
    try {
      const result = await readContract({
        address: RENT_DISTRIBUTION_VAULT_CONTRACT_ADDRESS,
        abi: RentDistributionABI.abi,
        functionName: 'rentPool',
        args: [propertyId],
      });
      return result ? formatEther(result as bigint) : '0';
    } catch (error) {
      console.error('Error fetching rent pool:', error);
      return '0';
    }
  };

  // Get last distribution time
  const getLastDistribution = async (propertyId: number) => {
    try {
      const result = await readContract({
        address: RENT_DISTRIBUTION_VAULT_CONTRACT_ADDRESS,
        abi: RentDistributionABI.abi,
        functionName: 'lastDistribution',
        args: [propertyId],
      });
      return result ? Number(result) : 0;
    } catch (error) {
      console.error('Error fetching last distribution:', error);
      return 0;
    }
  };

  // Check upkeep (for Chainlink Automation)
  const checkUpkeep = async () => {
    try {
      const result = await readContract({
        address: RENT_DISTRIBUTION_VAULT_CONTRACT_ADDRESS,
        abi: RentDistributionABI.abi,
        functionName: 'checkUpkeep',
        args: ['0x'],
      });
      return result;
    } catch (error) {
      console.error('Error checking upkeep:', error);
      return [false, '0x'];
    }
  };

  return {
    depositRent,
    getRentPool,
    getLastDistribution,
    checkUpkeep,
    loading: loading || isPending || isConfirming,
    isConfirmed,
    hash,
    error,
  };
};

// Helper function for read contract
const readContract = async (config: any) => {
  try {
    return await wagmiReadContract(config);
  } catch (error) {
    console.error('Error reading contract:', error);
    return null;
  }
};
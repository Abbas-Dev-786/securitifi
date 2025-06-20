import { useState } from 'react';
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { toast } from 'react-toastify';
import { REAL_ESTATE_TOKEN_CONTRACT_ADDRESS } from '../constants';
import RealEstateTokenABI from '../abis/IRealEstateToken.json';

export const useRealEstateToken = () => {
  const [loading, setLoading] = useState(false);

  // Write contract hook
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Get token balance
  const getBalance = async (account: string, tokenId: number) => {
    try {
      const result = await readContract({
        address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
        abi: RealEstateTokenABI.abi,
        functionName: 'balanceOf',
        args: [account, tokenId],
      });
      return result ? formatEther(result as bigint) : '0';
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return '0';
    }
  };

  // Get batch balances
  const getBatchBalances = async (accounts: string[], tokenIds: number[]) => {
    try {
      const result = await readContract({
        address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
        abi: RealEstateTokenABI.abi,
        functionName: 'balanceOfBatch',
        args: [accounts, tokenIds],
      });
      return result as bigint[];
    } catch (error) {
      console.error('Error fetching batch balances:', error);
      return [];
    }
  };

  // Get total supply of a token
  const getTotalSupply = async (tokenId: number) => {
    try {
      const result = await readContract({
        address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
        abi: RealEstateTokenABI.abi,
        functionName: 'getTotalSupply',
        args: [tokenId],
      });
      return result ? formatEther(result as bigint) : '0';
    } catch (error) {
      console.error('Error fetching total supply:', error);
      return '0';
    }
  };

  // Safe transfer from
  const safeTransferFrom = async (
    from: string,
    to: string,
    tokenId: number,
    amount: string,
    data: string = '0x'
  ) => {
    try {
      setLoading(true);
      const amountInWei = parseEther(amount);
      
      await writeContract({
        address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
        abi: RealEstateTokenABI.abi,
        functionName: 'safeTransferFrom',
        args: [from, to, tokenId, amountInWei, data],
      });

      toast.success('Token transfer transaction submitted!');
    } catch (error: any) {
      console.error('Error transferring tokens:', error);
      toast.error(error.message || 'Failed to transfer tokens');
    } finally {
      setLoading(false);
    }
  };

  // Set approval for all
  const setApprovalForAll = async (operator: string, approved: boolean) => {
    try {
      setLoading(true);
      await writeContract({
        address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
        abi: RealEstateTokenABI.abi,
        functionName: 'setApprovalForAll',
        args: [operator, approved],
      });

      toast.success('Approval transaction submitted!');
    } catch (error: any) {
      console.error('Error setting approval:', error);
      toast.error(error.message || 'Failed to set approval');
    } finally {
      setLoading(false);
    }
  };

  // Check if approved for all
  const isApprovedForAll = async (account: string, operator: string) => {
    try {
      const result = await readContract({
        address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
        abi: RealEstateTokenABI.abi,
        functionName: 'isApprovedForAll',
        args: [account, operator],
      });
      return result as boolean;
    } catch (error) {
      console.error('Error checking approval:', error);
      return false;
    }
  };

  return {
    getBalance,
    getBatchBalances,
    getTotalSupply,
    safeTransferFrom,
    setApprovalForAll,
    isApprovedForAll,
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
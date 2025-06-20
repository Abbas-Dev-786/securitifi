import { useState } from 'react';
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { toast } from 'react-toastify';
import { MOCK_USDC_CONTRACT_ADDRESS } from '../constants';
import MockUSDCABI from '../abis/MockUSDC.json';

export const useMockUSDC = () => {
  const [loading, setLoading] = useState(false);

  // Write contract hook
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Get USDC balance
  const getBalance = async (account: string) => {
    try {
      const result = await readContract({
        address: MOCK_USDC_CONTRACT_ADDRESS,
        abi: MockUSDCABI.abi,
        functionName: 'balanceOf',
        args: [account],
      });
      return result ? formatUnits(result as bigint, 6) : '0'; // USDC has 6 decimals
    } catch (error) {
      console.error('Error fetching USDC balance:', error);
      return '0';
    }
  };

  // Get allowance
  const getAllowance = async (owner: string, spender: string) => {
    try {
      const result = await readContract({
        address: MOCK_USDC_CONTRACT_ADDRESS,
        abi: MockUSDCABI.abi,
        functionName: 'allowance',
        args: [owner, spender],
      });
      return result ? formatUnits(result as bigint, 6) : '0';
    } catch (error) {
      console.error('Error fetching allowance:', error);
      return '0';
    }
  };

  // Approve spending
  const approve = async (spender: string, amount: string) => {
    try {
      setLoading(true);
      const amountInUnits = parseUnits(amount, 6); // USDC has 6 decimals
      
      await writeContract({
        address: MOCK_USDC_CONTRACT_ADDRESS,
        abi: MockUSDCABI.abi,
        functionName: 'approve',
        args: [spender, amountInUnits],
      });

      toast.success('USDC approval transaction submitted!');
    } catch (error: any) {
      console.error('Error approving USDC:', error);
      toast.error(error.message || 'Failed to approve USDC');
    } finally {
      setLoading(false);
    }
  };

  // Transfer USDC
  const transfer = async (to: string, amount: string) => {
    try {
      setLoading(true);
      const amountInUnits = parseUnits(amount, 6);
      
      await writeContract({
        address: MOCK_USDC_CONTRACT_ADDRESS,
        abi: MockUSDCABI.abi,
        functionName: 'transfer',
        args: [to, amountInUnits],
      });

      toast.success('USDC transfer transaction submitted!');
    } catch (error: any) {
      console.error('Error transferring USDC:', error);
      toast.error(error.message || 'Failed to transfer USDC');
    } finally {
      setLoading(false);
    }
  };

  // Transfer from
  const transferFrom = async (from: string, to: string, amount: string) => {
    try {
      setLoading(true);
      const amountInUnits = parseUnits(amount, 6);
      
      await writeContract({
        address: MOCK_USDC_CONTRACT_ADDRESS,
        abi: MockUSDCABI.abi,
        functionName: 'transferFrom',
        args: [from, to, amountInUnits],
      });

      toast.success('USDC transfer from transaction submitted!');
    } catch (error: any) {
      console.error('Error transferring USDC from:', error);
      toast.error(error.message || 'Failed to transfer USDC from');
    } finally {
      setLoading(false);
    }
  };

  return {
    getBalance,
    getAllowance,
    approve,
    transfer,
    transferFrom,
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
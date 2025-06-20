import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { readContract as wagmiReadContract } from 'wagmi/actions';
import { parseEther, formatEther } from 'viem';
import { toast } from 'react-toastify';
import { LENDING_POOL_CONTRACT_ADDRESS } from '../constants';
import LendingPoolABI from '../abis/LendingPool.json';

export const useLendingPool = () => {
  const [loading, setLoading] = useState(false);

  // Write contract hook
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Deposit collateral
  const depositCollateral = async (propertyId: number, amount: string) => {
    try {
      setLoading(true);
      const amountInWei = parseEther(amount);
      
      await writeContract({
        address: LENDING_POOL_CONTRACT_ADDRESS,
        abi: LendingPoolABI.abi,
        functionName: 'depositCollateral',
        args: [propertyId, amountInWei],
      });

      toast.success('Collateral deposit transaction submitted!');
    } catch (error: any) {
      console.error('Error depositing collateral:', error);
      toast.error(error.message || 'Failed to deposit collateral');
    } finally {
      setLoading(false);
    }
  };

  // Borrow stablecoin
  const borrowStablecoin = async (amount: string) => {
    try {
      setLoading(true);
      const amountInWei = parseEther(amount);
      
      await writeContract({
        address: LENDING_POOL_CONTRACT_ADDRESS,
        abi: LendingPoolABI.abi,
        functionName: 'borrowStablecoin',
        args: [amountInWei],
      });

      toast.success('Borrow transaction submitted!');
    } catch (error: any) {
      console.error('Error borrowing stablecoin:', error);
      toast.error(error.message || 'Failed to borrow stablecoin');
    } finally {
      setLoading(false);
    }
  };

  // Repay loan
  const repayLoan = async (amount: string) => {
    try {
      setLoading(true);
      const amountInWei = parseEther(amount);
      
      await writeContract({
        address: LENDING_POOL_CONTRACT_ADDRESS,
        abi: LendingPoolABI.abi,
        functionName: 'repayLoan',
        args: [amountInWei],
      });

      toast.success('Loan repayment transaction submitted!');
    } catch (error: any) {
      console.error('Error repaying loan:', error);
      toast.error(error.message || 'Failed to repay loan');
    } finally {
      setLoading(false);
    }
  };

  // Calculate max borrow amount
  const calculateMaxBorrow = async (propertyId: number, collateralAmount: string) => {
    try {
      const amountInWei = parseEther(collateralAmount);
      const result = await readContract({
        address: LENDING_POOL_CONTRACT_ADDRESS,
        abi: LendingPoolABI.abi,
        functionName: 'calculateMaxBorrow',
        args: [propertyId, amountInWei],
      });
      return result ? formatEther(result as bigint) : '0';
    } catch (error) {
      console.error('Error calculating max borrow:', error);
      return '0';
    }
  };

  // Get user loan details
  const getUserLoan = async (userAddress: string) => {
    try {
      const result = await readContract({
        address: LENDING_POOL_CONTRACT_ADDRESS,
        abi: LendingPoolABI.abi,
        functionName: 'loans',
        args: [userAddress],
      });
      return result;
    } catch (error) {
      console.error('Error fetching user loan:', error);
      return null;
    }
  };

  // Adjust LTV (owner only)
  const adjustLTV = async (propertyId: number) => {
    try {
      setLoading(true);
      await writeContract({
        address: LENDING_POOL_CONTRACT_ADDRESS,
        abi: LendingPoolABI.abi,
        functionName: 'adjustLTV',
        args: [propertyId],
      });

      toast.success('LTV adjustment transaction submitted!');
    } catch (error: any) {
      console.error('Error adjusting LTV:', error);
      toast.error(error.message || 'Failed to adjust LTV');
    } finally {
      setLoading(false);
    }
  };

  return {
    depositCollateral,
    borrowStablecoin,
    repayLoan,
    calculateMaxBorrow,
    getUserLoan,
    adjustLTV,
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
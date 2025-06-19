import { useState, useCallback } from 'react';
import { useContracts } from './useContracts';
import { useWeb3 } from '../contexts/Web3Context';
import { parseEther, formatEther } from 'ethers';
import { toast } from 'react-toastify';

export interface Loan {
  id: number;
  borrower: string;
  lender: string;
  tokenId: number;
  loanAmount: bigint;
  interestRate: number;
  duration: number;
  startTime: bigint;
  isActive: boolean;
  isRepaid: boolean;
}

export const useLendingPool = () => {
  const { lendingPool, isReady } = useContracts();
  const { wallet } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState<Loan[]>([]);

  const depositCollateral = useCallback(async (propertyId: number, amount: string) => {
    if (!lendingPool || !isReady) {
      throw new Error('Lending pool not initialized');
    }

    setLoading(true);
    try {
      const amountWei = parseEther(amount);
      const tx = await lendingPool.depositCollateral(propertyId, amountWei);
      
      toast.info('Transaction submitted. Waiting for confirmation...');
      await tx.wait();
      
      toast.success('Collateral deposited successfully!');
      await fetchUserLoans();
    } catch (error: any) {
      console.error('Failed to deposit collateral:', error);
      toast.error(error.reason || error.message || 'Failed to deposit collateral');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [lendingPool, isReady]);

  const borrowStablecoin = useCallback(async (amount: string) => {
    if (!lendingPool || !isReady) {
      throw new Error('Lending pool not initialized');
    }

    setLoading(true);
    try {
      const amountWei = parseEther(amount);
      const tx = await lendingPool.borrowStablecoin(amountWei);
      
      toast.info('Transaction submitted. Waiting for confirmation...');
      await tx.wait();
      
      toast.success('Loan approved and funds transferred!');
      await fetchUserLoans();
    } catch (error: any) {
      console.error('Failed to borrow stablecoin:', error);
      toast.error(error.reason || error.message || 'Failed to borrow stablecoin');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [lendingPool, isReady]);

  const repayLoan = useCallback(async (amount: string) => {
    if (!lendingPool || !isReady) {
      throw new Error('Lending pool not initialized');
    }

    setLoading(true);
    try {
      const amountWei = parseEther(amount);
      const tx = await lendingPool.repayLoan(amountWei);
      
      toast.info('Transaction submitted. Waiting for confirmation...');
      await tx.wait();
      
      toast.success('Loan repaid successfully!');
      await fetchUserLoans();
    } catch (error: any) {
      console.error('Failed to repay loan:', error);
      toast.error(error.reason || error.message || 'Failed to repay loan');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [lendingPool, isReady]);

  const fetchUserLoans = useCallback(async () => {
    if (!lendingPool || !isReady || !wallet.address) return;

    setLoading(true);
    try {
      const userLoans = await lendingPool.getUserLoans(wallet.address);
      const loanPromises = userLoans.map(async (loanId: bigint) => {
        const loan = await lendingPool.getLoan(Number(loanId));
        return {
          id: Number(loan.id),
          borrower: loan.borrower,
          lender: loan.lender,
          tokenId: Number(loan.tokenId),
          loanAmount: loan.loanAmount,
          interestRate: Number(loan.interestRate),
          duration: Number(loan.duration),
          startTime: loan.startTime,
          isActive: loan.isActive,
          isRepaid: loan.isRepaid
        };
      });
      
      const fetchedLoans = await Promise.all(loanPromises);
      setLoans(fetchedLoans);
    } catch (error) {
      console.error('Failed to fetch user loans:', error);
      toast.error('Failed to fetch loans');
    } finally {
      setLoading(false);
    }
  }, [lendingPool, isReady, wallet.address]);

  return {
    depositCollateral,
    borrowStablecoin,
    repayLoan,
    fetchUserLoans,
    loans,
    loading
  };
};
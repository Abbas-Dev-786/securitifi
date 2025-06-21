import { useState, useCallback } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { readContract } from "wagmi/actions";
import { parseUnits } from "viem";
import LendingPoolAbi from "./../abis/LendingPool.json";
import { LENDING_POOL_CONTRACT_ADDRESS } from "../constants";
import { config } from "../config";

interface LoanDetails {
  propertyId: bigint;
  collateralAmount: bigint;
  borrowedAmount: bigint;
}

export const useLendingPool = () => {
  const { address: userAddress } = useAccount();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const { writeContractAsync: writeContract } = useWriteContract();

  // Read: Get user's loan details
  const {
    data: loanDetails,
    isLoading: isLoanLoading,
    error: loanError,
  } = useReadContract({
    address: LENDING_POOL_CONTRACT_ADDRESS,
    abi: LendingPoolAbi.abi,
    functionName: "loans",
    args: [userAddress],
    query: { enabled: !!userAddress },
  }) as { data: LoanDetails; isLoading: boolean; error: Error | null };

  // Read: Calculate max borrowable amount (requires propertyId and collateralAmount)
  const calculateMaxBorrow = useCallback(
    async (propertyId: bigint, collateralAmount: bigint) => {
      try {
        setLoading(true);
        setError(undefined);
        const data = (await readContract(config, {
          address: LENDING_POOL_CONTRACT_ADDRESS,
          abi: LendingPoolAbi.abi,
          functionName: "calculateMaxBorrow",
          args: [propertyId, collateralAmount],
        })) as bigint;
        return { maxBorrow: data, isLoading: false, error: null };
      } catch (err: any) {
        setError(err.message || "Failed to calculate max borrow");
        return { maxBorrow: 0n, isLoading: false, error: err };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Write: Deposit collateral
  const depositCollateral = useCallback(
    async (propertyId: bigint, amount: string, decimals: number = 18) => {
      try {
        setLoading(true);
        setError(undefined);
        const amountInWei = parseUnits(amount, decimals);
        await writeContract({
          address: LENDING_POOL_CONTRACT_ADDRESS,
          abi: LendingPoolAbi.abi,
          functionName: "depositCollateral",
          args: [propertyId, amountInWei],
        });
      } catch (err: any) {
        setError(err.message || "Failed to deposit collateral");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [writeContract]
  );

  // Write: Borrow stablecoin
  const borrowStablecoin = useCallback(
    async (amount: string, decimals: number = 18) => {
      try {
        setLoading(true);
        setError(undefined);
        const amountInWei = parseUnits(amount, decimals);
        await writeContract({
          address: LENDING_POOL_CONTRACT_ADDRESS,
          abi: LendingPoolAbi.abi,
          functionName: "borrowStablecoin",
          args: [amountInWei],
        });
      } catch (err: any) {
        setError(err.message || "Failed to borrow stablecoin");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [writeContract]
  );

  // Write: Repay loan
  const repayLoan = useCallback(
    async (amount: string, decimals: number = 18) => {
      try {
        setLoading(true);
        setError(undefined);
        const amountInWei = parseUnits(amount, decimals);
        await writeContract({
          address: LENDING_POOL_CONTRACT_ADDRESS,
          abi: LendingPoolAbi.abi,
          functionName: "repayLoan",
          args: [amountInWei],
        });
      } catch (err: any) {
        setError(err.message || "Failed to repay loan");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [writeContract]
  );

  return {
    loanDetails,
    isLoanLoading,
    loanError,
    calculateMaxBorrow,
    depositCollateral,
    borrowStablecoin,
    repayLoan,
    loading,
    error,
  };
};

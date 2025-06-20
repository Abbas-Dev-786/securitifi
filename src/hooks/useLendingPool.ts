import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import LendingPoolAbi from "./../abis/LendingPool.json"; // Assume ABI is imported from a generated file
import { LENDING_POOL_CONTRACT_ADDRESS } from "../constants";

interface LoanDetails {
  propertyId: bigint;
  collateralAmount: bigint;
  borrowedAmount: bigint;
}

export const useLendingPool = () => {
  const { address: userAddress } = useAccount();
  const {
    writeContract,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

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
  const calculateMaxBorrow = (propertyId: bigint, collateralAmount: bigint) => {
    const { data, isLoading, error } = useReadContract({
      address: LENDING_POOL_CONTRACT_ADDRESS,
      abi: LendingPoolAbi.abi,
      functionName: "calculateMaxBorrow",
      args: [propertyId, collateralAmount],
    });
    return { maxBorrow: data as bigint, isLoading, error };
  };

  // Write: Deposit collateral
  const depositCollateral = async (
    propertyId: bigint,
    amount: string,
    decimals: number = 18
  ) => {
    try {
      const amountInWei = parseUnits(amount, decimals);
      await writeContract({
        address: LENDING_POOL_CONTRACT_ADDRESS,
        abi: LendingPoolAbi.abi,
        functionName: "depositCollateral",
        args: [propertyId, amountInWei],
      });
    } catch (err) {
      console.error("Deposit collateral error:", err);
      throw err;
    }
  };

  // Write: Borrow stablecoin
  const borrowStablecoin = async (amount: string, decimals: number = 18) => {
    try {
      const amountInWei = parseUnits(amount, decimals);
      await writeContract({
        address: LENDING_POOL_CONTRACT_ADDRESS,
        abi: LendingPoolAbi.abi,
        functionName: "borrowStablecoin",
        args: [amountInWei],
      });
    } catch (err) {
      console.error("Borrow stablecoin error:", err);
      throw err;
    }
  };

  // Write: Repay loan
  const repayLoan = async (amount: string, decimals: number = 18) => {
    try {
      const amountInWei = parseUnits(amount, decimals);
      await writeContract({
        address: LENDING_POOL_CONTRACT_ADDRESS,
        abi: LendingPoolAbi.abi,
        functionName: "repayLoan",
        args: [amountInWei],
      });
    } catch (err) {
      console.error("Repay loan error:", err);
      throw err;
    }
  };

  return {
    loanDetails,
    isLoanLoading,
    loanError,
    calculateMaxBorrow,
    depositCollateral,
    borrowStablecoin,
    repayLoan,
    isWritePending,
    writeError,
  };
};

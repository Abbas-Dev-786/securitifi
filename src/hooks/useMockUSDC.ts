import { useState, useCallback } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import MockUSDCAbi from "./../abis/MockUSDC.json";
import { MOCK_USDC_CONTRACT_ADDRESS } from "../constants";
import { config } from "../config";
import { readContract } from "wagmi/actions";

export const useMockUSDC = () => {
  const { address: userAddress } = useAccount();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const { writeContractAsync: writeContract } = useWriteContract();

  // Read: Get user's USDC balance
  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useReadContract({
    address: MOCK_USDC_CONTRACT_ADDRESS,
    abi: MockUSDCAbi.abi,
    functionName: "balanceOf",
    args: [userAddress],
    query: { enabled: !!userAddress },
  }) as { data: bigint; isLoading: boolean; error: Error | null };

  // Read: Get allowance for a spender
  const getAllowance = useCallback(
    async (spender: string) => {
      try {
        setLoading(true);
        setError(undefined);
        const data = (await readContract(config, {
          address: MOCK_USDC_CONTRACT_ADDRESS,
          abi: MockUSDCAbi.abi,
          functionName: "allowance",
          args: [userAddress, spender],
        })) as bigint;
        return {
          allowance: formatUnits(data, 6),
          isLoading: false,
          error: null,
        };
      } catch (err: any) {
        setError(err.message || "Failed to fetch allowance");
        return { allowance: "0", isLoading: false, error: err };
      } finally {
        setLoading(false);
      }
    },
    [userAddress]
  );

  // Write: Approve a spender
  const approve = useCallback(
    async (spender: string, amount: string) => {
      try {
        setLoading(true);
        setError(undefined);
        const amountInUnits = parseUnits(amount, 6); // USDC has 6 decimals
        await writeContract({
          address: MOCK_USDC_CONTRACT_ADDRESS,
          abi: MockUSDCAbi.abi,
          functionName: "approve",
          args: [spender, amountInUnits],
        });
      } catch (err: any) {
        setError(err.message || "Failed to approve USDC");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [writeContract]
  );

  // Write: Transfer USDC to another address
  const transfer = useCallback(
    async (to: string, amount: string) => {
      try {
        setLoading(true);
        setError(undefined);
        const amountInUnits = parseUnits(amount, 6);
        await writeContract({
          address: MOCK_USDC_CONTRACT_ADDRESS,
          abi: MockUSDCAbi.abi,
          functionName: "transfer",
          args: [to, amountInUnits],
        });
      } catch (err: any) {
        setError(err.message || "Failed to transfer USDC");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [writeContract]
  );

  return {
    balance: balanceData ? formatUnits(balanceData, 6) : "0",
    isBalanceLoading,
    balanceError,
    getAllowance,
    approve,
    transfer,
    loading,
    error,
  };
};

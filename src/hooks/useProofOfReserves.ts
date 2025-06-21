import { useState, useCallback } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { Address } from "viem";
import PoRVerifierABI from "../abis/PoRVerifier.json";
import { POR_VERIFIER_CONTRACT_ADDRESS } from "../constants";

// Types for write operations
type WriteFunctionName =
  | "checkReserveStatus"
  | "pauseOperations"
  | "setPoRFeed"
  | "transferOwnership"
  | "renounceOwnership";

interface PoRVerifierHook {
  // Read functions
  owner: { data: Address | undefined; isLoading: boolean; error: Error | null };
  propertyPoRFeed: {
    data: Address | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  setPropertyId: (propertyId: bigint | undefined) => void;
  // Write function
  writeContract: <T extends WriteFunctionName>(
    functionName: T,
    args: T extends "checkReserveStatus"
      ? [bigint]
      : T extends "pauseOperations"
      ? [bigint]
      : T extends "setPoRFeed"
      ? [bigint, Address]
      : T extends "transferOwnership"
      ? [Address]
      : []
  ) => void;
  writeStatus: {
    isPending: boolean;
    isSuccess: boolean;
    error: Error | null;
  };
}

export const usePoRVerifier = (initialPropertyId?: bigint): PoRVerifierHook => {
  const [propertyId, setPropertyId] = useState<bigint | undefined>(
    initialPropertyId
  );

  // Read: owner
  const owner = useReadContract({
    address: POR_VERIFIER_CONTRACT_ADDRESS,
    abi: PoRVerifierABI.abi,
    functionName: "owner",
  });

  // Read: propertyPoRFeed
  const propertyPoRFeed = useReadContract({
    address: POR_VERIFIER_CONTRACT_ADDRESS,
    abi: PoRVerifierABI.abi,
    functionName: "propertyPoRFeed",
    args: propertyId ? [propertyId] : undefined,
    query: { enabled: !!propertyId },
  });

  // Write: Single useWriteContract for all write operations
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  // Generic write function
  const writeContractWrapper = useCallback(
    <T extends WriteFunctionName>(
      functionName: T,
      args: T extends "checkReserveStatus"
        ? [bigint]
        : T extends "pauseOperations"
        ? [bigint]
        : T extends "setPoRFeed"
        ? [bigint, Address]
        : T extends "transferOwnership"
        ? [Address]
        : []
    ) => {
      writeContract({
        address: POR_VERIFIER_CONTRACT_ADDRESS,
        abi: PoRVerifierABI.abi,
        functionName,
        args,
      });
    },
    [writeContract]
  );

  return {
    owner: {
      data: owner.data as Address | undefined,
      isLoading: owner.isLoading,
      error: owner.error,
    },
    propertyPoRFeed: {
      data: propertyPoRFeed.data as Address | undefined,
      isLoading: propertyPoRFeed.isLoading,
      error: propertyPoRFeed.error,
    },
    setPropertyId,
    writeContract: writeContractWrapper,
    writeStatus: {
      isPending,
      isSuccess,
      error,
    },
  };
};

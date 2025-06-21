import { useState, useCallback, useRef, useEffect } from "react";
import {
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { Address, parseEventLogs } from "viem";
import RentDistributionVaultABI from "./../abis/RentDistributionVault.json";
import { RENT_DISTRIBUTION_VAULT_CONTRACT_ADDRESS } from "../constants";

// Types for event data
interface OwnershipTransferredEvent {
  previousOwner: Address;
  newOwner: Address;
}

interface RentDepositedEvent {
  propertyId: bigint;
  amount: bigint;
}

interface RentDistributedEvent {
  propertyId: bigint;
  totalAmount: bigint;
}

// Types for write operations
type WriteFunctionName =
  | "depositRent"
  | "performUpkeep"
  | "renounceOwnership"
  | "transferOwnership";

interface RentDistributionVaultHook {
  // Read functions
  checkUpkeep: {
    data: { upkeepNeeded: boolean; performData: string } | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  lastDistribution: {
    data: bigint | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  owner: {
    data: Address | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  realEstateToken: {
    data: Address | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  rentPool: {
    data: bigint | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  stablecoin: {
    data: Address | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  setPropertyId: (propertyId: bigint | undefined) => void;
  // Write function
  writeContract: <T extends WriteFunctionName>(
    functionName: T,
    args: T extends "depositRent"
      ? [bigint, bigint]
      : T extends "performUpkeep"
      ? [string]
      : T extends "renounceOwnership"
      ? []
      : T extends "transferOwnership"
      ? [Address]
      : never
  ) => void;
  writeStatus: {
    isPending: boolean;
    isSuccess: boolean;
    error: Error | null;
  };
  // Events
  onOwnershipTransferred: (
    callback: (event: OwnershipTransferredEvent) => void
  ) => void;
  onRentDeposited: (callback: (event: RentDepositedEvent) => void) => void;
  onRentDistributed: (callback: (event: RentDistributedEvent) => void) => void;
}

export const useRentDistributionVault = (
  initialPropertyId?: bigint
): RentDistributionVaultHook => {
  const [propertyId, setPropertyId] = useState<bigint | undefined>(
    initialPropertyId
  );

  // Refs to store event callbacks with explicit mutable typing
  const ownershipTransferredCallbackRef = useRef<
    ((event: OwnershipTransferredEvent) => void) | null
  >(null);
  const rentDepositedCallbackRef = useRef<
    ((event: RentDepositedEvent) => void) | null
  >(null);
  const rentDistributedCallbackRef = useRef<
    ((event: RentDistributedEvent) => void) | null
  >(null);

  // Read: checkUpkeep
  const checkUpkeep = useReadContract({
    address: RENT_DISTRIBUTION_VAULT_CONTRACT_ADDRESS,
    abi: RentDistributionVaultABI.abi,
    functionName: "checkUpkeep",
    // args: [propertyId || 0n],
  });

  // Read: lastDistribution
  const lastDistribution = useReadContract({
    address: RENT_DISTRIBUTION_VAULT_CONTRACT_ADDRESS,
    abi: RentDistributionVaultABI.abi,
    functionName: "lastDistribution",
    args: propertyId ? [propertyId] : undefined,
    query: { enabled: !!propertyId },
  });

  // Read: owner
  const owner = useReadContract({
    address: RENT_DISTRIBUTION_VAULT_CONTRACT_ADDRESS,
    abi: RentDistributionVaultABI.abi,
    functionName: "owner",
  });

  // Read: realEstateToken
  const realEstateToken = useReadContract({
    address: RENT_DISTRIBUTION_VAULT_CONTRACT_ADDRESS,
    abi: RentDistributionVaultABI.abi,
    functionName: "realEstateToken",
  });

  // Read: rentPool
  const rentPool = useReadContract({
    address: RENT_DISTRIBUTION_VAULT_CONTRACT_ADDRESS,
    abi: RentDistributionVaultABI.abi,
    functionName: "rentPool",
    args: propertyId ? [propertyId] : undefined,
    query: { enabled: !!propertyId },
  });

  // Read: stablecoin
  const stablecoin = useReadContract({
    address: RENT_DISTRIBUTION_VAULT_CONTRACT_ADDRESS,
    abi: RentDistributionVaultABI.abi,
    functionName: "stablecoin",
  });

  // Write: Single useWriteContract for all write operations
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  // Generic write function
  const writeContractWrapper = useCallback(
    <T extends WriteFunctionName>(
      functionName: T,
      args: T extends "depositRent"
        ? [bigint, bigint]
        : T extends "performUpkeep"
        ? [string]
        : T extends "renounceOwnership"
        ? []
        : T extends "transferOwnership"
        ? [Address]
        : never
    ) => {
      writeContract({
        address: RENT_DISTRIBUTION_VAULT_CONTRACT_ADDRESS,
        abi: RentDistributionVaultABI.abi,
        functionName,
        args,
      });
    },
    [writeContract]
  );

  // Event: OwnershipTransferred
  useWatchContractEvent({
    address: RENT_DISTRIBUTION_VAULT_CONTRACT_ADDRESS,
    abi: RentDistributionVaultABI.abi,
    eventName: "OwnershipTransferred",
    onLogs: (logs) => {
      const parsedLogs = parseEventLogs({
        abi: RentDistributionVaultABI.abi,
        eventName: "OwnershipTransferred",
        logs,
      });
      parsedLogs.forEach((log: any) => {
        if (ownershipTransferredCallbackRef.current) {
          ownershipTransferredCallbackRef.current({
            previousOwner: log.args.previousOwner!,
            newOwner: log.args.newOwner!,
          });
        }
      });
    },
  });

  // Event: RentDeposited
  useWatchContractEvent({
    address: RENT_DISTRIBUTION_VAULT_CONTRACT_ADDRESS,
    abi: RentDistributionVaultABI.abi,
    eventName: "RentDeposited",
    onLogs: (logs) => {
      const parsedLogs = parseEventLogs({
        abi: RentDistributionVaultABI.abi,
        eventName: "RentDeposited",
        logs,
      });
      parsedLogs.forEach((log: any) => {
        if (rentDepositedCallbackRef.current) {
          rentDepositedCallbackRef.current({
            propertyId: log.args.propertyId!,
            amount: log.args.amount!,
          });
        }
      });
    },
  });

  // Event: RentDistributed
  useWatchContractEvent({
    address: RENT_DISTRIBUTION_VAULT_CONTRACT_ADDRESS,
    abi: RentDistributionVaultABI.abi,
    eventName: "RentDistributed",
    onLogs: (logs) => {
      const parsedLogs = parseEventLogs({
        abi: RentDistributionVaultABI.abi,
        eventName: "RentDistributed",
        logs,
      });
      parsedLogs.forEach((log: any) => {
        if (rentDistributedCallbackRef.current) {
          rentDistributedCallbackRef.current({
            propertyId: log.args.propertyId!,
            totalAmount: log.args.totalAmount!,
          });
        }
      });
    },
  });

  // Event handler registration: OwnershipTransferred
  const onOwnershipTransferred = useCallback(
    (callback: (event: OwnershipTransferredEvent) => void) => {
      ownershipTransferredCallbackRef.current = callback;
    },
    []
  );

  // Event handler registration: RentDeposited
  const onRentDeposited = useCallback(
    (callback: (event: RentDepositedEvent) => void) => {
      rentDepositedCallbackRef.current = callback;
    },
    []
  );

  // Event handler registration: RentDistributed
  const onRentDistributed = useCallback(
    (callback: (event: RentDistributedEvent) => void) => {
      rentDistributedCallbackRef.current = callback;
    },
    []
  );

  // Cleanup callbacks on unmount
  useEffect(() => {
    return () => {
      ownershipTransferredCallbackRef.current = null;
      rentDepositedCallbackRef.current = null;
      rentDistributedCallbackRef.current = null;
    };
  }, []);

  return {
    checkUpkeep: {
      data: checkUpkeep.data as
        | { upkeepNeeded: boolean; performData: string }
        | undefined,
      isLoading: checkUpkeep.isLoading,
      error: checkUpkeep.error,
    },
    lastDistribution: {
      data: lastDistribution.data as bigint | undefined,
      isLoading: lastDistribution.isLoading,
      error: lastDistribution.error,
    },
    owner: {
      data: owner.data as Address | undefined,
      isLoading: owner.isLoading,
      error: owner.error,
    },
    realEstateToken: {
      data: realEstateToken.data as Address | undefined,
      isLoading: realEstateToken.isLoading,
      error: realEstateToken.error,
    },
    rentPool: {
      data: rentPool.data as bigint | undefined,
      isLoading: rentPool.isLoading,
      error: rentPool.error,
    },
    stablecoin: {
      data: stablecoin.data as Address | undefined,
      isLoading: stablecoin.isLoading,
      error: stablecoin.error,
    },
    setPropertyId,
    writeContract: writeContractWrapper,
    writeStatus: {
      isPending,
      isSuccess,
      error,
    },
    onOwnershipTransferred,
    onRentDeposited,
    onRentDistributed,
  };
};

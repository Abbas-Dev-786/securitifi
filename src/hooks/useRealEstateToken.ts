import { useState, useCallback } from "react";
import {
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { Address, parseEventLogs } from "viem";
import RealEstateTokenABI from "../abis/RealEstateToken.json";
import { REAL_ESTATE_TOKEN_CONTRACT_ADDRESS } from "./../constants";

// Types for event data
interface ApprovalForAllEvent {
  account: Address;
  operator: Address;
  approved: boolean;
}

interface OwnershipTransferredEvent {
  previousOwner: Address;
  newOwner: Address;
}

interface TokensBurnedEvent {
  from: Address;
  propertyId: bigint;
  amount: bigint;
}

interface TokensMintedEvent {
  to: Address;
  propertyId: bigint;
  amount: bigint;
}

interface TransferBatchEvent {
  operator: Address;
  from: Address;
  to: Address;
  ids: bigint[];
  values: bigint[];
}

interface TransferSingleEvent {
  operator: Address;
  from: Address;
  to: Address;
  id: bigint;
  value: bigint;
}

interface URIEvent {
  value: string;
  id: bigint;
}

// Types for write operations
type WriteFunctionName =
  | "burn"
  | "mint"
  | "renounceOwnership"
  | "safeBatchTransferFrom"
  | "safeTransferFrom"
  | "setApprovalForAll"
  | "setBaseURI"
  | "transferOwnership";

interface RealEstateTokenHook {
  // Read functions
  balanceOf: {
    data: bigint | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  balanceOfBatch: {
    data: bigint[] | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  getTotalSupply: {
    data: bigint | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  isApprovedForAll: {
    data: boolean | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  owner: {
    data: Address | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  supportsInterface: {
    data: boolean | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  uri: {
    data: string | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  setAccount: (account: Address | undefined) => void;
  setPropertyId: (propertyId: bigint | undefined) => void;
  setAccounts: (accounts: Address[] | undefined) => void;
  setIds: (ids: bigint[] | undefined) => void;
  setInterfaceId: (interfaceId: string | undefined) => void;
  // Write function
  writeContract: <T extends WriteFunctionName>(
    functionName: T,
    args: T extends "burn"
      ? [Address, bigint, bigint]
      : T extends "mint"
      ? [Address, bigint, bigint]
      : T extends "renounceOwnership"
      ? []
      : T extends "safeBatchTransferFrom"
      ? [Address, Address, bigint[], bigint[], string]
      : T extends "safeTransferFrom"
      ? [Address, Address, bigint, bigint, string]
      : T extends "setApprovalForAll"
      ? [Address, boolean]
      : T extends "setBaseURI"
      ? [string]
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
  onApprovalForAll: (callback: (event: ApprovalForAllEvent) => void) => void;
  onOwnershipTransferred: (
    callback: (event: OwnershipTransferredEvent) => void
  ) => void;
  onTokensBurned: (callback: (event: TokensBurnedEvent) => void) => void;
  onTokensMinted: (callback: (event: TokensMintedEvent) => void) => void;
  onTransferBatch: (callback: (event: TransferBatchEvent) => void) => void;
  onTransferSingle: (callback: (event: TransferSingleEvent) => void) => void;
  onURI: (callback: (event: URIEvent) => void) => void;
}

export const useRealEstateToken = (
  initialAccount?: Address,
  initialPropertyId?: bigint,
  initialAccounts?: Address[],
  initialIds?: bigint[],
  initialInterfaceId?: string
): RealEstateTokenHook => {
  const [account, setAccount] = useState<Address | undefined>(initialAccount);
  const [propertyId, setPropertyId] = useState<bigint | undefined>(
    initialPropertyId
  );
  const [accounts, setAccounts] = useState<Address[] | undefined>(
    initialAccounts
  );
  const [ids, setIds] = useState<bigint[] | undefined>(initialIds);
  const [interfaceId, setInterfaceId] = useState<string | undefined>(
    initialInterfaceId
  );

  // Read: balanceOf
  const balanceOf = useReadContract({
    address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
    abi: RealEstateTokenABI.abi,
    functionName: "balanceOf",
    args: account && propertyId ? [account, propertyId] : undefined,
    query: { enabled: !!(account && propertyId) },
  });

  // Read: balanceOfBatch
  const balanceOfBatch = useReadContract({
    address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
    abi: RealEstateTokenABI.abi,
    functionName: "balanceOfBatch",
    args: accounts && ids ? [accounts, ids] : undefined,
    query: { enabled: !!(accounts && ids) },
  });

  // Read: getTotalSupply
  const getTotalSupply = useReadContract({
    address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
    abi: RealEstateTokenABI.abi,
    functionName: "getTotalSupply",
    args: propertyId ? [propertyId] : undefined,
    query: { enabled: !!propertyId },
  });

  // Read: isApprovedForAll
  const isApprovedForAll = useReadContract({
    address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
    abi: RealEstateTokenABI.abi,
    functionName: "isApprovedForAll",
    args: account && initialAccount ? [account, initialAccount] : undefined,
    query: { enabled: !!(account && initialAccount) },
  });

  // Read: owner
  const owner = useReadContract({
    address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
    abi: RealEstateTokenABI.abi,
    functionName: "owner",
  });

  // Read: supportsInterface
  const supportsInterface = useReadContract({
    address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
    abi: RealEstateTokenABI.abi,
    functionName: "supportsInterface",
    args: interfaceId ? [interfaceId as `0x${string}`] : undefined,
    query: { enabled: !!interfaceId },
  });

  // Read: uri
  const uri = useReadContract({
    address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
    abi: RealEstateTokenABI.abi,
    functionName: "uri",
    args: propertyId ? [propertyId] : undefined,
    query: { enabled: !!propertyId },
  });

  // Write: Single useWriteContract for all write operations
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  // Generic write function
  const writeContractWrapper = useCallback(
    <T extends WriteFunctionName>(
      functionName: T,
      args: T extends "burn"
        ? [Address, bigint, bigint]
        : T extends "mint"
        ? [Address, bigint, bigint]
        : T extends "renounceOwnership"
        ? []
        : T extends "safeBatchTransferFrom"
        ? [Address, Address, bigint[], bigint[], string]
        : T extends "safeTransferFrom"
        ? [Address, Address, bigint, bigint, string]
        : T extends "setApprovalForAll"
        ? [Address, boolean]
        : T extends "setBaseURI"
        ? [string]
        : T extends "transferOwnership"
        ? [Address]
        : never
    ) => {
      writeContract({
        address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
        abi: RealEstateTokenABI.abi,
        functionName,
        args,
      });
    },
    [writeContract]
  );

  // Event: ApprovalForAll
  const [approvalForAllCallback, setApprovalForAllCallback] = useState<
    ((event: ApprovalForAllEvent) => void) | undefined
  >();

  const onApprovalForAll = useCallback(
    (callback: (event: ApprovalForAllEvent) => void) => {
      setApprovalForAllCallback(() => callback);
    },
    []
  );

  useWatchContractEvent({
    address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
    abi: RealEstateTokenABI.abi,
    eventName: "ApprovalForAll",
    onLogs: useCallback(
      (logs: any) => {
        if (!approvalForAllCallback) return;
        const parsedLogs = parseEventLogs({
          abi: RealEstateTokenABI.abi,
          eventName: "ApprovalForAll",
          logs,
        });
        parsedLogs.forEach((log: any) => {
          approvalForAllCallback({
            account: log.args.account!,
            operator: log.args.operator!,
            approved: log.args.approved!,
          });
        });
      },
      [approvalForAllCallback]
    ),
  });

  // Event: OwnershipTransferred
  const [ownershipTransferredCallback, setOwnershipTransferredCallback] =
    useState<((event: OwnershipTransferredEvent) => void) | undefined>();

  const onOwnershipTransferred = useCallback(
    (callback: (event: OwnershipTransferredEvent) => void) => {
      setOwnershipTransferredCallback(() => callback);
    },
    []
  );

  useWatchContractEvent({
    address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
    abi: RealEstateTokenABI.abi,
    eventName: "OwnershipTransferred",
    onLogs: useCallback(
      (logs: any) => {
        if (!ownershipTransferredCallback) return;
        const parsedLogs = parseEventLogs({
          abi: RealEstateTokenABI.abi,
          eventName: "OwnershipTransferred",
          logs,
        });
        parsedLogs.forEach((log: any) => {
          ownershipTransferredCallback({
            previousOwner: log.args.previousOwner!,
            newOwner: log.args.newOwner!,
          });
        });
      },
      [ownershipTransferredCallback]
    ),
  });

  // Event: TokensBurned
  const [tokensBurnedCallback, setTokensBurnedCallback] = useState<
    ((event: TokensBurnedEvent) => void) | undefined
  >();

  const onTokensBurned = useCallback(
    (callback: (event: TokensBurnedEvent) => void) => {
      setTokensBurnedCallback(() => callback);
    },
    []
  );

  useWatchContractEvent({
    address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
    abi: RealEstateTokenABI.abi,
    eventName: "TokensBurned",
    onLogs: useCallback(
      (logs: any) => {
        if (!tokensBurnedCallback) return;
        const parsedLogs = parseEventLogs({
          abi: RealEstateTokenABI.abi,
          eventName: "TokensBurned",
          logs,
        });
        parsedLogs.forEach((log: any) => {
          tokensBurnedCallback({
            from: log.args.from!,
            propertyId: log.args.propertyId!,
            amount: log.args.amount!,
          });
        });
      },
      [tokensBurnedCallback]
    ),
  });

  // Event: TokensMinted
  const [tokensMintedCallback, setTokensMintedCallback] = useState<
    ((event: TokensMintedEvent) => void) | undefined
  >();

  const onTokensMinted = useCallback(
    (callback: (event: TokensMintedEvent) => void) => {
      setTokensMintedCallback(() => callback);
    },
    []
  );

  useWatchContractEvent({
    address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
    abi: RealEstateTokenABI.abi,
    eventName: "TokensMinted",
    onLogs: useCallback(
      (logs: any) => {
        if (!tokensMintedCallback) return;
        const parsedLogs = parseEventLogs({
          abi: RealEstateTokenABI.abi,
          eventName: "TokensMinted",
          logs,
        });
        parsedLogs.forEach((log: any) => {
          tokensMintedCallback({
            to: log.args.to!,
            propertyId: log.args.propertyId!,
            amount: log.args.amount!,
          });
        });
      },
      [tokensMintedCallback]
    ),
  });

  // Event: TransferBatch
  const [transferBatchCallback, setTransferBatchCallback] = useState<
    ((event: TransferBatchEvent) => void) | undefined
  >();

  const onTransferBatch = useCallback(
    (callback: (event: TransferBatchEvent) => void) => {
      setTransferBatchCallback(() => callback);
    },
    []
  );

  useWatchContractEvent({
    address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
    abi: RealEstateTokenABI.abi,
    eventName: "TransferBatch",
    onLogs: useCallback(
      (logs: any) => {
        if (!transferBatchCallback) return;
        const parsedLogs = parseEventLogs({
          abi: RealEstateTokenABI.abi,
          eventName: "TransferBatch",
          logs,
        });
        parsedLogs.forEach((log: any) => {
          transferBatchCallback({
            operator: log.args.operator!,
            from: log.args.from!,
            to: log.args.to!,
            ids: log.args.ids!,
            values: log.args.values!,
          });
        });
      },
      [transferBatchCallback]
    ),
  });

  // Event: TransferSingle
  const [transferSingleCallback, setTransferSingleCallback] = useState<
    ((event: TransferSingleEvent) => void) | undefined
  >();

  const onTransferSingle = useCallback(
    (callback: (event: TransferSingleEvent) => void) => {
      setTransferSingleCallback(() => callback);
    },
    []
  );

  useWatchContractEvent({
    address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
    abi: RealEstateTokenABI.abi,
    eventName: "TransferSingle",
    onLogs: useCallback(
      (logs: any) => {
        if (!transferSingleCallback) return;
        const parsedLogs = parseEventLogs({
          abi: RealEstateTokenABI.abi,
          eventName: "TransferSingle",
          logs,
        });
        parsedLogs.forEach((log: any) => {
          transferSingleCallback({
            operator: log.args.operator!,
            from: log.args.from!,
            to: log.args.to!,
            id: log.args.id!,
            value: log.args.value!,
          });
        });
      },
      [transferSingleCallback]
    ),
  });

  // Event: URI
  const [uriCallback, setUriCallback] = useState<
    ((event: URIEvent) => void) | undefined
  >();

  const onURI = useCallback((callback: (event: URIEvent) => void) => {
    setUriCallback(() => callback);
  }, []);

  useWatchContractEvent({
    address: REAL_ESTATE_TOKEN_CONTRACT_ADDRESS,
    abi: RealEstateTokenABI.abi,
    eventName: "URI",
    onLogs: useCallback(
      (logs: any) => {
        if (!uriCallback) return;
        const parsedLogs = parseEventLogs({
          abi: RealEstateTokenABI.abi,
          eventName: "URI",
          logs,
        });
        parsedLogs.forEach((log: any) => {
          uriCallback({
            value: log.args.value!,
            id: log.args.id!,
          });
        });
      },
      [uriCallback]
    ),
  });

  return {
    balanceOf: {
      data: balanceOf.data as bigint | undefined,
      isLoading: balanceOf.isLoading,
      error: balanceOf.error,
    },
    balanceOfBatch: {
      data: balanceOfBatch.data as bigint[] | undefined,
      isLoading: balanceOfBatch.isLoading,
      error: balanceOfBatch.error,
    },
    getTotalSupply: {
      data: getTotalSupply.data as bigint | undefined,
      isLoading: getTotalSupply.isLoading,
      error: getTotalSupply.error,
    },
    isApprovedForAll: {
      data: isApprovedForAll.data as boolean | undefined,
      isLoading: isApprovedForAll.isLoading,
      error: isApprovedForAll.error,
    },
    owner: {
      data: owner.data as Address | undefined,
      isLoading: owner.isLoading,
      error: owner.error,
    },
    supportsInterface: {
      data: supportsInterface.data as boolean | undefined,
      isLoading: supportsInterface.isLoading,
      error: supportsInterface.error,
    },
    uri: {
      data: uri.data as string | undefined,
      isLoading: uri.isLoading,
      error: uri.error,
    },
    setAccount,
    setPropertyId,
    setAccounts,
    setIds,
    setInterfaceId,
    writeContract: writeContractWrapper,
    writeStatus: {
      isPending,
      isSuccess,
      error,
    },
    onApprovalForAll,
    onOwnershipTransferred,
    onTokensBurned,
    onTokensMinted,
    onTransferBatch,
    onTransferSingle,
    onURI,
  };
};

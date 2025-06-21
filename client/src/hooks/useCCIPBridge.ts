import { useState, useCallback } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { Address } from "viem";
import CCIPBridgeABI from "./../abis/CCIPBridge.json";
import { CCIP_BRIDGE_CONTRACT_ADDRESS } from "../constants";

// Types for event data
interface TokensLockedEvent {
  sender: Address;
  propertyId: bigint;
  amount: bigint;
  destinationChain: string;
}

interface TokensMintedEvent {
  receiver: Address;
  propertyId: bigint;
  amount: bigint;
  sourceChain: string;
}

// Types for write operations
type WriteFunctionName =
  | "lockAndSend"
  | "setDestinationChain"
  | "transferOwnership"
  | "renounceOwnership";

interface CCIPBridgeHook {
  // Read functions
  ccipRouter: {
    data: Address | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  realEstateToken: {
    data: Address | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  chainSelector: {
    data: bigint | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  destinationBridge: {
    data: Address | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  owner: { data: Address | undefined; isLoading: boolean; error: Error | null };
  setChainName: (chainName: string | undefined) => void;
  // Write function
  writeContract: <T extends WriteFunctionName>(
    functionName: T,
    args: T extends "lockAndSend"
      ? [Address, bigint, bigint, string]
      : T extends "setDestinationChain"
      ? [string, bigint, Address]
      : T extends "transferOwnership"
      ? [Address]
      : []
  ) => void;
  writeStatus: {
    isPending: boolean;
    isSuccess: boolean;
    error: Error | null;
  };
  // Events
  onTokensLocked: (callback: (event: TokensLockedEvent) => void) => void;
  onTokensMinted: (callback: (event: TokensMintedEvent) => void) => void;
}

export const useCCIPBridge = (initialChainName?: string): CCIPBridgeHook => {
  const [chainName, setChainName] = useState<string | undefined>(
    initialChainName
  );

  // Read: ccipRouter
  const ccipRouter = useReadContract({
    address: CCIP_BRIDGE_CONTRACT_ADDRESS,
    abi: CCIPBridgeABI.abi,
    functionName: "ccipRouter",
  });

  // Read: realEstateToken
  const realEstateToken = useReadContract({
    address: CCIP_BRIDGE_CONTRACT_ADDRESS,
    abi: CCIPBridgeABI.abi,
    functionName: "realEstateToken",
  });

  // Read: owner
  const owner = useReadContract({
    address: CCIP_BRIDGE_CONTRACT_ADDRESS,
    abi: CCIPBridgeABI.abi,
    functionName: "owner",
  });

  // Read: chainSelectors
  const chainSelector = useReadContract({
    address: CCIP_BRIDGE_CONTRACT_ADDRESS,
    abi: CCIPBridgeABI.abi,
    functionName: "chainSelectors",
    args: chainName ? [chainName] : undefined,
    query: { enabled: !!chainName },
  });

  // Read: destinationBridges
  const destinationBridge = useReadContract({
    address: CCIP_BRIDGE_CONTRACT_ADDRESS,
    abi: CCIPBridgeABI.abi,
    functionName: "destinationBridges",
    args: chainName ? [chainName] : undefined,
    query: { enabled: !!chainName },
  });

  // Write: Single useWriteContract for all write operations
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  // Generic write function
  const writeContractWrapper = useCallback(
    <T extends WriteFunctionName>(
      functionName: T,
      args: T extends "lockAndSend"
        ? [Address, bigint, bigint, string]
        : T extends "setDestinationChain"
        ? [string, bigint, Address]
        : T extends "transferOwnership"
        ? [Address]
        : []
    ) => {
      writeContract({
        address: CCIP_BRIDGE_CONTRACT_ADDRESS,
        abi: CCIPBridgeABI.abi,
        functionName,
        args,
      });
    },
    [writeContract]
  );

  // Event handlers
  const [tokensLockedCallback, setTokensLockedCallback] = useState<
    ((event: TokensLockedEvent) => void) | null
  >(null);
  const [tokensMintedCallback, setTokensMintedCallback] = useState<
    ((event: TokensMintedEvent) => void) | null
  >(null);

  // Event: TokensLocked
  // useContractEvent({
  //   address: contractAddress,
  //   abi: CCIPBridgeABI.abi,
  //   eventName: "TokensLocked",
  //   listener: (logs: any) => {
  //     if (!tokensLockedCallback) return;
  //     const parsedLogs = parseEventLogs({
  //       abi: CCIPBridgeABI.abi,
  //       eventName: "TokensLocked",
  //       logs,
  //     });
  //     parsedLogs.forEach((log: any) => {
  //       tokensLockedCallback({
  //         sender: log.args.sender!,
  //         propertyId: log.args.propertyId!,
  //         amount: log.args.amount!,
  //         destinationChain: log.args.destinationChain!,
  //       });
  //     });
  //   },
  // });

  // // Event: TokensMinted
  // useContractEvent({
  //   address: contractAddress,
  //   abi: CCIPBridgeABI,
  //   eventName: "TokensMinted",
  //   listener: (logs: any) => {
  //     if (!tokensMintedCallback) return;
  //     const parsedLogs = parseEventLogs({
  //       abi: CCIPBridgeABI.abi,
  //       eventName: "TokensMinted",
  //       logs,
  //     });
  //     parsedLogs.forEach((log: any) => {
  //       tokensMintedCallback({
  //         receiver: log.args.receiver!,
  //         propertyId: log.args.propertyId!,
  //         amount: log.args.amount!,
  //         sourceChain: log.args.sourceChain!,
  //       });
  //     });
  //   },
  // });

  const onTokensLocked = useCallback(
    (callback: (event: TokensLockedEvent) => void) => {
      setTokensLockedCallback(() => callback);
    },
    []
  );

  const onTokensMinted = useCallback(
    (callback: (event: TokensMintedEvent) => void) => {
      setTokensMintedCallback(() => callback);
    },
    []
  );

  return {
    ccipRouter: {
      data: ccipRouter.data as Address | undefined,
      isLoading: ccipRouter.isLoading,
      error: ccipRouter.error,
    },
    realEstateToken: {
      data: realEstateToken.data as Address | undefined,
      isLoading: realEstateToken.isLoading,
      error: realEstateToken.error,
    },
    owner: {
      data: owner.data as Address | undefined,
      isLoading: owner.isLoading,
      error: owner.error,
    },
    chainSelector: {
      data: chainSelector.data as bigint | undefined,
      isLoading: chainSelector.isLoading,
      error: chainSelector.error,
    },
    destinationBridge: {
      data: destinationBridge.data as Address | undefined,
      isLoading: destinationBridge.isLoading,
      error: destinationBridge.error,
    },
    setChainName,
    writeContract: writeContractWrapper,
    writeStatus: {
      isPending,
      isSuccess,
      error,
    },
    onTokensLocked,
    onTokensMinted,
  };
};

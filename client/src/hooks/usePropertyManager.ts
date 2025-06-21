import { useState, useEffect, useCallback } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { parseEther } from "viem";
import PropertyManagerABI from "../abis/PropertyManager.json";
import { PROPERTY_MANAGER_CONTRACT_ADDRESS } from "../constants";
import { readContract } from "wagmi/actions";
import { config } from "../config";

interface Property {
  id: number;
  metadataURI: string;
  verified: boolean;
  initialValue: bigint;
  initialIndex: bigint;
}

interface UsePropertyManagerReturn {
  isConnected: boolean;
  isOwner: boolean;
  owner: string | undefined;
  propertyCount: bigint | undefined;
  properties: Property[];
  donId: string | undefined;
  realEstateToken: string | undefined;
  oracleConsumer: string | undefined;
  submitProperty: (metadataURI: string, initialValue: string) => Promise<void>;
  verifyProperty: (propertyId: string, subscriptionId: string) => Promise<void>;
  mintTokens: (propertyId: string, to: string, amount: string) => Promise<void>;
  storeMetadata: (propertyId: string, metadataURI: string) => Promise<void>;
  setInitialIndex: (propertyId: string) => Promise<void>;
  setDonId: (donId: string) => Promise<void>;
  setRealEstateToken: (address: string) => Promise<void>;
  setOracleConsumer: (address: string) => Promise<void>;
  transferOwnership: (newOwner: string) => Promise<void>;
  renounceOwnership: () => Promise<void>;
  getPropertyDetails: (propertyId: string) => Promise<Property | undefined>;
  loading: boolean;
  error: string | undefined;
}

export const usePropertyManager = (): UsePropertyManagerReturn => {
  const { address, isConnected } = useAccount();
  const [isOwner, setIsOwner] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  // Read: Owner
  const { data: owner } = useReadContract({
    address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
    abi: PropertyManagerABI.abi,
    functionName: "owner",
    query: { enabled: isConnected },
  });

  // Read: Property Count
  const { data: propertyCount } = useReadContract({
    address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
    abi: PropertyManagerABI.abi,
    functionName: "propertyCount",
    query: { enabled: isConnected },
  });

  // Read: DON ID
  const { data: donId } = useReadContract({
    address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
    abi: PropertyManagerABI.abi,
    functionName: "donId",
    query: { enabled: isConnected },
  });

  // Read: RealEstateToken Address
  const { data: realEstateToken } = useReadContract({
    address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
    abi: PropertyManagerABI.abi,
    functionName: "realEstateToken",
    query: { enabled: isConnected },
  });

  // Read: OracleConsumer Address
  const { data: oracleConsumer } = useReadContract({
    address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
    abi: PropertyManagerABI.abi,
    functionName: "oracleConsumer",
    query: { enabled: isConnected },
  });

  // Check if connected wallet is owner
  useEffect(() => {
    setIsOwner(
      address && owner
        ? address.toLowerCase() === (owner as string).toLowerCase()
        : false
    );
  }, [address, owner]);

  // Fetch properties
  useEffect(() => {
    // Only fetch if connected, on Sepolia, and propertyCount is defined
    if (!isConnected || propertyCount === undefined) {
      setProperties([]);
      if (!isConnected) setError("Please connect your wallet");
      else setError("Property count not available");
      return;
    }

    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(undefined);
        const props: Property[] = [];
        const count = Number(propertyCount);
        console.log("Fetching properties", { count, propertyCount });

        if (count === 0) {
          setProperties([]);
          setError("No properties found");
          return;
        }

        for (let i = 1; i <= count; i++) {
          console.log("Fetching property ID", i);
          try {
            const data = (await readContract(config, {
              address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
              abi: PropertyManagerABI.abi,
              functionName: "getPropertyDetails",
              args: [BigInt(i)],
            })) as [string, boolean, bigint, bigint];
            props.push({
              id: i,
              metadataURI: data[0],
              verified: data[1],
              initialValue: data[2],
              initialIndex: data[3],
            });
          } catch (err: any) {
            console.warn(`Failed to fetch property ID ${i}: ${err.message}`);
            continue; // Skip invalid property IDs
          }
        }

        if (props.length === 0 && count > 0) {
          setError("No valid properties found");
        }
        setProperties(props);
      } catch (err: any) {
        setError("Failed to fetch properties: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [propertyCount, isConnected]);

  // Write: Submit Property
  const { writeContractAsync: submitPropertyWrite, isPending: isSubmitting } =
    useWriteContract();

  const submitProperty = useCallback(
    async (metadataURI: string, initialValue: string) => {
      try {
        setLoading(true);
        setError(undefined);
        await submitPropertyWrite({
          address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
          abi: PropertyManagerABI.abi,
          functionName: "submitProperty",
          args: [metadataURI, parseEther(initialValue)],
        });
      } catch (err: any) {
        setError(err.message || "Failed to submit property");
        throw err; // Rethrow to allow components to handle errors
      } finally {
        setLoading(false);
      }
    },
    [submitPropertyWrite]
  );

  // Write: Verify Property
  const { writeContractAsync: verifyPropertyWrite, isPending: isVerifying } =
    useWriteContract();

  const verifyProperty = useCallback(
    async (propertyId: string, subscriptionId: string) => {
      try {
        setLoading(true);
        setError(undefined);
        await verifyPropertyWrite({
          address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
          abi: PropertyManagerABI.abi,
          functionName: "verifyProperty",
          args: [BigInt(propertyId), BigInt(subscriptionId)],
        });
      } catch (err: any) {
        setError(err.message || "Failed to verify property");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [verifyPropertyWrite]
  );

  // Write: Mint Tokens
  const { writeContractAsync: mintTokensWrite, isPending: isMinting } =
    useWriteContract();

  const mintTokens = useCallback(
    async (propertyId: string, to: string, amount: string) => {
      try {
        setLoading(true);
        setError(undefined);
        await mintTokensWrite({
          address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
          abi: PropertyManagerABI.abi,
          functionName: "mintTokens",
          args: [BigInt(propertyId), to, parseEther(amount)],
        });
      } catch (err: any) {
        setError(err.message || "Failed to mint tokens");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [mintTokensWrite]
  );

  // Write: Store Metadata
  const {
    writeContractAsync: storeMetadataWrite,
    isPending: isUpdatingMetadata,
  } = useWriteContract();

  const storeMetadata = useCallback(
    async (propertyId: string, metadataURI: string) => {
      try {
        setLoading(true);
        setError(undefined);
        await storeMetadataWrite({
          address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
          abi: PropertyManagerABI.abi,
          functionName: "storeMetadata",
          args: [BigInt(propertyId), metadataURI],
        });
      } catch (err: any) {
        setError(err.message || "Failed to update metadata");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [storeMetadataWrite]
  );

  // Write: Set Initial Index
  const {
    writeContractAsync: setInitialIndexWrite,
    isPending: isSettingIndex,
  } = useWriteContract();

  const setInitialIndex = useCallback(
    async (propertyId: string) => {
      try {
        setLoading(true);
        setError(undefined);
        await setInitialIndexWrite({
          address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
          abi: PropertyManagerABI.abi,
          functionName: "setInitialIndex",
          args: [BigInt(propertyId)],
        });
      } catch (err: any) {
        setError(err.message || "Failed to set initial index");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setInitialIndexWrite]
  );

  // Write: Set DON ID
  const { writeContractAsync: setDonIdWrite, isPending: isSettingDonId } =
    useWriteContract();

  const setDonId = useCallback(
    async (donId: string) => {
      try {
        setLoading(true);
        setError(undefined);
        await setDonIdWrite({
          address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
          abi: PropertyManagerABI.abi,
          functionName: "setDonId",
          args: [donId],
        });
      } catch (err: any) {
        setError(err.message || "Failed to set DON ID");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setDonIdWrite]
  );

  // Write: Set RealEstateToken
  const {
    writeContractAsync: setRealEstateTokenWrite,
    isPending: isSettingRealEstateToken,
  } = useWriteContract();

  const setRealEstateToken = useCallback(
    async (address: string) => {
      try {
        setLoading(true);
        setError(undefined);
        await setRealEstateTokenWrite({
          address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
          abi: PropertyManagerABI.abi,
          functionName: "setRealEstateToken",
          args: [address],
        });
      } catch (err: any) {
        setError(err.message || "Failed to set RealEstateToken");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setRealEstateTokenWrite]
  );

  // Write: Set OracleConsumer
  const {
    writeContractAsync: setOracleConsumerWrite,
    isPending: isSettingOracleConsumer,
  } = useWriteContract();

  const setOracleConsumer = useCallback(
    async (address: string) => {
      try {
        setLoading(true);
        setError(undefined);
        await setOracleConsumerWrite({
          address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
          abi: PropertyManagerABI.abi,
          functionName: "setOracleConsumer",
          args: [address],
        });
      } catch (err: any) {
        setError(err.message || "Failed to set OracleConsumer");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setOracleConsumerWrite]
  );

  // Write: Transfer Ownership
  const {
    writeContractAsync: transferOwnershipWrite,
    isPending: isTransferringOwnership,
  } = useWriteContract();

  const transferOwnership = useCallback(
    async (newOwner: string) => {
      try {
        setLoading(true);
        setError(undefined);
        await transferOwnershipWrite({
          address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
          abi: PropertyManagerABI.abi,
          functionName: "transferOwnership",
          args: [newOwner],
        });
      } catch (err: any) {
        setError(err.message || "Failed to transfer ownership");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [transferOwnershipWrite]
  );

  // Write: Renounce Ownership
  const {
    writeContractAsync: renounceOwnershipWrite,
    isPending: isRenouncingOwnership,
  } = useWriteContract();

  const renounceOwnership = useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);
      await renounceOwnershipWrite({
        address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
        abi: PropertyManagerABI.abi,
        functionName: "renounceOwnership",
      });
    } catch (err: any) {
      setError(err.message || "Failed to renounce ownership");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [renounceOwnershipWrite]);

  // Read: Get Property Details
  const getPropertyDetails = useCallback(
    async (propertyId: string): Promise<Property | undefined> => {
      try {
        setLoading(true);
        setError(undefined);
        const data = (await readContract(config, {
          address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
          abi: PropertyManagerABI.abi,
          functionName: "getPropertyDetails",
          args: [BigInt(propertyId)],
        })) as [string, boolean, bigint, bigint];
        return {
          id: Number(propertyId),
          metadataURI: data[0],
          verified: data[1],
          initialValue: data[2],
          initialIndex: data[3],
        };
      } catch (err: any) {
        setError(err.message || "Failed to fetch property details");
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Watch Events (e.g., PropertyVerified)
  useWatchContractEvent({
    address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
    abi: PropertyManagerABI.abi,
    eventName: "PropertyVerified",
    onLogs: () => {
      if (!isConnected || propertyCount === undefined) return;

      const fetchProperties = async () => {
        try {
          setLoading(true);
          setError(undefined);
          const props: Property[] = [];
          const count = Number(propertyCount);
          console.log("Refetching properties after PropertyVerified", {
            count,
            propertyCount,
          });

          if (count === 0) {
            setProperties([]);
            setError("No properties found");
            return;
          }

          for (let i = 1; i <= count; i++) {
            try {
              const data = (await readContract(config, {
                address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
                abi: PropertyManagerABI.abi,
                functionName: "getPropertyDetails",
                args: [BigInt(i)],
              })) as [string, boolean, bigint, bigint];
              props.push({
                id: i,
                metadataURI: data[0],
                verified: data[1],
                initialValue: data[2],
                initialIndex: data[3],
              });
            } catch (err: any) {
              console.warn(`Failed to fetch property ID ${i}: ${err.message}`);
              continue;
            }
          }

          if (props.length === 0 && count > 0) {
            setError("No valid properties found");
          }
          setProperties(props);
        } catch (err: any) {
          setError("Failed to fetch properties: " + err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchProperties();
    },
  });

  // Aggregate loading states
  const isLoading =
    isSubmitting ||
    isVerifying ||
    isMinting ||
    isUpdatingMetadata ||
    isSettingIndex ||
    isSettingDonId ||
    isSettingRealEstateToken ||
    isSettingOracleConsumer ||
    isTransferringOwnership ||
    isRenouncingOwnership ||
    loading;

  return {
    isConnected,
    isOwner,
    owner: owner?.toString(),
    propertyCount: propertyCount as bigint | undefined,
    properties,
    donId: donId?.toString(),
    realEstateToken: realEstateToken?.toString(),
    oracleConsumer: oracleConsumer?.toString(),
    submitProperty,
    verifyProperty,
    mintTokens,
    storeMetadata,
    setInitialIndex,
    setDonId,
    setRealEstateToken,
    setOracleConsumer,
    transferOwnership,
    renounceOwnership,
    getPropertyDetails,
    loading: isLoading,
    error,
  };
};

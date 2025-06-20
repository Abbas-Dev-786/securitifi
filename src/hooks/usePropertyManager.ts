import { useState } from 'react';
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { readContract as wagmiReadContract } from 'wagmi/actions';
import { parseEther, formatEther } from 'viem';
import { toast } from 'react-toastify';
import { PROPERTY_MANAGER_CONTRACT_ADDRESS } from '../constants';
import PropertyManagerABI from '../abis/PropertyManager.json';

export const usePropertyManager = () => {
  const [loading, setLoading] = useState(false);

  // Write contract hook
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Read property count
  const { data: propertyCount, refetch: refetchPropertyCount } = useReadContract({
    address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
    abi: PropertyManagerABI.abi,
    functionName: 'propertyCount',
  });

  // Create property
  const createProperty = async (
    propertyAddress: string,
    propertyValue: string,
    description: string,
    imageUrl: string
  ) => {
    try {
      setLoading(true);
      const valueInWei = parseEther(propertyValue);
      
      await writeContract({
        address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
        abi: PropertyManagerABI.abi,
        functionName: 'createProperty',
        args: [propertyAddress, valueInWei, description, imageUrl],
      });

      toast.success('Property creation transaction submitted!');
    } catch (error: any) {
      console.error('Error creating property:', error);
      toast.error(error.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  // Get property details
  const getPropertyDetails = async (propertyId: number) => {
    try {
      const result = await readContract({
        address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
        abi: PropertyManagerABI.abi,
        functionName: 'getPropertyDetails',
        args: [propertyId],
      });
      return result;
    } catch (error) {
      console.error('Error fetching property details:', error);
      return null;
    }
  };

  // Verify property (owner only)
  const verifyProperty = async (propertyId: number) => {
    try {
      setLoading(true);
      await writeContract({
        address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
        abi: PropertyManagerABI.abi,
        functionName: 'verifyProperty',
        args: [propertyId],
      });

      toast.success('Property verification transaction submitted!');
    } catch (error: any) {
      console.error('Error verifying property:', error);
      toast.error(error.message || 'Failed to verify property');
    } finally {
      setLoading(false);
    }
  };

  // Get user properties
  const getUserProperties = async (userAddress: string) => {
    try {
      const result = await readContract({
        address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
        abi: PropertyManagerABI.abi,
        functionName: 'getUserProperties',
        args: [userAddress],
      });
      return result;
    } catch (error) {
      console.error('Error fetching user properties:', error);
      return [];
    }
  };

  return {
    createProperty,
    getPropertyDetails,
    verifyProperty,
    getUserProperties,
    propertyCount: propertyCount ? Number(propertyCount) : 0,
    refetchPropertyCount,
    loading: loading || isPending || isConfirming,
    isConfirmed,
    hash,
    error,
  };
};

// Helper function for read contract (to be used outside hooks)
const readContract = async (config: any) => {
  try {
    return await wagmiReadContract(config);
  } catch (error) {
    console.error('Error reading contract:', error);
    return null;
  }
};
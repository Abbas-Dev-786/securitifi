import { useState, useCallback } from 'react';
import { useContracts } from './useContracts';
import { useWeb3 } from '../contexts/Web3Context';
import { Property, PropertyFormData } from '../types';
import { parseEther, formatEther } from 'ethers';
import { toast } from 'react-toastify';

export const usePropertyManager = () => {
  const { propertyManager, isReady } = useContracts();
  const { wallet } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);

  const mintProperty = useCallback(async (formData: PropertyFormData) => {
    if (!propertyManager || !isReady) {
      throw new Error('Property manager not initialized');
    }

    setLoading(true);
    try {
      const metadata = {
        name: `Property at ${formData.propertyAddress}`,
        description: formData.description,
        image: formData.imageUrl,
        attributes: [
          { trait_type: 'Property Type', value: formData.propertyType },
          { trait_type: 'Bedrooms', value: formData.bedrooms },
          { trait_type: 'Bathrooms', value: formData.bathrooms },
          { trait_type: 'Square Footage', value: formData.squareFootage },
        ]
      };

      // In a real app, you'd upload this to IPFS
      const metadataURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;
      
      const propertyValue = parseEther(formData.propertyValue);
      
      const tx = await propertyManager.createProperty(
        formData.propertyAddress,
        1,
        metadataURI,
        propertyValue
      );

      toast.info('Transaction submitted. Waiting for confirmation...');
      const receipt = await tx.wait();

      // Extract token ID from events
      const mintEvent = receipt.logs.find((log: any) => 
        log.topics[0] === propertyManager.interface.getEvent('Transfer').topicHash
      );
      
      const tokenId = mintEvent ? parseInt(mintEvent.topics[3], 16) : null;

      toast.success(`Property NFT minted successfully! Token ID: ${tokenId}`);
      
      await fetchUserProperties();
      return tokenId;
    } catch (error: any) {
      console.error('Failed to mint property:', error);
      toast.error(error.reason || error.message || 'Failed to mint property');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [propertyManager, isReady]);

  const fetchProperty = useCallback(async (tokenId: number): Promise<Property | null> => {
    if (!propertyManager || !isReady) return null;

    try {
      const property = await propertyManager.getProperty(tokenId);
      return {
        id: Number(property.id),
        owner: property.owner,
        propertyAddress: property.propertyAddress,
        propertyValue: property.propertyValue,
        metadataURI: property.metadataURI,
        isVerified: property.isVerified,
        createdAt: property.createdAt
      };
    } catch (error) {
      console.error('Failed to fetch property:', error);
      return null;
    }
  }, [propertyManager, isReady]);

  const fetchUserProperties = useCallback(async () => {
    if (!propertyManager || !isReady || !wallet.address) return;

    setLoading(true);
    try {
      const tokenIds = await propertyManager.getPropertiesByOwner(wallet.address);
      const propertyPromises = tokenIds.map((tokenId: bigint) => 
        fetchProperty(Number(tokenId))
      );
      
      const fetchedProperties = await Promise.all(propertyPromises);
      setProperties(fetchedProperties.filter(Boolean) as Property[]);
    } catch (error) {
      console.error('Failed to fetch user properties:', error);
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  }, [propertyManager, isReady, wallet.address, fetchProperty]);

  const verifyProperty = useCallback(async (tokenId: number) => {
    if (!propertyManager || !isReady) {
      throw new Error('Property manager not initialized');
    }

    setLoading(true);
    try {
      const tx = await propertyManager.verifyProperty(tokenId);
      toast.info('Verification submitted. Waiting for confirmation...');
      await tx.wait();
      toast.success('Property verified successfully!');
      await fetchUserProperties();
    } catch (error: any) {
      console.error('Failed to verify property:', error);
      toast.error(error.reason || error.message || 'Failed to verify property');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [propertyManager, isReady, fetchUserProperties]);

  return {
    mintProperty,
    fetchProperty,
    fetchUserProperties,
    verifyProperty,
    properties,
    loading
  };
};
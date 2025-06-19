import { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Contract } from 'ethers';

export const useContracts = () => {
  const { contracts, wallet } = useWeb3();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(
      !!contracts.propertyManager &&
      !!contracts.lendingPool &&
      wallet.isConnected &&
      !contracts.isLoading
    );
  }, [contracts, wallet.isConnected]);

  return {
    propertyManager: contracts.propertyManager as Contract | null,
    lendingPool: contracts.lendingPool as Contract | null,
    ccipBridge: contracts.ccipBridge as Contract | null,
    isReady,
    isLoading: contracts.isLoading,
    error: contracts.error
  };
};
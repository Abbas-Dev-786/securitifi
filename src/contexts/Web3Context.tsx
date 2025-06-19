import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider, JsonRpcSigner, Contract } from 'ethers';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { contractAddresses, networkConfig } from '../contracts/addresses';
import PropertyManagerABI from '../contracts/abis/PropertyManager.json';
import LendingPoolABI from '../contracts/abis/LendingPool.json';
import { WalletState, ContractState } from '../types';

interface Web3ContextType {
  wallet: WalletState;
  contracts: ContractState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
  refreshBalance: () => Promise<void>;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Web3Modal configuration
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

// Only create Web3Modal if we have a valid project ID
let web3modal: any = null;

if (projectId && projectId.trim() !== '') {
  const metadata = {
    name: 'SecuritiFi',
    description: 'Real Estate Tokenization Platform',
    url: 'https://securitifi.app',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  };

  const config = defaultConfig({
    metadata,
    enableEIP6963: true,
    enableInjected: true,
    enableCoinbase: true,
    rpcUrl: 'https://cloudflare-eth.com'
  });

  web3modal = createWeb3Modal({
    ethersConfig: config,
    chains: [
      {
        chainId: 11155111,
        name: 'Sepolia',
        currency: 'ETH',
        explorerUrl: 'https://sepolia.etherscan.io',
        rpcUrl: networkConfig[11155111].rpcUrl
      },
      {
        chainId: 80001,
        name: 'Mumbai',
        currency: 'MATIC',
        explorerUrl: 'https://mumbai.polygonscan.com',
        rpcUrl: networkConfig[80001].rpcUrl
      }
    ],
    projectId,
    enableAnalytics: false
  });
}

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    balance: '0',
    isConnecting: false,
    error: null
  });

  const [contracts, setContracts] = useState<ContractState>({
    propertyManager: null,
    lendingPool: null,
    ccipBridge: null,
    isLoading: false,
    error: null
  });

  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);

  const initializeContracts = async (chainId: number, signerInstance: JsonRpcSigner) => {
    try {
      setContracts(prev => ({ ...prev, isLoading: true, error: null }));

      const addresses = contractAddresses[chainId];
      if (!addresses) {
        throw new Error(`Network ${chainId} not supported`);
      }

      const propertyManager = new Contract(addresses.propertyManager, PropertyManagerABI, signerInstance);
      const lendingPool = new Contract(addresses.lendingPool, LendingPoolABI, signerInstance);

      setContracts({
        propertyManager,
        lendingPool,
        ccipBridge: null, // Will be implemented later
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Failed to initialize contracts:', error);
      setContracts(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize contracts'
      }));
    }
  };

  const refreshBalance = async () => {
    if (!provider || !wallet.address) return;

    try {
      const balance = await provider.getBalance(wallet.address);
      setWallet(prev => ({
        ...prev,
        balance: balance.toString()
      }));
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };

  const connectWallet = async () => {
    try {
      setWallet(prev => ({ ...prev, isConnecting: true, error: null }));

      if (!web3modal) {
        throw new Error('WalletConnect Project ID not configured. Please add VITE_WALLET_CONNECT_PROJECT_ID to your .env file.');
      }

      // Use the Web3Modal instance to open the modal
      await web3modal.open();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWallet(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet'
      }));
    }
  };

  const disconnectWallet = async () => {
    try {
      if (web3modal) {
        await web3modal.close();
      }
      
      setWallet({
        address: null,
        isConnected: false,
        chainId: null,
        balance: '0',
        isConnecting: false,
        error: null
      });
      setContracts({
        propertyManager: null,
        lendingPool: null,
        ccipBridge: null,
        isLoading: false,
        error: null
      });
      setProvider(null);
      setSigner(null);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const switchNetwork = async (chainId: number) => {
    if (!provider) return;

    try {
      await provider.send('wallet_switchEthereumChain', [
        { chainId: `0x${chainId.toString(16)}` }
      ]);
    } catch (error: any) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        const networkInfo = networkConfig[chainId];
        if (networkInfo) {
          await provider.send('wallet_addEthereumChain', [{
            chainId: `0x${chainId.toString(16)}`,
            chainName: networkInfo.name,
            rpcUrls: [networkInfo.rpcUrl],
            nativeCurrency: {
              name: networkInfo.currency,
              symbol: networkInfo.currency,
              decimals: 18
            },
            blockExplorerUrls: [networkInfo.explorer]
          }]);
        }
      }
      throw error;
    }
  };

  // Listen for account and network changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== wallet.address) {
        setWallet(prev => ({ ...prev, address: accounts[0] }));
      }
    };

    const handleChainChanged = (chainId: string) => {
      const newChainId = parseInt(chainId, 16);
      setWallet(prev => ({ ...prev, chainId: newChainId }));
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [wallet.address]);

  // Initialize provider and signer when wallet connects
  useEffect(() => {
    const initializeProvider = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const providerInstance = new BrowserProvider(window.ethereum);
          const accounts = await providerInstance.listAccounts();
          
          if (accounts.length > 0) {
            const signerInstance = await providerInstance.getSigner();
            const network = await providerInstance.getNetwork();
            
            setProvider(providerInstance);
            setSigner(signerInstance);
            setWallet(prev => ({
              ...prev,
              address: accounts[0].address,
              isConnected: true,
              chainId: Number(network.chainId),
              isConnecting: false
            }));

            await initializeContracts(Number(network.chainId), signerInstance);
            await refreshBalance();
          }
        } catch (error) {
          console.error('Failed to initialize provider:', error);
          setWallet(prev => ({
            ...prev,
            isConnecting: false,
            error: error instanceof Error ? error.message : 'Failed to initialize provider'
          }));
        }
      }
    };

    initializeProvider();
  }, []);

  // Re-initialize contracts when chain changes
  useEffect(() => {
    if (wallet.chainId && signer) {
      initializeContracts(wallet.chainId, signer);
    }
  }, [wallet.chainId, signer]);

  const value: Web3ContextType = {
    wallet,
    contracts,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshBalance,
    provider,
    signer
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
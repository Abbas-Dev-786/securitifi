export const contractAddresses = {
  11155111: { // Sepolia
    propertyManager: import.meta.env.VITE_PROPERTY_MANAGER_ADDRESS_SEPOLIA || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b7',
    lendingPool: import.meta.env.VITE_LENDING_POOL_ADDRESS_SEPOLIA || '0x8ba1f109551bD432803012645Bac136c22C85B',
    ccipRouter: import.meta.env.VITE_CCIP_ROUTER_ADDRESS_SEPOLIA || '0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59',
    usdc: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
  },
  80001: { // Mumbai
    propertyManager: import.meta.env.VITE_PROPERTY_MANAGER_ADDRESS_MUMBAI || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b7',
    lendingPool: import.meta.env.VITE_LENDING_POOL_ADDRESS_MUMBAI || '0x8ba1f109551bD432803012645Bac136c22C85B',
    ccipRouter: import.meta.env.VITE_CCIP_ROUTER_ADDRESS_MUMBAI || '0x1035CabC275068e0F4b745A29CEDf38E13aF41b1',
    usdc: '0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97',
  },
} as const;

export const networkConfig = {
  11155111: {
    name: 'Sepolia',
    currency: 'ETH',
    explorer: 'https://sepolia.etherscan.io',
    rpcUrl: import.meta.env.VITE_SEPOLIA_RPC_URL || 'https://rpc.sepolia.org',
  },
  80001: {
    name: 'Mumbai',
    currency: 'MATIC',
    explorer: 'https://mumbai.polygonscan.com',
    rpcUrl: import.meta.env.VITE_MUMBAI_RPC_URL || 'https://rpc-mumbai.maticvigil.com',
  },
} as const;

export type SupportedChainId = keyof typeof contractAddresses;
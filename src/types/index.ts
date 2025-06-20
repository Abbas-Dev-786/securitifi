export interface Property {
  id: number;
  owner: string;
  propertyAddress: string;
  propertyValue: bigint;
  metadataURI: string;
  isVerified: boolean;
  createdAt: bigint;
}

export interface Loan {
  id: number;
  borrower: string;
  lender: string;
  tokenId: number;
  loanAmount: bigint;
  interestRate: number;
  duration: number;
  startTime: bigint;
  isActive: boolean;
  isRepaid: boolean;
}

export interface NetworkInfo {
  chainId: number;
  name: string;
  currency: string;
  explorer: string;
  rpcUrl: string;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  balance: string;
  isConnecting: boolean;
  error: string | null;
}

export interface ContractState {
  propertyManager: any;
  lendingPool: any;
  ccipBridge: any;
  isLoading: boolean;
  error: string | null;
}

export interface PropertyFormData {
  propertyAddress: string;
  propertyValue: string;
  description: string;
  imageUrl: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
}

export interface LoanFormData {
  tokenId: number;
  loanAmount: string;
  interestRate: number;
  duration: number;
}

export interface TransactionStatus {
  hash: string;
  status: "pending" | "confirmed" | "failed";
  confirmations: number;
  timestamp: number;
}

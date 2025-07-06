export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  userBalance: bigint;
}

export interface FormErrors {
  tokenAddress?: string;
  recipients?: string;
  amounts?: string;
}

export type TransactionStep =
  | "idle"
  | "approving"
  | "approved"
  | "airdropping"
  | "success"
  | "error";

export interface AirdropFormData {
  tokenAddress: string;
  recipients: string;
  amounts: string;
}

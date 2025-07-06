import { parseUnits } from "viem";
import { TokenInfo } from "@/types/airdrop";

// 计算总金额
export const calculateTotalAmount = (amounts: string, tokenInfo: TokenInfo | null): bigint => {
  if (!tokenInfo || !amounts.trim()) return BigInt(0);
  
  const amountList = amounts
    .split(/[,\n]/)
    .map((amount) => amount.trim())
    .filter((amount) => amount);
  let total = BigInt(0);
  
  for (const amount of amountList) {
    try {
      total += parseUnits(amount, tokenInfo.decimals);
    } catch {
      return BigInt(0);
    }
  }
  
  return total;
};

// 检查是否需要授权
export const checkApprovalNeeded = (
  allowance: bigint | undefined,
  totalAmount: bigint
): boolean => {
  if (!allowance) return true;
  return allowance < totalAmount;
};

// 解析接收者地址列表
export const parseRecipients = (recipients: string): string[] => {
  return recipients
    .split(/[,\n]/)
    .map((addr) => addr.trim())
    .filter((addr) => addr);
};

// 解析金额列表
export const parseAmounts = (amounts: string, decimals: number): bigint[] => {
  const amountList = amounts
    .split(/[,\n]/)
    .map((amount) => amount.trim())
    .filter((amount) => amount);
  
  return amountList.map((amount) => parseUnits(amount, decimals));
};

// 获取区块浏览器链接
export const getExplorerUrl = (hash: string, chainId: number): string => {
  const explorers: Record<number, string> = {
    1: "https://etherscan.io/tx/",
    137: "https://polygonscan.com/tx/",
    42161: "https://arbiscan.io/tx/",
    8453: "https://basescan.org/tx/",
    10: "https://optimistic.etherscan.io/tx/",
    56: "https://bscscan.com/tx/",
    11155111: "https://sepolia.etherscan.io/tx/",
    80002: "https://amoy.polygonscan.com/tx/",
    421614: "https://sepolia.arbiscan.io/tx/",
    97: "https://testnet.bscscan.com/tx/",
    324: "https://explorer.zksync.io/tx/",
  };
  
  return `${explorers[chainId] || "https://etherscan.io/tx/"}${hash}`;
};

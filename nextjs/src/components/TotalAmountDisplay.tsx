import React from "react";
import { formatUnits } from "viem";
import { TokenInfo } from "@/types/airdrop";
import { calculateTotalAmount } from "@/utils/airdropUtils";

interface TotalAmountDisplayProps {
  amounts: string;
  tokenInfo: TokenInfo | null;
}

export function TotalAmountDisplay({ amounts, tokenInfo }: TotalAmountDisplayProps) {
  if (!tokenInfo || !amounts.trim()) {
    return null;
  }

  const totalAmount = calculateTotalAmount(amounts, tokenInfo);
  
  if (totalAmount === BigInt(0)) {
    return null;
  }

  const formattedTotal = formatUnits(totalAmount, tokenInfo.decimals);

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
          总金额:
        </span>
        <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
          {formattedTotal} {tokenInfo.symbol}
        </span>
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-blue-600 dark:text-blue-400">
          Wei:
        </span>
        <span className="text-xs text-blue-800 dark:text-blue-200 font-mono">
          {totalAmount.toString()}
        </span>
      </div>
    </div>
  );
}

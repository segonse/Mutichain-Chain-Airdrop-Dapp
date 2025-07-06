import React from "react";
import { formatUnits } from "viem";
import { TokenInfo } from "@/types/airdrop";

interface TokenInfoDisplayProps {
  tokenInfo: TokenInfo | null;
  isLoadingToken: boolean;
}

export function TokenInfoDisplay({
  tokenInfo,
  isLoadingToken,
}: TokenInfoDisplayProps) {
  if (isLoadingToken) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            正在获取代币信息...
          </span>
        </div>
      </div>
    );
  }

  if (!tokenInfo) return null;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
        代币信息
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-blue-700 dark:text-blue-300 font-medium">
            名称:
          </span>
          <span className="ml-2 text-blue-900 dark:text-blue-100">
            {tokenInfo.name}
          </span>
        </div>
        <div>
          <span className="text-blue-700 dark:text-blue-300 font-medium">
            符号:
          </span>
          <span className="ml-2 text-blue-900 dark:text-blue-100">
            {tokenInfo.symbol}
          </span>
        </div>
        <div>
          <span className="text-blue-700 dark:text-blue-300 font-medium">
            精度:
          </span>
          <span className="ml-2 text-blue-900 dark:text-blue-100">
            {tokenInfo.decimals}
          </span>
        </div>
        <div>
          <span className="text-blue-700 dark:text-blue-300 font-medium">
            总供应量:
          </span>
          <span className="ml-2 text-blue-900 dark:text-blue-100">
            {formatUnits(tokenInfo.totalSupply, tokenInfo.decimals)}{" "}
            {tokenInfo.symbol}
          </span>
        </div>
        <div className="md:col-span-2">
          <span className="text-blue-700 dark:text-blue-300 font-medium">
            您的余额:
          </span>
          <span className="ml-2 text-blue-900 dark:text-blue-100">
            {formatUnits(tokenInfo.userBalance, tokenInfo.decimals)}{" "}
            {tokenInfo.symbol}
          </span>
        </div>
      </div>
    </div>
  );
}

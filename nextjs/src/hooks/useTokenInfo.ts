import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { isAddress } from "viem";
import { TokenInfo } from "@/types/airdrop";
import { erc20Abi } from "@/constants";

export const useTokenInfo = (tokenAddress: string) => {
  const { address } = useAccount();
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(false);

  // 验证代币地址是否有效
  const isValidTokenAddress = tokenAddress && isAddress(tokenAddress);

  // 获取代币基本信息
  const { data: tokenName } = useReadContract({
    address: isValidTokenAddress ? (tokenAddress as `0x${string}`) : undefined,
    abi: erc20Abi,
    functionName: "name",
    query: { enabled: !!isValidTokenAddress },
  });

  const { data: tokenSymbol } = useReadContract({
    address: isValidTokenAddress ? (tokenAddress as `0x${string}`) : undefined,
    abi: erc20Abi,
    functionName: "symbol",
    query: { enabled: !!isValidTokenAddress },
  });

  const { data: tokenDecimals } = useReadContract({
    address: isValidTokenAddress ? (tokenAddress as `0x${string}`) : undefined,
    abi: erc20Abi,
    functionName: "decimals",
    query: { enabled: !!isValidTokenAddress },
  });

  const { data: totalSupply } = useReadContract({
    address: isValidTokenAddress ? (tokenAddress as `0x${string}`) : undefined,
    abi: erc20Abi,
    functionName: "totalSupply",
    query: { enabled: !!isValidTokenAddress },
  });

  const { data: userBalance } = useReadContract({
    address: isValidTokenAddress ? (tokenAddress as `0x${string}`) : undefined,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!isValidTokenAddress && !!address },
  });

  // 更新代币信息
  useEffect(() => {
    if (
      tokenName &&
      tokenSymbol &&
      tokenDecimals !== undefined &&
      totalSupply !== undefined &&
      userBalance !== undefined
    ) {
      setTokenInfo({
        name: tokenName as string,
        symbol: tokenSymbol as string,
        decimals: tokenDecimals as number,
        totalSupply: totalSupply as bigint,
        userBalance: userBalance as bigint,
      });
      setIsLoadingToken(false);
    } else if (isValidTokenAddress) {
      setIsLoadingToken(true);
    } else {
      setTokenInfo(null);
      setIsLoadingToken(false);
    }
  }, [
    tokenName,
    tokenSymbol,
    tokenDecimals,
    totalSupply,
    userBalance,
    isValidTokenAddress,
  ]);

  return {
    tokenInfo,
    isLoadingToken,
    isValidTokenAddress,
  };
};

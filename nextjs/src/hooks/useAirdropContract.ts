import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import { TransactionStep, TokenInfo } from "@/types/airdrop";
import {
  calculateTotalAmount,
  checkApprovalNeeded,
  parseRecipients,
  parseAmounts,
} from "@/utils/airdropUtils";

export const useAirdropContract = (
  tokenAddress: string,
  tokenInfo: TokenInfo | null,
  isValidTokenAddress: string | boolean
) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const queryClient = useQueryClient();

  // 交易状态
  const [step, setStep] = useState<TransactionStep>("idle");
  const [needsApproval, setNeedsApproval] = useState(false);
  const [pendingAirdropData, setPendingAirdropData] = useState<{
    recipients: string;
    amounts: string;
  } | null>(null);
  const [isExecutingAirdrop, setIsExecutingAirdrop] = useState(false);

  // 获取当前链的TSender合约地址
  const tsenderAddress = chainsToTSender[chainId]?.tsender as
    | `0x${string}`
    | undefined;

  // 获取用户对TSender合约的授权额度
  const { data: allowance } = useReadContract({
    address: isValidTokenAddress ? (tokenAddress as `0x${string}`) : undefined,
    abi: erc20Abi,
    functionName: "allowance",
    args: address && tsenderAddress ? [address, tsenderAddress] : undefined,
    query: { enabled: !!isValidTokenAddress && !!address && !!tsenderAddress },
  });

  // 授权合约交互
  const {
    writeContract: approveToken,
    data: approveHash,
    error: approveError,
  } = useWriteContract();

  // 空投合约交互
  const {
    writeContract: executeAirdrop,
    data: airdropHash,
    error: airdropError,
  } = useWriteContract();

  // 等待授权交易确认
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } =
    useWaitForTransactionReceipt({
      hash: approveHash,
    });

  // 等待空投交易确认
  const { isLoading: isAirdropConfirming, isSuccess: isAirdropSuccess } =
    useWaitForTransactionReceipt({
      hash: airdropHash,
    });

  // 处理授权
  const handleApprove = async (amounts: string, recipients?: string) => {
    if (!tokenInfo || !tsenderAddress) return;

    const totalAmount = calculateTotalAmount(amounts, tokenInfo);
    setStep("approving");

    // 如果提供了recipients，说明授权成功后需要自动执行空投
    if (recipients) {
      setPendingAirdropData({ recipients, amounts });
    }

    try {
      approveToken({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [tsenderAddress, totalAmount],
      });
    } catch (error) {
      console.error("授权失败:", error);
      setStep("error");
      setPendingAirdropData(null);
    }
  };

  // 处理空投（直接执行，不通过授权流程）
  const handleAirdrop = async (recipients: string, amounts: string) => {
    if (!tokenInfo || !tsenderAddress) return;

    const recipientList = parseRecipients(recipients);
    const parsedAmounts = parseAmounts(amounts, tokenInfo.decimals);
    const totalAmount = calculateTotalAmount(amounts, tokenInfo);

    setStep("airdropping");

    try {
      executeAirdrop({
        address: tsenderAddress,
        abi: tsenderAbi,
        functionName: "airdropERC20",
        args: [
          tokenAddress as `0x${string}`,
          recipientList as `0x${string}`[],
          parsedAmounts,
          totalAmount,
        ],
      });
    } catch (error) {
      console.error("空投失败:", error);
      setStep("error");
    }
  };

  // 检查是否需要授权
  const isApprovalNeeded = (amounts: string): boolean => {
    if (!tokenInfo) return true;
    const totalAmount = calculateTotalAmount(amounts, tokenInfo);
    // console.log("allowance:", allowance, "totalAmount:", totalAmount);
    return checkApprovalNeeded(allowance as bigint | undefined, totalAmount);
  };

  // 监听授权交易状态
  useEffect(() => {
    if (isApproveSuccess) {
      // 刷新allowance数据
      queryClient.invalidateQueries({
        queryKey: ["readContract"],
      });

      setNeedsApproval(false);

      // 如果有待执行的空投数据，自动执行空投
      if (pendingAirdropData && !isExecutingAirdrop) {
        const { recipients, amounts } = pendingAirdropData;
        setStep("approved");
        setIsExecutingAirdrop(true);

        // 延迟执行空投，给用户足够时间看到授权成功状态
        const timer = setTimeout(() => {
          if (!tokenInfo || !tsenderAddress) {
            setIsExecutingAirdrop(false);
            return;
          }

          const recipientList = parseRecipients(recipients);
          const parsedAmounts = parseAmounts(amounts, tokenInfo.decimals);
          const totalAmount = calculateTotalAmount(amounts, tokenInfo);

          setStep("airdropping");
          setPendingAirdropData(null);

          try {
            executeAirdrop({
              address: tsenderAddress,
              abi: tsenderAbi,
              functionName: "airdropERC20",
              args: [
                tokenAddress as `0x${string}`,
                recipientList as `0x${string}`[],
                parsedAmounts,
                totalAmount,
              ],
            });
          } catch (error) {
            console.error("空投失败:", error);
            setStep("error");
            setIsExecutingAirdrop(false);
          }
        }, 2000); // 增加到2秒，让用户看到授权成功状态

        // 清理函数
        return () => {
          clearTimeout(timer);
          setIsExecutingAirdrop(false);
        };
      } else {
        setStep("idle");
      }
    }
  }, [
    isApproveSuccess,
    pendingAirdropData,
    queryClient,
    tokenAddress,
    address,
    tsenderAddress,
    tokenInfo,
    executeAirdrop,
    tsenderAbi,
  ]);

  // 监听空投交易状态
  useEffect(() => {
    if (isAirdropSuccess) {
      setStep("success");
      setIsExecutingAirdrop(false);
    }
  }, [isAirdropSuccess]);

  // 监听交易错误
  useEffect(() => {
    if (approveError || airdropError) {
      setStep("error");
      setIsExecutingAirdrop(false);
      setPendingAirdropData(null);
    }
  }, [approveError, airdropError]);

  // 重置状态
  const resetState = () => {
    setStep("idle");
    setNeedsApproval(false);
    setPendingAirdropData(null);
    setIsExecutingAirdrop(false);
  };

  return {
    step,
    setStep,
    needsApproval,
    setNeedsApproval,
    tsenderAddress,
    allowance,
    approveHash,
    airdropHash,
    approveError,
    airdropError,
    isApproveConfirming,
    isAirdropConfirming,
    handleApprove,
    handleAirdrop,
    isApprovalNeeded,
    resetState,
  };
};

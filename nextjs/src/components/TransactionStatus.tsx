import React from "react";
import { useChainId } from "wagmi";
import { TransactionStep } from "@/types/airdrop";
import { getExplorerUrl } from "@/utils/airdropUtils";

interface TransactionStatusProps {
  step: TransactionStep;
  approveHash?: `0x${string}`;
  airdropHash?: `0x${string}`;
  approveError?: Error | null;
  airdropError?: Error | null;
  isApproveConfirming?: boolean;
  isAirdropConfirming?: boolean;
}

export function TransactionStatus({
  step,
  approveHash,
  airdropHash,
  approveError,
  airdropError,
  isApproveConfirming,
  isAirdropConfirming,
}: TransactionStatusProps) {
  const chainId = useChainId();

  if (step === "idle") return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        交易状态
      </h3>

      {step === "approving" && (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {approveHash ? (
              isApproveConfirming ? (
                <>
                  等待授权交易确认...
                  <a
                    href={getExplorerUrl(approveHash, chainId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    查看交易
                  </a>
                </>
              ) : (
                <>
                  授权交易已提交...
                  <a
                    href={getExplorerUrl(approveHash, chainId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    查看交易
                  </a>
                </>
              )
            ) : (
              "正在提交授权交易..."
            )}
          </span>
        </div>
      )}

      {step === "approved" && (
        <div className="flex items-center text-green-600">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm">
            ✅ 授权成功！正在准备空投交易...
            {approveHash && (
              <a
                href={getExplorerUrl(approveHash, chainId)}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                查看授权交易
              </a>
            )}
          </span>
        </div>
      )}

      {step === "airdropping" && (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {airdropHash ? (
              isAirdropConfirming ? (
                <>
                  等待空投交易确认...
                  <a
                    href={getExplorerUrl(airdropHash, chainId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    查看交易
                  </a>
                </>
              ) : (
                <>
                  空投交易已提交...
                  <a
                    href={getExplorerUrl(airdropHash, chainId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    查看交易
                  </a>
                </>
              )
            ) : (
              "正在提交空投交易..."
            )}
          </span>
        </div>
      )}

      {step === "success" && (
        <div className="flex items-center text-green-600">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm">
            空投执行成功！
            {airdropHash && (
              <a
                href={getExplorerUrl(airdropHash, chainId)}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                查看交易
              </a>
            )}
          </span>
        </div>
      )}

      {step === "error" && (
        <div className="space-y-2">
          {approveError && (
            <div className="flex items-center text-red-600">
              <svg
                className="w-4 h-4 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">授权失败: {approveError.message}</span>
            </div>
          )}

          {airdropError && (
            <div className="flex items-center text-red-600">
              <svg
                className="w-4 h-4 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">空投失败: {airdropError.message}</span>
            </div>
          )}

          {!approveError && !airdropError && (
            <div className="flex items-center text-red-600">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">操作失败: 未知错误</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

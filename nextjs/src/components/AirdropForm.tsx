"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { AirdropFormData } from "@/types/airdrop";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { useAirdropValidation } from "@/hooks/useAirdropValidation";
import { useAirdropContract } from "@/hooks/useAirdropContract";
import { TokenInfoDisplay } from "./TokenInfoDisplay";
import { TransactionStatus } from "./TransactionStatus";
import { TotalAmountDisplay } from "./TotalAmountDisplay";

export function AirdropForm() {
  const { isConnected } = useAccount();

  // 表单状态
  const [formData, setFormData] = useState<AirdropFormData>({
    tokenAddress: "",
    recipients: "",
    amounts: "",
  });

  // 使用自定义hooks
  const { tokenInfo, isLoadingToken, isValidTokenAddress } = useTokenInfo(
    formData.tokenAddress
  );
  const { errors, validateForm, clearErrors } = useAirdropValidation();
  const {
    step,
    setStep,
    tsenderAddress,
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
  } = useAirdropContract(formData.tokenAddress, tokenInfo, isValidTokenAddress);

  // 表单输入处理
  const handleInputChange = (field: keyof AirdropFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      clearErrors();
    }
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(formData, tokenInfo)) return;

    try {
      if (isApprovalNeeded(formData.amounts)) {
        // 执行授权，并传递recipients参数以便授权成功后自动执行空投
        await handleApprove(formData.amounts, formData.recipients);
      } else {
        // 如果不需要授权，直接执行空投
        await handleAirdrop(formData.recipients, formData.amounts);
      }
    } catch (error) {
      console.error("提交失败:", error);
      setStep("error");
    }
  };

  // 重置表单
  const handleReset = () => {
    setFormData({
      tokenAddress: "",
      recipients: "",
      amounts: "",
    });
    clearErrors();
    resetState();
  };

  // 如果钱包未连接，显示提示信息
  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            请先连接钱包
          </h3>
          <p className="text-blue-700 dark:text-blue-300">
            请在页面右上角连接您的钱包以使用空投功能
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          代币空投
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 代币合约地址 */}
          <div>
            <label
              htmlFor="tokenAddress"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              代币合约地址
            </label>
            <input
              type="text"
              id="tokenAddress"
              value={formData.tokenAddress}
              onChange={(e) =>
                handleInputChange("tokenAddress", e.target.value)
              }
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {errors.tokenAddress && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.tokenAddress}
              </p>
            )}
          </div>

          {/* 代币信息显示 */}
          <TokenInfoDisplay
            tokenInfo={tokenInfo}
            isLoadingToken={isLoadingToken}
          />

          {/* 接收者地址列表 */}
          <div>
            <label
              htmlFor="recipients"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              接收者地址列表
            </label>
            <textarea
              id="recipients"
              value={formData.recipients}
              onChange={(e) => handleInputChange("recipients", e.target.value)}
              placeholder="输入钱包地址，用逗号或换行符分隔&#10;例如:&#10;0x1234...&#10;0x5678..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {errors.recipients && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.recipients}
              </p>
            )}
          </div>

          {/* 空投金额列表 */}
          <div>
            <label
              htmlFor="amounts"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              空投金额列表 {tokenInfo && `(${tokenInfo.symbol})`}
            </label>
            <textarea
              id="amounts"
              value={formData.amounts}
              onChange={(e) => handleInputChange("amounts", e.target.value)}
              placeholder={`输入金额，用逗号或换行符分隔${
                tokenInfo ? `\n例如:\n100\n50.5\n25` : "\n例如:\n100\n50.5\n25"
              }`}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {errors.amounts && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.amounts}
              </p>
            )}

            {/* 总金额显示 */}
            <TotalAmountDisplay
              amounts={formData.amounts}
              tokenInfo={tokenInfo}
            />
          </div>

          {/* 交易状态显示 */}
          <TransactionStatus
            step={step}
            approveHash={approveHash}
            airdropHash={airdropHash}
            approveError={approveError}
            airdropError={airdropError}
            isApproveConfirming={isApproveConfirming}
            isAirdropConfirming={isAirdropConfirming}
          />

          {/* 合约地址检查 */}
          {!tsenderAddress && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-yellow-800 dark:text-yellow-200">
                  当前网络不支持空投功能，请切换到支持的网络
                </span>
              </div>
            </div>
          )}

          {/* 提交按钮 */}
          <div className="flex justify-end space-x-4">
            {step === "success" && (
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                重新开始
              </button>
            )}

            <button
              type="submit"
              disabled={
                !tokenInfo ||
                isLoadingToken ||
                !tsenderAddress ||
                step === "approving" ||
                step === "approved" ||
                step === "airdropping" ||
                step === "success"
              }
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              {isLoadingToken
                ? "加载中..."
                : step === "approving"
                ? "授权中..."
                : step === "approved"
                ? "准备空投..."
                : step === "airdropping"
                ? "空投中..."
                : isApprovalNeeded(formData.amounts)
                ? "授权并空投"
                : "执行空投"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

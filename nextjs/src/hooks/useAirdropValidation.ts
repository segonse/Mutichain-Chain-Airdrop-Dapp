import { useState } from "react";
import { isAddress, parseUnits } from "viem";
import { FormErrors, TokenInfo, AirdropFormData } from "@/types/airdrop";

export const useAirdropValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (
    formData: AirdropFormData,
    tokenInfo: TokenInfo | null
  ): boolean => {
    const newErrors: FormErrors = {};

    // 验证代币地址
    if (!formData.tokenAddress.trim()) {
      newErrors.tokenAddress = "请输入代币合约地址";
    } else if (!isAddress(formData.tokenAddress)) {
      newErrors.tokenAddress = "请输入有效的代币合约地址";
    }

    // 验证接收者地址列表
    if (!formData.recipients.trim()) {
      newErrors.recipients = "请输入接收者地址列表";
    } else {
      const recipientList = formData.recipients
        .split(/[,\n]/)
        .map((addr) => addr.trim())
        .filter((addr) => addr);

      if (recipientList.length === 0) {
        newErrors.recipients = "请输入至少一个接收者地址";
      } else {
        const invalidAddresses = recipientList.filter(
          (addr) => !isAddress(addr)
        );
        if (invalidAddresses.length > 0) {
          newErrors.recipients = `无效的地址格式: ${invalidAddresses.join(", ")}`;
        }
      }
    }

    // 验证空投金额列表
    if (!formData.amounts.trim()) {
      newErrors.amounts = "请输入空投金额列表";
    } else {
      const recipientList = formData.recipients
        .split(/[,\n]/)
        .map((addr) => addr.trim())
        .filter((addr) => addr);
      const amountList = formData.amounts
        .split(/[,\n]/)
        .map((amount) => amount.trim())
        .filter((amount) => amount);

      if (amountList.length === 0) {
        newErrors.amounts = "请输入至少一个空投金额";
      } else if (recipientList.length !== amountList.length) {
        newErrors.amounts = "接收者地址数量与空投金额数量不匹配";
      } else if (tokenInfo) {
        const invalidAmounts = amountList.filter((amount) => {
          try {
            const parsed = parseUnits(amount, tokenInfo.decimals);
            return parsed <= BigInt(0);
          } catch {
            return true;
          }
        });
        if (invalidAmounts.length > 0) {
          newErrors.amounts = "请输入有效的金额";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => setErrors({});

  return {
    errors,
    validateForm,
    clearErrors,
  };
};

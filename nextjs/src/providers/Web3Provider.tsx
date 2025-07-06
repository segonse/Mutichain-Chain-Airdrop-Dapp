"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/config/wagmi";
import { rainbowKitTheme } from "@/config/rainbowkit";

// 创建QueryClient实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1分钟
      retry: 3,
    },
  },
});

interface Web3ProviderProps {
  children: ReactNode;
  theme?: "light" | "dark" | "auto";
}

export function Web3Provider({ children, theme = "auto" }: Web3ProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // 确保组件已挂载，避免hydration错误
  useEffect(() => {
    setMounted(true);

    if (theme === "auto") {
      // 检测系统主题偏好
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDark(mediaQuery.matches);

      // 监听主题变化
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDark(e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      setIsDark(theme === "dark");
    }
  }, [theme]);

  // 在服务端渲染时使用默认主题，避免hydration错误
  const getTheme = () => {
    if (!mounted) {
      return rainbowKitTheme.light; // 服务端默认使用浅色主题
    }

    if (theme === "auto") {
      return isDark ? rainbowKitTheme.dark : rainbowKitTheme.light;
    }

    return theme === "dark" ? rainbowKitTheme.dark : rainbowKitTheme.light;
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={getTheme()}
          coolMode={true}
          showRecentTransactions={true}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// 导出一个自定义Hook来使用Web3上下文
export {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
} from "wagmi";

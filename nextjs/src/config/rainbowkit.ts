import { darkTheme, lightTheme } from "@rainbow-me/rainbowkit";

// RainbowKit主题配置
export const rainbowKitTheme = {
  light: lightTheme({
    accentColor: "#0E76FD",
    accentColorForeground: "white",
    borderRadius: "medium",
    fontStack: "system",
    overlayBlur: "small",
  }),
  dark: darkTheme({
    accentColor: "#0E76FD",
    accentColorForeground: "white",
    borderRadius: "medium",
    fontStack: "system",
    overlayBlur: "small",
  }),
};

// 自定义RainbowKit配置选项
export const rainbowKitConfig = {
  appInfo: {
    appName: "Multi-Chain Airdrop App",
    learnMoreUrl: "https://learnaboutrainbowkit.com",
  },
  chains: [], // 将在Provider中设置
  coolMode: true, // 启用酷炫模式
  showRecentTransactions: true, // 显示最近交易
  modalSize: "compact" as const, // 模态框大小
};

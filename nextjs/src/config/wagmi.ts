import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  mainnet,
  polygon,
  arbitrum,
  base,
  optimism,
  bsc,
  zksync,
  bscTestnet,
  sepolia,
  polygonAmoy,
  arbitrumSepolia,
} from "wagmi/chains";

// 定义Foundry Anvil本地开发链
export const anvilLocal = {
  id: 31337,
  name: "Anvil Local",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
    public: {
      http: ["http://127.0.0.1:8545"],
    },
  },
  blockExplorers: {
    default: {
      name: "Local Explorer",
      url: "http://127.0.0.1:8545",
    },
  },
  testnet: true,
} as const;

// 配置支持的区块链网络
export const config = getDefaultConfig({
  appName: "Multi-Chain Airdrop App",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [
    mainnet,
    polygon,
    arbitrum,
    base,
    optimism,
    bsc,
    zksync,
    // 测试网络
    sepolia,
    polygonAmoy,
    arbitrumSepolia,
    bscTestnet,
    anvilLocal,
  ],
  ssr: true, // 如果你的dApp使用服务端渲染 (SSR)
});

// 导出链配置以便在其他地方使用
export const supportedChains = [
  {
    id: mainnet.id,
    name: "Ethereum",
    network: "mainnet",
    nativeCurrency: mainnet.nativeCurrency,
    rpcUrls: mainnet.rpcUrls,
    blockExplorers: mainnet.blockExplorers,
    testnet: false,
  },
  {
    id: polygon.id,
    name: "Polygon",
    network: "polygon",
    nativeCurrency: polygon.nativeCurrency,
    rpcUrls: polygon.rpcUrls,
    blockExplorers: polygon.blockExplorers,
    testnet: false,
  },
  {
    id: arbitrum.id,
    name: "Arbitrum One",
    network: "arbitrum",
    nativeCurrency: arbitrum.nativeCurrency,
    rpcUrls: arbitrum.rpcUrls,
    blockExplorers: arbitrum.blockExplorers,
    testnet: false,
  },
  {
    id: base.id,
    name: "Base",
    network: "base",
    nativeCurrency: base.nativeCurrency,
    rpcUrls: base.rpcUrls,
    blockExplorers: base.blockExplorers,
    testnet: false,
  },
  {
    id: optimism.id,
    name: "Optimism",
    network: "optimism",
    nativeCurrency: optimism.nativeCurrency,
    rpcUrls: optimism.rpcUrls,
    blockExplorers: optimism.blockExplorers,
    testnet: false,
  },
  {
    id: bsc.id,
    name: "BNB Smart Chain",
    network: "bsc",
    nativeCurrency: bsc.nativeCurrency,
    rpcUrls: bsc.rpcUrls,
    blockExplorers: bsc.blockExplorers,
    testnet: false,
  },
  {
    id: zksync.id,
    name: "zkSync",
    network: "zksync",
    nativeCurrency: zksync.nativeCurrency,
    rpcUrls: zksync.rpcUrls,
    blockExplorers: zksync.blockExplorers,
    testnet: false,
  },
  {
    id: sepolia.id,
    name: "Sepolia",
    network: "sepolia",
    nativeCurrency: sepolia.nativeCurrency,
    rpcUrls: sepolia.rpcUrls,
    blockExplorers: sepolia.blockExplorers,
    testnet: true,
  },
  {
    id: polygonAmoy.id,
    name: "Polygon Amoy",
    network: "polygonAmoy",
    nativeCurrency: polygonAmoy.nativeCurrency,
    rpcUrls: polygonAmoy.rpcUrls,
    blockExplorers: polygonAmoy.blockExplorers,
    testnet: true,
  },
  {
    id: arbitrumSepolia.id,
    name: "Arbitrum Sepolia",
    network: "arbitrumSepolia",
    nativeCurrency: arbitrumSepolia.nativeCurrency,
    rpcUrls: arbitrumSepolia.rpcUrls,
    blockExplorers: arbitrumSepolia.blockExplorers,
    testnet: true,
  },
  {
    id: bscTestnet.id,
    name: "BSC Testnet",
    network: "bscTestnet",
    nativeCurrency: bscTestnet.nativeCurrency,
    rpcUrls: bscTestnet.rpcUrls,
    blockExplorers: bscTestnet.blockExplorers,
    testnet: true,
  },
  {
    id: anvilLocal.id,
    name: "Anvil Local",
    network: "anvilLocal",
    nativeCurrency: anvilLocal.nativeCurrency,
    rpcUrls: anvilLocal.rpcUrls,
    blockExplorers: anvilLocal.blockExplorers,
    testnet: true,
  },
];

// 根据链ID获取链信息的辅助函数
export const getChainById = (chainId: number) => {
  return supportedChains.find((chain) => chain.id === chainId);
};

// 获取主网链
export const getMainnetChains = () => {
  return supportedChains.filter((chain) => !chain.testnet);
};

// 获取测试网链
export const getTestnetChains = () => {
  return supportedChains.filter((chain) => chain.testnet);
};

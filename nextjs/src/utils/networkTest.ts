// 网络配置测试工具
import {
  supportedChains,
  getChainById,
  getMainnetChains,
  getTestnetChains,
} from "@/config/wagmi";

// 测试所有支持的网络
export function testNetworkConfiguration() {
  console.log("=== 网络配置测试 ===");

  console.log("\n支持的网络总数:", supportedChains.length);

  console.log("\n主网列表:");
  getMainnetChains().forEach((chain) => {
    console.log(
      `- ${chain.name} (ID: ${chain.id}, Currency: ${chain.nativeCurrency.symbol})`
    );
  });

  console.log("\n测试网列表:");
  getTestnetChains().forEach((chain) => {
    console.log(
      `- ${chain.name} (ID: ${chain.id}, Currency: ${chain.nativeCurrency.symbol})`
    );
  });

  // 测试BSC网络
  console.log("\n=== BSC网络测试 ===");
  const bscMainnet = getChainById(56); // BSC主网ID
  const bscTestnet = getChainById(97); // BSC测试网ID

  // 测试新增的网络
  console.log("\n=== 新增网络测试 ===");
  const polygonAmoy = getChainById(80002); // Polygon Amoy测试网ID
  const anvilLocal = getChainById(31337); // Anvil本地链ID

  if (bscMainnet) {
    console.log("✅ BSC主网配置正确:", bscMainnet.name);
    console.log("   - Chain ID:", bscMainnet.id);
    console.log("   - Currency:", bscMainnet.nativeCurrency.symbol);
    console.log("   - RPC URLs:", Object.keys(bscMainnet.rpcUrls).join(", "));
  } else {
    console.log("❌ BSC主网配置缺失");
  }

  if (bscTestnet) {
    console.log("✅ BSC测试网配置正确:", bscTestnet.name);
    console.log("   - Chain ID:", bscTestnet.id);
    console.log("   - Currency:", bscTestnet.nativeCurrency.symbol);
    console.log("   - RPC URLs:", Object.keys(bscTestnet.rpcUrls).join(", "));
  } else {
    console.log("❌ BSC测试网配置缺失");
  }

  if (polygonAmoy) {
    console.log("✅ Polygon Amoy测试网配置正确:", polygonAmoy.name);
    console.log("   - Chain ID:", polygonAmoy.id);
    console.log("   - Currency:", polygonAmoy.nativeCurrency.symbol);
    console.log("   - RPC URLs:", Object.keys(polygonAmoy.rpcUrls).join(", "));
  } else {
    console.log("❌ Polygon Amoy测试网配置缺失");
  }

  if (anvilLocal) {
    console.log("✅ Anvil本地链配置正确:", anvilLocal.name);
    console.log("   - Chain ID:", anvilLocal.id);
    console.log("   - Currency:", anvilLocal.nativeCurrency.symbol);
    console.log("   - RPC URLs:", Object.keys(anvilLocal.rpcUrls).join(", "));
  } else {
    console.log("❌ Anvil本地链配置缺失");
  }

  console.log("\n=== 测试完成 ===");
}

// 获取网络统计信息
export function getNetworkStats() {
  const mainnetCount = getMainnetChains().length;
  const testnetCount = getTestnetChains().length;
  const totalCount = supportedChains.length;

  return {
    total: totalCount,
    mainnet: mainnetCount,
    testnet: testnetCount,
    networks: supportedChains.map((chain) => ({
      id: chain.id,
      name: chain.name,
      symbol: chain.nativeCurrency.symbol,
      testnet: chain.testnet,
    })),
  };
}

// 验证特定网络是否支持
export function isNetworkSupported(chainId: number): boolean {
  return supportedChains.some((chain) => chain.id === chainId);
}

// 获取网络显示名称
export function getNetworkDisplayName(chainId: number): string {
  const chain = getChainById(chainId);
  return chain ? chain.name : `未知网络 (${chainId})`;
}

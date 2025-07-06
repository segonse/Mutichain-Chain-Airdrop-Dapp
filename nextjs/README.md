# 多链空投应用 (Multi-Chain Airdrop App)

这是一个基于 Next.js 15、wagmi 和 RainbowKit 构建的多链钱包连接应用，支持多个区块链网络的代币空投功能。

## 功能特性

- ✅ **多链支持**: 支持 Ethereum、Polygon、Arbitrum、Base、Optimism、BSC 等主流区块链网络
- ✅ **本地开发**: 支持 Foundry Anvil 本地开发链
- ✅ **钱包连接**: 集成 RainbowKit，支持 MetaMask、Coinbase Wallet、WalletConnect 等多种钱包
- ✅ **网络切换**: 一键切换不同的区块链网络
- ✅ **集成导航**: 钱包连接和网络切换功能集成在头部导航栏
- ✅ **响应式设计**: 支持桌面端和移动端，自适应布局
- ✅ **暗色主题**: 支持明暗主题切换
- ✅ **TypeScript**: 完整的类型安全支持
- ✅ **SSR 优化**: 解决了 hydration 问题，支持服务端渲染

## 技术栈

- **前端框架**: Next.js 15 (App Router)
- **Web3 库**: wagmi v2
- **钱包连接**: RainbowKit
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **状态管理**: TanStack Query (React Query)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制环境变量模板文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，添加您的 WalletConnect Project ID：

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

> 获取 WalletConnect Project ID：访问 [WalletConnect Cloud](https://cloud.walletconnect.com/) 创建项目

### 3. 启动开发服务器

```bash
npm run dev
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动。

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── layout.tsx         # 根布局组件
│   ├── page.tsx           # 首页组件
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── HeaderWalletConnection.tsx  # 头部钱包连接组件
│   └── archived-components/        # 归档的组件
│       ├── README.md              # 归档说明文档
│       ├── NetworkSwitcher.tsx    # 已归档 - 原网络切换组件
│       └── WalletConnection.tsx   # 已归档 - 原钱包连接组件
├── config/               # 配置文件
│   ├── wagmi.ts          # wagmi 和多链网络配置
│   └── rainbowkit.ts     # RainbowKit 主题配置
├── providers/            # Context Providers
│   └── Web3Provider.tsx  # Web3 Provider 组件
└── utils/               # 工具函数
    └── networkTest.ts   # 网络配置测试工具
```

## 支持的网络

### 主网

- Ethereum (ETH)
- Polygon (MATIC)
- Arbitrum One (ETH)
- Base (ETH)
- Optimism (ETH)
- BNB Smart Chain (BNB)

### 测试网

- Sepolia (ETH)
- Polygon Amoy (MATIC)
- Arbitrum Sepolia (ETH)
- BSC Testnet (BNB)

### 本地开发网络

- Anvil Local (ETH) - Foundry 本地开发链

## 核心组件

### HeaderWalletConnection

集成的头部钱包连接组件，包含以下功能：

- 钱包连接/断开
- 网络切换（支持主网和测试网）
- 账户信息显示
- 响应式设计，适配移动端

### Web3Provider

Web3 上下文提供者，负责：

- wagmi 配置管理
- RainbowKit 主题配置
- TanStack Query 客户端配置
- SSR hydration 问题处理

## 开发工具

### 网络测试工具

项目包含网络配置测试工具 (`src/utils/networkTest.ts`)：

1. 在开发环境下，点击页面右上角的"测试网络"按钮
2. 打开浏览器开发者工具的控制台
3. 查看网络配置测试结果

测试内容包括：

- 支持的网络总数
- 主网和测试网列表
- BSC 网络配置验证
- Polygon Amoy 测试网验证
- Anvil 本地链验证

## 使用 Foundry Anvil 本地开发

### 1. 安装 Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. 启动 Anvil 本地链

```bash
anvil
```

### 3. 连接到本地链

1. 在应用中点击网络切换器
2. 选择"Anvil Local"
3. 钱包会提示添加新网络，确认即可

## 技术架构

### 多层 Provider 结构

```typescript
<WagmiProvider config={config}>
  {" "}
  // 底层：Web3连接和配置
  <QueryClientProvider client={queryClient}>
    {" "}
    // 中层：数据缓存和状态管理
    <RainbowKitProvider theme={getTheme()}>
      {" "}
      // 顶层：UI组件和主题
      {children}
    </RainbowKitProvider>
  </QueryClientProvider>
</WagmiProvider>
```

### SSR 优化

- 使用 `mounted` 状态避免 hydration 错误
- 服务端渲染时使用默认主题
- 客户端挂载后动态检测主题偏好

### 响应式设计

- 桌面端：完整显示网络名称和钱包地址
- 移动端：显示简化版本（网络名称缩写）
- 平板端：中等显示级别

## 构建和部署

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

### 代码检查

```bash
npm run lint
```

## 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [wagmi 文档](https://wagmi.sh/)
- [RainbowKit 文档](https://www.rainbowkit.com/)
- [Foundry 文档](https://book.getfoundry.sh/)
- [WalletConnect Cloud](https://cloud.walletconnect.com/)

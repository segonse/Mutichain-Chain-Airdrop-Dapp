# 归档组件

这个文件夹包含了不再使用的组件，已被新的实现替代。

## 归档日期
2025-01-29

## 归档原因
重构头部导航栏，将钱包连接功能集成到头部导航栏中。

## 归档的组件

### 1. NetworkSwitcher.tsx
- **原用途**: 独立的网络切换组件
- **替代方案**: 功能已集成到 `HeaderWalletConnection.tsx` 中
- **特点**: 
  - 支持主网/测试网切换
  - 下拉菜单式网络选择
  - 包含 `useWalletStatus` Hook

### 2. WalletConnection.tsx  
- **原用途**: 页面中间的钱包连接卡片组件
- **替代方案**: 功能已集成到 `HeaderWalletConnection.tsx` 中
- **特点**:
  - 大型卡片式布局
  - 详细的连接状态显示
  - 完整的钱包信息展示

## 新的实现

现在所有钱包相关功能都集成在 `HeaderWalletConnection.tsx` 中：
- 紧凑的头部导航栏设计
- 网络切换和钱包连接合并
- 响应式设计，适配移动端
- 使用 RainbowKit 的 `openChainModal` 进行网络切换

## 如果需要恢复

如果将来需要恢复这些组件：
1. 将文件从 `archived-components/` 移回 `components/` 目录
2. 更新相关的导入语句
3. 确保依赖项仍然兼容

## 相关文件

- `HeaderWalletConnection.tsx` - 新的集成组件
- `src/app/page.tsx` - 使用新组件的页面
- `src/config/wagmi.ts` - 网络配置（仍在使用）

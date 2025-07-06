'use client';

import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId, useDisconnect } from 'wagmi';
import { getChainById } from '@/config/wagmi';

export function WalletConnection() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  
  const currentChain = getChainById(chainId);

  // 格式化地址显示
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        钱包连接
      </h2>
      
      {/* RainbowKit连接按钮 */}
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          // 注意：如果你的应用使用SSR，确保组件已挂载
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      连接钱包
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      不支持的网络
                    </button>
                  );
                }

                return (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={openChainModal}
                      className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors duration-200"
                      type="button"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {chain.name}
                      </span>
                    </button>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>

      {/* 钱包信息显示 */}
      {isConnected && address && (
        <div className="w-full max-w-md space-y-3 mt-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              钱包地址
            </h3>
            <p className="text-lg font-mono text-gray-900 dark:text-white break-all">
              {formatAddress(address)}
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(address)}
              className="mt-2 text-sm text-blue-500 hover:text-blue-700 transition-colors duration-200"
            >
              复制地址
            </button>
          </div>

          {currentChain && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                当前网络
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentChain.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Chain ID: {currentChain.id}
                  </p>
                  {currentChain.testnet && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      测试网
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => disconnect()}
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            断开连接
          </button>
        </div>
      )}
    </div>
  );
}

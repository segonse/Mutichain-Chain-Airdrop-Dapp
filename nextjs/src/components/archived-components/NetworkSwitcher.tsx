'use client';

import React, { useState } from 'react';
import { useSwitchChain, useChainId, useAccount } from 'wagmi';
import { supportedChains, getMainnetChains, getTestnetChains } from '@/config/wagmi';

interface NetworkSwitcherProps {
  showTestnets?: boolean;
  className?: string;
}

export function NetworkSwitcher({ showTestnets = false, className = '' }: NetworkSwitcherProps) {
  const { switchChain, isPending, error } = useSwitchChain();
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState(false);

  // 获取要显示的链
  const chainsToShow = showTestnets 
    ? supportedChains 
    : getMainnetChains();

  const currentChain = supportedChains.find(chain => chain.id === chainId);

  const handleSwitchChain = async (targetChainId: number) => {
    try {
      await switchChain({ chainId: targetChainId });
      setIsOpen(false);
    } catch (err) {
      console.error('切换网络失败:', err);
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* 当前网络显示按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
      >
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ 
              backgroundColor: currentChain?.testnet ? '#f59e0b' : '#10b981' 
            }}
          />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {currentChain?.name || '未知网络'}
          </span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 网络选择下拉菜单 */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
              选择网络
            </h3>
            
            {/* 主网 */}
            <div className="mt-2">
              <h4 className="text-xs font-medium text-gray-400 dark:text-gray-500 px-2 py-1 uppercase tracking-wider">
                主网
              </h4>
              {getMainnetChains().map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => handleSwitchChain(chain.id)}
                  disabled={isPending || chain.id === chainId}
                  className={`w-full flex items-center space-x-3 px-2 py-2 rounded-md text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 ${
                    chain.id === chainId 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{chain.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {chain.nativeCurrency.symbol}
                    </div>
                  </div>
                  {chain.id === chainId && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {/* 测试网 */}
            {showTestnets && (
              <div className="mt-4">
                <h4 className="text-xs font-medium text-gray-400 dark:text-gray-500 px-2 py-1 uppercase tracking-wider">
                  测试网
                </h4>
                {getTestnetChains().map((chain) => (
                  <button
                    key={chain.id}
                    onClick={() => handleSwitchChain(chain.id)}
                    disabled={isPending || chain.id === chainId}
                    className={`w-full flex items-center space-x-3 px-2 py-2 rounded-md text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 ${
                      chain.id === chainId 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{chain.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {chain.nativeCurrency.symbol} • 测试网
                      </div>
                    </div>
                    {chain.id === chainId && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 错误信息 */}
          {error && (
            <div className="border-t border-gray-200 dark:border-gray-600 p-3">
              <div className="text-sm text-red-600 dark:text-red-400">
                切换失败: {error.message}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 点击外部关闭下拉菜单 */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// 钱包状态管理Hook
export function useWalletStatus() {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const chainId = useChainId();
  const currentChain = supportedChains.find(chain => chain.id === chainId);

  return {
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    chainId,
    currentChain,
    isTestnet: currentChain?.testnet || false,
    chainName: currentChain?.name || '未知网络',
  };
}

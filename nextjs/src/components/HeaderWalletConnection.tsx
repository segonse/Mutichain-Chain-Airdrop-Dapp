"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function HeaderWalletConnection() {
  // 格式化地址显示
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
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
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
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
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                  >
                    不支持的网络
                  </button>
                );
              }

              return (
                <div className="flex items-center space-x-2">
                  {/* 网络切换按钮 */}
                  <button
                    onClick={openChainModal}
                    className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors duration-200"
                    type="button"
                    title={`当前网络: ${chain.name}`}
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-white hidden sm:inline">
                      {chain.name}
                    </span>
                    {/* 移动端只显示图标 */}
                    <span className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">
                      {chain.name && chain.name.length > 8
                        ? chain.name.slice(0, 3)
                        : chain.name || "Unknown"}
                    </span>
                  </button>

                  {/* 账户信息按钮 */}
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200"
                    title={`地址: ${account.address}`}
                  >
                    {/* 钱包图标 */}
                    <div className="w-4 h-4">
                      <svg
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zm14 5H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM2 8h16V6H2v2zm2 3a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    {/* 地址显示 */}
                    <span className="text-sm hidden sm:inline">
                      {formatAddress(account.address)}
                    </span>

                    {/* 余额显示（如果有） */}
                    {account.displayBalance && (
                      <span className="text-xs opacity-75 hidden md:inline">
                        {account.displayBalance}
                      </span>
                    )}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

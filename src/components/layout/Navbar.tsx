import React, { useEffect, useState } from "react";
import { Bell, Search, Moon, Sun, User, Settings } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { formatAddress } from "../../utils/helpers";
import { formatEther } from "ethers";
import {
  useAppKitAccount,
  useAppKitBalance,
  useDisconnect,
} from "@reown/appkit/react";

const Navbar: React.FC = () => {
  const [balance, setBalance] = useState<any>(undefined);
  const { fetchBalance } = useAppKitBalance();
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    if (isConnected) {
      fetchBalance().then(setBalance);
    }
  }, [isConnected, fetchBalance]);

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search properties, transactions..."
              className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm w-64"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <button className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatAddress(address || "")}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {parseFloat(formatEther(balance || "0")).toFixed(4)} ETH
              </span>
            </div>
            <button
              onClick={async () => {
                await disconnect();
              }}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

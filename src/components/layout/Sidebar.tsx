import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Coins, 
  ArrowLeftRight, 
  PieChart, 
  Settings,
  Landmark,
  DollarSign,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Properties', href: '/properties', icon: Building2 },
  { name: 'Lending', href: '/lending', icon: Coins },
  { name: 'Rent Distribution', href: '/rent-distribution', icon: DollarSign },
  { name: 'Cross-Chain Bridge', href: '/bridge', icon: ArrowLeftRight },
  { name: 'Proof of Reserves', href: '/proof-of-reserves', icon: Shield },
  { name: 'Portfolio', href: '/portfolio', icon: PieChart },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">SecuritiFi</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Real Estate DeFi</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 pb-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className="relative block"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="mr-3 w-5 h-5" />
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg -z-10"
                    initial={false}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Need Help?
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Check out our documentation and tutorials
          </p>
          <button className="w-full bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors">
            View Docs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
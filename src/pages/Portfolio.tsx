import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Building2, Coins, PieChart } from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

const Portfolio: React.FC = () => {
  const portfolioData = [
    { name: 'Residential', value: 45, color: '#3B82F6' },
    { name: 'Commercial', value: 30, color: '#8B5CF6' },
    { name: 'Industrial', value: 15, color: '#10B981' },
    { name: 'Land', value: 10, color: '#F59E0B' }
  ];

  const performanceData = [
    { month: 'Jan', value: 85000, rent: 3200 },
    { month: 'Feb', value: 87000, rent: 3350 },
    { month: 'Mar', value: 92000, rent: 3400 },
    { month: 'Apr', value: 89000, rent: 3600 },
    { month: 'May', value: 95000, rent: 3750 },
    { month: 'Jun', value: 98000, rent: 3900 }
  ];

  const metrics = [
    {
      title: 'Total Portfolio Value',
      value: '$2,450,000',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Properties Owned',
      value: '12',
      change: '+2',
      changeType: 'positive' as const,
      icon: Building2,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Monthly Rent Income',
      value: '$3,900',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: Coins,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Yield Rate',
      value: '7.8%',
      change: '-0.3%',
      changeType: 'negative' as const,
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your real estate investment performance
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Export Report
          </button>
          <button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
            Rebalance Portfolio
          </button>
        </div>
      </motion.div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {metric.value}
                </p>
                <div className="flex items-center mt-2">
                  {metric.changeType === 'positive' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ml-1 ${
                    metric.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${metric.color} flex items-center justify-center`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Portfolio Allocation
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Tooltip />
                <RechartsPieChart>
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPieChart>
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {portfolioData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Performance Overview
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Portfolio Value</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Rent</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="rent"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Property Holdings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Holdings
          </h3>
          <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Property</th>
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Type</th>
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Value</th>
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Rent</th>
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Yield</th>
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[
                { name: '123 Main Street', type: 'Residential', value: '$450,000', rent: '$2,200', yield: '5.9%', change: '+2.3%', positive: true },
                { name: '456 Business Ave', type: 'Commercial', value: '$850,000', rent: '$4,500', yield: '6.4%', change: '+1.8%', positive: true },
                { name: '789 Industrial Blvd', type: 'Industrial', value: '$1,200,000', rent: '$8,000', yield: '8.0%', change: '-0.5%', positive: false },
                { name: 'Oak Valley Lot 12', type: 'Land', value: '$120,000', rent: '$0', yield: '0%', change: '+12.1%', positive: true },
              ].map((property, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{property.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Token #{index + 1}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      property.type === 'Residential' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      property.type === 'Commercial' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                      property.type === 'Industrial' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {property.type}
                    </span>
                  </td>
                  <td className="py-4 font-medium text-gray-900 dark:text-white">{property.value}</td>
                  <td className="py-4 text-gray-600 dark:text-gray-400">{property.rent}</td>
                  <td className="py-4 font-medium text-gray-900 dark:text-white">{property.yield}</td>
                  <td className="py-4">
                    <div className="flex items-center">
                      {property.positive ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        property.positive ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {property.change}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Portfolio;
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Building2,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  Activity,
  Eye,
  MoreHorizontal,
  Calendar,
  Target,
  Zap,
  Award,
  Globe,
  Shield,
  Check,
} from "lucide-react";
import { formatEther } from "ethers";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAppKitAccount } from "@reown/appkit/react";
import useBalance from "../hooks/useBalance";

const mockChartData = [
  { month: "Jan", value: 12000, loans: 8, properties: 15, volume: 45000 },
  { month: "Feb", value: 15000, loans: 12, properties: 18, volume: 52000 },
  { month: "Mar", value: 18000, loans: 15, properties: 22, volume: 61000 },
  { month: "Apr", value: 22000, loans: 18, properties: 28, volume: 73000 },
  { month: "May", value: 25000, loans: 25, properties: 32, volume: 84000 },
  { month: "Jun", value: 28000, loans: 30, properties: 35, volume: 95000 },
];

const portfolioAllocation = [
  { name: "Residential", value: 45, color: "#3B82F6" },
  { name: "Commercial", value: 30, color: "#8B5CF6" },
  { name: "Industrial", value: 15, color: "#10B981" },
  { name: "Land", value: 10, color: "#F59E0B" },
];

const Dashboard: React.FC = () => {
  const balance = useBalance();
  const { isConnected } = useAppKitAccount();
  const { properties, fetchUserProperties } = {
    properties: [],
    fetchUserProperties: () => {},
  };
  const [stats, setStats] = useState({
    totalValue: "2450000",
    activeLoans: 3,
    monthlyRent: "3900",
    portfolioGrowth: "+12.5%",
  });

  useEffect(() => {
    if (isConnected) {
      fetchUserProperties();
    }
  }, [isConnected, fetchUserProperties]);

  const statsCards = [
    {
      title: "Portfolio Value",
      value: `$${parseFloat(stats.totalValue).toLocaleString()}`,
      change: stats.portfolioGrowth,
      changeType: "positive" as const,
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      description: "Total asset value",
    },
    {
      title: "Properties Owned",
      value: properties.length.toString(),
      change: "+2 this month",
      changeType: "positive" as const,
      icon: Building2,
      color: "from-blue-500 to-cyan-500",
      description: "Tokenized properties",
    },
    {
      title: "Active Loans",
      value: stats.activeLoans.toString(),
      change: "+1 this week",
      changeType: "positive" as const,
      icon: Coins,
      color: "from-purple-500 to-pink-500",
      description: "DeFi lending positions",
    },
    {
      title: "Monthly Yield",
      value: `$${parseFloat(stats.monthlyRent).toLocaleString()}`,
      change: "+8.2%",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
      description: "Rental income",
    },
  ];

  const quickActions = [
    {
      title: "Tokenize Property",
      icon: Building2,
      color: "from-blue-500 to-cyan-500",
      href: "/properties",
    },
    {
      title: "Request Loan",
      icon: Coins,
      color: "from-purple-500 to-pink-500",
      href: "/lending",
    },
    {
      title: "Bridge Assets",
      icon: Globe,
      color: "from-green-500 to-emerald-500",
      href: "/bridge",
    },
    {
      title: "View Portfolio",
      icon: Target,
      color: "from-orange-500 to-red-500",
      href: "/portfolio",
    },
  ];

  const recentActivities = [
    {
      type: "mint",
      description: "Property tokenized at 123 Main St",
      time: "2 hours ago",
      value: "$250,000",
      status: "completed",
      icon: Building2,
      color: "text-blue-600",
    },
    {
      type: "loan",
      description: "Loan approved for Property #42",
      time: "1 day ago",
      value: "$50,000",
      status: "active",
      icon: Coins,
      color: "text-green-600",
    },
    {
      type: "rent",
      description: "Rent distributed for Q2 2024",
      time: "3 days ago",
      value: "$1,250",
      status: "completed",
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      type: "bridge",
      description: "Cross-chain transfer to Polygon",
      time: "1 week ago",
      value: "5 ETH",
      status: "completed",
      icon: Activity,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Welcome back!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Here's what's happening with your real estate portfolio today.
          </p>
        </div>
        <div className="mt-6 lg:mt-0 flex items-center space-x-4">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl px-6 py-3 border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Balance:
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {parseFloat(formatEther(balance?.data?.value || "0")).toFixed(
                  4
                )}{" "}
                ETH
              </span>
            </div>
          </div>
          <button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Quick Action</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === "positive"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h3>
          <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="group relative bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 rounded-xl p-6 transition-all duration-200 border border-gray-200/50 dark:border-gray-600/50 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative text-center">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {action.title}
                </h4>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Portfolio Performance
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Track your investment growth over time
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Value
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Volume
                </span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(17, 24, 39, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    color: "#F9FAFB",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#8B5CF6"
                  fillOpacity={1}
                  fill="url(#colorVolume)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Portfolio Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Asset Allocation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Portfolio distribution
              </p>
            </div>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Eye className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {portfolioAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {portfolioAllocation.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Your latest transactions and updates
            </p>
          </div>
          <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all duration-200 border border-gray-200/50 dark:border-gray-600/50 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-md"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-600 flex items-center justify-center group-hover:scale-110 transition-transform ${
                    activity.type === "mint"
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : activity.type === "loan"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : activity.type === "rent"
                      ? "bg-purple-100 dark:bg-purple-900/30"
                      : "bg-orange-100 dark:bg-orange-900/30"
                  }`}
                >
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-3 mt-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{activity.time}</span>
                    </p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {activity.value}
                </span>
                <div className="flex items-center justify-end mt-1">
                  <ArrowUpRight className="w-3 h-3 text-green-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              This Month
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Top Performer</h3>
          <p className="text-green-100 mb-4">
            Your portfolio outperformed the market by 8.3% this month
          </p>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span className="font-semibold">+24.8% ROI</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              Security
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Fully Secured</h3>
          <p className="text-blue-100 mb-4">
            All your assets are protected by smart contracts and insurance
          </p>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span className="font-semibold">100% Coverage</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              Network
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Growing Network</h3>
          <p className="text-purple-100 mb-4">
            Join 12,000+ investors in the SecuritiFi ecosystem
          </p>
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span className="font-semibold">Global Access</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

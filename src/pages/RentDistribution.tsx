import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Calendar,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "react-toastify";

const RentDistribution: React.FC = () => {
  const { wallet } = {
    wallet: {
      address: "0x1234567890123456789012345678901234567890",
    },
  };
  const { isReady } = {
    isReady: true,
  };
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [formData, setFormData] = useState({
    propertyId: "",
    amount: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data for rent pools
  const [rentPools] = useState([
    {
      propertyId: "1",
      address: "123 Main Street, NYC",
      balance: "5,250",
      totalDistributed: "18,750",
      lastDistribution: "2024-01-15",
      upkeepStatus: "ready",
      tokenHolders: 45,
      nextDistribution: "2024-02-15",
    },
    {
      propertyId: "2",
      address: "456 Oak Avenue, LA",
      balance: "3,800",
      totalDistributed: "12,400",
      lastDistribution: "2024-01-10",
      upkeepStatus: "pending",
      tokenHolders: 32,
      nextDistribution: "2024-02-10",
    },
    {
      propertyId: "3",
      address: "789 Pine Road, Chicago",
      balance: "7,100",
      totalDistributed: "25,600",
      lastDistribution: "2024-01-20",
      upkeepStatus: "ready",
      tokenHolders: 67,
      nextDistribution: "2024-02-20",
    },
  ]);

  const stats = [
    {
      title: "Total Rent Pool",
      value: "$16,150",
      change: "+12.5%",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Properties Active",
      value: "3",
      change: "+1 this month",
      icon: Building2,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Distributed",
      value: "$56,750",
      change: "+8.2%",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Token Holders",
      value: "144",
      change: "+23 this month",
      icon: Users,
      color: "from-orange-500 to-red-500",
    },
  ];

  useEffect(() => {
    // Check if user is owner (mock implementation)
    setIsOwner(wallet.address === "0x1234567890123456789012345678901234567890");
  }, [wallet.address]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepositRent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isReady || !isOwner) return;

    setLoading(true);
    try {
      // Mock implementation - would call actual contract
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success(
        `Rent deposited successfully for Property #${formData.propertyId}`
      );
      setFormData({ propertyId: "", amount: "" });
    } catch (error) {
      console.error("Failed to deposit rent:", error);
      toast.error("Failed to deposit rent");
    } finally {
      setLoading(false);
    }
  };

  const filteredPools = rentPools.filter((pool) => {
    const matchesSearch =
      pool.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pool.propertyId.includes(searchTerm);
    const matchesFilter =
      filterStatus === "all" || pool.upkeepStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Rent Distribution
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage rental income distribution to token holders
          </p>
        </div>
        {isOwner && (
          <div className="mt-4 md:mt-0 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg px-4 py-2">
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              Owner Access Enabled
            </span>
          </div>
        )}
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
                <p className="text-sm text-green-500 mt-1">{stat.change}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Deposit Rent Form (Owner Only) */}
      {isOwner && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Deposit Rent
          </h3>

          <form onSubmit={handleDepositRent} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Property ID *
                </label>
                <input
                  type="number"
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter property ID"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount (USDC) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-400">
                    Important Notes
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                    <li>
                      • Ensure you have approved MockUSDC for the
                      RentDistributionVault contract
                    </li>
                    <li>
                      • Rent will be distributed proportionally to all token
                      holders
                    </li>
                    <li>
                      • Distribution occurs automatically via Chainlink
                      Automation
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Approve USDC
              </button>
              <button
                type="submit"
                disabled={loading || !formData.propertyId || !formData.amount}
                className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
              >
                {loading ? "Depositing..." : "Deposit Rent"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Non-Owner Message */}
      {!isOwner && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-800 dark:text-yellow-400">
                Owner Access Required
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Only the contract owner can deposit rent. You can view rent pool
                status below.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by property ID or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="ready">Ready for Distribution</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Rent Pool Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Rent Pool Status
          </h3>
          <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors">
            Refresh Data
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Property
                </th>
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pool Balance
                </th>
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Distributed
                </th>
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Token Holders
                </th>
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Next Distribution
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPools.map((pool, index) => (
                <motion.tr
                  key={pool.propertyId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Property #{pool.propertyId}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {pool.address}
                      </p>
                    </div>
                  </td>
                  <td className="py-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${pool.balance}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Available
                      </p>
                    </div>
                  </td>
                  <td className="py-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${pool.totalDistributed}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        All time
                      </p>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {pool.tokenHolders}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${
                        pool.upkeepStatus === "ready"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }`}
                    >
                      {pool.upkeepStatus === "ready" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      <span>
                        {pool.upkeepStatus === "ready" ? "Ready" : "Pending"}
                      </span>
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {pool.nextDistribution}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPools.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No rent pools found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No properties have rent pools set up yet"}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RentDistribution;

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Settings,
  Eye,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";

const ProofOfReserves: React.FC = () => {
  const { wallet } = {
    wallet: {
      address: "0x1234567890123456789012345678901234567890",
    },
  };

  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [checkForm, setCheckForm] = useState({ propertyId: "" });
  const [feedForm, setFeedForm] = useState({ propertyId: "", feedAddress: "" });
  const [reserveStatus, setReserveStatus] = useState<{
    propertyId: string;
    status: "valid" | "invalid" | "unknown";
    lastChecked: string;
    details?: string;
  } | null>(null);

  // Mock data for reserve feeds
  const [reserveFeeds] = useState([
    {
      propertyId: "1",
      address: "123 Main Street, NYC",
      feedAddress: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
      status: "valid",
      lastUpdate: "2024-01-20 14:30:00",
      reserveValue: "$250,000",
      confidence: 98.5,
    },
    {
      propertyId: "2",
      address: "456 Oak Avenue, LA",
      feedAddress: "0x9B864858B2f54C9E8F37564B9AF631f1A8B630f",
      status: "valid",
      lastUpdate: "2024-01-19 16:45:00",
      reserveValue: "$180,000",
      confidence: 96.2,
    },
    {
      propertyId: "3",
      address: "789 Pine Road, Chicago",
      feedAddress: "0xAC975859C3g65D0F9G48575C0BG742g2B9C741g",
      status: "invalid",
      lastUpdate: "2024-01-18 09:15:00",
      reserveValue: "N/A",
      confidence: 0,
    },
  ]);

  const stats = [
    {
      title: "Total Properties",
      value: "3",
      subtitle: "Under monitoring",
      icon: Shield,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Valid Reserves",
      value: "2",
      subtitle: "66.7% coverage",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Total Reserve Value",
      value: "$430,000",
      subtitle: "Verified assets",
      icon: Eye,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Avg Confidence",
      value: "97.4%",
      subtitle: "Data reliability",
      icon: AlertTriangle,
      color: "from-orange-500 to-red-500",
    },
  ];

  React.useEffect(() => {
    // Check if user is owner (mock implementation)
    setIsOwner(wallet.address === "0x1234567890123456789012345678901234567890");
  }, [wallet.address]);

  const handleCheckReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkForm.propertyId) return;

    setLoading(true);
    try {
      // Mock implementation - would call actual contract
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockResult = {
        propertyId: checkForm.propertyId,
        status:
          Math.random() > 0.3 ? "valid" : ("invalid" as "valid" | "invalid"),
        lastChecked: new Date().toLocaleString(),
        details:
          Math.random() > 0.3
            ? "Reserve verification successful"
            : "Reserve verification failed - insufficient backing",
      };

      setReserveStatus(mockResult);
      toast.success(
        `Reserve status checked for Property #${checkForm.propertyId}`
      );
    } catch (error) {
      console.error("Failed to check reserve status:", error);
      toast.error("Failed to check reserve status");
    } finally {
      setLoading(false);
    }
  };

  const handleSetFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner || !feedForm.propertyId || !feedForm.feedAddress) return;

    setLoading(true);
    try {
      // Mock implementation - would call actual contract
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success(`PoR feed updated for Property #${feedForm.propertyId}`);
      setFeedForm({ propertyId: "", feedAddress: "" });
    } catch (error) {
      console.error("Failed to set PoR feed:", error);
      toast.error("Failed to set PoR feed");
    } finally {
      setLoading(false);
    }
  };

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
            Proof of Reserves
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Verify asset backing and reserve status for tokenized properties
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-2">
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              System Operational
            </span>
          </div>
        </div>
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
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {stat.subtitle}
                </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Check Reserve Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Check Reserve Status</span>
          </h3>

          <form onSubmit={handleCheckReserve} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Property ID *
              </label>
              <input
                type="number"
                value={checkForm.propertyId}
                onChange={(e) => setCheckForm({ propertyId: e.target.value })}
                required
                placeholder="Enter property ID to verify"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !checkForm.propertyId}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>{loading ? "Checking..." : "Check Status"}</span>
            </button>
          </form>

          {/* Reserve Status Result */}
          {reserveStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg border ${
                reserveStatus.status === "valid"
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              }`}
            >
              <div className="flex items-center space-x-3">
                {reserveStatus.status === "valid" ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <h4
                    className={`font-medium ${
                      reserveStatus.status === "valid"
                        ? "text-green-800 dark:text-green-400"
                        : "text-red-800 dark:text-red-400"
                    }`}
                  >
                    Property #{reserveStatus.propertyId} -{" "}
                    {reserveStatus.status === "valid" ? "Valid" : "Invalid"}{" "}
                    Reserve
                  </h4>
                  <p
                    className={`text-sm mt-1 ${
                      reserveStatus.status === "valid"
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    {reserveStatus.details}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Last checked: {reserveStatus.lastChecked}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Set PoR Feed (Owner Only) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Set PoR Feed</span>
            {!isOwner && (
              <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 px-2 py-1 rounded-full">
                Owner Only
              </span>
            )}
          </h3>

          {isOwner ? (
            <form onSubmit={handleSetFeed} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Property ID *
                </label>
                <input
                  type="number"
                  value={feedForm.propertyId}
                  onChange={(e) =>
                    setFeedForm((prev) => ({
                      ...prev,
                      propertyId: e.target.value,
                    }))
                  }
                  required
                  placeholder="Enter property ID"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Feed Address *
                </label>
                <input
                  type="text"
                  value={feedForm.feedAddress}
                  onChange={(e) =>
                    setFeedForm((prev) => ({
                      ...prev,
                      feedAddress: e.target.value,
                    }))
                  }
                  required
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none font-mono text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={
                  loading || !feedForm.propertyId || !feedForm.feedAddress
                }
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>{loading ? "Setting..." : "Set Feed"}</span>
              </button>
            </form>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-400">
                    Owner Access Required
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Only the contract owner can set PoR feed addresses for
                    properties.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Reserve Feeds Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Reserve Feed Status
          </h3>
          <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
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
                  Feed Address
                </th>
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Reserve Value
                </th>
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Confidence
                </th>
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Last Update
                </th>
                <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {reserveFeeds.map((feed, index) => (
                <motion.tr
                  key={feed.propertyId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Property #{feed.propertyId}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {feed.address}
                      </p>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">
                        {feed.feedAddress.slice(0, 10)}...
                        {feed.feedAddress.slice(-8)}
                      </code>
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${
                        feed.status === "valid"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      }`}
                    >
                      {feed.status === "valid" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      <span>
                        {feed.status === "valid" ? "Valid" : "Invalid"}
                      </span>
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {feed.reserveValue}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            feed.confidence > 95
                              ? "bg-green-500"
                              : feed.confidence > 80
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${feed.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {feed.confidence}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {feed.lastUpdate}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
                        Verify
                      </button>
                      {isOwner && (
                        <button className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium">
                          Update
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ProofOfReserves;

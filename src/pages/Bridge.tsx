import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowDown,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Zap,
} from "lucide-react";

const Bridge: React.FC = () => {
  const { lockAndSend, transfers, loading } = {
    lockAndSend: (
      recipient: string,
      propertyId: number,
      amount: string,
      toChain: string
    ) => {
      console.log(
        "Locking and sending",
        recipient,
        propertyId,
        amount,
        toChain
      );
    },
    transfers: [
      {
        id: 1,
        recipient: "0x1234...5678",
        propertyId: 1,
        amount: "1000000000000000000",
        status: "confirmed",
        timestamp: new Date(),
        destinationChain: "mumbai",
        txHash: "0x1234...5678",
      },
    ],
    loading: false,
  };
  const { properties, fetchUserProperties } = {
    properties: [
      { id: 1, propertyAddress: "0x1234...5678" },
      { id: 2, propertyAddress: "0xabcd...efgh" },
    ],
    fetchUserProperties: () => {},
  };

  const [fromChain, setFromChain] = useState("sepolia");
  const [toChain, setToChain] = useState("mumbai");
  const [formData, setFormData] = useState({
    recipient: "",
    propertyId: "",
    amount: "",
  });

  const chains = [
    {
      id: "sepolia",
      name: "Sepolia Testnet",
      symbol: "ETH",
      color: "from-blue-500 to-blue-600",
      explorer: "https://sepolia.etherscan.io",
    },
    {
      id: "mumbai",
      name: "Mumbai Testnet",
      symbol: "MATIC",
      color: "from-purple-500 to-purple-600",
      explorer: "https://mumbai.polygonscan.com",
    },
  ];

  const stats = [
    {
      title: "Total Transfers",
      value: transfers.length.toString(),
      change: "+3 this week",
      icon: ArrowLeftRight,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Successful Transfers",
      value: transfers
        .filter((t) => t.status === "confirmed")
        .length.toString(),
      change: "98.5% success rate",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Pending Transfers",
      value: transfers.filter((t) => t.status === "pending").length.toString(),
      change: "Avg 15 min",
      icon: Clock,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Volume Transferred",
      value: "$125,000",
      change: "+24% this month",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
    },
  ];

  useEffect(() => {
    fetchUserProperties();
  }, [fetchUserProperties]);

  const handleSwapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await lockAndSend(
        formData.recipient,
        parseInt(formData.propertyId),
        formData.amount,
        toChain
      );
      setFormData({ recipient: "", propertyId: "", amount: "" });
    } catch (error) {
      console.error("Failed to initiate transfer:", error);
    }
  };

  const getChainInfo = (chainId: string) => {
    return chains.find((chain) => chain.id === chainId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
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
            Cross-Chain Bridge
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Transfer property tokens securely between different blockchains
          </p>
        </div>
        <div className="mt-4 md:mt-0 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-2">
          <span className="text-sm font-medium text-green-700 dark:text-green-300">
            CCIP Powered
          </span>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bridge Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Transfer Property Tokens
          </h2>

          <form onSubmit={handleTransfer} className="space-y-6">
            {/* From Chain */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                From
              </label>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <select
                    value={fromChain}
                    onChange={(e) => setFromChain(e.target.value)}
                    className="bg-transparent text-lg font-semibold text-gray-900 dark:text-white outline-none"
                  >
                    {chains.map((chain) => (
                      <option
                        key={chain.id}
                        value={chain.id}
                        className="bg-gray-50 dark:bg-gray-700"
                      >
                        {chain.name}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Balance: 2.45 {getChainInfo(fromChain)?.symbol}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Property
                    </label>
                    <select
                      name="propertyId"
                      value={formData.propertyId}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="">Select Property</option>
                      {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                          Property #{property.id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0.0"
                      step="0.01"
                      min="0"
                      required
                      className="w-full bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSwapChains}
                className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
              >
                <ArrowDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* To Chain */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                To
              </label>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <select
                    value={toChain}
                    onChange={(e) => setToChain(e.target.value)}
                    className="bg-transparent text-lg font-semibold text-gray-900 dark:text-white outline-none"
                  >
                    {chains
                      .filter((chain) => chain.id !== fromChain)
                      .map((chain) => (
                        <option
                          key={chain.id}
                          value={chain.id}
                          className="bg-gray-50 dark:bg-gray-700"
                        >
                          {chain.name}
                        </option>
                      ))}
                  </select>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Balance: 1.23 {getChainInfo(toChain)?.symbol}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleInputChange}
                    placeholder="0x..."
                    required
                    className="w-full bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Bridge Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Estimated time:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ~15 minutes
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Bridge fee:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  0.001 ETH
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  You will receive:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formData.amount || "0.0"} tokens
                </span>
              </div>
            </div>

            {/* Transfer Button */}
            <button
              type="submit"
              disabled={
                loading ||
                !formData.recipient ||
                !formData.propertyId ||
                !formData.amount
              }
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowLeftRight className="w-5 h-5" />
              )}
              <span>{loading ? "Transferring..." : "Transfer"}</span>
            </button>
          </form>
        </motion.div>

        {/* Transfer History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Transfers
            </h3>
            <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {transfers.length === 0 ? (
              <div className="text-center py-8">
                <ArrowLeftRight className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No transfers yet
                </p>
              </div>
            ) : (
              transfers.slice(0, 5).map((transfer) => (
                <div
                  key={transfer.id}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(transfer.status)}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {transfer.amount} tokens
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(transfer.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>{getChainInfo(fromChain)?.name}</span>
                    <ArrowLeftRight className="w-3 h-3" />
                    <span>{transfer.destinationChain}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
                      {transfer.txHash.slice(0, 10)}...
                      {transfer.txHash.slice(-8)}
                    </div>
                    <button className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center space-x-1">
                      <ExternalLink className="w-3 h-3" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {transfers.length > 5 && (
            <button className="w-full mt-4 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium py-2 transition-colors">
              View All Transfers
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Bridge;

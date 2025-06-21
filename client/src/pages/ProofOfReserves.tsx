import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Settings,
  ExternalLink,
  RefreshCw,
  Lock,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { usePoRVerifier } from "./../hooks/useProofOfReserves";

interface ReserveFeed {
  propertyId: string;
  address: string; // Physical property address (mocked)
  feedAddress: Address;
  status: "valid" | "invalid" | "unknown";
}

const ProofOfReserves: React.FC = () => {
  const { address: userAddress, isConnected } = useAccount();
  const { owner, propertyPoRFeed, setPropertyId, writeContract, writeStatus } =
    usePoRVerifier();

  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [checkForm, setCheckForm] = useState({ propertyId: "" });
  const [feedForm, setFeedForm] = useState({ propertyId: "", feedAddress: "" });
  const [ownerForm, setOwnerForm] = useState({ newOwner: "" });
  const [reserveStatus, setReserveStatus] = useState<{
    propertyId: string;
    status: "valid" | "invalid" | "unknown";
    lastChecked: string;
    details?: string;
  } | null>(null);
  const [reserveFeeds, setReserveFeeds] = useState<ReserveFeed[]>([]);

  // Mock physical addresses (replace with metadata from PropertyManager)
  const mockPropertyAddresses: { [key: string]: string } = {
    "1": "123 Main Street, NYC",
    "2": "456 Oak Avenue, LA",
    "3": "789 Pine Road, Chicago",
  };

  // Check if user is owner
  useEffect(() => {
    if (userAddress && owner.data) {
      setIsOwner(userAddress.toLowerCase() === owner.data.toLowerCase());
    }
  }, [userAddress, owner.data]);

  // Fetch reserve feeds
  const fetchReserveFeeds = useCallback(async () => {
    if (!isConnected) return;

    setLoading(true);
    try {
      // Assume property IDs 1-3 for demo; replace with PropertyManager
      const propertyIds = ["1", "2", "3"];
      const feeds: ReserveFeed[] = [];

      for (const id of propertyIds) {
        setPropertyId(BigInt(id));
        if (
          propertyPoRFeed.data &&
          propertyPoRFeed.data !== "0x0000000000000000000000000000000000000000"
        ) {
          // Check reserve status
          try {
            await writeContract("checkReserveStatus", [BigInt(id)]);
            const status = writeStatus.isSuccess ? "valid" : "invalid";

            feeds.push({
              propertyId: id,
              address: mockPropertyAddresses[id] || "Unknown",
              feedAddress: propertyPoRFeed.data,
              status,
            });
          } catch (error) {
            console.log(error);
            feeds.push({
              propertyId: id,
              address: mockPropertyAddresses[id] || "Unknown",
              feedAddress: propertyPoRFeed.data,
              status: "unknown",
            });
          }
        }
      }

      setReserveFeeds(feeds);
    } catch (error) {
      console.error("Failed to fetch reserve feeds:", error);
      toast.error("Failed to fetch reserve feeds");
    } finally {
      setLoading(false);
    }
  }, [
    isConnected,
    propertyPoRFeed.data,
    setPropertyId,
    writeContract,
    writeStatus.isSuccess,
  ]);

  useEffect(() => {
    fetchReserveFeeds();
  }, [fetchReserveFeeds]);

  // Handle check reserve status
  const handleCheckReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error("Please connect your wallet");
      return;
    }
    if (!checkForm.propertyId) {
      toast.error("Property ID is required");
      return;
    }

    setLoading(true);
    try {
      const propertyId = BigInt(checkForm.propertyId);
      await writeContract("checkReserveStatus", [propertyId]);
      const status = writeStatus.isSuccess ? "valid" : "invalid";

      const result = {
        propertyId: checkForm.propertyId,
        status,
        lastChecked: new Date().toLocaleString(),
        details:
          status === "valid"
            ? "Reserve verification successful"
            : "Reserve verification failed - insufficient backing",
      };

      setReserveStatus({
        propertyId: result.propertyId,
        status: result.status as "valid" | "invalid" | "unknown",
        lastChecked: result.lastChecked,
        details: result.details,
      });
      toast.success(
        `Reserve status checked for Property #${checkForm.propertyId}`
      );
    } catch (error: any) {
      console.error("Failed to check reserve status:", error);
      toast.error(error.message || "Failed to check reserve status");
      setReserveStatus({
        propertyId: checkForm.propertyId,
        status: "invalid",
        lastChecked: new Date().toLocaleString(),
        details: error.message || "Reserve verification failed",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle set PoR feed
  const handleSetFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error("Please connect your wallet");
      return;
    }
    if (!isOwner) {
      toast.error("Only the owner can set PoR feeds");
      return;
    }
    if (!feedForm.propertyId || !feedForm.feedAddress) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const propertyId = BigInt(feedForm.propertyId);
      const feedAddress = feedForm.feedAddress as Address;
      await writeContract("setPoRFeed", [propertyId, feedAddress]);
      toast.success(`PoR feed updated for Property #${feedForm.propertyId}`);
      setFeedForm({ propertyId: "", feedAddress: "" });
      await fetchReserveFeeds(); // Refresh feeds
    } catch (error: any) {
      console.error("Failed to set PoR feed:", error);
      toast.error(error.message || "Failed to set PoR feed");
    } finally {
      setLoading(false);
    }
  };

  // Handle pause operations
  const handlePauseOperations = async (propertyId: string) => {
    if (!isConnected) {
      toast.error("Please connect your wallet");
      return;
    }
    if (!isOwner) {
      toast.error("Only the owner can pause operations");
      return;
    }

    setLoading(true);
    try {
      await writeContract("pauseOperations", [BigInt(propertyId)]);
      toast.success(`Operations paused for Property #${propertyId}`);
      await fetchReserveFeeds(); // Refresh feeds
    } catch (error: any) {
      console.error("Failed to pause operations:", error);
      toast.error(error.message || "Failed to pause operations");
    } finally {
      setLoading(false);
    }
  };

  // Handle transfer ownership
  const handleTransferOwnership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error("Please connect your wallet");
      return;
    }
    if (!isOwner) {
      toast.error("Only the owner can transfer ownership");
      return;
    }
    if (!ownerForm.newOwner) {
      toast.error("New owner address is required");
      return;
    }

    setLoading(true);
    try {
      await writeContract("transferOwnership", [ownerForm.newOwner as Address]);
      toast.success("Ownership transferred successfully");
      setOwnerForm({ newOwner: "" });
    } catch (error: any) {
      console.error("Failed to transfer ownership:", error);
      toast.error(error.message || "Failed to transfer ownership");
    } finally {
      setLoading(false);
    }
  };

  // Handle renounce ownership
  const handleRenounceOwnership = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet");
      return;
    }
    if (!isOwner) {
      toast.error("Only the owner can renounce ownership");
      return;
    }

    setLoading(true);
    try {
      await writeContract("renounceOwnership", []);
      toast.success("Ownership renounced successfully");
    } catch (error: any) {
      console.error("Failed to renounce ownership:", error);
      toast.error(error.message || "Failed to renounce ownership");
    } finally {
      setLoading(false);
    }
  };

  // Stats for display
  const stats = [
    {
      title: "Total Properties",
      value: reserveFeeds.length.toString(),
      subtitle: "Under monitoring",
      icon: Shield,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Valid Reserves",
      value: reserveFeeds
        .filter((feed) => feed.status === "valid")
        .length.toString(),
      subtitle: `${(
        (reserveFeeds.filter((feed) => feed.status === "valid").length /
          (reserveFeeds.length || 1)) *
        100
      ).toFixed(1)}% coverage`,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
    },
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                disabled={loading || !isConnected}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !checkForm.propertyId || !isConnected}
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

        {/* Owner Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Owner Actions</span>
            {!isOwner && (
              <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 px-2 py-1 rounded-full">
                Owner Only
              </span>
            )}
          </h3>

          {isOwner ? (
            <div className="space-y-6">
              {/* Set PoR Feed */}
              <form onSubmit={handleSetFeed} className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  Set PoR Feed
                </h4>
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
                    disabled={loading}
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
                    disabled={loading}
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

              {/* Transfer Ownership */}
              <form onSubmit={handleTransferOwnership} className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  Transfer Ownership
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Owner Address *
                  </label>
                  <input
                    type="text"
                    value={ownerForm.newOwner}
                    onChange={(e) =>
                      setOwnerForm((prev) => ({
                        ...prev,
                        newOwner: e.target.value,
                      }))
                    }
                    required
                    placeholder="0x..."
                    disabled={loading}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none font-mono text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !ownerForm.newOwner}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {loading ? "Transferring..." : "Transfer Ownership"}
                  </span>
                </button>
              </form>

              {/* Renounce Ownership */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Renounce Ownership
                </h4>
                <button
                  onClick={handleRenounceOwnership}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {loading ? "Renouncing..." : "Renounce Ownership"}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-400">
                    Owner Access Required
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Only the contract owner can manage PoR feeds or ownership.
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
          <button
            onClick={fetchReserveFeeds}
            disabled={loading}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {reserveFeeds.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No reserve feeds found
                  </td>
                </tr>
              ) : (
                reserveFeeds.map((feed, index) => (
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
                        <a
                          href={`https://sepolia.etherscan.io/address/${feed.feedAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${
                          feed.status === "valid"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : feed.status === "invalid"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                        }`}
                      >
                        {feed.status === "valid" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : feed.status === "invalid" ? (
                          <XCircle className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        <span>
                          {feed.status === "valid"
                            ? "Valid"
                            : feed.status === "invalid"
                            ? "Invalid"
                            : "Unknown"}
                        </span>
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            setCheckForm({ propertyId: feed.propertyId })
                          }
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                        >
                          Verify
                        </button>
                        {isOwner && (
                          <>
                            <button
                              onClick={() =>
                                setFeedForm({
                                  propertyId: feed.propertyId,
                                  feedAddress: feed.feedAddress,
                                })
                              }
                              className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium"
                            >
                              Update
                            </button>
                            <button
                              onClick={() =>
                                handlePauseOperations(feed.propertyId)
                              }
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                            >
                              Pause
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ProofOfReserves;
